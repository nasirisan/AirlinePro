import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { TicketClass, PassengerType } from '../types';
import { Clock, Users, ArrowLeft, AlertCircle, Star, Award } from 'lucide-react';
import { motion } from 'motion/react';

export const WaitingList: React.FC = () => {
  const { flightId } = useParams<{ flightId: string }>();
  const navigate = useNavigate();
  const { getFlightById, waitingLists, joinWaitingList, currentPassenger, theme } = useBooking();
  const [selectedClass, setSelectedClass] = useState<TicketClass>(TicketClass.Economy);
  const [joined, setJoined] = useState(false);
  const [position, setPosition] = useState<number>(0);

  const flight = flightId ? getFlightById(flightId) : undefined;
  const waitingList = flightId ? waitingLists[flightId] || [] : [];

  if (!flight || !currentPassenger) {
    return null;
  }

  const handleJoinWaitlist = () => {
    if (flightId) {
      const entry = joinWaitingList(flightId, currentPassenger, selectedClass);
      if (entry) {
        setJoined(true);
        setPosition(entry.position);
      }
    }
  };

  const priorityQueueMembers = waitingList.filter(
    e => e.passenger.type === PassengerType.VIP || 
         e.passenger.type === PassengerType.FrequentFlyer ||
         e.ticketClass === TicketClass.Business ||
         e.ticketClass === TicketClass.First
  );

  const normalQueueMembers = waitingList.filter(
    e => e.passenger.type === PassengerType.Normal && 
         e.ticketClass === TicketClass.Economy
  );

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Search
        </button>

        {!joined ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Flight Fully Booked
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Join the waiting list and we'll notify you when a seat becomes available
              </p>
            </div>

            {/* Flight Info */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-6">
              <h2 className="font-bold text-gray-900 dark:text-white mb-4">Flight Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Flight Number</p>
                  <p className="font-medium text-gray-900 dark:text-white">{flight.flightNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">{flight.date}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">From</p>
                  <p className="font-medium text-gray-900 dark:text-white">{flight.from}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">To</p>
                  <p className="font-medium text-gray-900 dark:text-white">{flight.to}</p>
                </div>
              </div>
            </div>

            {/* Class Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select Preferred Class
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[TicketClass.Economy, TicketClass.Business, TicketClass.First].map((ticketClass) => (
                  <button
                    key={ticketClass}
                    onClick={() => setSelectedClass(ticketClass)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedClass === ticketClass
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <p className="font-medium text-gray-900 dark:text-white">{ticketClass}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ${ticketClass === TicketClass.First ? flight.price.firstClass :
                        ticketClass === TicketClass.Business ? flight.price.business :
                        flight.price.economy}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Current Waiting List Status */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                    Current Waiting List
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-blue-700 dark:text-blue-400">Priority Queue</p>
                      <p className="font-bold text-blue-900 dark:text-blue-300">
                        {priorityQueueMembers.length} people
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        Business/First Class, VIP, Frequent Flyers
                      </p>
                    </div>
                    <div>
                      <p className="text-blue-700 dark:text-blue-400">Normal Queue</p>
                      <p className="font-bold text-blue-900 dark:text-blue-300">
                        {normalQueueMembers.length} people
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        Economy Class
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Priority Info */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium mb-2">
                How Priority Works
              </p>
              <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                <li>• VIP passengers get highest priority</li>
                <li>• Frequent Flyers get medium priority</li>
                <li>• Business/First Class bookings prioritized over Economy</li>
                <li>• Within same priority, FIFO (First In First Out) applies</li>
              </ul>
            </div>

            <button
              onClick={handleJoinWaitlist}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-lg transition-colors"
            >
              Join Waiting List
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                <Clock className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                You're on the Waiting List!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                We'll notify you when a seat becomes available
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 mb-6">
              <p className="text-sm opacity-90 mb-1">Your Position</p>
              <p className="text-5xl font-bold mb-2">#{position}</p>
              <p className="text-sm opacity-90">
                {currentPassenger.type === PassengerType.VIP ? (
                  <span className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    VIP - Priority Queue
                  </span>
                ) : currentPassenger.type === PassengerType.FrequentFlyer ? (
                  <span className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Frequent Flyer - Priority Queue
                  </span>
                ) : selectedClass !== TicketClass.Economy ? (
                  <span className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    {selectedClass} - Priority Queue
                  </span>
                ) : (
                  'Economy - Normal Queue'
                )}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="font-medium text-gray-900 dark:text-white mb-2">What happens next?</p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>✓ You'll receive a notification when a seat becomes available</li>
                  <li>✓ You'll have 5 minutes to confirm and proceed to payment</li>
                  <li>✓ If you don't respond, the next person in queue will be notified</li>
                </ul>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  <strong>Estimated Wait Time:</strong> Seats typically become available within 10-15 minutes due to payment timeouts
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
              >
                Return Home
              </button>
              <button
                onClick={() => navigate(`/flight/${flightId}/waiting-list/status`)}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                View Queue Status
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
