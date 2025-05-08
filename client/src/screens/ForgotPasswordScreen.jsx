import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, clearError } from '../slices/authSlice';
import { Music, Mail, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  
  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    
    try {
      await dispatch(forgotPassword(email)).unwrap();
      setEmailSent(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-6 flex items-center justify-center">
            <Music className="mr-2" size={24} />
            <h1 className="text-2xl font-bold">Forgot Password</h1>
          </div>
          
          <div className="p-6">
            {emailSent ? (
              <div className="text-center">
                <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
                <h2 className="text-xl font-semibold mb-2">Email Sent!</h2>
                <p className="text-gray-600 mb-6">
                  We've sent a password reset link to <strong>{email}</strong>. Please check your
                  inbox and follow the instructions to reset your password.
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  If you don't see the email, please check your spam folder.
                </p>
                <Link to="/login" className="btn btn-primary">
                  Return to Login
                </Link>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-6">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                
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
                  
                  <button
                    type="submit"
                    className="btn btn-primary btn-block mt-6"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <Link to="/login" className="text-blue-600 hover:text-blue-800 flex items-center justify-center">
                    <ArrowLeft className="mr-1" size={16} />
                    Back to Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;