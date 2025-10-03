// TeacherNavbar.js
import React from 'react';
import { 
  Bell, 
  Search, 
  School, 
  Sun, 
  Moon, 
  User,
  Menu,
  X
} from "lucide-react";

const TeacherNavbar = ({ toggleSidebar, isSidebarOpen, isDark, toggleTheme }) => {
  return (
    <nav className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <button
              className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 lg:hidden ${
                isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
              onClick={toggleSidebar}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                <School className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  EduManage
                </h2>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Teacher Portal
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative w-64 hidden md:block">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search students, classes..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-all duration-200 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
                } focus:ring-2 focus:border-transparent`}
              />
            </div>
            
            <button
              onClick={toggleTheme}
              className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
                isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button className={`flex items-center justify-center w-10 h-10 rounded-lg relative transition-all duration-200 ${
              isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
            }`}>
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                3
              </span>
            </button>
            
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-white bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg`}>
                SJ
              </div>
              <div className="hidden sm:block">
                <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  Sarah Johnson
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Mathematics Teacher
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TeacherNavbar;