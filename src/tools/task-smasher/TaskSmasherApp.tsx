import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle2, Plus, Settings, Sparkles, ArrowRight, Target, Trash2, Clock, Undo, Mic, Filter, Download, Upload, FileSpreadsheet, File as FilePdf, Key, DollarSign, Zap, Info, Star, ChevronDown, ChevronUp, Sliders, MessageSquare } from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
  DragStartEvent
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';

// Import the TaskSmasher components
import Board from './components/Board';
import Task from './components/Task';
import Sidebar from './components/Sidebar';
import { TasksProvider } from './hooks/useTasksContext';
import { useTasksContext } from './hooks/useTasksContext';
import ReCaptchaProvider from './components/ReCaptchaProvider';
import TaskMismatchPopup from './components/TaskMismatchPopup';
import OpenAIExample from './components/OpenAIExample';
import { exportToExcel, exportToPDF } from './utils/taskUtils';
import { useCaseDefinitions } from './utils/useCaseDefinitions';

// Main TaskSmasher App component
const TaskSmasherApp: React.FC = () => {
  // Use a default use case
  const initialUseCase = 'daily';

  return (
    <ReCaptchaProvider>
      <TasksProvider initialUseCase={initialUseCase}>
        <TaskSmasherContent />
      </TasksProvider>
    </ReCaptchaProvider>
  );
};

// Separate component to use the TasksContext
const TaskSmasherContent: React.FC = () => {
  const {
    selectedModel,
    setSelectedModel,
    totalCost,
    rateLimited,
    rateLimitInfo,
    executionCount,
    boards,
    setBoards,
    newTask,
    setNewTask,
    editingBoardId,
    setEditingBoardId,
    activeTask,
    feedback,
    setFeedback,
    generating,
    showContextInput,
    setShowContextInput,
    contextInput,
    setContextInput,
    isListening,
    breakdownLevel,
    setBreakdownLevel,
    filterPriority,
    setFilterPriority,
    filterRating,
    setFilterRating,
    activeId,
    setActiveId,
    isDraggingOver,
    setIsDraggingOver,
    editing,
    taskMismatch,
    setTaskMismatch,
    handleAddTask,
    startEditing,
    handleEditSave,
    updateTaskPriority,
    addSubtask,
    updateBoardTitle,
    toggleExpanded,
    startVoiceInput,
    stopVoiceInput,
    handleUndo,
    regenerateTask,
    handleGenerateSubtasks,
    handleSelectUseCase,
    selectedUseCase,
    handleGenerateIdeas,
    toggleComplete,
    showFeedback,
    submitFeedback,
    updateContext,
    deleteTask,
    getFilteredTasks
  } = useTasksContext();

  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [sliderExpanded, setSliderExpanded] = useState(false);
  const [showOpenAIExample, setShowOpenAIExample] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setIsDraggingOver(null);
    
    if (!over?.id || !active?.id) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTask = boards.flatMap(b => b.tasks).find(t => t.id === activeId);
    const sourceBoard = boards.find(b => b.tasks.some(t => t.id === activeId));
    
    if (!activeTask || !sourceBoard) return;

    const targetBoard = boards.find(b => b.id === overId);
    if (targetBoard) {
      // Add smash effect when dropping on a board
      const overElement = document.getElementById(overId as string);
      if (overElement) {
        const rect = overElement.getBoundingClientRect();
        addSmashEffectAt(rect.left + rect.width/2, rect.top + rect.height/2);
      }
      
      if (sourceBoard.id !== targetBoard.id) {
        setBoards(boards.map(board => {
          if (board.id === sourceBoard.id) {
            return {
              ...board,
              tasks: board.tasks.filter(t => t.id !== activeTask.id)
            };
          }
          if (board.id === targetBoard.id) {
            return {
              ...board,
              tasks: [...board.tasks, { ...activeTask, boardId: targetBoard.id }]
            };
          }
          return board;
        }));
      }
      return;
    }

    const overTask = boards.flatMap(b => b.tasks).find(t => t.id === overId);
    if (!overTask || overTask.boardId !== activeTask.boardId) return;

    setBoards(boards.map(board => {
      if (board.id !== sourceBoard.id) return board;

      const oldIndex = board.tasks.findIndex(t => t.id === activeId);
      const newIndex = board.tasks.findIndex(t => t.id === overId);

      return {
        ...board,
        tasks: arrayMove(board.tasks, oldIndex, newIndex)
      };
    }));
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (!event.active?.id) return;
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragEndEvent) => {
    if (!event.over) {
      setIsDraggingOver(null);
      return;
    }
    setIsDraggingOver(event.over.id as string);
  };

  const activeTaskObject = activeId 
    ? boards.flatMap(b => b.tasks).find(t => t.id === activeId)
    : null;
    
  // Add visual smash effect on drag and drop
  const addSmashEffectAt = (x: number, y: number) => {
    // Create container
    const effect = document.createElement("div");
    effect.className = "absolute pointer-events-none z-[1000]";
    effect.style.top = `${y - 40}px`;
    effect.style.left = `${x - 40}px`;
    
    // Add SVG star
    effect.innerHTML = `
      <div class="smash-effect">
        <svg viewBox="0 0 100 100" width="80" height="80">
          <polygon class="smash-star" points="50,0 61,35 95,35 67,57 79,90 50,70 21,90 33,57 5,35 39,35" fill="var(--primary-color)" />
        </svg>
        <div class="smash-text">SMASH!</div>
      </div>
    `;
    
    // Add to page and remove after animation
    document.body.appendChild(effect);
    setTimeout(() => {
      document.body.removeChild(effect);
    }, 800);
  };

  // Add useEffect to handle fade-in animation when app loads
  useEffect(() => {
    // Add CSS animation styles dynamically
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shrink {
        0% { width: 100%; }
        100% { width: 0%; }
      }
      
      .animate-in {
        animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      }
      
      .animate-out {
        animation: pop-out 0.5s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards;
      }
      
      @keyframes pop-in {
        0% { transform: translate(-50%, -30%) scale(0.95); opacity: 0; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      }
      
      @keyframes pop-out {
        0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        100% { transform: translate(-50%, -30%) scale(0.95); opacity: 0; }
      }

      .smash-effect {
        position: relative;
        animation: smash-anim 0.8s ease-out forwards;
      }
      
      .smash-star {
        animation: star-spin 0.8s ease-out forwards;
        transform-origin: center;
      }
      
      .smash-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-weight: bold;
        font-size: 14px;
        text-shadow: 0 1px 3px rgba(0,0,0,0.3);
      }
      
      @keyframes smash-anim {
        0% { transform: scale(0.2); opacity: 0; }
        20% { transform: scale(1.2); opacity: 1; }
        100% { transform: scale(1.5); opacity: 0; }
      }
      
      @keyframes star-spin {
        0% { transform: rotate(0deg) scale(0.2); }
        20% { transform: rotate(180deg) scale(1.2); }
        100% { transform: rotate(360deg) scale(1.5); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex">
      <Sidebar 
        selectedUseCase={selectedUseCase || 'daily'} 
        onSelectUseCase={handleSelectUseCase} 
      />
      
      <div className="flex-1 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 overflow-auto transition-colors duration-500" 
           style={{
             background: `linear-gradient(135deg, var(--primary-light) 0%, white 50%, var(--secondary-light) 100%)`
           }}>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/80 p-4 mb-6 transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white w-full sm:w-[250px] appearance-none bg-no-repeat bg-right"
                style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23555%22%20d%3D%22M6%208L0%202h12z%22%2F%3E%3C%2Fsvg%3E')", backgroundPosition: "right 0.5rem center", paddingRight: "2rem" }}
              >
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-4o">GPT-4o</option>
              </select>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-600">API Calls: {executionCount}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span className="text-gray-600">Estimated cost: ${totalCost.toFixed(4)}</span>
              </div>
            </div>
          </div>
        </div>

        <header className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <img src="/tools/task-smasher/assets/AITaskSmasher-small.png" alt="TaskSmasher Logo" className="w-8 h-8" />
              <h1 className="text-2xl font-bold text-gray-900">
                TaskSmasher {selectedUseCase && useCaseDefinitions[selectedUseCase]?.label}
              </h1>
              <div className="ml-4 text-sm text-gray-500">AI-powered task management</div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => exportToExcel(boards)}
                className="text-gray-700 px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span className="hidden sm:inline">Excel</span>
              </button>
              <button
                onClick={() => exportToPDF(boards)}
                className="text-gray-700 px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2"
              >
                <FilePdf className="w-4 h-4" />
                <span className="hidden sm:inline">PDF</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-stretch flex-grow gap-2">
              <form onSubmit={handleAddTask} className="flex-grow flex items-center relative">
                <input
                  type="text"
                  placeholder="Add a new task..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                />
                <button
                  type="button"
                  onClick={isListening ? stopVoiceInput : startVoiceInput}
                  className={`absolute right-4 text-gray-400 hover:text-gray-600 ${isListening ? 'text-red-500 hover:text-red-700' : ''}`}
                >
                  <Mic className="w-5 h-5" />
                </button>
              </form>
              <button
                type="submit"
                onClick={(e) => {
                  handleAddTask(e as React.FormEvent);
                  // Add smash effect when adding task
                  const buttonRect = (e.target as HTMLElement).getBoundingClientRect();
                  addSmashEffectAt(buttonRect.left + buttonRect.width/2, buttonRect.top + buttonRect.height/2);
                }}
                disabled={!newTask.trim()}
                className="premium-button py-2 px-4 rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, var(--primary-color), color-mix(in srgb, var(--primary-color) 70%, white))`
                }}
              >
                <Plus className="w-5 h-5" />
                <span>Add Task</span>
              </button>
              
              <div className="relative">
                <button
                  className="py-2 px-4 border border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-gray-50 rounded-lg flex items-center gap-2 h-full transition-colors duration-200"
                  onClick={(e) => {
                    handleGenerateIdeas();
                    // Add smash effect when generating ideas
                    const buttonRect = (e.target as HTMLElement).getBoundingClientRect();
                    addSmashEffectAt(buttonRect.left + buttonRect.width/2, buttonRect.top + buttonRect.height/2);
                  }}
                >
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  <span className="hidden sm:inline text-gray-700">Need Ideas?</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mt-4">
            {/* Filters Button */}
            <button 
              className="flex items-center gap-2 px-3 py-2 bg-white/80 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium shadow-sm transition-all duration-200"
              onClick={() => setFiltersExpanded(!filtersExpanded)}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {filtersExpanded ? 
                <ChevronUp className="w-4 h-4 ml-1" /> : 
                <ChevronDown className="w-4 h-4 ml-1" />
              }
            </button>
            
            {/* Undo button next to filters */}
            <button
              onClick={handleUndo}
              className="flex items-center gap-2 px-3 py-2 bg-white/80 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium shadow-sm transition-all duration-200"
              title="Undo last action"
            >
              <Undo className="w-4 h-4" />
              <span>Undo</span>
            </button>
          </div>
        </header>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {boards.map(board => (
              <div id={board.id} key={board.id}>
                <Board
                  board={board}
                  tasks={getFilteredTasks(board.id)}
                  editingBoardId={editingBoardId}
                  setEditingBoardId={setEditingBoardId}
                  updateBoardTitle={updateBoardTitle}
                  onToggleExpanded={toggleExpanded}
                  onToggleComplete={toggleComplete}
                  onShowFeedback={showFeedback}
                  onDeleteTask={deleteTask}
                  onGenerateSubtasks={handleGenerateSubtasks}
                  onAddSubtask={addSubtask}
                  onRegenerateTask={regenerateTask}
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
                  isDraggingOver={isDraggingOver}
                />
              </div>
            ))}
          </div>

          <DragOverlay>
            {activeId && activeTaskObject ? (
              <div className="opacity-80">
                <Task
                  task={activeTaskObject}
                  boardId={activeTaskObject.boardId || ''}
                  onToggleExpanded={toggleExpanded}
                  onToggleComplete={toggleComplete}
                  onShowFeedback={showFeedback}
                  onDeleteTask={deleteTask}
                  onGenerateSubtasks={handleGenerateSubtasks}
                  onAddSubtask={addSubtask}
                  onRegenerateTask={regenerateTask}
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
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {taskMismatch.showing && (
          <TaskMismatchPopup
            isVisible={taskMismatch.showing}
            reason={taskMismatch.reason}
            suggestedUseCase={taskMismatch.suggestedUseCase}
            onClose={() => setTaskMismatch({ ...taskMismatch, showing: false })}
            onSwitchUseCase={(useCase) => {
              handleSelectUseCase(useCase);
              setTaskMismatch({ ...taskMismatch, showing: false });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TaskSmasherApp;
