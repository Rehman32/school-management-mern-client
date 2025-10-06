// ENHANCED SETTINGS COMPONENT

import React, { useEffect, useState } from 'react';
import {
  getProfile,
  updateProfile,
  uploadLogo,
  updateAcademicYear,
  updateSystemSettings,
  getStatistics,
} from '../../api/settingsApi';
import { toast } from 'react-hot-toast';
import {
  FaCog,
  FaSave,
  FaSchool,
  FaMapMarkerAlt,
  FaPhone,
  FaImage,
  FaEnvelope,
  FaGlobe,
  FaInfoCircle,
  FaCheckCircle,
  FaEdit,
  FaCalendarAlt,
  FaClock,
  FaGraduationCap,
  FaUserShield,
  FaBell,
  FaChartLine,
  FaUpload,
  FaTimes,
} from 'react-icons/fa';

const TABS = [
  { id: 'profile', label: 'School Profile', icon: FaSchool },
  { id: 'academic', label: 'Academic Settings', icon: FaGraduationCap },
  { id: 'system', label: 'System Settings', icon: FaCog },
  { id: 'statistics', label: 'Statistics', icon: FaChartLine },
];

export default function SettingsPage({ isDark }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    alternatePhone: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    website: '',
    logo: '',
    description: '',
    registrationNumber: '',
    affiliationNumber: '',
    board: 'State Board',
    establishedYear: '',
    principal: {
      name: '',
      email: '',
      phone: '',
    },
    vicePrincipal: {
      name: '',
      email: '',
      phone: '',
    },
    currentAcademicYear: '',
    passingPercentage: 33,
    attendancePercentageRequired: 75,
    settings: {
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '12',
      timezone: 'Asia/Kolkata',
      currency: 'INR',
      language: 'en',
      sessionTimeout: 30,
      passwordMinLength: 8,
      enableTwoFactor: false,
      maxLoginAttempts: 5,
      enableSMS: false,
      enableEmail: true,
      enableNotifications: true,
    },
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [statistics, setStatistics] = useState(null);

  const fetch = async () => {
    setFetchLoading(true);
    try {
      const res = await getProfile();
      const data = res.data.data || res.data;
      setProfile({
        ...profile,
        ...data,
        settings: { ...profile.settings, ...data.settings },
      });
      setLogoPreview(data.logo);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load profile');
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await getStatistics();
      setStatistics(res.data.data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load statistics');
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    if (activeTab === 'statistics' && !statistics) {
      fetchStats();
    }
  }, [activeTab]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(profile);
      toast.success('Settings saved successfully');
      setHasChanges(false);
    } catch (e) {
      console.error(e);
      const errorMsg = e.response?.data?.message || 'Failed to save settings';
      toast.error(errorMsg);
      if (e.response?.data?.errors) {
        e.response.data.errors.forEach(err => toast.error(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      // Handle nested fields
      const keys = field.split('.');
      setProfile((prev) => {
        const updated = { ...prev };
        let current = updated;
        for (let i = 0; i < keys.length - 1; i++) {
          current[keys[i]] = { ...current[keys[i]] };
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        return updated;
      });
    } else {
      setProfile((p) => ({ ...p, [field]: value }));
    }
    setHasChanges(true);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|svg\+xml)/)) {
      toast.error('Only image files are allowed');
      return;
    }

    setUploadingLogo(true);
    try {
      const res = await uploadLogo(file);
      const logoPath = res.data.data.logo;
      setLogoPreview(logoPath);
      setProfile((p) => ({ ...p, logo: logoPath }));
      toast.success('Logo uploaded successfully');
      setHasChanges(true);
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      {/* Header */}
      <div
        className={`border-b shadow-sm ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl shadow-lg">
              <FaCog className="text-white text-2xl" />
            </div>
            <div>
              <h1
                className={`text-3xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Settings
              </h1>
              <p
                className={`mt-1 text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Manage school profile and system settings
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <div className="flex gap-2 border-b" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${
                    activeTab === tab.id
                      ? isDark
                        ? 'text-violet-400 border-b-2 border-violet-400'
                        : 'text-violet-600 border-b-2 border-violet-600'
                      : isDark
                      ? 'text-gray-400 hover:text-gray-300'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {fetchLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mb-4"></div>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Loading settings...
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* School Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div
                  className={`rounded-2xl border shadow-md overflow-hidden ${
                    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  <div
                    className={`p-6 border-b ${
                      isDark
                        ? 'border-gray-700 bg-gradient-to-r from-violet-900/20 to-purple-900/20'
                        : 'border-gray-200 bg-gradient-to-r from-violet-50 to-purple-50'
                    }`}
                  >
                    <h2
                      className={`text-xl font-bold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      School Profile
                    </h2>
                  </div>

                  <form onSubmit={handleSave} className="p-6 space-y-6">
                    {/* Logo Upload */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-3 ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        School Logo
                      </label>
                      <div className="flex items-center gap-6">
                        {logoPreview && (
                          <div
                            className={`p-4 rounded-xl border-2 ${
                              isDark
                                ? 'border-gray-600 bg-gray-700/50'
                                : 'border-gray-300 bg-gray-50'
                            }`}
                          >
                            <img
                              src={logoPreview}
                              alt="School Logo"
                              className="h-24 w-24 object-contain rounded-lg"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div>
                          <label
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all ${
                              uploadingLogo
                                ? 'opacity-50 cursor-not-allowed'
                                : isDark
                                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <FaUpload />
                            {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              disabled={uploadingLogo}
                              className="hidden"
                            />
                          </label>
                          <p
                            className={`text-xs mt-2 ${
                              isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}
                          >
                            Max size: 5MB. Formats: JPG, PNG, GIF, SVG
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label
                          className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          <FaSchool className="text-violet-600" />
                          School Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={profile.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          placeholder="Enter school name"
                          className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-violet-500 ${
                            isDark
                              ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                              : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                          }`}
                        />
                      </div>

                      <div>
                        <label
                          className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          <FaEnvelope className="text-violet-600" />
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={profile.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-violet-500 ${
                            isDark
                              ? 'border-gray-600 bg-gray-700 text-white'
                              : 'border-gray-300 bg-white text-gray-900'
                          }`}
                        />
                      </div>

                      <div>
                        <label
                          className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          <FaPhone className="text-violet-600" />
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-violet-500 ${
                            isDark
                              ? 'border-gray-600 bg-gray-700 text-white'
                              : 'border-gray-300 bg-white text-gray-900'
                          }`}
                        />
                      </div>

                      <div>
                        <label
                          className={`text-sm font-medium mb-2 block ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          Alternate Phone
                        </label>
                        <input
                          type="tel"
                          value={profile.alternatePhone || ''}
                          onChange={(e) => handleChange('alternatePhone', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-violet-500 ${
                            isDark
                              ? 'border-gray-600 bg-gray-700 text-white'
                              : 'border-gray-300 bg-white text-gray-900'
                          }`}
                        />
                      </div>

                      <div>
                        <label
                          className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          <FaGlobe className="text-violet-600" />
                          Website
                        </label>
                        <input
                          type="url"
                          value={profile.website || ''}
                          onChange={(e) => handleChange('website', e.target.value)}
                          placeholder="https://www.school.com"
                          className={`w-full px-4 py-3 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-violet-500 ${
                            isDark
                              ? 'border-gray-600 bg-gray-700 text-white'
                              : 'border-gray-300 bg-white text-gray-900'
                          }`}
                        />
                      </div>

                      {/* Address Fields */}
                      <div className="md:col-span-2">
                        <label
                          className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          <FaMapMarkerAlt className="text-violet-600" />
                          Address
                        </label>
                        <input
                          type="text"
                          value={profile.address}
                          onChange={(e) => handleChange('address', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-violet-500 ${
                            isDark
                              ? 'border-gray-600 bg-gray-700 text-white'
                              : 'border-gray-300 bg-white text-gray-900'
                          }`}
                        />
                      </div>

                      <div>
                        <label
                          className={`text-sm font-medium mb-2 block ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          City
                        </label>
                        <input
                          type="text"
                          value={profile.city || ''}
                          onChange={(e) => handleChange('city', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-violet-500 ${
                            isDark
                              ? 'border-gray-600 bg-gray-700 text-white'
                              : 'border-gray-300 bg-white text-gray-900'
                          }`}
                        />
                      </div>

                      <div>
                        <label
                          className={`text-sm font-medium mb-2 block ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          State
                        </label>
                        <input
                          type="text"
                          value={profile.state || ''}
                          onChange={(e) => handleChange('state', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-violet-500 ${
                            isDark
                              ? 'border-gray-600 bg-gray-700 text-white'
                              : 'border-gray-300 bg-white text-gray-900'
                          }`}
                        />
                      </div>

                      <div>
                        <label
                          className={`text-sm font-medium mb-2 block ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          Country
                        </label>
                        <input
                          type="text"
                          value={profile.country || 'India'}
                          onChange={(e) => handleChange('country', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-violet-500 ${
                            isDark
                              ? 'border-gray-600 bg-gray-700 text-white'
                              : 'border-gray-300 bg-white text-gray-900'
                          }`}
                        />
                      </div>

                      <div>
                        <label
                          className={`text-sm font-medium mb-2 block ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          Pincode
                        </label>
                        <input
                          type="text"
                          value={profile.pincode || ''}
                          onChange={(e) => handleChange('pincode', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-violet-500 ${
                            isDark
                              ? 'border-gray-600 bg-gray-700 text-white'
                              : 'border-gray-300 bg-white text-gray-900'
                          }`}
                        />
                      </div>

                      {/* Registration Details */}
                      <div>
                        <label
                          className={`text-sm font-medium mb-2 block ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          Registration Number
                        </label>
                        <input
                          type="text"
                          value={profile.registrationNumber || ''}
                          onChange={(e) => handleChange('registrationNumber', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-violet-500 ${
                            isDark
                              ? 'border-gray-600 bg-gray-700 text-white'
                              : 'border-gray-300 bg-white text-gray-900'
                          }`}
                        />
                      </div>

                      <div>
                        <label
                          className={`text-sm font-medium mb-2 block ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          Affiliation Number
                        </label>
                        <input
                          type="text"
                          value={profile.affiliationNumber || ''}
                          onChange={(e) => handleChange('affiliationNumber', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-violet-500 ${
                            isDark
                              ? 'border-gray-600 bg-gray-700 text-white'
                              : 'border-gray-300 bg-white text-gray-900'
                          }`}
                        />
                      </div>

                      <div>
                        <label
                          className={`text-sm font-medium mb-2 block ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          Board
                        </label>
                        <select
                          value={profile.board || 'State Board'}
                          onChange={(e) => handleChange('board', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-violet-500 ${
                            isDark
                              ? 'border-gray-600 bg-gray-700 text-white'
                              : 'border-gray-300 bg-white text-gray-900'
                          }`}
                        >
                          <option value="CBSE">CBSE</option>
                          <option value="ICSE">ICSE</option>
                          <option value="State Board">State Board</option>
                          <option value="IB">IB</option>
                          <option value="Cambridge">Cambridge</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label
                          className={`text-sm font-medium mb-2 block ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          Established Year
                        </label>
                        <input
                          type="number"
                          min="1800"
                          max={new Date().getFullYear()}
                          value={profile.establishedYear || ''}
                          onChange={(e) => handleChange('establishedYear', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-violet-500 ${
                            isDark
                              ? 'border-gray-600 bg-gray-700 text-white'
                              : 'border-gray-300 bg-white text-gray-900'
                          }`}
                        />
                      </div>

                      {/* Description */}
                      <div className="md:col-span-2">
                        <label
                          className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          <FaInfoCircle className="text-violet-600" />
                          Description
                        </label>
                        <textarea
                          value={profile.description || ''}
                          onChange={(e) => handleChange('description', e.target.value)}
                          placeholder="Brief description about your school..."
                          rows={4}
                          className={`w-full px-4 py-3 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-violet-500 resize-none ${
                            isDark
                              ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                              : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Principal Info */}
                    <div>
                      <h3
                        className={`text-lg font-semibold mb-4 ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        Principal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder="Principal Name"
                          value={profile.principal?.name || ''}
                          onChange={(e) => handleChange('principal.name', e.target.value)}
                          className={`px-4 py-3 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-violet-500 ${
                            isDark
                              ? 'border-gray-600 bg-gray-700 text-white'
                              : 'border-gray-300 bg-white text-gray-900'
                          }`}
                        />
                        <input
                          type="email"
                          placeholder="Principal Email"
                          value={profile.principal?.email || ''}
                          onChange={(e) => handleChange('principal.email', e.target.value)}
                          className={`px-4 py-3 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-violet-500 ${
                            isDark
                              ? 'border-gray-600 bg-gray-700 text-white'
                              : 'border-gray-300 bg-white text-gray-900'
                          }`}
                        />
                        <input
                          type="tel"
                          placeholder="Principal Phone"
                          value={profile.principal?.phone || ''}
                          onChange={(e) => handleChange('principal.phone', e.target.value)}
                          className={`px-4 py-3 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-violet-500 ${
                            isDark
                              ? 'border-gray-600 bg-gray-700 text-white'
                              : 'border-gray-300 bg-white text-gray-900'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Info Banner */}
                    {hasChanges && (
                      <div
                        className={`p-4 rounded-xl border ${
                          isDark
                            ? 'bg-amber-900/20 border-amber-800'
                            : 'bg-amber-50 border-amber-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <FaInfoCircle
                            className={isDark ? 'text-amber-400' : 'text-amber-600'}
                          />
                          <p
                            className={`text-sm ${
                              isDark ? 'text-amber-400' : 'text-amber-700'
                            }`}
                          >
                            You have unsaved changes. Click "Save Settings" to apply them.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div
                      className={`flex justify-between items-center pt-6 border-t ${
                        isDark ? 'border-gray-700' : 'border-gray-200'
                      }`}
                    >
                      <div>
                        {!hasChanges && (
                          <div className="flex items-center gap-2">
                            <FaCheckCircle className="text-green-500" />
                            <span
                              className={`text-sm ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              }`}
                            >
                              All changes saved
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={fetch}
                          className={`px-6 py-2.5 rounded-xl border font-medium transition-all ${
                            isDark
                              ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          Reset
                        </button>
                        <button
                          type="submit"
                          disabled={loading || !hasChanges}
                          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <>
                              <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Saving...
                            </>
                          ) : (
                            <>
                              <FaSave />
                              Save Settings
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Academic Settings Tab - Placeholder */}
            {activeTab === 'academic' && (
              <div
                className={`rounded-2xl border shadow-md p-12 text-center ${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}
              >
                <FaGraduationCap
                  className={`mx-auto text-5xl mb-4 ${
                    isDark ? 'text-gray-600' : 'text-gray-400'
                  }`}
                />
                <h3
                  className={`text-lg font-medium mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Academic Settings
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Academic year, grading system, and attendance settings coming soon
                </p>
              </div>
            )}

            {/* System Settings Tab - Placeholder */}
            {activeTab === 'system' && (
              <div
                className={`rounded-2xl border shadow-md p-12 text-center ${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}
              >
                <FaCog
                  className={`mx-auto text-5xl mb-4 ${
                    isDark ? 'text-gray-600' : 'text-gray-400'
                  }`}
                />
                <h3
                  className={`text-lg font-medium mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  System Settings
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Date format, timezone, security, and notification settings coming soon
                </p>
              </div>
            )}

            {/* Statistics Tab */}
            {activeTab === 'statistics' && (
              <div
                className={`rounded-2xl border shadow-md overflow-hidden ${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}
              >
                <div
                  className={`p-6 border-b ${
                    isDark ? 'border-gray-700' : 'border-gray-200'
                  }`}
                >
                  <h2
                    className={`text-xl font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    School Statistics
                  </h2>
                </div>
                {statistics ? (
                  <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div
                      className={`p-6 rounded-xl text-center ${
                        isDark ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <div
                        className={`text-3xl font-bold mb-2 ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {statistics.totalAcademicYears}
                      </div>
                      <div
                        className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        Academic Years
                      </div>
                    </div>
                    <div
                      className={`p-6 rounded-xl text-center ${
                        isDark ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <div
                        className={`text-3xl font-bold mb-2 ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {statistics.workingDays}
                      </div>
                      <div
                        className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        Working Days/Week
                      </div>
                    </div>
                    <div
                      className={`p-6 rounded-xl text-center ${
                        isDark ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <div
                        className={`text-3xl font-bold mb-2 ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {statistics.totalGrades}
                      </div>
                      <div
                        className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        Grading Levels
                      </div>
                    </div>
                    <div
                      className={`p-6 rounded-xl text-center ${
                        isDark ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <div
                        className={`text-3xl font-bold mb-2 ${
                          statistics.subscriptionStatus === 'active'
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        {statistics.subscriptionStatus}
                      </div>
                      <div
                        className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        Subscription
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
