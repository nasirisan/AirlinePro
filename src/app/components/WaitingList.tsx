/**
 * ============================================================================
 * IMPORTS - Bringing in tools and components we need
 * ============================================================================
 */
import React, { useState } from 'react'; // React for building the UI, useState for managing component state
import { useParams, useNavigate } from 'react-router-dom'; // Tools for getting URL parameters and navigating between pages
import { useBooking } from '../context/BookingContext'; // Access to our booking system (flights, waiting lists, etc.)
import { TicketClass, PassengerType } from '../types'; // TypeScript types for ticket classes and passenger types
import { Clock, Users, ArrowLeft, AlertCircle, Star, Award } from 'lucide-react'; // Icon components
import { motion } from 'motion/react'; // Animation library for smooth transitions

/**
 * ============================================================================
 * WAITING LIST COMPONENT
 * ============================================================================
 * This is the page shown when a flight is fully booked
 * It allows passengers to join a waiting list and shows their position
 * ============================================================================
 */
export const WaitingList: React.FC = () => {
  /**
   * ----------------------------------------------------------------------------
   * GET FLIGHT ID FROM URL
   * ----------------------------------------------------------------------------
   * Example URL: /flight/FL001/waiting-list
   * This extracts "FL001" from the URL so we know which flight to show
   */
  const { flightId } = useParams<{ flightId: string }>();
  
  /**
   * ----------------------------------------------------------------------------
   * NAVIGATION TOOL
   * ----------------------------------------------------------------------------
   * This lets us send users to different pages
   * Example: navigate('/') sends user back to home page
   */
  const navigate = useNavigate();
  
  /**
   * ----------------------------------------------------------------------------
   * GET DATA FROM BOOKING SYSTEM
   * ----------------------------------------------------------------------------
   * getFlightById: Function to find a specific flight by its ID
   * waitingLists: Object containing all waiting lists for all flights
   * joinWaitingList: Function to add a passenger to a waiting list
   * currentPassenger: The person currently using this browser tab
   * theme: Whether the page is in light or dark mode
   */
  const { getFlightById, waitingLists, joinWaitingList, currentPassenger, theme } = useBooking();
  
  /**
   * ----------------------------------------------------------------------------
   * COMPONENT STATE (Things that can change)
   * ----------------------------------------------------------------------------
   */
  // Which ticket class the passenger wants (Economy, Business, or First)
  // Starts as Economy by default
  const [selectedClass, setSelectedClass] = useState<TicketClass>(TicketClass.Economy);
  
  // Whether the passenger has joined the waiting list yet
  // Starts as false (not joined)
  const [joined, setJoined] = useState(false);
  
  // The passenger's position in the queue (1st, 2nd, 3rd, etc.)
  // Starts at 0 (no position yet)
  const [position, setPosition] = useState<number>(0);

  /**
   * ----------------------------------------------------------------------------
   * GET FLIGHT DATA
   * ----------------------------------------------------------------------------
   * If we have a flightId from the URL, find that flight in the system
   * Otherwise, flight will be undefined
   */
  const flight = flightId ? getFlightById(flightId) : undefined;
  
  /**
   * ----------------------------------------------------------------------------
   * GET WAITING LIST FOR THIS FLIGHT
   * ----------------------------------------------------------------------------
   * If we have a flightId, get the waiting list for that flight
   * If no waiting list exists yet, use an empty array []
   * Example: waitingLists = { 'FL001': [Bob, Alice, Carol], 'FL002': [David] }
   *          If flightId is 'FL001', waitingList will be [Bob, Alice, Carol]
   */
  const waitingList = flightId ? waitingLists[flightId] || [] : [];

  /**
   * ----------------------------------------------------------------------------
   * SAFETY CHECK
   * ----------------------------------------------------------------------------
   * If we don't have a flight OR there's no passenger logged in,
   * don't show anything (return null means "show nothing")
   * This prevents errors if someone visits the page incorrectly
   */
  if (!flight || !currentPassenger) {
    return null;
  }

  /**
   * ----------------------------------------------------------------------------
   * HANDLE JOIN WAITING LIST BUTTON CLICK
   * ----------------------------------------------------------------------------
   * This function runs when the user clicks "Join Waiting List"
   */
  const handleJoinWaitlist = () => {
    // Make sure we have a flight ID
    if (flightId) {
      // Call the joinWaitingList function from the booking system
      // It returns an entry object with information about the queue position
      const entry = joinWaitingList(flightId, currentPassenger, selectedClass);
      
      // If we successfully joined (entry is not null/undefined)
      if (entry) {
        // Update state to show the "success" screen
        setJoined(true);
        // Save the position we got (1st, 2nd, 3rd, etc.)
        setPosition(entry.position);
      }
    }
  };

  /**
   * ----------------------------------------------------------------------------
   * SPLIT WAITING LIST INTO PRIORITY AND NORMAL QUEUES
   * ----------------------------------------------------------------------------
   * We show users two separate counts:
   * 1. Priority Queue (VIP, Frequent Flyers, Business/First Class)
   * 2. Normal Queue (Regular passengers with Economy tickets)
   */
  
  /**
   * PRIORITY QUEUE MEMBERS
   * Filter the waiting list to find people with special priority
   * Conditions (if ANY is true, they're in priority queue):
   * - Passenger type is VIP
   * - Passenger type is Frequent Flyer  
   * - Ticket class is Business
   * - Ticket class is First
   */
  const priorityQueueMembers = waitingList.filter(
    e => e.passenger.type === PassengerType.VIP || 
         e.passenger.type === PassengerType.FrequentFlyer ||
         e.ticketClass === TicketClass.Business ||
         e.ticketClass === TicketClass.First
  );

  /**
   * NORMAL QUEUE MEMBERS
   * Filter the waiting list to find regular passengers
   * Conditions (BOTH must be true):
   * - Passenger type is Normal (not VIP or Frequent Flyer)
   * - Ticket class is Economy
   */
  const normalQueueMembers = waitingList.filter(
    e => e.passenger.type === PassengerType.Normal && 
         e.ticketClass === TicketClass.Economy
  );

  /**
   * ============================================================================
   * RENDER THE USER INTERFACE
   * ============================================================================
   * This shows different screens based on whether the user has joined:
   * - If NOT joined: Show the "Join Waiting List" form
   * - If joined: Show the "You're on the list!" confirmation
   * ============================================================================
   */
  return (
    // Main container - full screen height with theme-based background color
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Content container - centered with max width and padding */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back button - sends user back to the home/search page */}
        <button
          onClick={() => navigate('/')} // When clicked, go to home page
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> {/* Left arrow icon */}
          Back to Search
        </button>

        {/* 
          ╔═══════════════════════════════════════════════════════════════════╗
          ║ CONDITIONAL RENDERING - Show different content based on state    ║
          ║ If "joined" is false, show the join form                         ║
          ║ If "joined" is true, show the confirmation message               ║
          ╚═══════════════════════════════════════════════════════════════════╝
        */}
        {!joined ? (
          /*
           * ╔═════════════════════════════════════════════════════════════════╗
           * ║ SCREEN 1: JOIN WAITING LIST FORM                               ║
           * ║ Shown when the user has NOT yet joined the waiting list        ║
           * ╚═════════════════════════════════════════════════════════════════╝
           */
          <motion.div
            initial={{ opacity: 0, y: 20 }}     // Start invisible and slightly lower
            animate={{ opacity: 1, y: 0 }}      // Fade in and slide up
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
          >
            {/* ═══════════════════════════════════════════════════════════════
                 HEADER SECTION - Shows red alert icon and title
                ═══════════════════════════════════════════════════════════════ */}
            <div className="text-center mb-8">
              {/* Red circle background with alert icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
              {/* Main heading */}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Flight Fully Booked
              </h1>
              {/* Subheading description */}
              <p className="text-gray-600 dark:text-gray-400">
                Join the waiting list and we'll notify you when a seat becomes available
              </p>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                 FLIGHT INFO CARD - Shows details about the flight
                ═══════════════════════════════════════════════════════════════ */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-6">
              <h2 className="font-bold text-gray-900 dark:text-white mb-4">Flight Details</h2>
              {/* 2-column grid showing flight information */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {/* Column 1: Flight Number */}
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Flight Number</p>
                  <p className="font-medium text-gray-900 dark:text-white">{flight.flightNumber}</p>
                </div>
                {/* Column 2: Date */}
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">{flight.date}</p>
                </div>
                {/* Column 3: From */}
                <div>
                  <p className="text-gray-500 dark:text-gray-400">From</p>
                  <p className="font-medium text-gray-900 dark:text-white">{flight.from}</p>
                </div>
                {/* Column 4: To */}
                <div>
                  <p className="text-gray-500 dark:text-gray-400">To</p>
                  <p className="font-medium text-gray-900 dark:text-white">{flight.to}</p>
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                 CLASS SELECTION - Three buttons to choose ticket class
                ═══════════════════════════════════════════════════════════════ */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select Preferred Class
              </label>
              {/* 3-column grid with Economy, Business, First Class buttons */}
              <div className="grid grid-cols-3 gap-3">
                {/* Loop through each ticket class and create a button */}
                {[TicketClass.Economy, TicketClass.Business, TicketClass.First].map((ticketClass) => (
                  <button
                    key={ticketClass}
                    onClick={() => setSelectedClass(ticketClass)} // Update selected class when clicked
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedClass === ticketClass
                        // If this class is selected, show blue border and background
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30'
                        // If not selected, show gray border
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    {/* Class name (Economy, Business, First) */}
                    <p className="font-medium text-gray-900 dark:text-white">{ticketClass}</p>
                    {/* Price - different for each class */}
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ${ticketClass === TicketClass.First ? flight.price.firstClass :
                        ticketClass === TicketClass.Business ? flight.price.business :
                        flight.price.economy}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                 CURRENT WAITING LIST STATUS - Shows how many people waiting
                ═══════════════════════════════════════════════════════════════ */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                {/* Users icon on the left */}
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                    Current Waiting List
                  </p>
                  {/* 2-column grid showing priority queue vs normal queue */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {/* Column 1: Priority Queue (VIP, Frequent Flyers, Business/First Class) */}
                    <div>
                      <p className="text-blue-700 dark:text-blue-400">Priority Queue</p>
                      <p className="font-bold text-blue-900 dark:text-blue-300">
                        {priorityQueueMembers.length} people
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        Business/First Class, VIP, Frequent Flyers
                      </p>
                    </div>
                    {/* Column 2: Normal Queue (Economy passengers) */}
                    <div>
                      <p className="text-blue-700 dark:text-blue-400">Normal Queue</p>
                      <p className="font-bold text-blue-900 dark:text-blue-300">
                        {normalQueueMembers.length} people
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        Economy Class
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                 PRIORITY INFO - Explains how the queue priority works
                ═══════════════════════════════════════════════════════════════ */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium mb-2">
                How Priority Works
              </p>
              {/* List explaining priority order */}
              <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                <li>• VIP passengers get highest priority</li>
                <li>• Frequent Flyers get medium priority</li>
                <li>• Business/First Class bookings prioritized over Economy</li>
                <li>• Within same priority, FIFO (First In First Out) applies</li>
              </ul>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                 JOIN BUTTON - Adds user to the waiting list
                ═══════════════════════════════════════════════════════════════ */}
            <button
              onClick={handleJoinWaitlist}  // Call the function to join the queue
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-lg transition-colors"
            >
              Join Waiting List
            </button>
          </motion.div>
        ) : (
          /*
           * ╔═════════════════════════════════════════════════════════════════╗
           * ║ SCREEN 2: CONFIRMATION MESSAGE                                 ║
           * ║ Shown AFTER the user successfully joined the waiting list      ║
           * ╚═════════════════════════════════════════════════════════════════╝
           */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}  // Start invisible and slightly smaller
            animate={{ opacity: 1, scale: 1 }}    // Fade in and scale up to full size
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
          >
            {/* ═══════════════════════════════════════════════════════════════
                 SUCCESS HEADER - Green checkmark and confirmation message
                ═══════════════════════════════════════════════════════════════ */}
            <div className="text-center mb-8">
              {/* Green circle background with clock icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                <Clock className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              {/* Success heading */}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                You're on the Waiting List!
              </h1>
              {/* Subheading */}
              <p className="text-gray-600 dark:text-gray-400">
                We'll notify you when a seat becomes available
              </p>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                 INFORMATION CARDS - What happens next and estimated time
                ═══════════════════════════════════════════════════════════════ */}
            <div className="space-y-4 mb-6">
              {/* Card 1: What happens next? */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="font-medium text-gray-900 dark:text-white mb-2">What happens next?</p>
                {/* List of steps */}
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li>✓ You'll receive a notification when a seat becomes available</li>
                  <li>✓ You'll have 5 minutes to confirm and proceed to payment</li>
                  <li>✓ If you don't respond, the next person in queue will be notified</li>
                </ul>
              </div>

              {/* Card 2: Estimated wait time */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  <strong>Estimated Wait Time:</strong> Seats typically become available within 10-15 minutes due to payment timeouts
                </p>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                 ACTION BUTTON - Return home
                ═══════════════════════════════════════════════════════════════ */}
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
            >
              Return Home
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
