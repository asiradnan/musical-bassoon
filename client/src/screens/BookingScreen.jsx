import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Calendar from 'react-calendar';
import { format, parse, addHours, isAfter, isBefore } from 'date-fns';
import { checkAvailability, createBooking, clearError } from '../slices/bookingSlice';
import { AlertCircle, Clock, DollarSign, Calendar as CalendarIcon, Music } from 'lucide-react';

const BookingScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState('Studio A');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { availableSlots, isLoading, success, booking, error } = useSelector(
    (state) => state.booking
  );
  
  // Room options with prices
  const rooms = [
    { id: 'Studio A', name: 'Studio A (Recording)', price: 50 },
    { id: 'Studio B', name: 'Studio B (Recording)', price: 45 },
    { id: 'Practice Room 1', name: 'Practice Room 1', price: 25 },
    { id: 'Practice Room 2', name: 'Practice Room 2', price: 25 },
    { id: 'Practice Room 3', name: 'Practice Room 3', price: 25 },
  ];
  
  // Time slots
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00',
  ];
  
  // Get room price
  const getRoomPrice = () => {
    const room = rooms.find((r) => r.id === selectedRoom);
    return room ? room.price : 0;
  };
  
  // Calculate total hours
  const calculateTotalHours = () => {
    if (!startTime || !endTime) return 0;
    
    const start = parse(startTime, 'HH:mm', new Date());
    const end = parse(endTime, 'HH:mm', new Date());
    
    if (isAfter(start, end)) return 0;
    
    const diffInHours = (end - start) / (1000 * 60 * 60);
    return diffInHours;
  };
  
  // Calculate total price
  const calculateTotalPrice = () => {
    const totalHours = calculateTotalHours();
    const hourlyRate = getRoomPrice();
    return totalHours * hourlyRate;
  };
  
  // Check if a time slot is available
  const isTimeSlotAvailable = (time) => {
    if (!availableSlots || availableSlots.length === 0) return true;
    
    const timeToCheck = parse(time, 'HH:mm', new Date());
    
    for (const booking of availableSlots) {
      const bookingStart = parse(booking.startTime, 'HH:mm', new Date());
      const bookingEnd = parse(booking.endTime, 'HH:mm', new Date());
      
      if (
        (isAfter(timeToCheck, bookingStart) || timeToCheck.getTime() === bookingStart.getTime()) &&
        isBefore(timeToCheck, bookingEnd)
      ) {
        return false;
      }
    }
    
    return true;
  };
  
  // Check if selected time range is valid
  const isTimeRangeValid = () => {
    if (!startTime || !endTime) return false;
    
    const start = parse(startTime, 'HH:mm', new Date());
    const end = parse(endTime, 'HH:mm', new Date());
    
    if (isAfter(start, end) || start.getTime() === end.getTime()) {
      return false;
    }
    
    // Check if any time slot in the range is already booked
    let currentTime = start;
    while (isBefore(currentTime, end)) {
      const timeString = format(currentTime, 'HH:mm');
      if (!isTimeSlotAvailable(timeString)) {
        return false;
      }
      currentTime = addHours(currentTime, 1);
    }
    
    return true;
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedDate) {
      newErrors.date = 'Please select a date';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'Cannot book for past dates';
      }
    }
    
    if (!selectedRoom) {
      newErrors.room = 'Please select a room';
    }
    
    if (!startTime) {
      newErrors.startTime = 'Please select a start time';
    }
    
    if (!endTime) {
      newErrors.endTime = 'Please select an end time';
    }
    
    if (startTime && endTime) {
      if (!isTimeRangeValid()) {
        newErrors.timeRange = 'Invalid time range or time slot already booked';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Check availability when date or room changes
  useEffect(() => {
    if (selectedDate && selectedRoom) {
      dispatch(
        checkAvailability({
          date: selectedDate.toISOString().split('T')[0],
          room: selectedRoom,
        })
      );
    }
  }, [dispatch, selectedDate, selectedRoom]);
  
  // Redirect to booking details after successful booking
  useEffect(() => {
    if (success && booking) {
      navigate(`/booking/${booking._id}`);
    }
  }, [success, booking, navigate]);
  
  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  
  // Handle room change
  const handleRoomChange = (e) => {
    setSelectedRoom(e.target.value);
  };
  
  // Handle start time change
  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
    
    // Automatically set end time to 2 hours after start time if possible
    const start = parse(e.target.value, 'HH:mm', new Date());
    const suggestedEnd = addHours(start, 2);
    const suggestedEndTime = format(suggestedEnd, 'HH:mm');
    
    // Only set if it's within the available time slots
    if (timeSlots.includes(suggestedEndTime)) {
      setEndTime(suggestedEndTime);
    }
  };
  
  // Handle end time change
  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login?redirect=booking');
      return;
    }
    
    if (validateForm()) {
      dispatch(clearError());
      
      const bookingData = {
        room: selectedRoom,
        date: selectedDate.toISOString(),
        startTime,
        endTime,
        totalHours: calculateTotalHours(),
        price: calculateTotalPrice(),
        notes,
      };
      
      dispatch(createBooking(bookingData));
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Book a Studio</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Our Studios</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Recording Studios</h3>
                <p className="text-gray-600 mb-4">
                  Professional recording studios with top-of-the-line equipment and acoustically
                  treated rooms.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex justify-between">
                    <span>Studio A</span>
                    <span className="font-semibold">${rooms[0].price}/hour</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Studio B</span>
                    <span className="font-semibold">${rooms[1].price}/hour</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Practice Rooms</h3>
                <p className="text-gray-600 mb-4">
                  Comfortable practice rooms for bands and solo musicians with basic equipment.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex justify-between">
                    <span>Practice Room 1-3</span>
                    <span className="font-semibold">${rooms[2].price}/hour</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Booking Policy</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>Minimum booking: 1 hour</li>
                  <li>Cancellations: 24 hours notice required for refund</li>
                  <li>Payment: Required at time of booking</li>
                  <li>Equipment: Basic equipment included</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Book Your Session</h2>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="alert alert-danger flex items-center mb-6">
                <AlertCircle className="mr-2" size={20} />
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column - Calendar */}
                <div>
                  <div className="form-group">
                    <label className="form-label flex items-center">
                      <CalendarIcon size={18} className="mr-2 text-blue-600" />
                      Select Date
                    </label>
                    <div className="mt-2">
                      <Calendar
                        onChange={handleDateChange}
                        value={selectedDate}
                        minDate={new Date()}
                        className="border border-gray-300 rounded-md"
                      />
                    </div>
                    {errors.date && (
                      <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                    )}
                  </div>
                </div>
                
                {/* Right Column - Booking Details */}
                <div>
                  <div className="form-group">
                    <label htmlFor="room" className="form-label flex items-center">
                      <Music size={18} className="mr-2 text-blue-600" />
                      Select Room
                    </label>
                    <select
                      id="room"
                      className="form-control mt-1"
                      value={selectedRoom}
                      onChange={handleRoomChange}
                    >
                      {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.name} - ${room.price}/hour
                        </option>
                      ))}
                    </select>
                    {errors.room && (
                      <p className="text-red-500 text-sm mt-1">{errors.room}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="form-group">
                      <label htmlFor="startTime" className="form-label flex items-center">
                        <Clock size={18} className="mr-2 text-blue-600" />
                        Start Time
                      </label>
                      <select
                        id="startTime"
                        className="form-control mt-1"
                        value={startTime}
                        onChange={handleStartTimeChange}
                      >
                        {timeSlots.map((time) => (
                          <option
                            key={`start-${time}`}
                            value={time}
                            disabled={!isTimeSlotAvailable(time)}
                          >
                            {time}
                          </option>
                        ))}
                      </select>
                      {errors.startTime && (
                        <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="endTime" className="form-label flex items-center">
                        <Clock size={18} className="mr-2 text-blue-600" />
                        End Time
                      </label>
                      <select
                        id="endTime"
                        className="form-control mt-1"
                        value={endTime}
                        onChange={handleEndTimeChange}
                      >
                        {timeSlots.map((time) => (
                          <option
                            key={`end-${time}`}
                            value={time}
                            disabled={
                              time <= startTime || // Can't end before or at start time
                              (!isTimeSlotAvailable(time) && time !== endTime) // Disable if not available and not currently selected
                            }
                          >
                            {time}
                          </option>
                        ))}
                      </select>
                      {errors.endTime && (
                        <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>
                      )}
                    </div>
                  </div>
                  
                  {errors.timeRange && (
                    <p className="text-red-500 text-sm mt-1">{errors.timeRange}</p>
                  )}
                  
                  <div className="form-group mt-4">
                    <label htmlFor="notes" className="form-label">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      className="form-control mt-1"
                      rows="3"
                      placeholder="Any special requirements or equipment needs?"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mt-6">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <DollarSign size={18} className="mr-2 text-green-600" />
                      Booking Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span>{selectedDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Room:</span>
                        <span>{selectedRoom}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span>
                          {startTime} - {endTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{calculateTotalHours()} hours</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total Price:</span>
                        <span>${calculateTotalPrice().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Processing...' : 'Book Now'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingScreen;