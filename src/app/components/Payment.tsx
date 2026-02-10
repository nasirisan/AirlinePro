import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { CountdownTimer } from './CountdownTimer';
import { CreditCard, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const Payment: React.FC = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const navigate = useNavigate();
  const { getReservationById, getFlightById, processPayment, theme } = useBooking();
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed'>('idle');

  const reservation = reservationId ? getReservationById(reservationId) : undefined;
  const flight = reservation ? getFlightById(reservation.flightId) : undefined;

  useEffect(() => {
    if (!reservation) {
      navigate('/');
    }
  }, [reservation, navigate]);

  if (!reservation) {
    return null;
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 90% success rate for demo purposes
    const success = Math.random() > 0.1;
    
    const booking = processPayment(reservation.id, success);

    if (booking) {
      setPaymentStatus('success');
      setTimeout(() => {
        navigate(`/booking/${booking.id}/confirmation`);
      }, 2000);
    } else {
      setPaymentStatus('failed');
      setProcessing(false);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  };

  const handleExpire = () => {
    navigate('/');
  };

  const price = flight && reservation.seat.class === 'First Class' 
    ? flight.price.firstClass 
    : flight && reservation.seat.class === 'Business' 
    ? flight.price.business 
    : flight?.price.economy || 0;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Timer Alert */}
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Complete Payment
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Your seat is temporarily reserved. Complete payment before time expires.
                </p>
              </div>
              <CountdownTimer
                expiresAt={reservation.expiresAt}
                onExpire={handleExpire}
                warningThreshold={120}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            {paymentStatus === 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Secure Payment</h3>
                </div>

                <form onSubmit={handlePayment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim())}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="John Doe"
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 2) {
                            setExpiryDate(value);
                          } else {
                            setExpiryDate(value.slice(0, 2) + '/' + value.slice(2, 4));
                          }
                        }}
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="123"
                        maxLength={3}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={processing}
                      className={`w-full py-4 rounded-lg font-medium text-lg transition-all ${
                        processing
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {processing ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing Payment...
                        </span>
                      ) : (
                        `Pay $${price}`
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Lock className="w-4 h-4" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </motion.div>
            )}

            {paymentStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Payment Successful!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your booking has been confirmed. Redirecting to confirmation page...
                  </p>
                </div>
              </motion.div>
            )}

            {paymentStatus === 'failed' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                    <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Payment Failed
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Your payment could not be processed. The seat has been released.
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Redirecting to home page...
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Order Summary</h3>

              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Flight</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {reservation.flight?.flightNumber}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Route</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {reservation.flight?.from} → {reservation.flight?.to}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Passenger</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {reservation.passenger.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Seat</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {reservation.seat.seatNumber} ({reservation.seat.class})
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${price}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};