import React, { useEffect, useState } from "react";
import { FaFilePdf, FaVideo, FaExternalLinkAlt } from "react-icons/fa";

const API_BASE = "http://localhost:5000/api/lessons";
const FILE_BASE = "http://localhost:5000";

/* ---------- HELPERS ---------- */
const getFileUrl = (file) =>
  file?.startsWith("http") ? file : `${FILE_BASE}${file}`;

const getFileName = (url) => url?.split("/").pop();

const isPDF = (file) => /\.pdf$/i.test(file);
const isVideo = (file) => /\.(mp4|webm|ogg)$/i.test(file);

const StudentLessons = () => {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();

      const normalized = data.map((l) => ({
        ...l,
        id: l.id || l._id,
        mandatory: Boolean(Number(l.mandatory)),
      }));

      setLessons(normalized);
    } catch (err) {
      console.error("Error fetching lessons", err);
    }
  };

  // ✅ Only Published lessons for students
  const publishedLessons = lessons.filter(
    (lesson) => lesson.status === "Published"
  );

  return (
    <div className="min-h-screen bg-gray-100">

        <main className="p-6 max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Materials</h1>

          {publishedLessons.length === 0 && (
            <p className="text-gray-500">No lessons available yet.</p>
          )}

          {publishedLessons.map((lesson) => {
            const fileUrl = getFileUrl(lesson.file);
            const fileName = getFileName(lesson.file);

            return (
              <div
                key={lesson.id}
                className="bg-white p-5 mb-5 rounded-lg shadow"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">{lesson.title}</h3>

                  {lesson.mandatory && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                      Mandatory
                    </span>
                  )}
                </div>

                {/* ================= FILE LESSON ================= */}
                {lesson.type !== "External Link" && lesson.file && (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 border rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <div className="text-4xl">
                      {isPDF(lesson.file) && (
                        <FaFilePdf className="text-red-600" />
                      )}
                      {isVideo(lesson.file) && (
                        <FaVideo className="text-blue-600" />
                      )}
                    </div>

                    <div>
                      <p className="font-medium text-[rgba(37,150,190,1)] hover:underline">
                        {fileName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {isPDF(lesson.file)
                          ? "PDF Document"
                          : isVideo(lesson.file)
                          ? "Video File"
                          : "File"}
                      </p>
                    </div>
                  </a>
                )}

                {/* ================= EXTERNAL LINK ================= */}
                {lesson.type === "External Link" && lesson.externalLink && (
                  <a
                    href={lesson.externalLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 border rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <div className="text-3xl text-blue-600">
                      <FaExternalLinkAlt />
                    </div>

                    <div>
                      <p className="font-medium text-[rgba(37,150,190,1)] hover:underline">
                        External Link
                      </p>
                      <p className="text-sm text-gray-500 break-all">
                        {lesson.externalLink}
                      </p>
                    </div>
                  </a>
                )}
              </div>
            );
          })}
        </main>
      </div>
  );
};

export default StudentLessons;
