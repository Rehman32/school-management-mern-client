// ============================================
// FEE MANAGEMENT - MAIN PAGE
// Orchestrates all fee management components
// ============================================

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import useTheme from '../../context/ThemeContext';

// API imports
import { 
  getFees, 
  getFeeStats, 
  recordPayment, 
  bulkGenerateFees 
} from '../../api/feesApi';
import { listClasses } from '../../api/classApi';

// Component imports
import FeeStats from '../../components/admin/fees/FeeStats';
import FeeFilters from '../../components/admin/fees/FeeFilters';
import FeeTable from '../../components/admin/fees/FeeTable';
import PaymentModal from '../../components/admin/fees/PaymentModal';
import BulkGenerateModal from '../../components/admin/fees/BulkGenerateModal';

import { 
  FaFileInvoiceDollar, 
  FaPlus, 
  FaMoneyCheckAlt 
} from 'react-icons/fa';

export default function FeeManagement() {
  const { isDark } = useTheme();

  // State
  const [fees, setFees] = useState([]);
  const [stats, setStats] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    feeType: '',
    status: '',
    month: '',
    academicYear: ''
  });

  // Modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  // Load initial data
  useEffect(() => {
    fetchClasses();
    fetchStats();
    fetchFees();
  }, []);

  // Fetch classes
  const fetchClasses = async () => {
    try {
      const response = await listClasses();
      setClasses(response.data.data || []);
    } catch (err) {
      console.error('Failed to load classes:', err);
      toast.error('Failed to load classes');
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await getFeeStats(filters);
      setStats(response.data || {});
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  // Fetch fees
  const fetchFees = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      };

      const response = await getFees(params);
      setFees(response.data || []);
      
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      console.error('Failed to load fees:', err);
      toast.error('Failed to load fee records');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter search
  const handleSearch = () => {
    setPagination({ ...pagination, page: 1 });
    fetchFees();
    fetchStats();
  };

  // Handle payment
  const handleRecordPayment = async (feeId, paymentData) => {
    try {
      await recordPayment(feeId, paymentData);
      toast.success('Payment recorded successfully');
      fetchFees();
      fetchStats();
    } catch (err) {
      console.error('Failed to record payment:', err);
      toast.error(err.response?.data?.message || 'Failed to record payment');
      throw err;
    }
  };

  // Handle bulk generate
  const handleBulkGenerate = async (data) => {
    try {
      const response = await bulkGenerateFees(data);
      toast.success(response.message || 'Fees generated successfully');
      fetchFees();
      fetchStats();
    } catch (err) {
      console.error('Failed to generate fees:', err);
      toast.error(err.response?.data?.message || 'Failed to generate fees');
      throw err;
    }
  };

  // Open payment modal
  const openPaymentModal = (fee) => {
    setSelectedFee(fee);
    setShowPaymentModal(true);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
    fetchFees();
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className={`border-b shadow-sm ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg">
                <FaFileInvoiceDollar className="text-white text-2xl" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Fee Management
                </h1>
                <p className={`mt-1 text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Manage student fees and payments
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowBulkModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-md transition-all duration-200"
              >
                <FaMoneyCheckAlt />
                <span className="hidden sm:inline">Bulk Generate</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Statistics */}
        {stats && <FeeStats stats={stats} isDark={isDark} />}

        {/* Main Card */}
        <div className={`rounded-xl shadow-md border overflow-hidden ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          {/* Filters */}
          <FeeFilters
            filters={filters}
            setFilters={setFilters}
            onSearch={handleSearch}
            isDark={isDark}
          />

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <FeeTable
              fees={fees}
              onPayment={openPaymentModal}
              onViewHistory={() => {}}
              onEdit={() => {}}
              onDelete={() => {}}
              isDark={isDark}
            />
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className={`p-6 border-t flex items-center justify-between ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} results
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    pagination.page === 1
                      ? (isDark ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400')
                      : (isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-900 hover:bg-gray-50 border')
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    pagination.page === pagination.pages
                      ? (isDark ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400')
                      : (isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-900 hover:bg-gray-50 border')
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showPaymentModal && selectedFee && (
        <PaymentModal
          fee={selectedFee}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedFee(null);
          }}
          onSubmit={handleRecordPayment}
          isDark={isDark}
        />
      )}

      {showBulkModal && (
        <BulkGenerateModal
          classes={classes}
          onClose={() => setShowBulkModal(false)}
          onSubmit={handleBulkGenerate}
          isDark={isDark}
        />
      )}
    </div>
  );
}
