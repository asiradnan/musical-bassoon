import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../slices/authSlice';
import { Music, Mail, Lock, AlertCircle } from 'lucide-react';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user, isLoading, error } = useSelector((state) => state.auth);
  
  const redirect = location.search ? location.search.split('=')[1] : '/';
  
  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);
  
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(login({ email, password }));
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-6 flex items-center justify-center">
            <Music className="mr-2" size={24} />
            <h1 className="text-2xl font-bold">Sign In</h1>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="alert alert-danger flex items-center mb-4">
                <AlertCircle className="mr-2" size={20} />
                {error}
              </div>
            )}
            
            <form onSubmit={submitHandler}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    className="form-control pl-10"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="password"
                    id="password"
                    className="form-control pl-10"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4 text-right">
                <Link
                  to="/forgotpassword"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Forgot Password?
                </Link>
              </div>
              
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                New customer?{' '}
                <Link
                  to={redirect ? `/register?redirect=${redirect}` : '/register'}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Register
                </Link>
              </p>
            </div>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="btn btn-outline flex items-center justify-center"
                  onClick={() => alert('Google login not implemented yet')}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .5 4.1 1.4l3-3C17.1 1.6 14.7 1 12 1 7.3 1 3.4 3.9 1.5 8l3.5 2.7C6 7.8 8.8 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.2c0-.8-.1-1.6-.2-2.4H12v4.6h6.5c-.3 1.4-1.1 2.6-2.3 3.4l3.5 2.7c2-1.9 3.2-4.7 3.2-8.3z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5 12c0-.8.1-1.6.4-2.3L1.9 7C1.3 8.5 1 10.2 1 12c0 1.8.3 3.5.9 5l3.5-2.7C5.1 13.6 5 12.8 5 12z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 19c-3.2 0-6-1.9-7.1-4.7L1.4 17c1.9 4.1 5.8 7 10.6 7 3 0 5.4-.8 7.3-2.3l-3.5-2.7c-1 .7-2.3 1-3.8 1z"
                    />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="btn btn-outline flex items-center justify-center"
                  onClick={() => alert('Facebook login not implemented yet')}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#1877F2"
                      d="M24 12.1c0-6.6-5.4-12-12-12S0 5.4 0 12.1c0 6 4.4 11 10.1 11.9v-8.4H7.1v-3.5h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.6.2 2.6.2v2.9h-1.5c-1.5 0-1.9.9-1.9 1.8v2.2h3.3l-.5 3.5h-2.8v8.4c5.7-.9 10.1-5.9 10.1-11.9z"
                    />
                  </svg>
                  Facebook
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;