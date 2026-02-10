import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { SeatStatus, TicketClass } from '../types';
import { ArrowLeft, Info } from 'lucide-react';
import { motion } from 'motion/react';

export const SeatSelection: React.FC = () => {
  const { flightId } = useParams<{ flightId: string }>();
  const navigate = useNavigate();
  const { getFlightById, seats, selectSeat, currentPassenger, theme } = useBooking();
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  
  const flight = flightId ? getFlightById(flightId) : undefined;
  const flightSeats = flightId ? seats[flightId] || [] : [];

  if (!flight || !currentPassenger) {
    return <div>Loading...</div>;
  }

  const handleSeatSelect = (seatId: string, status: SeatStatus) => {
    if (status === SeatStatus.Available) {
      setSelectedSeatId(seatId);
    }
  };

  const handleContinue = () => {
    if (selectedSeatId) {
      const reservation = selectSeat(flight.id, selectedSeatId, currentPassenger);
      if (reservation) {
        navigate(`/reservation/${reservation.id}/payment`);
      }
    }
  };

  const getSeatColor = (seat: { status: SeatStatus; class: TicketClass }, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-blue-600 text-white border-blue-700';
    }
    
    switch (seat.status) {
      case SeatStatus.Available:
        if (seat.class === TicketClass.First) return 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-300 border-purple-300 dark:border-purple-700 hover:bg-purple-200 dark:hover:bg-purple-800/50 cursor-pointer';
        if (seat.class === TicketClass.Business) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300 border-blue-300 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-800/50 cursor-pointer';
        return 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-300 border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-800/50 cursor-pointer';
      case SeatStatus.Reserved:
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700 cursor-not-allowed';
      case SeatStatus.Booked:
        return 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-500 border-gray-300 dark:border-gray-600 cursor-not-allowed';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-300 dark:border-gray-700';
    }
  };

  // Group seats by row
  const seatsByRow: Record<string, typeof flightSeats> = {};
  flightSeats.forEach(seat => {
    const row = seat.seatNumber.replace(/[A-Z]/g, '');
    if (!seatsByRow[row]) {
      seatsByRow[row] = [];
    }
    seatsByRow[row].push(seat);
  });

  const selectedSeat = selectedSeatId ? flightSeats.find(s => s.id === selectedSeatId) : null;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Search
          </button>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Select Your Seat
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Flight {flight.flightNumber}: {flight.from} → {flight.to}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seat Map */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900 dark:text-blue-300">
                    <p className="font-medium mb-1">Seat Legend</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded border-2 bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700"></div>
                        <span>Economy (Available)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded border-2 bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700"></div>
                        <span>Business (Available)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded border-2 bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700"></div>
                        <span>First Class (Available)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded border-2 bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"></div>
                        <span>Unavailable</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {Object.keys(seatsByRow)
                  .sort((a, b) => parseInt(a) - parseInt(b))
                  .map((row) => {
                    const rowSeats = seatsByRow[row].sort((a, b) => 
                      a.seatNumber.localeCompare(b.seatNumber)
                    );
                    
                    return (
                      <div key={row} className="flex items-center gap-2">
                        <div className="w-8 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                          {row}
                        </div>
                        <div className="flex gap-2 flex-1 justify-center">
                          {rowSeats.slice(0, 3).map(seat => (
                            <motion.button
                              key={seat.id}
                              whileHover={{ scale: seat.status === SeatStatus.Available ? 1.05 : 1 }}
                              whileTap={{ scale: seat.status === SeatStatus.Available ? 0.95 : 1 }}
                              onClick={() => handleSeatSelect(seat.id, seat.status)}
                              disabled={seat.status !== SeatStatus.Available}
                              className={`w-10 h-10 rounded border-2 text-xs font-medium transition-all ${getSeatColor(
                                seat,
                                seat.id === selectedSeatId
                              )}`}
                            >
                              {seat.seatNumber.slice(-1)}
                            </motion.button>
                          ))}
                          <div className="w-6"></div>
                          {rowSeats.slice(3).map(seat => (
                            <motion.button
                              key={seat.id}
                              whileHover={{ scale: seat.status === SeatStatus.Available ? 1.05 : 1 }}
                              whileTap={{ scale: seat.status === SeatStatus.Available ? 0.95 : 1 }}
                              onClick={() => handleSeatSelect(seat.id, seat.status)}
                              disabled={seat.status !== SeatStatus.Available}
                              className={`w-10 h-10 rounded border-2 text-xs font-medium transition-all ${getSeatColor(
                                seat,
                                seat.id === selectedSeatId
                              )}`}
                            >
                              {seat.seatNumber.slice(-1)}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Selection Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Booking Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Passenger</p>
                  <p className="font-medium text-gray-900 dark:text-white">{currentPassenger.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Flight</p>
                  <p className="font-medium text-gray-900 dark:text-white">{flight.flightNumber}</p>
                </div>
                
                {selectedSeat ? (
                  <>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Selected Seat</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedSeat.seatNumber}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Class</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedSeat.class}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${selectedSeat.class === TicketClass.First ? flight.price.firstClass :
                           selectedSeat.class === TicketClass.Business ? flight.price.business :
                           flight.price.economy}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No seat selected</p>
                  </div>
                )}
              </div>

              {selectedSeat && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium">
                    Seat will be temporarily reserved for 10 minutes
                  </p>
                </div>
              )}

              <button
                onClick={handleContinue}
                disabled={!selectedSeatId}
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  selectedSeatId
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
