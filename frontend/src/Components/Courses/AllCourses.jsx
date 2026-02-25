import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import CourseModal from "./CourseModal";

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  //  Fetch all courses
  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/courses");
      const data = await res.json();

      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        console.error("Unexpected response:", data);
        setCourses([]);
      }
    } catch (err) {
      console.error(" Failed to fetch courses:", err);
      setCourses([]);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  //  Delete course
  const handleDelete = async (id) => {
    const numId = Number(id);
    if (isNaN(numId)) {
      setErrorMsg("Invalid course ID");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      setDeletingId(numId);

      const res = await fetch(`http://localhost:5000/api/courses/${numId}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });

      const ct = res.headers.get("content-type") || "";
      const result = ct.includes("application/json") ? await res.json() : {};

      if (res.ok) {
        alert(result.message || "Course deleted successfully!");
        setSuccessMsg(result.message || "Course deleted successfully");
        fetchCourses();
      } else {
        setErrorMsg(result.error || result.message || "Delete failed");
      }
    } catch (err) {
      console.error(" Deletion error:", err);
      setErrorMsg("Something went wrong.");
    } finally {
      setDeletingId(null);
      setTimeout(() => {
        setSuccessMsg("");
        setErrorMsg("");
      }, 3000);
    }
  };

  //  Edit course
  const handleEdit = (course) => {
    setModalData(course);
  };

  //  Add new course
  const handleAdd = () => {
    setModalData({
      id: null,
      title: "",
      instructorName: "",
      duration: "",
      categoryName: "",
    });
  };

  //  Save course (add/update)
  const handleSave = async (course) => {
    if (!course.title || !course.instructorName || !course.duration || !course.categoryName) {
      setErrorMsg("Please fill all fields");
      return;
    }

    try {
      const method = course.id ? "PUT" : "POST";
      const url = course.id
        ? `http://localhost:5000/api/courses/${course.id}`
        : "http://localhost:5000/api/courses";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(course),
      });

      const result = await res.json();

      if (!res.ok) {
        setErrorMsg(result.message || "Failed to save course");
        return;
      }

      setModalData(null);
      await fetchCourses();

      if (course.id) {
        alert(" Course updated successfully!");
        //setSuccessMsg("Course updated successfully");
      } else {
        alert(" Course added successfully!");
        //setSuccessMsg("Course added successfully");
      }
    } catch (err) {
      console.error(" Error saving course:", err);
      setErrorMsg("Failed to save course.");
    } finally {
      setTimeout(() => {
        setSuccessMsg("");
        setErrorMsg("");
      }, 3000);
    }
  };

  return (
    <div className=" min-h-screen bg-gray-100">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
            <h2 className="text-2xl font-bold text-gray-800">All Courses</h2>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-[rgba(37,150,190,1)] text-white px-4 py-2 rounded hover:bg-[#116989] text-sm"
            >
              <FaPlus /> Add Course
            </button>
          </div>

          {/*  Show Messages */}
          {successMsg && <div className="text-green-600 font-semibold mb-3">{successMsg}</div>}
          {errorMsg && <div className="text-red-600 font-semibold mb-3">{errorMsg}</div>}

          <div className="overflow-x-auto bg-white shadow rounded">
            <table className="min-w-full text-sm divide-y divide-gray-200">
              <thead className="bg-[rgba(37,150,190,1)] text-white text-left font-semibold ">
                <tr>
                  <th className="p-3">Sl. No.</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Instructor Name</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Category Name</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {courses.map((course, index) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{course.title}</td>
                    <td className="p-3">{course.instructorName}</td>
                    <td className="p-3">{course.duration}</td>
                    <td className="p-3">{course.categoryName}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(course)}
                        className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className={`p-1 bg-red-500 text-white rounded hover:bg-red-600 ${
                          deletingId === course.id ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={deletingId === course.id}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/*  Modal for Add/Edit */}
          {modalData && (
            <CourseModal
              course={modalData}
              onClose={() => setModalData(null)}
              onSave={handleSave}
            />
          )}
        </div>
      </div>
  );
};

export default AllCourses;
