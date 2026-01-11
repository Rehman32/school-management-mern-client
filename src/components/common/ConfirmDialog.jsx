// ============================================
// CONFIRM DIALOG COMPONENT
// client/src/components/common/ConfirmDialog.jsx
// Reusable confirmation modal for delete/dangerous actions
// ============================================

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  type = 'danger', // 'danger', 'warning', 'info'
  loading = false,
  isDark = false,
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      icon: Trash2,
      iconBg: isDark ? 'bg-red-900/30' : 'bg-red-100',
      iconColor: 'text-red-500',
      confirmBtn: 'bg-red-600 hover:bg-red-700',
    },
    warning: {
      icon: AlertTriangle,
      iconBg: isDark ? 'bg-yellow-900/30' : 'bg-yellow-100',
      iconColor: 'text-yellow-500',
      confirmBtn: 'bg-yellow-600 hover:bg-yellow-700',
    },
    info: {
      icon: AlertTriangle,
      iconBg: isDark ? 'bg-blue-900/30' : 'bg-blue-100',
      iconColor: 'text-blue-500',
      confirmBtn: 'bg-blue-600 hover:bg-blue-700',
    },
  };

  const style = typeStyles[type] || typeStyles.danger;
  const Icon = style.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className={`relative w-full max-w-md rounded-2xl shadow-2xl ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-lg transition-colors ${
            isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
          }`}
        >
          <X size={20} />
        </button>

        <div className="p-6">
          {/* Icon */}
          <div className={`w-12 h-12 rounded-full ${style.iconBg} flex items-center justify-center mx-auto mb-4`}>
            <Icon size={24} className={style.iconColor} />
          </div>

          {/* Title */}
          <h3 className={`text-xl font-bold text-center mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {title}
          </h3>

          {/* Message */}
          <p className={`text-center mb-6 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {message}
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-all ${
                isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } disabled:opacity-50`}
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-white transition-all ${style.confirmBtn} disabled:opacity-50 flex items-center justify-center gap-2`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
