// ============================================
// SCHOOL REGISTRATION PAGE - UI POLISHED
// Consistent with Login using Lucide icons
// ============================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchool } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  Building2, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Building, 
  Globe, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  GraduationCap,
  BookOpen
} from 'lucide-react';
import './SchoolRegister.css';

const SchoolRegister = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolEmail: '',
    schoolPhone: '',
    schoolAddress: '',
    city: '',
    state: '',
    country: 'Pakistan',
    board: 'State Board',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.schoolName.trim()) {
      newErrors.schoolName = 'School name is required';
    }
    if (!formData.schoolEmail.trim()) {
      newErrors.schoolEmail = 'School email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.schoolEmail)) {
      newErrors.schoolEmail = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.adminName.trim()) {
      newErrors.adminName = 'Your name is required';
    }
    if (!formData.adminEmail.trim()) {
      newErrors.adminEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
      newErrors.adminEmail = 'Invalid email format';
    }
    if (!formData.adminPassword) {
      newErrors.adminPassword = 'Password is required';
    } else if (formData.adminPassword.length < 8) {
      newErrors.adminPassword = 'Password must be at least 8 characters';
    }
    if (formData.adminPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
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
      const result = await registerSchool({
        schoolName: formData.schoolName,
        schoolEmail: formData.schoolEmail,
        schoolPhone: formData.schoolPhone,
        schoolAddress: formData.schoolAddress,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        board: formData.board,
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        adminPassword: formData.adminPassword
      });
      
      if (result.data?.accessToken) {
        localStorage.setItem('token', result.data.accessToken);
        if (authLogin) {
          authLogin(result.data);
        }
      }
      
      toast.success('School registered successfully! Welcome aboard!');
      navigate('/admin/dashboard');
      
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="school-register-page">
      <div className="register-container">
        {/* Left side - Branding */}
        <div className="branding-section">
          <div className="brand-content">
            <div className="brand-icon-wrapper">
              <GraduationCap size={48} />
            </div>
            <h1>School Management System</h1>
            <p>Set up your school's digital management platform in minutes</p>
            
            <div className="features-list">
              <div className="feature-item">
                <CheckCircle size={18} />
                <span>Student & Teacher Management</span>
              </div>
              <div className="feature-item">
                <CheckCircle size={18} />
                <span>Attendance & Fee Tracking</span>
              </div>
              <div className="feature-item">
                <CheckCircle size={18} />
                <span>Exams & Report Cards</span>
              </div>
              <div className="feature-item">
                <CheckCircle size={18} />
                <span>Timetable Management</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="form-section">
          <div className="form-header">
            <h2>Register Your School</h2>
            <p>Step {step} of 2 - {step === 1 ? 'School Information' : 'Admin Account'}</p>
            
            {/* Progress bar */}
            <div className="progress-bar">
              <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
              <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
              <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            {errors.submit && (
              <div className="error-banner">{errors.submit}</div>
            )}

            {/* Step 1: School Info */}
            {step === 1 && (
              <div className="form-step">
                <div className="input-group">
                  <label>
                    <Building2 size={16} />
                    School Name *
                  </label>
                  <input
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleChange}
                    placeholder="e.g., Springfield High School"
                    className={errors.schoolName ? 'error' : ''}
                  />
                  {errors.schoolName && <span className="error-text">{errors.schoolName}</span>}
                </div>

                <div className="input-group">
                  <label>
                    <Mail size={16} />
                    School Email *
                  </label>
                  <input
                    type="email"
                    name="schoolEmail"
                    value={formData.schoolEmail}
                    onChange={handleChange}
                    placeholder="info@yourschool.edu"
                    className={errors.schoolEmail ? 'error' : ''}
                  />
                  {errors.schoolEmail && <span className="error-text">{errors.schoolEmail}</span>}
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label>
                      <Phone size={16} />
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="schoolPhone"
                      value={formData.schoolPhone}
                      onChange={handleChange}
                      placeholder="+92 300 1234567"
                    />
                  </div>

                  <div className="input-group">
                    <label>
                      <BookOpen size={16} />
                      Board
                    </label>
                    <select
                      name="board"
                      value={formData.board}
                      onChange={handleChange}
                    >
                      <option value="State Board">State Board</option>
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE</option>
                      <option value="Cambridge">Cambridge</option>
                      <option value="IB">IB</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label>
                    <MapPin size={16} />
                    Address
                  </label>
                  <input
                    type="text"
                    name="schoolAddress"
                    value={formData.schoolAddress}
                    onChange={handleChange}
                    placeholder="Street address"
                  />
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label>
                      <Building size={16} />
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                    />
                  </div>

                  <div className="input-group">
                    <label>State/Province</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                    />
                  </div>
                </div>

                <button type="button" className="btn-next" onClick={handleNext}>
                  Next Step <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* Step 2: Admin Account */}
            {step === 2 && (
              <div className="form-step">
                <div className="step-intro">
                  <p>Create your administrator account to manage <strong>{formData.schoolName}</strong></p>
                </div>

                <div className="input-group">
                  <label>
                    <User size={16} />
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleChange}
                    placeholder="e.g., John Doe"
                    className={errors.adminName ? 'error' : ''}
                  />
                  {errors.adminName && <span className="error-text">{errors.adminName}</span>}
                </div>

                <div className="input-group">
                  <label>
                    <Mail size={16} />
                    Your Email *
                  </label>
                  <input
                    type="email"
                    name="adminEmail"
                    value={formData.adminEmail}
                    onChange={handleChange}
                    placeholder="admin@yourschool.edu"
                    className={errors.adminEmail ? 'error' : ''}
                  />
                  {errors.adminEmail && <span className="error-text">{errors.adminEmail}</span>}
                </div>

                <div className="input-group">
                  <label>
                    <Lock size={16} />
                    Password *
                  </label>
                  <input
                    type="password"
                    name="adminPassword"
                    value={formData.adminPassword}
                    onChange={handleChange}
                    placeholder="Min 8 characters"
                    className={errors.adminPassword ? 'error' : ''}
                  />
                  {errors.adminPassword && <span className="error-text">{errors.adminPassword}</span>}
                </div>

                <div className="input-group">
                  <label>
                    <Lock size={16} />
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className={errors.confirmPassword ? 'error' : ''}
                  />
                  {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>

                <div className="button-row">
                  <button type="button" className="btn-back" onClick={handleBack}>
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? (
                      <>
                        <div className="spinner" />
                        Creating...
                      </>
                    ) : (
                      'Create School Account'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="form-footer">
            <p>
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolRegister;
