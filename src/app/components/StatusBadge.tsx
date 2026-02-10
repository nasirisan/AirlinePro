import React from 'react';
import { FlightStatus, BookingStatus, SeatStatus } from '../types';
import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: FlightStatus | BookingStatus | SeatStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case FlightStatus.SeatsAvailable:
        return {
          color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
          icon: CheckCircle
        };
      case FlightStatus.LimitedSeats:
        return {
          color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
          icon: AlertCircle
        };
      case FlightStatus.FullyBooked:
        return {
          color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
          icon: XCircle
        };
      case BookingStatus.Reserved:
        return {
          color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
          icon: Clock
        };
      case BookingStatus.Confirmed:
        return {
          color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
          icon: CheckCircle
        };
      case BookingStatus.Cancelled:
      case BookingStatus.PaymentFailed:
        return {
          color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
          icon: XCircle
        };
      case SeatStatus.Available:
        return {
          color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
          icon: CheckCircle
        };
      case SeatStatus.Reserved:
        return {
          color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
          icon: Clock
        };
      case SeatStatus.Booked:
        return {
          color: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800',
          icon: XCircle
        };
      default:
        return {
          color: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800',
          icon: AlertCircle
        };
    }
  };

  const { color, icon: Icon } = getStatusConfig();
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-1' : size === 'lg' ? 'text-base px-4 py-2' : 'text-sm px-3 py-1.5';
  const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${color} ${sizeClass}`}>
      <Icon className={iconSize} />
      {status}
    </span>
  );
};
