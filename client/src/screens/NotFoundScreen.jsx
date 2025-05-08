import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, HelpCircle, ArrowLeft } from 'lucide-react';

const NotFoundScreen = () => {
  return (
    <div className="py-16">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name changed, or is
          temporarily unavailable.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link to="/" className="btn btn-primary flex items-center">
            <Home size={18} className="mr-2" />
            Go to Homepage
          </Link>
          <Link to="/contact" className="btn btn-outline flex items-center">
            <HelpCircle size={18} className="mr-2" />
            Contact Support
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-4">Looking for something specific?</h3>
          <div className="flex">
            <input
              type="text"
              placeholder="Search our site..."
              className="form-control rounded-r-none"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition">
              <Search size={20} />
            </button>
          </div>
        </div>
        
        <div className="mt-12">
          <Link to="/" className="flex items-center justify-center text-blue-600 hover:text-blue-800">
            <ArrowLeft size={16} className="mr-1" />
            Back to safety
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundScreen;