import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../../api/settingsApi';
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
} from 'react-icons/fa';

// Component receives isDark as a prop - matching your AdminDashboard pattern
export default function SettingsPage({ isDark }) {
  const [profile, setProfile] = useState({
    name: '',
    address: '',
    phone: '',
    logo: '',
    email: '',
    website: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  const fetch = async () => {
    setFetchLoading(true);
    try {
      const res = await getProfile();
      const data = res.data || res;
      setProfile(data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load profile');
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetch();
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
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setProfile((p) => ({ ...p, [field]: value }));
    setHasChanges(true);
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
      </div>

      <div className="p-6 max-w-5xl mx-auto">
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
          <div className="space-y-6">
            {/* Profile Information Card */}
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
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl">
                    <FaSchool className="text-white text-xl" />
                  </div>
                  <div>
                    <h2
                      className={`text-xl font-bold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      School Profile
                    </h2>
                    <p
                      className={`text-sm mt-0.5 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      Basic information about your institution
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-6">
                {/* Logo Preview */}
                {profile.logo && (
                  <div className="flex justify-center">
                    <div
                      className={`p-4 rounded-xl border-2 border-dashed ${
                        isDark
                          ? 'border-gray-600 bg-gray-700/50'
                          : 'border-gray-300 bg-gray-50'
                      }`}
                    >
                      <img
                        src={profile.logo}
                        alt="School Logo"
                        className="h-24 w-24 object-contain rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* School Name */}
                  <div className="md:col-span-2">
                    <label
                      className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      <FaSchool className="text-violet-600" />
                      School Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Enter school name"
                      className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                        isDark
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                      }`}
                    />
                  </div>

                  {/* Address */}
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
                      placeholder="Enter school address"
                      className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                        isDark
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                      }`}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      <FaPhone className="text-violet-600" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                        isDark
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                      }`}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      <FaEnvelope className="text-violet-600" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profile.email || ''}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="school@example.com"
                      className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                        isDark
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                      }`}
                    />
                  </div>

                  {/* Website */}
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
                      className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                        isDark
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                      }`}
                    />
                  </div>

                  {/* Logo URL */}
                  <div>
                    <label
                      className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      <FaImage className="text-violet-600" />
                      Logo URL
                    </label>
                    <input
                      type="url"
                      value={profile.logo}
                      onChange={(e) => handleChange('logo', e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
                        isDark
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
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
                      Description (Optional)
                    </label>
                    <textarea
                      value={profile.description || ''}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Brief description about your school..."
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none ${
                        isDark
                          ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
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
                  className={`flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t ${
                    isDark ? 'border-gray-700' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
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
                      className={`px-6 py-2.5 rounded-xl border font-medium transition-all duration-200 ${
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
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium shadow-md transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* Additional Settings Placeholder */}
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
                <h3
                  className={`text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  System Settings
                </h3>
                <p
                  className={`text-sm mt-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Configure system-wide preferences
                </p>
              </div>
              <div className="p-6">
                <div
                  className={`text-center py-12 rounded-xl border-2 border-dashed ${
                    isDark ? 'border-gray-700' : 'border-gray-300'
                  }`}
                >
                  <FaCog
                    className={`mx-auto text-4xl mb-3 ${
                      isDark ? 'text-gray-600' : 'text-gray-400'
                    }`}
                  />
                  <p
                    className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    Additional system settings coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
