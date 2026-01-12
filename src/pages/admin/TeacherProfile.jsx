// ============================================
// TEACHER PROFILE PAGE
// client/src/pages/admin/TeacherProfile.jsx
// Comprehensive teacher view with tabs
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
  BookOpen,
  Users,
  Clock,
  Award,
  Briefcase,
  ArrowLeft,
  GraduationCap
} from 'lucide-react';
import { getTeacherById } from '../../api/teacherApi';

const TeacherProfile = ({ isDark }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (id) {
      fetchTeacher();
    }
  }, [id]);

  const fetchTeacher = async () => {
    try {
      setLoading(true);
      const res = await getTeacherById(id);
      setTeacher(res.data?.data || res.data);
    } catch (err) {
      toast.error('Failed to load teacher');
      navigate('/admin/teachers');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'info', label: 'Information', icon: User },
    { id: 'classes', label: 'Classes', icon: Users },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'schedule', label: 'Schedule', icon: Clock }
  ];

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Teacher not found</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/teachers')}
          className={`flex items-center gap-2 mb-4 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <ArrowLeft size={20} />
          Back to Teachers
        </button>

        <div className={`rounded-2xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Photo Section */}
            <div className={`w-32 h-32 rounded-2xl overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
              {teacher.photo ? (
                <img src={teacher.photo} alt={teacher.fullName} className="w-full h-full object-cover" />
              ) : (
                <User size={48} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {teacher.fullName}
                  </h1>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Employee ID: {teacher.employeeId || 'N/A'} | {teacher.department || 'No Department'}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  teacher.status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : teacher.status === 'On Leave'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                }`}>
                  {teacher.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Employment</p>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {teacher.employmentType || 'Full-time'}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Gender</p>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {teacher.gender?.charAt(0).toUpperCase() + teacher.gender?.slice(1) || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Join Date</p>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {formatDate(teacher.joiningDate)}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Experience</p>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {teacher.experience ? `${teacher.experience} years` : 'N/A'}
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
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
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
                    <p className={isDark ? 'text-white' : 'text-gray-900'}>{teacher.email || 'N/A'}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <Phone className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Phone</p>
                    <p className={isDark ? 'text-white' : 'text-gray-900'}>{teacher.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 p-4 rounded-xl md:col-span-2 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <MapPin className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Address</p>
                    <p className={isDark ? 'text-white' : 'text-gray-900'}>
                      {teacher.address ? `${teacher.address.street || ''}, ${teacher.address.city || ''}, ${teacher.address.state || ''}` : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Qualifications */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Qualifications
              </h3>
              <div className="flex flex-wrap gap-2">
                {teacher.qualifications && teacher.qualifications.length > 0 ? (
                  teacher.qualifications.map((qual, index) => (
                    <span key={index} className={`px-4 py-2 rounded-xl flex items-center gap-2 ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}>
                      <GraduationCap size={16} />
                      {qual}
                    </span>
                  ))
                ) : (
                  <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>No qualifications listed</p>
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
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Date of Birth</p>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatDate(teacher.dob)}</p>
                </div>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Blood Group</p>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{teacher.bloodGroup || 'N/A'}</p>
                </div>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Salary</p>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {teacher.salary ? `₹${teacher.salary.toLocaleString()}` : 'N/A'}
                  </p>
                </div>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Classes</p>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {teacher.classesAssigned?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Classes Tab */}
        {activeTab === 'classes' && (
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Assigned Classes
            </h3>
            {teacher.classesAssigned && teacher.classesAssigned.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {teacher.classesAssigned.map((cls, index) => (
                  <div key={index} className={`p-4 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center gap-2">
                      <Users className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {typeof cls === 'object' ? cls.name || `${cls.grade} - ${cls.section}` : cls}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No classes assigned</p>
              </div>
            )}
          </div>
        )}

        {/* Subjects Tab */}
        {activeTab === 'subjects' && (
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Assigned Subjects
            </h3>
            {teacher.subjectsAssigned && teacher.subjectsAssigned.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {teacher.subjectsAssigned.map((subject, index) => (
                  <div key={index} className={`p-4 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center gap-2">
                      <BookOpen className={`h-5 w-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                      <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {typeof subject === 'object' ? subject.name : subject}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No subjects assigned</p>
              </div>
            )}
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="text-center py-12">
            <Clock size={48} className={`mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
            <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Teacher Schedule
            </h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              Weekly timetable will be displayed here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherProfile;
