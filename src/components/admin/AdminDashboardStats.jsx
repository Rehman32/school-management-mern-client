// 
// client/src/components/adminMainContent.jsx
// ============================================

import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  UserCheck,
  BookOpen,
  DollarSign,
  TrendingUp,
  TrendingDown,
  UserPlus,
  Plus,
  FileText,
  Clock,
  Award,
  Calendar,
  Bell,
  Users,
} from "lucide-react";
import {
  getDashboardStatistics,
  getRecentActivities,
  getGradeDistribution,
} from "../../api/dashboardApi";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const AdminDashboardStats = ({ isDark }) => {
  const { user } = useAuth();
  const [statistics, setStatistics] = useState(null);
  const [activities, setActivities] = useState([]);
  const [gradeDistribution, setGradeDistribution] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, activitiesRes, gradeRes] = await Promise.all([
        getDashboardStatistics(),
        getRecentActivities(8),
        getGradeDistribution(),
      ]);

      setStatistics(statsRes.data.data);
      setActivities(activitiesRes.data.data || []);
      setGradeDistribution(gradeRes.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Format time ago
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return Math.floor(seconds) + " seconds ago";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          No data available
        </p>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Total Students",
      value: statistics.students.total.toLocaleString(),
      change: statistics.students.growth > 0 
        ? `+${statistics.students.growth}%` 
        : `${statistics.students.growth}%`,
      trend: statistics.students.growth > 0 ? "up" : statistics.students.growth < 0 ? "down" : "neutral",
      icon: GraduationCap,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      darkBgGradient: "from-blue-900/20 to-blue-800/20",
      subtitle: `${statistics.students.active} active`,
    },
    {
      title: "Total Teachers",
      value: statistics.teachers.total.toLocaleString(),
      change: statistics.teachers.growth > 0 
        ? `+${statistics.teachers.growth}%` 
        : `${statistics.teachers.growth}%`,
      trend: statistics.teachers.growth > 0 ? "up" : statistics.teachers.growth < 0 ? "down" : "neutral",
      icon: UserCheck,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
      darkBgGradient: "from-green-900/20 to-green-800/20",
      subtitle: `${statistics.teachers.active} active`,
    },
    {
      title: "Active Classes",
      value: statistics.classes.total.toLocaleString(),
      change: `${statistics.classes.enrolled}/${statistics.classes.capacity}`,
      trend: "neutral",
      icon: BookOpen,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      darkBgGradient: "from-purple-900/20 to-purple-800/20",
      subtitle: `${statistics.classes.available} seats available`,
    },
    {
      title: "Total Subjects",
      value: statistics.subjects.total.toLocaleString(),
      change: "Active",
      trend: "neutral",
      icon: FileText,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
      darkBgGradient: "from-orange-900/20 to-orange-800/20",
      subtitle: "Curriculum subjects",
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
          Welcome back, {user?.name || 'Admin'}!
        </h1>
        <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Here's what's happening at your school today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className={`rounded-2xl shadow-xl border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
              isDark
                ? `bg-gradient-to-br ${stat.darkBgGradient} border-gray-700 backdrop-blur-sm`
                : `bg-gradient-to-br ${stat.bgGradient} border-gray-200`
            } p-6 relative overflow-hidden`}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}
              >
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              {stat.trend !== "neutral" && (
                <div
                  className={`flex items-center space-x-1 text-sm font-medium px-2 py-1 rounded-full ${
                    stat.trend === "up"
                      ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
                      : "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{stat.change}</span>
                </div>
              )}
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
              {stat.subtitle && (
                <p
                  className={`text-xs mt-1 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {stat.subtitle}
                </p>
              )}
            </div>
            <div className="absolute -right-6 -bottom-6 opacity-10">
              <stat.icon className="h-24 w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* Gender Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div
          className={`rounded-2xl shadow-xl border p-6 ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <h3
            className={`text-lg font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Student Distribution
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                  Male Students
                </span>
                <span className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {statistics.students.male}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (statistics.students.male /
                        (statistics.students.male + statistics.students.female)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                  Female Students
                </span>
                <span className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {statistics.students.female}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-pink-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (statistics.students.female /
                        (statistics.students.male + statistics.students.female)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Grade Distribution */}
        <div
          className={`lg:col-span-2 rounded-2xl shadow-xl border p-6 ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <h3
            className={`text-lg font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Grade-wise Distribution
          </h3>
          {gradeDistribution.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gradeDistribution.map((grade) => (
                <div
                  key={grade._id}
                  className={`p-4 rounded-xl border ${
                    isDark
                      ? "bg-gray-700 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div
                    className={`text-2xl font-bold mb-1 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {grade._id}
                  </div>
                  <div
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {grade.classCount} class(es)
                  </div>
                  <div
                    className={`text-xs mt-1 ${
                      isDark ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    {grade.totalEnrolled}/{grade.totalCapacity} students
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              No grade data available
            </p>
          )}
        </div>
      </div>

      {/* Recent Activities */}
      <div
        className={`rounded-2xl shadow-xl border p-6 ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
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
          <button
            onClick={fetchDashboardData}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200"
          >
            Refresh
          </button>
        </div>
        {activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((activity, index) => (
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
                      : "bg-purple-100 dark:bg-purple-900/30"
                  }`}
                >
                  {activity.type === "student" && (
                    <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  )}
                  {activity.type === "teacher" && (
                    <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                  )}
                  {activity.type === "class" && (
                    <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
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
                  {timeAgo(activity.time)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p
            className={`text-center py-8 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            No recent activities
          </p>
        )}
      </div>
    </>
  );
};

export default AdminDashboardStats;
