import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Users, Edit, Trash2, Search, AlertCircle, CheckCircle, X } from 'lucide-react';

const AdminUserListScreen = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  const { user: currentUser } = useSelector((state) => state.auth);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, you would fetch this data from your API
        // For this demo, we'll simulate the data
        
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Simulate users data
        const simulatedUsers = [
          {
            _id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            isAdmin: false,
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            isAdmin: false,
            createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '3',
            name: 'Admin User',
            email: 'admin@example.com',
            isAdmin: true,
            createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '4',
            name: 'Mike Johnson',
            email: 'mike@example.com',
            isAdmin: false,
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '5',
            name: 'Sarah Williams',
            email: 'sarah@example.com',
            isAdmin: false,
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '6',
            name: 'David Brown',
            email: 'david@example.com',
            isAdmin: false,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '7',
            name: 'Emily Clark',
            email: 'emily@example.com',
            isAdmin: false,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ];
        
        setUsers(simulatedUsers);
        setIsLoading(false);
      } catch (error) {
        setError('Failed to fetch users');
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Handle search
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle delete user
  const deleteHandler = (id) => {
    const userToDelete = users.find((user) => user._id === id);
    setUserToDelete(userToDelete);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    try {
      // In a real app, you would make an API call to delete the user
      // For this demo, we'll just update the state
      
      setUsers(users.filter((user) => user._id !== userToDelete._id));
      setShowDeleteModal(false);
      setUserToDelete(null);
      
      // Show success message (would use toast in a real app)
      alert(`User ${userToDelete.name} deleted successfully`);
    } catch (error) {
      // Show error message (would use toast in a real app)
      alert('Failed to delete user');
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Users</h1>
          <Link to="/admin/dashboard" className="btn btn-outline">
            Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <Users size={20} className="text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold">User Management</h2>
            </div>
            
            <div className="flex">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="form-control pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : error ? (
            <div className="p-6">
              <div className="alert alert-danger flex items-center">
                <AlertCircle className="mr-2" size={20} />
                {error}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.isAdmin ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            <CheckCircle size={16} className="mr-1" />
                            Yes
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            <X size={16} className="mr-1" />
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/admin/user/${user._id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => deleteHandler(user._id)}
                            className="text-red-600 hover:text-red-900"
                            disabled={user._id === currentUser._id}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete user "{userToDelete?.name}"? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button onClick={confirmDelete} className="btn btn-danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserListScreen;