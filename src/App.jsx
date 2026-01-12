import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/common/ProtectedRoute";
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
import ProfilePage from "./pages/admin/ProfilePage";
import StudentProfile from "./pages/admin/StudentProfile";
import TeacherProfile from "./pages/admin/TeacherProfile";

// Auth Routes
import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import SchoolRegister from "./pages/auth/SchoolRegister";
import AcceptInvitation from "./pages/auth/AcceptInvitation";

function App() {
  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        <Routes>
          {/* ===== PUBLIC ROUTES ===== */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-school" element={<SchoolRegister />} />
          <Route path="/accept-invitation" element={<AcceptInvitation />} />
          
          {/* Auth Routes */}
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ===== ADMIN ROUTES ===== */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard>
                  <AdminDashboardStats />
                </AdminDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute>
                <AdminDashboard>
                  <StudentList />
                </AdminDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/teachers"
            element={
              <ProtectedRoute>
                <AdminDashboard>
                  <TeacherManagement />
                </AdminDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/classes"
            element={
              <ProtectedRoute>
                <AdminDashboard>
                  <ClassManagement />
                </AdminDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/attendance"
            element={
              <ProtectedRoute>
                <AdminDashboard>
                  <AttendanceManagement />
                </AdminDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/fees"
            element={
              <ProtectedRoute>
                <AdminDashboard>
                  <FeesManagement />
                </AdminDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/academics"
            element={
              <ProtectedRoute>
                <AdminDashboard>
                  <AcademicsManagement />
                </AdminDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/timetable"
            element={
              <ProtectedRoute>
                <AdminDashboard>
                  <TimetableManagement />
                </AdminDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <AdminDashboard>
                  <SettingsPage />
                </AdminDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute>
                <AdminDashboard>
                  <ProfilePage />
                </AdminDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students/:id"
            element={
              <ProtectedRoute>
                <AdminDashboard>
                  <StudentProfile />
                </AdminDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/teachers/:id"
            element={
              <ProtectedRoute>
                <AdminDashboard>
                  <TeacherProfile />
                </AdminDashboard>
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
