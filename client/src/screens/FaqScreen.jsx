import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FaqScreen = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  
  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  
  const faqs = [
    {
      category: 'Studio Booking',
      questions: [
        {
          question: 'How do I book a studio or practice room?',
          answer:
            'You can book a studio or practice room through our online booking system. Simply navigate to the "Book Studio" page, select your preferred date, room, and time slot, and follow the checkout process. You will receive a confirmation email once your booking is complete.',
        },
        {
          question: 'What is your cancellation policy?',
          answer:
            'We require at least 24 hours notice for cancellations to be eligible for a refund. Cancellations made less than 24 hours before the booking time will not be refunded. You can cancel your booking through your account dashboard or by contacting our customer service team.',
        },
        {
          question: 'What equipment is included with studio bookings?',
          answer:
            'Our recording studios come equipped with professional-grade equipment including microphones, monitors, mixing consoles, and basic instruments. Practice rooms include a drum kit, amplifiers, and a PA system. If you need specific equipment, please let us know in advance or feel free to bring your own.',
        },
        {
          question: 'Can I extend my booking time if needed?',
          answer:
            'If the room is available after your booking, you can extend your session. Please check with our staff at least 30 minutes before your booking ends to see if an extension is possible. Additional time will be charged at the standard hourly rate.',
        },
      ],
    },
    {
      category: 'Orders & Shipping',
      questions: [
        {
          question: 'How long does shipping take?',
          answer:
            'Standard shipping typically takes 3-5 business days within the continental US. Express shipping options are available at checkout for 1-2 business day delivery. International shipping times vary by destination.',
        },
        {
          question: 'Do you ship internationally?',
          answer:
            'Currently, we only ship to the United States and Canada. We hope to expand our shipping options to more countries in the future.',
        },
        {
          question: 'What is your return policy?',
          answer:
            'We accept returns within 30 days of purchase for items in their original condition with all packaging and tags. Custom or personalized items cannot be returned unless defective. Return shipping costs are the responsibility of the customer unless the item is defective or was shipped incorrectly.',
        },
        {
          question: 'Can I track my order?',
          answer:
            'Yes, once your order ships, you will receive a confirmation email with tracking information. You can also view your order status and tracking information in your account dashboard.',
        },
      ],
    },
    {
      category: 'Products & Rentals',
      questions: [
        {
          question: 'Do you offer instrument rentals?',
          answer:
            'Yes, we offer rentals for many of our instruments. You can rent instruments on a daily, weekly, or monthly basis. Rental prices vary by instrument type and rental duration. Look for the "Rent" option on product pages.',
        },
        {
          question: 'Do you offer warranties on products?',
          answer:
            'All new instruments come with a manufacturer\'s warranty, typically 1-2 years depending on the brand. We also offer extended warranty options at checkout for additional protection. Used instruments come with a 90-day warranty against defects.',
        },
        {
          question: 'Can I try instruments before purchasing?',
          answer:
            'Yes, you can visit our physical store to try out instruments before making a purchase. If you purchase online and are not satisfied, you can return the instrument within our 30-day return period.',
        },
        {
          question: 'Do you offer instrument repairs?',
          answer:
            'Yes, we offer repair services for most instruments. Our skilled technicians can handle everything from basic setups to major repairs. Contact us for a repair quote or bring your instrument to our store for an assessment.',
        },
      ],
    },
    {
      category: 'Account & Payment',
      questions: [
        {
          question: 'How do I create an account?',
          answer:
            'You can create an account by clicking the "Sign In" button in the top right corner of our website and selecting "Register". You\'ll need to provide your name, email address, and create a password. You can also register during the checkout process.',
        },
        {
          question: 'What payment methods do you accept?',
          answer:
            'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and Apple Pay. For in-store purchases, we also accept cash and debit cards.',
        },
        {
          question: 'Is my payment information secure?',
          answer:
            'Yes, we use industry-standard encryption and security measures to protect your payment information. We do not store your credit card details on our servers. All transactions are processed through secure payment gateways.',
        },
        {
          question: 'Do you offer financing options?',
          answer:
            'Yes, we offer financing options for purchases over $500. You can apply for financing during checkout. We partner with Affirm and Klarna to provide flexible payment plans with competitive interest rates.',
        },
      ],
    },
  ];

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-600">
            Find answers to common questions about our services, products, and policies.
          </p>
        </div>
        
        <div className="space-y-8">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold flex items-center">
                  <HelpCircle size={20} className="mr-2 text-blue-600" />
                  {category.category}
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {category.questions.map((faq, faqIndex) => {
                  const index = `${categoryIndex}-${faqIndex}`;
                  const isActive = activeIndex === index;
                  
                  return (
                    <div key={faqIndex} className="p-6">
                      <button
                        className="flex justify-between items-center w-full text-left focus:outline-none"
                        onClick={() => toggleFaq(index)}
                      >
                        <h3 className="text-lg font-medium">{faq.question}</h3>
                        {isActive ? (
                          <ChevronUp size={20} className="text-blue-600" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-400" />
                        )}
                      </button>
                      
                      {isActive && (
                        <div className="mt-4 text-gray-600 animate-fadeIn">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-blue-50 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-6">
            If you couldn't find the answer to your question, please feel free to contact us.
          </p>
          <div className="flex justify-center space-x-4">
            <a href="/contact" className="btn btn-primary">
              Contact Us
            </a>
            <a href="tel:+16155550123" className="btn btn-outline">
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqScreen;