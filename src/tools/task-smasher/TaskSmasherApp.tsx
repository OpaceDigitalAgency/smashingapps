import React from 'react';

// Import the TaskSmasher components
import Board from './components/Board';
import Sidebar from './components/Sidebar';
import { TasksProvider } from './hooks/useTasksContext';
import { useTasksContext } from './hooks/useTasksContext';
import ReCaptchaProvider from './components/ReCaptchaProvider';
import TaskMismatchPopup from './components/TaskMismatchPopup';

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
    boards,
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

  return (
    <div className="min-h-screen w-full flex">
      <Sidebar 
        selectedUseCase={selectedUseCase || 'daily'} 
        onSelectUseCase={handleSelectUseCase} 
      />
      
      <div className="flex-1 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 overflow-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/80 p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <h1 className="text-2xl font-bold text-gray-900">
                TaskSmasher
              </h1>
              <div className="ml-4 text-sm text-gray-500">AI-powered task management</div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <form onSubmit={handleAddTask} className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {boards.map((board) => (
            <Board
              key={board.id}
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
          ))}
        </div>
      </div>
      
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
  );
};

export default TaskSmasherApp;