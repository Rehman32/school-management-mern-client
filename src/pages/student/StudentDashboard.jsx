
import { useState } from "react";
import useTheme from "../../context/ThemeContext";
import StudentMainContent from "../../components/student/StudentDashboardContent";
import StudentSidebar from "../../components/student/StudentDashboardSidebar";
import StudentNavbar from "../../components/student/StudentDasboardNavbar";

export default function StudentDashboard() {
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
        <StudentNavbar 
          toggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />
      </div>

      <div className="flex pt-16">
        <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] z-50">
        {/* Sidebar */}
        <StudentSidebar 
          open={isSidebarOpen} 
          isDark={isDark}
          onItemClick={closeSidebar}
        />
        </div>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'lg:ml-72' : 'lg:ml-72'
        }`}>
          <StudentMainContent isDark={isDark} />
        </div>
      </div>
    </div>
  );
}