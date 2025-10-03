// pages/adminDashboard.jsx
import { useState } from "react";
import useTheme from "../../context/ThemeContext";
import Navbar from '../../components/admin/AdminNavbar';
import Sidebar from '../../components/admin/AdminSidebar';
import MainContent from '../../components/admin/AdminMainContent';

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  // Add activeTab state here
  const [activeTab, setActiveTab] = useState("overview");

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
        <Navbar 
          toggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />
      </div>

      <div className="flex pt-16">
        {/* Sidebar */}
        <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] z-50">
          <Sidebar 
            open={isSidebarOpen} 
            isDark={isDark}
            onItemClick={closeSidebar}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'lg:ml-72' : 'lg:ml-72'
        }`}>
          <MainContent isDark={isDark} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </div>
  );
}