// ============================================
// ADMIN NAVBAR - ENHANCED WITH REAL FUNCTIONALITY
// client/src/components/admin/AdminNavbar.jsx
// ============================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Loader2,
  Check,
  CheckCheck,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../../api/settingsApi';
import { globalSearch } from '../../api/searchApi';
import { getNotifications, markAsRead, markAllAsRead, getUnreadCount } from '../../api/notificationApi';
import { toast } from 'react-hot-toast';

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const Navbar = ({ toggleSidebar, isSidebarOpen, isDark, toggleTheme }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [schoolProfile, setSchoolProfile] = useState(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Profile & notifications state
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifLoading, setNotifLoading] = useState(false);

  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch school profile on mount
  useEffect(() => {
    fetchSchoolProfile();
    fetchUnreadCount();
  }, []);

  // Real search implementation
  useEffect(() => {
    if (debouncedSearch.length >= 2) {
      performSearch(debouncedSearch);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [debouncedSearch]);

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

  const fetchUnreadCount = async () => {
    try {
      const res = await getUnreadCount();
      setUnreadCount(res.data?.data?.count || 0);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  };

  const fetchNotifications = async () => {
    setNotifLoading(true);
    try {
      const res = await getNotifications({ limit: 10 });
      setNotifications(res.data?.data?.notifications || []);
      setUnreadCount(res.data?.data?.unreadCount || 0);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setNotifLoading(false);
    }
  };

  const performSearch = async (query) => {
    setSearchLoading(true);
    try {
      const res = await globalSearch(query, 'all', 8);
      const results = res.data?.data?.results || [];
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleResultClick = (result) => {
    setShowSearchResults(false);
    setSearchQuery('');
    navigate(result.url);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      try {
        await markAsRead(notification._id);
        setUnreadCount(prev => Math.max(0, prev - 1));
        setNotifications(prev => 
          prev.map(n => n._id === notification._id ? { ...n, read: true } : n)
        );
      } catch (err) {
        console.error('Failed to mark as read:', err);
      }
    }
    
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setShowNotifications(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleNotificationOpen = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      fetchNotifications();
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'enrollment':
        return <GraduationCap className="h-4 w-4 text-blue-500" />;
      case 'fee_due':
      case 'fee_paid':
        return <span className="text-sm">💰</span>;
      case 'attendance':
        return <UserCheck className="h-4 w-4 text-green-500" />;
      case 'exam':
        return <span className="text-sm">📝</span>;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

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
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                className={`w-full pl-10 pr-4 py-2 rounded-xl border transition-all duration-200 ${
                  isDark
                    ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
                } focus:ring-2 focus:border-transparent`}
              />
              {searchLoading && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
              )}

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div
                  className={`absolute top-full mt-2 w-full rounded-xl shadow-2xl border overflow-hidden ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <div
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className={`p-3 cursor-pointer transition-colors flex items-center gap-3 ${
                          isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-xl">{result.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {result.title}
                          </p>
                          <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {result.subtitle}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {result.type}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center">
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        No results found for "{searchQuery}"
                      </p>
                    </div>
                  )}
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
                onClick={handleNotificationOpen}
                className={`flex items-center justify-center w-10 h-10 rounded-xl relative transition-all duration-200 ${
                  isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                }`}
                aria-label="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
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
                  <div className={`p-4 border-b flex justify-between items-center ${
                    isDark ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1"
                      >
                        <CheckCheck size={14} /> Mark all read
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifLoading ? (
                      <div className="p-8 text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                      </div>
                    ) : notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification._id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-4 border-b cursor-pointer transition-colors ${
                            isDark
                              ? 'border-gray-700 hover:bg-gray-700'
                              : 'border-gray-100 hover:bg-gray-50'
                          } ${!notification.read ? (isDark ? 'bg-blue-900/10' : 'bg-blue-50/50') : ''}`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${
                              isDark ? 'bg-gray-700' : 'bg-gray-100'
                            }`}>
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${
                                isDark ? 'text-white' : 'text-gray-900'
                              }`}>
                                {notification.title}
                              </p>
                              <p className={`text-xs mt-0.5 ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {notification.message}
                              </p>
                              <p className={`text-xs mt-1 ${
                                isDark ? 'text-gray-500' : 'text-gray-400'
                              }`}>
                                {formatTime(notification.createdAt)}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className={`h-8 w-8 mx-auto mb-2 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                          No notifications yet
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
                    {user?.role || 'admin'}
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
                  <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {user?.name || 'Admin User'}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {user?.email || 'admin@school.com'}
                    </p>
                    <p className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${
                      isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
                    }`}>
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
                      className={`w-full px-4 py-3 flex items-center space-x-3 transition-colors text-red-500 ${
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
