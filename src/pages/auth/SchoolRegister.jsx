// ============================================
// SCHOOL REGISTRATION PAGE
// Register new school (tenant) with admin
// ============================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import { FaSchool, FaUser, FaEnvelope, FaLock, FaPhone, FaGlobe, FaCheck } from 'react-icons/fa';

export default function SchoolRegister() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // School Info
    schoolName: '',
    schoolEmail: '',
    phone: '',
    subdomain: '',
    
    // Admin Info
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    confirmPassword: '',
    
    // Terms
    acceptTerms: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubdomainChange = (e) => {
    // Only allow lowercase letters, numbers, and hyphens
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setFormData({ ...formData, subdomain: value });
  };

  const validateStep1 = () => {
    if (!formData.schoolName || !formData.schoolEmail) {
      toast.error('Please fill all school details');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.adminName || !formData.adminEmail || !formData.adminPassword) {
      toast.error('Please fill all admin details');
      return false;
    }
    if (formData.adminPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return false;
    }
    if (formData.adminPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if (!formData.acceptTerms) {
      toast.error('Please accept terms and conditions');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) return;

    setLoading(true);

    try {
      const response = await axios.post('/tenants/register', {
        schoolName: formData.schoolName,
        schoolEmail: formData.schoolEmail,
        phone: formData.phone,
        subdomain: formData.subdomain || null,
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        adminPassword: formData.adminPassword,
      });

      toast.success('School registered successfully! Please verify your email.');
      
      // Redirect to verification page or login
      navigate('/verify-email', { 
        state: { email: formData.adminEmail } 
      });
    } catch (error) {
      console.error('Registration error:', error);
      const errorMsg = error.response?.data?.message || 
                      error.response?.data?.msg || 
                      'Registration failed';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <FaSchool className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Register Your School</h2>
          <p className="mt-2 text-sm text-gray-600">
            Start managing your school with our comprehensive system
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              {/* Step 1 */}
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > 1 ? <FaCheck /> : '1'}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step >= 1 ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  School Info
                </span>
              </div>

              {/* Divider */}
              <div className={`w-12 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>

              {/* Step 2 */}
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  2
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step >= 2 ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  Admin Account
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit}>
            {/* Step 1: School Information */}
            {step === 1 && (
              <div className="space-y-5">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">School Information</h3>

                {/* School Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Name *
                  </label>
                  <div className="relative">
                    <FaSchool className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleChange}
                      placeholder="e.g., ABC High School"
                      required
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* School Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Email *
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="schoolEmail"
                      value={formData.schoolEmail}
                      onChange={handleChange}
                      placeholder="info@abcschool.com"
                      required
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+92 300 1234567"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Subdomain */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subdomain (Optional)
                  </label>
                  <div className="relative">
                    <FaGlobe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="subdomain"
                      value={formData.subdomain}
                      onChange={handleSubdomainChange}
                      placeholder="abc-school"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  {formData.subdomain && (
                    <p className="mt-2 text-sm text-gray-600">
                      Your school URL: <span className="font-medium text-blue-600">
                        {formData.subdomain}.yourschool.com
                      </span>
                    </p>
                  )}
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Admin Account */}
            {step === 2 && (
              <div className="space-y-5">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Admin Account</h3>

                {/* Admin Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Full Name *
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="adminName"
                      value={formData.adminName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Admin Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Email *
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="adminEmail"
                      value={formData.adminEmail}
                      onChange={handleChange}
                      placeholder="admin@abcschool.com"
                      required
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="adminPassword"
                      value={formData.adminPassword}
                      onChange={handleChange}
                      placeholder="Min. 8 characters"
                      required
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      required
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    I agree to the{' '}
                    <Link to="/terms" className="text-blue-600 hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Registering...' : 'Complete Registration'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
