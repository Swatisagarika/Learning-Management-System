import React from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
 
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);
 
const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
 
const barData = {
  labels,
  datasets: [
    {
      label: "Income/Expense",
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: "rgba(107, 50, 180, 0.8)", // indigo-500
      borderRadius: 4,
      barThickness: 30,
    },
  ],
};
 
const lineData = {
  labels,
  datasets: [
    {
      label: "Income/Expense",
      data: [25, 18, 60, 40, 65, 45, 80],
      fill: true,
      backgroundColor: "rgba(107, 33, 168, 0.2)", // indigo-200
      borderColor: "rgba(107, 50, 180, 0.8)", // indigo-500
      pointBackgroundColor: "rgba(107, 33, 168, 1)",
      tension: 0.4,
    },
  ],
};
 
const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: { beginAtZero: true, ticks: { stepSize: 20 } },
  },
};
 
const Report = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {/* Bar Chart */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Income/Expense Report</h3>
        <Bar data={barData} options={chartOptions} />
      </div>
 
      {/* Line Chart */}
      <div className="bg-white rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Income/Expense Report</h3>
        <Line data={lineData} options={chartOptions} />
      </div>
    </div>
  );
};
 
export default Report;