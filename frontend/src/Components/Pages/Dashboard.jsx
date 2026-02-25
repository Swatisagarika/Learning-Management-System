import React from "react";
import Card from "./Card";
import Report from "./Report";
import List from "./List";

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6 transition-all duration-300">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
        Welcome to Admin Dashboard
      </h1>

      {/* Cards */}
      <Card />

      {/* Reports */}
      <Report />

      {/* List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow transition-colors">
        <List />
      </div>
    </div>
  );
};

export default Dashboard;
