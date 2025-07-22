import React, { useState, useEffect } from "react";

const EventModal = ({ selectedDate, eventData, onClose, onSave, onDelete }) => {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [color, setColor] = useState("#6366F1");
  const [error, setError] = useState("");

  useEffect(() => {
    if (eventData) {
      setTitle(eventData.title || "");
      setColor(eventData.color || "#6366F1");

      const timePart = eventData.time
        ? eventData.time.slice(0, 5)
        : eventData.start?.split("T")[1]?.slice(0, 5) || "";
      setTime(timePart);
    } else {
      setTitle("");
      setTime("");
      setColor("#6366F1");
    }
    setError("");
  }, [eventData]);

  const handleSubmit = () => {
    if (!title.trim() || !time || !color) {
      setError("All fields are required.");
      return;
    }

    const payload = {
      id: eventData?.id,
      title,
      time,
      color,
      date: selectedDate,
    };

    onSave(payload);
  };

  const handleDelete = () => {
    if (eventData?.id && window.confirm("Are you sure you want to delete this event?")) {
      onDelete(eventData.id);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h3 className="text-lg font-semibold text-purple-800 mb-4">
          {eventData ? "Edit Event" : "Add Event"}
        </h3>

        <p className="text-sm text-gray-600 mb-3">
          Date: <strong>{selectedDate}</strong>
        </p>

        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError("");
          }}
          className="w-full px-4 py-2 border rounded mb-3"
        />

        <input
          type="time"
          value={time}
          onChange={(e) => {
            setTime(e.target.value);
            setError("");
          }}
          className="w-full px-4 py-2 border rounded mb-3"
        />

        <select
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-3"
        >
          <option value="#6366F1">Indigo</option>
          <option value="#EF4444">Red</option>
          <option value="#F59E0B">Amber</option>
          <option value="#10B981">Green</option>
          <option value="#3B82F6">Blue</option>
          <option value="#7C3AED">Purple</option>
        </select>

        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>

          {eventData?.id && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          )}

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            {eventData ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
