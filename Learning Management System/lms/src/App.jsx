import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./Components/Register/Login";
import SignUp from "./Components/Register/SignUp";
import ForgotPassword from "./Components/Register/ForgotPassword";
import Dashboard from "./Components/Pages/Dashboard";
import Sidebar from "./Components/Pages/Sidebar";
import InstructorList from "./Components/Instructor/InstructorList";
import AddInstructor from "./Components/Instructor/AddInstructor";
import StudentList from "./Components/Student/StudentList";
import AllCourses from "./Components/Courses/AllCourses";
import CourseCategory from "./Components/Courses/CourseCategory";
import EventManagement from "./Components/Others/EventManagement";
import Holiday from "./Components/Others/Holiday";
import FeesCollection from "./Components/Fees/FeesCollection";
import Setting from "./Components/Others/Setting";
import Profile from "./Components/Profile/Profile";
 
const App = () => {
  const location = useLocation();
  const path = location.pathname;
 
  const isAuthPage = ["/", "/signup", "/forgotpassword"].includes(path);
 
  const Wrapper = ({ children }) =>
    isAuthPage ? (
      <div
        className="min-h-screen flex items-center justify-center bg-cover relative overflow-hidden"
        style={{ backgroundImage: "url('/Assets/register-bg.jpg')" }}
      >
        {children}
      </div>
    ) : (
      <>{children}</>
    );
 
  return (
    <Wrapper>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/instructorlist" element={<InstructorList />} />
        <Route path="/addinstructor" element={<AddInstructor />} />
        <Route path="/studentlist" element={<StudentList />} />
        <Route path="/allcourses" element={<AllCourses />} />
        <Route path="/coursecategory" element={<CourseCategory />} />
        <Route path="/eventmanagement" element={<EventManagement />} />
        <Route path="/holiday" element={<Holiday />} />
        <Route path="/feescollection" element={<FeesCollection />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/profile" element={<Profile/>} />
      </Routes>
    </Wrapper>
  );
};
 
export default App