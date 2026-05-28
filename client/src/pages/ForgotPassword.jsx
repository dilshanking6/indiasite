import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, KeyRound, Mail, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Identifier, 2: OTP & New Password
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/auth/forgot-password', { identifier });
      setEmail(res.data.email);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/api/auth/reset-password', { 
        email, 
        otp, 
        newPassword 
      });
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4">
      <div className="w-full max-w-md bg-white border border-gray-100 p-8 rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-india-blue/10 rounded-full flex items-center justify-center mb-4">
            <KeyRound className="text-india-blue" size={32} />
          </div>
          <h1 className="text-2xl font-black text-center text-gray-800">Reset Password</h1>
          <p className="text-gray-500 text-sm font-medium mt-2 text-center">
            {step === 1 ? "Enter your email, username or phone to receive an OTP." : "Enter the OTP sent to your email and choose a new password."}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-500 text-sm font-bold rounded-2xl flex items-center space-x-2">
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-600 text-sm font-bold rounded-2xl flex items-center space-x-2">
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSendOTP} 
              className="space-y-4"
            >
              <input 
                type="text" 
                placeholder="Email, Username or Phone" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-6 text-sm font-bold outline-none focus:ring-2 focus:ring-india-blue/20"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-india-blue text-white font-bold py-4 rounded-xl flex items-center justify-center"
              >
                {loading ? "Sending..." : 'Send OTP'}
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleResetPassword} 
              className="space-y-4"
            >
              <div className="p-3 bg-blue-50 rounded-xl mb-4 flex items-center space-x-3">
                <Mail className="text-india-blue" size={18} />
                <span className="text-xs font-bold text-india-blue truncate">{email}</span>
              </div>
              <input 
                type="text" 
                placeholder="6-digit OTP" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-6 text-sm font-bold outline-none"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
                required
              />
              <input 
                type="password" 
                placeholder="New Password" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 px-6 text-sm font-bold outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-india-blue text-white font-bold py-4 rounded-xl"
              >
                {loading ? "Resetting..." : 'Reset Password'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center">
          <Link to="/login" className="text-india-blue font-black text-sm flex items-center justify-center space-x-1 hover:underline">
            <ChevronLeft size={16} />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
