// Queue Data Structure - FIFO (First In First Out)
export class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  peek(): T | undefined {
    return this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  getAll(): T[] {
    return [...this.items];
  }

  clear(): void {
    this.items = [];
  }
}

// Priority Queue Data Structure - Based on priority level
export interface PriorityQueueItem<T> {
  data: T;
  priority: number; // Higher number = higher priority
}

export class PriorityQueue<T> {
  private items: PriorityQueueItem<T>[] = [];

  enqueue(item: T, priority: number): void {
    const queueItem: PriorityQueueItem<T> = { data: item, priority };
    
    // Find the correct position to insert based on priority
    let added = false;
    for (let i = 0; i < this.items.length; i++) {
      if (queueItem.priority > this.items[i].priority) {
        this.items.splice(i, 0, queueItem);
        added = true;
        break;
      }
    }
    
    if (!added) {
      this.items.push(queueItem);
    }
  }

  dequeue(): T | undefined {
    const item = this.items.shift();
    return item?.data;
  }

  peek(): T | undefined {
    return this.items[0]?.data;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  getAll(): PriorityQueueItem<T>[] {
    return [...this.items];
  }

  clear(): void {
    this.items = [];
  }
}
