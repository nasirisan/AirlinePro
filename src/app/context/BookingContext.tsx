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
  getAvailableDates: (from: string, to: string) => string[];
  selectSeat: (flightId: string, seatId: string, passenger: Passenger) => Reservation | null;
  processPayment: (reservationId: string, success: boolean) => Booking | null;
  cancelBooking: (bookingId: string) => boolean;
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
  // 5 FULLY BOOKED FLIGHTS (0 available) - For queue demo
  {
    id: 'FL001',
    flightNumber: 'AA 1234',
    from: 'New York (JFK)',
    to: 'Los Angeles (LAX)',
    date: '2026-02-15',
    departureTime: '08:00',
    arrivalTime: '11:30',
    totalSeats: 180,
    availableSeats: 0,
    reservedSeats: 0,
    bookedSeats: 180,
    price: { economy: 299, business: 899, firstClass: 1499 },
    status: FlightStatus.FullyBooked
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
    availableSeats: 0,
    reservedSeats: 0,
    bookedSeats: 200,
    price: { economy: 349, business: 999, firstClass: 1699 },
    status: FlightStatus.FullyBooked
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
    availableSeats: 0,
    reservedSeats: 0,
    bookedSeats: 175,
    price: { economy: 259, business: 779, firstClass: 1299 },
    status: FlightStatus.FullyBooked
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
    availableSeats: 0,
    reservedSeats: 0,
    bookedSeats: 160,
    price: { economy: 189, business: 489, firstClass: 899 },
    status: FlightStatus.FullyBooked
  },
  // 5 FLIGHTS WITH 1 SEAT LEFT (1 available) - For queue demo
  {
    id: 'FL006',
    flightNumber: 'NAS 2002',
    from: 'Accra (ACC)',
    to: 'London (LHR)',
    date: '2026-02-15',
    departureTime: '22:30',
    arrivalTime: '06:15',
    totalSeats: 260,
    availableSeats: 1,
    reservedSeats: 0,
    bookedSeats: 259,
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
    availableSeats: 1,
    reservedSeats: 0,
    bookedSeats: 279,
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
    availableSeats: 1,
    reservedSeats: 0,
    bookedSeats: 219,
    price: { economy: 499, business: 1299, firstClass: 2099 },
    status: FlightStatus.LimitedSeats
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
    availableSeats: 1,
    reservedSeats: 0,
    bookedSeats: 239,
    price: { economy: 399, business: 1099, firstClass: 1799 },
    status: FlightStatus.LimitedSeats
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
    availableSeats: 1,
    reservedSeats: 0,
    bookedSeats: 159,
    price: { economy: 189, business: 489, firstClass: 899 },
    status: FlightStatus.LimitedSeats
  },
  // Additional flights with normal availability
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
  },
  // Feb 18 flights
  {
    id: 'FL012',
    flightNumber: 'AA 1235',
    from: 'New York (JFK)',
    to: 'Los Angeles (LAX)',
    date: '2026-02-18',
    departureTime: '09:15',
    arrivalTime: '12:45',
    totalSeats: 180,
    availableSeats: 52,
    reservedSeats: 0,
    bookedSeats: 128,
    price: { economy: 299, business: 899, firstClass: 1499 },
    status: FlightStatus.SeatsAvailable
  },
  {
    id: 'FL013',
    flightNumber: 'UA 5679',
    from: 'San Francisco (SFO)',
    to: 'Miami (MIA)',
    date: '2026-02-18',
    departureTime: '15:30',
    arrivalTime: '23:45',
    totalSeats: 200,
    availableSeats: 15,
    reservedSeats: 0,
    bookedSeats: 185,
    price: { economy: 349, business: 999, firstClass: 1699 },
    status: FlightStatus.LimitedSeats
  },
  {
    id: 'FL014',
    flightNumber: 'NAS 2008',
    from: 'Accra (ACC)',
    to: 'Lagos (LOS)',
    date: '2026-02-18',
    departureTime: '07:00',
    arrivalTime: '09:45',
    totalSeats: 160,
    availableSeats: 73,
    reservedSeats: 0,
    bookedSeats: 87,
    price: { economy: 189, business: 489, firstClass: 899 },
    status: FlightStatus.SeatsAvailable
  },
  // Feb 19 flights
  {
    id: 'FL015',
    flightNumber: 'DL 9013',
    from: 'Chicago (ORD)',
    to: 'Seattle (SEA)',
    date: '2026-02-19',
    departureTime: '10:00',
    arrivalTime: '12:30',
    totalSeats: 150,
    availableSeats: 38,
    reservedSeats: 0,
    bookedSeats: 112,
    price: { economy: 279, business: 849, firstClass: 1399 },
    status: FlightStatus.SeatsAvailable
  },
  {
    id: 'FL016',
    flightNumber: 'NAS 2009',
    from: 'Accra (ACC)',
    to: 'London (LHR)',
    date: '2026-02-19',
    departureTime: '23:15',
    arrivalTime: '07:00',
    totalSeats: 260,
    availableSeats: 61,
    reservedSeats: 0,
    bookedSeats: 199,
    price: { economy: 549, business: 1399, firstClass: 2299 },
    status: FlightStatus.LimitedSeats
  },
  {
    id: 'FL017',
    flightNumber: 'NAS 2010',
    from: 'Lagos (LOS)',
    to: 'Accra (ACC)',
    date: '2026-02-19',
    departureTime: '10:00',
    arrivalTime: '11:45',
    totalSeats: 160,
    availableSeats: 38,
    reservedSeats: 0,
    bookedSeats: 122,
    price: { economy: 189, business: 489, firstClass: 899 },
    status: FlightStatus.SeatsAvailable
  },
  // Feb 20 flights
  {
    id: 'FL018',
    flightNumber: 'SW 3457',
    from: 'Boston (BOS)',
    to: 'Denver (DEN)',
    date: '2026-02-20',
    departureTime: '12:00',
    arrivalTime: '15:30',
    totalSeats: 175,
    availableSeats: 91,
    reservedSeats: 0,
    bookedSeats: 84,
    price: { economy: 259, business: 779, firstClass: 1299 },
    status: FlightStatus.SeatsAvailable
  },
  {
    id: 'FL019',
    flightNumber: 'NAS 2011',
    from: 'Accra (ACC)',
    to: 'New York (JFK)',
    date: '2026-02-20',
    departureTime: '21:30',
    arrivalTime: '08:00',
    totalSeats: 280,
    availableSeats: 71,
    reservedSeats: 0,
    bookedSeats: 209,
    price: { economy: 649, business: 1699, firstClass: 2799 },
    status: FlightStatus.LimitedSeats
  },
  {
    id: 'FL020',
    flightNumber: 'NAS 2012',
    from: 'Accra (ACC)',
    to: 'Paris (CDG)',
    date: '2026-02-20',
    departureTime: '22:30',
    arrivalTime: '07:30',
    totalSeats: 220,
    availableSeats: 104,
    reservedSeats: 0,
    bookedSeats: 116,
    price: { economy: 499, business: 1299, firstClass: 2099 },
    status: FlightStatus.SeatsAvailable
  },
  // Feb 21 flights
  {
    id: 'FL021',
    flightNumber: 'AA 1236',
    from: 'New York (JFK)',
    to: 'Los Angeles (LAX)',
    date: '2026-02-21',
    departureTime: '07:45',
    arrivalTime: '11:15',
    totalSeats: 180,
    availableSeats: 68,
    reservedSeats: 0,
    bookedSeats: 112,
    price: { economy: 299, business: 899, firstClass: 1499 },
    status: FlightStatus.SeatsAvailable
  },
  {
    id: 'FL022',
    flightNumber: 'NAS 2013',
    from: 'Accra (ACC)',
    to: 'Dubai (DXB)',
    date: '2026-02-21',
    departureTime: '15:00',
    arrivalTime: '23:30',
    totalSeats: 240,
    availableSeats: 24,
    reservedSeats: 0,
    bookedSeats: 216,
    price: { economy: 399, business: 1099, firstClass: 1799 },
    status: FlightStatus.LimitedSeats
  },
  {
    id: 'FL023',
    flightNumber: 'NAS 2014',
    from: 'Accra (ACC)',
    to: 'Johannesburg (JNB)',
    date: '2026-02-21',
    departureTime: '11:00',
    arrivalTime: '18:00',
    totalSeats: 200,
    availableSeats: 85,
    reservedSeats: 0,
    bookedSeats: 115,
    price: { economy: 349, business: 899, firstClass: 1499 },
    status: FlightStatus.SeatsAvailable
  }
];

const generateSeats = (flightId: string, totalSeats: number, bookedSeats: number): Seat[] => {
  const seats: Seat[] = [];
  const rows = Math.ceil(totalSeats / 6);
  
  for (let row = 1; row <= rows; row++) {
    const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
    for (let i = 0; i < seatLetters.length; i++) {
      if (seats.length >= totalSeats) break;
      
      let ticketClass = TicketClass.Economy;
      if (row <= 2) ticketClass = TicketClass.First;
      else if (row <= 8) ticketClass = TicketClass.Business;
      
      const seatNumber = `${row}${seatLetters[i]}`;
      const seatIndex = seats.length;
      // Mark seats as booked from the beginning, leaving only the required available seats at the end
      const isBooked = seatIndex < bookedSeats;
      
      seats.push({
        id: `${flightId}-${row}${seatLetters[i]}`,
        seatNumber: seatNumber,
        class: ticketClass,
        status: isBooked ? SeatStatus.Booked : SeatStatus.Available
      });
    }
  }
  
  return seats;
};

// localStorage helper functions
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Failed to load ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to save ${key} to localStorage:`, error);
  }
};

// IDs of flights that should always load from static initial data
const STATIC_FLIGHT_IDS = ['FL001', 'FL002', 'FL003', 'FL004', 'FL005', 'FL006', 'FL007', 'FL008', 'FL009', 'FL010'];

const loadFlightsFromStorage = (): Flight[] => {
  const storedFlights = loadFromStorage<Flight[]>('nas-flights', initialFlights);
  if (storedFlights.length === 0) return initialFlights;

  // Always reset static demo flights to their initial state
  const staticFlights = initialFlights.filter(f => STATIC_FLIGHT_IDS.includes(f.id));
  const dynamicFlights = storedFlights.filter(f => !STATIC_FLIGHT_IDS.includes(f.id));

  // Merge: static flights keep initial values, others keep stored values
  const merged = initialFlights.map(initial => {
    if (STATIC_FLIGHT_IDS.includes(initial.id)) {
      return initial; // Always use the hardcoded data
    }
    const stored = dynamicFlights.find(s => s.id === initial.id);
    return stored || initial;
  });

  return merged;
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flights, setFlights] = useState<Flight[]>(() => loadFlightsFromStorage());
  const [seats, setSeats] = useState<Record<string, Seat[]>>({});
  const [reservations, setReservations] = useState<Reservation[]>(() =>
    loadFromStorage('nas-reservations', [])
  );
  const [bookings, setBookings] = useState<Booking[]>(() =>
    loadFromStorage('nas-bookings', [])
  );
  const [waitingLists, setWaitingLists] = useState<Record<string, WaitingListEntry[]>>(() =>
    loadFromStorage('nas-waiting-lists', {})
  );
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>(() =>
    loadFromStorage('nas-system-logs', [])
  );
  const [currentPassenger, setCurrentPassenger] = useState<Passenger | null>(null);
  const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Initialize seats for all flights
  useEffect(() => {
    const initialSeats: Record<string, Seat[]> = {};
    initialFlights.forEach(flight => {
      initialSeats[flight.id] = generateSeats(flight.id, flight.totalSeats, flight.bookedSeats);
    });
    setSeats(initialSeats);
  }, []);

  useEffect(() => {
    if (flights.length === 0) {
      setFlights(initialFlights);
    }
  }, [flights.length]);
  // Save flights to localStorage
  useEffect(() => {
    saveToStorage('nas-flights', flights);
  }, [flights]);

  // Save reservations to localStorage
  useEffect(() => {
    saveToStorage('nas-reservations', reservations);
  }, [reservations]);

  // Save bookings to localStorage
  useEffect(() => {
    saveToStorage('nas-bookings', bookings);
  }, [bookings]);

  // Save waiting lists to localStorage
  useEffect(() => {
    saveToStorage('nas-waiting-lists', waitingLists);
  }, [waitingLists]);

  // Save system logs to localStorage
  useEffect(() => {
    saveToStorage('nas-system-logs', systemLogs);
  }, [systemLogs]);
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
          processWaitingList(reservation.flightId, 1);
        });
        
        return prev.filter(r => r.expiresAt > now || r.status !== BookingStatus.Reserved);
      });
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, [addSystemLog]);

  const processWaitingList = useCallback((flightId: string, seatsJustFreed: number = 0) => {
    const waitingList = waitingLists[flightId] || [];
    if (waitingList.length === 0) return;
    
    const flight = flights.find(f => f.id === flightId);
    if (!flight) return;
    // Account for seats freed in the same tick (React state not yet updated)
    const effectiveAvailable = flight.availableSeats + seatsJustFreed;
    if (effectiveAvailable === 0) return;
    
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
    if (nextEntry) {
      const notificationExpiresAt = Date.now() + NOTIFICATION_TIME;

      setWaitingLists(prev => {
        const remaining = (prev[flightId] || []).filter(entry => entry.id !== nextEntry.id);
        const reindexed = remaining.map((entry, index) => ({
          ...entry,
          position: index + 1
        }));

        return {
          ...prev,
          [flightId]: reindexed
        };
      });

      addSystemLog(
        'Waiting list dequeued',
        `${nextEntry.passenger.name} removed from waiting list due to available seat`,
        flightId,
        nextEntry.passenger.id
      );

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

  const getAvailableDates = useCallback((from: string, to: string): string[] => {
    const matchingFlights = flights.filter(flight => {
      const matchFrom = !from || flight.from.toLowerCase().includes(from.toLowerCase());
      const matchTo = !to || flight.to.toLowerCase().includes(to.toLowerCase());
      return matchFrom && matchTo;
    });
    
    // Get unique dates and sort them
    const dates = Array.from(new Set(matchingFlights.map(f => f.date))).sort();
    return dates;
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

  const cancelBooking = useCallback((bookingId: string): boolean => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking || booking.status !== BookingStatus.Confirmed) return false;

    // Update seat to available
    setSeats(prev => {
      const updatedSeats = [...(prev[booking.flightId] || [])];
      const seatIndex = updatedSeats.findIndex(s => s.id === booking.seatId);
      if (seatIndex !== -1) {
        updatedSeats[seatIndex] = {
          ...updatedSeats[seatIndex],
          status: SeatStatus.Available,
          reservedBy: undefined,
          reservedUntil: undefined
        };
      }
      return { ...prev, [booking.flightId]: updatedSeats };
    });

    // Update flight counts
    setFlights(prev => prev.map(f => {
      if (f.id === booking.flightId) {
        const newAvailable = f.availableSeats + 1;
        return {
          ...f,
          availableSeats: newAvailable,
          bookedSeats: Math.max(0, f.bookedSeats - 1),
          status: newAvailable > 10 ? FlightStatus.SeatsAvailable :
                  newAvailable > 0 ? FlightStatus.LimitedSeats :
                  FlightStatus.FullyBooked
        };
      }
      return f;
    }));

    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, status: BookingStatus.Cancelled } : b
    ));

    addSystemLog(
      'Booking cancelled',
      `${booking.passenger.name} cancelled booking for seat ${booking.seat.seatNumber}`,
      booking.flightId,
      booking.passengerId
    );

    // Notify next in waiting list if any
    processWaitingList(booking.flightId, 1);

    return true;
  }, [bookings, addSystemLog, processWaitingList]);

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
    getAvailableDates,
    selectSeat,
    processPayment,
    cancelBooking,
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