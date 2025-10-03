//adminNavbar.jsx
import React, { useState, useEffect } from 'react';
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


// Enhanced Navbar Component
const Navbar = ({ toggleSidebar, isSidebarOpen, isDark, toggleTheme }) => {
  return (
    <nav className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} shadow-lg border-b transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <button
              className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 lg:hidden ${
                isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
              onClick={toggleSidebar}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <School className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className={`text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                  EduManage
                </h2>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  School Management System
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative w-64 hidden md:block">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search students, teachers..."
                className={`w-full pl-10 pr-4 py-2 rounded-xl border transition-all duration-200 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
                } focus:ring-2 focus:border-transparent`}
              />
            </div>
            
            <button
              onClick={toggleTheme}
              className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
                isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button className={`flex items-center justify-center w-10 h-10 rounded-xl relative transition-all duration-200 ${
              isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
            }`}>
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                3
              </span>
            </button>
            
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
              }`}>
                <User size={20} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
              </div>
              <div className="hidden sm:block">
                <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Admin User</p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>admin@edumanage.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;