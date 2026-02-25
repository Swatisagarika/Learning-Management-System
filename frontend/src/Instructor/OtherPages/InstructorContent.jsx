import React, { useEffect, useState, useRef } from "react";

const API_BASE = "http://localhost:5000/api/lessons";
const FILE_BASE = "http://localhost:5000";



const contentTypes = [
  "Video",
  "PDF/Doc/Slide",
  "External Link",

];

// ---------- HELPERS ----------
const getFileUrl = (file) => {
  if (!file) return null;
  return file.startsWith("http") ? file : `${FILE_BASE}${file}`;
};

const getFileName = (url) => url?.split("/").pop();

const getFileIcon = (type) => {
  if (type === "PDF/Doc/Slide") return "";
  if (type === "Video") return "";
  return "📁";
};

const LessonsManager = () => {
  const fileInputRef = useRef(null);
  const [lessons, setLessons] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [editLesson, setEditLesson] = useState(null);

  const [newLesson, setNewLesson] = useState({
    title: "",
    type: "PDF/Doc/Slide",
    file: null,
    externalLink: "",
    mandatory: false,
    allowDownload: true,
    status: "Draft",

  });

  /* ================= FETCH LESSONS ================= */
  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const res = await fetch(API_BASE);
      const result = await res.json();

      const normalized = Array.isArray(result)
        ? result.map((l) => ({
          ...l,
          id: l.id || l._id,
          mandatory: Boolean(Number(l.mandatory)),      // ✅ FIX
          allowDownload: Boolean(Number(l.allowDownload))
        }))
        : [];

      setLessons(normalized);
    } catch (err) {
      console.error("Error fetching lessons", err);
      setLessons([]);
    }
  };


  /* ---------------- Handlers ---------------- */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewLesson((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setNewLesson((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
  };

  /* ================= ADD LESSON ================= */
  const addLesson = async () => {
    if (!newLesson.title.trim()) {
      alert("Lesson title is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", newLesson.title);
    formData.append("type", newLesson.type);
    formData.append("status", newLesson.status);
    formData.append("mandatory", String(newLesson.mandatory));
    formData.append("allowDownload", String(newLesson.allowDownload));
    formData.append("externalLink", newLesson.externalLink || "");
    formData.append("instructions", newLesson.instructions);
    formData.append("dueDate", newLesson.dueDate);
    formData.append("totalMarks", newLesson.totalMarks);
    formData.append("submissionType", newLesson.submissionType);


    if (newLesson.file instanceof File) {
      formData.append("file", newLesson.file);
    }

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        body: formData,
      });

      const saved = await res.json();

      setLessons((prev) => [
        ...prev,
        {
          ...saved,
          mandatory: Boolean(Number(saved.mandatory)),   // ✅ FIX
          allowDownload: Boolean(Number(saved.allowDownload)),
        },
      ]);

      setNewLesson({
        title: "",
        type: "PDF/Doc/Slide",
        file: null,
        externalLink: "",
        mandatory: false,
        allowDownload: true,
        status: "Draft",
      });
      // ✅ clear file input UI
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }


    } catch (err) {
      console.error("Add lesson error", err);
    }
  };

  /* ================= DELETE LESSON ================= */
  const deleteLesson = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;

    try {
      await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
      });

      setLessons((prev) => prev.filter((lesson) => lesson.id !== id));
      setMenuOpenId(null);
    } catch (err) {
      console.error("Error deleting lesson", err);
    }
  };

  /* ================= UPDATE LESSON ================= */
  const updateLesson = async () => {
    if (!editLesson.title.trim()) {
      alert("Lesson title is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", editLesson.title);
    formData.append("type", editLesson.type);
    formData.append("status", editLesson.status);
    formData.append("mandatory", String(editLesson.mandatory));
    formData.append("allowDownload", String(editLesson.allowDownload));
    formData.append("externalLink", editLesson.externalLink || "");
    formData.append("instructions", editLesson.instructions || "");
    formData.append("dueDate", editLesson.dueDate || "");
    formData.append("totalMarks", editLesson.totalMarks || "");
    formData.append("submissionType", editLesson.submissionType || "File");

    if (editLesson.file instanceof File) {
      formData.append("file", editLesson.file);
    }

    try {
      const res = await fetch(`${API_BASE}/${editLesson.id}`, {
        method: "PUT",
        body: formData,
      });

      const updated = await res.json();

      setLessons((prev) =>
        prev.map((l) =>
          l.id === editLesson.id
            ? {
              ...l,
              ...updated,
              mandatory: Boolean(Number(updated.mandatory)), // ✅ FIX
              allowDownload: Boolean(Number(updated.allowDownload)),
              file: updated.file ?? l.file,
            }
            : l
        )
      );

      setEditLesson(null);
    } catch (err) {
      console.error("Update error", err);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100">

        <main className="p-6 max-w-6xl mx-auto w-full">
          <h1 className="text-2xl font-bold mb-6">
            Lessons & Content Management
          </h1>

          {/* Add Lesson */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Add New Lesson</h2>

            <input
              type="text"
              name="title"
              placeholder="Lesson Title"
              value={newLesson.title}
              onChange={handleInputChange}
              className="border p-2 w-full mb-3 rounded"
            />

            <select
              name="type"
              value={newLesson.type}
              onChange={handleInputChange}
              className="border p-2 w-full mb-3 rounded"
            >
              {contentTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>

            {newLesson.type === "External Link" ? (
              <input
                type="url"
                name="externalLink"
                value={newLesson.externalLink}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="border p-2 w-full mb-3 rounded"
              />
            ) : (
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="mb-3"
              />

            )}

            <select
              name="status"
              value={newLesson.status}
              onChange={handleInputChange}
              className="border p-2 w-full mb-3 rounded"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>

            <div className="flex gap-6 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="mandatory"
                  checked={newLesson.mandatory}
                  onChange={handleInputChange}
                />
                Mandatory
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="allowDownload"
                  checked={newLesson.allowDownload}
                  onChange={handleInputChange}
                />
                Allow Download
              </label>
            </div>

            <button
              onClick={addLesson}
              className="bg-[rgba(37,150,190,1)] text-white px-6 py-2 rounded hover:bg-[#115269]"
            >
              Add Lesson
            </button>
          </div>

          {/* Lesson List */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Lesson List</h2>

            {lessons.length === 0 && <p>No lessons added.</p>}

            {lessons.map((lesson, index) => (
              <div key={lesson.id || index}

                className="border p-4 mb-3 rounded-lg flex justify-between"
              >
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    {lesson.title}
                    {lesson.mandatory && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                        Mandatory
                      </span>
                    )}
                  </h3>

                  <p>Type: {lesson.type}</p>

                  {lesson.type === "External Link" ? (
                    <a
                      href={lesson.externalLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[rgba(37,150,190,1)] underline"
                    >
                      {lesson.externalLink}
                    </a>
                  ) : lesson.file && lesson.allowDownload ? (
                    <a
                      href={getFileUrl(lesson.file)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[rgba(37,150,190,1)] underline flex items-center gap-2"
                    >
                      <span>{getFileIcon(lesson.type)}</span>
                      <span>{getFileName(lesson.file)}</span>
                    </a>
                  ) : null}


                  <p>
                    Status:{" "}
                    <span
                      className={`font-semibold ${lesson.status === "Published"
                        ? "text-green-600"
                        : "text-orange-600"
                        }`}
                    >
                      {lesson.status}
                    </span>
                  </p>
                </div>

                <div className="relative">
                  <button
                    onClick={() =>
                      setMenuOpenId(
                        menuOpenId === lesson.id ? null : lesson.id
                      )
                    }
                    className="text-xl font-bold"
                  >
                    ⋮
                  </button>

                  {menuOpenId === lesson.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow">
                      <button
                        onClick={() => {
                          setEditLesson({ ...lesson });
                          setMenuOpenId(null);
                        }}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteLesson(lesson.id)}
                        className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>

      {/* Edit Modal */}
      {editLesson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative animate-fadeIn">

            {/* Close Button */}
            <button
              onClick={() => setEditLesson(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors text-2xl font-bold"
            >
              ✕
            </button>

            {/* Modal Header */}
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">Edit Lesson</h3>

            {/* Lesson Title */}
            <div className="mb-4">
              <label className="block text-gray-600 mb-1">Lesson Title</label>
              <input
                type="text"
                value={editLesson.title}
                onChange={(e) =>
                  setEditLesson({ ...editLesson, title: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[rgba(37,150,190,1)]"
              />
            </div>

            {/* File / External Link */}
            <div className="mb-4">
              <label className="block text-gray-600 mb-1">Lesson File / Link</label>
              {editLesson.type === "External Link" ? (
                <input
                  type="url"
                  value={editLesson.externalLink}
                  onChange={(e) =>
                    setEditLesson({ ...editLesson, externalLink: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[rgba(37,150,190,1)]"
                />
              ) : (
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    id="editFileInput"
                    onChange={(e) =>
                      setEditLesson({ ...editLesson, file: e.target.files[0] })
                    }
                    className="hidden"
                  />
                  <label
                    htmlFor="editFileInput"
                    className="flex-1 cursor-pointer border border-gray-300 rounded-lg p-3 flex justify-between items-center hover:border-[#115269] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      {/* File Icon */}
                      <span className="text-xl">
                        {editLesson.file
                          ? editLesson.file.name?.endsWith(".pdf")
                            ? ""
                            : editLesson.file.name?.match(/\.(mp4|mov|avi)$/)
                              ? ""
                              : ""
                          : ""}
                      </span>
                      {/* File Name */}
                      {editLesson.file
                        ? typeof editLesson.file === "string"
                          ? getFileName(editLesson.file)
                          : editLesson.file.name
                        : "No file selected"}
                    </span>
                    <span className="text-[rgba(37,150,190,1)] underline">Choose File</span>
                  </label>
                </div>
              )}
            </div>

            {/* Status & Mandatory */}
            <div className="flex gap-6 mb-6">
              <div className="flex-1">
                <label className="block text-gray-600 mb-1">Status</label>
                <select
                  value={editLesson.status}
                  onChange={(e) =>
                    setEditLesson({ ...editLesson, status: e.target.value })
                  }
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[rgba(37,150,190,1)]"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>

              <div className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  checked={editLesson.mandatory}
                  onChange={(e) =>
                    setEditLesson({ ...editLesson, mandatory: e.target.checked })
                  }
                  className="w-5 h-5 accent-[rgba(37,150,190,1)]"
                />
                <span className="text-gray-600 font-medium">Mandatory</span>
              </div>
            </div>

            

            {/* Save Button */}
            <button
              onClick={updateLesson}
              className="w-full bg-[rgba(37,150,190,1)] hover:bg-[#115269] text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default LessonsManager;
