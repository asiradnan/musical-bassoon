import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FileText, Edit, Trash2, Search, AlertCircle, Plus, Filter, Eye } from 'lucide-react';

const AdminBlogListScreen = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  
  // Categories
  const categories = [
    'All',
    'Music Tips',
    'Studio Updates',
    'Instrument Care',
    'Industry News',
    'Events',
  ];
  
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, you would fetch this data from your API
        // For this demo, we'll simulate the data
        
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Simulate blogs data
        const simulatedBlogs = [
          {
            _id: '1',
            title: 'How to Choose Your First Guitar',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
            image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg',
            category: 'Music Tips',
            user: { _id: '1', name: 'Admin User' },
            published: true,
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '2',
            title: 'New Equipment in Studio A',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
            image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg',
            category: 'Studio Updates',
            user: { _id: '1', name: 'Admin User' },
            published: true,
            createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '3',
            title: 'Proper Drum Maintenance',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
            image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg',
            category: 'Instrument Care',
            user: { _id: '1', name: 'Admin User' },
            published: true,
            createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '4',
            title: 'Upcoming Music Festival',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
            image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg',
            category: 'Events',
            user: { _id: '1', name: 'Admin User' },
            published: true,
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '5',
            title: 'Changes in the Music Industry',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
            image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg',
            category: 'Industry News',
            user: { _id: '1', name: 'Admin User' },
            published: false,
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '6',
            title: 'Piano Tuning Guide',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
            image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg',
            category: 'Instrument Care',
            user: { _id: '1', name: 'Admin User' },
            published: true,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ];
        
        setBlogs(simulatedBlogs);
        setIsLoading(false);
      } catch (error) {
        setError('Failed to fetch blogs');
        setIsLoading(false);
      }
    };
    
    fetchBlogs();
  }, []);
  
  // Handle search and filter
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === '' || filterCategory === 'All' || blog.category === filterCategory)
  );
  
  // Handle create blog
  const createBlogHandler = () => {
    // In a real app, you would navigate to a create blog page
    // For this demo, we'll just add a new blog to the state
    
    const newBlog = {
      _id: Date.now().toString(),
      title: 'New Blog Post',
      content: 'Enter your content here...',
      image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg',
      category: 'Music Tips',
      user: { _id: '1', name: 'Admin User' },
      published: false,
      createdAt: new Date().toISOString(),
    };
    
    setBlogs([...blogs, newBlog]);
  };
  
  // Handle delete blog
  const deleteHandler = (id) => {
    const blogToDelete = blogs.find((blog) => blog._id === id);
    setBlogToDelete(blogToDelete);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    try {
      // In a real app, you would make an API call to delete the blog
      // For this demo, we'll just update the state
      
      setBlogs(blogs.filter((blog) => blog._id !== blogToDelete._id));
      setShowDeleteModal(false);
      setBlogToDelete(null);
      
      // Show success message (would use toast in a real app)
      alert(`Blog "${blogToDelete.title}" deleted successfully`);
    } catch (error) {
      // Show error message (would use toast in a real app)
      alert('Failed to delete blog');
    }
  };
  
  // Toggle blog published status
  const togglePublishedStatus = (id) => {
    setBlogs(
      blogs.map((blog) =>
        blog._id === id ? { ...blog, published: !blog.published } : blog
      )
    );
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <Link to="/admin/dashboard" className="btn btn-outline">
            Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <FileText size={20} className="text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold">Blog Management</h2>
            </div>
            
            <button
              onClick={createBlogHandler}
              className="btn btn-primary flex items-center"
            >
              <Plus size={18} className="mr-1" />
              Create Blog Post
            </button>
          </div>
          
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-grow max-w-md">
                <input
                  type="text"
                  placeholder="Search blog posts..."
                  className="form-control pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
              </div>
              
              <div className="flex items-center">
                <Filter size={18} className="text-gray-500 mr-2" />
                <select
                  className="form-control"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">Loading blog posts...</div>
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
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBlogs.map((blog) => (
                    <tr key={blog._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-md object-cover"
                              src={blog.image}
                              alt={blog.title}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {blog.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              By {blog.user.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            onClick={() => togglePublishedStatus(blog._id)}
                            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${
                              blog.published ? 'bg-green-500' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200 ${
                                blog.published ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            ></span>
                          </button>
                          <span className="ml-2 text-sm text-gray-500">
                            {blog.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/blog/${blog._id}`}
                            className="text-blue-600 hover:text-blue-900"
                            target="_blank"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link
                            to={`/admin/blog/${blog._id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => deleteHandler(blog._id)}
                            className="text-red-600 hover:text-red-900"
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
              Are you sure you want to delete blog post "{blogToDelete?.title}"? This action
              cannot be undone.
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

export default AdminBlogListScreen;