import asyncHandler from 'express-async-handler';
import sendEmail from '../utils/sendEmail.js';

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter
// @access  Public
const subscribeToNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Please provide an email address');
  }

  // In a real application, you would save this to a database
  // and/or integrate with Mailchimp API
  // For now, we'll just send a confirmation email

  const message = `
    <h1>Newsletter Subscription Confirmation</h1>
    <p>Thank you for subscribing to our newsletter!</p>
    <p>You will now receive updates about:</p>
    <ul>
      <li>New instruments and equipment</li>
      <li>Special offers and discounts</li>
      <li>Upcoming events and workshops</li>
      <li>Music tips and tutorials</li>
    </ul>
    <p>If you wish to unsubscribe at any time, please click the unsubscribe link in any of our emails.</p>
  `;

  try {
    await sendEmail({
      email,
      subject: 'Welcome to Our Newsletter!',
      message,
    });

    res.status(200).json({ success: true, data: 'Subscription successful' });
  } catch (error) {
    console.error('Email could not be sent', error);
    res.status(500);
    throw new Error('Subscription failed');
  }
});

export { subscribeToNewsletter };