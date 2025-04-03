import React, { useEffect } from 'react';

// This component serves as a redirect to the original TaskSmasher app
// This preserves all the functionality while we work on proper integration
const TaskSmasherApp: React.FC = () => {
  useEffect(() => {
    // Redirect to the original TaskSmasher app URL
    window.location.href = 'https://singular-palmier-8967b3.netlify.app/tools/task-smasher/';
  }, []);
  
  // Return a loading message while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Redirecting to TaskSmasher...</h2>
        <p>Please wait while we redirect you to the full TaskSmasher application.</p>
      </div>
    </div>
  );
};

export default TaskSmasherApp;