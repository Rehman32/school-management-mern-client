// ============================================
// FEE FILTERS COMPONENT
// Advanced filtering for fee records
// ============================================

import React from 'react';
import { FaFilter, FaSearch } from 'react-icons/fa';

const FEE_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'tuition', label: 'Tuition' },
  { value: 'transport', label: 'Transport' },
  { value: 'library', label: 'Library' },
  { value: 'lab', label: 'Lab' },
  { value: 'sports', label: 'Sports' },
  { value: 'exam', label: 'Exam' },
  { value: 'admission', label: 'Admission' },
  { value: 'annual', label: 'Annual' },
  { value: 'other', label: 'Other' }
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'partial', label: 'Partial' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'waived', label: 'Waived' }
];

const FeeFilters = ({ 
  filters, 
  setFilters, 
  onSearch, 
  isDark 
}) => {
  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={`p-6 border-b ${
      isDark ? 'border-gray-700' : 'border-gray-200'
    }`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Fee Type */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Fee Type
          </label>
          <select
            value={filters.feeType || ''}
            onChange={(e) => handleChange('feeType', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none ${
              isDark 
                ? 'border-gray-600 bg-gray-700 text-white' 
                : 'border-gray-300 bg-white text-gray-900'
            }`}
          >
            {FEE_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none ${
              isDark 
                ? 'border-gray-600 bg-gray-700 text-white' 
                : 'border-gray-300 bg-white text-gray-900'
            }`}
          >
            {STATUS_OPTIONS.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Month */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Month (YYYY-MM)
          </label>
          <input
            type="month"
            value={filters.month || ''}
            onChange={(e) => handleChange('month', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none ${
              isDark 
                ? 'border-gray-600 bg-gray-700 text-white' 
                : 'border-gray-300 bg-white text-gray-900'
            }`}
          />
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            onClick={onSearch}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
          >
            <FaSearch />
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeeFilters;
