// adminMainContent.jsx
import React, { useState, useEffect } from "react";
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
  X,
} from "lucide-react";

const AdminDashboardStats = ({ isDark }) => {
  const statsCards = [
    {
      title: "Total Students",
      value: "1,234",
      change: "+5.2%",
      trend: "up",
      icon: GraduationCap,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      darkBgGradient: "from-blue-900/20 to-blue-800/20",
    },
    {
      title: "Total Teachers",
      value: "87",
      change: "+2.1%",
      trend: "up",
      icon: UserCheck,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
      darkBgGradient: "from-green-900/20 to-green-800/20",
    },
    {
      title: "Active Classes",
      value: "45",
      change: "0%",
      trend: "neutral",
      icon: BookOpen,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      darkBgGradient: "from-purple-900/20 to-purple-800/20",
    },
    {
      title: "Monthly Revenue",
      value: "$45,200",
      change: "+8.3%",
      trend: "up",
      icon: DollarSign,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
      darkBgGradient: "from-orange-900/20 to-orange-800/20",
    },
  ];

  const quickActions = [
    {
      label: "Add Student",
      icon: UserPlus,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      label: "Add Teacher",
      icon: UserCheck,
      gradient: "from-green-500 to-green-600",
    },
    {
      label: "Create Class",
      icon: Plus,
      gradient: "from-purple-500 to-purple-600",
    },
    {
      label: "Generate Report",
      icon: FileText,
      gradient: "from-orange-500 to-orange-600",
    },
  ];

  const recentActivities = [
    {
      action: "New student enrolled",
      user: "John Smith",
      time: "2 hours ago",
      type: "student",
    },
    {
      action: "Teacher assigned to Math Class",
      user: "Sarah Johnson",
      time: "4 hours ago",
      type: "teacher",
    },
    {
      action: "Fee payment received",
      user: "Emma Davis",
      time: "6 hours ago",
      type: "payment",
    },
    {
      action: "Attendance updated",
      user: "Class 10-A",
      time: "8 hours ago",
      type: "attendance",
    },
    {
      action: "New announcement posted",
      user: "Admin",
      time: "1 day ago",
      type: "announcement",
    },
  ];

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1
          className={`text-3xl font-bold mb-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Welcome back, Admin!
        </h1>
        <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Here's what's happening at your school today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className={`rounded-2xl shadow-xl border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
              isDark
                ? `bg-gradient-to-br ${stat.darkBgGradient} border-gray-700 backdrop-blur-sm`
                : `bg-gradient-to-br ${stat.bgGradient} border-gray-500`
            } p-6 relative overflow-hidden`}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}
              >
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div
                className={`flex items-center space-x-1 text-sm font-medium px-2 py-1 rounded-full ${
                  stat.trend === "up"
                    ? "text-gray-900 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
                    : stat.trend === "down"
                    ? "text-gray-900 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
                    : "text-gray-900 bg-gray-100 dark:text-gray-400 dark:bg-gray-800"
                }`}
              >
                {stat.trend === "up" && <TrendingUp className="h-3 w-3" />}
                <span>{stat.change}</span>
              </div>
            </div>
            <div>
              <p
                className={`text-3xl font-bold mb-1 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {stat.value}
              </p>
              <p
                className={`text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {stat.title}
              </p>
            </div>
            <div className="absolute -right-6 -bottom-6 opacity-20">
              <stat.icon className="h-24 w-24" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div
            className={`rounded-2xl shadow-xl border p-6 transition-colors duration-200 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h3
              className={`text-xl font-bold mb-6 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              Quick Actions
            </h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className={`w-full bg-gradient-to-r ${action.gradient} text-white cursor-pointer p-4 rounded-xl flex items-center space-x-3 transition-all duration-200 hover:scale-105 hover:shadow-lg group`}
                >
                  <action.icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div
            className={`rounded-2xl shadow-xl border p-6 transition-colors duration-200 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h3
              className={`text-xl font-bold mb-6 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              Upcoming Events
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl border border-yellow-200 dark:border-yellow-700">
                <Calendar className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <p
                    className={`font-semibold ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Parent-Teacher Meeting
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Tomorrow, 2:00 PM
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700">
                <Award className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p
                    className={`font-semibold ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Annual Sports Day
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Next Friday
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div
            className={`rounded-2xl shadow-xl border p-6 transition-colors duration-200 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                Recent Activities
              </h3>
              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 hover:scale-105 ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl ${
                      activity.type === "student"
                        ? "bg-blue-100 dark:bg-blue-900/30"
                        : activity.type === "teacher"
                        ? "bg-green-100 dark:bg-green-900/30"
                        : activity.type === "payment"
                        ? "bg-orange-100 dark:bg-orange-900/30"
                        : activity.type === "attendance"
                        ? "bg-purple-100 dark:bg-purple-900/30"
                        : "bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    {activity.type === "student" && (
                      <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    )}
                    {activity.type === "teacher" && (
                      <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                    )}
                    {activity.type === "payment" && (
                      <DollarSign className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    )}
                    {activity.type === "attendance" && (
                      <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    )}
                    {activity.type === "announcement" && (
                      <Bell className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {activity.action}
                    </p>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {activity.user}
                    </p>
                  </div>
                  <div
                    className={`flex items-center text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardStats;
