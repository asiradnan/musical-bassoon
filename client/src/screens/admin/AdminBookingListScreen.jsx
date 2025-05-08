import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Search, AlertCircle, Filter, Eye, CheckCircle, X } from 'lucide-react';

const AdminBookingListScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRoom, setFilterRoom] = useState('');
  const [filterDate, setFilterDate] = useState('');
  
  // Room options
  const roomOptions = [
    'All',
    'Studio A',
    'Studio B',
    'Practice Room 1',
    'Practice Room 2',
    'Practice Room 3',
  ];
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, you would fetch this data from your API
        // For this demo, we'll simulate the data
        
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Simulate bookings data
        const simulatedBookings = [
          {
            _id: '1',
            user: { _id: '1', name: 'Alex Turner' },
            room: 'Studio A',
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            startTime: '14:00',
            endTime: '16:00',
            totalHours: 2,
            price: 100,
            isPaid: true,
            paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            isCancelled: false,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '2',
            user: { _id: '2', name: 'Emily Clark' },
            room: 'Practice Room 2',
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            startTime: '10:00',
            endTime: '12:00',
            totalHours: 2,
            price: 50,
            isPaid: true,
            paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            isCancelled: false,
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '3',
            user: { _id: '3', name: 'James Wilson' },
            room: 'Studio B',
            date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
            startTime: '18:00',
            endTime: '21:00',
            totalHours: 3,
            price: 135,
            isPaid: false,
            isCancelled: false,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '4',
            user: { _id: '4', name: 'Olivia Martinez' },
            room: 'Practice Room 1',
            date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            startTime: '16:00',
            endTime: '18:00',
            totalHours: 2,
            price: 50,
            isPaid: true,
            paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            isCancelled: false,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '5',
            user: { _id: '5', name: 'Daniel Lee' },
            room: 'Studio A',
            date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
            startTime: '09:00',
            endTime: '13:00',
            totalHours: 4,
            price: 200,
            isPaid: true,
            paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            isCancelled: false,
            createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '6',
            user: { _id: '6', name: 'Sophie Brown' },
            room: 'Practice Room 3',
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            startTime: '13:00',
            endTime: '15:00',
            totalHours: 2,
            price: 50,
            isPaid: true,
            paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            isCancelled: true,
            cancelledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: '7',
            user: { _id: '7', name: 'Michael Johnson' },
            room: 'Studio B',
            date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
            startTime: '10:00',
            endTime: '14:00',
            totalHours: 4,
            price: 180,
            isPaid: false,
            isCancelled: false,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ];
        
        setBookings(simulatedBookings);
        setIsLoading(false);
      } catch (error) {
        setError('Failed to fetch bookings');
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, []);
  
  // Handle search and filter
  const filteredBookings = bookings.filter((booking) => {
    // Search by booking ID or customer name
    const searchMatch =
      booking._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by room
    const roomMatch =
      !filterRoom || filterRoom === 'All' || booking.room === filterRoom;
    
    // Filter by date
    const dateMatch = !filterDate || new Date(booking.date).toISOString().split('T')[0] === filterDate;
    
    return searchMatch && roomMatch && dateMatch;
  });
  
  // Cancel booking
  const cancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        // In a real app, you would make an API call to cancel the booking
        // For this demo, we'll just update the state
        
        setBookings(
          bookings.map((booking) =>
            booking._id === bookingId
              ? {
                  ...booking,
                  isCancelled: true,
                  cancelledAt: new Date().toISOString(),
                }
              : booking
          )
        );
        
        // Show success message (would use toast in a real app)
        alert(`Booking ${bookingId} cancelled successfully`);
      } catch (error) {
        // Show error message (would use toast in a real app)
        alert('Failed to cancel booking');
      }
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Bookings</h1>
          <Link to="/admin/dashboard" className="btn btn-outline">
            Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 flex items-center">
            <Calendar size={20} className="text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold">Booking Management</h2>
          </div>
          
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-grow max-w-md">
                <input
                  type="text"
                  placeholder="Search by booking ID or customer name..."
                  className="form-control pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center">
                  <Filter size={18} className="text-gray-500 mr-2" />
                  <select
                    className="form-control"
                    value={filterRoom}
                    onChange={(e) => setFilterRoom(e.target.value)}
                  >
                    <option value="">All Rooms</option>
                    {roomOptions.map((room) => (
                      <option key={room} value={room}>
                        {room}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center">
                  <Calendar size={18} className="text-gray-500 mr-2" />
                  <input
                    type="date"
                    className="form-control"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">Loading bookings...</div>
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
                      Customer
                    </th>
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
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.user.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.room}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(booking.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.startTime} - {booking.endTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        ${booking.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.isCancelled ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            <X size={16} className="mr-1" />
                            Cancelled
                          </span>
                        ) : booking.isPaid ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            <CheckCircle size={16} className="mr-1" />
                            Confirmed
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                            <AlertCircle size={16} className="mr-1" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/booking/${booking._id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye size={18} />
                          </Link>
                          
                          {!booking.isCancelled && (
                            <button
                              onClick={() => cancelBooking(booking._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <X size={18} />
                            </button>
                          )}
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
    </div>
  );
};

export default AdminBookingListScreen;