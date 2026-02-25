import { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaVolumeUp, FaExpand } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";

/* ===============================
   HELPERS
================================ */
const isYouTube = (url = "") =>
  url.includes("youtube.com") || url.includes("youtu.be");

const isDirectVideoFile = (url = "") =>
  /\.(mp4|webm|ogg)$/i.test(url);

/* ---------- STAR RATING ---------- */
function StarRating({ value, onRate }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRate(star)}
          className={`text-lg ${star <= value ? "text-orange-500" : "text-gray-300"
            }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

/* ---------- YOUTUBE PLAYER COMPONENT ---------- */
function YouTubePlayer({ url, onProgress }) {
  const playerRef = useRef(null);
  const ytPlayer = useRef(null);
  const intervalRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const controlsTimeoutRef = useRef(null);

  const togglePlayPause = () => {
    if (!ytPlayer.current) return;
    const state = ytPlayer.current.getPlayerState();
    if (state === window.YT.PlayerState.PLAYING) ytPlayer.current.pauseVideo();
    else ytPlayer.current.playVideo();
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 1500);
  };

  const handleVolumeChange = (e) => {
    const val = e.target.value;
    setVolume(val);
    ytPlayer.current?.setVolume(val);
  };

  const handleSeek = (e) => {
    if (!ytPlayer.current || !duration) return;
    const newTime = (Number(e.target.value) / 100) * duration;
    ytPlayer.current.seekTo(newTime, true);
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const startProgressTracking = () => {
    stopProgressTracking();
    intervalRef.current = setInterval(() => {
      if (!ytPlayer.current) return;
      const cTime = ytPlayer.current.getCurrentTime();
      const dur = ytPlayer.current.getDuration();
      if (!dur) return;
      setCurrentTime(cTime);
      setDuration(dur);
      const percent = Math.floor((cTime / dur) * 100);
      onProgress(percent);

    }, 1000);
  };

  const stopProgressTracking = () => clearInterval(intervalRef.current);

  useEffect(() => {
    if (!url) return;

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    const interval = setInterval(() => {
      if (window.YT && window.YT.Player && !ytPlayer.current) {
        clearInterval(interval);

        // Extract videoId safely
        let videoId;
        if (url.includes("youtu.be")) videoId = url.split("/").pop().split("?")[0];
        else videoId = new URL(url).searchParams.get("v");

        ytPlayer.current = new window.YT.Player(playerRef.current, {
          videoId,
          playerVars: { controls: 0, modestbranding: 1 },
          events: {
            onReady: () => {
              ytPlayer.current.setVolume(volume);
              setDuration(ytPlayer.current.getDuration());
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                startProgressTracking();
              } else {
                setIsPlaying(false);
                stopProgressTracking();
              }
            },
          },
        });
      }
    }, 200);

    return () => stopProgressTracking();
  }, [url]);

  return (
    <div className="relative w-full h-[450px] rounded bg-black" onMouseMove={showControlsTemporarily}>
      <div ref={playerRef} className="w-full h-full"></div>

      {showControls && (
        <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={togglePlayPause}>
          <div className="bg-black/60 p-5 rounded-full">
            {isPlaying ? <FaPause className="text-white text-4xl" /> : <FaPlay className="text-white text-4xl ml-1" />}
          </div>
        </div>
      )}

      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-4 py-3 flex items-center gap-4 text-white">
          <button onClick={togglePlayPause}>{isPlaying ? <FaPause /> : <FaPlay />}</button>
          <input type="range" min="0" max="100" value={(currentTime / duration) * 100 || 0} onChange={handleSeek} className="flex-1 h-1 cursor-pointer" />
          <span className="text-sm whitespace-nowrap">{formatTime(currentTime)} / {formatTime(duration)}</span>
          <FaVolumeUp />
          <input type="range" min="0" max="100" step="1" value={volume} onChange={handleVolumeChange} className="w-20" />
        </div>
      )}
    </div>
  );
}

/* ---------- MAIN COMPONENT ---------- */
export default function StudentMyCourses({ user }) {
  const userId = user?.id || 1;
  const [courses, setCourses] = useState([]);
  const [showVideo, setShowVideo] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [expandedTitles, setExpandedTitles] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const playerWrapperRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const fetchPublishedCourses = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/instructor/courses");
    const data = await res.json();

    const published = await Promise.all(
      data
        .filter((course) => course.status === "Published")
        .map(async (course) => {
          try {
            const attRes = await fetch(
              `http://localhost:5000/api/attendance/${course.id}/${userId}`
            );

            const attData = await attRes.json();

            return {
              ...course,
              progress: attData?.attendance || 0,
              rating: attData?.rating || 0,
            };
          } catch {
            return { ...course, progress: 0, rating: 0 };
          }
        })
    );

    setCourses(published);
  } catch (err) {
    console.error("Failed to fetch courses:", err);
  }
};



  useEffect(() => {
  fetchPublishedCourses();
}, [userId]);


  const truncateTitle = (title) => {
    const half = Math.floor(title.length / 2);
    return title.slice(0, half) + "...";
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    video.paused ? video.play() : video.pause();
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 1500);
  };

  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = (e.target.value / 100) * duration;
  };

  const handleVolumeChange = (e) => {
    videoRef.current.volume = e.target.value;
    setVolume(e.target.value);
  };

  const handleFullscreen = () => {
    if (!playerWrapperRef.current) return;
    document.fullscreenElement
      ? document.exitFullscreen()
      : playerWrapperRef.current.requestFullscreen();
  };

  const handleVideoProgress = (e) => {
    const video = e.target;
    if (!video.duration || activeIndex === null) return;

    const percent = Math.floor(
      (video.currentTime / video.duration) * 100
    );

    setCourses((prev) => {
      const updated = prev.map((c, i) =>
        i === activeIndex ? { ...c, progress: percent } : c
      );

      saveAttendanceToDB(
        updated[activeIndex].id,
        percent,
        updated[activeIndex].rating
      );

      return updated;
    });
  };


  const handleRating = (id, rating) => {
    setCourses((prev) => {
      const updated = prev.map((c) =>
        c.id === id ? { ...c, rating } : c
      );

      const course = updated.find((c) => c.id === id);

      saveAttendanceToDB(id, course.progress, rating);

      return updated;
    });
  };


  const saveAttendanceToDB = async (courseId, progress, rating = 0) => {
    try {
      await fetch("http://localhost:5000/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: userId,
          course_id: courseId,
          attendance: progress,
          rating: rating,
        }),
      });
    } catch (error) {
      console.error("Save attendance error:", error);
    }
  };


  return (
    <div className="flex min-h-screen bg-gray-100">
        <main className="p-6">
          <h2 className="text-2xl font-bold mb-6">My Lessons</h2>

          {/* COURSES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, idx) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow overflow-hidden"
              >
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
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <div className="bg-white rounded-full p-4 shadow">
                      <FaPlay className="ml-1 text-xl text-gray-500" />
                    </div>
                  </div>
                </div>

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

                  <p className="text-sm text-gray-500">{course.instructor}</p>

                  <div className="mt-4">
                    <div className="h-2 bg-gray-200 rounded">
                      <div
                        className="h-2 bg-[rgba(37,150,190,1)] rounded"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <p className="text-sm mt-2">{course.progress}% complete</p>
                  </div>

                  <div className="mt-3">
                    {course.rating === 0 ? (
                      <>
                        <p className="text-sm text-[rgba(37,150,190,1)] font-semibold">
                          Leave a rating
                        </p>
                        <StarRating
                          value={0}
                          onRate={(r) => handleRating(course.id, r)}
                        />
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <StarRating
                          value={course.rating}
                          onRate={(r) => handleRating(course.id, r)}
                        />
                        <span className="text-sm text-gray-600">Your rating</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

      {/* VIDEO MODAL */}
      {showVideo && activeIndex !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div
            ref={playerWrapperRef}
            className="relative bg-black p-4 rounded w-full max-w-4xl"
            onMouseMove={
              isDirectVideoFile(courses[activeIndex].videoUrl)
                ? showControlsTemporarily
                : undefined
            }
          >
            <button
              onClick={() => {
                setShowVideo(false);
                setShowControls(true);
                setIsPlaying(false);
                videoRef.current?.pause();
              }}
              className="absolute top-4 left-4 text-white text-2xl z-50"
            >
              <FiArrowLeft />
            </button>

            {/* YOUTUBE */}
            {isYouTube(courses[activeIndex].videoUrl) && (
              <YouTubePlayer
                url={courses[activeIndex].videoUrl}
                onProgress={(percent) => {

                  setCourses((prev) =>
                    prev.map((c, i) =>
                      i === activeIndex ? { ...c, progress: percent } : c
                    )
                  );

                  saveAttendanceToDB(
                    courses[activeIndex].id,
                    percent,
                    courses[activeIndex].rating
                  );
                }}
              />

            )}

            {/* MP4 VIDEO */}
            {isDirectVideoFile(courses[activeIndex].videoUrl) && (
              <>
                <video
                  ref={videoRef}
                  src={courses[activeIndex].videoUrl}
                  autoPlay
                  onLoadedMetadata={(e) => setDuration(e.target.duration)}
                  onTimeUpdate={(e) => {
                    setCurrentTime(e.target.currentTime);
                    handleVideoProgress(e);
                  }}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="w-full rounded"
                />

                {showControls && (
                  <div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    onClick={togglePlayPause}
                  >
                    <div className="bg-black/60 p-5 rounded-full">
                      {isPlaying ? (
                        <FaPause className="text-white text-4xl" />
                      ) : (
                        <FaPlay className="text-white text-4xl ml-1" />
                      )}
                    </div>
                  </div>
                )}

                {showControls && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-4 py-3 flex items-center gap-4 text-white">
                    <button onClick={togglePlayPause}>
                      {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={(currentTime / duration) * 100 || 0}
                      onChange={handleSeek}
                      className="flex-1 h-1 cursor-pointer"
                    />
                    <span className="text-sm whitespace-nowrap">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                    <FaVolumeUp />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-20"
                    />
                    <button onClick={handleFullscreen}>
                      <FaExpand />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
