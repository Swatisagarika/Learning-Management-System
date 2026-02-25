import React, { useState, useEffect } from "react";

const InstructorCertificateApproval = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  // Simulate fetching courses & progress from localStorage
  useEffect(() => {
    const savedCourses =
      JSON.parse(localStorage.getItem("courseProgress")) || [];

    // Example courses data
    const coursesData = [
      { id: 101, title: "React Basics" },
      { id: 102, title: "Node Advanced" },
    ];

    const formattedCourses = coursesData.map((course, idx) => ({
      ...course,
      progress: savedCourses[idx]?.progress || 0,
    }));

    setCourses(formattedCourses);

    // Example students with multiple courses
    const studentsData = [
      {
        id: 1,
        studentName: "Alice Johnson",
        courses: [
          {
            courseId: 101,
            courseName: "React Basics",
            attendance: formattedCourses[0]?.progress || 0,
            grade: "A",
            instructorApproved: false,
          },
          {
            courseId: 102,
            courseName: "Node Advanced",
            attendance: formattedCourses[1]?.progress || 0,
            grade: "B",
            instructorApproved: false,
          },
        ],
      },
      {
        id: 2,
        studentName: "Bob Smith",
        courses: [
          {
            courseId: 101,
            courseName: "React Basics",
            attendance: formattedCourses[0]?.progress || 0,
            grade: "C",
            instructorApproved: false,
          },
          {
            courseId: 102,
            courseName: "Node Advanced",
            attendance: formattedCourses[1]?.progress || 0,
            grade: "B",
            instructorApproved: false,
          },
        ],
      },
    ];

    setStudents(studentsData);
  }, []);

  const approveStudent = (studentId, courseId) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== studentId) return student;
        return {
          ...student,
          courses: student.courses.map((c) =>
            c.courseId === courseId
              ? { ...c, instructorApproved: true }
              : c
          ),
        };
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">

        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Instructor – Certificate Eligibility
          </h1>

          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[rgba(37,150,190,1)] text-white">
                <tr>
                  <th className="p-3 text-left">Student</th>
                  <th className="p-3 text-left">Course</th>
                  <th className="p-3 text-center">Attendance %</th>
                  <th className="p-3 text-center">Grade</th>
                  <th className="p-3 text-center">Instructor Status</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) =>
                  student.courses.map((c) => {
                    const isEligible = c.attendance >= 75;

                    return (
                      <tr key={`${student.id}-${c.courseId}`} className="border-b">
                        <td className="p-3">{student.studentName}</td>
                        <td className="p-3">{c.courseName}</td>
                        <td className="p-3 text-center">{c.attendance}%</td>
                        <td className="p-3 text-center">{c.grade}</td>
                        <td className="p-3 text-center">
                          {!isEligible ? (
                            <span className="text-red-600 font-semibold">
                              Not Eligible
                            </span>
                          ) : c.instructorApproved ? (
                            <span className="text-green-600 font-semibold">
                              Approved ✔
                            </span>
                          ) : (
                            <button
                              onClick={() =>
                                approveStudent(student.id, c.courseId)
                              }
                              className="bg-blue-50 hover:bg-blue-200 text-blue-700 px-4 py-1 rounded"
                            >
                              Approve
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Info Box */}
          <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 text-sm text-blue-700 rounded">
            <p>
              <strong>Note:</strong> Attendance below 75% is not eligible for
              certificate approval.
            </p>
          </div>
        </div>
      </div>
  );
};

export default InstructorCertificateApproval;
