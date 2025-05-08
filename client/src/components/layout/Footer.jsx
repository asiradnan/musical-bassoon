import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Music, Facebook, Instagram, Youtube, Twitter, Mail } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    
    try {
      setIsLoading(true);
      await axios.post('/api/newsletter', { email });
      toast.success('Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Something went wrong'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container-fluid">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Music size={24} className="text-amber-500" />
              <h3 className="text-xl font-bold">Music Studio</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Your one-stop destination for music equipment, studio bookings, and
              everything a musician needs to create amazing music.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-amber-500 transition"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-amber-500 transition"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-amber-500 transition"
              >
                <Youtube size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-amber-500 transition"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products"
                  className="text-gray-300 hover:text-amber-500 transition"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/booking"
                  className="text-gray-300 hover:text-amber-500 transition"
                >
                  Book Studio
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-300 hover:text-amber-500 transition"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-amber-500 transition"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-300 hover:text-amber-500 transition"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Categories
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products/category/Guitars"
                  className="text-gray-300 hover:text-amber-500 transition"
                >
                  Guitars
                </Link>
              </li>
              <li>
                <Link
                  to="/products/category/Drums"
                  className="text-gray-300 hover:text-amber-500 transition"
                >
                  Drums
                </Link>
              </li>
              <li>
                <Link
                  to="/products/category/Keyboards"
                  className="text-gray-300 hover:text-amber-500 transition"
                >
                  Keyboards
                </Link>
              </li>
              <li>
                <Link
                  to="/products/category/Recording Equipment"
                  className="text-gray-300 hover:text-amber-500 transition"
                >
                  Recording Equipment
                </Link>
              </li>
              <li>
                <Link
                  to="/products/category/Accessories"
                  className="text-gray-300 hover:text-amber-500 transition"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Newsletter
            </h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter for the latest updates, promotions, and music tips.
            </p>
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 w-full text-gray-800 rounded-l-md focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="bg-amber-500 px-4 py-2 rounded-r-md hover:bg-amber-600 transition flex items-center"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : <Mail size={20} />}
              </button>
            </form>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="border-t border-gray-700 pt-6 mt-6 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Music Studio. All rights reserved.
          </p>
          <div className="mt-2 space-x-4">
            <Link to="/privacy" className="hover:text-amber-500 transition">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-amber-500 transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;