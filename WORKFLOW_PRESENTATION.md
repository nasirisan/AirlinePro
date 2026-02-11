# Seven Airlines Booking System Workflow
## Multi-User Queue Demonstration

---

## **Scenario Overview**

**4 Passengers | 1 Flight | Priority-Based Queue System**

- **Person 1 (Alice)**: Books the last available seat
- **Person 2 (Bob)**: Joins waiting list - Normal Queue (Economy)
- **Person 3 (Carol)**: Joins waiting list - Priority Queue (VIP)
- **Person 4 (David)**: Joins waiting list - Priority Queue (Business Class)

**Flow**: Alice cancels → Carol notified → Carol accepts & cancels → David notified → David accepts & cancels → Bob notified → Bob accepts → Queue empty

---

## **Initial State**

### Flight NAS2002: New York → Los Angeles
- **Total Seats**: 180
- **Available Seats**: 1 (last seat!)
- **Status**: ⚠️ Limited Seats

### Passengers Waiting to Book:
1. **Alice** - Ready to book
2. **Bob** - Will join waiting list (Normal)
3. **Carol** - Will join waiting list (VIP - Highest Priority)
4. **David** - Will join waiting list (Business - High Priority)

---

## **Step 1: Alice Books the Last Seat**

### Alice's Actions:
1. Searches for flight NAS2002
2. Clicks "Select Seat"
3. Chooses Seat 12A (Economy)
4. Seat reserved for 10 minutes
5. Completes payment successfully

### System State After Booking:
```
Flight NAS2002:
├─ Available Seats: 0 ❌
├─ Booked Seats: 180 ✅
├─ Status: 🔴 FULLY BOOKED
└─ Waiting List: Empty
```

**System Log**:
```
✅ Alice confirmed booking for Seat 12A
🔴 Flight NAS2002 is now fully booked
```

---

## **Step 2: Bob Joins Normal Queue**

### Bob's Actions:
1. Searches for flight NAS2002
2. Sees "Fully Booked" status
3. Clicks "Join Waiting List"
4. Selects passenger type: **Regular Passenger**
5. Selects ticket class: **Economy**
6. Confirms joining waiting list

### System State:
```
Waiting List (Position → Name → Type → Class):
└─ #1 → Bob → Normal → Economy (NORMAL QUEUE)
```

**Priority Score**: Base priority (0)

**System Log**:
```
🟡 Bob joined waiting list at position #1 (Normal Queue)
```

---

## **Step 3: Carol Joins Priority Queue (VIP)**

### Carol's Actions:
1. Searches for flight NAS2002
2. Sees "Fully Booked" with waiting list option
3. Clicks "Join Waiting List"
4. Selects passenger type: **VIP** ⭐
5. Selects ticket class: **First Class**
6. Confirms joining waiting list

### System State:
```
Waiting List (Priority Sorted):
├─ #1 → Carol → VIP → First Class (PRIORITY QUEUE) ⭐
└─ #2 → Bob → Normal → Economy (NORMAL QUEUE)
```

**Carol's Priority Score**: VIP (+10) + First Class (+2) = **12**
**Bob's Priority Score**: Normal (0) + Economy (0) = **0**

**Carol jumps ahead of Bob!**

**System Log**:
```
🟣 Carol joined waiting list with VIP priority
📊 Queue reordered: Carol → Bob
```

---

## **Step 4: David Joins Priority Queue (Business)**

### David's Actions:
1. Searches for flight NAS2002
2. Clicks "Join Waiting List"
3. Selects passenger type: **Frequent Flyer** ✈️
4. Selects ticket class: **Business Class**
5. Confirms joining waiting list

### System State:
```
Waiting List (Priority Sorted):
├─ #1 → Carol → VIP → First Class (PRIORITY QUEUE) ⭐ [Priority: 12]
├─ #2 → David → FrequentFlyer → Business (PRIORITY QUEUE) ✈️ [Priority: 6]
└─ #3 → Bob → Normal → Economy (NORMAL QUEUE) [Priority: 0]
```

**David's Priority Score**: Frequent Flyer (+5) + Business (+1) = **6**

**David slots between Carol and Bob!**

**System Log**:
```
🔵 David joined waiting list with Frequent Flyer priority
📊 Queue order: Carol (VIP) → David (FF) → Bob (Normal)
```

---

## **Step 5: Alice Cancels Her Booking**

### Alice's Actions:
1. Goes to "My Bookings"
2. Finds her booking (Reference: NAS2002-ABC123)
3. Clicks "Cancel Booking"
4. Confirms cancellation

### System Processing:
1. ❌ Booking cancelled
2. 💺 Seat 12A released (Available)
3. 📢 System checks waiting list
4. 🔍 Finds Carol at position #1 (highest priority)
5. 🔔 **Carol notified** - 5 minute timer starts

### System State:
```
Flight NAS2002:
├─ Available Seats: 1 ✅
├─ Status: 🟡 Limited Seats
└─ Waiting List:
    ├─ #1 → Carol (NOTIFIED - 5:00 timer) 🔔
    ├─ #2 → David (Waiting)
    └─ #3 → Bob (Waiting)
```

### Carol Receives Notification:
```
🔔 SEAT AVAILABLE!
Flight: NAS2002 (New York → Los Angeles)
You have 5 minutes to accept this offer.

[Accept Booking] [Decline]

Time Remaining: 5:00
```

**System Log**:
```
❌ Alice cancelled booking (Seat 12A)
💺 Seat 12A released back to available
🔔 Carol notified - 5 minute timer started
```

---

## **Step 6: Carol Accepts the Offer**

### Carol's Actions (within 5 minutes):
1. Sees notification popup
2. Reviews flight details
3. Clicks "Accept Booking"
4. System creates reservation

### System Processing:
1. ✅ Carol accepts offer
2. 🎫 Reservation created (10 minute payment timer)
3. 💺 Seat 12A reserved for Carol
4. 🗑️ Carol removed from waiting list
5. 📍 Carol navigates to payment page

### System State:
```
Flight NAS2002:
├─ Available Seats: 0
├─ Reserved Seats: 1 (Carol - 10:00 timer)
├─ Status: 🔴 Fully Booked
└─ Waiting List:
    ├─ #1 → David (Waiting)
    └─ #2 → Bob (Waiting)
```

### Carol's Reservation Screen:
```
⏱️ Complete Payment Before Time Expires

Seat Reserved: 12A
Flight: NAS2002
Time Remaining: 10:00

[Proceed to Payment]
```

**System Log**:
```
✅ Carol accepted waiting list offer
🎫 Reservation RES-WL-123456 created
⏱️ Carol has 10 minutes to complete payment
```

---

## **Step 7: Carol Completes Payment Then Cancels**

### Carol's Actions:
1. Enters payment details
2. Payment processes successfully ✅
3. Receives booking confirmation
4. **Later**: Goes to "My Bookings"
5. Clicks "Cancel Booking"
6. Confirms cancellation

### System Processing (After Cancellation):
1. ❌ Carol's booking cancelled
2. 💺 Seat 12A released
3. 📢 System checks waiting list
4. 🔍 Finds David at position #1 (now highest priority)
5. 🔔 **David notified** - 5 minute timer starts

### System State:
```
Flight NAS2002:
├─ Available Seats: 1 ✅
├─ Status: 🟡 Limited Seats
└─ Waiting List:
    ├─ #1 → David (NOTIFIED - 5:00 timer) 🔔
    └─ #2 → Bob (Waiting)
```

### David Receives Notification:
```
🔔 SEAT AVAILABLE!
Flight: NAS2002 (New York → Los Angeles)
You have 5 minutes to accept this offer.

[Accept Booking] [Decline]

Time Remaining: 5:00
```

**System Log**:
```
✅ Carol completed payment (Booking BKG-789)
❌ Carol cancelled booking later
💺 Seat 12A released back to available
🔔 David notified - 5 minute timer started
```

---

## **Step 8: David Accepts and Cancels**

### David's Actions:
1. Accepts notification offer ✅
2. Reservation created (10 min timer)
3. Completes payment successfully
4. Receives booking confirmation
5. **Later**: Cancels booking ❌

### System Processing (After Cancellation):
1. ❌ David's booking cancelled
2. 💺 Seat 12A released
3. 📢 System checks waiting list
4. 🔍 Finds Bob at position #1 (last person in queue)
5. 🔔 **Bob notified** - 5 minute timer starts

### System State:
```
Flight NAS2002:
├─ Available Seats: 1 ✅
├─ Status: 🟡 Limited Seats
└─ Waiting List:
    └─ #1 → Bob (NOTIFIED - 5:00 timer) 🔔
```

### Bob Receives Notification:
```
🔔 SEAT AVAILABLE!
Flight: NAS2002 (New York → Los Angeles)
You have 5 minutes to accept this offer.

[Accept Booking] [Decline]

Time Remaining: 5:00
```

**System Log**:
```
✅ David completed payment (Booking BKG-456)
❌ David cancelled booking later
💺 Seat 12A released back to available
🔔 Bob notified (Last person in queue) - 5 minute timer started
```

---

## **Step 9: Bob Accepts and Completes Booking**

### Bob's Actions:
1. Sees notification popup
2. Clicks "Accept Booking"
3. Reservation created (10 min timer)
4. Proceeds to payment
5. Enters payment details
6. Completes payment successfully ✅
7. Receives confirmation email

### System Processing:
1. ✅ Bob accepts offer
2. 🎫 Reservation created
3. 💳 Payment processed
4. 📧 Confirmation email sent
5. 🗑️ Bob removed from waiting list
6. 📊 Waiting list now **EMPTY**

### Final System State:
```
Flight NAS2002:
├─ Available Seats: 0 ❌
├─ Booked Seats: 180 ✅
├─ Status: 🔴 FULLY BOOKED
└─ Waiting List: EMPTY ✅

Bob's Booking:
├─ Reference: NAS2002-XYZ789
├─ Seat: 12A
├─ Status: ✅ CONFIRMED
└─ Email: Confirmation sent to bob@email.com
```

**System Log**:
```
✅ Bob accepted waiting list offer
🎫 Reservation RES-WL-789012 created
💳 Bob completed payment successfully
✅ Booking BKG-999 confirmed for Bob
📧 Confirmation email sent to bob@email.com
🎯 Waiting list is now EMPTY
🔴 Flight NAS2002 fully booked again
```

---

## **Complete Flow Timeline**

```
Time    Event                           Queue State
─────────────────────────────────────────────────────────────────
T0      Alice books last seat          []
T1      Bob joins (Normal)             [Bob]
T2      Carol joins (VIP)              [Carol*, Bob]
T3      David joins (FF)               [Carol*, David*, Bob]
        *Priority queue members
─────────────────────────────────────────────────────────────────
T4      Alice cancels                  [Carol🔔, David, Bob]
T5      Carol accepts                  [David, Bob]
T6      Carol books & pays             [David, Bob]
T7      Carol cancels                  [David🔔, Bob]
T8      David accepts                  [Bob]
T9      David books & pays             [Bob]
T10     David cancels                  [Bob🔔]
T11     Bob accepts                    []
T12     Bob books & pays               [] ✅ EMPTY
```

---

## **Key System Features Demonstrated**

### 1. **Priority Queue Algorithm**
- VIP passengers prioritized over Frequent Flyers
- Frequent Flyers prioritized over Normal passengers
- Business/First Class prioritized over Economy
- Within same priority: First In, First Out (FIFO)

### 2. **Notification System**
- 5-minute acceptance window
- Real-time notifications
- Automatic progression to next person if expired/declined

### 3. **Reservation Timers**
- 10-minute payment window after acceptance
- Automatic seat release if payment not completed
- Next person in queue automatically notified

### 4. **Fair Queue Management**
- Transparent position tracking
- Automatic queue reordering based on priority
- No manual intervention needed (fully automated)

### 5. **Booking Lifecycle**
```
Available Seat → Reserved (10 min) → Booked → Cancelled → Available
                      ↓
            If timer expires → Available → Notify next in queue
```

---

## **Priority Calculation Formula**

```javascript
Priority Score = Passenger Type Bonus + Ticket Class Bonus

Passenger Type:
├─ VIP:            +10 points
├─ Frequent Flyer: +5 points
└─ Normal:         +0 points

Ticket Class:
├─ First Class:    +2 points
├─ Business:       +1 point
└─ Economy:        +0 points
```

### Example Calculations:
- **Carol** (VIP + First) = 10 + 2 = **12** 🥇
- **David** (FF + Business) = 5 + 1 = **6** 🥈
- **Bob** (Normal + Economy) = 0 + 0 = **0** 🥉

---

## **System Benefits**

### For Passengers:
✅ Fair and transparent queue system
✅ Clear priority rules
✅ Real-time notifications
✅ Sufficient time to decided (5 min) and pay (10 min)
✅ No manual requests needed

### For Airlines:
✅ Automated seat allocation
✅ Maximized seat utilization
✅ Priority for premium customers
✅ Reduced manual workload
✅ Complete audit trail

### For Operations:
✅ All actions logged automatically
✅ No admin approval needed
✅ Queue auto-manages itself
✅ Real-time monitoring available
✅ Scalable to multiple flights

---

## **Technical Implementation**

### Data Structures Used:

1. **Priority Queue** (Custom Implementation)
```typescript
class PriorityQueue<T> {
  - enqueue(item: T, priority: number)
  - dequeue(): T | undefined
  - peek(): T | undefined
  - reorder based on priority + timestamp
}
```

2. **Booking State Machine**
```
States: Available → Reserved → Booked → Cancelled
Transitions triggered by:
├─ User actions (book, cancel)
├─ Timer expirations (10 min payment)
└─ System events (waiting list notification)
```

3. **Multi-Tab Synchronization**
```typescript
- localStorage: Shared data (flights, bookings, queues)
- sessionStorage: Tab-specific data (current passenger)
- Storage events: Cross-tab updates
```

---

## **Edge Cases Handled**

### 1. Notification Expires (5 minutes)
```
Carol notified → Timer expires → Carol auto-skipped → David notified
```

### 2. Payment Timeout (10 minutes)
```
Carol accepts → Reserves seat → 10 min expires → Seat released → David notified
```

### 3. Multiple Simultaneous Cancellations
```
Queue processed one at a time
Only ONE person notified at a time
No race conditions
```

### 4. Person Closes Browser/Tab
```
Notification persists in localStorage
Other tabs cant see it
Person can return and accept
Auto-expires after 5 minutes
```

### 5. Queue Becomes Empty
```
Last person completes booking → Queue empty
Next cancellation → Direct seat availability
No pending notifications
```

---

## **Admin Monitoring Capabilities**

### Real-Time Dashboard Shows:
1. **Queue Status**
   - Total waiting per flight
   - Priority vs Normal split
   - Currently notified passengers

2. **System Logs**
   - All queue operations
   - Notification send/accept/expire events
   - Booking lifecycle events

3. **Statistics**
   - Average wait time
   - Acceptance rate
   - Queue to booking conversion rate

---

## **Conclusion**

This workflow demonstrates a **fully automated**, **fair**, and **efficient** seat allocation system that:

- ✅ Prioritizes premium customers
- ✅ Guarantees fairness within priority tiers
- ✅ Operates without manual intervention
- ✅ Handles edge cases gracefully
- ✅ Provides complete transparency
- ✅ Scales to multiple passengers and flights

**Result**: All passengers in the queue eventually get their chance, in the correct priority order, with automated notifications and sufficient time to complete their booking.

---
## **End of Presentation**


For technical details, see:
- `src/app/utils/queue.ts` - Queue implementations
- `src/app/context/BookingContext.tsx` - Business logic
- `src/app/components/WaitingList.tsx` - User interface

