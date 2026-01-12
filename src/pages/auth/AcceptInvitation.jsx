import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { verifyInvitation, acceptInvitation } from '../../api/invitationApi';
import { useAuth } from '../../context/AuthContext';
import './AcceptInvitation.css';

const AcceptInvitation = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [invitation, setInvitation] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('Invalid invitation link. No token provided.');
        setLoading(false);
        return;
      }

      try {
        const result = await verifyInvitation(token);
        setInvitation(result.data);
        setFormData(prev => ({ ...prev, name: result.data.name || '' }));
      } catch (err) {
        setError(err.response?.data?.message || 'Invalid or expired invitation');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setSubmitting(true);

    try {
      const result = await acceptInvitation(token, formData.name, formData.password);
      
      // Auto login
      if (result.data?.accessToken) {
        localStorage.setItem('token', result.data.accessToken);
        if (authLogin) {
          authLogin(result.data);
        }
      }
      
      navigate('/admin/dashboard', { 
        state: { message: 'Account created successfully! Welcome aboard.' } 
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="accept-invitation-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Verifying invitation...</p>
        </div>
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className="accept-invitation-page">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h2>Invalid Invitation</h2>
          <p>{error}</p>
          <Link to="/login" className="btn-primary">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="accept-invitation-page">
      <div className="invitation-card">
        <div className="card-header">
          <div className="welcome-icon">👋</div>
          <h1>Welcome!</h1>
          <p>You've been invited to join as a <strong>{invitation?.role}</strong></p>
        </div>

        <form onSubmit={handleSubmit} className="invitation-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={invitation?.email || ''} 
              disabled 
              className="disabled-input"
            />
          </div>

          <div className="form-group">
            <label>Your Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Create Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 8 characters"
              required
              minLength={8}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-submit"
            disabled={submitting}
          >
            {submitting ? 'Creating Account...' : 'Create Account & Login'}
          </button>
        </form>

        <div className="card-footer">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitation;
