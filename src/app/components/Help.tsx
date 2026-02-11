import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { Home, ChevronDown, ChevronUp, Phone, Mail } from 'lucide-react';
import { motion } from 'motion/react';

export const Help: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useBooking();
  const [expanded, setExpanded] = useState<number | null>(0);

  const isActive = (path: string) => location.pathname === path;

  const faqs = [
    {
      question: 'How long is my seat reservation valid?',
      answer: 'Your seat is reserved for 10 minutes from the time of selection. During this time, you must complete your payment. If payment is not completed within 10 minutes, your seat will be released and become available for other passengers.'
    },
    {
      question: 'What happens if I join the waiting list?',
      answer: 'If a flight is fully booked, you can join the waiting list. Based on your passenger type (VIP, Business, etc.), you will be notified if a seat becomes available. When notified, you will have 5 minutes to confirm your booking before the seat is offered to the next person in queue.'
    },
    {
      question: 'Can I cancel or change my booking?',
      answer: 'Yes, you can cancel your booking through the "My Bookings" section. Refunds are processed according to our refund policy, which you can review in the footer. For changes, please contact our support team.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express) and debit cards. All payments are secured with SSL encryption for your safety.'
    },
    {
      question: 'How do I check my booking status?',
      answer: 'You can check your booking status using the "Flight Status" page. Enter your booking reference number, and you\'ll see real-time updates about your flight and seat.'
    },
    {
      question: 'Is there priority booking for VIP members?',
      answer: 'Yes, VIP members and frequent flyers get priority booking. They are processed first in the waiting list and get reserved seats before regular economy passengers.'
    },
    {
      question: 'Can I book multiple seats at once?',
      answer: 'No, you can book one seat per session. If you need to book multiple seats for a group, you can repeat the booking process for each passenger or contact our support team for group bookings.'
    },
    {
      question: 'Do I get a confirmation email?',
      answer: 'Yes, you will receive a confirmation email immediately after your payment is processed. The email includes your booking reference, flight details, and seat information.'
    }
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <nav className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => window.location.href = '/'}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${isActive('/') ? 'bg-blue-600 text-white' : theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            <Home className="w-5 h-5" />
            Home
          </button>
          <button
            onClick={() => navigate('/help')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${isActive('/help') ? 'bg-blue-600 text-white' : theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            Help
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Help & Support
          </h1>
          <p className={`text-lg mb-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Find answers to common questions about booking and managing your flights
          </p>

          {/* FAQ Section */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Frequently Asked Questions
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`rounded-lg border overflow-hidden ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <button
                    onClick={() => setExpanded(expanded === idx ? null : idx)}
                    className={`w-full px-6 py-4 flex items-center justify-between hover:bg-opacity-75 transition ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}
                  >
                    <p className={`font-bold text-left ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {faq.question}
                    </p>
                    {expanded === idx ? (
                      <ChevronUp className={`w-5 h-5 flex-shrink-0 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                    ) : (
                      <ChevronDown className={`w-5 h-5 flex-shrink-0 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                    )}
                  </button>

                  {expanded === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`border-t px-6 py-4 ${theme === 'dark' ? 'bg-gray-700/50 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl border p-8 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
          >
            <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Still need help?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <Phone className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className={`font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Call Us</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>+233 598 364 638</p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Available 24/7</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Mail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className={`font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Email Us</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>support@sevenairlines.com</p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Response within 2 hours</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
