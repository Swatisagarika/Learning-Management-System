import { useState, useEffect } from "react";

export default function InstructorAttendance() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);

  /* ===============================
     ATTENDANCE STATUS LOGIC
  =================================*/
  const getStatus = (attendance) => {
    if (attendance >= 80) return "Present";
    if (attendance >= 20) return "Partial";
    return "Absent";
  };

  const getBadgeColor = (attendance) => {
    if (attendance >= 80) return "bg-green-100 text-green-700";
    if (attendance >= 20) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  /* ===============================
     FETCH COURSES
  =================================*/
  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/instructor/courses");
      const data = await res.json();

      setCourses(data);

      if (data.length > 0) {
        setSelectedCourse(data[0].id);
      }
    } catch (err) {
      console.error("Fetch courses error:", err);
    }
  };

  /* ===============================
     FETCH ATTENDANCE
  =================================*/
  const fetchAttendance = async (courseId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/attendance/${courseId}`
      );

      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Fetch attendance error:", err);
    }
  };

  /* ===============================
     LOAD COURSES
  =================================*/
  useEffect(() => {
    fetchCourses();
  }, []);

  /* ===============================
     LOAD ATTENDANCE WHEN COURSE CHANGES
  =================================*/
  useEffect(() => {
    if (selectedCourse) {
      fetchAttendance(selectedCourse);
    }
  }, [selectedCourse]);

  return (
    <div className="min-h-screen bg-gray-100">

        {/* PAGE BODY */}
        <main className="p-6">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Course Attendance</h2>

            {/* COURSE DROPDOWN */}
            <select
              className="border p-2 rounded"
              value={selectedCourse || ""}
              onChange={(e) => setSelectedCourse(Number(e.target.value))}
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <SummaryCard title="Total Students" value={students.length} />

            <SummaryCard
              title="Present"
              value={students.filter((s) => s.attendance >= 80).length}
            />

            <SummaryCard
              title="Absent"
              value={students.filter((s) => s.attendance < 20).length}
            />
          </div>

          {/* ATTENDANCE TABLE */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-semibold mb-4">Student Attendance</h3>

            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">Student</th>
                  <th className="p-3">Attendance</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student.student_id} className="border-t">
                    <td className="p-3">{student.student_name}</td>

                    {/* ATTENDANCE BAR */}
                    <td className="p-3">
                      <div className="w-full bg-gray-200 rounded h-2">
                        <div
                          className="bg-[rgba(37,150,190,1)] h-2 rounded"
                          style={{ width: `${student.attendance}%` }}
                        />
                      </div>
                      <p className="text-sm mt-1">
                        {student.attendance || 0}%
                      </p>
                    </td>

                    {/* STATUS */}
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 text-sm rounded ${getBadgeColor(
                          student.attendance
                        )}`}
                      >
                        {getStatus(student.attendance)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
  );
}

/* ===============================
   SUMMARY CARD COMPONENT
================================ */
function SummaryCard({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  );
}
