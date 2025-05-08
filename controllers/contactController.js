import asyncHandler from 'express-async-handler';
import sendEmail from '../utils/sendEmail.js';

// @desc    Send contact message
// @route   POST /api/contact
// @access  Public
const sendContactMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  // Send email to admin
  const emailContent = `
    <h1>New Contact Message</h1>
    <p><strong>From:</strong> ${name} (${email})</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <h2>Message:</h2>
    <p>${message}</p>
  `;

  try {
    await sendEmail({
      email: process.env.FROM_EMAIL, // Send to admin email
      subject: `Contact Form: ${subject}`,
      message: emailContent,
    });

    // Send confirmation to user
    const confirmationMessage = `
      <h1>Thank you for contacting us!</h1>
      <p>We have received your message and will get back to you as soon as possible.</p>
      <p>Your message:</p>
      <p>${message}</p>
    `;

    await sendEmail({
      email: email,
      subject: 'We received your message',
      message: confirmationMessage,
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (error) {
    console.error('Email could not be sent', error);
    res.status(500);
    throw new Error('Email could not be sent');
  }
});

export { sendContactMessage };