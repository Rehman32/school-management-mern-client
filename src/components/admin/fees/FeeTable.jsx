// ============================================
// FEE TABLE COMPONENT
// Main table for displaying fees
// ============================================

import React from 'react';
import FeeRow from './FeeRow';
import { FaFileInvoiceDollar } from 'react-icons/fa';

const FeeTable = ({ 
  fees, 
  onPayment, 
  onViewHistory, 
  onEdit, 
  onDelete, 
  isDark 
}) => {
  if (fees.length === 0) {
    return (
      <div className="text-center py-16">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
          isDark ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <FaFileInvoiceDollar className={`text-2xl ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`} />
        </div>
        <h3 className={`text-lg font-medium mb-2 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          No fee records found
        </h3>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          Create a fee record to get started
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y ${
        isDark ? 'divide-gray-700' : 'divide-gray-200'
      }`}>
        <thead className={isDark ? 'bg-gray-900/50' : 'bg-gray-50'}>
          <tr>
            <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Student
            </th>
            <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Type
            </th>
            <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Amount
            </th>
            <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Paid
            </th>
            <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Balance
            </th>
            <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Due Date
            </th>
            <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Status
            </th>
            <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className={`divide-y ${
          isDark 
            ? 'bg-gray-800 divide-gray-700' 
            : 'bg-white divide-gray-200'
        }`}>
          {fees.map((fee) => (
            <FeeRow
              key={fee._id}
              fee={fee}
              onPayment={onPayment}
              onViewHistory={onViewHistory}
              onEdit={onEdit}
              onDelete={onDelete}
              isDark={isDark}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeeTable;
