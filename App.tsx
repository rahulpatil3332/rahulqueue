
import React, { useState, useCallback, useEffect } from 'react';
import { QueueState } from './types';
import { QUEUE_SIZE, PYTHON_CODE, SECTIONS, APPLICATIONS } from './constants';
import Header from './components/Header';
import QueueVisualizer from './components/QueueVisualizer';
import Section from './components/Section';
import CodeBlock from './components/CodeBlock';
import { 
  Info, AlertCircle, CheckCircle2, Play, Trash2, Search, ArrowRight, 
  RefreshCcw, PlusCircle, MinusCircle, HelpCircle, Zap, ShieldAlert,
  Cpu, Activity, Layout, Repeat, Monitor, Network, Disc, GraduationCap,
  Copyright, ExternalLink, Heart
} from 'lucide-react';

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

    setQueue(prev => ({
      ...prev,
      isAnimating: true,
      enqueuingIndex: targetRear,
      enqueuingValue: valToEnqueue,
      statusMessage: `Inserting "${valToEnqueue}" into index ${targetRear}...`,
      statusType: 'info'
    }));

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

    setQueue(prev => ({
      ...prev,
      isAnimating: true,
      dequeuingIndex: currentFront,
      statusMessage: `Removing "${dequeuedValue}" from index ${currentFront}...`,
      statusType: 'info'
    }));

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
    }, 600);
  }, [queue.front, queue.items, queue.isAnimating]);

  const peek = useCallback(() => {
    if (queue.isAnimating) return;
    setQueue(prev => {
      if (prev.front === -1) {
        return { ...prev, statusMessage: 'Queue is Empty. Nothing to peek.', statusType: 'warning' };
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
    setTimeout(() => {
      setQueue(prev => ({ ...prev, isAnimating: false, peekingIndex: null }));
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
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md shadow-sm z-40 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <ul className="flex space-x-6 overflow-x-auto py-3 no-scrollbar">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a 
                  href={`#${section.id}`}
                  className="text-gray-500 hover:text-blue-600 font-semibold whitespace-nowrap transition-all text-sm uppercase tracking-wide px-2 py-1"
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 mt-12 pb-24 space-y-20">
        
        {/* INTRODUCTION */}
        <Section id="intro" title="1. What is a Circular Queue?">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <p className="text-gray-700 leading-relaxed text-lg">
                  A <strong>circular queue</strong> is a linear data structure in which the operations are performed based on the <strong>First-In, First-Out (FIFO)</strong> principle, and the last position is connected back to the first position, forming a circle.
                </p>
                <div className="mt-6 flex items-start gap-3 bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500">
                  <Repeat className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                  <p className="text-blue-900 text-sm font-medium">
                    This unique arrangement allows for <strong>efficient utilisation of space</strong> within the queue.
                  </p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Zap className="text-amber-500" size={20} /> Intelligent Design
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Unlike a linear queue, which can suffer from inefficient space usage once elements are dequeued from the front, a circular queue intelligently reuses empty slots. This wrap-around mechanism prevents the need for shifting elements.
                </p>
              </div>
            </div>
            <div className="bg-indigo-900 rounded-3xl p-8 text-white flex flex-col justify-center shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10"></div>
               <h3 className="text-2xl font-bold mb-4">Core Concepts</h3>
               <ul className="space-y-4">
                 {[
                   "FIFO (First-In First-Out) logic",
                   "Fixed-size array structure",
                   "Two pointers: Front and Rear",
                   "Modulo Operator (%) for wrap-around",
                   "Zero element shifting required"
                 ].map((text, idx) => (
                   <li key={idx} className="flex items-center gap-3">
                     <CheckCircle2 className="text-emerald-400 flex-shrink-0" size={18} />
                     <span className="text-indigo-50">{text}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        </Section>

        {/* OPERATIONS */}
        <Section id="operations" title="2. Standard Operations">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-shadow">
              <PlusCircle className="text-blue-600 mb-4" size={32} />
              <h4 className="font-bold text-gray-900 mb-2">Enqueue (Insertion)</h4>
              <p className="text-xs text-gray-500 leading-relaxed">Adds an element to the rear of the queue. Involves updating the rear pointer using a modulo operation to handle wrap-around.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-shadow">
              <MinusCircle className="text-rose-600 mb-4" size={32} />
              <h4 className="font-bold text-gray-900 mb-2">Dequeue (Deletion)</h4>
              <p className="text-xs text-gray-500 leading-relaxed">Removes an element from the front. Updates the front pointer, reusing the space for subsequent insertions.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-shadow">
              <Search className="text-indigo-600 mb-4" size={32} />
              <h4 className="font-bold text-gray-900 mb-2">Peek / Front</h4>
              <p className="text-xs text-gray-500 leading-relaxed">Retrieves the front element without removing it. A read-only operation to inspect the next item.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-shadow">
              <HelpCircle className="text-amber-600 mb-4" size={32} />
              <h4 className="font-bold text-gray-900 mb-2">isEmpty & isFull</h4>
              <p className="text-xs text-gray-500 leading-relaxed">Boolean checks to prevent underflow (empty queue) and overflow (full queue) during operations.</p>
            </div>
          </div>
        </Section>

        {/* CONDITIONS */}
        <Section id="conditions" title="3. Overflow and Underflow">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-200 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <ShieldAlert size={80} />
               </div>
               <h4 className="text-xl font-bold text-rose-700 mb-4">Queue Overflow</h4>
               <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                 Occurs when an attempt is made to insert an element into a full queue. Detected when the incremented <strong>rear</strong> pointer wraps around and matches the <strong>front</strong>.
               </p>
               <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 font-mono text-center text-rose-900 font-bold">
                 (rear + 1) % size == front
               </div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-200 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 text-amber-500">
                 <ShieldAlert size={80} />
               </div>
               <h4 className="text-xl font-bold text-amber-700 mb-4">Queue Underflow</h4>
               <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                 Occurs when an attempt is made to delete from an empty queue. Typically detected when <strong>front</strong> is at its initial state (-1) or matches <strong>rear</strong> after a final dequeue.
               </p>
               <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 font-mono text-center text-amber-900 font-bold">
                 front == -1
               </div>
            </div>
          </div>
        </Section>

        {/* CODE */}
        <Section id="code" title="4. Implementation Details">
          <div className="grid lg:grid-cols-2 gap-10">
             <div className="space-y-8">
               <div className="bg-slate-900 p-8 rounded-3xl text-indigo-300 font-mono text-sm leading-relaxed shadow-2xl">
                 <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                   <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                   <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                   <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                   <span className="ml-2 text-xs font-bold text-slate-500">Python Explanation</span>
                 </div>
                 <ul className="space-y-6">
                   <li>
                     <p className="text-white font-bold mb-1">Constructor:</p>
                     Initialises the queue with a fixed size, a list of None values, and pointers set to -1.
                   </li>
                   <li>
                     <p className="text-white font-bold mb-1">Modulo Operator (%):</p>
                     Ensures pointers wrap around to index 0 when reaching the array's end.
                   </li>
                 </ul>
               </div>
               <CodeBlock title="Class Definition" code={PYTHON_CODE.class} />
             </div>
             <div className="space-y-8">
               <CodeBlock title="Enqueue Method" code={PYTHON_CODE.enqueue} />
               <CodeBlock title="Dequeue Method" code={PYTHON_CODE.dequeue} />
             </div>
          </div>
        </Section>

        {/* ALGORITHMS */}
        <Section id="algorithms" title="5. Step-by-Step Logic">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white p-8 rounded-3xl border border-gray-200">
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-blue-700">
                <PlusCircle size={20} /> Insertion (Enqueue)
              </h4>
              <ol className="space-y-4">
                {[
                  "Check if full: (rear + 1) % size == front",
                  "If empty (front == -1), set front = 0",
                  "Increment rear using modulo: rear = (rear + 1) % size",
                  "Add the new element at queue[rear]"
                ].map((step, idx) => (
                  <li key={idx} className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">{idx+1}</span>
                    <span className="text-sm text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-200">
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-rose-700">
                <MinusCircle size={20} /> Deletion (Dequeue)
              </h4>
              <ol className="space-y-4">
                {[
                  "Check if empty: front == -1",
                  "Retrieve element at queue[front]",
                  "If front == rear, reset both to -1 (empty state)",
                  "Else, increment front using modulo: (front + 1) % size"
                ].map((step, idx) => (
                  <li key={idx} className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold flex-shrink-0">{idx+1}</span>
                    <span className="text-sm text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Section>

        {/* VISUALIZER */}
        <Section id="visualizer" title="6. Interactive Visualization">
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 bg-white p-10 rounded-3xl shadow-xl border border-slate-200 flex flex-col items-center">
              <QueueVisualizer queue={queue} />
              <div className="mt-12 w-full grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-50 pt-8">
                <div className="text-center px-4">
                  <div className="text-sm font-bold text-gray-400 uppercase mb-1">Front</div>
                  <div className="text-2xl font-black text-blue-600">{queue.front}</div>
                </div>
                <div className="text-center px-4">
                  <div className="text-sm font-bold text-gray-400 uppercase mb-1">Rear</div>
                  <div className="text-2xl font-black text-orange-600">{queue.rear}</div>
                </div>
                <div className="text-center px-4">
                  <div className="text-sm font-bold text-gray-400 uppercase mb-1">Status</div>
                  <div className={`text-xs font-black uppercase inline-block px-2 py-1 rounded ${
                    queue.statusType === 'error' ? 'bg-red-100 text-red-700' :
                    queue.statusType === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                  }`}>{queue.statusType}</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Play className="text-indigo-600" /> Interaction Console
                </h3>
                <div className="space-y-5">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && enqueue()}
                      placeholder="Data to insert..."
                      disabled={queue.isAnimating}
                      className="flex-1 px-5 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all disabled:bg-gray-50"
                    />
                    <button 
                      onClick={enqueue}
                      disabled={queue.isAnimating}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
                    >
                      Enqueue
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={dequeue}
                      disabled={queue.isAnimating}
                      className="bg-rose-500 hover:bg-rose-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-rose-100 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Trash2 size={18} /> Dequeue
                    </button>
                    <button 
                      onClick={peek}
                      disabled={queue.isAnimating}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Search size={18} /> Peek
                    </button>
                  </div>
                  <button 
                    onClick={resetQueue}
                    disabled={queue.isAnimating}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCcw size={16} /> Reset Visualizer
                  </button>
                </div>
              </div>

              <div className={`p-6 rounded-3xl border shadow-xl transition-all ${
                queue.statusType === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                queue.statusType === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' :
                'bg-blue-50 border-blue-200 text-blue-800'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <Info size={20} />
                  <span className="font-bold text-xs uppercase tracking-widest">System Message</span>
                </div>
                <p className="font-semibold text-lg leading-tight">{queue.statusMessage}</p>
              </div>
            </div>
          </div>
        </Section>

        {/* APPLICATIONS */}
        <Section id="applications" title="7. Applications">
          <div className="grid md:grid-cols-2 gap-6">
            {APPLICATIONS.map((app, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-200 flex gap-5 group hover:border-blue-300 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {idx === 0 && <Monitor size={24} />}
                  {idx === 1 && <Disc size={24} />}
                  {idx === 2 && <Activity size={24} />}
                  {idx === 3 && <Network size={24} />}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">{app.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{app.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </main>

      <footer className="bg-slate-900 text-white pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 border-b border-white/10 pb-20">
            <div>
              <div className="flex flex-col mb-6">
                <div className="inline-flex items-center gap-3 mb-4">
                   <div className="p-3 bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-500/20">
                     <Heart className="text-white fill-emerald-500 animate-heartbeat" size={28} />
                   </div>
                   <h2 className="text-4xl font-black tracking-tight italic">Thank You!</h2>
                </div>
                <p className="text-slate-400 max-w-sm text-lg leading-relaxed font-medium">
                  We hope this interactive guide helped you master the circular queue concept. Keep learning and happy coding!
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:items-end justify-center">
              <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-sm text-left w-full md:w-auto relative group overflow-hidden">
                {/* Decorative glow inside attribution card */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
                
                <div className="flex items-center gap-2 mb-6">
                  <GraduationCap className="text-indigo-400" size={16} />
                  <p className="text-xs text-indigo-400 uppercase font-black tracking-[0.2em]">Academic Submission</p>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl">
                      <Activity className="text-white" size={32} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-black text-xl text-white">Rahul Dilip Patil</h4>
                    <p className="text-sm text-slate-400 font-bold flex items-center gap-1.5">
                      Roll No: <span className="text-indigo-400">2547029</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Copyright Footer Block */}
          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-white/5 px-6 py-3 rounded-full border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-all cursor-default">
                <Copyright className="text-slate-500" size={16} />
                <span className="text-slate-300 font-black text-sm uppercase tracking-widest">
                  2024 Vaghoba Mitra Mandal
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="#" className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                Documentation <ExternalLink size={12} />
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                Privacy Policy <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
