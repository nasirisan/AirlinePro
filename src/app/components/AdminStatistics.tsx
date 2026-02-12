import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { BarChart3, CheckCircle, Clock, Users, Plane, ArrowLeft } from 'lucide-react';

export const AdminStatistics: React.FC = () => {
  const navigate = useNavigate();
  const { flights, reservations, bookings, waitingLists, theme } = useBooking();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const totalSeats = flights.reduce((sum, f) => sum + f.totalSeats, 0);
  const bookedSeats = flights.reduce((sum, f) => sum + f.bookedSeats, 0);
  const reservedSeats = flights.reduce((sum, f) => sum + f.reservedSeats, 0);
  const availableSeats = flights.reduce((sum, f) => sum + f.availableSeats, 0);
  const totalWaitingList = Object.values(waitingLists).reduce((sum, list) => sum + list.length, 0);

  const loadFactor = totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
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
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Statistics Report</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Operational overview</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Flights</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{flights.length}</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <Plane className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Confirmed Bookings</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{bookedSeats}</p>
              </div>
              <div className="bg-green-500 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Reserved Seats</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{reservedSeats}</p>
              </div>
              <div className="bg-yellow-500 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Waiting List</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{totalWaitingList}</p>
              </div>
              <div className="bg-purple-500 p-3 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Seat Utilization</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>Booked Seats</span>
                  <span>{bookedSeats} / {totalSeats}</span>
                </div>
                <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-3 rounded-full bg-green-500"
                    style={{ width: `${totalSeats > 0 ? (bookedSeats / totalSeats) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>Reserved Seats</span>
                  <span>{reservedSeats} / {totalSeats}</span>
                </div>
                <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-3 rounded-full bg-yellow-500"
                    style={{ width: `${totalSeats > 0 ? (reservedSeats / totalSeats) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>Available Seats</span>
                  <span>{availableSeats} / {totalSeats}</span>
                </div>
                <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-3 rounded-full bg-blue-500"
                    style={{ width: `${totalSeats > 0 ? (availableSeats / totalSeats) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Load Factor</h2>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">{loadFactor}%</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Percentage of booked seats across all flights
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
