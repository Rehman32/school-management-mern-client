// ============================================
// SETTINGS PAGE - STREAMLINED
// client/src/pages/admin/SettingsPage.jsx
// Clean, functional settings management
// ============================================

import React, { useEffect, useState } from 'react';
import {
  getProfile,
  updateProfile,
  uploadLogo,
} from '../../api/settingsApi';
import { toast } from 'react-hot-toast';
import {
  Settings,
  Save,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Upload,
  Users,
  BookOpen,
  Clock,
  Percent,
  GraduationCap,
  RotateCcw,
  CheckCircle
} from 'lucide-react';

const TABS = [
  { id: 'profile', label: 'School Profile', icon: Building2 },
  { id: 'academic', label: 'Academic Settings', icon: GraduationCap },
];

export default function SettingsPage({ isDark }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'Pakistan',
    pincode: '',
    website: '',
    logo: '',
    description: '',
    board: 'Federal Board',
    establishedYear: '',
    principal: {
      name: '',
      email: '',
      phone: '',
    },
    currentAcademicYear: '',
    passingPercentage: 33,
    attendancePercentageRequired: 75,
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  const fetchProfile = async () => {
    setFetchLoading(true);
    try {
      const res = await getProfile();
      const data = res.data.data || res.data;
      setProfile((prev) => ({
        ...prev,
        ...data,
      }));
      setLogoPreview(data.logo);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load settings');
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(profile);
      toast.success('Settings saved successfully');
      setHasChanges(false);
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    if (field.includes('.')) {
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

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

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

  const InputField = ({ label, icon: Icon, ...props }) => (
    <div>
      <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {Icon && <Icon size={16} className="text-violet-500" />}
        {label}
      </label>
      <input
        {...props}
        className={`w-full px-4 py-3 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-violet-500 ${
          isDark
            ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
            : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
        }`}
      />
    </div>
  );

  const SelectField = ({ label, icon: Icon, options, ...props }) => (
    <div>
      <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {Icon && <Icon size={16} className="text-violet-500" />}
        {label}
      </label>
      <select
        {...props}
        className={`w-full px-4 py-3 border rounded-xl transition-all outline-none focus:ring-2 focus:ring-violet-500 ${
          isDark
            ? 'border-gray-600 bg-gray-700 text-white'
            : 'border-gray-300 bg-white text-gray-900'
        }`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b shadow-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl shadow-lg">
              <Settings className="text-white" size={24} />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Settings
              </h1>
              <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage school profile and academic settings
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <div className={`flex gap-2 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
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
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-6 max-w-5xl mx-auto">
        {fetchLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mb-4"></div>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading settings...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave}>
            {/* School Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Logo & Basic Info Card */}
                <div className={`rounded-2xl border shadow-md overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className={`p-4 border-b ${isDark ? 'border-gray-700 bg-gradient-to-r from-violet-900/20 to-purple-900/20' : 'border-gray-200 bg-gradient-to-r from-violet-50 to-purple-50'}`}>
                    <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Basic Information
                    </h2>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Logo Upload */}
                    <div className="flex items-center gap-6">
                      <div className={`w-24 h-24 rounded-xl border-2 flex items-center justify-center overflow-hidden ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                        ) : (
                          <Building2 size={32} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                        )}
                      </div>
                      <div>
                        <label className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all ${
                          uploadingLogo ? 'opacity-50 cursor-not-allowed' : isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}>
                          <Upload size={16} />
                          {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                          <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploadingLogo} className="hidden" />
                        </label>
                        <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          Max 5MB (JPG, PNG, SVG)
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <InputField
                          label="School Name *"
                          icon={Building2}
                          type="text"
                          required
                          value={profile.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          placeholder="Enter school name"
                        />
                      </div>

                      <InputField
                        label="Email *"
                        icon={Mail}
                        type="email"
                        required
                        value={profile.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                      />

                      <InputField
                        label="Phone"
                        icon={Phone}
                        type="tel"
                        value={profile.phone || ''}
                        onChange={(e) => handleChange('phone', e.target.value)}
                      />

                      <InputField
                        label="Website"
                        icon={Globe}
                        type="url"
                        value={profile.website || ''}
                        onChange={(e) => handleChange('website', e.target.value)}
                        placeholder="https://www.school.com"
                      />

                      <SelectField
                        label="Board"
                        icon={BookOpen}
                        value={profile.board || 'Federal Board'}
                        onChange={(e) => handleChange('board', e.target.value)}
                        options={[
                          { value: 'Federal Board', label: 'Federal Board (FBISE)' },
                          { value: 'Punjab Board', label: 'Punjab Board (BISE Punjab)' },
                          { value: 'Sindh Board', label: 'Sindh Board (BISE Sindh)' },
                          { value: 'KPK Board', label: 'KPK Board (BISE KPK)' },
                          { value: 'Balochistan Board', label: 'Balochistan Board' },
                          { value: 'BISE Swat', label: 'BISE Swat' },
                          { value: 'BISE Mardan', label: 'BISE Mardan' },
                          { value: 'BISE Peshawar', label: 'BISE Peshawar' },
                          { value: 'Aga Khan Board', label: 'Aga Khan Board' },
                          { value: 'Cambridge', label: 'Cambridge (O/A Levels)' },
                          { value: 'Other', label: 'Other' },
                        ]}
                      />

                      <InputField
                        label="Established Year"
                        icon={Calendar}
                        type="number"
                        min="1800"
                        max={new Date().getFullYear()}
                        value={profile.establishedYear || ''}
                        onChange={(e) => handleChange('establishedYear', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Address Card */}
                <div className={`rounded-2xl border shadow-md overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <MapPin size={18} className="text-violet-500" />
                      Address
                    </h2>
                  </div>

                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <InputField
                        label="Street Address"
                        type="text"
                        value={profile.address || ''}
                        onChange={(e) => handleChange('address', e.target.value)}
                      />
                    </div>

                    <InputField
                      label="City"
                      type="text"
                      value={profile.city || ''}
                      onChange={(e) => handleChange('city', e.target.value)}
                    />

                    <InputField
                      label="State"
                      type="text"
                      value={profile.state || ''}
                      onChange={(e) => handleChange('state', e.target.value)}
                    />

                    <InputField
                      label="Country"
                      type="text"
                      value={profile.country || 'India'}
                      onChange={(e) => handleChange('country', e.target.value)}
                    />

                    <InputField
                      label="Pincode"
                      type="text"
                      value={profile.pincode || ''}
                      onChange={(e) => handleChange('pincode', e.target.value)}
                    />
                  </div>
                </div>

                {/* Principal Card */}
                <div className={`rounded-2xl border shadow-md overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <Users size={18} className="text-violet-500" />
                      Principal Information
                    </h2>
                  </div>

                  <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField
                      label="Name"
                      type="text"
                      value={profile.principal?.name || ''}
                      onChange={(e) => handleChange('principal.name', e.target.value)}
                      placeholder="Principal name"
                    />

                    <InputField
                      label="Email"
                      type="email"
                      value={profile.principal?.email || ''}
                      onChange={(e) => handleChange('principal.email', e.target.value)}
                      placeholder="principal@school.com"
                    />

                    <InputField
                      label="Phone"
                      type="tel"
                      value={profile.principal?.phone || ''}
                      onChange={(e) => handleChange('principal.phone', e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                {/* Description Card */}
                <div className={`rounded-2xl border shadow-md overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      About School
                    </h2>
                  </div>

                  <div className="p-6">
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
              </div>
            )}

            {/* Academic Settings Tab */}
            {activeTab === 'academic' && (
              <div className="space-y-6">
                {/* Academic Year Card */}
                <div className={`rounded-2xl border shadow-md overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className={`p-4 border-b ${isDark ? 'border-gray-700 bg-gradient-to-r from-violet-900/20 to-purple-900/20' : 'border-gray-200 bg-gradient-to-r from-violet-50 to-purple-50'}`}>
                    <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <Calendar size={18} className="text-violet-500" />
                      Current Academic Year
                    </h2>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="Academic Year"
                        icon={Calendar}
                        type="text"
                        value={profile.currentAcademicYear || ''}
                        onChange={(e) => handleChange('currentAcademicYear', e.target.value)}
                        placeholder="2024-2025"
                      />
                    </div>
                    <p className={`text-sm mt-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Format: YYYY-YYYY (e.g., 2024-2025)
                    </p>
                  </div>
                </div>

                {/* Grading & Attendance Card */}
                <div className={`rounded-2xl border shadow-md overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <Percent size={18} className="text-violet-500" />
                      Grading & Attendance Rules
                    </h2>
                  </div>

                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        <Percent size={16} className="text-violet-500" />
                        Passing Percentage
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="20"
                          max="60"
                          value={profile.passingPercentage || 33}
                          onChange={(e) => handleChange('passingPercentage', parseInt(e.target.value))}
                          className="flex-1 h-2 rounded-full appearance-none cursor-pointer accent-violet-600"
                          style={{ background: isDark ? '#374151' : '#e5e7eb' }}
                        />
                        <span className={`w-12 text-center font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {profile.passingPercentage || 33}%
                        </span>
                      </div>
                      <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Minimum percentage required to pass exams
                      </p>
                    </div>

                    <div>
                      <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        <Clock size={16} className="text-violet-500" />
                        Attendance Required
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="50"
                          max="90"
                          value={profile.attendancePercentageRequired || 75}
                          onChange={(e) => handleChange('attendancePercentageRequired', parseInt(e.target.value))}
                          className="flex-1 h-2 rounded-full appearance-none cursor-pointer accent-violet-600"
                          style={{ background: isDark ? '#374151' : '#e5e7eb' }}
                        />
                        <span className={`w-12 text-center font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {profile.attendancePercentageRequired || 75}%
                        </span>
                      </div>
                      <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Minimum attendance required to sit for exams
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Info Card */}
                <div className={`rounded-xl p-4 ${isDark ? 'bg-violet-900/20 border border-violet-800' : 'bg-violet-50 border border-violet-200'}`}>
                  <p className={`text-sm ${isDark ? 'text-violet-300' : 'text-violet-700'}`}>
                    💡 <strong>Tip:</strong> These settings affect how grades and attendance are calculated across the system.
                    Students below the attendance threshold may be flagged for exam eligibility.
                  </p>
                </div>
              </div>
            )}

            {/* Save Button - Fixed at bottom */}
            <div className={`sticky bottom-6 mt-8 p-4 rounded-2xl border shadow-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  {hasChanges ? (
                    <p className={`text-sm flex items-center gap-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      Unsaved changes
                    </p>
                  ) : (
                    <p className={`text-sm flex items-center gap-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      <CheckCircle size={16} />
                      All changes saved
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={fetchProfile}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium transition-all ${
                      isDark
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <RotateCcw size={16} />
                    Reset
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !hasChanges}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Settings
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
