import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { Home } from 'lucide-react';
import { motion } from 'motion/react';

export const Terms: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useBooking();

  const isActive = (path: string) => location.pathname === path;

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
            onClick={() => navigate('/terms')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${isActive('/terms') ? 'bg-blue-600 text-white' : theme === 'dark' ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            Terms
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={`text-4xl font-bold mb-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Terms & Conditions
          </h1>

          <div className={`prose ${theme === 'dark' ? 'prose-invert' : ''} max-w-none space-y-8`}>
            <section>
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                1. Booking and Reservation
              </h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                All flight bookings through Seven Airlines are subject to these terms and conditions. By completing a booking, you accept and agree to be bound by these terms. A booking is only confirmed upon successful payment and receipt of a confirmation email.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                2. Seat Reservation Period
              </h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                Selected seats are reserved for 10 minutes. If payment is not completed within this period, the seat becomes available for other passengers. No refund will be issued for expired reservations.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                3. Payment
              </h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                All payments must be made using a valid credit or debit card. All prices shown are per person and displayed in the selected currency. Taxes and fees are included in the displayed price.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                4. Waiting List
              </h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                If a flight is fully booked, you may join the waiting list. Priority is given based on passenger type (VIP, Business Class, etc.) and time of joining. You will receive 5 minutes to confirm when a seat becomes available.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                5. Passenger Responsibilities
              </h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                Passengers must provide accurate information during booking. Any discrepancies may result in denial of boarding. Passengers are responsible for obtaining necessary travel documents (passports, visas) and arriving at the airport at the specified time.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                6. Liability Limitations
              </h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                Seven Airlines is not liable for delays, cancellations, or other issues beyond our reasonable control. Our liability is limited to the price of the ticket. Extended liability insurance can be purchased for additional coverage.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                7. Changes and Amendments
              </h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                These terms and conditions may be updated at any time. Changes will be posted on our website and are effective immediately. Continued use of our services constitutes acceptance of updated terms.
              </p>
            </section>

            <div className={`p-6 rounded-lg border-l-4 ${theme === 'dark' ? 'bg-gray-800 border-l-blue-600' : 'bg-blue-50 border-l-blue-600'}`}>
              <p className={`font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Last Updated: February 2026
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                For questions about these terms, contact legal@sevenairlines.com
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
