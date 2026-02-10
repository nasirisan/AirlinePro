import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export const RefundPolicy: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useBooking();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <nav className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 font-medium transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={`text-4xl font-bold mb-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Refund Policy
          </h1>

          <div className={`prose ${theme === 'dark' ? 'prose-invert' : ''} max-w-none space-y-8`}>
            <section>
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                1. Refundable Bookings
              </h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                Refundable tickets are fully refundable up to 24 hours before departure. Refunds will be processed within 7-10 business days to your original payment method.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                2. Non-Refundable Bookings
              </h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                Non-refundable tickets cannot be refunded. However, you can change your flight to a different date without paying change fees (only fare differences apply), provided at least 24 hours notice is given.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                3. Cancellation by NAS Airlines
              </h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                If we cancel your flight, you will receive a full refund or rebooking on another flight at no additional charge. You will be notified via email within 2 hours of cancellation.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                4. Refund Processing
              </h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                Refunds are processed to the original payment method. Credit card refunds may take 7-10 business days, while bank transfers take 3-5 business days. You will receive a confirmation email with refund details.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                5. Partial Refunds
              </h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                If you use a portion of your ticket (e.g., outbound flight), the return portion is not refundable. Taxes and fees are non-refundable.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                6. Special Circumstances
              </h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                In case of emergencies, illness, or other special circumstances, contact our support team to discuss options. We may offer rebooking, travel credits, or refunds at our discretion.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                7. Refund Requests
              </h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                To request a refund, log in to your account or contact support@nasairlines.com with your booking reference. Processing may take up to 48 hours after approval.
              </p>
            </section>

            <div className={`p-6 rounded-lg border-l-4 ${theme === 'dark' ? 'bg-gray-800 border-l-blue-600' : 'bg-blue-50 border-l-blue-600'}`}>
              <p className={`font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Last Updated: February 2026
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                For refund inquiries, contact refunds@nasairlines.com
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
