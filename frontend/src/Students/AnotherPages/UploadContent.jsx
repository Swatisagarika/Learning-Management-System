import React, { useEffect, useState } from "react";

const UploadContent = () => {
  const [contentList, setContentList] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({
    pdfs: [],
    videos: [],
    assignments: [],
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("courseContent")) || [];
    setContentList(stored);
  }, []);

  const updateStorage = (updatedList) => {
    setContentList(updatedList);
    localStorage.setItem("courseContent", JSON.stringify(updatedList));
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this content batch?")) {
      const updated = contentList.filter((_, i) => i !== index);
      updateStorage(updated);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditData(contentList[index]);
  };

  const handleSaveEdit = () => {
    const updated = [...contentList];
    updated[editingIndex] = editData;
    updateStorage(updated);
    setEditingIndex(null);
    alert("Content updated successfully!");
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto mt-10 p-6">
            <h1 className="text-3xl font-bold text-[rgba(37,150,190,1)] mb-6 text-center">
              📂 Course Content Library
            </h1>

            {contentList.length === 0 ? (
              <p className="text-gray-600 text-center">
                No content uploaded yet. Please add from the Instructor panel.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {contentList.map((content, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-xl transition h-full"
                  >
                    <h2 className="text-xl font-semibold text-[rgba(37,150,190,1)] mb-4">
                      📘 Content Batch {idx + 1}
                    </h2>

                    {/* PDFs */}
                    <div className="mb-4 flex-1">
                      <h3 className="font-medium text-gray-800 mb-1">📄 PDFs:</h3>
                      {content.pdfs.length > 0 ? (
                        <ul className="list-disc ml-5 text-gray-600 space-y-1">
  {content.pdfs.map((pdf, i) => (
    <li key={i}>
      <a
        href={typeof pdf === "string" ? pdf : "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {typeof pdf === "string" ? `PDF ${i + 1}` : "Invalid PDF"}
      </a>
    </li>
  ))}
</ul>

                      ) : (
                        <p className="text-gray-500">No PDFs uploaded.</p>
                      )}
                    </div>

                    {/* Videos */}
                    <div className="mb-4 flex-1">
                      <h3 className="font-medium text-gray-800 mb-1">
                        🎥 Videos:
                      </h3>
                      {content.videos.map((video, i) =>
  typeof video === "string" ? (
    <video
      key={i}
      src={video}
      controls
      className="w-full h-40 rounded-lg mt-2 object-cover"
    />
  ) : (
    <p key={i} className="text-red-500">Invalid video link</p>
  )
)}

                    </div>

                    {/* Assignments */}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 mb-1">
                        📝 Assignments:
                      </h3>
                      {content.assignments.length > 0 ? (
                        <ul className="list-disc ml-5 text-gray-600 space-y-1">
  {content.assignments.map((assignment, i) => (
    <li key={i}>
      {typeof assignment === "string"
        ? assignment
        : JSON.stringify(assignment)}  {/* fallback */}
    </li>
  ))}
</ul>

                      ) : (
                        <p className="text-gray-500">No assignments uploaded.</p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex justify-between">
                      <button
                        onClick={() => handleEdit(idx)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(idx)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Edit Modal */}
            {editingIndex !== null && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
                  <h2 className="text-xl font-bold text-[rgba(37,150,190,1)] mb-4">
                    ✏️ Edit Content Batch {editingIndex + 1}
                  </h2>

                  {/* PDFs */}
                  <div className="mb-3">
                    <label className="block text-gray-700 mb-1">
                      PDF Links (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editData.pdfs.join(",")}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          pdfs: e.target.value.split(","),
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[rgba(37,150,190,1)]"
                    />
                  </div>

                  {/* Videos */}
                  <div className="mb-3">
                    <label className="block text-gray-700 mb-1">
                      Video Links (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editData.videos.join(",")}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          videos: e.target.value.split(","),
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[rgba(37,150,190,1)]"
                    />
                  </div>

                  {/* Assignments */}
                  <div className="mb-3">
                    <label className="block text-gray-700 mb-1">
                      Assignments (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editData.assignments.join(",")}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          assignments: e.target.value.split(","),
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[rgba(37,150,190,1)]"
                    />
                  </div>

                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      onClick={() => setEditingIndex(null)}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="bg-[rgba(37,150,190,1)] hover:bg-[rgba(37,150,190,1)] text-white px-4 py-2 rounded-lg"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
    </>
  );
};

export default UploadContent;
