// StudentMainContent.js
import React from 'react';
import { 
  Award,
  ClipboardCheck,
  FileText,
  BookOpen,
  TrendingUp,
  Upload,
  Download,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const StudentMainContent = ({ isDark }) => {
  const statsCards = [
    {
      title: 'Current GPA',
      value: '3.8',
      change: '+0.2',
      trend: 'up',
      icon: Award,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      darkBgGradient: 'from-green-900/20 to-green-800/20'
    },
    {
      title: 'Attendance',
      value: '92%',
      change: '+3%',
      trend: 'up',
      icon: ClipboardCheck,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      darkBgGradient: 'from-blue-900/20 to-blue-800/20'
    },
    {
      title: 'Pending Tasks',
      value: '5',
      change: '-2',
      trend: 'down',
      icon: FileText,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      darkBgGradient: 'from-orange-900/20 to-orange-800/20'
    },
    {
      title: 'Completed Courses',
      value: '12',
      change: '+1',
      trend: 'up',
      icon: BookOpen,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      darkBgGradient: 'from-purple-900/20 to-purple-800/20'
    }
  ];

  const todaySchedule = [
    { time: '08:00 AM', subject: 'Mathematics', teacher: 'Ms. Johnson', room: 'Room 201', status: 'completed' },
    { time: '09:30 AM', subject: 'Physics', teacher: 'Mr. Smith', room: 'Lab 1', status: 'completed' },
    { time: '11:00 AM', subject: 'English Literature', teacher: 'Mrs. Davis', room: 'Room 105', status: 'ongoing' },
    { time: '01:00 PM', subject: 'Chemistry', teacher: 'Dr. Wilson', room: 'Lab 2', status: 'upcoming' },
    { time: '02:30 PM', subject: 'History', teacher: 'Mr. Brown', room: 'Room 301', status: 'upcoming' }
  ];

  const recentGrades = [
    { subject: 'Mathematics', assignment: 'Quiz 3', grade: 'A-', points: '88/100', date: '2 days ago' },
    { subject: 'Physics', assignment: 'Lab Practical', grade: 'B+', points: '85/100', date: '4 days ago' },
    { subject: 'Chemistry', assignment: 'Midterm Exam', grade: 'A', points: '95/100', date: '1 week ago' },
    { subject: 'English', assignment: 'Essay Analysis', grade: 'A-', points: '90/100', date: '1 week ago' }
  ];

  const quickActions = [
    { label: 'Submit Assignment', icon: Upload, gradient: 'from-blue-500 to-blue-600' },
    { label: 'View Grades', icon: Award, gradient: 'from-green-500 to-green-600' },
    { label: 'Download Materials', icon: Download, gradient: 'from-purple-500 to-purple-600' },
    { label: 'Message Teacher', icon: MessageSquare, gradient: 'from-orange-500 to-orange-600' }
  ];

  const upcomingAssignments = [
    { 
      subject: 'Mathematics', 
      title: 'Calculus Problem Set', 
      dueDate: 'Tomorrow', 
      priority: 'high',
      status: 'pending'
    },
    { 
      subject: 'Physics', 
      title: 'Lab Report - Motion', 
      dueDate: '2 days', 
      priority: 'medium',
      status: 'in-progress'
    },
    { 
      subject: 'English', 
      title: 'Essay on Shakespeare', 
      dueDate: '5 days', 
      priority: 'low',
      status: 'not-started'
    }
  ];

  const announcements = [
    { 
      title: 'Parent-Teacher Conference',
      content: 'Scheduled for next Friday. Please inform your parents.',
      time: '2 hours ago',
      priority: 'high'
    },
    { 
      title: 'Library Hours Extended',
      content: 'Library will be open until 8 PM during exam week.',
      time: '1 day ago',
      priority: 'medium'
    },
    { 
      title: 'Sports Day Registration',
      content: 'Register for annual sports day by Friday.',
      time: '2 days ago',
      priority: 'low'
    }
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

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) {
      return isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800';
    } else if (grade.startsWith('B')) {
      return isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800';
    } else {
      return isDark ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      case 'medium':
        return <Clock className="h-3 w-3 text-yellow-500" />;
      default:
        return <CheckCircle className="h-3 w-3 text-green-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800';
      case 'in-progress':
        return isDark ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-800';
      default:
        return isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityDot = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
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
          Welcome back, John! 📚
        </h1>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Keep up the great work! Your academic journey continues to shine.
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
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Today's Schedule */}
          <div className={`rounded-xl shadow-lg border p-6 transition-colors duration-200 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              Today's Classes
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
                        {item.subject}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.teacher} • {item.room}
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

          {/* Recent Grades */}
          <div className={`rounded-xl shadow-lg border p-6 transition-colors duration-200 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                Recent Grades
              </h3>
              <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium transition-colors duration-200">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Subject
                    </th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Assignment
                    </th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Grade
                    </th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Points
                    </th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className={`${isDark ? 'divide-gray-700' : 'divide-gray-200'} divide-y`}>
                  {recentGrades.map((grade, index) => (
                    <tr key={index} className={`transition-colors duration-200 ${
                      isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}>
                      <td className={`px-4 py-3 text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                        {grade.subject}
                      </td>
                      <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {grade.assignment}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getGradeColor(grade.grade)}`}>
                          {grade.grade}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {grade.points}
                      </td>
                      <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {grade.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

          {/* Upcoming Assignments */}
          <div className={`rounded-xl shadow-lg border p-6 transition-colors duration-200 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              Upcoming Assignments
            </h3>
            <div className="space-y-4">
              {upcomingAssignments.map((assignment, index) => (
                <div key={index} className={`border rounded-lg p-4 transition-all duration-200 hover:scale-105 hover:shadow-md ${
                  isDark ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {assignment.title}
                      </p>
                      <p className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {assignment.subject}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        Due in {assignment.dueDate}
                      </p>
                    </div>
                    <div className={`p-2 rounded-full ${
                      assignment.priority === 'high' ? (isDark ? 'bg-red-900/30' : 'bg-red-100') :
                      assignment.priority === 'medium' ? (isDark ? 'bg-yellow-900/30' : 'bg-yellow-100') :
                      isDark ? 'bg-green-900/30' : 'bg-green-100'
                    }`}>
                      {getPriorityIcon(assignment.priority)}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${getStatusColor(assignment.status)}`}>
                    {assignment.status.replace('-', ' ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div className={`rounded-xl shadow-lg border p-6 transition-colors duration-200 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              Announcements
            </h3>
            <div className="space-y-4">
              {announcements.map((announcement, index) => (
                <div key={index} className={`border-l-4 border-indigo-500 pl-4 py-3 rounded-r-lg transition-all duration-200 hover:scale-105 ${
                  isDark ? 'bg-gray-700' : 'bg-indigo-50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className={`font-semibold text-sm mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {announcement.title}
                      </p>
                      <p className={`text-xs mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {announcement.content}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {announcement.time}
                      </p>
                    </div>
                    <div className={`w-3 h-3 rounded-full mt-1 ${getPriorityDot(announcement.priority)}`} />
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

export default StudentMainContent;