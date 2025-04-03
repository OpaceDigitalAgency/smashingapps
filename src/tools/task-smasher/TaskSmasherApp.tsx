import React from 'react';

// A simplified version of the TaskSmasher app that doesn't redirect
const TaskSmasherApp: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex">
      <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col gap-2 shadow-sm z-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Use Case Categories</h2>
        <div className="flex flex-col gap-2">
          <a href="/tools/task-smasher/daily-organizer/" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700">
            <span>Daily Organizer</span>
          </a>
          <a href="/tools/task-smasher/goal-planner/" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50">
            <span>Goal Planner</span>
          </a>
          <a href="/tools/task-smasher/marketing-tasks/" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50">
            <span>Marketing Tasks</span>
          </a>
        </div>
      </div>
      
      <div className="flex-1 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 overflow-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/80 p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <h1 className="text-2xl font-bold text-gray-900">
                TaskSmasher
              </h1>
              <div className="ml-4 text-sm text-gray-500">AI-powered task management</div>
            </div>
          </div>
        </div>
        
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="text-xl font-semibold">Manage Your Tasks</h2>
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/90 rounded-lg border border-gray-200 p-4 shadow-sm">
            <h3 className="font-medium text-gray-900 mb-3">To Do</h3>
            <div className="space-y-2">
              <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Create project plan</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">High</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 rounded-lg border border-gray-200 p-4 shadow-sm">
            <h3 className="font-medium text-gray-900 mb-3">In Progress</h3>
            <div className="space-y-2">
              <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Design wireframes</span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Medium</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 rounded-lg border border-gray-200 p-4 shadow-sm">
            <h3 className="font-medium text-gray-900 mb-3">Completed</h3>
            <div className="space-y-2">
              <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-500 line-through">Research competitors</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Done</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskSmasherApp;