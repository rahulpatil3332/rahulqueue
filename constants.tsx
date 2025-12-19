
import React from 'react';

export const QUEUE_SIZE = 8;

export const PYTHON_CODE = {
  class: `class CircularQueue:
    def __init__(self, size):
        self.size = size
        self.queue = [None] * size
        self.front = self.rear = -1`,
  enqueue: `def enqueue(self, data):
    # Check if full
    if ((self.rear + 1) % self.size == self.front):
        print("Queue is Full")
    
    # First element
    elif (self.front == -1):
        self.front = 0
        self.rear = 0
        self.queue[self.rear] = data
    
    # Normal insertion
    else:
        self.rear = (self.rear + 1) % self.size
        self.queue[self.rear] = data`,
  dequeue: `def dequeue(self):
        # Check underflow condition
        if self.front == -1:
            print("Queue Underflow")

        # Only one element present
        elif self.front == self.rear:
            removed = self.queue[self.front]
            self.front = -1
            self.rear = -1
            print(f"{removed} dequeued")

        # Normal deletion
        else:
            removed = self.queue[self.front]
            self.front = (self.front + 1) % self.size
            print(f"{removed} dequeued")`
};

export const SECTIONS = [
  { id: 'intro', label: 'Introduction' },
  { id: 'operations', label: 'Operations' },
  { id: 'conditions', label: 'Conditions' },
  { id: 'code', label: 'Implementation' },
  { id: 'algorithms', label: 'Algorithms' },
  { id: 'visualizer', label: 'Visualization' },
  { id: 'applications', label: 'Applications' }
];

export const APPLICATIONS = [
  {
    title: "CPU Scheduling",
    desc: "Circular queues are used in operating systems for scheduling processes in a Round Robin fashion, ensuring each process gets a fair share of CPU time."
  },
  {
    title: "Memory Management (Ring Buffers)",
    desc: "Used in memory management systems to handle streaming data, where new data continuously overwrites old data after the buffer is full."
  },
  {
    title: "Traffic Light Systems",
    desc: "Ideal for controlling automated traffic lights in a cyclic manner, where the sequence of lights repeats indefinitely."
  },
  {
    title: "IO Buffering",
    desc: "Crucial for buffering data between fast and slow devices, such as keyboard inputs, printer spools, and network packet buffering."
  }
];
