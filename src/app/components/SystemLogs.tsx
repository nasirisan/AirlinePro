import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { ArrowLeft, Activity, Filter, RotateCcw } from 'lucide-react';

export const SystemLogs: React.FC = () => {
  const navigate = useNavigate();
  const { systemLogs, theme } = useBooking();

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all demo data? This will clear all bookings, reservations, and waiting lists.')) {
      // Clear all app data from localStorage
      localStorage.removeItem('nas-bookings');
      localStorage.removeItem('nas-reservations');
      localStorage.removeItem('nas-waiting-lists');
      localStorage.removeItem('nas-system-logs');
      localStorage.removeItem('nas-flights');
      localStorage.removeItem('nas-seats');
      // Clear currentPassenger from sessionStorage (tab-specific)
      sessionStorage.removeItem('nas-current-passenger');
      // Reload the page to reinitialize with fresh data
      window.location.reload();
    }
  };

  const getActionColor = (action: string) => {
    if (action.includes('confirmed') || action.includes('notified')) {
      return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
    }
    if (action.includes('reserved')) {
      return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
    }
    if (action.includes('failed') || action.includes('timeout')) {
      return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
    }
    if (action.includes('waiting') || action.includes('Joined')) {
      return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30';
    }
    return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
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
                  System Activity Logs
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Real-time automated system actions
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
        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-2">
                Automated System Actions
              </h2>
              <p className="text-sm text-blue-800 dark:text-blue-400 mb-3">
                All actions are performed automatically by the system. Admins monitor activity but do not manually approve bookings.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
                  <p className="text-blue-600 dark:text-blue-400 font-medium">Seat Reserved</p>
                  <p className="text-gray-600 dark:text-gray-400">10-minute timer starts</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
                  <p className="text-green-600 dark:text-green-400 font-medium">Booking Confirmed</p>
                  <p className="text-gray-600 dark:text-gray-400">Payment successful</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
                  <p className="text-red-600 dark:text-red-400 font-medium">Payment Timeout</p>
                  <p className="text-gray-600 dark:text-gray-400">Seat auto-released</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
                  <p className="text-purple-600 dark:text-purple-400 font-medium">Queue Dequeue</p>
                  <p className="text-gray-600 dark:text-gray-400">Auto-notification sent</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Activity Log ({systemLogs.length})
              </h2>
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700 rounded-lg transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {systemLogs.length === 0 ? (
              <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                No system logs yet
              </div>
            ) : (
              systemLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getActionColor(log.action)}`}>
                        <Activity className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                            {log.action}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {log.details}
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          {new Date(log.timestamp).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </span>
                        {log.flightId && (
                          <>
                            <span>•</span>
                            <span>Flight ID: {log.flightId}</span>
                          </>
                        )}
                        {log.passengerId && (
                          <>
                            <span>•</span>
                            <span>Passenger ID: {log.passengerId}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Action Types</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Confirmed/Success</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Reserved/In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Failed/Timeout</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Queue Actions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Button - Bottom Right Corner */}
      <button
        onClick={handleResetData}
        className="fixed bottom-8 right-8 flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors shadow-lg"
        title="Reset all demo data"
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </button>
    </div>
  );
};
