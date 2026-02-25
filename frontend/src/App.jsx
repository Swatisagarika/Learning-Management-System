import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Login from "./Components/Register/Login";
import SignUp from "./Components/Register/SignUp";
import ForgotPassword from "./Components/Register/ForgotPassword";
import ResetPassword from "./Components/Register/ResetPassword";

import Dashboard from "./Components/Pages/Dashboard";
import InstructorList from "./Components/Instructor/InstructorList";
import AddInstructor from "./Components/Instructor/AddInstructor";
import StudentList from "./Components/Student/StudentList";
import AllCourses from "./Components/Courses/AllCourses";
import CourseCategory from "./Components/Courses/CourseCategory";
import EventManagement from "./Components/Others/EventManagement";
import Holiday from "./Components/Others/Holiday";
import FeesCollection from "./Components/Fees/FeesCollection";
import Setting from "./Components/Others/Setting";
import AdminIssueCertificate from "./Components/Certificate/AdminIssueCertificate";

import InstructorDashboard from "./Instructor/InstructorDashboard";
import InstructorLayout from "./Instructor/OtherPages/InstructorLayout";
import InstructorCourse from "./Instructor/OtherPages/InstructorCourse";
import InstructorContent from "./Instructor/OtherPages/InstructorContent";
import InstructorQuiz from "./Instructor/OtherPages/InstructorQuiz";
import InstructorAttendance from "./Instructor/OtherPages/InstructorAttendance";
import InstructorStudent from "./Instructor/OtherPages/InstructorStudent";
import InstructorFeedback from "./Instructor/OtherPages/InstructorFeedback";
import InstructorCertificateApproval from "./Instructor/OtherPages/InstructorCertificateApproval";
import InstructorSetting from "./Instructor/OtherPages/InstructorSetting";

import StudentsDashboard from "./Students/StudentsDashboard";
import StudentCourse from "./Students/AnotherPages/StudentCourse";
import StudentEnroll from "./Students/AnotherPages/StudentEnroll";
import StudentLesson from "./Students/AnotherPages/StudentLesson";
import UploadContent from "./Students/AnotherPages/UploadContent";
import StudentQuizView from "./Students/AnotherPages/StudentQuizView";
import StudentFeedback from "./Students/AnotherPages/StudentFeedback";
import StudentCertificate from "./Students/AnotherPages/StudentCertificate";
import StudentSetting from "./Students/AnotherPages/StudentSetting";

import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import AdminLayout from "./Components/Layout/AdminLayout";
import StudentLayout from "./Students/AnotherPages/StudentLayout";

const App = () => {
  const location = useLocation();
  const isAuthPage = ["/", "/signup", "/forgotpassword", "/reset-password"].includes(
    location.pathname
  );

  const Wrapper = ({ children }) =>
    isAuthPage ? (
      <div
        className="min-h-screen flex items-center justify-center bg-cover"
        style={{ backgroundImage: "url('/Assets/background.png')" }}
      >
        {children}
      </div>
    ) : (
      <>{children}</>
    );

  return (
    <Wrapper>
      <Routes>
        {/* AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ADMIN ROUTES (LAYOUT) */}
        <Route
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/instructorlist" element={<InstructorList />} />
          <Route path="/addinstructor" element={<AddInstructor />} />
          <Route path="/studentlist" element={<StudentList />} />
          <Route path="/allcourses" element={<AllCourses />} />
          <Route path="/coursecategory" element={<CourseCategory />} />
          <Route path="/eventmanagement" element={<EventManagement />} />
          <Route path="/holiday" element={<Holiday />} />
          <Route path="/feescollection" element={<FeesCollection />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/adminissuecertificate" element={<AdminIssueCertificate />} />
        </Route>

        {/* INSTRUCTOR ROUTES */}
        <Route
          path="/instructor"
          element={
            <ProtectedRoute role="instructor">
              <InstructorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<InstructorDashboard />} />
          <Route path="dashboard" element={<InstructorDashboard />} />
          <Route path="course" element={<InstructorCourse />} />
          <Route path="content" element={<InstructorContent />} />
          <Route path="quiz" element={<InstructorQuiz />} />
          <Route path="attendance" element={<InstructorAttendance />} />
          <Route path="student" element={<InstructorStudent />} />
          <Route path="feedback" element={<InstructorFeedback />} />
          <Route path="certificate-approval" element={<InstructorCertificateApproval />} />
          <Route path="setting" element={<InstructorSetting />} />
        </Route>

        {/* STUDENT ROUTES */}
        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentsDashboard />} />
          <Route path="course" element={<StudentCourse />} />
          <Route path="enroll" element={<StudentEnroll />} />
          <Route path="lesson" element={<StudentLesson />} />
          <Route path="upload-content" element={<UploadContent />} />
          <Route path="quiz-view" element={<StudentQuizView />} />
          <Route path="feedback" element={<StudentFeedback />} />
          <Route path="certificate" element={<StudentCertificate />} />
          <Route path="setting" element={<StudentSetting />} />
        </Route>
      </Routes>
    </Wrapper>
  );
};

export default App;
