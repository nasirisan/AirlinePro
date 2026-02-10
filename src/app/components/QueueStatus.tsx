import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { PassengerType, TicketClass } from '../types';
import { ArrowLeft, Star, Award, Users, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

export const QueueStatus: React.FC = () => {
  const { flightId } = useParams<{ flightId: string }>();
  const navigate = useNavigate();
  const { getFlightById, waitingLists, theme } = useBooking();

  const flight = flightId ? getFlightById(flightId) : undefined;
  const waitingList = flightId ? waitingLists[flightId] || [] : [];

  if (!flight) {
    return null;
  }

  // Separate into priority and normal queues
  const priorityQueue = waitingList.filter(
    e => e.passenger.type === PassengerType.VIP || 
         e.passenger.type === PassengerType.FrequentFlyer ||
         e.ticketClass === TicketClass.Business ||
         e.ticketClass === TicketClass.First
  );

  const normalQueue = waitingList.filter(
    e => e.passenger.type === PassengerType.Normal && 
         e.ticketClass === TicketClass.Economy
  );

  const getPriorityLevel = (entry: typeof waitingList[0]) => {
    if (entry.passenger.type === PassengerType.VIP) return 'VIP';
    if (entry.passenger.type === PassengerType.FrequentFlyer) return 'Frequent Flyer';
    if (entry.ticketClass === TicketClass.First) return 'First Class';
    if (entry.ticketClass === TicketClass.Business) return 'Business';
    return 'Economy';
  };

  const getPriorityColor = (entry: typeof waitingList[0]) => {
    const level = getPriorityLevel(entry);
    if (level === 'VIP') return 'text-purple-600 dark:text-purple-400';
    if (level === 'Frequent Flyer') return 'text-blue-600 dark:text-blue-400';
    if (level === 'First Class') return 'text-indigo-600 dark:text-indigo-400';
    if (level === 'Business') return 'text-cyan-600 dark:text-cyan-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Queue Status
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Flight {flight.flightNumber}: {flight.from} → {flight.to}
          </p>
        </div>

        {/* Queue Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-2">
                How the Queue Works
              </h2>
              <p className="text-sm text-blue-800 dark:text-blue-400 mb-3">
                Priority is determined by ticket class and loyalty status. Within the same priority level, FIFO (First In First Out) applies.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
                  <p className="text-purple-600 dark:text-purple-400 font-medium">Highest Priority</p>
                  <p className="text-gray-600 dark:text-gray-400">VIP Passengers</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
                  <p className="text-blue-600 dark:text-blue-400 font-medium">High Priority</p>
                  <p className="text-gray-600 dark:text-gray-400">Frequent Flyers</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
                  <p className="text-cyan-600 dark:text-cyan-400 font-medium">Medium Priority</p>
                  <p className="text-gray-600 dark:text-gray-400">Business/First Class</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
                  <p className="text-gray-600 dark:text-gray-400 font-medium">Normal Priority</p>
                  <p className="text-gray-600 dark:text-gray-400">Economy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Priority Queue */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                  <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Priority Queue
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    VIP, Frequent Flyers, Business/First Class
                  </p>
                </div>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full">
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {priorityQueue.length}
                </span>
              </div>
            </div>

            {priorityQueue.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No passengers in priority queue
              </div>
            ) : (
              <div className="space-y-3">
                {priorityQueue.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg border-2 ${
                      entry.notified
                        ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            #{index + 1}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {entry.passenger.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className={`font-medium ${getPriorityColor(entry)}`}>
                            {getPriorityLevel(entry)}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {entry.ticketClass}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Joined {new Date(entry.joinedAt).toLocaleTimeString()}
                        </p>
                      </div>
                      {entry.notified && (
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded-full font-medium">
                          Notified
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Normal Queue */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                  <Users className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Normal Queue
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Economy Class (FIFO)
                  </p>
                </div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                <span className="text-lg font-bold text-gray-600 dark:text-gray-400">
                  {normalQueue.length}
                </span>
              </div>
            </div>

            {normalQueue.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No passengers in normal queue
              </div>
            ) : (
              <div className="space-y-3">
                {normalQueue.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg border-2 ${
                      entry.notified
                        ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            #{priorityQueue.length + index + 1}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {entry.passenger.name}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {entry.ticketClass}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Joined {new Date(entry.joinedAt).toLocaleTimeString()}
                        </p>
                      </div>
                      {entry.notified && (
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded-full font-medium">
                          Notified
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
