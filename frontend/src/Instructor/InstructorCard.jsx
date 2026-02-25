import React from "react";
import {
  FaBookOpen,
  FaUpload,
  FaQuestionCircle,
  FaUsers,
  FaStar,
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

const InstructorCard = () => {
  /* =======================
     DASHBOARD STATS
  ======================= */
  const stats = [
    {
      title: "Total Courses",
      value: 12,
      icon: <FaBookOpen size={22} />,
      progress: 75,
    },
    {
      title: "Uploaded Content",
      value: 48,
      icon: <FaUpload size={18} />,
      progress: 60,
    },
    {
      title: "Total Quizzes",
      value: 25,
      icon: <FaQuestionCircle size={22} />,
      progress: 55,
    },
    {
      title: "Total Students",
      value: 320,
      icon: <FaUsers size={22} />,
      progress: 80,
    },
    {
      title: "Course Rating",
      value: "4.6 / 5",
      icon: <FaStar size={22} />,
      progress: 92,
    },
  ];

  /* =======================
     PIE CHART DATA
  ======================= */
  const courseData = [
    { name: "Web Dev", value: 40 },
    { name: "Data Science", value: 25 },
    { name: "UI / UX", value: 20 },
    { name: "Other", value: 15 },
  ];

  const PIE_COLORS = [
    "rgba(37,150,190,1)",
    "#ff6384",
    "#ffce56",
    "#4bc0c0",
  ];

  /* =======================
     BAR GRAPH DATA
  ======================= */
  const studentGrowth = [
    { month: "Jan", students: 120 },
    { month: "Feb", students: 160 },
    { month: "Mar", students: 200 },
    { month: "Apr", students: 260 },
    { month: "May", students: 320 },
  ];

  return (
    <>
      {/* =======================
          STAT CARDS
      ======================= */}
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

      {/* =======================
          CHART SECTION
      ======================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-[#092f3d] mb-4">
            Course Distribution
          </h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={courseData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {courseData.map((_, index) => (
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

        {/* Bar Graph */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-[#092f3d] mb-4">
            Student Growth
          </h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="students"
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

export default InstructorCard;
