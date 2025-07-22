import React, { useState } from "react";
import Sidebar from "./Sidebar";
import List from "./List";
import Card from "./Card";
import Report from "./Report";
import Topbar from "./Topbar";
 
const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
 
  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} />
      <div className={`flex-1 ${collapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        <Topbar onToggleSidebar={() => setCollapsed(!collapsed)} />
        <div className="p-6">
          {/* Your dashboard content */}
          <h1 className="text-2xl font-semibold text-gray-800">Welcome to LMS Dashboard</h1>
          <Card/>
          <Report/>
           <div className="p-4">
      <List/>
    </div>
        </div>
      </div>
    </div>
  );
};
 
export default Dashboard;