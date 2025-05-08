import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getBookingDetails, payBooking, cancelBooking, resetBooking } from '../slices/bookingSlice';
import { Calendar, Clock, DollarSign, AlertCircle, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

const BookingDetailsScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [cancelProcessing, setCancelProcessing] = useState(false);
  
  const { booking, isLoading, error } = useSelector((state) => state.booking);
  const { user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    dispatch(resetBooking());
    dispatch(getBookingDetails(id));
  }, [dispatch, id]);
  
  // Check if booking can be cancelled (24 hours before)
  const canCancel = () => {
    if (!booking) return false;
    if (booking.isCancelled) return false;
    
    const bookingDate = new Date(booking.date);
    bookingDate.setHours(
      parseInt(booking.startTime.split(':')[0]),
      parseInt(booking.startTime.split(':')[1])
    );
    
    const now = new Date();
    const hoursDifference = (bookingDate - now) / (1000 * 60 * 60);
    
    return hoursDifference >= 24;
  };
  
  // Handle payment
  const handlePayment = async () => {
    setPaymentProcessing(true);
    
    try {
      // Simulate payment process
      // In a real app, you would integrate with a payment gateway
      const paymentResult = {
        id: Math.random().toString(36).substring(2, 15),
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        payer: {
          email_address: user.email,
        },
      };
      
      await dispatch(payBooking({ bookingId: booking._id, paymentResult })).unwrap();
      
      // Refresh booking details
      dispatch(getBookingDetails(id));
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setPaymentProcessing(false);
    }
  };
  
  // Handle cancellation
  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setCancelProcessing(true);
      
      try {
        await dispatch(cancelBooking(booking._id)).unwrap();
        
        // Refresh booking details
        dispatch(getBookingDetails(id));
      } catch (error) {
        console.error('Cancellation failed:', error);
      } finally {
        setCancelProcessing(false);
      }
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link to="/booking/history" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft size={16} className="mr-1" />
            Back to Bookings
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-8">Booking Details</h1>
        
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="alert alert-danger flex items-center">
            <AlertCircle className="mr-2" size={20} />
            {error}
          </div>
        ) : !booking ? (
          <div className="alert alert-danger flex items-center">
            <AlertCircle className="mr-2" size={20} />
            Booking not found
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Booking #{booking._id.substring(0, 8)}</h2>
                {booking.isCancelled ? (
                  <span className="badge badge-danger">Cancelled</span>
                ) : booking.isPaid ? (
                  <span className="badge badge-success">Confirmed</span>
                ) : (
                  <span className="badge badge-warning">Payment Pending</span>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Booking Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-500 text-sm">Room</p>
                      <p className="font-medium">{booking.room}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500 text-sm">Date</p>
                      <p className="font-medium flex items-center">
                        <Calendar size={16} className="mr-1 text-blue-600" />
                        {new Date(booking.date).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500 text-sm">Time</p>
                      <p className="font-medium flex items-center">
                        <Clock size={16} className="mr-1 text-blue-600" />
                        {booking.startTime} - {booking.endTime} ({booking.totalHours} hours)
                      </p>
                    </div>
                    
                    {booking.notes && (
                      <div>
                        <p className="text-gray-500 text-sm">Notes</p>
                        <p className="p-3 bg-gray-50 rounded-md text-gray-700">{booking.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price per hour:</span>
                        <span>${(booking.price / booking.totalHours).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hours:</span>
                        <span>{booking.totalHours}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
                        <span>Total:</span>
                        <span>${booking.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-500 text-sm">Payment Status</p>
                      {booking.isPaid ? (
                        <p className="font-medium flex items-center text-green-600">
                          <CheckCircle size={16} className="mr-1" />
                          Paid on {new Date(booking.paidAt).toLocaleDateString()}
                        </p>
                      ) : booking.isCancelled ? (
                        <p className="font-medium flex items-center text-red-600">
                          <XCircle size={16} className="mr-1" />
                          Booking Cancelled
                        </p>
                      ) : (
                        <p className="font-medium flex items-center text-amber-600">
                          <AlertCircle size={16} className="mr-1" />
                          Not Paid
                        </p>
                      )}
                    </div>
                    
                    {booking.isCancelled && (
                      <div>
                        <p className="text-gray-500 text-sm">Cancellation Date</p>
                        <p className="font-medium">
                          {new Date(booking.cancelledAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {!booking.isPaid && !booking.isCancelled && (
                    <div className="mt-6">
                      <button
                        onClick={handlePayment}
                        className="btn btn-primary btn-block"
                        disabled={paymentProcessing}
                      >
                        {paymentProcessing ? 'Processing...' : 'Pay Now'}
                      </button>
                      <p className="text-sm text-gray-500 mt-2">
                        Secure payment powered by Stripe
                      </p>
                    </div>
                  )}
                  
                  {!booking.isCancelled && canCancel() && (
                    <div className="mt-4">
                      <button
                        onClick={handleCancel}
                        className="btn btn-outline btn-danger btn-block"
                        disabled={cancelProcessing}
                      >
                        {cancelProcessing ? 'Processing...' : 'Cancel Booking'}
                      </button>
                      <p className="text-sm text-gray-500 mt-2">
                        Free cancellation up to 24 hours before your booking
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Booking Policy</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Please arrive 15 minutes before your booking time to set up.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Cancellations must be made at least 24 hours before your booking time to
                      receive a refund.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Basic equipment is provided, but you are welcome to bring your own.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Please respect the equipment and facilities. Any damage may result in
                      additional charges.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetailsScreen;