# NAS Airlines - Airline Booking System

A modern, professional airline booking web application that demonstrates real-world airline reservation logic using **Queue** and **Priority Queue** data structures.

## 🎯 Key Features

### Passenger Features
- **Flight Search** - Search and browse available flights
- **Seat Selection** - Interactive seat map with visual status indicators
- **Temporary Reservation** - 10-minute countdown timer for payment
- **Secure Payment** - Payment processing with automatic confirmation
- **Waiting List** - Join queue when flights are fully booked
- **Priority Queue System** - VIP and Business class passengers get priority
- **Real-time Updates** - Automatic seat release and queue notifications

### Admin Features
- **Operations Dashboard** - Real-time flight and booking statistics
- **Queue Monitoring** - View priority and normal queues for all flights
- **System Activity Logs** - Automatic logging of all system actions
- **Read-only Interface** - Admins monitor, system automates

## 🏗️ Data Structures Implementation

### Queue (FIFO - First In First Out)
Located in `/src/app/utils/queue.ts`

```typescript
class Queue<T> {
  enqueue(item: T): void
  dequeue(): T | undefined
  peek(): T | undefined
  isEmpty(): boolean
  size(): number
}
```

**Used for:**
- Normal waiting list (Economy class passengers)
- Ensures fairness with FIFO ordering

### Priority Queue
Located in `/src/app/utils/queue.ts`

```typescript
class PriorityQueue<T> {
  enqueue(item: T, priority: number): void
  dequeue(): T | undefined
  peek(): T | undefined
  isEmpty(): boolean
  size(): number
}
```

**Priority Levels:**
1. **Highest** - VIP passengers (+10 priority)
2. **High** - Frequent Flyers (+5 priority)
3. **Medium** - Business/First Class (+2-3 priority)
4. **Normal** - Economy Class (+1 priority)

## 📋 System Logic Flow

### 1. Seat Reservation
```
User selects seat → Seat reserved for 10 minutes → Timer starts
```
- Seat status: `Available` → `Reserved`
- Flight available seats decremented
- Countdown timer displayed to user

### 2. Payment Processing
```
Payment successful → Booking confirmed → Seat permanently booked
Payment failed/timeout → Seat released → Next in queue notified
```

### 3. Waiting List Management
```
Flight full → User joins waiting list → Assigned position based on priority
Seat available → Dequeue highest priority → Send notification (5 min to respond)
No response → Next person dequeued → Process repeats
```

### 4. Automatic Actions (No Manual Approval)
- Payment timeout detection (every 5 seconds)
- Automatic seat release
- Queue processing and notifications
- System logging

## 🎨 Design Features

- **Light/Dark Mode** - Toggle between themes
- **Status Colors:**
  - 🟢 Green - Available/Confirmed
  - 🟡 Yellow - Reserved/Limited
  - 🔴 Red - Booked/Full
  - 🟣 Purple - Priority Queue
- **Responsive Design** - Works on desktop and mobile
- **Animations** - Smooth transitions using Motion
- **Real-time Countdowns** - Visual timer components

## 🚀 Getting Started

### Demo Credentials

**Admin Login:**
- Operations Admin: `admin` / `admin123`
- Super Admin: `superadmin` / `super123`

**Passenger:**
- Automatically created when selecting a flight
- Demo passenger: "John Doe"

### Navigation Flow

**Passenger Journey:**
1. Search flights on landing page
2. Select available flight → Choose seat
3. Complete payment within 10 minutes
4. View confirmation with booking reference
5. If flight full → Join waiting list → Get notified when seat available

**Admin Journey:**
1. Login at `/admin/login`
2. View dashboard with real-time statistics
3. Monitor queues in Queue Monitoring
4. Review automated actions in System Logs

## 📁 Project Structure

```
/src/app/
├── components/
│   ├── FlightSearch.tsx          # Landing page & flight search
│   ├── SeatSelection.tsx         # Seat map & selection
│   ├── Payment.tsx               # Payment with countdown
│   ├── BookingConfirmation.tsx   # Booking success page
│   ├── WaitingList.tsx           # Join waiting list
│   ├── QueueStatus.tsx           # View queue position
│   ├── AdminLogin.tsx            # Admin authentication
│   ├── AdminDashboard.tsx        # Admin overview
│   ├── QueueMonitoring.tsx       # Monitor waiting lists
│   ├── SystemLogs.tsx            # Activity logs
│   ├── CountdownTimer.tsx        # Reusable timer component
│   └── StatusBadge.tsx           # Status indicator component
├── context/
│   └── BookingContext.tsx        # Global state management
├── types/
│   └── index.ts                  # TypeScript interfaces
├── utils/
│   └── queue.ts                  # Queue & PriorityQueue classes
└── App.tsx                       # Main routing

```

## 🔧 Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Router** - Navigation
- **Tailwind CSS v4** - Styling
- **Motion (Framer Motion)** - Animations
- **Lucide React** - Icons
- **Context API** - State management

## 💡 Key Concepts Demonstrated

1. **Queue Data Structure**
   - FIFO ordering for economy passengers
   - Enqueue/Dequeue operations
   - Position tracking

2. **Priority Queue**
   - Priority-based ordering
   - Multiple priority levels
   - Automatic sorting on insertion

3. **Real-world Application**
   - Temporary reservations with timeouts
   - Automatic seat management
   - Fair queue processing
   - System automation vs manual approval

4. **User Experience**
   - Visual feedback for all states
   - Clear countdown timers
   - Status indicators
   - Responsive design

## 🎯 Learning Outcomes

This application demonstrates:
- Practical use of Queue and Priority Queue data structures
- Real-world airline booking logic
- Automatic timeout handling
- Priority-based resource allocation
- State management in React
- TypeScript best practices
- Modern UI/UX patterns

## 📝 Notes

- All payment processing is simulated (90% success rate)
- Reservation timer is set to 10 minutes
- Queue notification timeout is 5 minutes
- System checks for expired reservations every 5 seconds
- All actions are logged automatically
- No actual backend - state managed in React Context
