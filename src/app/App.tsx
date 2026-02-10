import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import { FlightSearch } from './components/FlightSearch';
import { SeatSelection } from './components/SeatSelection';
import { Payment } from './components/Payment';
import { BookingConfirmation } from './components/BookingConfirmation';
import { WaitingList } from './components/WaitingList';
import { QueueStatus } from './components/QueueStatus';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { QueueMonitoring } from './components/QueueMonitoring';
import { SystemLogs } from './components/SystemLogs';
import { MyBookings } from './components/MyBookings';
import { FlightStatus } from './components/FlightStatusPage';
import { Help } from './components/Help';
import { AboutUs } from './components/AboutUs';
import { Careers } from './components/Careers';
import { Press } from './components/Press';
import { ContactUs } from './components/ContactUs';
import { Terms } from './components/Terms';
import { Privacy } from './components/Privacy';
import { RefundPolicy } from './components/RefundPolicy';

function App() {
  return (
    <BookingProvider>
      <Router>
        <Routes>
          {/* Passenger Routes */}
          <Route path="/" element={<FlightSearch />} />
          <Route path="/flight/:flightId/seats" element={<SeatSelection />} />
          <Route path="/reservation/:reservationId/payment" element={<Payment />} />
          <Route path="/booking/:bookingId/confirmation" element={<BookingConfirmation />} />
          <Route path="/flight/:flightId/waiting-list" element={<WaitingList />} />
          <Route path="/flight/:flightId/waiting-list/status" element={<QueueStatus />} />
          
          {/* Info Routes */}
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/flight-status" element={<FlightStatus />} />
          <Route path="/help" element={<Help />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/press" element={<Press />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/queue-monitoring" element={<QueueMonitoring />} />
          <Route path="/admin/system-logs" element={<SystemLogs />} />
        </Routes>
      </Router>
    </BookingProvider>
  );
}

export default App;
