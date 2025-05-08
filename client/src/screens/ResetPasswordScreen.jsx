import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, clearError } from '../slices/authSlice';
import { Music, Lock, AlertCircle, CheckCircle } from 'lucide-react';

const ResetPasswordScreen = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isLoading, error } = useSelector((state) => state.auth);
  
  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    setMessage(null);
    dispatch(clearError());
    
    try {
      await dispatch(resetPassword({ resetToken, password })).unwrap();
      setResetSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
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
            <h1 className="text-2xl font-bold">Reset Password</h1>
          </div>
          
          <div className="p-6">
            {resetSuccess ? (
              <div className="text-center">
                <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
                <h2 className="text-xl font-semibold mb-2">Password Reset Successful!</h2>
                <p className="text-gray-600 mb-6">
                  Your password has been reset successfully. You will be redirected to the login page
                  in a few seconds.
                </p>
                <Link to="/login" className="btn btn-primary">
                  Go to Login
                </Link>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-6">
                  Enter your new password below to reset your account password.
                </p>
                
                {message && (
                  <div className="alert alert-danger flex items-center mb-4">
                    <AlertCircle className="mr-2" size={20} />
                    {message}
                  </div>
                )}
                
                {error && (
                  <div className="alert alert-danger flex items-center mb-4">
                    <AlertCircle className="mr-2" size={20} />
                    {error}
                  </div>
                )}
                
                <form onSubmit={submitHandler}>
                  <div className="form-group">
                    <label htmlFor="password" className="form-label">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="text-gray-400" size={18} />
                      </div>
                      <input
                        type="password"
                        id="password"
                        className="form-control pl-10"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength="6"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="text-gray-400" size={18} />
                      </div>
                      <input
                        type="password"
                        id="confirmPassword"
                        className="form-control pl-10"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength="6"
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="btn btn-primary btn-block mt-6"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <Link to="/login" className="text-blue-600 hover:text-blue-800">
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

export default ResetPasswordScreen;