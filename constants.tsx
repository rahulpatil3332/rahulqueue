
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
    # Check if empty
    if (self.front == -1):
        print("Queue is Empty")
        return None
    
    data = self.queue[self.front]
    self.queue[self.front] = None
    
    # Last element being removed
    if (self.front == self.rear):
        self.front = -1
        self.rear = -1
    else:
        self.front = (self.front + 1) % self.size
    return data`
};

export const SECTIONS = [
  { id: 'intro', label: 'Introduction' },
  { id: 'structure', label: 'Structure' },
  { id: 'visualizer', label: 'Visualization' },
  { id: 'working', label: 'Working Logic' },
  { id: 'code', label: 'Python Code' }
];
