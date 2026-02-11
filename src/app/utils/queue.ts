/**
 * ============================================================================
 * QUEUE DATA STRUCTURE - FIFO (First In First Out)
 * ============================================================================
 * This is like a line at a store - the first person to join is the first to leave
 * Example: If Bob joins, then Alice joins, then Carol joins:
 * Queue looks like: [Bob, Alice, Carol]
 * When we remove someone: Bob leaves first, then Alice, then Carol
 * ============================================================================
 */
export class Queue<T> {
  // Private array to store all the items in the queue
  // "private" means only this class can access it directly
  // "T[]" means it can store any type of data (passengers, bookings, etc.)
  private items: T[] = [];

  /**
   * ENQUEUE - Add a new item to the END of the queue
   * @param item - The thing we want to add to the queue
   * Example: enqueue(Bob) adds Bob to the end of the line
   */
  enqueue(item: T): void {
    // push() adds the item to the end of the array
    this.items.push(item);
  }

  /**
   * DEQUEUE - Remove and return the item from the FRONT of the queue
   * @returns The first item in the queue, or undefined if queue is empty
   * Example: If queue is [Bob, Alice, Carol], dequeue() returns Bob
   *          and the queue becomes [Alice, Carol]
   */
  dequeue(): T | undefined {
    // shift() removes and returns the first item from the array
    return this.items.shift();
  }

  /**
   * PEEK - Look at the first item WITHOUT removing it
   * @returns The first item in the queue, or undefined if empty
   * Example: If queue is [Bob, Alice], peek() returns Bob
   *          but the queue stays [Bob, Alice]
   */
  peek(): T | undefined {
    // Access the first item (index 0) without removing it
    return this.items[0];
  }

  /**
   * IS EMPTY - Check if the queue has any items
   * @returns true if queue is empty, false if it has items
   * Example: If queue is [], isEmpty() returns true
   *          If queue is [Bob], isEmpty() returns false
   */
  isEmpty(): boolean {
    // Check if the length is 0
    return this.items.length === 0;
  }

  /**
   * SIZE - Count how many items are in the queue
   * @returns The number of items currently in the queue
   * Example: If queue is [Bob, Alice, Carol], size() returns 3
   */
  size(): number {
    // Return the length of the array
    return this.items.length;
  }

  /**
   * GET ALL - Get a copy of all items in the queue
   * @returns A new array containing all queue items
   * Example: If queue is [Bob, Alice], getAll() returns [Bob, Alice]
   * Note: Returns a COPY so changing the result won't change the actual queue
   */
  getAll(): T[] {
    // [...this.items] creates a copy using spread operator
    return [...this.items];
  }

  /**
   * CLEAR - Remove all items from the queue
   * Example: If queue is [Bob, Alice, Carol], clear() makes it []
   */
  clear(): void {
    // Set items to an empty array
    this.items = [];
  }
}

/**
 * ============================================================================
 * PRIORITY QUEUE ITEM INTERFACE
 * ============================================================================
 * This defines the shape of each item in the priority queue
 * Each item has both data AND a priority number
 * ============================================================================
 */
export interface PriorityQueueItem<T> {
  data: T;              // The actual item (passenger, booking, etc.)
  priority: number;     // Higher number = more important (goes first)
}

/**
 * ============================================================================
 * PRIORITY QUEUE DATA STRUCTURE
 * ============================================================================
 * This is like a VIP line - people with higher priority jump ahead
 * Example: Normal queue [Bob(0), Alice(0), Carol(0)]
 *          Priority queue with VIP: [David(10), Carol(5), Bob(0), Alice(0)]
 *          David has priority 10 (VIP), Carol has priority 5 (Business),
 *          Bob and Alice have priority 0 (Normal)
 * ============================================================================
 */
export class PriorityQueue<T> {
  // Private array to store items with their priorities
  // Each item is wrapped in an object with "data" and "priority"
  private items: PriorityQueueItem<T>[] = [];

  /**
   * ENQUEUE - Add an item with a specific priority
   * The item is inserted in the correct position based on priority
   * Higher priority items go towards the front
   * 
   * @param item - The thing we want to add (passenger, booking, etc.)
   * @param priority - How important this item is (higher = more important)
   * 
   * Example: Queue is [Bob(5), Alice(3)]
   *          enqueue(Carol, 4) inserts Carol between Bob and Alice
   *          Result: [Bob(5), Carol(4), Alice(3)]
   */
  enqueue(item: T, priority: number): void {
    // Create a queue item object with both data and priority
    const queueItem: PriorityQueueItem<T> = { data: item, priority };
    
    // Flag to track if we've added the item yet
    let added = false;
    
    // Loop through existing items to find the right position
    for (let i = 0; i < this.items.length; i++) {
      // If the new item has HIGHER priority than the current item at position i
      if (queueItem.priority > this.items[i].priority) {
        // Insert the new item at position i (pushes others back)
        // splice(i, 0, queueItem) means: at position i, delete 0 items, insert queueItem
        this.items.splice(i, 0, queueItem);
        // Mark that we've added it
        added = true;
        // Stop looking - we found the right spot
        break;
      }
    }
    
    // If we didn't add it yet (it has lowest priority), add to the end
    if (!added) {
      this.items.push(queueItem);
    }
  }

  /**
   * DEQUEUE - Remove and return the HIGHEST PRIORITY item
   * @returns The data of the first item, or undefined if queue is empty
   * 
   * Example: Queue is [VIP-Bob(10), Business-Alice(5), Normal-Carol(0)]
   *          dequeue() returns Bob
   *          Queue becomes [Business-Alice(5), Normal-Carol(0)]
   */
  dequeue(): T | undefined {
    // Remove the first item (highest priority)
    const item = this.items.shift();
    // Return just the data part (not the priority wrapper)
    // The "?" means "if item exists, return item.data, otherwise undefined"
    return item?.data;
  }

  /**
   * PEEK - Look at the HIGHEST PRIORITY item WITHOUT removing it
   * @returns The data of the first item, or undefined if empty
   * 
   * Example: Queue is [VIP-Bob(10), Normal-Alice(0)]
   *          peek() returns Bob
   *          Queue stays [VIP-Bob(10), Normal-Alice(0)]
   */
  peek(): T | undefined {
    // Look at the first item and return just its data
    // The "?" means "if items[0] exists, return its data, otherwise undefined"
    return this.items[0]?.data;
  }

  /**
   * IS EMPTY - Check if the priority queue has any items
   * @returns true if empty, false if it has items
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * SIZE - Count how many items are in the priority queue
   * @returns The number of items
   */
  size(): number {
    return this.items.length;
  }

  /**
   * GET ALL - Get a copy of all items with their priorities
   * @returns Array of all items (each with data and priority)
   * 
   * Example: Returns [{data: Bob, priority: 10}, {data: Alice, priority: 5}]
   */
  getAll(): PriorityQueueItem<T>[] {
    // Return a copy of the entire array
    return [...this.items];
  }

  /**
   * CLEAR - Remove all items from the priority queue
   */
  clear(): void {
    this.items = [];
  }
}
