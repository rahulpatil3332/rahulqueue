
import React, { useState, useCallback, useEffect } from 'react';
import { QueueState } from './types';
import { QUEUE_SIZE, PYTHON_CODE, SECTIONS } from './constants';
import Header from './components/Header';
import QueueVisualizer from './components/QueueVisualizer';
import Section from './components/Section';
import CodeBlock from './components/CodeBlock';
import { Info, AlertCircle, CheckCircle2, Play, Trash2, Search, ArrowRight, RefreshCcw } from 'lucide-react';

const App: React.FC = () => {
  const [queue, setQueue] = useState<QueueState>({
    items: Array(QUEUE_SIZE).fill(null),
    front: -1,
    rear: -1,
    size: QUEUE_SIZE,
    lastOperation: 'none',
    statusMessage: 'Ready to perform operations.',
    statusType: 'info',
    dequeuingIndex: null,
    peekingIndex: null,
    enqueuingIndex: null,
    enqueuingValue: null,
    isAnimating: false
  });

  const [inputValue, setInputValue] = useState<string>('');

  const enqueue = useCallback(() => {
    if (queue.isAnimating) return;
    if (!inputValue.trim()) {
      setQueue(prev => ({ 
        ...prev, 
        statusMessage: 'Please enter a value to enqueue.', 
        statusType: 'warning' 
      }));
      return;
    }

    const isFull = (queue.rear + 1) % queue.size === queue.front;
    if (isFull) {
      setQueue(prev => ({
        ...prev,
        lastOperation: 'enqueue',
        statusMessage: 'Queue Overflow: (rear + 1) % size == front',
        statusType: 'error'
      }));
      return;
    }

    const valToEnqueue = inputValue;
    const targetRear = queue.front === -1 ? 0 : (queue.rear + 1) % queue.size;
    const targetFront = queue.front === -1 ? 0 : queue.front;
    
    setInputValue('');

    // Phase 1: Start Animation
    setQueue(prev => ({
      ...prev,
      isAnimating: true,
      enqueuingIndex: targetRear,
      enqueuingValue: valToEnqueue,
      statusMessage: `Inserting "${valToEnqueue}" into index ${targetRear}...`,
      statusType: 'info'
    }));

    // Phase 2: Update actual state after animation duration
    setTimeout(() => {
      setQueue(prev => {
        const newItems = [...prev.items];
        newItems[targetRear] = valToEnqueue;

        return {
          ...prev,
          items: newItems,
          front: targetFront,
          rear: targetRear,
          lastOperation: 'enqueue',
          statusMessage: `Successfully enqueued "${valToEnqueue}".`,
          statusType: 'success',
          isAnimating: false,
          enqueuingIndex: null,
          enqueuingValue: null
        };
      });
    }, 600);
  }, [inputValue, queue.isAnimating, queue.front, queue.rear, queue.size]);

  const dequeue = useCallback(() => {
    if (queue.isAnimating || queue.front === -1) {
      if (queue.front === -1) {
        setQueue(prev => ({
          ...prev,
          lastOperation: 'dequeue',
          statusMessage: 'Queue Underflow: front == -1',
          statusType: 'error'
        }));
      }
      return;
    }

    const currentFront = queue.front;
    const dequeuedValue = queue.items[currentFront];

    // Phase 1: Start Animation
    setQueue(prev => ({
      ...prev,
      isAnimating: true,
      dequeuingIndex: currentFront,
      statusMessage: `Removing "${dequeuedValue}" from index ${currentFront}...`,
      statusType: 'info'
    }));

    // Phase 2: Update actual state after animation duration
    setTimeout(() => {
      setQueue(prev => {
        const newItems = [...prev.items];
        newItems[currentFront] = null;

        let newFront = prev.front;
        let newRear = prev.rear;

        if (prev.front === prev.rear) {
          newFront = -1;
          newRear = -1;
        } else {
          newFront = (prev.front + 1) % prev.size;
        }

        return {
          ...prev,
          items: newItems,
          front: newFront,
          rear: newRear,
          lastOperation: 'dequeue',
          statusMessage: `Successfully dequeued "${dequeuedValue}".`,
          statusType: 'success',
          isAnimating: false,
          dequeuingIndex: null
        };
      });
    }, 600); // Matches CSS transition duration
  }, [queue.front, queue.items, queue.isAnimating]);

  const peek = useCallback(() => {
    if (queue.isAnimating) return;

    setQueue(prev => {
      const isEmpty = prev.front === -1;
      if (isEmpty) {
        return {
          ...prev,
          statusMessage: 'Queue is Empty. Nothing to peek.',
          statusType: 'warning'
        };
      }
      return {
        ...prev,
        isAnimating: true,
        peekingIndex: prev.front,
        lastOperation: 'peek',
        statusMessage: `Peeking: Front element is "${prev.items[prev.front]}" at index ${prev.front}.`,
        statusType: 'info'
      };
    });

    // Reset peeking state after highlight duration
    setTimeout(() => {
      setQueue(prev => ({
        ...prev,
        isAnimating: false,
        peekingIndex: null
      }));
    }, 1200);
  }, [queue.isAnimating]);

  const resetQueue = useCallback(() => {
    setQueue({
      items: Array(QUEUE_SIZE).fill(null),
      front: -1,
      rear: -1,
      size: QUEUE_SIZE,
      lastOperation: 'none',
      statusMessage: 'Queue has been reset.',
      statusType: 'info',
      dequeuingIndex: null,
      peekingIndex: null,
      enqueuingIndex: null,
      enqueuingValue: null,
      isAnimating: false
    });
  }, []);

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <nav className="sticky top-0 bg-white shadow-md z-40 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <ul className="flex space-x-8 overflow-x-auto py-4 scrollbar-hide">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a 
                  href={`#${section.id}`}
                  className="text-gray-600 hover:text-blue-600 font-medium whitespace-nowrap transition-colors"
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 mt-8 space-y-12">
        <Section id="intro" title="1. Introduction to Circular Queue">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                <Info className="mr-2" /> What is it?
              </h3>
              <p className="text-gray-700 leading-relaxed">
                A <strong>Circular Queue</strong> is a linear data structure in which the operations are performed based on FIFO (First In First Out) principle and the last position is connected back to the first position to make a circle. It is also called <strong>"Ring Buffer"</strong>.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-1" />
                  <span>Uses the concept of <strong>Modulo Operator (%)</strong> to wrap around.</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-1" />
                  <span>Memory is utilized more effectively compared to a linear queue.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                <CheckCircle2 className="mr-2" /> Why Circular Queue?
              </h3>
              <div className="space-y-4">
                <p className="text-gray-700">In a regular linear queue, once an element is removed, that space becomes empty and cannot be reused for new elements if the rear has reached the end of the array.</p>
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm font-semibold text-blue-700">Efficiency:</p>
                  <p className="text-sm text-blue-900 italic text-center py-2">Linear Queue: Space Wastage ❌<br/>Circular Queue: Space Reusable ✅</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section id="visualizer" title="2. Circular Queue Visualization & Operations">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white p-8 rounded-2xl shadow-xl border border-gray-200 flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-6 text-gray-500">Dynamic Ring Layout</h3>
              <QueueVisualizer queue={queue} />
              
              <div className="mt-12 w-full flex justify-around items-center px-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{queue.front}</div>
                  <div className="text-xs uppercase font-bold text-gray-400">Front Pointer</div>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{queue.rear}</div>
                  <div className="text-xs uppercase font-bold text-gray-400">Rear Pointer</div>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{queue.items.filter(i => i !== null).length} / {queue.size}</div>
                  <div className="text-xs uppercase font-bold text-gray-400">Occupancy</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Play className="mr-2 text-indigo-500" /> Control Panel
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && enqueue()}
                      placeholder="Enter value"
                      disabled={queue.isAnimating}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                    <button 
                      onClick={enqueue}
                      disabled={queue.isAnimating}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all active:scale-95 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Enqueue
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={dequeue}
                      disabled={queue.isAnimating}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-semibold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" /> Dequeue
                    </button>
                    <button 
                      onClick={peek}
                      disabled={queue.isAnimating}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Search className="w-4 h-4" /> Peek Front
                    </button>
                  </div>
                  <button 
                    onClick={resetQueue}
                    disabled={queue.isAnimating}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold border border-gray-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCcw className="w-4 h-4" /> Reset Queue
                  </button>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border-2 shadow-lg transition-all ${
                queue.statusType === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                queue.statusType === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                queue.statusType === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                'bg-blue-50 border-blue-200 text-blue-800'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  {queue.statusType === 'success' && <CheckCircle2 />}
                  {queue.statusType === 'error' && <AlertCircle />}
                  {queue.statusType === 'warning' && <AlertCircle />}
                  {queue.statusType === 'info' && <Info />}
                  <span className="font-bold uppercase text-sm tracking-wider">Status: {queue.statusType}</span>
                </div>
                <p className="font-medium">{queue.statusMessage}</p>
                {queue.statusType === 'error' && (
                  <div className="mt-4 p-3 bg-white/50 rounded-lg text-xs font-mono">
                    Condition: {queue.lastOperation === 'enqueue' ? '(rear + 1) % size == front' : 'front == -1'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Section>

        <Section id="working" title="3. Step-by-Step Working Logic">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-gray-800 mb-2">1. Initial State</h4>
                <p className="text-sm text-gray-600">Queue is empty. Both pointers point to nothing.</p>
                <div className="mt-2 text-blue-600 font-mono text-sm">front = rear = -1</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-gray-800 mb-2">2. First Insertion</h4>
                <p className="text-sm text-gray-600">Both pointers move to index 0.</p>
                <div className="mt-2 text-blue-600 font-mono text-sm">front = 0, rear = 0</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <h4 className="font-bold text-gray-800 mb-2">3. Normal Insertion</h4>
                <p className="text-sm text-gray-600">Rear increments using modulo to circle back if needed.</p>
                <div className="mt-2 text-blue-600 font-mono text-sm">rear = (rear + 1) % size</div>
              </div>
            </div>

            <div className="bg-amber-50 p-6 rounded-xl border-l-4 border-amber-500">
              <h4 className="font-bold text-amber-800 mb-3">The "Wrap-Around" Magic</h4>
              <p className="text-amber-900 leading-relaxed">
                When the <strong>rear</strong> reaches the end of the array (size-1) and there is empty space at the beginning of the queue (because elements were dequeued), the modulo operator <code>(rear + 1) % size</code> naturally returns <code>0</code>, allowing the queue to "wrap around" and reuse that empty space.
              </p>
            </div>
          </div>
        </Section>

        <Section id="code" title="4. Python Implementation (Concept Only)">
          <div className="space-y-6">
            <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-200 flex items-center gap-3">
              <Info className="text-blue-600" />
              <p className="text-blue-800 text-sm italic font-medium">
                Note: Python code shown for understanding only. It is not executed by the web application.
              </p>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <CodeBlock title="Class Definition" code={PYTHON_CODE.class} />
              <div className="space-y-6">
                <CodeBlock title="Enqueue Method" code={PYTHON_CODE.enqueue} />
                <CodeBlock title="Dequeue Method" code={PYTHON_CODE.dequeue} />
              </div>
            </div>
          </div>
        </Section>
      </main>

      <footer className="bg-gray-900 text-white mt-20 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2">Circular Queue Visualization App</h2>
          <p className="text-gray-400 mb-4 italic">Academic Learning Tool for Data Structures</p>
          <p className="text-gray-500 text-sm mb-8 font-medium">All Rights Reserved By Vaghoba Mitra Mandal</p>
          <div className="grid grid-cols-2 max-w-sm mx-auto gap-4 text-left border-t border-gray-800 pt-6">
            <div>
              <div className="text-xs text-gray-500 uppercase font-bold mb-1">Presenter</div>
              <div className="font-semibold text-blue-400">Rahul Dilip Patil</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase font-bold mb-1">Roll No.</div>
              <div className="font-semibold text-blue-400">2547029</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;