import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FileText,
  Tag,
  Upload,
  Check,
  AlertCircle,
  ArrowLeft,
  Type,
  Hash,
} from 'lucide-react';

const AdminBlogEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [published, setPublished] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Categories
  const categories = [
    'Music Tips',
    'Studio Updates',
    'Instrument Care',
    'Industry News',
    'Events',
  ];
  
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, you would fetch this data from your API
        // For this demo, we'll simulate the data
        
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Simulate blog data based on ID
        let blogData;
        
        if (id === '1') {
          blogData = {
            _id: '1',
            title: 'How to Choose Your First Guitar',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.\n\nPellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.\n\nQuisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis.',
            image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg',
            category: 'Music Tips',
            tags: 'guitar,beginner,buying guide',
            published: true,
          };
        } else if (id === '2') {
          blogData = {
            _id: '2',
            title: 'New Equipment in Studio A',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.\n\nPellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.',
            image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg',
            category: 'Studio Updates',
            tags: 'studio,equipment,recording',
            published: true,
          };
        } else {
          // Default blog data if ID doesn't match
          blogData = {
            _id: id,
            title: 'Blog Post ' + id,
            content: 'Enter your content here...',
            image: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg',
            category: 'Music Tips',
            tags: 'music,blog',
            published: true,
          };
        }
        
        setTitle(blogData.title);
        setContent(blogData.content);
        setImage(blogData.image);
        setCategory(blogData.category);
        setTags(blogData.tags);
        setPublished(blogData.published);
        
        setIsLoading(false);
      } catch (error) {
        setError('Failed to fetch blog details');
        setIsLoading(false);
      }
    };
    
    fetchBlog();
  }, [id]);
  
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    
    try {
      // In a real app, you would upload the file to your server
      // For this demo, we'll just simulate a successful upload
      
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Simulate a successful upload with a random image URL
      setImage('https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg');
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };
  
  const submitHandler = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // In a real app, you would make an API call to update the blog
      // For this demo, we'll just simulate a successful update
      
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setIsLoading(false);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/admin/blogs');
      }, 2000);
    } catch (error) {
      setError('Failed to update blog');
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <Link to="/admin/blogs" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft size={16} className="mr-1" />
            Back to Blogs
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-8">Edit Blog Post</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Blog Information</h2>
          </div>
          
          <div className="p-6">
            {isLoading && !success ? (
              <div className="text-center py-4">Loading blog details...</div>
            ) : error ? (
              <div className="alert alert-danger flex items-center mb-6">
                <AlertCircle className="mr-2" size={20} />
                {error}
              </div>
            ) : success ? (
              <div className="alert alert-success flex items-center mb-6">
                <Check className="mr-2" size={20} />
                Blog post updated successfully
              </div>
            ) : (
              <form onSubmit={submitHandler}>
                <div className="form-group">
                  <label htmlFor="title" className="form-label flex items-center">
                    <Type size={18} className="mr-2 text-blue-600" />
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="form-control"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="form-group">
                    <label htmlFor="category" className="form-label flex items-center">
                      <Tag size={18} className="mr-2 text-blue-600" />
                      Category
                    </label>
                    <select
                      id="category"
                      className="form-control"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="tags" className="form-label flex items-center">
                      <Hash size={18} className="mr-2 text-blue-600" />
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      id="tags"
                      className="form-control"
                      placeholder="Enter tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-group mt-4">
                  <label htmlFor="image" className="form-label flex items-center">
                    <Upload size={18} className="mr-2 text-blue-600" />
                    Image
                  </label>
                  <input
                    type="text"
                    id="image"
                    className="form-control"
                    placeholder="Enter image URL"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    required
                  />
                  <div className="mt-2">
                    <input
                      type="file"
                      id="image-file"
                      className="hidden"
                      onChange={uploadFileHandler}
                    />
                    <label
                      htmlFor="image-file"
                      className="btn btn-outline btn-sm cursor-pointer"
                    >
                      {uploading ? 'Uploading...' : 'Choose File'}
                    </label>
                  </div>
                  {image && (
                    <div className="mt-2">
                      <img
                        src={image}
                        alt="Preview"
                        className="h-32 w-auto object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
                
                <div className="form-group mt-4">
                  <label htmlFor="content" className="form-label flex items-center">
                    <FileText size={18} className="mr-2 text-blue-600" />
                    Content
                  </label>
                  <textarea
                    id="content"
                    rows="12"
                    className="form-control"
                    placeholder="Enter blog content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  ></textarea>
                </div>
                
                <div className="form-group mt-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="published"
                      className="mr-2"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                    />
                    <label htmlFor="published" className="form-label mb-0">
                      Published
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Link to="/admin/blogs" className="btn btn-outline mr-2">
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading || uploading}
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

export default AdminBlogEditScreen;