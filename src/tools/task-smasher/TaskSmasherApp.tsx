import React, { useEffect } from 'react';

// This component serves as a redirect to the original TaskSmasher app
// This preserves all the functionality while we work on proper integration
const TaskSmasherApp: React.FC = () => {
  useEffect(() => {
    // Get the current path
    const currentPath = window.location.pathname;
    
    // Extract the use case path if it exists
    let redirectPath = 'https://singular-palmier-8967b3.netlify.app/tools/task-smasher/';
    
    // Check if we're on a specific use case page
    if (currentPath.includes('/tools/task-smasher/') && currentPath !== '/tools/task-smasher/' && currentPath !== '/tools/task-smasher') {
      // Extract the use case part (e.g., "daily-organizer")
      const useCasePath = currentPath.split('/tools/task-smasher/')[1];
      
      // Add it to the redirect URL
      if (useCasePath) {
        redirectPath = `https://singular-palmier-8967b3.netlify.app/tools/task-smasher/${useCasePath}`;
      }
    }
    
    // Redirect to the appropriate URL
    window.location.href = redirectPath;
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