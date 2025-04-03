import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { DroppableBoardProps } from '../types';

function DroppableBoard({ board, children }: DroppableBoardProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: board.id,
  });

  return (
    <div 
      ref={setNodeRef} 
      id={board.id}
      className="bg-white/60 backdrop-blur-sm rounded-xl p-4 min-h-[200px] w-full shadow-sm border border-gray-200/60 
        hover:border-indigo-200/60 transition-all duration-300 cursor-grab active:cursor-grabbing relative"
    >
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-xl">
        {/* Board pattern design - subtle visual flair */}
        <div className="absolute top-2 right-2 text-gray-200 opacity-20 flex">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm8-16a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm8-16a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" fill="currentColor" />
          </svg>
        </div>
      </div>
      
      {children}
      
      {/* Visual cue for dropping - only shown when actively dragging over */}
      <div 
        className="absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle, var(--primary-light) 0%, transparent 70%)`,
          opacity: isOver ? 0.6 : 0
        }}
      />
      
      {/* Only visible when hovering over the board */}
      {isOver && (
        <div className="absolute bottom-3 right-3 pointer-events-none">
          <div className="smash-effect scale-75 origin-bottom-right">
            <svg viewBox="0 0 100 100" width="80" height="80">
              <polygon className="smash-star" points="50,0 61,35 95,35 67,57 79,90 50,70 21,90 33,57 5,35 39,35" fill="var(--primary-color)" />
            </svg>
            <div className="smash-text">DROP!</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DroppableBoard;