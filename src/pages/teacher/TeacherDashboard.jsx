
import { useState } from "react";
import useTheme from "../../context/ThemeContext";
import TeacherNavbar from "../../components/teacher/TeacherNavbar";
import TeacherSidebar from "../../components/teacher/TeacherDashboardSidebar";
import TeacherMainContent from "../../components/teacher/TeacherDashboardMain";;
export default function TeacherDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <TeacherNavbar 
          toggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />
      </div>

      <div className="flex pt-16">
        <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] z-50">
        {/* Sidebar */}
        <TeacherSidebar 
          open={isSidebarOpen} 
          isDark={isDark}
          onItemClick={closeSidebar}
        />
        </div>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'lg:ml-72' : 'lg:ml-72'
        }`}>
          <TeacherMainContent isDark={isDark} />
        </div>
      </div>
    </div>
  );
}