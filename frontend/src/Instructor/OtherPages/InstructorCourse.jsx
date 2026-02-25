import { useState, useEffect, useRef } from "react";
import { FiMoreVertical, FiEdit, FiTrash, FiArrowLeft } from "react-icons/fi";
import { FaPause, FaPlay, FaVolumeUp, FaExpand } from "react-icons/fa";

/* ===============================
   HELPERS
================================ */
const isYouTube = (url = "") =>
  url.includes("youtube.com") || url.includes("youtu.be");

const isDirectVideoFile = (url = "") =>
  /\.(mp4|webm|ogg)$/i.test(url);

/* ===============================
   COMPONENT
================================ */
export default function InstructorPanel() {

  const [courses, setCourses] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null);

  /* VIDEO STATES */
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const playerWrapperRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);



  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // ✅ Read more state
  const [expandedTitles, setExpandedTitles] = useState({});

  const initialForm = {
    title: "",
    instructor: "",
    videoUrl: "",
    thumbnail: "",
    status: "Draft",
  };

  const [form, setForm] = useState(initialForm);

  // ===============================
  // FETCH COURSES
  // =============================== 

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/instructor/courses");
      const data = await res.json();

      const savedProgress =
        JSON.parse(localStorage.getItem("courseProgress")) || [];

      const formatted = data.map((course, index) => ({
        ...course,
        progress: savedProgress[index]?.progress || 0,
      }));

      setCourses(formatted);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };


  // ===============================
  // CREATE COURSE
  // =============================== 

  const handleCreate = async () => {
    // Validate required fields
    if (!form.title || !form.instructor || !form.videoUrl) {
      alert("Please fill in all required fields (Title, Instructor, Video URL).");
      return;
    }

    // Ask for confirmation before creating
    const confirmed = window.confirm("Are you sure you want to create this course?");
    if (!confirmed) return;

    try {
      const res = await fetch("http://localhost:5000/api/instructor/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create course");
      }
      // Success alert
      alert("Course created successfully!");
      // Refresh list from DB
      fetchCourses();
      handleCloseCreateModal();
    } catch (err) {
      console.error(err);
      alert("Error creating course: " + err.message);
    }
  };
  const handleOpenCreateModal = () => {
    setForm(initialForm); // Reset form when opening
    setShowModal(true);
  };
  const handleCloseCreateModal = () => {
    setForm(initialForm); // Reset form when closing 
    setShowModal(false);
  };

  // ===============================
  // OPEN EDIT MODAL ✅ FIX
  // ===============================
  const handleOpenEditModal = (index) => {
    setEditIndex(index);
    setForm({
      title: courses[index].title,
      instructor: courses[index].instructor,
      videoUrl: courses[index].videoUrl,
      thumbnail: courses[index].thumbnail,
      status: courses[index].status,
    });
    setShowEditModal(true);
  };

  // ===============================
  // UPDATE COURSE
  // =============================== 
  const handleUpdate = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/instructor/courses/${courses[editIndex].id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) throw new Error("Update failed");
      alert("Course updated successfully!");

      fetchCourses(); // refresh list
      setShowEditModal(false);
      setEditIndex(null);
    } catch (err) {
      console.error(err);
    }
  };

  // ===============================
  // DELETE COURSE
  // =============================== 
  const handleDelete = async (index) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const courseId = courses[index].id;
      const res = await fetch(`http://localhost:5000/api/instructor/courses/${courseId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      alert("Course deleted successfully!");
      setCourses(courses.filter((_, i) => i !== index));
      setMenuIndex(null);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Helper function
  const truncateTitle = (title) => {
    const halfLength = Math.floor(title.length / 2);
    return title.slice(0, halfLength) + "...";
  };
  /* ===============================
       VIDEO CONTROLS (MP4 ONLY)
    =============================== */

  const showControlsTemporarily = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 1500);
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    video.paused ? video.play() : video.pause();
  };

  const handleVideoClick = () => {
    togglePlayPause();
  };

  const handleMouseMove = () => {
    showControlsTemporarily();
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.currentTime =
      (e.target.value / 100) * duration;
  };

  const formatTime = (t = 0) =>
    `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;


  const handleVolumeChange = (e) => {
    if (!videoRef.current) return;
    videoRef.current.volume = e.target.value;
    setVolume(e.target.value);
  };

  const handleFullscreen = () => {
    if (!playerWrapperRef.current) return;

    if (!document.fullscreenElement) {
      playerWrapperRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // ✅ VIDEO PROGRESS TRACKER
  const handleVideoProgress = (e) => {
    const video = e.target;
    if (!video.duration || activeIndex === null) return;

    const percentWatched = Math.floor(
      (video.currentTime / video.duration) * 100
    );

    setCourses((prev) => {
      const updated = prev.map((course, index) =>
        index === activeIndex
          ? { ...course, progress: percentWatched }
          : course
      );

      // ✅ SAVE TO LOCAL STORAGE
      localStorage.setItem("courseProgress", JSON.stringify(updated));
      return updated;
    });
  };


  return (
        <div className="min-h-screen bg-gray-100">
        <main className="p-6">
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-bold">My Courses</h2>
            <button
              onClick={handleOpenCreateModal}
              className="bg-[rgba(37,150,190,1)] hover:bg-[#115269] text-white px-5 py-2 rounded"
            >
              + Create New Course
            </button>
          </div>

          {/* COURSES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow overflow-hidden relative"
              >
                {/* THUMBNAIL */}
                <div
                  className="relative group cursor-pointer"
                  onClick={() => {
                    setActiveIndex(idx);
                    setShowVideo(true);
                  }}
                >
                  <img
                    src={course.thumbnail}
                    className="h-48 w-full object-cover"
                    alt="course"
                  />

                  {/* PLAY BUTTON */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <div className="bg-white rounded-full p-4 shadow">
                      <FaPlay className="ml-1 text-xl text-gray-500" />
                    </div>
                  </div>

                  {/* STATUS */}
                  <div className="absolute top-2 left-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${course.status === "Published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {course.status}
                    </span>
                  </div>

                  {/* OPTIONS */}
                  <div className="absolute top-2 right-2 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuIndex(menuIndex === idx ? null : idx);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-gray-500/70"
                    >
                      <FiMoreVertical />
                    </button>


                    {menuIndex === idx && (
                      <div className="absolute right-0 mt-2 bg-white shadow rounded w-32">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // 🔴 THIS LINE FIXES IT

                            handleOpenEditModal(idx);
                            setMenuIndex(null);
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 w-full"
                        >
                          <FiEdit /> Edit
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(idx);
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                        >
                          <FiTrash /> Delete
                        </button>

                      </div>
                    )}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <h3 className="font-semibold">
                    {expandedTitles[idx]
                      ? course.title
                      : course.title.length > 30
                        ? truncateTitle(course.title)
                        : course.title}

                    {course.title.length > 30 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedTitles((prev) => ({
                            ...prev,
                            [idx]: !prev[idx],
                          }));
                        }}
                        className="ml-2 text-sm text-black hover:underline"
                      >
                        {expandedTitles[idx] ? "" : "...Read more"}
                      </button>
                    )}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {course.instructor}
                  </p>

                  <div className="mt-4">
                    <div className="h-2 bg-gray-200 rounded">
                      <div
                        className="h-2 bg-[rgba(37,150,190,1)] rounded"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <p className="text-sm mt-2">
                      {course.progress}% complete
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>


      {/* CREATE COURSE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h3 className="font-semibold mb-4">Create Course</h3>

            {["title", "instructor", "videoUrl", "thumbnail"].map(
              (field) => (
                <input
                  key={field}
                  className="w-full border p-2 mb-3"
                  placeholder={field}
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                />
              )
            )}

            <select
              className="w-full border p-2 mb-4"
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="bg-[rgba(37,150,190,1)] text-white px-4 py-2 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h3 className="font-semibold mb-4">Edit Course</h3>

            {["title", "instructor", "videoUrl", "thumbnail"].map((field) => (
              <input
                key={field}
                className="w-full border p-2 mb-3"
                placeholder={field}
                value={form[field]}
                onChange={(e) =>
                  setForm({ ...form, [field]: e.target.value })
                }
              />
            ))}

            <select
              className="w-full border p-2 mb-4"
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-[rgba(37,150,190,1)] text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}


      {/* VIDEO MODAL */}
      {showVideo && activeIndex !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div
            ref={playerWrapperRef}
            className="relative bg-black p-4 rounded w-full max-w-4xl"
            onMouseMove={handleMouseMove}
          >
            {/* BACK BUTTON */}
            {showControls && (
              <button
                onClick={() => {
                  setShowVideo(false);
                  setShowControls(true);
                  setIsPlaying(false);
                }}
                className="absolute top-4 left-4 text-white text-2xl z-50"
              >
                <FiArrowLeft />
              </button>
            )}

            {/* ===============================
          YOUTUBE PLAYER
      =============================== */}
            {isYouTube(courses[activeIndex].videoUrl) && (
              <iframe
                className="w-full h-[450px] rounded"
                src={courses[activeIndex].videoUrl
                  .replace("watch?v=", "embed/")
                  .replace("youtu.be/", "youtube.com/embed/")}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}

            {/* ===============================
          HTML5 VIDEO PLAYER (MP4 ONLY)
      =============================== */}
            {isDirectVideoFile(courses[activeIndex].videoUrl) && (
              <div className="relative w-full" onClick={handleVideoClick}>
                <video
                  ref={videoRef}
                  src={courses[activeIndex].videoUrl}
                  autoPlay
                  muted
                  onLoadedMetadata={(e) => setDuration(e.target.duration)}
                  onTimeUpdate={(e) => {
                    setCurrentTime(e.target.currentTime);
                    handleVideoProgress(e);
                  }}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="w-full rounded"
                />

                {/* CENTER PLAY / PAUSE */}
                {showControls && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/60 p-5 rounded-full">
                      {isPlaying ? (
                        <FaPause className="text-white text-4xl" />
                      ) : (
                        <FaPlay className="text-white text-4xl ml-1" />
                      )}
                    </div>
                  </div>
                )}

                {/* BOTTOM CONTROLS */}
                {showControls && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-4 py-3 flex items-center gap-4 text-white z-50">
                    {/* PLAY / PAUSE */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlayPause();
                      }}
                    >
                      {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>

                    {/* PROGRESS BAR */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={(currentTime / duration) * 100 || 0}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSeek(e);
                      }}
                      className="flex-1 h-1 cursor-pointer"
                    />

                    {/* TIME */}
                    <span className="text-sm whitespace-nowrap">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>

                    {/* VOLUME */}
                    <FaVolumeUp />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleVolumeChange(e);
                      }}
                      className="w-20"
                    />

                    {/* FULLSCREEN */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFullscreen();
                      }}
                    >
                      <FaExpand />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}


    </div>
  );
}
/* ===============================
   REUSABLE MODAL COMPONENT
================================ */
function Modal({ title, form, setForm, onClose, onSubmit, btnText }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h3 className="font-semibold mb-4">{title}</h3>

        {["title", "instructor", "videoUrl", "thumbnail"].map((field) => (
          <input
            key={field}
            className="w-full border p-2 mb-3"
            placeholder={field}
            value={form[field]}
            onChange={(e) =>
              setForm({ ...form, [field]: e.target.value })
            }
          />
        ))}

        <select
          className="w-full border p-2 mb-4"
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
        >
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
        </select>

        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={onSubmit}
            className="bg-[rgba(37,150,190,1)] text-white px-4 py-2 rounded"
          >
            {btnText}
          </button>
        </div>
      </div>
    </div>
  );
}