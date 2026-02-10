import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export const Privacy: React.FC = () => {
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
            Privacy Policy
          </h1>

          <div className={`prose ${theme === 'dark' ? 'prose-invert' : ''} max-w-none space-y-8`}>
            <section>
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                1. Information We Collect
              </h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                We collect information you provide directly such as name, email, phone number, and payment details during booking. We also collect information automatically through cookies and analytics about how you use our website.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                2. How We Use Your Information
              </h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                We use your information to process bookings, send confirmations and updates, provide customer support, improve our services, and comply with legal requirements. We do not sell or share your personal information with third parties without consent.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                3. Security
              </h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                We use industry-standard SSL encryption to protect your payment information. All data is stored securely and accessed only by authorized personnel. We regularly audit our security practices to ensure compliance with data protection standards.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                4. Cookies
              </h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                We use cookies to enhance your experience, remember preferences, and analyze usage patterns. You can control cookie settings in your browser preferences. Disabling cookies may affect website functionality.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                5. Your Rights
              </h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                You have the right to access, correct, or delete your personal information. To exercise these rights or for privacy concerns, contact privacy@nasairlines.com. We will respond within 30 days.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                6. Third-Party Links
              </h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                Our website may contain links to third-party sites. We are not responsible for their privacy practices. Please review their policies before sharing information.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                7. Changes to This Policy
              </h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                We may update this privacy policy periodically. Changes will be posted here with an updated effective date. Your continued use of our services constitutes acceptance of the updated policy.
              </p>
            </section>

            <div className={`p-6 rounded-lg border-l-4 ${theme === 'dark' ? 'bg-gray-800 border-l-blue-600' : 'bg-blue-50 border-l-blue-600'}`}>
              <p className={`font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Last Updated: February 2026
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                For privacy inquiries, contact privacy@nasairlines.com
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
