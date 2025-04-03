import React, { useState } from 'react';
import { CheckCircle2, Pencil, Timer, Trash2, Star, GripVertical } from 'lucide-react';
import { SubtaskProps } from '../types';

function Subtask({ subtask, taskId, boardId, onToggleComplete, editing, startEditing, handleEditSave, onDeleteTask, updateTaskPriority }: SubtaskProps) {
  const isEditing = editing.taskId === taskId && editing.subtaskId === subtask.id;
  const [showTooltip, setShowTooltip] = useState(false);

  // Show rating as stars
  const renderRating = () => {
    if (!subtask.feedback) return null;
    
    return (
      <div className="flex items-center gap-0.5 text-yellow-400 ml-1" title={`Rating: ${subtask.feedback}/5`}>
        {Array.from({ length: subtask.feedback }).map((_, i) => (
          <Star key={i} className="w-2.5 h-2.5 fill-yellow-400" />
        ))}
      </div>
    );
  };

  return (
    <div className="py-2 px-2 flex items-center gap-1.5 hover:bg-gray-50/80 backdrop-blur-sm rounded-md transition-colors duration-150 group relative">
      <button
        onClick={() => onToggleComplete(subtask.id, boardId)}
        className={`flex-shrink-0 w-5 h-5 ${
          subtask.completed 
            ? 'text-green-500 hover:text-green-600' 
            : 'text-gray-300 hover:text-gray-400'
        } transition-colors duration-200`}
      >
        <CheckCircle2 className="w-full h-full" />
      </button>
      
      {isEditing && editing.field === 'title' ? (
        <div className="flex-grow flex items-center min-w-0 z-30 absolute left-8 right-8 bg-white shadow-sm">
          <input
            type="text"
            value={editing.value}
            onChange={(e) => startEditing(taskId, subtask.id, 'title', e.target.value)}
            onBlur={() => handleEditSave(boardId)}
            onKeyDown={(e) => e.key === 'Enter' && handleEditSave(boardId)}
            className="flex-grow py-1 px-2 text-sm rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
            autoFocus
          />
        </div>
      ) : (
        <div
          className={`flex-grow text-sm ${
            subtask.completed
              ? 'line-through text-gray-400'
              : 'text-gray-700 hover:text-gray-900'
          } cursor-pointer transition-colors duration-200 truncate mr-1 relative`}
          onClick={() => startEditing(taskId, subtask.id, 'title', subtask.title)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {subtask.title}
          {subtask.feedback && renderRating()}
          
          {/* Prominent tooltip that appears immediately on hover */}
          {showTooltip && (
            <div style={{animation: 'fadeIn 0.15s ease-out forwards'}} className="absolute left-0 top-full mt-1 z-50 bg-gray-800 text-white text-xs rounded-md p-3 shadow-xl max-w-xs whitespace-normal break-words pointer-events-none border border-gray-700">
              <div className="font-medium mb-1">Full Text:</div>
              {subtask.title}
            </div>
          )}
        </div>
      )}
      
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Drag handle */}
        <div className="text-gray-400 cursor-grab">
          <GripVertical className="w-4 h-4" />
        </div>
        
        {/* Time estimate */}
        {isEditing && editing.field === 'time' ? (
          <div className="flex items-center gap-1 z-30 absolute right-20 bg-white shadow-sm p-1 rounded border border-gray-200">
            <input
              type="number"
              value={editing.value}
              onChange={(e) => startEditing(taskId, subtask.id, 'time', e.target.value)}
              onBlur={() => handleEditSave(boardId)}
              onKeyDown={(e) => e.key === 'Enter' && handleEditSave(boardId)}
              className="w-12 py-0.5 px-1.5 text-xs rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              min="0"
              autoFocus
            />
            <span className="text-xs text-gray-500">h</span>
          </div>
        ) : (
          <div 
            className="flex items-center text-xs text-gray-500 gap-1 px-1.5 py-0.5 rounded border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
            onClick={() => startEditing(taskId, subtask.id, 'time', subtask.estimatedTime.toString())}
          >
            <Timer className="w-3 h-3" />
            <span className="font-medium">{subtask.estimatedTime}h</span>
          </div>
        )}
        
        <div className="flex items-center">
          {/* Edit button */}
          <button 
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-0.5 rounded hover:bg-gray-100"
            onClick={() => startEditing(taskId, subtask.id, 'title', subtask.title)}
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          
          {/* Delete button */}
          <button
            onClick={() => onDeleteTask(subtask.id, boardId)}
            className="text-red-400 hover:text-red-600 transition-colors duration-200 p-0.5 rounded hover:bg-red-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Subtask;