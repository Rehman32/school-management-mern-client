// ============================================
// STUDENT PROFILE PAGE - ENHANCED
// client/src/pages/admin/StudentProfile.jsx
// Comprehensive student view with functional tabs
// ============================================

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
  Users,
  CreditCard,
  ClipboardList,
  Award,
  Camera,
  FileText,
  ArrowLeft,
  Edit,
  Trash2,
  Upload,
  Download,
  Eye,
  Printer,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { getStudentById, uploadStudentPhoto, deleteStudentPhoto, getStudentDocuments, uploadStudentDocument, deleteStudentDocument } from '../../api/studentApi';
import { getStudentFees } from '../../api/feesApi';
import { getStudentGrades } from '../../api/examApi';
import ReceiptModal from '../../components/admin/fees/ReceiptModal';
import ReportCardModal from '../../components/admin/academics/ReportCardModal';

const StudentProfile = ({ isDark }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const [documents, setDocuments] = useState([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  
  // Fees state
  const [fees, setFees] = useState([]);
  const [feesLoading, setFeesLoading] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  
  // Grades state
  const [grades, setGrades] = useState([]);
  const [gradesLoading, setGradesLoading] = useState(false);
  const [showReportCard, setShowReportCard] = useState(false);

  useEffect(() => {
    if (id) {
      fetchStudent();
      fetchDocuments();
    }
  }, [id]);

  useEffect(() => {
    if (activeTab === 'fees' && id) {
      fetchFees();
    }
    if (activeTab === 'grades' && id) {
      fetchGrades();
    }
  }, [activeTab, id]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const res = await getStudentById(id);
      setStudent(res.data?.data || res.data);
    } catch (err) {
      toast.error('Failed to load student');
      navigate('/admin/students');
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await getStudentDocuments(id);
      setDocuments(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load documents:', err);
    }
  };

  const fetchFees = async () => {
    setFeesLoading(true);
    try {
      const res = await getStudentFees(id);
      setFees(res.data || []);
    } catch (err) {
      console.error('Failed to load fees:', err);
    } finally {
      setFeesLoading(false);
    }
  };

  const fetchGrades = async () => {
    setGradesLoading(true);
    try {
      const res = await getStudentGrades(id);
      setGrades(res || []);
    } catch (err) {
      console.error('Failed to load grades:', err);
    } finally {
      setGradesLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploadingPhoto(true);
    try {
      await uploadStudentPhoto(id, file);
      toast.success('Photo uploaded successfully');
      fetchStudent();
    } catch (err) {
      toast.error('Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePhotoDelete = async () => {
    if (!confirm('Delete student photo?')) return;
    
    try {
      await deleteStudentPhoto(id);
      toast.success('Photo deleted');
      fetchStudent();
    } catch (err) {
      toast.error('Failed to delete photo');
    }
  };

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const docType = prompt('Enter document type (e.g., Birth Certificate, ID Card, Report Card):');
    if (!docType) return;

    setUploadingDoc(true);
    try {
      await uploadStudentDocument(id, file, docType, file.name);
      toast.success('Document uploaded');
      fetchDocuments();
    } catch (err) {
      toast.error('Failed to upload document');
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleDocumentDelete = async (docId) => {
    if (!confirm('Delete this document?')) return;
    
    try {
      await deleteStudentDocument(id, docId);
      toast.success('Document deleted');
      fetchDocuments();
    } catch (err) {
      toast.error('Failed to delete document');
    }
  };

  const handleViewReceipt = (fee) => {
    setSelectedReceipt({ ...fee, student });
    setShowReceiptModal(true);
  };

  const tabs = [
    { id: 'info', label: 'Information', icon: User },
    { id: 'attendance', label: 'Attendance', icon: ClipboardList },
    { id: 'fees', label: 'Fees', icon: CreditCard },
    { id: 'grades', label: 'Grades', icon: Award },
    { id: 'documents', label: 'Documents', icon: FileText }
  ];

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const getStatusBadge = (status) => {
    const config = {
      paid: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
      pending: { color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
      overdue: { color: 'bg-red-100 text-red-700', icon: XCircle },
      partial: { color: 'bg-blue-100 text-blue-700', icon: AlertCircle }
    };
    const { color, icon: Icon } = config[status?.toLowerCase()] || config.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        <Icon size={12} />
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Student not found</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/students')}
          className={`flex items-center gap-2 mb-4 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <ArrowLeft size={20} />
          Back to Students
        </button>

        <div className={`rounded-2xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Photo Section */}
            <div className="relative group">
              <div className={`w-32 h-32 rounded-2xl overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
                {student.photo ? (
                  <img src={student.photo} alt={student.fullName} className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                )}
              </div>
              
              {/* Photo Actions */}
              <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <label className="p-2 bg-white rounded-lg cursor-pointer hover:bg-gray-100">
                  <Camera size={16} className="text-gray-700" />
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
                </label>
                {student.photo && (
                  <button onClick={handlePhotoDelete} className="p-2 bg-red-500 rounded-lg hover:bg-red-600">
                    <Trash2 size={16} className="text-white" />
                  </button>
                )}
              </div>
              {uploadingPhoto && (
                <div className="absolute inset-0 bg-black/70 rounded-2xl flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {student.fullName}
                  </h1>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Admission No: {student.admissionNumber || 'N/A'} | Roll No: {student.rollNumber || 'N/A'}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  student.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {student.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Class</p>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {student.class?.name || student.class?.grade || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Gender</p>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {student.gender?.charAt(0).toUpperCase() + student.gender?.slice(1) || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Date of Birth</p>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {formatDate(student.dob)}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Enrolled</p>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {formatDate(student.enrolledDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex gap-2 mb-6 p-1 rounded-xl overflow-x-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : isDark
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={`rounded-2xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="space-y-8">
            {/* Contact Info */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`flex items-center gap-3 p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <Mail className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Email</p>
                    <p className={isDark ? 'text-white' : 'text-gray-900'}>{student.email || 'N/A'}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <Phone className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Phone</p>
                    <p className={isDark ? 'text-white' : 'text-gray-900'}>{student.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 p-4 rounded-xl md:col-span-2 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <MapPin className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Address</p>
                    <p className={isDark ? 'text-white' : 'text-gray-900'}>
                      {student.address ? `${student.address.street || ''}, ${student.address.city || ''}, ${student.address.state || ''}` : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Guardian Info */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Guardian Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.guardians && student.guardians.length > 0 ? (
                  student.guardians.map((guardian, index) => (
                    <div key={index} className={`p-4 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className={`h-5 w-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {guardian.name}
                        </span>
                        {guardian.isPrimary && (
                          <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">Primary</span>
                        )}
                      </div>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {guardian.relationship?.charAt(0).toUpperCase() + guardian.relationship?.slice(1)}
                      </p>
                      <div className="mt-2 space-y-1">
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>📱 {guardian.phone || 'N/A'}</p>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>✉️ {guardian.email || 'N/A'}</p>
                        {guardian.occupation && (
                          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>💼 {guardian.occupation}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>No guardian information</p>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Additional Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Blood Group</p>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{student.bloodGroup || 'N/A'}</p>
                </div>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Nationality</p>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{student.nationality || 'N/A'}</p>
                </div>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Transport</p>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{student.transportRequired ? 'Yes' : 'No'}</p>
                </div>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Hostel</p>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{student.hostelRequired ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="text-center py-12">
            <ClipboardList size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
            <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Attendance History
            </h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              Attendance calendar and statistics will be displayed here
            </p>
          </div>
        )}

        {/* Fees Tab */}
        {activeTab === 'fees' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Fee Payment History
              </h3>
            </div>

            {feesLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              </div>
            ) : fees.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                      <th className={`p-3 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Fee Type</th>
                      <th className={`p-3 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Amount</th>
                      <th className={`p-3 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Due Date</th>
                      <th className={`p-3 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Status</th>
                      <th className={`p-3 text-right text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {fees.map((fee) => (
                      <tr key={fee._id} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                        <td className={`p-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{fee.feeType}</td>
                        <td className={`p-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(fee.amount)}</td>
                        <td className={`p-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{formatDate(fee.dueDate)}</td>
                        <td className="p-3">{getStatusBadge(fee.status)}</td>
                        <td className="p-3 text-right">
                          {fee.status?.toLowerCase() === 'paid' && (
                            <button
                              onClick={() => handleViewReceipt(fee)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                            >
                              <Printer size={16} />
                              Receipt
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <CreditCard size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No fee records found</p>
              </div>
            )}
          </div>
        )}

        {/* Grades Tab */}
        {activeTab === 'grades' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Academic Performance
              </h3>
              {grades.length > 0 && (
                <button
                  onClick={() => setShowReportCard(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  <Printer size={18} />
                  Print Report Card
                </button>
              )}
            </div>

            {gradesLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              </div>
            ) : grades.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                      <th className={`p-3 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Exam</th>
                      <th className={`p-3 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Subject</th>
                      <th className={`p-3 text-center text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Marks</th>
                      <th className={`p-3 text-center text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Grade</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {grades.map((grade, index) => {
                      const percentage = grade.maxMarks > 0 ? ((grade.marksObtained / grade.maxMarks) * 100) : 0;
                      let gradeLabel = 'F';
                      if (percentage >= 90) gradeLabel = 'A+';
                      else if (percentage >= 80) gradeLabel = 'A';
                      else if (percentage >= 70) gradeLabel = 'B+';
                      else if (percentage >= 60) gradeLabel = 'B';
                      else if (percentage >= 50) gradeLabel = 'C';
                      else if (percentage >= 40) gradeLabel = 'D';
                      
                      return (
                        <tr key={index} className={isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                          <td className={`p-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {grade.exam?.name || 'Exam'}
                          </td>
                          <td className={`p-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {grade.subject?.name || grade.subjectName || 'Subject'}
                          </td>
                          <td className={`p-3 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            <span className={percentage < 40 ? 'text-red-500' : 'text-green-500'}>
                              {grade.marksObtained}
                            </span>
                            <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>/{grade.maxMarks}</span>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              gradeLabel === 'F' 
                                ? 'bg-red-100 text-red-600' 
                                : 'bg-green-100 text-green-600'
                            }`}>
                              {gradeLabel}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Award size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No exam results found</p>
              </div>
            )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Documents
              </h3>
              <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl cursor-pointer hover:shadow-lg transition-all">
                <Upload size={18} />
                {uploadingDoc ? 'Uploading...' : 'Upload Document'}
                <input type="file" className="hidden" onChange={handleDocumentUpload} disabled={uploadingDoc} />
              </label>
            </div>

            {documents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc) => (
                  <div key={doc._id} className={`flex items-center justify-between p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <FileText className={isDark ? 'text-purple-400' : 'text-purple-600'} />
                      <div>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{doc.documentName}</p>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{doc.documentType}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}>
                        <Eye size={16} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
                      </a>
                      <button onClick={() => handleDocumentDelete(doc._id)} className="p-2 rounded-lg hover:bg-red-100">
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No documents uploaded yet</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        receipt={selectedReceipt}
        isDark={isDark}
      />

      {/* Report Card Modal */}
      <ReportCardModal
        isOpen={showReportCard}
        onClose={() => setShowReportCard(false)}
        student={student}
        examResults={grades}
        isDark={isDark}
      />
    </div>
  );
};

export default StudentProfile;
