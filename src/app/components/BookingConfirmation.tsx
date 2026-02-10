import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { CheckCircle, Plane, Calendar, Clock, MapPin, User, CreditCard, Download, Home } from 'lucide-react';
import { motion } from 'motion/react';

export const BookingConfirmation: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { bookings, theme } = useBooking();

  const booking = bookings.find(b => b.id === bookingId);

  if (!booking) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Booking not found</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-green-100">Your flight has been successfully booked</p>
          </div>

          {/* Booking Reference */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border-y border-blue-200 dark:border-blue-800 p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Booking Reference</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-wider">
                {booking.bookingReference}
              </p>
            </div>
          </div>

          {/* Flight Details */}
          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Plane className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Flight Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Route</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {booking.flight.from}
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      ↓
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {booking.flight.to}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(booking.flight.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Departure: {booking.flight.departureTime}
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Arrival: {booking.flight.arrivalTime}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Passenger</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {booking.passenger.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {booking.passenger.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Plane className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Seat & Class</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Seat {booking.seat.seatNumber}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {booking.ticketClass}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Amount Paid</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${booking.price}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-yellow-900 dark:text-yellow-300 mb-2">
                Important Information
              </h3>
              <ul className="text-sm text-yellow-800 dark:text-yellow-400 space-y-1">
                <li>• Please arrive at the airport at least 2 hours before departure</li>
                <li>• Keep your booking reference handy for check-in</li>
                <li>• Valid ID is required for boarding</li>
                <li>• Check baggage allowance for your ticket class</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                <Download className="w-5 h-5" />
                Download E-Ticket
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
              >
                <Home className="w-5 h-5" />
                Return Home
              </button>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Next Steps</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                1
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Check your email</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  A confirmation email has been sent to {booking.passenger.email}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                2
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Web Check-in</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Online check-in opens 24 hours before departure
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                3
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Arrive early</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Be at the airport 2 hours before your flight
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
