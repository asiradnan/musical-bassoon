import asyncHandler from 'express-async-handler';
import Booking from '../models/bookingModel.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const {
    room,
    date,
    startTime,
    endTime,
    totalHours,
    price,
    notes,
  } = req.body;

  // Check if room is available for the requested time
  const existingBooking = await Booking.findOne({
    room,
    date: new Date(date),
    $or: [
      {
        startTime: { $lte: startTime },
        endTime: { $gt: startTime },
      },
      {
        startTime: { $lt: endTime },
        endTime: { $gte: endTime },
      },
      {
        startTime: { $gte: startTime },
        endTime: { $lte: endTime },
      },
    ],
    isCancelled: false,
  });

  if (existingBooking) {
    res.status(400);
    throw new Error('Room is already booked for this time slot');
  }

  const booking = new Booking({
    user: req.user._id,
    room,
    date: new Date(date),
    startTime,
    endTime,
    totalHours,
    price,
    notes,
  });

  const createdBooking = await booking.save();

  // Send confirmation email
  const message = `
    <h1>Booking Confirmation</h1>
    <p>Thank you for booking with us!</p>
    <h2>Booking Details:</h2>
    <ul>
      <li>Room: ${room}</li>
      <li>Date: ${new Date(date).toLocaleDateString()}</li>
      <li>Time: ${startTime} - ${endTime}</li>
      <li>Total Hours: ${totalHours}</li>
      <li>Price: $${price}</li>
    </ul>
    <p>Please note that cancellations must be made at least 24 hours before your booking time to receive a refund.</p>
  `;

  try {
    await sendEmail({
      email: req.user.email,
      subject: 'Booking Confirmation',
      message,
    });
  } catch (error) {
    console.error('Email could not be sent', error);
  }

  res.status(201).json(createdBooking);
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (booking) {
    // Check if the booking belongs to the logged in user or if user is admin
    if (
      booking.user._id.toString() === req.user._id.toString() ||
      req.user.isAdmin
    ) {
      res.json(booking);
    } else {
      res.status(403);
      throw new Error('Not authorized to view this booking');
    }
  } else {
    res.status(404);
    throw new Error('Booking not found');
  }
});

// @desc    Update booking to paid
// @route   PUT /api/bookings/:id/pay
// @access  Private
const updateBookingToPaid = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (booking) {
    booking.isPaid = true;
    booking.paidAt = Date.now();
    booking.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedBooking = await booking.save();

    res.json(updatedBooking);
  } else {
    res.status(404);
    throw new Error('Booking not found');
  }
});

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).sort({
    date: -1,
  });
  res.json(bookings);
});

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({}).populate('user', 'id name').sort({
    date: -1,
  });
  res.json(bookings);
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check if the booking belongs to the logged in user or if user is admin
  if (
    booking.user.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    res.status(403);
    throw new Error('Not authorized to cancel this booking');
  }

  // Check if booking is already cancelled
  if (booking.isCancelled) {
    res.status(400);
    throw new Error('Booking is already cancelled');
  }

  // Check cancellation policy (24 hours before booking)
  const bookingDate = new Date(booking.date);
  bookingDate.setHours(
    parseInt(booking.startTime.split(':')[0]),
    parseInt(booking.startTime.split(':')[1])
  );
  
  const now = new Date();
  const hoursDifference = (bookingDate - now) / (1000 * 60 * 60);

  if (hoursDifference < 24 && !req.user.isAdmin) {
    res.status(400);
    throw new Error(
      'Bookings must be cancelled at least 24 hours in advance'
    );
  }

  booking.isCancelled = true;
  booking.cancelledAt = Date.now();

  const updatedBooking = await booking.save();

  // Send cancellation email
  const message = `
    <h1>Booking Cancellation</h1>
    <p>Your booking has been cancelled successfully.</p>
    <h2>Booking Details:</h2>
    <ul>
      <li>Room: ${booking.room}</li>
      <li>Date: ${new Date(booking.date).toLocaleDateString()}</li>
      <li>Time: ${booking.startTime} - ${booking.endTime}</li>
    </ul>
    <p>If you paid for this booking, a refund will be processed within 3-5 business days.</p>
  `;

  try {
    await sendEmail({
      email: req.user.email,
      subject: 'Booking Cancellation',
      message,
    });
  } catch (error) {
    console.error('Email could not be sent', error);
  }

  res.json(updatedBooking);
});

// @desc    Check room availability
// @route   GET /api/bookings/availability
// @access  Public
const checkAvailability = asyncHandler(async (req, res) => {
  const { room, date } = req.query;

  if (!room || !date) {
    res.status(400);
    throw new Error('Please provide room and date');
  }

  const bookings = await Booking.find({
    room,
    date: new Date(date),
    isCancelled: false,
  }).select('startTime endTime');

  res.json(bookings);
});

export {
  createBooking,
  getBookingById,
  updateBookingToPaid,
  getMyBookings,
  getBookings,
  cancelBooking,
  checkAvailability,
};