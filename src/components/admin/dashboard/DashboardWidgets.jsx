// ============================================
// DASHBOARD WIDGETS
// client/src/components/admin/dashboard/DashboardWidgets.jsx
// Quick stats, recent activities, and reminders
// ============================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  Calendar,
  Bell,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

// Quick Stats Card
export const QuickStatsCard = ({ title, value, icon: Icon, trend, trendValue, color, onClick, isDark }) => {
  const colorClasses = {
    blue: isDark ? 'from-blue-600 to-blue-700' : 'from-blue-500 to-blue-600',
    purple: isDark ? 'from-purple-600 to-purple-700' : 'from-purple-500 to-purple-600',
    green: isDark ? 'from-green-600 to-green-700' : 'from-green-500 to-green-600',
    orange: isDark ? 'from-orange-600 to-orange-700' : 'from-orange-500 to-orange-600',
    pink: isDark ? 'from-pink-600 to-pink-700' : 'from-pink-500 to-pink-600',
    cyan: isDark ? 'from-cyan-600 to-cyan-700' : 'from-cyan-500 to-cyan-600',
  };

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${colorClasses[color] || colorClasses.blue} text-white shadow-lg hover:shadow-xl transition-all cursor-pointer group`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend === 'up' ? 'text-green-300' : 'text-red-300'}`}>
              {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
          <Icon size={24} />
        </div>
      </div>
      <div className="absolute -bottom-6 -right-6 opacity-10">
        <Icon size={100} />
      </div>
    </div>
  );
};

// Recent Activity Item
export const RecentActivityItem = ({ activity, isDark }) => {
  const { type, title, description, time, icon: Icon, status } = activity;
  
  const statusColors = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <div className={`flex items-start gap-4 p-4 rounded-xl transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
      <div className={`p-2 rounded-lg ${statusColors[status] || statusColors.info}`}>
        {Icon && <Icon size={16} className="text-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</p>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>
      </div>
      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} whitespace-nowrap`}>
        {time}
      </span>
    </div>
  );
};

// Reminder Card
export const ReminderCard = ({ reminder, isDark }) => {
  const priorityColors = {
    high: isDark ? 'border-red-500 bg-red-900/20' : 'border-red-500 bg-red-50',
    medium: isDark ? 'border-yellow-500 bg-yellow-900/20' : 'border-yellow-500 bg-yellow-50',
    low: isDark ? 'border-blue-500 bg-blue-900/20' : 'border-blue-500 bg-blue-50',
  };

  return (
    <div className={`p-4 rounded-xl border-l-4 ${priorityColors[reminder.priority] || priorityColors.low}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{reminder.title}</p>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{reminder.description}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          reminder.priority === 'high' ? 'bg-red-500 text-white' :
          reminder.priority === 'medium' ? 'bg-yellow-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          {reminder.dueDate}
        </span>
      </div>
    </div>
  );
};

// Upcoming Events Widget
export const UpcomingEventsWidget = ({ events = [], isDark }) => {
  const navigate = useNavigate();

  return (
    <div className={`rounded-2xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Upcoming Events
        </h3>
        <Calendar size={20} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
      </div>

      {events.length > 0 ? (
        <div className="space-y-3">
          {events.slice(0, 5).map((event, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}
            >
              <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center ${
                isDark ? 'bg-purple-900/50 text-purple-400' : 'bg-purple-100 text-purple-600'
              }`}>
                <span className="text-lg font-bold">{new Date(event.date).getDate()}</span>
                <span className="text-xs">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{event.title}</p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{event.time || 'All day'}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Calendar size={32} className={`mx-auto mb-2 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>No upcoming events</p>
        </div>
      )}
    </div>
  );
};

// Fee Collection Widget
export const FeeCollectionWidget = ({ stats, isDark }) => {
  const collected = stats?.collected || 0;
  const pending = stats?.pending || 0;
  const total = collected + pending;
  const percentage = total > 0 ? ((collected / total) * 100).toFixed(0) : 0;

  return (
    <div className={`rounded-2xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Fee Collection
        </h3>
        <CreditCard size={20} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Collected</span>
          <span className={isDark ? 'text-white' : 'text-gray-900'}>{percentage}%</span>
        </div>
        <div className={`w-full h-3 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={`p-3 rounded-xl ${isDark ? 'bg-green-900/20' : 'bg-green-50'}`}>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Collected</p>
          <p className={`text-lg font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
            ₹{(collected / 1000).toFixed(0)}K
          </p>
        </div>
        <div className={`p-3 rounded-xl ${isDark ? 'bg-red-900/20' : 'bg-red-50'}`}>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Pending</p>
          <p className={`text-lg font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
            ₹{(pending / 1000).toFixed(0)}K
          </p>
        </div>
      </div>
    </div>
  );
};

// Attendance Overview Widget
export const AttendanceOverviewWidget = ({ stats, isDark }) => {
  const present = stats?.presentPercentage || 0;

  return (
    <div className={`rounded-2xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Today's Attendance
        </h3>
        <Users size={20} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
      </div>

      <div className="flex items-center justify-center">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke={isDark ? '#374151' : '#e5e7eb'}
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${present * 3.52} 352`}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {present}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="text-center">
          <p className={`text-lg font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>{stats?.present || 0}</p>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Present</p>
        </div>
        <div className="text-center">
          <p className={`text-lg font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>{stats?.absent || 0}</p>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Absent</p>
        </div>
        <div className="text-center">
          <p className={`text-lg font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>{stats?.late || 0}</p>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Late</p>
        </div>
      </div>
    </div>
  );
};

export default {
  QuickStatsCard,
  RecentActivityItem,
  ReminderCard,
  UpcomingEventsWidget,
  FeeCollectionWidget,
  AttendanceOverviewWidget
};
