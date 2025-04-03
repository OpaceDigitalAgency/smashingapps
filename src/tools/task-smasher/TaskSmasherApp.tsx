import React from 'react';
import TaskSmasherOriginalApp from '../../../tools/task-smasher/src/App';

// This component serves as a wrapper for the original Task Smasher app
// It allows us to integrate it into our unified application structure
const TaskSmasherApp: React.FC = () => {
  return <TaskSmasherOriginalApp />;
};

export default TaskSmasherApp;