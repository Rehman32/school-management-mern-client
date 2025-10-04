//clinet/app.jsx
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

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
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
        <Toaster />
      </div>
    </>
  );
}

export default App;
