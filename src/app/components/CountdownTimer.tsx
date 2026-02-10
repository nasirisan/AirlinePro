import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  expiresAt: number;
  onExpire?: () => void;
  showWarning?: boolean;
  warningThreshold?: number; // seconds
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  expiresAt,
  onExpire,
  showWarning = true,
  warningThreshold = 60
}) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, expiresAt - now);
      setTimeLeft(remaining);

      if (remaining === 0 && onExpire) {
        onExpire();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const isWarning = showWarning && timeLeft < warningThreshold * 1000 && timeLeft > 0;
  const isExpired = timeLeft === 0;

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        isExpired
          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
          : isWarning
          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 animate-pulse'
          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
      }`}
    >
      <Clock className="w-4 h-4" />
      <span>
        {isExpired ? (
          'Time Expired'
        ) : (
          <>
            {minutes}:{seconds.toString().padStart(2, '0')} remaining
          </>
        )}
      </span>
    </div>
  );
};
