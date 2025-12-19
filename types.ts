
export interface QueueState {
  items: (number | string | null)[];
  front: number;
  rear: number;
  size: number;
  lastOperation: 'enqueue' | 'dequeue' | 'peek' | 'none';
  statusMessage: string;
  statusType: 'info' | 'success' | 'error' | 'warning';
  dequeuingIndex: number | null;
  peekingIndex: number | null;
  enqueuingIndex: number | null;
  enqueuingValue: number | string | null;
  isAnimating: boolean;
}

export interface NavItem {
  id: string;
  label: string;
}