export interface Board {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  subtasks: Subtask[];
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  estimatedTime: number;
  expanded: boolean;
  boardId: string;
  context?: string;
  feedback?: number;
  regenerateCount?: number;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  estimatedTime: number;
  boardId?: string;
  feedback?: number;
  subtasks?: never[];
}

export interface EditingState {
  taskId: string | null;
  subtaskId: string | null;
  field: 'title' | 'time' | 'priority' | null;
  value: string;
}

export interface FeedbackState {
  taskId: string;
  showing: boolean;
}

export interface TaskMismatchData {
  showing: boolean;
  reason: string;
  suggestedUseCase?: string;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  used: number;
  reset: Date;
}

export interface TasksContextType {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  totalCost: number;
  executionCount: number;
  boards: Board[];
  setBoards: React.Dispatch<React.SetStateAction<Board[]>>;
  newTask: string;
  setNewTask: React.Dispatch<React.SetStateAction<string>>;
  editingBoardId: string | null;
  setEditingBoardId: React.Dispatch<React.SetStateAction<string | null>>;
  activeTask: string | null;
  feedback: FeedbackState;
  setFeedback: React.Dispatch<React.SetStateAction<FeedbackState>>;
  generating: boolean;
  showContextInput: string | null;
  setShowContextInput: React.Dispatch<React.SetStateAction<string | null>>;
  contextInput: string;
  setContextInput: React.Dispatch<React.SetStateAction<string>>;
  isListening: boolean;
  breakdownLevel: number;
  setBreakdownLevel: React.Dispatch<React.SetStateAction<number>>;
  filterPriority: 'low' | 'medium' | 'high' | 'all';
  setFilterPriority: React.Dispatch<React.SetStateAction<'low' | 'medium' | 'high' | 'all'>>;
  filterRating: 0 | 1 | 2 | 3 | 4 | 5;
  setFilterRating: React.Dispatch<React.SetStateAction<0 | 1 | 2 | 3 | 4 | 5>>;
  activeId: string | null;
  setActiveId: React.Dispatch<React.SetStateAction<string | null>>;
  isDraggingOver: string | null;
  setIsDraggingOver: React.Dispatch<React.SetStateAction<string | null>>;
  editing: EditingState;
  taskMismatch: TaskMismatchData;
  setTaskMismatch: React.Dispatch<React.SetStateAction<TaskMismatchData>>;
  rateLimited: boolean;
  rateLimitInfo: RateLimitInfo;
  handleAddTask: (e?: React.FormEvent) => Promise<void>;
  startEditing: (taskId: string, subtaskId: string | null, field: 'title' | 'time' | 'priority', currentValue: string) => void;
  handleEditSave: (boardId: string) => void;
  updateTaskPriority: (taskId: string, boardId: string, priority: 'low' | 'medium' | 'high') => void;
  addSubtask: (taskId: string, boardId: string) => void;
  updateBoardTitle: (boardId: string, newTitle: string) => void;
  toggleExpanded: (taskId: string) => void;
  startVoiceInput: () => Promise<void>;
  stopVoiceInput: () => void;
  handleUndo: () => void;
  regenerateTask: (taskId: string) => Promise<void>;
  handleGenerateSubtasks: (taskId: string) => Promise<void>;
  handleSelectUseCase: (useCase: string) => void;
  selectedUseCase: string | null;
  handleGenerateIdeas: () => Promise<void>;
  toggleComplete: (taskId: string, boardId: string) => void;
  showFeedback: (taskId: string) => void;
  submitFeedback: (taskId: string, rating: number) => void;
  updateContext: (taskId: string) => void;
  deleteTask: (taskId: string, boardId: string) => void;
  getFilteredTasks: (boardId: string) => Task[];
}

export interface SubtaskProps {
  subtask: Subtask;
  taskId: string;
  boardId: string;
  onToggleComplete: (taskId: string, boardId: string) => void;
  editing: EditingState;
  startEditing: (taskId: string, subtaskId: string | null, field: 'title' | 'time' | 'priority', currentValue: string) => void;
  handleEditSave: (boardId: string) => void;
  onDeleteTask: (taskId: string, boardId: string) => void;
  updateTaskPriority: (taskId: string, boardId: string, priority: 'low' | 'medium' | 'high') => void;
}

export interface BoardComponentProps {
  board: Board;
  tasks: Task[];
  editingBoardId: string | null;
  setEditingBoardId: React.Dispatch<React.SetStateAction<string | null>>;
  updateBoardTitle: (boardId: string, newTitle: string) => void;
  onToggleExpanded: (taskId: string) => void;
  onToggleComplete: (taskId: string, boardId: string) => void;
  onShowFeedback: (taskId: string) => void;
  onDeleteTask: (taskId: string, boardId: string) => void;
  onDelete?: (taskId: string, boardId: string) => void; // Added for compatibility
  onGenerateSubtasks: (taskId: string) => void;
  onAddSubtask: (taskId: string, boardId: string) => void;
  onRegenerateTask: (taskId: string) => void;
  showContextInput: string | null;
  setShowContextInput: React.Dispatch<React.SetStateAction<string | null>>;
  contextInput: string;
  setContextInput: React.Dispatch<React.SetStateAction<string>>;
  updateContext: (taskId: string) => void;
  generating: boolean;
  activeTask: string | null;
  editing: EditingState;
  startEditing: (taskId: string, subtaskId: string | null, field: 'title' | 'time' | 'priority', currentValue: string) => void;
  handleEditSave: (boardId: string) => void;
  updateTaskPriority: (taskId: string, boardId: string, priority: 'low' | 'medium' | 'high') => void;
  isDraggingOver: string | null;
}

export interface TaskProps {
  task: Task;
  boardId: string;
  onToggleComplete: (taskId: string, boardId: string) => void;
  onToggleExpanded: (taskId: string) => void;
  onShowFeedback: (taskId: string) => void;
  onDeleteTask?: (taskId: string, boardId: string) => void;
  onDelete?: (taskId: string, boardId: string) => void; // Added for compatibility
  onGenerateSubtasks: (taskId: string) => void;
  onAddSubtask: (taskId: string, boardId: string) => void;
  onRegenerateTask: (taskId: string) => void;
  showContextInput: string | null;
  setShowContextInput: React.Dispatch<React.SetStateAction<string | null>>;
  contextInput: string;
  setContextInput: React.Dispatch<React.SetStateAction<string>>;
  updateContext: (taskId: string) => void;
  generating: boolean;
  activeTask: string | null;
  editing: EditingState;
  startEditing: (taskId: string, subtaskId: string | null, field: 'title' | 'time' | 'priority', currentValue: string) => void;
  handleEditSave: (boardId: string) => void;
  updateTaskPriority: (taskId: string, boardId: string, priority: 'low' | 'medium' | 'high') => void;
}