import React, { useEffect, useState } from "react";
import { FaUserGraduate, FaUserPlus, FaBook, FaMoneyBillWave } from "react-icons/fa";

const Card = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [newStudents, setNewStudents] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalFees, setTotalFees] = useState(0);

  useEffect(() => {
    fetchTotalStudents();
    fetchNewStudents();
    fetchTotalCourses();
    fetchTotalFees();
  }, []);

  const fetchTotalStudents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/students/total");
      const data = await res.json();
      setTotalStudents(data.total || 0);
    } catch (err) {
      console.error("Error fetching total students:", err);
    }
  };

  const fetchNewStudents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/students/new");
      const data = await res.json();
      setNewStudents(data.newCount || 0);
    } catch (err) {
      console.error("Error fetching new students:", err);
    }
  };

  const fetchTotalCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/courses/total");
      const data = await res.json();
      setTotalCourses(data.total || 0);
    } catch (err) {
      console.error("Error fetching total courses:", err);
    }
  };

  const fetchTotalFees = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/fees/total");
      const data = await res.json();
      setTotalFees(data.totalAmount || 0);
    } catch (err) {
      console.error("Error fetching total fees:", err);
    }
  };

  const stats = [
    {
      title: "Total Students",
      value: totalStudents.toLocaleString(),
      icon: <FaUserGraduate size={24} />,
      color: "from-[rgba(37,150,190,1)] to-[rgba(37,150,190,1)]",
      percentage: "80%",
      duration: "All Time",
      progress: 80,
    },
    {
      title: "New Students",
      value: newStudents.toLocaleString(),
      icon: <FaUserPlus size={24} />,
      color: "from-[rgba(37,150,190,1)] to-[rgba(37,150,190,1)]",
      percentage: "This Month",
      duration: "30 Days",
      progress: 50,
    },
    {
      title: "Total Courses",
      value: totalCourses.toLocaleString(),
      icon: <FaBook size={24} />,
      color: "from-[rgba(37,150,190,1)] to-[rgba(37,150,190,1)]",
      percentage: "76%",
      duration: "20 Days",
      progress: 76,
    },
    {
      title: "Fees Collection",
      value: `₹${totalFees.toLocaleString()}`,
      icon: <FaMoneyBillWave size={24} />,
      color: "from-[rgba(37,150,190,1)] to-[rgba(37,150,190,1)]",
      percentage: "30%",
      duration: "30 Days",
      progress: 30,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-shadow duration-300 group"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-md font-medium text-gray-600">{stat.title}</h3>
            <div className="text-[rgba(37,150,190,1)] group-hover:scale-110 transition-transform">
              {stat.icon}
            </div>
          </div>
          <p className="text-3xl font-extrabold text-gray-900 mb-2">{stat.value}</p>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${stat.color}`}
              style={{ width: `${stat.progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {stat.percentage} in {stat.duration}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Card;
