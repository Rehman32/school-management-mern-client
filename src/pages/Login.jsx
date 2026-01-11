// ============================================
// LOGIN PAGE - ENHANCED TO MATCH REGISTER
// Professional split-panel design
// ============================================

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import toast from 'react-hot-toast';
import { Link } from "react-router-dom";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  GraduationCap,
  Shield,
  Users,
  BookOpen,
  CheckCircle
} from 'lucide-react';
import axios from '../utils/axiosInstance';
import './auth/Login.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberEmail');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please enter email and password');
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await axios.post('/auth/login', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      const token = response.data?.data?.accessToken || response.data?.accessToken;

      if (!token) {
        toast.error('Login failed: Invalid response');
        return;
      }

      if (rememberMe) {
        localStorage.setItem('rememberEmail', formData.email);
      } else {
        localStorage.removeItem('rememberEmail');
      }

      login(token);
      toast.success("Welcome back!");
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid email or password';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left side - Branding */}
        <div className="branding-section">
          <div className="brand-content">
            <div className="brand-icon-wrapper">
              <GraduationCap size={48} />
            </div>
            <h1>School Management System</h1>
            <p>Manage your school efficiently with our comprehensive platform</p>
            
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
                <span>Timetable & Academics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="form-section">
          <div className="form-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Input */}
            <div className="input-group">
              <label>
                <Mail size={16} />
                Email Address
              </label>
              <div className="input-wrapper">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="input-group">
              <label>
                <Lock size={16} />
                Password
              </label>
              <div className="input-wrapper password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="spinner" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="form-footer">
            <p>
              New to School Management?{" "}
              <Link to="/register-school">Register your school</Link>
            </p>
          </div>

          <div className="footer-copyright">
            © {new Date().getFullYear()} School Management System
          </div>
        </div>
      </div>
    </div>
  );
}
