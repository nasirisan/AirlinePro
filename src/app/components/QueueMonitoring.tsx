import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { PassengerType, TicketClass } from '../types';
import { ArrowLeft, Star, Award, Users, Eye } from 'lucide-react';

export const QueueMonitoring: React.FC = () => {
  const navigate = useNavigate();
  const { flights, waitingLists, theme } = useBooking();
  const [selectedFlightId, setSelectedFlightId] = useState<string>(flights[0]?.id || '');

  const selectedFlight = flights.find(f => f.id === selectedFlightId);
  const waitingList = selectedFlightId ? waitingLists[selectedFlightId] || [] : [];

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

  const getPriorityLabel = (entry: typeof waitingList[0]) => {
    if (entry.passenger.type === PassengerType.VIP) return 'VIP';
    if (entry.passenger.type === PassengerType.FrequentFlyer) return 'Frequent Flyer';
    if (entry.ticketClass === TicketClass.First) return 'First Class';
    if (entry.ticketClass === TicketClass.Business) return 'Business';
    return 'Normal';
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Queue Monitoring
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Real-time waiting list status
                </p>
              </div>
            </div>
            <Link
              to="/admin/dashboard"
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Flight Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Select Flight
          </label>
          <select
            value={selectedFlightId}
            onChange={(e) => setSelectedFlightId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            {flights.map((flight) => (
              <option key={flight.id} value={flight.id}>
                {flight.flightNumber} - {flight.from} → {flight.to} ({flight.date})
              </option>
            ))}
          </select>
        </div>

        {selectedFlight && (
          <>
            {/* Flight Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Waiting</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {waitingList.length}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Priority Queue</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {priorityQueue.length}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Normal Queue</p>
                <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">
                  {normalQueue.length}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Available Seats</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {selectedFlight.availableSeats}
                </p>
              </div>
            </div>

            {/* Queue Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Priority Queue */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                    <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Priority Queue
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      VIP, Frequent Flyers, Business/First Class
                    </p>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full">
                    <span className="font-bold text-purple-600 dark:text-purple-400">
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
                      <div
                        key={entry.id}
                        className={`p-4 rounded-lg border ${
                          entry.notified
                            ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-gray-900 dark:text-white">
                                #{index + 1}
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {entry.passenger.name}
                              </span>
                              {entry.notified && (
                                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-0.5 rounded-full font-medium">
                                  Notified
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Type:</span>{' '}
                            <span className="font-medium text-gray-900 dark:text-white">
                              {getPriorityLabel(entry)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Class:</span>{' '}
                            <span className="font-medium text-gray-900 dark:text-white">
                              {entry.ticketClass}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-500 dark:text-gray-400">Email:</span>{' '}
                            <span className="text-gray-900 dark:text-white">
                              {entry.passenger.email}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-500 dark:text-gray-400">Joined:</span>{' '}
                            <span className="text-gray-900 dark:text-white">
                              {new Date(entry.joinedAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Normal Queue */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                    <Users className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Normal Queue
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Economy Class (FIFO)
                    </p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    <span className="font-bold text-gray-600 dark:text-gray-400">
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
                      <div
                        key={entry.id}
                        className={`p-4 rounded-lg border ${
                          entry.notified
                            ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-gray-900 dark:text-white">
                                #{priorityQueue.length + index + 1}
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {entry.passenger.name}
                              </span>
                              {entry.notified && (
                                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-0.5 rounded-full font-medium">
                                  Notified
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Type:</span>{' '}
                            <span className="font-medium text-gray-900 dark:text-white">
                              Normal
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Class:</span>{' '}
                            <span className="font-medium text-gray-900 dark:text-white">
                              {entry.ticketClass}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-500 dark:text-gray-400">Email:</span>{' '}
                            <span className="text-gray-900 dark:text-white">
                              {entry.passenger.email}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-gray-500 dark:text-gray-400">Joined:</span>{' '}
                            <span className="text-gray-900 dark:text-white">
                              {new Date(entry.joinedAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
