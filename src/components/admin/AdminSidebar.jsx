// adminSidebar.jsx
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  School, 
  Bell, 
  User, 
  Search, 
  LayoutDashboard,
  Home,
  GraduationCap,
  UserCheck,
  BookOpen,
  Calendar,
  DollarSign,
  BarChart3,
  MessageSquare,
  Timer,
  Settings,
  LogOut,
  TrendingUp,
  UserPlus,
  Plus,
  FileText,
  Clock,
  Award,
  Sun,
  Moon,
  X
} from "lucide-react";

const Sidebar = ({ open, isDark, onItemClick, activeTab, setActiveTab }) => {
  // Remove local activeTab state
  const { logout } = useAuth();
  const handleItemClick = (itemId) => {
    setActiveTab(itemId);
    onItemClick();
  };

  // Consistent active styling for all tabs
  const getItemClasses = (itemId) => {
    return `w-full flex items-center p-2 cursor-pointer rounded-xl transition-all duration-200 group relative overflow-hidden ${
      activeTab === itemId
        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105"
        : isDark
        ? "text-gray-300 hover:bg-gray-800 hover:text-white"
        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    }`;
  };

  const getIconClasses = (itemId) => {
    return `${activeTab === itemId ? "text-white" : ""} transition-colors duration-200`;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onItemClick} />
      )}
      
      <aside
        className={`fixed top-16 left-0 z-50 w-72 h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:relative lg:top-0 lg:h-full`}
      >
        <div className={`h-full px-4 py-6 overflow-y-auto ${
          isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
        } border-r shadow-lg`}>
          <div className="space-y-1">
            
            {/* Dashboard */}
            <Link
              to="/admin/dashboard"
              onClick={() => handleItemClick("overview")}
              className={getItemClasses("overview")}
            >
              <Home size={20} className={getIconClasses("overview")} />
              <span className="ml-3 font-medium">Dashboard</span>
              {activeTab === "overview" && (
                <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </Link>

            {/* Students */}
            <Link
              to="/admin/students"
              onClick={() => handleItemClick("students")}
              className={getItemClasses("students")}
            >
              <GraduationCap size={20} className={getIconClasses("students")} />
              <span className="ml-3 font-medium">Students</span>
              {activeTab === "students" && (
                <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </Link>

            {/* Teachers */}
            <Link
              to="/admin/teachers"
              onClick={() => handleItemClick("teachers")}
              className={getItemClasses("teachers")}
            >
              <UserCheck size={20} className={getIconClasses("teachers")} />
              <span className="ml-3 font-medium">Teachers</span>
              {activeTab === "teachers" && (
                <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </Link>

            {/* Classes */}
            <Link
              to="/admin/classes"
              onClick={() => handleItemClick("classes")}
              className={getItemClasses("classes")}
            >
              <BookOpen size={20} className={getIconClasses("classes")} />
              <span className="ml-3 font-medium">Classes</span>
              {activeTab === "classes" && (
                <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </Link>

            {/* Academics */}
            <Link
              to="/admin/academics"
              onClick={() => handleItemClick("academics")}
              className={getItemClasses("academics")}
            >
              <School size={20} className={getIconClasses("academics")} />
              <span className="ml-3 font-medium">Academics</span>
              {activeTab === "academics" && (
                <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </Link>

            {/* Attendance */}
            <Link
              to="/admin/attendance"
              onClick={() => handleItemClick("attendance")}
              className={getItemClasses("attendance")}
            >
              <Calendar size={20} className={getIconClasses("attendance")} />
              <span className="ml-3 font-medium">Attendance</span>
              {activeTab === "attendance" && (
                <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </Link>
            <Link
              to="/admin/fees"
              onClick={() => handleItemClick("fees")}
              className={getItemClasses("fees")}
            >
              <DollarSign size={20} className={getIconClasses("fees")} />
              <span className="ml-3 font-medium">Fee Management</span>
              {activeTab === "fees" && (
                <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </Link>
            
            <Link
              to="/admin/timetable"
              onClick={() => handleItemClick("timetable")}
              className={getItemClasses("timetable")}
            >
              <Timer size={20} className={getIconClasses("timetable")} />
              <span className="ml-3 font-medium">Timetable</span>
              {activeTab === "timetable" && (
                <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </Link>

            

            
            {/* Settings */}
            <Link
              to="/admin/settings"
              onClick={() => handleItemClick("settings")}
              className={getItemClasses("settings")}
            >
              <Settings size={20} className={getIconClasses("settings")} />
              <span className="ml-3 font-medium">Settings</span>
              {activeTab === "settings" && (
                <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </Link>

          </div>
          
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700">
            <button
            onClick ={logout}
            className={`w-full flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${
              isDark 
                ? "text-gray-300 hover:bg-red-900/20 hover:text-red-400" 
                : "text-gray-700 hover:bg-red-50 hover:text-red-600"
            }`}>
              <LogOut size={20} />
              <span className="ml-3 font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;