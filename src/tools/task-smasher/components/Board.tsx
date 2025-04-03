import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Pencil, GripVertical } from 'lucide-react';
import { BoardComponentProps } from '../types';
import Task from './Task';
import DroppableBoard from './DroppableBoard';

function Board({
  board,
  tasks,
  editingBoardId,
  setEditingBoardId,
  updateBoardTitle,
  onToggleExpanded,
  onToggleComplete,
  onShowFeedback,
  onDeleteTask,
  onDelete,
  onGenerateSubtasks,
  onAddSubtask,
  onRegenerateTask,
  showContextInput,
  setShowContextInput,
  contextInput,
  setContextInput,
  updateContext,
  generating,
  activeTask,
  editing,
  startEditing,
  handleEditSave,
  updateTaskPriority,
  isDraggingOver
}: BoardComponentProps) {
  // Use onDelete if provided, otherwise fall back to onDeleteTask
  const handleDelete = onDelete || onDeleteTask;
  return (
    <div className={`flex-1 ${isDraggingOver === board.id ? 'scale-[1.02] transition-transform duration-200' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="text-gray-400 cursor-grab mr-1">
            <GripVertical className="w-4 h-4" />
          </div>
          {editingBoardId === board.id ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={board.title}
                onChange={(e) => updateBoardTitle(board.id, e.target.value)}
                onBlur={() => setEditingBoardId(null)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingBoardId(null)}
                className="py-1 px-2 text-sm font-medium rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                autoFocus
              />
            </div>
          ) : (
            <h2 className="text-lg font-medium text-gray-800">{board.title}</h2>
          )}
          <button 
            onClick={() => setEditingBoardId(board.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
        <div className="text-sm font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </div>
      </div>
      
      <DroppableBoard board={board}>
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <Task
              key={task.id}
              task={task}
              boardId={board.id}
              onToggleExpanded={onToggleExpanded}
              onToggleComplete={onToggleComplete}
              onShowFeedback={onShowFeedback}
              onDelete={handleDelete}
              onGenerateSubtasks={onGenerateSubtasks}
              onAddSubtask={onAddSubtask}
              onRegenerateTask={onRegenerateTask}
              showContextInput={showContextInput}
              setShowContextInput={setShowContextInput}
              contextInput={contextInput}
              setContextInput={setContextInput}
              updateContext={updateContext}
              generating={generating}
              activeTask={activeTask}
              editing={editing}
              startEditing={startEditing}
              handleEditSave={handleEditSave}
              updateTaskPriority={updateTaskPriority}
            />
          ))}
        </SortableContext>
      </DroppableBoard>
    </div>
  );
}

export default Board;