import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Check, AlertCircle, ArrowLeft } from 'lucide-react';

const AdminUserEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, you would fetch this data from your API
        // For this demo, we'll simulate the data
        
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Simulate user data based on ID
        let userData;
        
        if (id === '1') {
          userData = {
            _id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            isAdmin: false,
          };
        } else if (id === '2') {
          userData = {
            _id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            isAdmin: false,
          };
        } else if (id === '3') {
          userData = {
            _id: '3',
            name: 'Admin User',
            email: 'admin@example.com',
            isAdmin: true,
          };
        } else {
          // Default user data if ID doesn't match
          userData = {
            _id: id,
            name: 'User ' + id,
            email: `user${id}@example.com`,
            isAdmin: false,
          };
        }
        
        setName(userData.name);
        setEmail(userData.email);
        setIsAdmin(userData.isAdmin);
        setIsLoading(false);
      } catch (error) {
        setError('Failed to fetch user details');
        setIsLoading(false);
      }
    };
    
    fetchUser();
  }, [id]);
  
  const submitHandler = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // In a real app, you would make an API call to update the user
      // For this demo, we'll just simulate a successful update
      
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setIsLoading(false);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/admin/users');
      }, 2000);
    } catch (error) {
      setError('Failed to update user');
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <Link to="/admin/users" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft size={16} className="mr-1" />
            Back to Users
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-8">Edit User</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">User Information</h2>
          </div>
          
          <div className="p-6">
            {isLoading && !success ? (
              <div className="text-center py-4">Loading user details...</div>
            ) : error ? (
              <div className="alert alert-danger flex items-center mb-6">
                <AlertCircle className="mr-2" size={20} />
                {error}
              </div>
            ) : success ? (
              <div className="alert alert-success flex items-center mb-6">
                <Check className="mr-2" size={20} />
                User updated successfully
              </div>
            ) : (
              <form onSubmit={submitHandler}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label flex items-center">
                    <User size={18} className="mr-2 text-blue-600" />
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email" className="form-label flex items-center">
                    <Mail size={18} className="mr-2 text-blue-600" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isAdmin"
                      className="mr-2"
                      checked={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.checked)}
                    />
                    <label htmlFor="isAdmin" className="form-label mb-0">
                      Admin User
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Link to="/admin/users" className="btn btn-outline mr-2">
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserEditScreen;