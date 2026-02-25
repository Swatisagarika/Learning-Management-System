import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const List = () => {
  const [professors, setProfessors] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/instructors");
        const data = await res.json();
        setProfessors(data.slice(-4).reverse()); // latest 4 instructors
      } catch (error) {
        console.error("Failed to fetch instructors:", error);
      }
    };

    const fetchStudents = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/students");
        const data = await res.json();
        setStudents(data.slice(-4).reverse()); // latest 4 students
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };

    fetchInstructors();
    fetchStudents();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {/* Instructors Section */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden transition-all">
        <div className="flex justify-between items-center border-b px-6 py-4 bg-gray-50">
          <h2 className="text-lg font-semibold text-[rgba(37,150,190,1)]">Top Instructors</h2>
          <Link
            to="/instructorlist"
            className="text-sm font-medium text-[rgba(37,150,190,1)] hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="divide-y max-h-[360px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {professors.length === 0 ? (
            <p className="px-6 py-4 text-sm text-gray-500">No instructors found.</p>
          ) : (
            professors.map((prof, index) => (
              <div
                key={index}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition"
              >
                <img
                  src={`http://localhost:5000/uploads/${prof.profilePhoto}`}
                  alt={prof.instructorName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[rgba(37,150,190,1)]"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{prof.instructorName}</p>
                  <p className="text-xs text-gray-500">{prof.department}</p>
                  <p className="text-xs text-gray-500">{prof.gender}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Students Section */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden transition-all">
        <div className="flex justify-between items-center border-b px-6 py-4 bg-gray-50">
          <h2 className="text-lg font-semibold text-[rgba(37,150,190,1)]">Recent Students</h2>
          <Link
            to="/studentlist"
            className="text-sm font-medium text-[rgba(37,150,190,1)] hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="divide-y max-h-[360px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {students.length === 0 ? (
            <p className="px-6 py-4 text-sm text-gray-500">No students found.</p>
          ) : (
            students.map((student, index) => (
              <div
                key={index}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition"
              >
                <img
                  src={
                    student.profilePhoto
                      ? `http://localhost:5000/uploads/${student.profilePhoto}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={student.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[rgba(37,150,190,1)]"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{student.name}</p>
                  <p className="text-xs text-gray-500">
                    Roll: {student.rollNo} | Class: {student.className}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default List;
