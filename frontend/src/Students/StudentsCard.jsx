import React from "react";
import {
  FaBookOpen,
  FaClipboardList,
  FaPlayCircle,
  FaPenFancy,
  FaStar,
  FaCertificate,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const StudentsCard = () => {
  /* ======================
     DASHBOARD STATS
  ====================== */
  const stats = [
    {
      title: "Available Courses",
      value: 42,
      icon: <FaBookOpen size={22} />,
      progress: 70,
    },
    {
      title: "Enrolled Courses",
      value: 6,
      icon: <FaClipboardList size={22} />,
      progress: 60,
    },
    {
      title: "Lessons Completed",
      value: 38,
      icon: <FaPlayCircle size={22} />,
      progress: 80,
    },
    {
      title: "Quizzes Attempted",
      value: 14,
      icon: <FaPenFancy size={22} />,
      progress: 65,
    },
    {
      title: "Certificates Earned",
      value: 3,
      icon: <FaCertificate size={22} />,
      progress: 50,
    },
  ];

  /* ======================
     PIE CHART DATA
  ====================== */
  const courseProgress = [
    { name: "Completed", value: 60 },
    { name: "In Progress", value: 30 },
    { name: "Not Started", value: 10 },
  ];

  const PIE_COLORS = [
    "rgba(37,150,190,1)",
    "#ffb703",
    "#adb5bd",
  ];

  /* ======================
     BAR CHART DATA
  ====================== */
  const learningActivity = [
    { week: "Week 1", lessons: 5 },
    { week: "Week 2", lessons: 8 },
    { week: "Week 3", lessons: 12 },
    { week: "Week 4", lessons: 13 },
  ];

  return (
    <>
      {/* ======================
          STAT CARDS
      ====================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-600">
                {stat.title}
              </h3>
              <div className="text-[rgba(37,150,190,1)]">
                {stat.icon}
              </div>
            </div>

            <p className="text-3xl font-extrabold text-gray-900 mb-2">
              {stat.value}
            </p>

            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-[rgba(37,150,190,1)] rounded-full"
                style={{ width: `${stat.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ======================
          CHART SECTION
      ====================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-[#092f3d] mb-4">
            Course Progress Overview
          </h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={courseProgress}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {courseProgress.map((_, index) => (
                    <Cell
                      key={index}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-[#092f3d] mb-4">
            Weekly Learning Activity
          </h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={learningActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="lessons"
                  fill="rgba(37,150,190,1)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentsCard;
