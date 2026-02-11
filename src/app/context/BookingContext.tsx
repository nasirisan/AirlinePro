/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                                                                           ║
 * ║                         BOOKING CONTEXT PROVIDER                          ║
 * ║                                                                           ║
 * ║  This is the BRAIN of the entire booking system. It manages all data     ║
 * ║  and business logic for flights, seats, bookings, reservations, and      ║
 * ║  waiting lists.                                                           ║
 * ║                                                                           ║
 * ║  Think of this as the central database and logic controller that all     ║
 * ║  components use to access and modify booking information.                ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

/*
 * ============================================================================
 * IMPORTS - REACT LIBRARY
 * ============================================================================
 * These are from React - the framework we use to build the user interface
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// createContext - Creates a way to share data across all components
// useContext - Allows components to read the shared data
// useState - Stores data that can change (like number of available seats)
// useEffect - Runs code when something changes (like saving to storage)
// useCallback - Creates a function that doesn't change unless needed (performance)

/*
 * ============================================================================
 * IMPORTS - QUEUE DATA STRUCTURES
 * ============================================================================
 * These are our custom data structures for managing waiting lists
 */
import { Queue, PriorityQueue } from '../utils/queue';
// Queue - Simple line (first person in = first person out)
// PriorityQueue - Smart line (VIP customers go first, even if they joined later)

/*
 * ============================================================================
 * IMPORTS - TYPE DEFINITIONS
 * ============================================================================
 * These define the "shape" of our data - what properties each object has
 */
import {
  Flight,           // Flight information (flight number, from, to, date, price, etc.)
  Seat,             // Individual seat (seat number, class, status, position on plane)
  Passenger,        // Person booking (name, email, passport, type: VIP/Normal/FrequentFlyer)
  Reservation,      // Temporary seat hold (expires after 10 minutes if not paid)
  Booking,          // Confirmed booking (paid and confirmed)
  WaitingListEntry, // Person waiting for a seat when flight is full
  SystemLog,        // Log entry for admin monitoring (who did what, when)
  TicketClass,      // Economy, Business, or First Class
  PassengerType,    // VIP, Frequent Flyer, or Normal
  BookingStatus,    // Confirmed, Cancelled, etc.
  SeatStatus,       // Available, Reserved, Booked
  FlightStatus      // On Time, Delayed, Fully Booked, etc.
} from '../types';

/**
 * ============================================================================
 * BOOKING CONTEXT TYPE DEFINITION
 * ============================================================================
 * This interface defines what data and functions are available to all
 * components that use the BookingContext
 * 
 * Think of this as the "menu" - it lists everything you can access or do
 * ============================================================================
 */
interface BookingContextType {
  // ---------------------------------------------------------------------------
  // DATA (STATE) - Information stored in memory
  // ---------------------------------------------------------------------------
  flights: Flight[];                            // All available flights in the system
  seats: Record<string, Seat[]>;               // All seats for each flight (organized by flightId)
  reservations: Reservation[];                  // Temporary seat holds (10-minute timer)
  bookings: Booking[];                          // Confirmed paid bookings
  waitingLists: Record<string, WaitingListEntry[]>; // People waiting for seats (organized by flightId)
  systemLogs: SystemLog[];                      // Activity logs for admin dashboard
  currentPassenger: Passenger | null;           // Currently logged-in passenger (or null if none)
  currentReservation: Reservation | null;       // Current passenger's active reservation (if any)
  theme: 'light' | 'dark';                     // UI theme (light mode or dark mode)
  
  // ---------------------------------------------------------------------------
  // FUNCTIONS - Actions that can be performed
  // ---------------------------------------------------------------------------
  searchFlights: (from: string, to: string, date: string) => Flight[];  // Find flights matching criteria
  getAvailableDates: (from: string, to: string) => string[];           // Get dates with available flights
  selectSeat: (flightId: string, seatId: string, passenger: Passenger) => Reservation | null; // Reserve a seat (starts 10-min timer)
  processPayment: (reservationId: string, success: boolean) => Booking | null; // Complete payment or fail
  cancelBooking: (bookingId: string) => boolean;                       // Cancel a confirmed booking
  joinWaitingList: (flightId: string, passenger: Passenger, ticketClass: TicketClass) => WaitingListEntry | null; // Join queue when flight is full
  confirmWaitingListBooking: (entryId: string, flightId: string) => Booking | null; // Accept notification and book
  getWaitingListPosition: (entryId: string, flightId: string) => number; // Get your position in the queue
  getFlightById: (flightId: string) => Flight | undefined;            // Look up a specific flight
  getReservationById: (reservationId: string) => Reservation | undefined; // Look up a specific reservation
  getPendingNotificationsForCurrentPassenger: () => Array<WaitingListEntry & { flightId: string }>; // Get active notifications
  setCurrentPassenger: (passenger: Passenger | null) => void;         // Log in or log out a passenger
  clearCurrentReservation: () => void;                                 // Clear active reservation
  toggleTheme: () => void;                                            // Switch between light/dark mode
  resetDemoData: () => void;                                          // Reset demo data to initial state
}

/**
 * ============================================================================
 * CREATE THE CONTEXT
 * ============================================================================
 * This creates a "shared storage space" that all components can access
 * Initially undefined - will be filled with actual data by the Provider below
 */
const BookingContext = createContext<BookingContextType | undefined>(undefined);

/**
 * ============================================================================
 * TIMER CONSTANTS
 * ============================================================================
 * These control how long passengers have to complete actions
 */
const RESERVATION_TIME = 10 * 60 * 1000; // 10 minutes in milliseconds (600,000 ms)
                                         // Passenger has 10 minutes to pay after selecting a seat
                                         
const NOTIFICATION_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds (300,000 ms)
                                         // Passenger has 5 minutes to accept a waiting list notification

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                                                                           ║
 * ║                           MOCK FLIGHT DATA                                ║
 * ║                                                                           ║
 * ║  This is our "fake database" of flights used for demonstration          ║
 * ║                                                                           ║
 * ║  In a real application, this data would come from a backend server       ║
 * ║  and a real database. For this project, we hardcode the data here.       ║
 * ║                                                                           ║
 * ║  We have 3 categories of flights to demonstrate different scenarios:     ║
 * ║                                                                           ║
 * ║  1. FULLY BOOKED (0 seats left) - To demonstrate waiting list feature   ║
 * ║  2. LIMITED SEATS (1 seat left) - To demonstrate priority booking       ║
 * ║  3. SEATS AVAILABLE (many seats) - Normal booking flow                  ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */
const initialFlights: Flight[] = [
  /**
   * ╔═══════════════════════════════════════════════════════════════════════╗
   * ║ CATEGORY 1: FULLY BOOKED FLIGHTS (5 flights)                         ║
   * ║ Purpose: Demonstrate the waiting list / queue system                 ║
   * ║ Status: availableSeats = 0, status = FullyBooked                     ║
   * ╚═══════════════════════════════════════════════════════════════════════╝
   */
  {
    id: 'FL001',                                 // Unique identifier for this flight
    flightNumber: 'AA 1234',                     // Display name (Airline code + number)
    from: 'New York (JFK)',                      // Departure airport
    to: 'Los Angeles (LAX)',                     // Arrival airport
    date: '2026-02-15',                          // Flight date (YYYY-MM-DD format)
    departureTime: '08:00',                      // Takeoff time (24-hour format)
    arrivalTime: '11:30',                        // Landing time (24-hour format)
    totalSeats: 180,                             // Total capacity of the plane
    availableSeats: 0,                           // ❌ NO SEATS LEFT - Flight is full!
    reservedSeats: 0,                            // Seats currently being held (10-min timer active)
    bookedSeats: 180,                            // Seats that have been paid for
    price: { economy: 299, business: 899, firstClass: 1499 }, // Prices for each class
    status: FlightStatus.FullyBooked             // Status shown to users
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
    availableSeats: 0,                           // ❌ FULLY BOOKED
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
    availableSeats: 0,                           // ❌ FULLY BOOKED
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
    availableSeats: 0,                           // ❌ FULLY BOOKED
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
    availableSeats: 0,                           // ❌ FULLY BOOKED
    reservedSeats: 0,
    bookedSeats: 160,
    price: { economy: 189, business: 489, firstClass: 899 },
    status: FlightStatus.FullyBooked
  },
  
  /**
   * ╔═══════════════════════════════════════════════════════════════════════╗
   * ║ CATEGORY 2: LIMITED SEATS FLIGHTS (5 flights)                        ║
   * ║ Purpose: Demonstrate urgency and competition for last seats          ║
   * ║ Status: availableSeats = 1, status = LimitedSeats                   ║
   * ╚═══════════════════════════════════════════════════════════════════════╝
   */
  {
    id: 'FL006',
    flightNumber: 'NAS 2002',
    from: 'Accra (ACC)',
    to: 'London (LHR)',
    date: '2026-02-15',
    departureTime: '22:30',
    arrivalTime: '06:15',
    totalSeats: 260,
    availableSeats: 1,                           // ⚠️ ONLY 1 SEAT LEFT - Act fast!
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
    availableSeats: 1,                           // ⚠️ ONLY 1 SEAT LEFT
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
    availableSeats: 1,                           // ⚠️ ONLY 1 SEAT LEFT
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
    availableSeats: 1,                           // ⚠️ ONLY 1 SEAT LEFT
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
    availableSeats: 1,                           // ⚠️ ONLY 1 SEAT LEFT
    reservedSeats: 0,
    bookedSeats: 159,
    price: { economy: 189, business: 489, firstClass: 899 },
    status: FlightStatus.LimitedSeats
  },
  
  /**
   * ╔═══════════════════════════════════════════════════════════════════════╗
   * ║ CATEGORY 3: SEATS AVAILABLE FLIGHTS                                  ║
   * ║ Purpose: Normal booking flow with plenty of options                  ║
   * ║ Status: availableSeats > 1, status = SeatsAvailable                  ║
   * ╚═══════════════════════════════════════════════════════════════════════╝
   */
  {
    id: 'FL011',
    flightNumber: 'NAS 2007',
    from: 'Accra (ACC)',
    to: 'Johannesburg (JNB)',
    date: '2026-02-16',
    departureTime: '10:00',
    arrivalTime: '17:00',
    totalSeats: 200,
    availableSeats: 67,                          // ✅ PLENTY OF SEATS - Book anytime!
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

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                                                                           ║
 * ║                     SEAT GENERATION FUNCTION                              ║
 * ║                                                                           ║
 * ║  Automatically generates all seats for a flight in airplane layout       ║
 * ║                                                                           ║
 * ║  How airplane seating works:                                             ║
 * ║  - Rows are numbered: 1, 2, 3, etc.                                      ║
 * ║  - Each row has 6 seats: A, B, C (left side) | D, E, F (right side)      ║
 * ║  - First Class: Rows 1-2 (front of plane, luxury seats)                  ║
 * ║  - Business Class: Rows 3-8 (middle section, premium seats)              ║
 * ║  - Economy: Rows 9+ (back of plane, standard seats)                      ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */
const generateSeats = (flightId: string, totalSeats: number, bookedSeats: number): Seat[] => {
  // Array to store all generated seats
  const seats: Seat[] = [];
  
  /**
   * Calculate how many rows we need
   * Each row has 6 seats (A, B, C, D, E, F)
   * Math.ceil rounds UP to ensure we have enough rows
   * Example: 180 seats ÷ 6 = 30 rows
   */
  const rows = Math.ceil(totalSeats / 6);
  
  /**
   * ───────────────────────────────────────────────────────────────────────
   * LOOP THROUGH EACH ROW
   * ───────────────────────────────────────────────────────────────────────
   */
  for (let row = 1; row <= rows; row++) {
    // Letters for seats in each row: A-F (left to right)
    const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
    
    /**
     * ─────────────────────────────────────────────────────────────────────
     * LOOP THROUGH EACH SEAT IN THE ROW
     * ─────────────────────────────────────────────────────────────────────
     */
    for (let i = 0; i < seatLetters.length; i++) {
      // Safety check: Stop if we've already generated enough seats
      if (seats.length >= totalSeats) break;
      
      /**
       * ═══════════════════════════════════════════════════════════════════
       * DETERMINE TICKET CLASS BASED ON ROW NUMBER
       * ═══════════════════════════════════════════════════════════════════
       * Rows 1-2: First Class (front of plane)
       * Rows 3-8: Business Class (middle section)
       * Rows 9+: Economy (back of plane)
       */
      let ticketClass = TicketClass.Economy;       // Default to Economy
      if (row <= 2) ticketClass = TicketClass.First;      // First 2 rows = First Class
      else if (row <= 8) ticketClass = TicketClass.Business;  // Rows 3-8 = Business
      
      /**
       * ═══════════════════════════════════════════════════════════════════
       * CREATE SEAT NUMBER
       * ═══════════════════════════════════════════════════════════════════
       * Format: Row number + Letter
       * Examples: 1A, 1B, 10C, 25F
       */
      const seatNumber = `${row}${seatLetters[i]}`;
      
      /**
       * ═══════════════════════════════════════════════════════════════════
       * DETERMINE IF THIS SEAT IS ALREADY BOOKED
       * ═══════════════════════════════════════════════════════════════════
       * We mark the FIRST X seats as booked (where X = bookedSeats)
       * The REMAINING seats are available
       * 
       * Example: If totalSeats = 180 and bookedSeats = 178:
       * - Seats 0-177 (first 178) are BOOKED
       * - Seats 178-179 (last 2) are AVAILABLE
       */
      const seatIndex = seats.length;             // Current position in the array (0-based)
      const isBooked = seatIndex < bookedSeats;   // True if this is one of the booked seats
      
      /**
       * ═══════════════════════════════════════════════════════════════════
       * CREATE THE SEAT OBJECT AND ADD TO ARRAY
       * ═══════════════════════════════════════════════════════════════════
       */
      seats.push({
        id: `${flightId}-${row}${seatLetters[i]}`,  // Unique ID: "FL001-1A", "FL002-10C"
        seatNumber: seatNumber,                       // Display name: "1A", "10C"
        class: ticketClass,                           // First, Business, or Economy
        status: isBooked ? SeatStatus.Booked : SeatStatus.Available  // Booked or Available
      });
    }
  }
  
  // Return the complete array of seats for this flight
  return seats;
};

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                                                                           ║
 * ║                   STORAGE HELPER FUNCTIONS                                ║
 * ║                                                                           ║
 * ║  These functions handle saving and loading data from browser storage     ║
 * ║                                                                           ║
 * ║  Two types of storage:                                                    ║
 * ║  1. localStorage - Shared across ALL browser tabs (flights, bookings)    ║
 * ║  2. sessionStorage - Specific to ONE tab (current passenger)             ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LOAD FROM LOCALSTORAGE
 * ═══════════════════════════════════════════════════════════════════════════
 * Retrieves data from localStorage (persistent across browser tabs)
 * 
 * @param key - The storage key to look up (e.g., 'nas-flights')
 * @param defaultValue - Value to return if key doesn't exist or error occurs
 * @returns The stored data or the default value
 * 
 * How it works:
 * 1. Try to get the item from localStorage
 * 2. If found, parse the JSON string back into an object
 * 3. If not found or error, return the default value
 */
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    // Attempt to retrieve the item from localStorage
    const item = localStorage.getItem(key);
    // If item exists, parse it from JSON string; otherwise use default
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    // If any error occurs (corrupted data, full storage, etc.), log and use default
    console.warn(`Failed to load ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SAVE TO LOCALSTORAGE
 * ═══════════════════════════════════════════════════════════════════════════
 * Stores data in localStorage (persistent across browser tabs)
 * 
 * @param key - The storage key to save under (e.g., 'nas-flights')
 * @param value - The data to store (will be converted to JSON)
 * 
 * How it works:
 * 1. Convert the value to a JSON string
 * 2. Store it in localStorage under the given key
 * 3. This data will persist even after closing the browser
 */
const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    // Convert the value to JSON and save to localStorage
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // If storage is full or unavailable, log the error
    console.warn(`Failed to save ${key} to localStorage:`, error);
  }
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LOAD FROM SESSIONSTORAGE
 * ═══════════════════════════════════════════════════════════════════════════
 * Retrieves data from sessionStorage (specific to current browser tab only)
 * 
 * @param key - The storage key to look up
 * @param defaultValue - Value to return if key doesn't exist
 * @returns The stored data or the default value
 * 
 * Difference from localStorage:
 * - sessionStorage is cleared when the browser tab is closed
 * - Each tab has its own separate sessionStorage
 * - Used for tab-specific data like "current logged-in passenger"
 */
const loadFromSession = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Failed to load ${key} from sessionStorage:`, error);
    return defaultValue;
  }
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SAVE TO SESSIONSTORAGE
 * ═══════════════════════════════════════════════════════════════════════════
 * Stores data in sessionStorage (specific to current browser tab only)
 * 
 * @param key - The storage key to save under
 * @param value - The data to store
 * 
 * Why use sessionStorage?
 * - For data that should NOT be shared across tabs
 * - Example: User might be logged in as different passengers in different tabs
 */
const saveToSession = <T,>(key: string, value: T): void => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to save ${key} to sessionStorage:`, error);
  }
};

/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                                                                           ║
 * ║                   STATIC FLIGHT CONFIGURATION                             ║
 * ║                                                                           ║
 * ║  Some flights should ALWAYS reset to their initial demo state            ║
 * ║  This ensures the waiting list demo always works properly                ║
 * ║                                                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */
// IDs of fully booked flights that should always load from static initial data
// Only the 5 fully booked flights reset — the 1-seat-left flights (FL006-FL010) persist user changes
const STATIC_FLIGHT_IDS = ['FL001', 'FL002', 'FL003', 'FL004', 'FL005'];

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LOAD FLIGHTS FROM STORAGE (WITH STATIC FLIGHT RESET)
 * ═══════════════════════════════════════════════════════════════════════════
 * Loads flights from localStorage, but ALWAYS resets the demo flights
 * 
 * Why?
 * - Flights FL001-FL005 are for demonstration (fully booked)
 * - These should always be fully booked to show the waiting list feature
 * - Other flights can be modified and those changes persist
 * 
 * How it works:
 * 1. Load stored flights from localStorage
 * 2. Separate them into static (always reset) and dynamic (keep changes)
 * 3. Merge: static flights use hardcoded values, dynamic flights use stored values
 */
const loadFlightsFromStorage = (): Flight[] => {
  // Load stored flights or use initial flights if none stored
  const storedFlights = loadFromStorage<Flight[]>('nas-flights', initialFlights);
  if (storedFlights.length === 0) return initialFlights;

  /**
   * ───────────────────────────────────────────────────────────────────────
   * SEPARATE STATIC AND DYNAMIC FLIGHTS
   * ───────────────────────────────────────────────────────────────────────
   */
  // Static flights: Always use hardcoded initial values
  const staticFlights = initialFlights.filter(f => STATIC_FLIGHT_IDS.includes(f.id));
  
  // Dynamic flights: Use stored values (user's changes persist)
  const dynamicFlights = storedFlights.filter(f => !STATIC_FLIGHT_IDS.includes(f.id));

  /**
   * ───────────────────────────────────────────────────────────────────────
   * MERGE STATIC AND DYNAMIC FLIGHTS
   * ───────────────────────────────────────────────────────────────────────
   */
  // Merge: static flights keep initial values, others keep stored values
  const merged = initialFlights.map(initial => {
    // Is this a static demo flight?
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
  const [seats, setSeats] = useState<Record<string, Seat[]>>(() =>
    loadFromStorage('nas-seats', {})
  );
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
  const [currentPassenger, setCurrentPassenger] = useState<Passenger | null>(() =>
    loadFromSession<Passenger | null>('nas-current-passenger', null)
  );
  const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Initialize seats for all flights (only if not already loaded from storage)
  useEffect(() => {
    const hasSeats = Object.keys(seats).length > 0;
    if (!hasSeats) {
      const initialSeats: Record<string, Seat[]> = {};
      initialFlights.forEach(flight => {
        initialSeats[flight.id] = generateSeats(flight.id, flight.totalSeats, flight.bookedSeats);
      });
      setSeats(initialSeats);
      saveToStorage('nas-seats', initialSeats);
    }
  }, []);

  useEffect(() => {
    if (flights.length === 0) {
      setFlights(initialFlights);
    }
  }, [flights.length]);

  // Save current passenger to sessionStorage (tab-specific)
  useEffect(() => {
    saveToSession('nas-current-passenger', currentPassenger);
  }, [currentPassenger]);
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

  // Listen for storage changes from other tabs and sync state
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key) return; // Ignore clear() calls
      
      if (e.key === 'nas-flights') {
        const newFlights = loadFromStorage<Flight[]>('nas-flights', initialFlights);
        setFlights(newFlights);
      } else if (e.key === 'nas-reservations') {
        const newReservations = loadFromStorage<Reservation[]>('nas-reservations', []);
        setReservations(newReservations);
      } else if (e.key === 'nas-bookings') {
        const newBookings = loadFromStorage<Booking[]>('nas-bookings', []);
        setBookings(newBookings);
      } else if (e.key === 'nas-waiting-lists') {
        const newWaitingLists = loadFromStorage<Record<string, WaitingListEntry[]>>('nas-waiting-lists', {});
        setWaitingLists(newWaitingLists);
      } else if (e.key === 'nas-system-logs') {
        const newLogs = loadFromStorage<SystemLog[]>('nas-system-logs', []);
        setSystemLogs(newLogs);
      }
      // Note: DO NOT sync currentPassenger across tabs - each tab should have independent passenger
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
          processWaitingList(reservation.flightId, 1);
        });
        
        return prev.filter(r => r.expiresAt > now || r.status !== BookingStatus.Reserved);
      });
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, [addSystemLog]);

  /**
   * ============================================================================
   * PROCESS WAITING LIST - NOTIFY NEXT PASSENGER
   * ============================================================================
   * This function is called when a seat becomes available (booking cancelled,
   * payment failed, or reservation expired)
   * It finds the next person in the waiting list and sends them a notification
   * 
   * @param flightId - Which flight has a seat available
   * @param seatsJustFreed - How many seats just became available (usually 1)
   * 
   * How it works:
   * 1. Get the waiting list for this flight
   * 2. Filter out people who are already notified (waiting for their turn)
   * 3. Sort remaining people by priority (VIP > Frequent Flyer > Normal)
   * 4. Pick the highest priority person
   * 5. Mark them as "notified" and start a 5-minute timer
   * 6. They have 5 minutes to accept or the offer goes to the next person
   * ============================================================================
   */
  const processWaitingList = useCallback((flightId: string, seatsJustFreed: number = 1) => {
    // Get the waiting list for this specific flight
    // If no waiting list exists yet, use an empty array
    const waitingList = waitingLists[flightId] || [];
    
    // Log for debugging - helps us see what's happening
    console.log('processWaitingList called:', { flightId, seatsJustFreed, waitingListLength: waitingList.length });
    
    // Safety check 1: Is the waiting list empty?
    // Safety check 2: Did any seats actually become available?
    if (waitingList.length === 0 || seatsJustFreed <= 0) {
      console.log('No one to notify - waiting list empty or no seats freed');
      return; // Stop here - nothing to do
    }
    
    // Find the flight in our flights list to make sure it exists
    const flight = flights.find(f => f.id === flightId);
    if (!flight) {
      console.log('Flight not found');
      return; // Stop here - can't notify about a flight that doesn't exist
    }
    
    /**
     * Find people who haven't been notified yet
     * entry.notified is false for people waiting their turn
     * entry.notified is true for people currently deciding (5-min timer active)
     */
    const unnotifiedEntries = waitingList.filter(entry => !entry.notified);
    console.log('Unnotified entries:', unnotifiedEntries.length);
    
    // If everyone is already notified, don't send more notifications
    if (unnotifiedEntries.length === 0) {
      console.log('Everyone is already notified');
      return; // Stop here - everyone waiting already has a pending notification
    }
    
    /**
     * -----------------------------------------------------------------------
     * PRIORITY CALCULATION
     * -----------------------------------------------------------------------
     * We use a priority queue to ensure VIP customers and premium classes
     * get notified before regular passengers
     * 
     * Priority Score Calculation:
     * Base priority by ticket class:
     * - First Class: 3 points
     * - Business: 2 points
     * - Economy: 1 point
     * 
     * Passenger type bonus:
     * - VIP: +10 points (highest priority)
     * - Frequent Flyer: +5 points (medium priority)
     * - Normal: +0 points (regular priority)
     * 
     * Examples:
     * - VIP First Class: 3 + 10 = 13 (goes first!)
     * - Frequent Flyer Business: 2 + 5 = 7
     * - Normal Economy: 1 + 0 = 1 (goes last)
     * -----------------------------------------------------------------------
     */
    const priorityQueue = new PriorityQueue<WaitingListEntry>();
    
    // Loop through each person who hasn't been notified yet
    unnotifiedEntries.forEach(entry => {
      // Start with base priority based on ticket class
      let priority = 0;
      if (entry.ticketClass === TicketClass.First) priority = 3;      // First Class gets 3 points
      else if (entry.ticketClass === TicketClass.Business) priority = 2; // Business gets 2 points
      else priority = 1;                                               // Economy gets 1 point
      
      // Add bonus points based on passenger type
      if (entry.passenger.type === PassengerType.VIP) priority += 10;          // VIP gets +10 points
      else if (entry.passenger.type === PassengerType.FrequentFlyer) priority += 5; // Frequent Flyer gets +5 points
      // Normal passengers get +0 points (no bonus)
      
      // Add this person to the priority queue with their calculated priority
      // The queue automatically sorts them by priority (highest first)
      priorityQueue.enqueue(entry, priority);
    });
    
    /**
     * -----------------------------------------------------------------------
     * GET THE HIGHEST PRIORITY PERSON
     * -----------------------------------------------------------------------
     * dequeue() removes and returns the person with the HIGHEST priority
     * This is the person who will receive the notification
     */
    const nextEntry = priorityQueue.dequeue();
    console.log('Next entry to notify:', nextEntry?.passenger.name);
    
    // If we successfully got someone from the queue
    if (nextEntry) {
      // Record the current time (when notification was sent)
      const notifiedAt = Date.now();
      
      // Calculate when the notification expires (current time + 5 minutes)
      // NOTIFICATION_TIME is a constant defined elsewhere (5 minutes in milliseconds)
      const notificationExpiresAt = notifiedAt + NOTIFICATION_TIME; // 5 minutes

      /**
       * -------------------------------------------------------------------
       * UPDATE WAITING LIST WITH NOTIFICATION INFO
       * -------------------------------------------------------------------
       * We need to mark this person as "notified" so:
       * 1. They don't get notified again
       * 2. The NotificationBell component can show them the popup
       * 3. We can track if their 5 minutes expired
       */
      setWaitingLists(prev => {
        // Map through the waiting list for this flight
        const updated = (prev[flightId] || []).map(entry => 
          // Is this the person we're notifying?
          entry.id === nextEntry.id 
            // Yes - update their entry with notification info
            ? { 
                ...entry,                           // Keep all existing data
                notified: true,                     // Mark as notified
                notifiedAt,                         // When they were notified
                notificationExpiresAt               // When their notification expires
              }
            // No - keep this entry unchanged
            : entry
        );
        // Return the updated waiting lists object
        return { ...prev, [flightId]: updated };
      });

      /**
       * -------------------------------------------------------------------
       * LOG THE NOTIFICATION
       * -------------------------------------------------------------------
       * Record this action in the system logs for admin monitoring
       */
      addSystemLog(
        'Waiting list notified',                                          // Action type
        `${nextEntry.passenger.name} notified of available seat. Must confirm within 5 minutes.`, // Details
        flightId,                                                         // Which flight
        nextEntry.passenger.id                                           // Which passenger
      );
      
      console.log('Successfully notified:', nextEntry.passenger.name);
    }
  }, [waitingLists, flights, addSystemLog]);

  // Check for expired waiting list notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      let hasAnyExpired = false;
      const expiredData: { flightId: string; entryId: string; passengerName: string }[] = [];
      
      setWaitingLists(prev => {
        const updated = { ...prev };

        Object.keys(updated).forEach(flightId => {
          const expiredEntries = updated[flightId].filter(
            entry => entry.notified && entry.notificationExpiresAt && entry.notificationExpiresAt <= now
          );

          expiredEntries.forEach(expiredEntry => {
            hasAnyExpired = true;
            expiredData.push({ flightId, entryId: expiredEntry.id, passengerName: expiredEntry.passenger.name });
            
            // Mark this person as not notified so they can be re-offered later
            updated[flightId] = updated[flightId].map(entry =>
              entry.id === expiredEntry.id
                ? { ...entry, notified: false, notifiedAt: undefined, notificationExpiresAt: undefined }
                : entry
            );
          });
        });

        return updated;
      });

      // Log the expirations after state update
      expiredData.forEach(data => {
        addSystemLog(
          'Waiting list offer expired',
          `Passenger's seat offer expired. Moving to next in queue.`,
          data.flightId
        );
      });

      // After expiration, trigger waiting list processing
      expiredData.forEach(data => {
        processWaitingList(data.flightId, 1);
      });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [addSystemLog, processWaitingList]);

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

  /**
   * ╔═══════════════════════════════════════════════════════════════════════╗
   * ║                                                                       ║
   * ║                     SELECT SEAT FUNCTION                              ║
   * ║                                                                       ║
   * ║  When a passenger picks a seat, this function:                       ║
   * ║  1. Reserves the seat temporarily (10-minute hold)                   ║
   * ║  2. Marks it as unavailable to other passengers                      ║
   * ║  3. Starts a countdown timer to payment                              ║
   * ║                                                                       ║
   * ║  Think of it like holding an item in your shopping cart - it's      ║
   * ║  yours for now, but if you don't checkout in time, it goes back     ║
   * ║  on the shelf for someone else.                                      ║
   * ║                                                                       ║
   * ╚═══════════════════════════════════════════════════════════════════════╝
   */
  const selectSeat = useCallback((flightId: string, seatId: string, passenger: Passenger): Reservation | null => {
    // Find the flight and its seats
    const flight = flights.find(f => f.id === flightId);
    const flightSeats = seats[flightId] || [];
    const seat = flightSeats.find(s => s.id === seatId);
    
    /**
     * ───────────────────────────────────────────────────────────────────
     * SAFETY CHECKS - Make sure everything is valid
     * ───────────────────────────────────────────────────────────────────
     */
    if (!flight || !seat || seat.status !== SeatStatus.Available) {
      return null; // Can't reserve: flight doesn't exist, seat doesn't exist, or seat is taken
    }
    
    /**
     * ───────────────────────────────────────────────────────────────────
     * CREATE THE RESERVATION
     * ───────────────────────────────────────────────────────────────────
     */
    const now = Date.now();                          // Current time in milliseconds
    const expiresAt = now + RESERVATION_TIME;        // When reservation expires (10 minutes from now)
    
    const reservation: Reservation = {
      id: `RES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,  // Unique reservation ID
      flightId,                                      // Which flight
      flight,                                        // Complete flight details
      passengerId: passenger.id,                     // Who is reserving
      passenger,                                     // Complete passenger details
      seatId,                                        // Which seat
      seat: { ...seat },                            // Complete seat details (copy)
      reservedAt: now,                              // When reservation was created
      expiresAt,                                    // When it expires (10 min)
      status: BookingStatus.Reserved                // Status: Reserved (waiting for payment)
    };
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * UPDATE SEAT STATUS TO "RESERVED"
     * ═══════════════════════════════════════════════════════════════════
     * Mark this seat as temporarily held by this passenger
     */
    setSeats(prev => {
      // Make a copy of the seats for this flight
      const updatedSeats = [...(prev[flightId] || [])];
      // Find the seat we're reserving
      const seatIndex = updatedSeats.findIndex(s => s.id === seatId);
      
      if (seatIndex !== -1) {
        // Update the seat with reservation details
        updatedSeats[seatIndex] = {
          ...updatedSeats[seatIndex],
          status: SeatStatus.Reserved,          // Change status from Available to Reserved
          reservedBy: passenger.id,             // Record who reserved it
          reservedUntil: expiresAt              // Record when reservation expires
        };
      }
      
      // Return updated seats object
      return { ...prev, [flightId]: updatedSeats };
    });
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * UPDATE FLIGHT COUNTERS
     * ═══════════════════════════════════════════════════════════════════
     * Adjust the available and reserved seat counts
     */
    setFlights(prev => prev.map(f => {
      if (f.id === flightId) {
        const newAvailable = Math.max(0, f.availableSeats - 1);  // Decrease available by 1
        const newReserved = f.reservedSeats + 1;                  // Increase reserved by 1
        
        return {
          ...f,
          availableSeats: newAvailable,
          reservedSeats: newReserved,
          // Update flight status based on remaining available seats
          status: newAvailable > 10 ? FlightStatus.SeatsAvailable :   // Plenty of seats
                  newAvailable > 0 ? FlightStatus.LimitedSeats :      // Few seats left
                  FlightStatus.FullyBooked                            // No seats left
        };
      }
      return f; // Other flights unchanged
    }));
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * SAVE THE RESERVATION AND SET AS CURRENT
     * ═══════════════════════════════════════════════════════════════════
     */
    setReservations(prev => [...prev, reservation]);  // Add to reservations list
    setCurrentReservation(reservation);                // Set as active reservation
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * LOG THE ACTION FOR ADMIN MONITORING
     * ═══════════════════════════════════════════════════════════════════
     */
    addSystemLog(
      'Seat reserved',
      `${passenger.name} reserved seat ${seat.seatNumber} on flight ${flight.flightNumber}`,
      flightId,
      passenger.id
    );
    
    // Return the reservation object so we can navigate to payment page
    return reservation;
  }, [flights, seats, addSystemLog]);

  /**
   * ╔═══════════════════════════════════════════════════════════════════════╗
   * ║                                                                       ║
   * ║                   PROCESS PAYMENT FUNCTION                            ║
   * ║                                                                       ║
   * ║  This is THE CRITICAL MOMENT - when money changes hands              ║
   * ║                                                                       ║
   * ║  Two possible outcomes:                                              ║
   * ║  ✓ SUCCESS: Reserved seat → Confirmed booking (customer wins!)      ║
   * ║  ✗ FAILURE: Reserved seat → Back to available (next person's turn)  ║
   * ║                                                                       ║
   * ║  When payment FAILS, we automatically notify the next person in      ║
   * ║  the waiting list queue - this is how the queue system works!       ║
   * ║                                                                       ║
   * ╚═══════════════════════════════════════════════════════════════════════╝
   */
  const processPayment = useCallback((reservationId: string, success: boolean): Booking | null => {
    // Find the reservation we're trying to pay for
    const reservation = reservations.find(r => r.id === reservationId);
    console.log('processPayment called:', { reservationId, success, reservation, allReservations: reservations });
    
    /**
     * ───────────────────────────────────────────────────────────────────
     * SAFETY CHECK - Does this reservation exist?
     * ───────────────────────────────────────────────────────────────────
     */
    if (!reservation) {
      console.error('Reservation not found for payment!');
      return null; // Can't process payment for non-existent reservation
    }
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * SCENARIO 1: PAYMENT SUCCESSFUL ✓
     * ═══════════════════════════════════════════════════════════════════
     * The customer paid successfully! Convert reservation to a booking
     */
    if (success) {
      // Find the flight for this reservation
      const flight = flights.find(f => f.id === reservation.flightId);
      if (!flight) {
        console.error('Flight not found for reservation!');
        return null;
      }
      
      /**
       * ─────────────────────────────────────────────────────────────────
       * CREATE THE CONFIRMED BOOKING
       * ─────────────────────────────────────────────────────────────────
       * A booking is different from a reservation:
       * - Reservation = temporary hold (10 minutes)
       * - Booking = permanent, paid confirmation
       */
      const booking: Booking = {
        id: `BKG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,  // Unique booking ID
        bookingReference: `${flight.flightNumber.replace(' ', '')}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,  // Customer reference (e.g., "AA1234-X7K9M2")
        flightId: reservation.flightId,
        flight,
        passengerId: reservation.passengerId,
        passenger: reservation.passenger,
        seatId: reservation.seatId,
        seat: reservation.seat,
        ticketClass: reservation.seat.class,                              // Economy, Business, or First
        // Calculate price based on ticket class
        price: flight.price[reservation.seat.class === TicketClass.First ? 'firstClass' : 
                            reservation.seat.class === TicketClass.Business ? 'business' : 'economy'],
        bookedAt: Date.now(),                                            // When payment was confirmed
        status: BookingStatus.Confirmed                                  // Status: Confirmed (paid)
      };
      
      /**
       * ═════════════════════════════════════════════════════════════════
       * UPDATE SEAT STATUS FROM "RESERVED" TO "BOOKED"
       * ═════════════════════════════════════════════════════════════════
       * This seat is now permanently taken (until cancelled)
       */
      setSeats(prev => {
        const updatedSeats = [...(prev[reservation.flightId] || [])];
        const seatIndex = updatedSeats.findIndex(s => s.id === reservation.seatId);
        
        if (seatIndex !== -1) {
          updatedSeats[seatIndex] = {
            ...updatedSeats[seatIndex],
            status: SeatStatus.Booked,        // Change from Reserved to Booked
            reservedBy: undefined,            // Clear reservation info
            reservedUntil: undefined          // Clear expiration time
          };
        }
        
        const newSeatsState = { ...prev, [reservation.flightId]: updatedSeats };
        saveToStorage('nas-seats', newSeatsState);
        return newSeatsState;
      });
      
      /**
       * ═════════════════════════════════════════════════════════════════
       * UPDATE FLIGHT COUNTERS
       * ═════════════════════════════════════════════════════════════════
       * Move the seat from "reserved" to "booked" category
       */
      setFlights(prev => {
        const updated = prev.map(f => {
          if (f.id === reservation.flightId) {
            const newReserved = Math.max(0, f.reservedSeats - 1);  // Decrease reserved by 1
            const newBooked = f.bookedSeats + 1;                    // Increase booked by 1
            
            const updatedFlight = {
              ...f,
              availableSeats: f.availableSeats,   // No change (already decreased during selectSeat)
              reservedSeats: newReserved,
              bookedSeats: newBooked
            };
            
            // Recalculate flight status based on available seats
            updatedFlight.status = updatedFlight.availableSeats > 10 ? FlightStatus.SeatsAvailable :
                      updatedFlight.availableSeats > 0 ? FlightStatus.LimitedSeats :
                      FlightStatus.FullyBooked;
            
            return updatedFlight;
          }
          return f;
        });
        saveToStorage('nas-flights', updated);
        return updated;
      });
      
      /**
       * ═════════════════════════════════════════════════════════════════
       * SAVE THE BOOKING AND REMOVE THE RESERVATION
       * ═════════════════════════════════════════════════════════════════
       */
      setBookings(prev => {
        const updated = [...prev, booking];
        saveToStorage('nas-bookings', updated);
        return updated;
      });
      setReservations(prev => {
        const updated = prev.filter(r => r.id !== reservationId);
        saveToStorage('nas-reservations', updated);
        return updated;
      });
      setCurrentReservation(null);                                       // Clear current reservation
      
      /**
       * ═════════════════════════════════════════════════════════════════
       * LOG THE SUCCESSFUL BOOKING
       * ═════════════════════════════════════════════════════════════════
       */
      addSystemLog(
        'Booking confirmed',
        `${reservation.passenger.name} confirmed booking for seat ${reservation.seat.seatNumber}`,
        reservation.flightId,
        reservation.passengerId
      );
      
      console.log('Payment successful! Booking created:', booking.id);
      return booking; // Return the booking object
    } 
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * SCENARIO 2: PAYMENT FAILED ✗
     * ═══════════════════════════════════════════════════════════════════
     * Payment declined, timed out, or cancelled
     * Release the seat back to available and notify waiting list
     */
    else {
      console.log('Payment FAILED! Releasing seat and notifying next person...');
      
      /**
       * ─────────────────────────────────────────────────────────────────
       * RELEASE THE SEAT - Make it available again
       * ─────────────────────────────────────────────────────────────────
       */
      setSeats(prev => {
        const updatedSeats = [...(prev[reservation.flightId] || [])];
        const seatIndex = updatedSeats.findIndex(s => s.id === reservation.seatId);
        
        if (seatIndex !== -1) {
          updatedSeats[seatIndex] = {
            ...updatedSeats[seatIndex],
            status: SeatStatus.Available,     // Back to Available
            reservedBy: undefined,            // Clear reservation
            reservedUntil: undefined          // Clear timer
          };
        }
        
        const newSeatsState = { ...prev, [reservation.flightId]: updatedSeats };
        saveToStorage('nas-seats', newSeatsState);
        return newSeatsState;
      });
      
      /**
       * ─────────────────────────────────────────────────────────────────
       * UPDATE FLIGHT COUNTERS - Add back to available
       * ─────────────────────────────────────────────────────────────────
       */
      setFlights(prev => {
        const updated = prev.map(f => {
          if (f.id === reservation.flightId) {
            const newAvailable = f.availableSeats + 1;  // Increase available by 1
            
            return {
              ...f,
              availableSeats: newAvailable,
              reservedSeats: Math.max(0, f.reservedSeats - 1),  // Decrease reserved by 1
              status: newAvailable > 10 ? FlightStatus.SeatsAvailable :
                      newAvailable > 0 ? FlightStatus.LimitedSeats :
                      FlightStatus.FullyBooked
            };
          }
          return f;
        });
        saveToStorage('nas-flights', updated);
        return updated;
      });
      
      /**
       * ─────────────────────────────────────────────────────────────────
       * REMOVE THE RESERVATION
       * ─────────────────────────────────────────────────────────────────
       */
      setReservations(prev => {
        const updated = prev.filter(r => r.id !== reservationId);
        saveToStorage('nas-reservations', updated);
        return updated;
      });
      setCurrentReservation(null);
      
      /**
       * ─────────────────────────────────────────────────────────────────
       * LOG THE FAILURE
       * ─────────────────────────────────────────────────────────────────
       */
      addSystemLog(
        'Payment failed',
        `Payment failed for ${reservation.passenger.name}, seat ${reservation.seat.seatNumber} released`,
        reservation.flightId,
        reservation.passengerId
      );
      
      /**
       * ═════════════════════════════════════════════════════════════════
       * ⭐ CRITICAL: NOTIFY NEXT PERSON IN WAITING LIST ⭐
       * ═════════════════════════════════════════════════════════════════
       * This is how the queue system works!
       * When someone fails to pay, the next person in line gets notified
       * This creates the "cascading opportunity" effect
       */
      processWaitingList(reservation.flightId);
      
      return null; // No booking created
    }
  }, [reservations, flights, addSystemLog, processWaitingList]);

  /**
   * ╔═══════════════════════════════════════════════════════════════════════╗
   * ║                                                                       ║
   * ║                    CANCEL BOOKING FUNCTION                            ║
   * ║                                                                       ║
   * ║  Customer changed their mind? Allow them to cancel their booking     ║
   * ║                                                                       ║
   * ║  What happens when a booking is cancelled:                           ║
   * ║  1. Seat becomes available again                                     ║
   * ║  2. Flight counters are updated                                      ║
   * ║  3. Booking is marked as "Cancelled" (not deleted, for records)      ║
   * ║  4. ⭐ Next person in waiting list is AUTOMATICALLY NOTIFIED ⭐      ║
   * ║                                                                       ║
   * ║  This is another trigger for the queue system!                       ║
   * ║                                                                       ║
   * ╚═══════════════════════════════════════════════════════════════════════╝
   */
  const cancelBooking = useCallback((bookingId: string): boolean => {
    // Find the booking to cancel
    const booking = bookings.find(b => b.id === bookingId);
    
    /**
     * ───────────────────────────────────────────────────────────────────
     * SAFETY CHECKS
     * ───────────────────────────────────────────────────────────────────
     * Can only cancel bookings that:
     * 1. Exist
     * 2. Are currently confirmed (not already cancelled)
     */
    if (!booking || booking.status !== BookingStatus.Confirmed) return false;

    /**
     * ═══════════════════════════════════════════════════════════════════
     * STEP 1: RELEASE THE SEAT - Make it available again
     * ═══════════════════════════════════════════════════════════════════
     */
    setSeats(prev => {
      const updatedSeats = [...(prev[booking.flightId] || [])];
      const seatIndex = updatedSeats.findIndex(s => s.id === booking.seatId);
      
      if (seatIndex !== -1) {
        updatedSeats[seatIndex] = {
          ...updatedSeats[seatIndex],
          status: SeatStatus.Available,     // Back to Available
          reservedBy: undefined,            // Clear any reservation data
          reservedUntil: undefined          // Clear timer
        };
      }
      
      return { ...prev, [booking.flightId]: updatedSeats };
    });

    /**
     * ═══════════════════════════════════════════════════════════════════
     * STEP 2: UPDATE FLIGHT COUNTERS
     * ═══════════════════════════════════════════════════════════════════
     * Add the seat back to available and remove from booked
     */
    setFlights(prev => prev.map(f => {
      if (f.id === booking.flightId) {
        const newAvailable = f.availableSeats + 1;  // Increase available by 1
        
        return {
          ...f,
          availableSeats: newAvailable,
          bookedSeats: Math.max(0, f.bookedSeats - 1),  // Decrease booked by 1
          // Update flight status based on new available count
          status: newAvailable > 10 ? FlightStatus.SeatsAvailable :
                  newAvailable > 0 ? FlightStatus.LimitedSeats :
                  FlightStatus.FullyBooked
        };
      }
      return f;
    }));

    /**
     * ═══════════════════════════════════════════════════════════════════
     * STEP 3: MARK BOOKING AS CANCELLED
     * ═══════════════════════════════════════════════════════════════════
     * We don't delete bookings - we mark them as cancelled for record keeping
     * (useful for analytics, refunds, customer support, etc.)
     */
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, status: BookingStatus.Cancelled } : b
    ));

    /**
     * ═══════════════════════════════════════════════════════════════════
     * STEP 4: LOG THE CANCELLATION
     * ═══════════════════════════════════════════════════════════════════
     */
    addSystemLog(
      'Booking cancelled',
      `${booking.passenger.name} cancelled booking for seat ${booking.seat.seatNumber}`,
      booking.flightId,
      booking.passengerId
    );

    /**
     * ═══════════════════════════════════════════════════════════════════
     * STEP 5: ⭐ NOTIFY NEXT PERSON IN WAITING LIST ⭐
     * ═══════════════════════════════════════════════════════════════════
     * This is CRITICAL! When someone cancels their booking, the seat becomes
     * available and the next person in the queue should be notified
     * 
     * This creates the "cascading opportunity" system:
     * Cancellation → Notification → Acceptance → Payment → (or) Timeout → Next Notification
     */
    processWaitingList(booking.flightId, 1);

    return true; // Cancellation successful
  }, [bookings, addSystemLog, processWaitingList]);

  const confirmWaitingListBooking = useCallback((entryId: string, flightId: string): Reservation | null => {
    const waitingList = waitingLists[flightId] || [];
    const entry = waitingList.find(e => e.id === entryId);
    
    console.log('confirmWaitingListBooking called:', { entryId, flightId, entry });
    
    if (!entry || !entry.notified) {
      console.log('Entry not found or not notified');
      return null; // Only notified entries can be confirmed
    }
    
    const flight = flights.find(f => f.id === flightId);
    if (!flight) {
      console.log('Flight not found');
      return null;
    }
    
    // Check if notification has expired
    const now = Date.now();
    if (entry.notificationExpiresAt && entry.notificationExpiresAt <= now) {
      console.log('Notification expired');
      return null; // Notification expired
    }
    
    // Find an available seat
    const availableSeats = seats[flightId] || [];
    console.log('Available seats for flight:', availableSeats.filter(s => s.status === SeatStatus.Available).length);
    const freeSeat = availableSeats.find(s => s.status === SeatStatus.Available);
    
    if (!freeSeat) {
      console.log('No free seats found');
      return null; // No available seats
    }
    
    console.log('Creating reservation with seat:', freeSeat.seatNumber);
    
    // Create a reservation for the waiting list passenger (same flow as regular booking)
    const reservation: Reservation = {
      id: `RES-WL-${now}-${Math.random().toString(36).substr(2, 9)}`,
      flightId,
      flight,
      passengerId: entry.passenger.id,
      passenger: entry.passenger,
      seatId: freeSeat.id,
      seat: freeSeat,
      ticketClass: entry.ticketClass,
      reservedAt: now,
      expiresAt: now + RESERVATION_TIME,
      status: BookingStatus.Reserved
    };

    // Update seat to reserved and save immediately
    setSeats(prev => {
      const updatedSeats = [...(prev[flightId] || [])];
      const seatIndex = updatedSeats.findIndex(s => s.id === freeSeat.id);
      if (seatIndex !== -1) {
        updatedSeats[seatIndex] = {
          ...updatedSeats[seatIndex],
          status: SeatStatus.Reserved,
          reservedBy: entry.passenger.id,
          reservedUntil: now + RESERVATION_TIME
        };
      }
      const newSeatsState = { ...prev, [flightId]: updatedSeats };
      // Save immediately to localStorage
      saveToStorage('nas-seats', newSeatsState);
      return newSeatsState;
    });

    // Update flight counts (reserved instead of booked) and save immediately
    setFlights(prev => {
      const updated = prev.map(f => {
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
      });
      // Save immediately to localStorage
      saveToStorage('nas-flights', updated);
      return updated;
    });

    // Add reservation and save to localStorage IMMEDIATELY (before navigation)
    setReservations(prev => {
      const updated = [...prev, reservation];
      console.log('Reservation added to state:', reservation.id, 'Total reservations:', updated.length);
      // Save to localStorage synchronously to ensure it's there when Payment page loads
      saveToStorage('nas-reservations', updated);
      return updated;
    });

    // Remove from waiting list and save immediately
    setWaitingLists(prev => {
      const remaining = (prev[flightId] || []).filter(e => e.id !== entryId);
      const reindexed = remaining.map((e, index) => ({
        ...e,
        position: index + 1
      }));
      console.log('Removed from waiting list. Remaining:', reindexed.length);
      const updated = { ...prev, [flightId]: reindexed };
      // Save immediately to localStorage
      saveToStorage('nas-waiting-lists', updated);
      return updated;
    });

    addSystemLog(
      'Waiting list booking accepted - reservation created',
      `${entry.passenger.name} accepted offer for seat ${freeSeat.seatNumber}, now in payment`,
      flightId,
      entry.passenger.id
    );

    console.log('Returning reservation:', reservation);
    // Return the reservation so NotificationBell can navigate to payment
    return reservation;
  }, [waitingLists, flights, seats, addSystemLog, processWaitingList]);

  /**
   * ╔═══════════════════════════════════════════════════════════════════════╗
   * ║                                                                       ║
   * ║                    JOIN WAITING LIST FUNCTION                         ║
   * ║                                                                       ║
   * ║  Flight is full? No problem! Join the waiting list.                  ║
   * ║                                                                       ║
   * ║  What this function does:                                            ║
   * ║  1. Adds passenger to the queue for this flight                      ║
   * ║  2. Assigns them a position number (1st, 2nd, 3rd in line)           ║
   * ║  3. Records their preferred ticket class (for priority calculation)  ║
   * ║  4. They'll be notified automatically when a seat opens up           ║
   * ║                                                                       ║
   * ║  Priority is calculated later when seats become available using:     ║
   * ║  - Passenger Type (VIP > Frequent Flyer > Normal)                    ║
   * ║  - Ticket Class (First > Business > Economy)                         ║
   * ║  - Join Time (earlier = higher priority within same tier)            ║
   * ║                                                                       ║
   * ╚═══════════════════════════════════════════════════════════════════════╝
   */
  const joinWaitingList = useCallback((flightId: string, passenger: Passenger, ticketClass: TicketClass): WaitingListEntry | null => {
    /**
     * ───────────────────────────────────────────────────────────────────
     * STEP 1: VERIFY THE FLIGHT EXISTS
     * ───────────────────────────────────────────────────────────────────
     */
    const flight = flights.find(f => f.id === flightId);
    if (!flight) return null; // Can't join waiting list for non-existent flight
    
    /**
     * ───────────────────────────────────────────────────────────────────
     * STEP 2: CALCULATE POSITION IN QUEUE
     * ───────────────────────────────────────────────────────────────────
     * Position = Current queue length + 1
     * Example: If 3 people are waiting, you become #4
     */
    const currentList = waitingLists[flightId] || [];  // Get existing queue
    const position = currentList.length + 1;            // Your position = one more than current length
    
    /**
     * ───────────────────────────────────────────────────────────────────
     * STEP 3: CREATE THE WAITING LIST ENTRY
     * ───────────────────────────────────────────────────────────────────
     */
    const entry: WaitingListEntry = {
      id: `WL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,  // Unique ID
      flightId,                                         // Which flight
      passenger,                                        // Passenger details (name, email, type, etc.)
      ticketClass,                                      // Preferred class (Economy, Business, First)
      joinedAt: Date.now(),                            // When they joined (timestamp)
      position                                          // Their position in the queue (#1, #2, etc.)
      // Note: notified, notifiedAt, and notificationExpiresAt are added later
      // when a seat becomes available and they're selected for notification
    };
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * STEP 4: ADD TO WAITING LIST
     * ═══════════════════════════════════════════════════════════════════
     * Add this entry to the end of the queue for this flight
     */
    setWaitingLists(prev => ({
      ...prev,                                          // Keep all other flights' waiting lists
      [flightId]: [...(prev[flightId] || []), entry]   // Add this entry to the end
    }));
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * STEP 5: LOG THE ACTION
     * ═══════════════════════════════════════════════════════════════════
     */
    addSystemLog(
      'Joined waiting list',
      `${passenger.name} joined waiting list at position ${position}`,
      flightId,
      passenger.id
    );
    
    /**
     * ═══════════════════════════════════════════════════════════════════
     * RETURN THE ENTRY
     * ═══════════════════════════════════════════════════════════════════
     * This allows the component to show confirmation and position info
     */
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

  const getPendingNotificationsForCurrentPassenger = useCallback(() => {
    if (!currentPassenger) return [];
    
    const pending: Array<WaitingListEntry & { flightId: string }> = [];
    
    Object.entries(waitingLists).forEach(([flightId, entries]) => {
      entries.forEach(entry => {
        // Only return entries that are notified and for the current passenger
        if (entry.notified && entry.passenger.id === currentPassenger.id) {
          pending.push({
            ...entry,
            flightId
          });
        }
      });
    });
    
    return pending;
  }, [currentPassenger, waitingLists]);

  const clearCurrentReservation = useCallback(() => {
    setCurrentReservation(null);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const resetDemoData = useCallback(() => {
    const initialSeats: Record<string, Seat[]> = {};
    initialFlights.forEach(flight => {
      initialSeats[flight.id] = generateSeats(flight.id, flight.totalSeats, flight.bookedSeats);
    });

    localStorage.removeItem('nas-bookings');
    localStorage.removeItem('nas-reservations');
    localStorage.removeItem('nas-waiting-lists');
    localStorage.removeItem('nas-system-logs');
    localStorage.removeItem('nas-flights');
    localStorage.removeItem('nas-seats');
    sessionStorage.removeItem('nas-current-passenger');

    setFlights(initialFlights);
    setSeats(initialSeats);
    setReservations([]);
    setBookings([]);
    setWaitingLists({});
    setSystemLogs([]);
    setCurrentPassenger(null);
    setCurrentReservation(null);
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
    confirmWaitingListBooking,
    getWaitingListPosition,
    getFlightById,
    getReservationById,
    getPendingNotificationsForCurrentPassenger,
    setCurrentPassenger,
    clearCurrentReservation,
    theme,
    toggleTheme,
    resetDemoData
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