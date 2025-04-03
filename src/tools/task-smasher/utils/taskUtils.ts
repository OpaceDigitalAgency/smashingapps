import * as XLSX from 'xlsx';
import { Board, Task } from '../types';

export const filterTasksByPriority = (tasks: Task[], priority: 'low' | 'medium' | 'high' | 'all'): Task[] => {
  if (priority === 'all') {
    return tasks;
  }
  return tasks.filter(task => task.priority === priority);
};

export const filterTasksByRating = (tasks: Task[], rating: 1 | 2 | 3 | 4 | 5): Task[] => {
  return tasks.filter(task => {
    // Check if the main task has the rating
    if (task.feedback === rating) return true;
    
    // Check if any subtask has the rating
    if (task.subtasks.some(subtask => subtask.feedback === rating)) return true;
    
    return false;
  });
};

export const exportToExcel = (boards: Board[]): void => {
  const workbook = XLSX.utils.book_new();
  const allData: any[] = [];
  
  boards.forEach((board) => {
    board.tasks.forEach((task) => {
      allData.push({
        'Task ID': task.id,
        'Task Title': task.title,
        'Status': board.title,
        'Priority': task.priority.charAt(0).toUpperCase() + task.priority.slice(1),
        'Estimated Hours': task.estimatedTime,
        'Completed': task.completed ? 'Yes' : 'No',
        'Type': 'Main Task',
        'Parent Task': '',
        'Subtask Count': task.subtasks.length,
        'Rating': task.feedback || 'Not rated'
      });
      
      task.subtasks.forEach((subtask) => {
        allData.push({
          'Task ID': subtask.id,
          'Task Title': subtask.title,
          'Status': board.title,
          'Priority': subtask.priority.charAt(0).toUpperCase() + subtask.priority.slice(1),
          'Estimated Hours': subtask.estimatedTime,
          'Completed': subtask.completed ? 'Yes' : 'No',
          'Type': 'Subtask',
          'Parent Task': task.title,
          'Subtask Count': '',
          'Rating': subtask.feedback || 'Not rated'
        });
      });
    });
  });
  
  const worksheet = XLSX.utils.json_to_sheet(allData);
  
  const max_width = allData.reduce((w, r) => Math.max(w, r['Task Title'].length), 10);
  worksheet['!cols'] = [
    { wch: 10 }, // Task ID
    { wch: max_width }, // Task Title
    { wch: 12 }, // Status
    { wch: 8 }, // Priority
    { wch: 8 }, // Hours
    { wch: 9 }, // Completed
    { wch: 10 }, // Type
    { wch: max_width }, // Parent Task
    { wch: 12 }, // Subtask Count
    { wch: 9 }  // Rating
  ];
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');
  XLSX.writeFile(workbook, 'TaskSmasher-Export.xlsx');
};

export const exportToPDF = (boards: Board[]): void => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>TaskSmasher Export</title>
          <style>
            body { 
              font-family: system-ui, -apple-system, sans-serif;
              line-height: 1.6;
              color: #374151;
              padding: 2rem;
            }
            h1 {
              font-size: 2rem;
              font-weight: bold;
              margin-bottom: 2rem;
              color: #1F2937;
            }
            .board {
              margin-bottom: 2.5rem;
            }
            .board-title {
              font-size: 1.5rem;
              font-weight: 600;
              margin-bottom: 1rem;
              color: #374151;
            }
            .task {
              border: 1px solid #E5E7EB;
              border-radius: 0.5rem;
              padding: 1rem;
              margin-bottom: 1rem;
            }
            .task-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 0.5rem;
            }
            .task-title {
              font-weight: 600;
              color: #1F2937;
            }
            .task-meta {
              color: #6B7280;
              font-size: 0.875rem;
            }
            .subtasks {
              margin-top: 0.75rem;
              padding-left: 1rem;
              border-left: 2px solid #E5E7EB;
            }
            .subtask {
              display: flex;
              justify-content: space-between;
              padding: 0.25rem 0;
              color: #4B5563;
            }
            .priority-high { color: #DC2626; }
            .priority-medium { color: #D97706; }
            .priority-low { color: #6B7280; }
            .rating { 
              color: #FBBF24;
              margin-left: 0.5rem;
            }
            @media print {
              @page {
                margin: 2cm;
              }
              body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <h1>TaskSmasher Export</h1>
          ${boards.map(board => `
            <div class="board">
              <h2 class="board-title">${board.title}</h2>
              ${board.tasks.map(task => `
                <div class="task">
                  <div class="task-header">
                    <span class="task-title">${task.title}</span>
                    <span class="task-meta priority-${task.priority}" style="font-weight: 500;">
                      ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                      ${task.feedback ? `<span class="rating">${'★'.repeat(task.feedback)}</span>` : ''}
                    </span>
                  </div>
                  <div class="task-meta">
                    Estimated: ${task.estimatedTime}h • Status: ${task.completed ? 'Completed' : 'In Progress'}
                  </div>
                  ${task.subtasks && task.subtasks.length > 0 ? `
                    <div class="subtasks">
                      ${task.subtasks.map(subtask => `
                        <div class="subtask">
                          <span style="font-weight: 500;">${subtask.title}</span>
                          <span class="task-meta">
                            ${subtask.estimatedTime}h • ${subtask.completed ? '✓' : '○'}
                            ${subtask.feedback ? `<span class="rating">${'★'.repeat(subtask.feedback)}</span>` : ''}
                          </span>
                        </div>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          `).join('')}
          <script>
            window.onload = () => {
              window.print();
              window.onfocus = () => window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
};