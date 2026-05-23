import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 p-10 rounded-2xl shadow-xl">
        <div className="flex flex-col items-center mb-10">
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
          <h1 className="text-4xl font-black tracking-tighter">
            <span className="text-india-saffron">INDIA</span>
            <span className="text-india-blue">SITE</span>
          </h1>
          <p className="text-gray-500 text-sm font-bold mt-2">Welcome back to Bharat's Social Feed.</p>
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-6 bg-red-50 py-2 rounded-lg">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 ml-1">EMAIL OR USERNAME</label>
            <input
              type="text"
              placeholder="Email or Username"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-india-saffron/50 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 ml-1">PASSWORD</label>
            <input
              type="password"
              placeholder="Your Password"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-india-saffron/50 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-india-blue text-white font-bold py-3 rounded-xl hover:bg-opacity-90 transition-all shadow-lg shadow-blue-100 flex items-center justify-center space-x-2 mt-4"
          >
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div> : 'Log In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-india-blue font-bold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
