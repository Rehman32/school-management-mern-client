// ============================================
// EMPTY STATE COMPONENT
// client/src/components/common/EmptyState.jsx
// Reusable empty state for lists with no data
// ============================================

import React from 'react';
import { 
  Users, 
  FileText, 
  Calendar, 
  CreditCard, 
  BookOpen,
  GraduationCap,
  ClipboardList,
  Search,
  Inbox
} from 'lucide-react';

const ICONS = {
  students: Users,
  teachers: Users,
  classes: BookOpen,
  fees: CreditCard,
  attendance: Calendar,
  exams: ClipboardList,
  grades: GraduationCap,
  documents: FileText,
  search: Search,
  default: Inbox,
};

const EmptyState = ({
  type = 'default',
  title,
  message,
  action,
  actionLabel,
  isDark = false,
  icon: CustomIcon,
}) => {
  const Icon = CustomIcon || ICONS[type] || ICONS.default;
  
  const defaultMessages = {
    students: { title: 'No Students Found', message: 'Add your first student to get started.' },
    teachers: { title: 'No Teachers Found', message: 'Add teachers to your school.' },
    classes: { title: 'No Classes Found', message: 'Create classes to organize students.' },
    fees: { title: 'No Fee Records', message: 'No fee records available.' },
    attendance: { title: 'No Attendance Data', message: 'No attendance records for this period.' },
    exams: { title: 'No Exams Scheduled', message: 'Create an exam to get started.' },
    grades: { title: 'No Grades Available', message: 'No grades have been entered yet.' },
    documents: { title: 'No Documents', message: 'No documents have been uploaded.' },
    search: { title: 'No Results', message: 'Try adjusting your search criteria.' },
    default: { title: 'No Data', message: 'Nothing to show here yet.' },
  };

  const defaults = defaultMessages[type] || defaultMessages.default;

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${
      isDark ? 'text-gray-400' : 'text-gray-500'
    }`}>
      {/* Icon */}
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
        isDark ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <Icon size={32} className={isDark ? 'text-gray-600' : 'text-gray-400'} />
      </div>

      {/* Title */}
      <h3 className={`text-lg font-semibold mb-2 ${
        isDark ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {title || defaults.title}
      </h3>

      {/* Message */}
      <p className={`text-sm text-center max-w-sm mb-4 ${
        isDark ? 'text-gray-500' : 'text-gray-500'
      }`}>
        {message || defaults.message}
      </p>

      {/* Action Button */}
      {action && actionLabel && (
        <button
          onClick={action}
          className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
