'use client';

import { useEffect, useRef } from 'react';

export interface ThoughtBubbleProps {
  message: string;
  anchorPosition: { x: string; y: string };
  onDismiss: () => void;
}

export default function ThoughtBubble({
  message,
  anchorPosition,
  onDismiss,
}: ThoughtBubbleProps) {
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Dismiss on outside click
  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      if (bubbleRef.current && !bubbleRef.current.contains(e.target as Node)) {
        onDismiss();
      }
    };
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, [onDismiss]);

  return (
    <div
      ref={bubbleRef}
      role="status"
      aria-live="polite"
      className="absolute z-10 max-w-[180px] pointer-events-auto"
      style={{
        left: anchorPosition.x,
        top: anchorPosition.y,
        transform: 'translate(-50%, -120%)',
      }}
    >
      {/* Bubble body */}
      <div
        className="relative bg-white border-2 border-gray-900 rounded-2xl px-3 py-2 text-sm text-gray-900 font-medium shadow-sm"
        style={{ fontFamily: 'inherit' }}
      >
        {message}
        {/* Tail */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 -bottom-[10px] -translate-x-1/2 w-0 h-0"
          style={{
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '10px solid #1a1a1a',
          }}
        />
        <span
          aria-hidden="true"
          className="absolute left-1/2 -bottom-[8px] -translate-x-1/2 w-0 h-0"
          style={{
            borderLeft: '7px solid transparent',
            borderRight: '7px solid transparent',
            borderTop: '9px solid white',
          }}
        />
      </div>
    </div>
  );
}
