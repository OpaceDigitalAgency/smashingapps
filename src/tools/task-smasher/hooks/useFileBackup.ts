import { useEffect } from 'react';
import { createBackup } from '../utils/browserBackup';

/**
 * Hook for managing file backups
 * This is a browser-compatible version that uses localStorage
 * instead of the Node.js file system
 */
export function useFileBackup(dependencies: any[] = []) {
  // Initialize the backup system
  useEffect(() => {
    console.log('Initializing browser-compatible backup system');
    // No need to create folder structures in the browser environment
  }, []);

  // Trigger backups when dependencies change
  useEffect(() => {
    if (dependencies.length > 0) {
      // Automatically create a backup when dependencies change
      // This acts as a "save point" for the application state
      const lastBackupTime = localStorage.getItem('lastAutoBackupTime');
      const now = new Date().getTime();
      
      // Only create a backup if it's been more than 5 minutes since the last one
      // to avoid spamming localStorage with too many backups
      if (!lastBackupTime || now - parseInt(lastBackupTime) > 5 * 60 * 1000) {
        createBackup();
        localStorage.setItem('lastAutoBackupTime', now.toString());
      }
    }
  }, dependencies);

  return {
    // The browser version doesn't need to expose specific backup functions
    // since they're automatically handled
    isActive: true
  };
}

export default useFileBackup;