// TeacherSidebar.js
import React, { useState } from 'react';
import { 
  Home,
  BookOpen, 
  Users, 
  ClipboardCheck, 
  Award, 
  FileText, 
  Calendar, 
  MessageSquare, 
  BarChart3,
  LogOut
} from 'lucide-react';

const TeacherSidebar = ({ open, isDark, onItemClick }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: Home, color: 'from-blue-500 to-blue-600' },
    { id: 'classes', label: 'My Classes', icon: BookOpen, color: 'from-indigo-500 to-indigo-600' },
    { id: 'students', label: 'Students', icon: Users, color: 'from-green-500 to-green-600' },
    { id: 'attendance', label: 'Attendance', icon: ClipboardCheck, color: 'from-teal-500 to-teal-600' },
    { id: 'grades', label: 'Grades', icon: Award, color: 'from-purple-500 to-purple-600' },
    { id: 'assignments', label: 'Assignments', icon: FileText, color: 'from-orange-500 to-orange-600' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, color: 'from-pink-500 to-pink-600' },
    { id: 'communications', label: 'Messages', icon: MessageSquare, color: 'from-cyan-500 to-cyan-600' },
    { id: 'reports', label: 'Reports', icon: BarChart3, color: 'from-red-500 to-red-600' }
  ];

  const handleItemClick = (itemId) => {
    setActiveTab(itemId);
    onItemClick();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onItemClick} />
      )}
      
      <aside
        className={`fixed top-16 left-0 z-50 w-64 h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:relative lg:top-0 lg:h-full`}
      >
        <div className={`h-full flex flex-col ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border-r shadow-lg`}>
          {/* Navigation Items */}
          <div className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group relative overflow-hidden ${
                    activeTab === item.id
                      ? `bg-gradient-to-r ${item.color} text-white shadow-md`
                      : isDark
                      ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon 
                    size={20} 
                    className={`${
                      activeTab === item.id ? "text-white" : ""
                    } transition-colors duration-200`}
                  />
                  <span className="ml-3 font-medium">{item.label}</span>
                  {activeTab === item.id && (
                    <div className="absolute right-3 w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* User Profile & Logout */}
          <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-3 mb-4 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-700">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-md">
                SJ
              </div>
              <div>
                <p className={`font-medium text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  Sarah Johnson
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Mathematics Teacher
                </p>
              </div>
            </div>
            <button className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
              isDark 
                ? "text-gray-300 hover:bg-red-900/20 hover:text-red-400" 
                : "text-gray-600 hover:bg-red-50 hover:text-red-600"
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

export default TeacherSidebar;