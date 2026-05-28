import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebaseConfig';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, ShieldCheck } from 'lucide-react';

const Register = () => {
  const [step, setStep] = useState(1);
  const [authMethod, setAuthMethod] = useState('phone'); // 'phone' or 'email'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    dob: '',
    password: '',
    otp: '',
    agreeToTerms: false
  });
  
  const [verificationId, setVerificationId] = useState(null);
  const [otpArray, setOtpArray] = useState(new Array(6).fill(''));
  const otpInputRefs = React.useRef([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otpArray];
    newOtp[index] = element.value;
    setOtpArray(newOtp);
    setFormData({ ...formData, otp: newOtp.join('') });

    // Focus next input
    if (element.value !== '' && index < 5) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otpArray[index] && index > 0) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible'
      });
    }
  }, []);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleCheckUserExists = async (field, value) => {
    try {
      const res = await api.post('/api/auth/check-exists', { [field]: value });
      if (res.data.exists) {
        setError(res.data.message);
        return true;
      }
      setError('');
      return false;
    } catch (err) {
      return false;
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      await api.post('/api/auth/send-email-otp', { email: formData.email });
      setResendTimer(60);
      setError('');
    } catch (err) {
      setError('Failed to resend code. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    const exists = await handleCheckUserExists(
      authMethod === 'phone' ? 'phone' : 'email', 
      authMethod === 'phone' ? formData.phone : formData.email
    );
    
    if (exists) {
      setLoading(false);
      return;
    }

    try {
      if (authMethod === 'phone') {
        const appVerifier = window.recaptchaVerifier;
        const confirmationResult = await signInWithPhoneNumber(auth, formData.phone, appVerifier);
        setVerificationId(confirmationResult);
        nextStep();
      } else {
        await api.post('/api/auth/send-email-otp', { email: formData.email });
        setResendTimer(60);
        nextStep();
      }
    } catch (err) {
      console.error('Auth Error:', err);
      setError(err.response?.data?.message || 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyAndRegister = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!formData.username.trim() || !formData.password || !formData.dob) {
        setError('Please complete username, password, and date of birth before registering.');
        setLoading(false);
        return;
      }

      let firebaseUid = 'test-uid-' + Date.now();
      
      if (authMethod === 'phone') {
        if (formData.otp !== '123456') { // Allowing a bypass for phone while testing
          const result = await verificationId.confirm(formData.otp);
          firebaseUid = result.user.uid;
        }
      } else {
        await api.post('/api/auth/verify-email-otp', { 
          email: formData.email, 
          otp: formData.otp 
        });
      }

      await register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phoneNumber: formData.phone || undefined,
        dob: formData.dob,
        otp: formData.otp,
        firebaseUid
      });
      navigate('/');
    } catch (err) {
      console.error('Registration Error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Welcome', desc: 'Choose' },
    { title: 'Verify', desc: 'Secure' },
    { title: 'Profile', desc: 'Unique' },
    { title: 'Birthday', desc: 'Personalize' },
    { title: 'Legal', desc: 'Terms' }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 py-10 bg-[#FAFAFA]">
      <div id="recaptcha-container"></div>
      
      <div className="w-full max-w-md bg-white border border-gray-100 p-8 rounded-[2rem] shadow-2xl shadow-gray-200/50">
        {/* Progress Bar */}
        <div className="flex justify-between mb-8 px-2">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-500 ${i + 1 <= step ? 'w-12 bg-india-blue' : 'w-4 bg-gray-100'}`} 
            />
          ))}
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="flag-animation w-16 h-10 mb-2 shadow-md overflow-hidden flex flex-col">
            <div className="h-1/3 bg-india-saffron w-full"></div>
            <div className="h-1/3 bg-white w-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 border-2 border-india-blue rounded-full relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[1px] h-full bg-india-blue rotate-45 scale-y-110"></div>
                  <div className="w-[1px] h-full bg-india-blue -rotate-45 scale-y-110"></div>
                </div>
              </div>
            </div>
            <div className="h-1/3 bg-india-green w-full"></div>
          </div>
          <h1 className="text-3xl font-black tracking-tighter">
            <span className="text-india-saffron">INDIA</span>
            <span className="text-india-blue">SITE</span>
          </h1>
          <p className="text-gray-500 text-sm font-bold mt-2 text-center">Sign up to join Bharat's own social network.</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 text-red-500 text-sm font-bold rounded-2xl flex items-center space-x-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span>{error}</span>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Auth Method */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex bg-gray-50 p-1 rounded-2xl mb-6">
                <button 
                  onClick={() => setAuthMethod('phone')}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${authMethod === 'phone' ? 'bg-white shadow-sm text-india-blue' : 'text-gray-400'}`}
                >
                  Phone
                </button>
                <button 
                  onClick={() => setAuthMethod('email')}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${authMethod === 'email' ? 'bg-white shadow-sm text-india-blue' : 'text-gray-400'}`}
                >
                  Email
                </button>
              </div>

              {authMethod === 'phone' ? (
                <div className="space-y-4">
                  <input 
                    type="tel" 
                    placeholder="Enter Mobile Number" 
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-india-blue/20 outline-none"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              ) : (
                <input 
                  type="email" 
                  placeholder="Enter Email Address" 
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-india-blue/20 outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              )}
              
              <button 
                onClick={sendOTP} 
                disabled={loading}
                className="w-full bg-india-blue text-white font-bold py-4 rounded-2xl mt-8 flex items-center justify-center space-x-2 hover:opacity-90 transition-all active:scale-95"
              >
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <><span>Continue</span> <ChevronRight size={18} /></>}
              </button>
            </motion.div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <p className="text-sm text-gray-500 mb-8 font-medium text-center">
                Enter the 6-digit code sent to <br />
                <span className="text-black font-black">{authMethod === 'phone' ? formData.phone : formData.email}</span>
              </p>
              
              <div className="flex justify-center gap-2 mb-4">
                {otpArray.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    className="w-12 h-14 bg-gray-50 border-2 border-gray-100 rounded-xl text-center text-xl font-black text-india-blue focus:border-india-blue focus:ring-0 outline-none transition-all"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  />
                ))}
              </div>

              <div className="text-center mb-8">
                {resendTimer > 0 ? (
                  <p className="text-xs text-gray-400 font-bold">Resend code in {resendTimer}s</p>
                ) : (
                  <button onClick={handleResendOTP} className="text-xs text-india-blue font-black hover:underline">
                    Didn't get the code? Resend
                  </button>
                )}
              </div>

              <div className="flex justify-between items-center mt-8">
                <button onClick={prevStep} className="text-gray-400 font-bold text-sm flex items-center hover:text-gray-600 transition-colors">
                  <ChevronLeft size={18} /> Back
                </button>
                <button 
                  onClick={nextStep} 
                  disabled={formData.otp.length !== 6}
                  className={`px-10 py-3 rounded-xl font-bold transition-all ${formData.otp.length === 6 ? 'bg-india-blue text-white shadow-lg shadow-blue-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                  Verify
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Username & Password */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Enter Username" 
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-india-blue/20 outline-none"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
                <input 
                  type="password" 
                  placeholder="Create Password" 
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-india-blue/20 outline-none"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <button onClick={nextStep} className="w-full bg-india-blue text-white font-bold py-4 rounded-2xl mt-8">Next Step</button>
            </motion.div>
          )}

          {/* Step 4: DOB */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <input 
                type="text"
                inputMode="numeric"
                placeholder="Date of Birth (YYYY-MM-DD)"
                maxLength="10"
                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-india-blue/20 outline-none"
                value={formData.dob}
                onChange={(e) => setFormData({...formData, dob: e.target.value})}
              />
              <button onClick={nextStep} className="w-full bg-india-blue text-white font-bold py-4 rounded-2xl mt-8">Almost Done</button>
            </motion.div>
          )}

          {/* Step 5: Terms & Privacy */}
          {step === 5 && (
            <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="bg-gray-50 p-6 rounded-[2rem] space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-india-green/10 rounded-full"><ShieldCheck className="text-india-green" size={16} /></div>
                  <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                    By clicking "Agree & Register", you agree to our <Link to="/terms" className="text-india-blue font-bold">Terms</Link> and <Link to="/privacy" className="text-india-blue font-bold">Privacy</Link>.
                  </p>
                </div>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.agreeToTerms ? 'bg-india-blue border-india-blue' : 'border-gray-200'}`}>
                    {formData.agreeToTerms && <Check className="text-white" size={14} strokeWidth={4} />}
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData({...formData, agreeToTerms: e.target.checked})}
                  />
                  <span className="text-xs font-bold text-gray-700">I agree to the policies</span>
                </label>
              </div>
              <button 
                onClick={verifyAndRegister} 
                disabled={!formData.agreeToTerms || loading}
                className={`w-full font-bold py-4 rounded-2xl transition-all ${formData.agreeToTerms ? 'bg-india-blue text-white shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mx-auto" /> : 'Agree & Register'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 font-medium">
            Have an account? <Link to="/login" className="text-india-blue font-black hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
