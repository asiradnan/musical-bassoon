import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Music, ShoppingCart, User, Menu, X, Search, Heart, LogOut, Settings, BookOpen, Calendar } from 'lucide-react';
import { logout } from '../../slices/authSlice';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  const submitHandler = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/products?keyword=${searchKeyword}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container-fluid py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Music size={28} />
            <span className="text-xl font-bold">Music Studio</span>
          </Link>
          
          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:block flex-grow max-w-md mx-4">
            <form onSubmit={submitHandler} className="flex">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 text-gray-800 rounded-l-md focus:outline-none"
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <button
                type="submit"
                className="bg-amber-500 px-4 py-2 rounded-r-md hover:bg-amber-600 transition"
              >
                <Search size={20} />
              </button>
            </form>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/products" className="hover:text-amber-300 transition">
              Shop
            </Link>
            <Link to="/booking" className="hover:text-amber-300 transition">
              Book Studio
            </Link>
            <Link to="/blog" className="hover:text-amber-300 transition">
              Blog
            </Link>
            <Link to="/contact" className="hover:text-amber-300 transition">
              Contact
            </Link>
            
            {/* Cart Icon with Counter */}
            <Link to="/cart" className="relative hover:text-amber-300 transition">
              <ShoppingCart size={22} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </Link>
            
            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 hover:text-amber-300 transition">
                  <User size={22} />
                  <span className="hidden lg:inline">{user.name.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <User size={18} className="mr-2" />
                      Profile
                    </div>
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <BookOpen size={18} className="mr-2" />
                      Orders
                    </div>
                  </Link>
                  <Link
                    to="/booking/history"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <Calendar size={18} className="mr-2" />
                      Bookings
                    </div>
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <Heart size={18} className="mr-2" />
                      Wishlist
                    </div>
                  </Link>
                  {user.isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <Settings size={18} className="mr-2" />
                        Admin
                      </div>
                    </Link>
                  )}
                  <button
                    onClick={logoutHandler}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <LogOut size={18} className="mr-2" />
                      Logout
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hover:text-amber-300 transition">
                <div className="flex items-center">
                  <User size={22} />
                  <span className="hidden lg:inline ml-1">Sign In</span>
                </div>
              </Link>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Search - Only visible on mobile */}
        <div className="mt-3 md:hidden">
          <form onSubmit={submitHandler} className="flex">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 text-gray-800 rounded-l-md focus:outline-none"
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button
              type="submit"
              className="bg-amber-500 px-4 py-2 rounded-r-md hover:bg-amber-600 transition"
            >
              <Search size={20} />
            </button>
          </form>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-3 pb-3 border-t border-blue-500">
            <ul className="space-y-2 mt-2">
              <li>
                <Link
                  to="/products"
                  className="block py-2 hover:text-amber-300 transition"
                  onClick={toggleMenu}
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/booking"
                  className="block py-2 hover:text-amber-300 transition"
                  onClick={toggleMenu}
                >
                  Book Studio
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="block py-2 hover:text-amber-300 transition"
                  onClick={toggleMenu}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="block py-2 hover:text-amber-300 transition"
                  onClick={toggleMenu}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="block py-2 hover:text-amber-300 transition"
                  onClick={toggleMenu}
                >
                  <div className="flex items-center">
                    <ShoppingCart size={18} className="mr-2" />
                    Cart
                    {cartItems.length > 0 && (
                      <span className="ml-2 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link
                      to="/profile"
                      className="block py-2 hover:text-amber-300 transition"
                      onClick={toggleMenu}
                    >
                      <div className="flex items-center">
                        <User size={18} className="mr-2" />
                        Profile
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/orders"
                      className="block py-2 hover:text-amber-300 transition"
                      onClick={toggleMenu}
                    >
                      <div className="flex items-center">
                        <BookOpen size={18} className="mr-2" />
                        Orders
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/booking/history"
                      className="block py-2 hover:text-amber-300 transition"
                      onClick={toggleMenu}
                    >
                      <div className="flex items-center">
                        <Calendar size={18} className="mr-2" />
                        Bookings
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/wishlist"
                      className="block py-2 hover:text-amber-300 transition"
                      onClick={toggleMenu}
                    >
                      <div className="flex items-center">
                        <Heart size={18} className="mr-2" />
                        Wishlist
                      </div>
                    </Link>
                  </li>
                  {user.isAdmin && (
                    <li>
                      <Link
                        to="/admin/dashboard"
                        className="block py-2 hover:text-amber-300 transition"
                        onClick={toggleMenu}
                      >
                        <div className="flex items-center">
                          <Settings size={18} className="mr-2" />
                          Admin
                        </div>
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={() => {
                        logoutHandler();
                        toggleMenu();
                      }}
                      className="block w-full text-left py-2 hover:text-amber-300 transition"
                    >
                      <div className="flex items-center">
                        <LogOut size={18} className="mr-2" />
                        Logout
                      </div>
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    to="/login"
                    className="block py-2 hover:text-amber-300 transition"
                    onClick={toggleMenu}
                  >
                    <div className="flex items-center">
                      <User size={18} className="mr-2" />
                      Sign In
                    </div>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;