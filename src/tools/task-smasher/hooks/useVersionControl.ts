import { useCallback, useState } from 'react';
import { createBackup, listBackups, restoreFromBackup } from '../utils/versionControl';

export function useVersionControl() {
  const [backupHistory, setBackupHistory] = useState<Record<string, string[]>>({});
  const [lastBackupPath, setLastBackupPath] = useState<string | null>(null);

  /**
   * Creates a backup of a file
   */
  const backupFile = useCallback((filePath: string) => {
    try {
      const backupPath = createBackup(filePath);
      setLastBackupPath(backupPath);
      
      // Update history
      setBackupHistory(prev => {
        const fileBackups = [...(prev[filePath] || []), backupPath];
        return {
          ...prev,
          [filePath]: fileBackups
        };
      });
      
      return backupPath;
    } catch (error) {
      console.error('Failed to create backup:', error);
      return null;
    }
  }, []);

  /**
   * Gets all backups for a file
   */
  const getBackups = useCallback((filePath: string) => {
    try {
      const backups = listBackups(filePath);
      setBackupHistory(prev => ({
        ...prev,
        [filePath]: backups
      }));
      return backups;
    } catch (error) {
      console.error('Failed to list backups:', error);
      return [];
    }
  }, []);

  /**
   * Restores a file from a backup
   */
  const restoreBackup = useCallback((backupPath: string, originalPath?: string) => {
    try {
      restoreFromBackup(backupPath, originalPath);
      return true;
    } catch (error) {
      console.error('Failed to restore backup:', error);
      return false;
    }
  }, []);

  return {
    backupFile,
    getBackups,
    restoreBackup,
    backupHistory,
    lastBackupPath
  };
}