// TeacherMainContent.js
import React from 'react';
import { 
  BookOpen, 
  Users, 
  FileText, 
  Award, 
  TrendingUp, 
  ClipboardCheck, 
  Plus, 
  MessageSquare, 
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react';

const TeacherMainContent = ({ isDark }) => {
  const statsCards = [
    {
      title: 'My Classes',
      value: '6',
      change: '+1',
      trend: 'up',
      icon: BookOpen,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      darkBgGradient: 'from-blue-900/20 to-blue-800/20'
    },
    {
      title: 'Total Students',
      value: '124',
      change: '+3',
      trend: 'up',
      icon: Users,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      darkBgGradient: 'from-green-900/20 to-green-800/20'
    },
    {
      title: 'Assignments Due',
      value: '8',
      change: '-2',
      trend: 'down',
      icon: FileText,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      darkBgGradient: 'from-orange-900/20 to-orange-800/20'
    },
    {
      title: 'Average Grade',
      value: '85%',
      change: '+2%',
      trend: 'up',
      icon: Award,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      darkBgGradient: 'from-purple-900/20 to-purple-800/20'
    }
  ];

  const todaySchedule = [
    { time: '08:00 AM', class: 'Mathematics 10-A', room: 'Room 201', status: 'completed' },
    { time: '09:30 AM', class: 'Physics 11-B', room: 'Lab 1', status: 'completed' },
    { time: '11:00 AM', class: 'Mathematics 10-B', room: 'Room 203', status: 'ongoing' },
    { time: '01:00 PM', class: 'Physics 12-A', room: 'Lab 2', status: 'upcoming' },
    { time: '02:30 PM', class: 'Study Hall', room: 'Library', status: 'upcoming' }
  ];

  const recentActivities = [
    { action: 'Graded Math Quiz', class: 'Class 10-A', time: '2 hours ago', type: 'grade' },
    { action: 'Updated Attendance', class: 'Class 11-B', time: '4 hours ago', type: 'attendance' },
    { action: 'Posted Assignment', class: 'Class 10-B', time: '6 hours ago', type: 'assignment' },
    { action: 'Parent Message Reply', student: 'John Smith', time: '8 hours ago', type: 'message' }
  ];

  const quickActions = [
    { label: 'Take Attendance', icon: ClipboardCheck, gradient: 'from-green-500 to-green-600' },
    { label: 'Create Assignment', icon: Plus, gradient: 'from-blue-500 to-blue-600' },
    { label: 'Grade Papers', icon: Award, gradient: 'from-purple-500 to-purple-600' },
    { label: 'Send Message', icon: MessageSquare, gradient: 'from-orange-500 to-orange-600' }
  ];

  const upcomingDeadlines = [
    { task: 'Grade Science Projects', class: 'Class 11-A', due: 'Tomorrow', priority: 'high' },
    { task: 'Submit Progress Reports', class: 'All Classes', due: '2 days', priority: 'medium' },
    { task: 'Parent-Teacher Meetings', class: 'Class 10-B', due: '3 days', priority: 'low' }
  ];

  const classPerformance = [
    { class: 'Math 10-A', score: 88, color: 'green' },
    { class: 'Physics 11-B', score: 82, color: 'blue' },
    { class: 'Math 10-B', score: 76, color: 'orange' }
  ];

  const getStatusStyles = (status) => {
    switch (status) {
      case 'completed':
        return {
          bg: isDark ? 'bg-green-900/30' : 'bg-green-50',
          border: 'border-l-green-500',
          badge: isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800'
        };
      case 'ongoing':
        return {
          bg: isDark ? 'bg-blue-900/30' : 'bg-blue-50',
          border: 'border-l-blue-500',
          badge: isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'
        };
      default:
        return {
          bg: isDark ? 'bg-gray-700' : 'bg-gray-50',
          border: 'border-l-gray-400',
          badge: isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-800'
        };
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getPriorityBg = (priority) => {
    switch (priority) {
      case 'high':
        return isDark ? 'bg-red-900/20' : 'bg-red-50';
      case 'medium':
        return isDark ? 'bg-yellow-900/20' : 'bg-yellow-50';
      default:
        return isDark ? 'bg-green-900/20' : 'bg-green-50';
    }
  };

  return (
    <main className={`p-6 min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Good morning, Sarah! 🌟
        </h1>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Ready for another great day of teaching? Let's make it count!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className={`rounded-xl shadow-lg border transition-all duration-300 hover:scale-105 hover:shadow-xl ${
              isDark 
                ? `bg-gradient-to-br ${stat.darkBgGradient} border-gray-700 backdrop-blur-sm`
                : `bg-gradient-to-br ${stat.bgGradient} border-white`
            } p-6 relative overflow-hidden`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div
                className={`flex items-center space-x-1 text-sm font-medium px-2 py-1 rounded-full ${
                  stat.trend === "up"
                    ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
                    : stat.trend === "down"
                    ? "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
                    : "text-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-800"
                }`}
              >
                {stat.trend === "up" && <TrendingUp className="h-3 w-3" />}
                <span>{stat.change}</span>
              </div>
            </div>
            <div>
              <p className={`text-2xl font-bold mb-1 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {stat.value}
              </p>
              <p className={`text-sm font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {stat.title}
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <stat.icon className="h-20 w-20" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Today's Schedule & Recent Activities */}
        <div className="lg:col-span-8 space-y-6">
          {/* Today's Schedule */}
          <div className={`rounded-xl shadow-lg border p-6 transition-colors duration-200 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              Today's Schedule
            </h3>
            <div className="space-y-3">
              {todaySchedule.map((item, index) => {
                const styles = getStatusStyles(item.status);
                return (
                  <div key={index} className={`flex items-center space-x-4 p-4 rounded-lg border-l-4 transition-all duration-200 hover:scale-105 ${styles.bg} ${styles.border}`}>
                    <div className={`text-sm font-bold w-20 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {item.time}
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {item.class}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.room}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${styles.badge}`}>
                      {item.status}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activities */}
          <div className={`rounded-xl shadow-lg border p-6 transition-colors duration-200 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
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
                  className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-200 hover:scale-105 ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-3 rounded-lg ${
                    activity.type === 'grade' ? (isDark ? 'bg-purple-900/30' : 'bg-purple-100') :
                    activity.type === 'attendance' ? (isDark ? 'bg-green-900/30' : 'bg-green-100') :
                    activity.type === 'assignment' ? (isDark ? 'bg-blue-900/30' : 'bg-blue-100') :
                    isDark ? 'bg-orange-900/30' : 'bg-orange-100'
                  }`}>
                    {activity.type === 'grade' && <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
                    {activity.type === 'attendance' && <ClipboardCheck className="h-4 w-4 text-green-600 dark:text-green-400" />}
                    {activity.type === 'assignment' && <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                    {activity.type === 'message' && <MessageSquare className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {activity.action}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {activity.class || activity.student}
                    </p>
                  </div>
                  <div className={`flex items-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Clock className="h-4 w-4 mr-1" />
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <div className={`rounded-xl shadow-lg border p-6 transition-colors duration-200 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className={`bg-gradient-to-r ${action.gradient} text-white p-4 rounded-lg flex flex-col items-center space-y-2 transition-all duration-200 hover:scale-105 hover:shadow-lg group`}
                >
                  <action.icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-xs font-medium text-center leading-tight">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className={`rounded-xl shadow-lg border p-6 transition-colors duration-200 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              Upcoming Deadlines
            </h3>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className={`flex items-start space-x-3 p-4 rounded-lg transition-all duration-200 hover:scale-105 ${getPriorityBg(deadline.priority)}`}>
                  <div className="mt-1">
                    {getPriorityIcon(deadline.priority)}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {deadline.task}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {deadline.class}
                    </p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      Due in {deadline.due}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Class Performance */}
          <div className={`rounded-xl shadow-lg border p-6 transition-colors duration-200 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              Class Performance
            </h3>
            <div className="space-y-6">
              {classPerformance.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {item.class}
                    </span>
                    <span className={`text-sm font-bold ${
                      item.color === 'green' ? 'text-green-600 dark:text-green-400' :
                      item.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                      'text-orange-600 dark:text-orange-400'
                    }`}>
                      {item.score}%
                    </span>
                  </div>
                  <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        item.color === 'green' ? 'bg-green-500' :
                        item.color === 'blue' ? 'bg-blue-500' :
                        'bg-orange-500'
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TeacherMainContent;