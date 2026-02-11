import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { CheckCircle, Plane, Calendar, Clock, MapPin, User, CreditCard, Download, Home } from 'lucide-react';
import { motion } from 'motion/react';

export const BookingConfirmation: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { bookings, theme } = useBooking();

  const booking = bookings.find(b => b.id === bookingId);

  const downloadReceipt = useCallback(() => {
    if (!booking) return;

    const flightDate = new Date(booking.flight.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const receiptHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Seven Airlines - E-Ticket Receipt</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f3f4f6; padding: 40px; color: #1f2937; }
    .receipt { max-width: 700px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; padding: 32px; text-align: center; }
    .header h1 { font-size: 28px; margin-bottom: 4px; }
    .header p { font-size: 14px; opacity: 0.85; }
    .ref-bar { background: #eff6ff; border-bottom: 1px solid #bfdbfe; padding: 20px; text-align: center; }
    .ref-bar .label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; }
    .ref-bar .value { font-size: 28px; font-weight: 800; letter-spacing: 3px; color: #1e40af; margin-top: 4px; }
    .body { padding: 32px; }
    .section-title { font-size: 16px; font-weight: 700; color: #374151; margin-bottom: 16px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; }
    .field .label { font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
    .field .value { font-size: 15px; font-weight: 600; color: #111827; }
    .route-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 28px; text-align: center; }
    .route-box .cities { font-size: 22px; font-weight: 700; color: #1f2937; }
    .route-box .arrow { color: #2563eb; margin: 0 12px; }
    .route-box .flight-num { font-size: 13px; color: #6b7280; margin-top: 4px; }
    .price-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 28px; }
    .price-box .label { font-size: 12px; color: #6b7280; }
    .price-box .amount { font-size: 36px; font-weight: 800; color: #16a34a; }
    .notice { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; font-size: 13px; color: #92400e; margin-bottom: 20px; }
    .notice strong { display: block; margin-bottom: 4px; }
    .notice ul { padding-left: 18px; margin-top: 6px; }
    .notice li { margin-bottom: 3px; }
    .footer { border-top: 1px solid #e5e7eb; padding: 20px 32px; text-align: center; font-size: 12px; color: #9ca3af; }
    .barcode { font-family: 'Courier New', monospace; font-size: 14px; letter-spacing: 4px; color: #374151; margin-top: 12px; }
    @media print { body { background: #fff; padding: 0; } .receipt { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>✈ Seven Airlines</h1>
      <p>Electronic Ticket / Receipt</p>
    </div>

    <div class="ref-bar">
      <div class="label">Booking Reference</div>
      <div class="value">${booking.bookingReference}</div>
    </div>

    <div class="body">
      <div class="route-box">
        <div class="cities">
          ${booking.flight.from} <span class="arrow">→</span> ${booking.flight.to}
        </div>
        <div class="flight-num">Flight ${booking.flight.flightNumber}</div>
      </div>

      <div class="section-title">Flight Details</div>
      <div class="grid">
        <div class="field">
          <div class="label">Date</div>
          <div class="value">${flightDate}</div>
        </div>
        <div class="field">
          <div class="label">Departure</div>
          <div class="value">${booking.flight.departureTime}</div>
        </div>
        <div class="field">
          <div class="label">Arrival</div>
          <div class="value">${booking.flight.arrivalTime}</div>
        </div>
        <div class="field">
          <div class="label">Status</div>
          <div class="value" style="color: #16a34a;">Confirmed</div>
        </div>
      </div>

      <div class="section-title">Passenger Details</div>
      <div class="grid">
        <div class="field">
          <div class="label">Passenger Name</div>
          <div class="value">${booking.passenger.name}</div>
        </div>
        <div class="field">
          <div class="label">Email</div>
          <div class="value">${booking.passenger.email}</div>
        </div>
        <div class="field">
          <div class="label">Seat Number</div>
          <div class="value">${booking.seat.seatNumber}</div>
        </div>
        <div class="field">
          <div class="label">Class</div>
          <div class="value">${booking.ticketClass}</div>
        </div>
      </div>

      <div class="price-box">
        <div class="label">Total Amount Paid</div>
        <div class="amount">$${booking.price}</div>
      </div>

      <div class="notice">
        <strong>Important Information</strong>
        <ul>
          <li>Please arrive at the airport at least 2 hours before departure</li>
          <li>Keep your booking reference handy for check-in</li>
          <li>Valid ID / passport is required for boarding</li>
          <li>Check baggage allowance for your ticket class</li>
        </ul>
      </div>

      <div style="text-align: center;">
        <div class="barcode">${booking.bookingReference}</div>
        <p style="font-size: 11px; color: #9ca3af; margin-top: 8px;">
          Issued on ${new Date(booking.bookedAt).toLocaleString()}
        </p>
      </div>
    </div>

    <div class="footer">
      Seven Airlines &bull; support@sevenairlines.com &bull; +233 598 364 638<br/>
      This is an electronically generated receipt and does not require a signature.
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SevenAirlines-Receipt-${booking.bookingReference}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [booking]);

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
              <button
                onClick={downloadReceipt}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Receipt
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
