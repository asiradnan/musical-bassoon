import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listMyBookings } from '../slices/bookingSlice';
import { Calendar, Clock, DollarSign, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const BookingHistoryScreen = () => {
  const dispatch = useDispatch();
  
  const { bookings, isLoading, error } = useSelector((state) => state.booking);
  
  useEffect(() => {
    dispatch(listMyBookings());
  }, [dispatch]);
  
  // Group bookings by month
  const groupedBookings = bookings.reduce((groups, booking) => {
    const date = new Date(booking.date);
    const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    if (!groups[month]) {
      groups[month] = [];
    }
    
    groups[month].push(booking);
    return groups;
  }, {});

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <Link to="/booking" className="btn btn-primary">
            Book New Session
          </Link>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="alert alert-danger flex items-center">
            <AlertCircle className="mr-2" size={20} />
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Bookings Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't made any studio bookings yet. Book your first session now!
            </p>
            <Link to="/booking" className="btn btn-primary">
              Book a Studio
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedBookings).map(([month, monthBookings]) => (
              <div key={month} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-600 text-white p-4">
                  <h2 className="text-xl font-semibold">{month}</h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {monthBookings.map((booking) => (
                    <div key={booking._id} className="p-6">
                      <div className="flex flex-wrap justify-between items-start">
                        <div className="mb-4 md:mb-0">
                          <h3 className="text-lg font-semibold mb-1">{booking.room}</h3>
                          <p className="text-gray-600 flex items-center">
                            <Calendar size={16} className="mr-1" />
                            {new Date(booking.date).toLocaleDateString()}
                          </p>
                          <p className="text-gray-600 flex items-center">
                            <Clock size={16} className="mr-1" />
                            {booking.startTime} - {booking.endTime} ({booking.totalHours} hours)
                          </p>
                          <p className="text-gray-600 flex items-center">
                            <DollarSign size={16} className="mr-1" />
                            ${booking.price.toFixed(2)}
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          {booking.isCancelled ? (
                            <span className="flex items-center text-red-600 mb-2">
                              <XCircle size={16} className="mr-1" />
                              Cancelled
                            </span>
                          ) : booking.isPaid ? (
                            <span className="flex items-center text-green-600 mb-2">
                              <CheckCircle size={16} className="mr-1" />
                              Confirmed
                            </span>
                          ) : (
                            <span className="flex items-center text-amber-600 mb-2">
                              <AlertCircle size={16} className="mr-1" />
                              Payment Pending
                            </span>
                          )}
                          
                          <Link
                            to={`/booking/${booking._id}`}
                            className="btn btn-outline btn-sm"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                      
                      {booking.notes && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-600">{booking.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistoryScreen;