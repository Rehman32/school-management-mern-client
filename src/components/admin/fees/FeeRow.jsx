// ============================================
// FEE ROW COMPONENT
// Individual fee record row
// ============================================

import React from 'react';
import { FaMoneyBillWave, FaHistory, FaEdit, FaTrash } from 'react-icons/fa';

const FeeRow = ({ 
  fee, 
  onPayment, 
  onViewHistory, 
  onEdit, 
  onDelete, 
  isDark 
}) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { 
        bg: isDark ? 'bg-green-900/30' : 'bg-green-100', 
        text: isDark ? 'text-green-400' : 'text-green-700' 
      },
      pending: { 
        bg: isDark ? 'bg-yellow-900/30' : 'bg-yellow-100', 
        text: isDark ? 'text-yellow-400' : 'text-yellow-700' 
      },
      partial: { 
        bg: isDark ? 'bg-blue-900/30' : 'bg-blue-100', 
        text: isDark ? 'text-blue-400' : 'text-blue-700' 
      },
      overdue: { 
        bg: isDark ? 'bg-red-900/30' : 'bg-red-100', 
        text: isDark ? 'text-red-400' : 'text-red-700' 
      },
      waived: { 
        bg: isDark ? 'bg-gray-700' : 'bg-gray-100', 
        text: isDark ? 'text-gray-400' : 'text-gray-700' 
      }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {status?.toUpperCase()}
      </span>
    );
  };

  const formatCurrency = (amount) => `$${(amount || 0).toFixed(2)}`;

  return (
    <tr className={`transition-colors duration-150 ${
      isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
    }`}>
      {/* Student */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`text-sm font-medium ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          {fee.student?.fullName || 'N/A'}
        </div>
        <div className={`text-xs ${
          isDark ? 'text-gray-500' : 'text-gray-500'
        }`}>
          Roll: {fee.student?.rollNumber || 'N/A'}
        </div>
      </td>

      {/* Fee Type */}
      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
        isDark ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {fee.feeType || 'N/A'}
      </td>

      {/* Amount */}
      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>
        {formatCurrency(fee.amount)}
      </td>

      {/* Paid */}
      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
        isDark ? 'text-green-400' : 'text-green-600'
      }`}>
        {formatCurrency(fee.paidAmount)}
      </td>

      {/* Balance */}
      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
        fee.balance > 0 
          ? (isDark ? 'text-red-400' : 'text-red-600')
          : (isDark ? 'text-gray-400' : 'text-gray-600')
      }`}>
        {formatCurrency(fee.balance)}
      </td>

      {/* Due Date */}
      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
        isDark ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {new Date(fee.dueDate).toLocaleDateString()}
      </td>

      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(fee.status)}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
        <div className="flex items-center justify-end gap-2">
          {fee.status !== 'paid' && fee.status !== 'waived' && (
            <button
              onClick={() => onPayment(fee)}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'text-green-400 hover:bg-green-900/20' 
                  : 'text-green-600 hover:bg-green-50'
              }`}
              title="Record Payment"
            >
              <FaMoneyBillWave />
            </button>
          )}
          {fee.paymentRecords?.length > 0 && (
            <button
              onClick={() => onViewHistory(fee)}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'text-blue-400 hover:bg-blue-900/20' 
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
              title="View Payment History"
            >
              <FaHistory />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default FeeRow;
