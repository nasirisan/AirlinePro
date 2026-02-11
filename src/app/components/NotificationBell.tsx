import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { Bell, Clock, X, CheckCircle } from 'lucide-react';

export const NotificationBell: React.FC = () => {
  const navigate = useNavigate();
  const { getPendingNotificationsForCurrentPassenger, getFlightById, confirmWaitingListBooking, currentPassenger, theme } = useBooking();
  const [showModal, setShowModal] = useState(false);
  
  const pendingNotifications = getPendingNotificationsForCurrentPassenger();
  const unreadCount = pendingNotifications.length;

  const handleAcceptOffer = useCallback((entryId: string, flightId: string) => {
    try {
      console.log('Accepting offer:', { entryId, flightId });
      const reservation = confirmWaitingListBooking(entryId, flightId);
      console.log('Reservation created:', reservation);
      if (reservation) {
        // Navigate to payment with the new reservation
        navigate(`/reservation/${reservation.id}/payment`);
        setShowModal(false);
      } else {
        console.error('Failed to create reservation - no available seats or notification expired');
        alert('Failed to accept offer. The seat may no longer be available or your offer has expired.');
      }
    } catch (error) {
      console.error('Error accepting offer:', error);
      alert('An error occurred while accepting the offer.');
    }
  }, [confirmWaitingListBooking, navigate]);

  const getTimeRemaining = useCallback((expiresAt: number | undefined): string => {
    if (!expiresAt) return 'Time unknown';
    const remaining = Math.max(0, expiresAt - Date.now());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  if (!currentPassenger) return null;

  return (
    <>
      {/* Notification Bell Button */}
      <button
        onClick={() => setShowModal(true)}
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        title={unreadCount > 0 ? `${unreadCount} pending offer(s)` : 'No pending offers'}
      >
        <Bell className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl max-w-md w-full p-6`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-500" />
                Seat Offers
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            {unreadCount === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">No pending offers</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {pendingNotifications.map((offer) => {
                  const flight = getFlightById(offer.flightId);
                  const timeRemaining = getTimeRemaining(offer.notificationExpiresAt);
                  
                  return (
                    <div
                      key={offer.id}
                      className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
                    >
                      {/* Flight Info */}
                      <div className="mb-3">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {flight?.flightNumber} - {flight?.from} → {flight?.to}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {flight?.date} at {flight?.departureTime}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Ticket Class: {offer.ticketClass}
                        </p>
                      </div>

                      {/* Time Remaining */}
                      <div className="flex items-center gap-2 mb-3 text-orange-600 dark:text-orange-400 text-sm font-semibold">
                        <Clock className="w-4 h-4" />
                        Must respond in {timeRemaining}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptOffer(offer.id, offer.flightId)}
                          className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Accept Offer
                        </button>
                        <button
                          onClick={() => setShowModal(false)}
                          className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
                        >
                          Later
                        </button>
                      </div>

                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        If time expires, offer goes to next in queue
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
