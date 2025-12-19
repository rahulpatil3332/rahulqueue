
import React, { useMemo } from 'react';
import { QueueState } from '../types';

interface QueueVisualizerProps {
  queue: QueueState;
}

const QueueVisualizer: React.FC<QueueVisualizerProps> = ({ queue }) => {
  const size = queue.size;
  const radius = 120;
  const center = 160;
  const slotRadius = 32;

  const getCoordinates = (index: number) => {
    if (index === -1) return { x: center, y: center };
    const angle = (index / size) * 2 * Math.PI - Math.PI / 2;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle)
    };
  };

  const frontCoords = useMemo(() => getCoordinates(queue.front), [queue.front, size]);
  const rearCoords = useMemo(() => getCoordinates(queue.rear), [queue.rear, size]);

  return (
    <div className="relative w-80 h-80 select-none">
      <svg width="320" height="320" className="drop-shadow-lg overflow-visible">
        {/* Background Connector Ring */}
        <circle 
          cx={center} 
          cy={center} 
          r={radius} 
          fill="none" 
          stroke="#e2e8f0" 
          strokeWidth="4" 
          strokeDasharray="8 4"
        />

        {/* Queue Slots */}
        {queue.items.map((item, i) => {
          const { x, y } = getCoordinates(i);
          const isEmpty = item === null;
          const isDequeuing = i === queue.dequeuingIndex;
          const isPeeking = i === queue.peekingIndex;
          const isEnqueuing = i === queue.enqueuingIndex;
          
          const displayValue = isEnqueuing ? queue.enqueuingValue : item;
          const showElement = !isEmpty || isEnqueuing;

          return (
            <g key={i} className="cursor-default">
              {/* Slot Circle */}
              <circle
                cx={x}
                cy={y}
                r={slotRadius}
                className={`transition-all duration-500 ${
                  isEmpty && !isEnqueuing ? 'fill-white stroke-gray-200' : 
                  isPeeking ? 'fill-indigo-100 stroke-indigo-600' : 'fill-blue-50 stroke-blue-500'
                } stroke-2 ${isPeeking ? 'animate-pulse' : ''}`}
                style={isPeeking ? { transform: 'scale(1.15)', transformOrigin: `${x}px ${y}px` } : {}}
              />
              
              {/* Index Label */}
              <text
                x={x}
                y={y - slotRadius - 10}
                textAnchor="middle"
                className={`text-[10px] font-bold font-mono transition-colors duration-300 ${isPeeking ? 'fill-indigo-600' : 'fill-gray-400'}`}
              >
                IDX: {i}
              </text>

              {/* Element Value Group */}
              {showElement && (
                <g 
                  className={`transition-all duration-500 ${
                    isDequeuing ? 'opacity-0 scale-50' : 
                    isEnqueuing ? 'animate-bounce-in' : 'opacity-100 scale-100'
                  }`}
                  style={{
                    transformOrigin: `${x}px ${y}px`,
                    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: isDequeuing 
                      ? `translate(${(x - center) * 0.5}px, ${(y - center) * 0.5}px)` 
                      : isPeeking ? 'scale(1.2)' : 'none'
                  }}
                >
                  <text
                    x={x}
                    y={y + 6}
                    textAnchor="middle"
                    className={`text-sm font-bold transition-colors duration-300 ${isPeeking ? 'fill-indigo-800' : 'fill-blue-700'}`}
                  >
                    {displayValue}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Animated Front Pointer */}
        {queue.front !== -1 && (
          <g 
            className="pointer-events-none"
            style={{ 
              transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: `translate(${frontCoords.x}px, ${frontCoords.y}px)` 
            }}
          >
            <g className={queue.peekingIndex !== null ? "animate-bounce" : "animate-pulse"}>
              <path 
                d="M -5 37 L 5 37 L 0 27 Z" 
                fill={queue.peekingIndex !== null ? "#4f46e5" : "#2563eb"} 
              />
              <text 
                x="0" 
                y="54" 
                textAnchor="middle" 
                className={`font-extrabold text-[10px] transition-colors duration-300 ${queue.peekingIndex !== null ? 'fill-indigo-600' : 'fill-blue-600'}`}
              >
                FRONT
              </text>
            </g>
          </g>
        )}

        {/* Animated Rear Pointer */}
        {queue.rear !== -1 && (
          <g 
            className="pointer-events-none"
            style={{ 
              transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: `translate(${rearCoords.x}px, ${rearCoords.y}px)` 
            }}
          >
            <g className="animate-pulse">
              <path 
                d="M -5 37 L 5 37 L 0 27 Z" 
                fill="#ea580c" 
                transform={queue.front === queue.rear ? "translate(0, 30)" : ""}
              />
              <text 
                x="0" 
                y={queue.front === queue.rear ? 84 : 54} 
                textAnchor="middle" 
                className="fill-orange-600 font-extrabold text-[10px]"
              >
                REAR
              </text>
            </g>
          </g>
        )}
      </svg>
      
      {/* Central "EMPTY" state overlay */}
      {queue.front === -1 && !queue.isAnimating && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-gray-100/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 text-gray-500 text-xs font-bold uppercase tracking-widest shadow-inner">
            Queue Empty
          </div>
        </div>
      )}
    </div>
  );
};

export default QueueVisualizer;