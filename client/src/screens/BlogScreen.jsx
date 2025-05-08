import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs, fetchBlogsByCategory } from '../slices/blogSlice';
import { AlertCircle, Calendar, User, ArrowRight, Search } from 'lucide-react';

const BlogScreen = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [searchKeyword, setSearchKeyword] = useState('');
  
  const { blogs, isLoading, error } = useSelector((state) => state.blog);
  
  // Blog categories
  const categories = [
    'Music Tips',
    'Studio Updates',
    'Instrument Care',
    'Industry News',
    'Events',
  ];
  
  useEffect(() => {
    if (category) {
      dispatch(fetchBlogsByCategory(category));
    } else {
      dispatch(fetchBlogs({}));
    }
  }, [dispatch, category]);
  
  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      dispatch(fetchBlogs({ keyword: searchKeyword }));
    } else {
      dispatch(fetchBlogs({}));
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            {category ? `${category} Articles` : 'Blog'}
          </h1>
          
          <form onSubmit={handleSearchSubmit} className="flex">
            <input
              type="text"
              placeholder="Search articles..."
              className="form-control rounded-r-none"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition"
            >
              <Search size={20} />
            </button>
          </form>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Categories</h2>
              </div>
              
              <div className="p-6">
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/blog"
                      className={`block px-3 py-2 rounded-md ${
                        !category
                          ? 'bg-blue-100 text-blue-600'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      All Articles
                    </Link>
                  </li>
                  
                  {categories.map((cat) => (
                    <li key={cat}>
                      <Link
                        to={`/blog/category/${cat}`}
                        className={`block px-3 py-2 rounded-md ${
                          category === cat
                            ? 'bg-blue-100 text-blue-600'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Blog Posts */}
          <div className="md:w-3/4">
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : error ? (
              <div className="alert alert-danger flex items-center">
                <AlertCircle className="mr-2" size={20} />
                {error}
              </div>
            ) : blogs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h2 className="text-2xl font-semibold mb-2">No Articles Found</h2>
                <p className="text-gray-600 mb-6">
                  We couldn't find any articles matching your criteria.
                </p>
                <Link to="/blog" className="btn btn-primary">
                  View All Articles
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                  >
                    <img
                      src={blog.image || 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg'}
                      alt={blog.title}
                      className="w-full h-48 object-cover"
                    />
                    
                    <div className="p-6">
                      <div className="flex items-center text-gray-500 text-sm mb-2">
                        <span className="flex items-center mr-4">
                          <Calendar size={14} className="mr-1" />
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <User size={14} className="mr-1" />
                          {blog.user.name}
                        </span>
                      </div>
                      
                      <Link to={`/blog/${blog._id}`}>
                        <h2 className="text-xl font-semibold mb-2 hover:text-blue-600 transition">
                          {blog.title}
                        </h2>
                      </Link>
                      
                      <p className="text-gray-600 mb-4">
                        {blog.content.substring(0, 150)}...
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <span className="badge badge-primary">{blog.category}</span>
                        <Link
                          to={`/blog/${blog._id}`}
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          Read More
                          <ArrowRight size={16} className="ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogScreen;