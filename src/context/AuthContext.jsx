// ============================================
// ENHANCED AUTH CONTEXT
// With refresh tokens & auto token refresh
// ============================================

import { createContext, useContext, useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Verify token is still valid by fetching user
          const res = await axios.get('/auth/me');
          const userData = res.data.data?.user || res.data.user;
          setUser(userData);
          setRole(userData.role);
          setToken(storedToken);
        } catch (error) {
          console.error('Token invalid, clearing auth');
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
 * Login - Store token and fetch user info (FIXED)
 */
const login = async (accessToken) => {
  try {
    console.log('🔍 AuthContext: Storing token'); // DEBUG
    
    setToken(accessToken);
    localStorage.setItem('token', accessToken);

    // Fetch user info
    console.log('🔍 AuthContext: Fetching user info'); // DEBUG
    const res = await axios.get('/auth/me');
    
    console.log('✅ AuthContext: Response received:', res.data); // DEBUG

    // Handle different response formats
    const userData = res.data?.data?.user || res.data?.user || res.data?.data;
    
    console.log('✅ AuthContext: User data:', userData); // DEBUG

    if (!userData || !userData.role) {
      console.error('❌ AuthContext: Invalid user data format:', res.data);
      throw new Error('Invalid user data received from server');
    }

    setUser(userData);
    setRole(userData.role);
    localStorage.setItem('role', userData.role);

    // Redirect based on role
    console.log('✅ AuthContext: Redirecting to', userData.role, 'dashboard'); // DEBUG
    
    if (userData.role === 'admin' || userData.role === 'teacher') {
      navigate('/admin/dashboard');
    } else {
      console.error('❌ Unauthorized role:', userData.role);
      logout();
    }
  } catch (err) {
    console.error('❌ AuthContext: Error fetching user info:', err);
    console.error('Response:', err.response?.data);
    logout(); // Clear invalid state
  }
};


  /**
   * Logout - Clear everything
   */
  const logout = async () => {
    try {
      // Call backend logout (revokes refresh token)
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless
      setUser(null);
      setRole(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      delete axios.defaults.headers.common['Authorization'];
      navigate('/login');
    }
  };

  /**
   * Update user info (after profile update)
   */
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const authData = {
    user,
    token,
    role,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
