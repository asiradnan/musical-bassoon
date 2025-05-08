import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, clearError } from '../slices/authSlice';
import { listMyOrders } from '../slices/orderSlice';
import { listMyBookings } from '../slices/bookingSlice';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, AlertCircle, CheckCircle, Package, Calendar } from 'lucide-react';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [message, setMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  
  const dispatch = useDispatch();
  
  const { user, isLoading, error } = useSelector((state) => state.auth);
  const { orders, isLoading: ordersLoading } = useSelector((state) => state.order);
  const { bookings, isLoading: bookingsLoading } = useSelector((state) => state.booking);
  
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      
      if (user.address) {
        setStreet(user.address.street || '');
        setCity(user.address.city || '');
        setState(user.address.state || '');
        setPostalCode(user.address.postalCode || '');
        setCountry(user.address.country || '');
      }
      
      dispatch(listMyOrders());
      dispatch(listMyBookings());
    }
  }, [dispatch, user]);
  
  const submitHandler = (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    setMessage(null);
    dispatch(clearError());
    
    const userData = {
      name,
      email,
      phone,
      address: {
        street,
        city,
        state,
        postalCode,
        country,
      },
    };
    
    if (password) {
      userData.password = password;
    }
    
    dispatch(updateProfile(userData))
      .unwrap()
      .then(() => {
        setSuccessMessage('Profile updated successfully');
        setPassword('');
        setConfirmPassword('');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>
        
        <div className="flex flex-wrap -mx-4">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 px-4 mb-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                    <User size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{user?.name}</h2>
                    <p className="text-gray-500 text-sm">{user?.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <ul className="space-y-2">
                  <li>
                    <button
                      className={`w-full text-left px-4 py-2 rounded-md ${
                        activeTab === 'profile'
                          ? 'bg-blue-100 text-blue-600'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTab('profile')}
                    >
                      <div className="flex items-center">
                        <User size={18} className="mr-2" />
                        Profile Information
                      </div>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left px-4 py-2 rounded-md ${
                        activeTab === 'orders'
                          ? 'bg-blue-100 text-blue-600'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTab('orders')}
                    >
                      <div className="flex items-center">
                        <Package size={18} className="mr-2" />
                        Order History
                      </div>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left px-4 py-2 rounded-md ${
                        activeTab === 'bookings'
                          ? 'bg-blue-100 text-blue-600'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTab('bookings')}
                    >
                      <div className="flex items-center">
                        <Calendar size={18} className="mr-2" />
                        Booking History
                      </div>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="w-full md:w-3/4 px-4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                  
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
                  
                  {successMessage && (
                    <div className="alert alert-success flex items-center mb-4">
                      <CheckCircle className="mr-2" size={20} />
                      {successMessage}
                    </div>
                  )}
                  
                  <form onSubmit={submitHandler}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-group">
                        <label htmlFor="name" className="form-label">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="text-gray-400" size={18} />
                          </div>
                          <input
                            type="text"
                            id="name"
                            className="form-control pl-10"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="email" className="form-label">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="text-gray-400" size={18} />
                          </div>
                          <input
                            type="email"
                            id="email"
                            className="form-control pl-10"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="phone" className="form-label">
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="text-gray-400" size={18} />
                          </div>
                          <input
                            type="tel"
                            id="phone"
                            className="form-control pl-10"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="street" className="form-label">
                          Street Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="text-gray-400" size={18} />
                          </div>
                          <input
                            type="text"
                            id="street"
                            className="form-control pl-10"
                            placeholder="Enter your street address"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="city" className="form-label">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          className="form-control"
                          placeholder="Enter your city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="state" className="form-label">
                          State / Province
                        </label>
                        <input
                          type="text"
                          id="state"
                          className="form-control"
                          placeholder="Enter your state/province"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="postalCode" className="form-label">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          id="postalCode"
                          className="form-control"
                          placeholder="Enter your postal code"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="country" className="form-label">
                          Country
                        </label>
                        <input
                          type="text"
                          id="country"
                          className="form-control"
                          placeholder="Enter your country"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold mt-8 mb-4">Change Password</h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Leave blank to keep your current password
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-group">
                        <label htmlFor="password" className="form-label">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          className="form-control"
                          placeholder="Enter new password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          minLength="6"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          className="form-control"
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          minLength="6"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Updating...' : 'Update Profile'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {activeTab === 'orders' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Order History</h2>
                  
                  {ordersLoading ? (
                    <div className="text-center py-4">Loading...</div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package size={48} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                      <p className="text-gray-500 mb-4">
                        You haven't placed any orders yet.
                      </p>
                      <Link to="/products" className="btn btn-primary">
                        Start Shopping
                      </Link>
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
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Paid
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
                          {orders.map((order) => (
                            <tr key={order._id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {order._id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${order.totalPrice.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {order.isPaid ? (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    {new Date(order.paidAt).toLocaleDateString()}
                                  </span>
                                ) : (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                    Not Paid
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Link
                                  to={`/order/${order._id}`}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  Details
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'bookings' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Booking History</h2>
                  
                  {bookingsLoading ? (
                    <div className="text-center py-4">Loading...</div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Bookings Yet</h3>
                      <p className="text-gray-500 mb-4">
                        You haven't made any studio bookings yet.
                      </p>
                      <Link to="/booking" className="btn btn-primary">
                        Book a Studio
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Room
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Price
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
                          {bookings.map((booking) => (
                            <tr key={booking._id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {booking.room}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(booking.date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {booking.startTime} - {booking.endTime}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${booking.price.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {booking.isCancelled ? (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                    Cancelled
                                  </span>
                                ) : (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Active
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Link
                                  to={`/booking/${booking._id}`}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  Details
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;