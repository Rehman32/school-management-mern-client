import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/common/ProtectedRoute";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentList from "./pages/admin/StudentManagement";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDashboardStats from "./components/admin/AdminDashboardStats";
import TeacherManagement from "./pages/admin/TeacherManagement";
import ClassManagement from "./pages/admin/ClassManagement";
import AttendanceManagement from "./pages/admin/AttendanceManagement";
import FeesManagement from "./pages/admin/FeesManagement";
import AcademicsManagement from "./pages/admin/AcademicsManagement";
import TimetableManagement from "./pages/admin/TimetableManagement";
import SettingsPage from "./pages/admin/SettingsPage";

// NEW IMPORTS
import SchoolRegister from "./pages/auth/SchoolRegister";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

function App() {
  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        <Routes>
          {/* ===== PUBLIC ROUTES ===== */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* NEW AUTH ROUTES */}
          <Route path="/register-school" element={<SchoolRegister />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ===== ADMIN ROUTES ===== */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard>
                  <AdminDashboardStats />
                </AdminDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard>
                  <StudentList />
                </AdminDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/teachers"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard>
                  <TeacherManagement />
                </AdminDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/classes"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard>
                  <ClassManagement />
                </AdminDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/attendance"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard>
                  <AttendanceManagement />
                </AdminDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/fees"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard>
                  <FeesManagement />
                </AdminDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/academics"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard>
                  <AcademicsManagement />
                </AdminDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/timetable"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard>
                  <TimetableManagement />
                </AdminDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard>
                  <SettingsPage />
                </AdminDashboard>
              </ProtectedRoute>
            }
          />

          {/* ===== TEACHER & STUDENT ROUTES ===== */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </>
  );
}

export default App;
