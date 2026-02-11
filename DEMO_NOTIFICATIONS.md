# How to Demo the Waiting List Notifications

## Flow Overview

Since you're using the same browser, notifications are **passenger-specific** - each person who books/joins gets their own unique ID, and only THEY see their own notifications.

---

## Demo Steps (in single browser)

### **Step 1: User A Books a Full Flight**

1. Open the app (or refresh if starting fresh)
2. Click **"Select Flight"** on any flight (e.g., **Accra → London with only 1 seat**)
3. Enter passenger details:
   - Name: "Alice"
   - Email: any email
   - Passenger Type: "Normal" (or VIP/Frequent Flyer)
4. Select a seat
5. Complete the payment
6. ✅ Alice is now booked (flight is now FULL)

---

### **Step 2: User B Joins the Waiting List**

1. Go back to Flight Search (click "Home" button)
2. Search for the **same flight** you just booked
3. Flight now shows **"Join Waitlist"** button (no available seats)
4. Click **"Join Waitlist"**
5. Enter passenger details:
   - Name: "Bob"
   - Email: any email
   - Passenger Type: "VIP" (higher priority than Alice)
6. ✅ Bob is added to waiting list at position 1

---

### **Step 3: User A Cancels Their Booking**

1. Navigate to **"My Bookings"** page
2. Find Alice's booking
3. Click **"Cancel Booking"**
4. ✅ Alice's booking is cancelled
5. The flight now has 1 available seat
6. **Bob should be notified immediately** ⬇️

---

### **Step 4: Bob Receives Notification**

1. Go back to Flight Search (or any page with the header)
2. Look at the **top-right corner** - there's a **Bell 🔔 icon**
3. You should see a **red badge with "1"** on the bell
4. The notification shows:
   - Flight details (Accra → London)
   - Ticket Class
   - ⏱️ **Time remaining: 5:00** countdown
5. Click **"Accept Offer"** button
6. ✅ Bob is auto-booked to the seat!

---

### **What Happens if Bob Doesn't Accept in Time?**

If Bob ignores the offer for 5 minutes:
- The notification expires
- Bob is moved back to "not notified"
- If there are more people in the queue, the **next priority person** gets notified
- This cascades through the waiting list

---

## How Passenger-Specific Notifications Work

Each passenger gets a unique `passengerId` when they book/join the list. Notifications only appear for that specific passenger.

**Same browser, different passengers:**
- Tab 1: Alice books → only Alice gets notifications for her offers
- Tab 2: Bob on waitlist → only Bob gets notifications for his offers

---

## Testing Multiple Scenarios

### Scenario 1: VIP Gets Priority
- Book flight with User A (Normal)
- Add User B to waitlist (VIP)
- User A cancels → User B (VIP) gets notified first ✅

### Scenario 2: Cascade Through Queue
- Book flight
- Add User B to waitlist (Normal)
- Add User C to waitlist (VIP)
- User A cancels → User C (VIP) gets notified first
- User C doesn't accept (wait 5 min)
- User B then gets notified ✅

### Scenario 3: Multiple Cancellations
- Book a full flight with 3 people on waitlist
- User A cancels → First person notified → They accept ✅
- User B cancels → Second person notified → They accept ✅

---

## Admin Dashboard Verification

After each action, check the **Admin Dashboard** to see:
- ✅ Available seats update correctly
- ✅ Booked seats increase when someone confirms
- ✅ Waiting list count decreases as people get booked
- ✅ Flight status changes (Full → Limited → Available)

---

## Troubleshooting

**Bell shows no notifications?**
- Make sure the current passenger (`currentPassenger`) is set
- Check console for any errors
- Refresh the page

**Notification expired?**
- It takes 5 minutes to expire
- You can wait or manually move to next person in code

**Want to reset?**
- Clear localStorage: `localStorage.clear()`
- Clear sessionStorage: `sessionStorage.clear()`
- Refresh the page

---

Enjoy demoing! 🎉
