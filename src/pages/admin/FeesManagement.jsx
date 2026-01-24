// ============================================
// FEE MANAGEMENT - ENHANCED VERSION
// With tabs for Collection, History, Summary
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
import { exportFees } from '../../utils/excelExport';

// Component imports
import FeeStats from '../../components/admin/fees/FeeStats';
import FeeFilters from '../../components/admin/fees/FeeFilters';
import FeeTable from '../../components/admin/fees/FeeTable';
import PaymentModal from '../../components/admin/fees/PaymentModal';
import BulkGenerateModal from '../../components/admin/fees/BulkGenerateModal';

import { 
  CreditCard,
  History,
  BarChart3,
  Download,
  Plus,
  Printer,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Users
} from 'lucide-react';

const TABS = [
  { id: 'collection', label: 'Fee Collection', icon: CreditCard },
  { id: 'history', label: 'Payment History', icon: History },
  { id: 'summary', label: 'Summary Report', icon: BarChart3 },
];

const FEE_TYPES = [
  { value: 'tuition', label: 'Tuition Fee' },
  { value: 'admission', label: 'Admission Fee' },
  { value: 'exam', label: 'Exam Fee' },
  { value: 'transport', label: 'Transport Fee' },
  { value: 'library', label: 'Library Fee' },
  { value: 'sports', label: 'Sports Fee' },
  { value: 'other', label: 'Other' },
];

export default function FeeManagement() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('collection');

  // Common State
  const [fees, setFees] = useState([]);
  const [stats, setStats] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    feeType: '',
    status: '',
    month: '',
    academicYear: '',
    classId: ''
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

  // History State
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [historyMonth, setHistoryMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  // Summary State
  const [summaryData, setSummaryData] = useState(null);

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

  // Load payment history
  const loadPaymentHistory = async () => {
    setLoading(true);
    try {
      const [year, month] = historyMonth.split('-');
      const response = await getFees({
        status: 'paid',
        month,
        academicYear: year,
        limit: 100
      });
      setPaymentHistory(response.data || []);
    } catch (err) {
      toast.error('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  // Load summary
  const loadSummary = async () => {
    setLoading(true);
    try {
      const response = await getFeeStats({});
      const allFees = await getFees({ limit: 1000 });
      
      // Calculate class-wise summary
      const classSummary = {};
      (allFees.data || []).forEach(fee => {
        const className = fee.student?.class?.name || 'Unknown';
        if (!classSummary[className]) {
          classSummary[className] = { total: 0, collected: 0, pending: 0, count: 0 };
        }
        classSummary[className].total += fee.amount || 0;
        classSummary[className].collected += fee.paidAmount || 0;
        classSummary[className].pending += (fee.amount || 0) - (fee.paidAmount || 0);
        classSummary[className].count += 1;
      });

      setSummaryData({
        ...response.data,
        classSummary: Object.entries(classSummary).map(([name, data]) => ({
          class: name,
          ...data
        }))
      });
    } catch (err) {
      toast.error('Failed to load summary');
    } finally {
      setLoading(false);
    }
  };

  // Export to Excel
  const handleExport = () => {
    if (fees.length === 0) {
      toast.error('No data to export');
      return;
    }
    exportFees(fees);
    toast.success('Exported to Excel');
  };

  const handleExportHistory = () => {
    if (paymentHistory.length === 0) {
      toast.error('No data to export');
      return;
    }
    exportFees(paymentHistory);
    toast.success('Exported to Excel');
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount || 0);
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
                <CreditCard className="text-white" size={24} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Fee Management
                </h1>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Manage student fees, payments, and reports
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Download size={18} />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button
                onClick={() => setShowBulkModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-md transition-all duration-200"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Generate Fees</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'history') loadPaymentHistory();
                  if (tab.id === 'summary') loadSummary();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
                    : isDark
                    ? 'text-gray-400 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* ============================================ */}
        {/* COLLECTION TAB */}
        {/* ============================================ */}
        {activeTab === 'collection' && (
          <>
            {stats && <FeeStats stats={stats} isDark={isDark} />}

            <div className={`rounded-xl shadow-md border overflow-hidden mt-6 ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
              <FeeFilters
                filters={filters}
                setFilters={setFilters}
                onSearch={handleSearch}
                isDark={isDark}
              />

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
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
                    Page {pagination.page} of {pagination.pages} ({pagination.total} records)
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
          </>
        )}

        {/* ============================================ */}
        {/* HISTORY TAB */}
        {/* ============================================ */}
        {activeTab === 'history' && (
          <div className={`rounded-xl shadow-md border overflow-hidden ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}>
            {/* Filters */}
            <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Month
                  </label>
                  <input
                    type="month"
                    value={historyMonth}
                    onChange={(e) => setHistoryMonth(e.target.value)}
                    className={`px-4 py-2 rounded-lg border ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <button
                  onClick={loadPaymentHistory}
                  className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Load History
                </button>
                <button
                  onClick={handleExportHistory}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                    isDark ? 'text-blue-400 hover:bg-blue-900/20' : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Download size={18} />
                  Export
                </button>
              </div>
            </div>

            {/* History List */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
              </div>
            ) : paymentHistory.length === 0 ? (
              <div className={`text-center py-16 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <History size={48} className="mx-auto mb-4 opacity-50" />
                <p>No payment records found</p>
                <p className="text-sm mt-1">Select a month and click Load History</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={isDark ? 'bg-gray-700' : 'bg-gray-100'}>
                      <th className={`px-4 py-3 text-left text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Date
                      </th>
                      <th className={`px-4 py-3 text-left text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Student
                      </th>
                      <th className={`px-4 py-3 text-left text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Fee Type
                      </th>
                      <th className={`px-4 py-3 text-right text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Amount
                      </th>
                      <th className={`px-4 py-3 text-center text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {paymentHistory.map((fee, idx) => (
                      <tr key={idx} className={isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}>
                        <td className={`px-4 py-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {fee.paidAt ? new Date(fee.paidAt).toLocaleDateString() : '-'}
                        </td>
                        <td className={`px-4 py-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {fee.student?.fullName || 'Unknown'}
                        </td>
                        <td className={`px-4 py-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {fee.feeType}
                        </td>
                        <td className={`px-4 py-3 text-right font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                          {formatCurrency(fee.paidAmount)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Paid
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ============================================ */}
        {/* SUMMARY TAB */}
        {/* ============================================ */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                    <DollarSign className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Fees</div>
                    <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(summaryData?.totalAmount || stats?.totalAmount || 0)}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-green-900/30' : 'bg-green-100'}`}>
                    <CheckCircle className="text-green-500" size={24} />
                  </div>
                  <div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Collected</div>
                    <div className={`text-xl font-bold text-green-500`}>
                      {formatCurrency(summaryData?.collectedAmount || stats?.collectedAmount || 0)}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-yellow-900/30' : 'bg-yellow-100'}`}>
                    <Clock className="text-yellow-500" size={24} />
                  </div>
                  <div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Pending</div>
                    <div className={`text-xl font-bold text-yellow-500`}>
                      {formatCurrency(summaryData?.pendingAmount || stats?.pendingAmount || 0)}
                    </div>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-red-900/30' : 'bg-red-100'}`}>
                    <AlertCircle className="text-red-500" size={24} />
                  </div>
                  <div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Overdue</div>
                    <div className={`text-xl font-bold text-red-500`}>
                      {formatCurrency(summaryData?.overdueAmount || stats?.overdueAmount || 0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Class-wise Summary */}
            {summaryData?.classSummary && (
              <div className={`rounded-xl shadow-md border overflow-hidden ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
              }`}>
                <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Class-wise Fee Summary
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={isDark ? 'bg-gray-700' : 'bg-gray-100'}>
                        <th className={`px-4 py-3 text-left text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          Class
                        </th>
                        <th className={`px-4 py-3 text-center text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          Students
                        </th>
                        <th className={`px-4 py-3 text-right text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          Total
                        </th>
                        <th className={`px-4 py-3 text-right text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          Collected
                        </th>
                        <th className={`px-4 py-3 text-right text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          Pending
                        </th>
                        <th className={`px-4 py-3 text-center text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          Collection %
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                      {summaryData.classSummary.map((row, idx) => {
                        const percentage = row.total > 0 ? Math.round((row.collected / row.total) * 100) : 0;
                        return (
                          <tr key={idx} className={isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}>
                            <td className={`px-4 py-3 font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {row.class}
                            </td>
                            <td className={`px-4 py-3 text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              {row.count}
                            </td>
                            <td className={`px-4 py-3 text-right ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              {formatCurrency(row.total)}
                            </td>
                            <td className={`px-4 py-3 text-right text-green-500`}>
                              {formatCurrency(row.collected)}
                            </td>
                            <td className={`px-4 py-3 text-right text-yellow-500`}>
                              {formatCurrency(row.pending)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <div className={`w-16 h-2 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
                                  <div
                                    className={`h-full rounded-full ${
                                      percentage >= 75 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {percentage}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
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
