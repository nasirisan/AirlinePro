import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Queue, PriorityQueue } from '../utils/queue';
import {
  Flight,
  Seat,
  Passenger,
  Reservation,
  Booking,
  WaitingListEntry,
  SystemLog,
  TicketClass,
  PassengerType,
  BookingStatus,
  SeatStatus,
  FlightStatus
} from '../types';

interface BookingContextType {
  flights: Flight[];
  seats: Record<string, Seat[]>;
  reservations: Reservation[];
  bookings: Booking[];
  waitingLists: Record<string, WaitingListEntry[]>;
  systemLogs: SystemLog[];
  currentPassenger: Passenger | null;
  currentReservation: Reservation | null;
  searchFlights: (from: string, to: string, date: string) => Flight[];
  selectSeat: (flightId: string, seatId: string, passenger: Passenger) => Reservation | null;
  processPayment: (reservationId: string, success: boolean) => Booking | null;
  joinWaitingList: (flightId: string, passenger: Passenger, ticketClass: TicketClass) => WaitingListEntry | null;
  getWaitingListPosition: (entryId: string, flightId: string) => number;
  getFlightById: (flightId: string) => Flight | undefined;
  getReservationById: (reservationId: string) => Reservation | undefined;
  setCurrentPassenger: (passenger: Passenger | null) => void;
  clearCurrentReservation: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const RESERVATION_TIME = 10 * 60 * 1000; // 10 minutes in milliseconds
const NOTIFICATION_TIME = 5 * 60 * 1000; // 5 minutes to respond to notification

// Mock data
const initialFlights: Flight[] = [
  {
    id: 'FL001',
    flightNumber: 'AA 1234',
    from: 'New York (JFK)',
    to: 'Los Angeles (LAX)',
    date: '2026-02-15',
    departureTime: '08:00',
    arrivalTime: '11:30',
    totalSeats: 180,
    availableSeats: 45,
    reservedSeats: 0,
    bookedSeats: 135,
    price: { economy: 299, business: 899, firstClass: 1499 },
    status: FlightStatus.SeatsAvailable
  },
  {
    id: 'FL002',
    flightNumber: 'UA 5678',
    from: 'San Francisco (SFO)',
    to: 'Miami (MIA)',
    date: '2026-02-15',
    departureTime: '14:00',
    arrivalTime: '22:15',
    totalSeats: 200,
    availableSeats: 8,
    reservedSeats: 0,
    bookedSeats: 192,
    price: { economy: 349, business: 999, firstClass: 1699 },
    status: FlightStatus.LimitedSeats
  },
  {
    id: 'FL003',
    flightNumber: 'DL 9012',
    from: 'Chicago (ORD)',
    to: 'Seattle (SEA)',
    date: '2026-02-16',
    departureTime: '09:30',
    arrivalTime: '12:00',
    totalSeats: 150,
    availableSeats: 0,
    reservedSeats: 0,
    bookedSeats: 150,
    price: { economy: 279, business: 849, firstClass: 1399 },
    status: FlightStatus.FullyBooked
  },
  {
    id: 'FL004',
    flightNumber: 'SW 3456',
    from: 'Boston (BOS)',
    to: 'Denver (DEN)',
    date: '2026-02-17',
    departureTime: '11:00',
    arrivalTime: '14:30',
    totalSeats: 175,
    availableSeats: 82,
    reservedSeats: 0,
    bookedSeats: 93,
    price: { economy: 259, business: 779, firstClass: 1299 },
    status: FlightStatus.SeatsAvailable
  },
  {
    id: 'FL005',
    flightNumber: 'NAS 2001',
    from: 'Accra (ACC)',
    to: 'Lagos (LOS)',
    date: '2026-02-15',
    departureTime: '06:00',
    arrivalTime: '08:45',
    totalSeats: 160,
    availableSeats: 68,
    reservedSeats: 0,
    bookedSeats: 92,
    price: { economy: 189, business: 489, firstClass: 899 },
    status: FlightStatus.SeatsAvailable
  },
  {
    id: 'FL006',
    flightNumber: 'NAS 2002',
    from: 'Accra (ACC)',
    to: 'London (LHR)',
    date: '2026-02-15',
    departureTime: '22:30',
    arrivalTime: '06:15',
    totalSeats: 260,
    availableSeats: 45,
    reservedSeats: 0,
    bookedSeats: 215,
    price: { economy: 549, business: 1399, firstClass: 2299 },
    status: FlightStatus.LimitedSeats
  },
  {
    id: 'FL007',
    flightNumber: 'NAS 2003',
    from: 'Accra (ACC)',
    to: 'New York (JFK)',
    date: '2026-02-16',
    departureTime: '21:00',
    arrivalTime: '07:30',
    totalSeats: 280,
    availableSeats: 52,
    reservedSeats: 0,
    bookedSeats: 228,
    price: { economy: 649, business: 1699, firstClass: 2799 },
    status: FlightStatus.LimitedSeats
  },
  {
    id: 'FL008',
    flightNumber: 'NAS 2004',
    from: 'Accra (ACC)',
    to: 'Paris (CDG)',
    date: '2026-02-17',
    departureTime: '23:00',
    arrivalTime: '06:00',
    totalSeats: 220,
    availableSeats: 89,
    reservedSeats: 0,
    bookedSeats: 131,
    price: { economy: 499, business: 1299, firstClass: 2099 },
    status: FlightStatus.SeatsAvailable
  },
  {
    id: 'FL009',
    flightNumber: 'NAS 2005',
    from: 'Accra (ACC)',
    to: 'Dubai (DXB)',
    date: '2026-02-18',
    departureTime: '14:00',
    arrivalTime: '22:30',
    totalSeats: 240,
    availableSeats: 0,
    reservedSeats: 0,
    bookedSeats: 240,
    price: { economy: 399, business: 1099, firstClass: 1799 },
    status: FlightStatus.FullyBooked
  },
  {
    id: 'FL010',
    flightNumber: 'NAS 2006',
    from: 'Lagos (LOS)',
    to: 'Accra (ACC)',
    date: '2026-02-15',
    departureTime: '09:30',
    arrivalTime: '11:15',
    totalSeats: 160,
    availableSeats: 42,
    reservedSeats: 0,
    bookedSeats: 118,
    price: { economy: 189, business: 489, firstClass: 899 },
    status: FlightStatus.SeatsAvailable
  },
  {
    id: 'FL011',
    flightNumber: 'NAS 2007',
    from: 'Accra (ACC)',
    to: 'Johannesburg (JNB)',
    date: '2026-02-16',
    departureTime: '10:00',
    arrivalTime: '17:00',
    totalSeats: 200,
    availableSeats: 67,
    reservedSeats: 0,
    bookedSeats: 133,
    price: { economy: 349, business: 899, firstClass: 1499 },
    status: FlightStatus.SeatsAvailable
  }
];

const generateSeats = (flightId: string, totalSeats: number): Seat[] => {
  const seats: Seat[] = [];
  const rows = Math.ceil(totalSeats / 6);
  
  for (let row = 1; row <= rows; row++) {
    const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
    for (let i = 0; i < seatLetters.length; i++) {
      if (seats.length >= totalSeats) break;
      
      let ticketClass = TicketClass.Economy;
      if (row <= 2) ticketClass = TicketClass.First;
      else if (row <= 8) ticketClass = TicketClass.Business;
      
      seats.push({
        id: `${flightId}-${row}${seatLetters[i]}`,
        seatNumber: `${row}${seatLetters[i]}`,
        class: ticketClass,
        status: SeatStatus.Available
      });
    }
  }
  
  return seats;
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flights, setFlights] = useState<Flight[]>(initialFlights);
  const [seats, setSeats] = useState<Record<string, Seat[]>>({});
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [waitingLists, setWaitingLists] = useState<Record<string, WaitingListEntry[]>>({});
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [currentPassenger, setCurrentPassenger] = useState<Passenger | null>(null);
  const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Initialize seats for all flights
  useEffect(() => {
    const initialSeats: Record<string, Seat[]> = {};
    initialFlights.forEach(flight => {
      initialSeats[flight.id] = generateSeats(flight.id, flight.totalSeats);
    });
    setSeats(initialSeats);
  }, []);

  const addSystemLog = useCallback((action: string, details: string, flightId?: string, passengerId?: string) => {
    const log: SystemLog = {
      id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      action,
      details,
      flightId,
      passengerId
    };
    setSystemLogs(prev => [log, ...prev].slice(0, 100)); // Keep last 100 logs
  }, []);

  // Check for expired reservations
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      
      setReservations(prev => {
        const expired = prev.filter(r => r.expiresAt <= now && r.status === BookingStatus.Reserved);
        
        expired.forEach(reservation => {
          // Release the seat
          setSeats(prevSeats => {
            const flightSeats = [...(prevSeats[reservation.flightId] || [])];
            const seatIndex = flightSeats.findIndex(s => s.id === reservation.seatId);
            if (seatIndex !== -1) {
              flightSeats[seatIndex] = {
                ...flightSeats[seatIndex],
                status: SeatStatus.Available,
                reservedBy: undefined,
                reservedUntil: undefined
              };
            }
            return { ...prevSeats, [reservation.flightId]: flightSeats };
          });
          
          // Update flight
          setFlights(prevFlights => {
            return prevFlights.map(f => {
              if (f.id === reservation.flightId) {
                const newAvailable = f.availableSeats + 1;
                const newReserved = Math.max(0, f.reservedSeats - 1);
                return {
                  ...f,
                  availableSeats: newAvailable,
                  reservedSeats: newReserved,
                  status: newAvailable > 10 ? FlightStatus.SeatsAvailable : 
                          newAvailable > 0 ? FlightStatus.LimitedSeats : 
                          FlightStatus.FullyBooked
                };
              }
              return f;
            });
          });
          
          addSystemLog(
            'Payment timeout',
            `Seat ${reservation.seat.seatNumber} released due to payment timeout`,
            reservation.flightId,
            reservation.passengerId
          );
          
          // Check waiting list
          processWaitingList(reservation.flightId);
        });
        
        return prev.filter(r => r.expiresAt > now || r.status !== BookingStatus.Reserved);
      });
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, [addSystemLog]);

  const processWaitingList = useCallback((flightId: string) => {
    const waitingList = waitingLists[flightId] || [];
    if (waitingList.length === 0) return;
    
    const flight = flights.find(f => f.id === flightId);
    if (!flight || flight.availableSeats === 0) return;
    
    // Sort by priority (First Class > Business > Economy) and then by join time
    const priorityQueue = new PriorityQueue<WaitingListEntry>();
    waitingList.forEach(entry => {
      let priority = 0;
      if (entry.ticketClass === TicketClass.First) priority = 3;
      else if (entry.ticketClass === TicketClass.Business) priority = 2;
      else priority = 1;
      
      if (entry.passenger.type === PassengerType.VIP) priority += 10;
      else if (entry.passenger.type === PassengerType.FrequentFlyer) priority += 5;
      
      priorityQueue.enqueue(entry, priority);
    });
    
    // Notify the first person in queue
    const nextEntry = priorityQueue.dequeue();
    if (nextEntry && !nextEntry.notified) {
      const notificationExpiresAt = Date.now() + NOTIFICATION_TIME;
      
      setWaitingLists(prev => ({
        ...prev,
        [flightId]: (prev[flightId] || []).map(entry =>
          entry.id === nextEntry.id
            ? { ...entry, notified: true, notifiedAt: Date.now(), notificationExpiresAt }
            : entry
        )
      }));
      
      addSystemLog(
        'Passenger notified',
        `${nextEntry.passenger.name} notified of available seat`,
        flightId,
        nextEntry.passenger.id
      );
    }
  }, [waitingLists, flights, addSystemLog]);

  const searchFlights = useCallback((from: string, to: string, date: string): Flight[] => {
    return flights.filter(flight => {
      const matchFrom = !from || flight.from.toLowerCase().includes(from.toLowerCase());
      const matchTo = !to || flight.to.toLowerCase().includes(to.toLowerCase());
      const matchDate = !date || flight.date === date;
      return matchFrom && matchTo && matchDate;
    });
  }, [flights]);

  const selectSeat = useCallback((flightId: string, seatId: string, passenger: Passenger): Reservation | null => {
    const flight = flights.find(f => f.id === flightId);
    const flightSeats = seats[flightId] || [];
    const seat = flightSeats.find(s => s.id === seatId);
    
    if (!flight || !seat || seat.status !== SeatStatus.Available) {
      return null;
    }
    
    const now = Date.now();
    const expiresAt = now + RESERVATION_TIME;
    
    const reservation: Reservation = {
      id: `RES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      flightId,
      flight,
      passengerId: passenger.id,
      passenger,
      seatId,
      seat: { ...seat },
      reservedAt: now,
      expiresAt,
      status: BookingStatus.Reserved
    };
    
    // Update seat status
    setSeats(prev => {
      const updatedSeats = [...(prev[flightId] || [])];
      const seatIndex = updatedSeats.findIndex(s => s.id === seatId);
      if (seatIndex !== -1) {
        updatedSeats[seatIndex] = {
          ...updatedSeats[seatIndex],
          status: SeatStatus.Reserved,
          reservedBy: passenger.id,
          reservedUntil: expiresAt
        };
      }
      return { ...prev, [flightId]: updatedSeats };
    });
    
    // Update flight
    setFlights(prev => prev.map(f => {
      if (f.id === flightId) {
        const newAvailable = Math.max(0, f.availableSeats - 1);
        const newReserved = f.reservedSeats + 1;
        return {
          ...f,
          availableSeats: newAvailable,
          reservedSeats: newReserved,
          status: newAvailable > 10 ? FlightStatus.SeatsAvailable :
                  newAvailable > 0 ? FlightStatus.LimitedSeats :
                  FlightStatus.FullyBooked
        };
      }
      return f;
    }));
    
    setReservations(prev => [...prev, reservation]);
    setCurrentReservation(reservation);
    
    addSystemLog(
      'Seat reserved',
      `${passenger.name} reserved seat ${seat.seatNumber} on flight ${flight.flightNumber}`,
      flightId,
      passenger.id
    );
    
    return reservation;
  }, [flights, seats, addSystemLog]);

  const processPayment = useCallback((reservationId: string, success: boolean): Booking | null => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (!reservation) return null;
    
    if (success) {
      const flight = flights.find(f => f.id === reservation.flightId);
      if (!flight) return null;
      
      const booking: Booking = {
        id: `BKG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        bookingReference: `${flight.flightNumber.replace(' ', '')}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        flightId: reservation.flightId,
        flight,
        passengerId: reservation.passengerId,
        passenger: reservation.passenger,
        seatId: reservation.seatId,
        seat: reservation.seat,
        ticketClass: reservation.seat.class,
        price: flight.price[reservation.seat.class === TicketClass.First ? 'firstClass' : 
                            reservation.seat.class === TicketClass.Business ? 'business' : 'economy'],
        bookedAt: Date.now(),
        status: BookingStatus.Confirmed
      };
      
      // Update seat to booked
      setSeats(prev => {
        const updatedSeats = [...(prev[reservation.flightId] || [])];
        const seatIndex = updatedSeats.findIndex(s => s.id === reservation.seatId);
        if (seatIndex !== -1) {
          updatedSeats[seatIndex] = {
            ...updatedSeats[seatIndex],
            status: SeatStatus.Booked,
            reservedBy: undefined,
            reservedUntil: undefined
          };
        }
        return { ...prev, [reservation.flightId]: updatedSeats };
      });
      
      // Update flight
      setFlights(prev => prev.map(f => {
        if (f.id === reservation.flightId) {
          return {
            ...f,
            reservedSeats: Math.max(0, f.reservedSeats - 1),
            bookedSeats: f.bookedSeats + 1
          };
        }
        return f;
      }));
      
      setBookings(prev => [...prev, booking]);
      setReservations(prev => prev.filter(r => r.id !== reservationId));
      setCurrentReservation(null);
      
      addSystemLog(
        'Booking confirmed',
        `${reservation.passenger.name} confirmed booking for seat ${reservation.seat.seatNumber}`,
        reservation.flightId,
        reservation.passengerId
      );
      
      return booking;
    } else {
      // Payment failed - release seat
      setSeats(prev => {
        const updatedSeats = [...(prev[reservation.flightId] || [])];
        const seatIndex = updatedSeats.findIndex(s => s.id === reservation.seatId);
        if (seatIndex !== -1) {
          updatedSeats[seatIndex] = {
            ...updatedSeats[seatIndex],
            status: SeatStatus.Available,
            reservedBy: undefined,
            reservedUntil: undefined
          };
        }
        return { ...prev, [reservation.flightId]: updatedSeats };
      });
      
      setFlights(prev => prev.map(f => {
        if (f.id === reservation.flightId) {
          const newAvailable = f.availableSeats + 1;
          return {
            ...f,
            availableSeats: newAvailable,
            reservedSeats: Math.max(0, f.reservedSeats - 1),
            status: newAvailable > 10 ? FlightStatus.SeatsAvailable :
                    newAvailable > 0 ? FlightStatus.LimitedSeats :
                    FlightStatus.FullyBooked
          };
        }
        return f;
      }));
      
      setReservations(prev => prev.filter(r => r.id !== reservationId));
      setCurrentReservation(null);
      
      addSystemLog(
        'Payment failed',
        `Payment failed for ${reservation.passenger.name}, seat ${reservation.seat.seatNumber} released`,
        reservation.flightId,
        reservation.passengerId
      );
      
      processWaitingList(reservation.flightId);
      
      return null;
    }
  }, [reservations, flights, addSystemLog, processWaitingList]);

  const joinWaitingList = useCallback((flightId: string, passenger: Passenger, ticketClass: TicketClass): WaitingListEntry | null => {
    const flight = flights.find(f => f.id === flightId);
    if (!flight) return null;
    
    const currentList = waitingLists[flightId] || [];
    const position = currentList.length + 1;
    
    const entry: WaitingListEntry = {
      id: `WL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      flightId,
      passenger,
      ticketClass,
      joinedAt: Date.now(),
      position
    };
    
    setWaitingLists(prev => ({
      ...prev,
      [flightId]: [...(prev[flightId] || []), entry]
    }));
    
    addSystemLog(
      'Joined waiting list',
      `${passenger.name} joined waiting list at position ${position}`,
      flightId,
      passenger.id
    );
    
    return entry;
  }, [flights, waitingLists, addSystemLog]);

  const getWaitingListPosition = useCallback((entryId: string, flightId: string): number => {
    const list = waitingLists[flightId] || [];
    const index = list.findIndex(e => e.id === entryId);
    return index !== -1 ? index + 1 : -1;
  }, [waitingLists]);

  const getFlightById = useCallback((flightId: string) => {
    return flights.find(f => f.id === flightId);
  }, [flights]);

  const getReservationById = useCallback((reservationId: string) => {
    return reservations.find(r => r.id === reservationId);
  }, [reservations]);

  const clearCurrentReservation = useCallback(() => {
    setCurrentReservation(null);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const value: BookingContextType = {
    flights,
    seats,
    reservations,
    bookings,
    waitingLists,
    systemLogs,
    currentPassenger,
    currentReservation,
    searchFlights,
    selectSeat,
    processPayment,
    joinWaitingList,
    getWaitingListPosition,
    getFlightById,
    getReservationById,
    setCurrentPassenger,
    clearCurrentReservation,
    theme,
    toggleTheme
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};