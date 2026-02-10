// Enums and Types for the Airline Booking System

export enum TicketClass {
  Economy = 'Economy',
  Business = 'Business',
  First = 'First Class'
}

export enum PassengerType {
  Normal = 'Normal',
  FrequentFlyer = 'Frequent Flyer',
  VIP = 'VIP'
}

export enum BookingStatus {
  Reserved = 'Reserved',
  Confirmed = 'Confirmed',
  Cancelled = 'Cancelled',
  PaymentFailed = 'Payment Failed'
}

export enum SeatStatus {
  Available = 'Available',
  Reserved = 'Reserved',
  Booked = 'Booked'
}

export enum FlightStatus {
  SeatsAvailable = 'Seats Available',
  LimitedSeats = 'Limited Seats',
  FullyBooked = 'Fully Booked'
}

export interface Flight {
  id: string;
  flightNumber: string;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  totalSeats: number;
  availableSeats: number;
  reservedSeats: number;
  bookedSeats: number;
  price: {
    economy: number;
    business: number;
    firstClass: number;
  };
  status: FlightStatus;
}

export interface Seat {
  id: string;
  seatNumber: string;
  class: TicketClass;
  status: SeatStatus;
  reservedBy?: string;
  reservedUntil?: number;
}

export interface Passenger {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: PassengerType;
  loyaltyPoints?: number;
}

export interface Reservation {
  id: string;
  flightId: string;
  flight?: Flight;
  passengerId: string;
  passenger: Passenger;
  seatId: string;
  seat: Seat;
  reservedAt: number;
  expiresAt: number;
  status: BookingStatus;
}

export interface Booking {
  id: string;
  bookingReference: string;
  flightId: string;
  flight: Flight;
  passengerId: string;
  passenger: Passenger;
  seatId: string;
  seat: Seat;
  ticketClass: TicketClass;
  price: number;
  bookedAt: number;
  status: BookingStatus;
}

export interface WaitingListEntry {
  id: string;
  flightId: string;
  passenger: Passenger;
  ticketClass: TicketClass;
  joinedAt: number;
  position: number;
  notified?: boolean;
  notifiedAt?: number;
  notificationExpiresAt?: number;
}

export interface SystemLog {
  id: string;
  timestamp: number;
  action: string;
  details: string;
  flightId?: string;
  passengerId?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: 'Operations Admin' | 'Super Admin';
}