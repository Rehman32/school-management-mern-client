
// client/src/components/adminNavbar.jsx
// ============================================

import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  School,
  Bell,
  User,
  Search,
  Sun,
  Moon,
  X,
  LogOut,
  Settings,
  ChevronDown,
  GraduationCap,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../../api/settingsApi';
import { toast } from 'react-hot-toast';

const Navbar = ({ toggleSidebar, isSidebarOpen, isDark, toggleTheme }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [schoolProfile, setSchoolProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  // Fetch school profile on mount
  useEffect(() => {
    fetchSchoolProfile();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSchoolProfile = async () => {
    try {
      const res = await getProfile();
      setSchoolProfile(res.data.data || res.data);
    } catch (err) {
      console.error('Failed to load school profile:', err);
    }
  };

  // Search functionality
  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      // This is a placeholder - implement actual search API
      // For now, just show a message
      setSearchResults([
        {
          type: 'info',
          message: 'Search functionality coming soon',
        },
      ]);
      setShowSearchResults(true);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  // Mock notifications - replace with real data
  useEffect(() => {
    setNotifications([
      {
        id: 1,
        type: 'student',
        title: 'New Student Enrollment',
        message: 'John Doe has been enrolled',
        time: '2 hours ago',
        read: false,
      },
      {
        id: 2,
        type: 'teacher',
        title: 'Teacher Assignment',
        message: 'Sarah assigned to Math Class',
        time: '4 hours ago',
        read: false,
      },
      {
        id: 3,
        type: 'system',
        title: 'System Update',
        message: 'New features are available',
        time: '1 day ago',
        read: true,
      },
    ]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav
      className={`${
        isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      } shadow-lg border-b transition-colors duration-200 sticky top-0 z-50`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 lg:hidden ${
                isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="flex items-center space-x-3">
              {schoolProfile?.logo ? (
                <img
                  src={schoolProfile.logo}
                  alt="School Logo"
                  className="h-10 w-10 rounded-xl object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className={`p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl ${
                  schoolProfile?.logo ? 'hidden' : 'flex'
                }`}
              >
                <School className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2
                  className={`text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}
                >
                  {schoolProfile?.name || 'EduManage'}
                </h2>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  School Management System
                </p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative w-64 hidden md:block" ref={searchRef}>
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                  isDark ? 'text-gray-400' : 'text-gray-400'
                }`}
              />
              <input
                type="text"
                placeholder="Search students, teachers..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                className={`w-full pl-10 pr-4 py-2 rounded-xl border transition-all duration-200 ${
                  isDark
                    ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
                } focus:ring-2 focus:border-transparent`}
              />

              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div
                  className={`absolute top-full mt-2 w-full rounded-xl shadow-2xl border overflow-hidden ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 cursor-pointer transition-colors ${
                        isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      }`}
                    >
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {result.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
                isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`flex items-center justify-center w-10 h-10 rounded-xl relative transition-all duration-200 ${
                  isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                }`}
                aria-label="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div
                  className={`absolute right-0 top-full mt-2 w-80 rounded-xl shadow-2xl border overflow-hidden ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  <div
                    className={`p-4 border-b font-semibold ${
                      isDark ? 'border-gray-700 text-white' : 'border-gray-200 text-gray-900'
                    }`}
                  >
                    Notifications ({unreadCount} unread)
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b cursor-pointer transition-colors ${
                            isDark
                              ? 'border-gray-700 hover:bg-gray-700'
                              : 'border-gray-200 hover:bg-gray-50'
                          } ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className={`p-2 rounded-lg ${
                                notification.type === 'student'
                                  ? 'bg-blue-100 dark:bg-blue-900/30'
                                  : notification.type === 'teacher'
                                  ? 'bg-green-100 dark:bg-green-900/30'
                                  : 'bg-gray-100 dark:bg-gray-700'
                              }`}
                            >
                              {notification.type === 'student' && (
                                <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              )}
                              {notification.type === 'teacher' && (
                                <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                              )}
                              {notification.type === 'system' && (
                                <Bell className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p
                                className={`text-sm font-medium ${
                                  isDark ? 'text-white' : 'text-gray-900'
                                }`}
                              >
                                {notification.title}
                              </p>
                              <p
                                className={`text-xs ${
                                  isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}
                              >
                                {notification.message}
                              </p>
                              <p
                                className={`text-xs mt-1 ${
                                  isDark ? 'text-gray-500' : 'text-gray-500'
                                }`}
                              >
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                          No notifications
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative" ref={profileRef}>
              <div
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <User size={20} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
                </div>
                <div className="hidden sm:block">
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {user?.name || 'Admin User'}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {user?.email || 'admin@school.com'}
                  </p>
                </div>
                <ChevronDown
                  size={16}
                  className={`hidden sm:block ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                />
              </div>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div
                  className={`absolute right-0 top-full mt-2 w-56 rounded-xl shadow-2xl border overflow-hidden ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  <div
                    className={`p-4 border-b ${
                      isDark ? 'border-gray-700' : 'border-gray-200'
                    }`}
                  >
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {user?.name || 'Admin User'}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {user?.email || 'admin@school.com'}
                    </p>
                    <p
                      className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${
                        isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {user?.role || 'admin'}
                    </p>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate('/admin/settings');
                        setShowProfileMenu(false);
                      }}
                      className={`w-full px-4 py-3 flex items-center space-x-3 transition-colors ${
                        isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <Settings size={18} />
                      <span className="text-sm">Settings</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className={`w-full px-4 py-3 flex items-center space-x-3 transition-colors text-red-600 dark:text-red-400 ${
                        isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      }`}
                    >
                      <LogOut size={18} />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
