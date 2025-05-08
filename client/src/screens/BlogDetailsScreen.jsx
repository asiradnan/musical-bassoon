import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogDetails, clearBlogDetails } from '../slices/blogSlice';
import { Calendar, User, Tag, ArrowLeft, AlertCircle } from 'lucide-react';

const BlogDetailsScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const { blog, isLoading, error } = useSelector((state) => state.blog);
  
  useEffect(() => {
    dispatch(clearBlogDetails());
    dispatch(fetchBlogDetails(id));
    
    return () => {
      dispatch(clearBlogDetails());
    };
  }, [dispatch, id]);

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link to="/blog" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft size={16} className="mr-1" />
            Back to Blog
          </Link>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="alert alert-danger flex items-center">
            <AlertCircle className="mr-2" size={20} />
            {error}
          </div>
        ) : !blog ? (
          <div className="alert alert-danger flex items-center">
            <AlertCircle className="mr-2" size={20} />
            Blog post not found
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={blog.image || 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg'}
              alt={blog.title}
              className="w-full h-64 md:h-96 object-cover"
            />
            
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center text-gray-500 text-sm mb-4">
                <span className="flex items-center mr-4 mb-2">
                  <Calendar size={16} className="mr-1" />
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center mr-4 mb-2">
                  <User size={16} className="mr-1" />
                  {blog.user.name}
                </span>
                <span className="flex items-center mb-2">
                  <Tag size={16} className="mr-1" />
                  {blog.category}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold mb-6">{blog.title}</h1>
              
              <div className="prose max-w-none">
                {blog.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Share This Article</h3>
                <div className="flex space-x-4">
                  <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </button>
                  <button className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  </button>
                  <button className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                    </svg>
                  </button>
                  <button className="p-2 bg-blue-800 text-white rounded-full hover:bg-blue-900 transition">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetailsScreen;