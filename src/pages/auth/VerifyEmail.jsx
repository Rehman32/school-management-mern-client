// ============================================
// EMAIL VERIFICATION PAGE
// ============================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaEnvelope } from 'react-icons/fa';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);
  
  const token = searchParams.get('token');
  const email = location.state?.email || '';

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('No verification token found');
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await axios.post('/auth/verify-email', { token });
      setStatus('success');
      setMessage(response.data.message || 'Email verified successfully!');
      
      toast.success('Email verified! You can now login.');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setMessage(
        error.response?.data?.message || 
        'Verification failed. Token may be invalid or expired.'
      );
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error('Email address not found');
      return;
    }

    setResending(true);
    try {
      await axios.post('/auth/resend-verification', { email });
      toast.success('Verification email sent! Check your inbox.');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to resend verification email'
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="mb-6">
            {status === 'verifying' && (
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
                <FaSpinner className="text-blue-600 text-4xl animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                <FaCheckCircle className="text-green-600 text-4xl" />
              </div>
            )}
            {status === 'error' && (
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
                <FaTimesCircle className="text-red-600 text-4xl" />
              </div>
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {status === 'verifying' && 'Verifying Email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </h2>

          {/* Message */}
          <p className="text-gray-600 mb-6">{message}</p>

          {/* Actions */}
          <div className="space-y-3">
            {status === 'success' && (
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Go to Login
              </button>
            )}

            {status === 'error' && email && (
              <button
                onClick={handleResend}
                disabled={resending}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                {resending ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FaEnvelope className="mr-2" />
                    Resend Verification Email
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
