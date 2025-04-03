import { useState, useEffect, useCallback, useRef } from 'react';
import { Board, EditingState, FeedbackState, Task, TaskMismatchData, TasksContextType, RateLimitInfo } from '../types';
import { filterTasksByPriority, filterTasksByRating } from '../utils/taskUtils';
import { validateTaskLocally, validateTaskWithAI } from '../utils/taskContextValidator';
import OpenAIService from '../utils/openaiService';
import useReCaptcha from './useReCaptcha';

export function useTasks(initialUseCase?: string): TasksContextType {
  // Removed openAIKey state as we're now using the proxy
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [totalCost, setTotalCost] = useState(() => {
    const savedCost = localStorage.getItem('totalCost');
    return savedCost ? parseFloat(savedCost) : 0;
  });
  const [executionCount, setExecutionCount] = useState(() => {
    const savedCount = localStorage.getItem('executionCount');
    return savedCount ? parseInt(savedCount, 10) : 0;
  });
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>('daily');
  const [rateLimited, setRateLimited] = useState(() => {
    const savedRateLimited = localStorage.getItem('rateLimited');
    return savedRateLimited ? savedRateLimited === 'true' : false;
  });
  
  const [rateLimitInfo, setRateLimitInfo] = useState<{ limit: number; remaining: number; used: number; reset: Date }>(() => {
    const savedRateLimitInfo = localStorage.getItem('rateLimitInfo');
    if (savedRateLimitInfo) {
      try {
        const parsed = JSON.parse(savedRateLimitInfo);
        return {
          ...parsed,
          reset: new Date(parsed.reset) // Convert the ISO string back to a Date object
        };
      } catch (e) {
        console.error('Error parsing rateLimitInfo from localStorage:', e);
      }
    }
    return {
      limit: 20,
      remaining: 20,
      used: 0,
      reset: new Date(Date.now() + 3600000)
    };
  });
  
  const [boards, setBoards] = useState<Board[]>([
    { id: 'todo', title: 'To Do', tasks: [] },
    { id: 'inprogress', title: 'In Progress', tasks: [] },
    { id: 'done', title: 'Done', tasks: [] }
  ]);
  
  const [newTask, setNewTask] = useState('');
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>({ taskId: '', showing: false });
  const [generating, setGenerating] = useState(false);
  const [showContextInput, setShowContextInput] = useState<string | null>(null);
  const [contextInput, setContextInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [breakdownLevel, setBreakdownLevel] = useState(3);
  const [filterPriority, setFilterPriority] = useState<'low' | 'medium' | 'high' | 'all'>('all');
  const [filterRating, setFilterRating] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<string | null>(null);
  const [editing, setEditing] = useState<EditingState>({
    taskId: null,
    subtaskId: null,
    field: null,
    value: ''
  });
  
  // Task mismatch states
  const [taskMismatch, setTaskMismatch] = useState<TaskMismatchData>({
    showing: false,
    reason: '',
    suggestedUseCase: undefined
  });
  
  // History for undo functionality
  const [history, setHistory] = useState<Board[][]>([]);
  
  // Refs for voice input
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Check if audio recording is available
  const audioAvailable = typeof window !== 'undefined' && 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;

  useEffect(() => {
    if (selectedUseCase) {
      document.documentElement.style.setProperty('--primary-color', `var(--${selectedUseCase}-primary)`);
      document.documentElement.style.setProperty('--primary-light', `var(--${selectedUseCase}-light)`);
      document.documentElement.style.setProperty('--secondary-light', `var(--${selectedUseCase}-secondary)`);
    }
  }, [selectedUseCase]);

  // Initialize with provided use case or default to daily organizer
  useEffect(() => {
    handleSelectUseCase(initialUseCase || 'daily');
  }, [initialUseCase]);
  
  // Add CSS animation styles dynamically
  useEffect(() => {
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
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  // Save executionCount to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('executionCount', executionCount.toString());
  }, [executionCount]);
  
  // Save rateLimited to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('rateLimited', rateLimited.toString());
  }, [rateLimited]);
  
  // Save rateLimitInfo to localStorage when it changes
  useEffect(() => {
    const rateLimitInfoForStorage = {
      ...rateLimitInfo,
      reset: rateLimitInfo.reset.toISOString() // Convert Date to ISO string for storage
    };
    localStorage.setItem('rateLimitInfo', JSON.stringify(rateLimitInfoForStorage));
  }, [rateLimitInfo]);
  
  // Synchronize with server-side rate limit information on page load
  useEffect(() => {
    const syncRateLimitWithServer = async () => {
      try {
        console.log('Synchronizing with server rate limit on page load');
        
        // First check if we have rate limit info in localStorage
        const storedRateLimitInfo = localStorage.getItem('rateLimitInfo');
        let localRateLimit: RateLimitInfo | null = null;
        
        if (storedRateLimitInfo) {
          try {
            console.log('Found stored rate limit info in localStorage');
            const parsedInfo = JSON.parse(storedRateLimitInfo);
            console.log('Parsed stored rate limit info:', parsedInfo);
            
            // Check if the stored info is still valid (not expired)
            const resetTime = new Date(parsedInfo.reset);
            if (resetTime > new Date()) {
              // The stored info is still valid
              localRateLimit = {
                limit: parsedInfo.limit,
                remaining: parsedInfo.remaining,
                reset: resetTime,
                used: parsedInfo.used
              };
              
              // Update the client-side state with the localStorage information
              setRateLimitInfo(localRateLimit);
              setExecutionCount(localRateLimit.used);
              setRateLimited(localRateLimit.remaining === 0);
              
              console.log('Using stored rate limit info:', localRateLimit);
            } else {
              console.log('Stored rate limit info is expired');
            }
          } catch (e) {
            console.error('Error parsing stored rate limit info:', e);
          }
        }
        
        // If we don't have valid stored info, get it from the server
        if (!localRateLimit) {
          // Get the current rate limit status from the server
          const serverRateLimit = await OpenAIService.getRateLimitStatus();
          console.log('Received server rate limit:', serverRateLimit);
          
          // Update the client-side state with the server-side information
          setRateLimitInfo(serverRateLimit);
          setExecutionCount(serverRateLimit.used);
          setRateLimited(serverRateLimit.remaining === 0);
          
          console.log('Updated state with server rate limit info');
        }
      } catch (error) {
        console.error('Error synchronizing with server rate limit:', error);
      }
    };
    
    // Call the synchronization function on page load
    syncRateLimitWithServer();
  }, []);
  
  // Function to synchronize rate limit info after each API call
  const syncRateLimitInfo = useCallback((rateLimit: RateLimitInfo) => {
    console.log('Synchronizing rate limit info after API call:', rateLimit);
    
    // Update the rateLimitInfo state
    setRateLimitInfo(rateLimit);
    
    // Update the executionCount to match the server's used count
    setExecutionCount(rateLimit.used);
    console.log('Updated executionCount to:', rateLimit.used);
    
    // Update the rateLimited state based on the server response
    setRateLimited(rateLimit.remaining === 0);
    console.log('Updated rateLimited to:', rateLimit.remaining === 0);
    
    // Store the updated rate limit info in localStorage directly
    // This is in addition to the useEffect that watches rateLimitInfo
    localStorage.setItem('rateLimitInfo', JSON.stringify({
      limit: rateLimit.limit,
      remaining: rateLimit.remaining,
      reset: rateLimit.reset.toISOString(),
      used: rateLimit.used
    }));
    
    // Also update the apiCallCount in localStorage
    localStorage.setItem('apiCallCount', rateLimit.used.toString());
    console.log('Saved rate limit info and API call count to localStorage');
  }, []);
  
  
  // Save totalCost to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('totalCost', totalCost.toString());
  }, [totalCost]);

  // Get the reCAPTCHA token generator
  const { getReCaptchaToken } = useReCaptcha();
  
  const checkTaskContext = useCallback(async (taskText: string) => {
    if (!selectedUseCase || !taskText.trim()) return true;
    
    try {
      // Get reCAPTCHA token
      const recaptchaToken = await getReCaptchaToken('validate_task');
      
      // Use the updated validateTaskWithAI function that uses the proxy
      const result = await validateTaskWithAI(taskText, selectedUseCase, recaptchaToken);
      
      // The validateTaskWithAI function doesn't return the rate limit info directly,
      // so we need to sync with the server to get the latest rate limit info
      const serverRateLimit = await OpenAIService.getRateLimitStatus();
      syncRateLimitInfo(serverRateLimit);
      
      if (!result.isValid && result.confidence > 0.6) {
        setTaskMismatch({
          showing: true,
          reason: result.reason,
          suggestedUseCase: result.suggestedUseCase
        });
        return false;
      }
      
      return true;
    } catch (error) {
      // Check if the error is due to rate limiting
      if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
        setRateLimited(true);
        // Use local validation as fallback
        const result = validateTaskLocally(taskText, selectedUseCase);
        return result.isValid || result.confidence <= 0.6;
      }
      
      console.error('Error validating task context:', error);
      return true;
    }
  }, [selectedUseCase, getReCaptchaToken, syncRateLimitInfo]);

  const handleAddTask = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (newTask.trim()) {
      // Check if task matches selected use case
      const isContextValid = await checkTaskContext(newTask);
      
      // Continue with task creation
      setHistory(prev => [...prev, boards]);
      
      setBoards(prev => {
        const todoBoard = prev.find(board => board.id === 'todo');
        if (!todoBoard) return prev;
        
        return prev.map(board => {
          if (board.id === 'todo') {
            return {
              ...board,
              tasks: [
                ...board.tasks,
                {
                  id: `task-${Date.now()}`,
                  title: newTask.trim(),
                  subtasks: [],
                  completed: false,
                  priority: 'medium',
                  estimatedTime: 1,
                  expanded: false,
                  boardId: 'todo'
                }
              ]
            };
          }
          return board;
        });
      });
      
      setNewTask('');
    }
  }, [newTask, boards, checkTaskContext]);
  
  const startEditing = useCallback((
    taskId: string, 
    subtaskId: string | null, 
    field: 'title' | 'time' | 'priority', 
    currentValue: string
  ) => {
    setEditing({
      taskId,
      subtaskId,
      field,
      value: currentValue
    });
  }, []);

  const handleEditSave = useCallback((boardId: string) => {
    const { taskId, subtaskId, field, value } = editing;
    
    if (!taskId || !field) {
      setEditing({ taskId: null, subtaskId: null, field: null, value: '' });
      return;
    }
    
    setHistory(prev => [...prev, boards]);
    
    setBoards(prevBoards => {
      return prevBoards.map(board => {
        if (board.id !== boardId) return board;
        
        return {
          ...board,
          tasks: board.tasks.map(task => {
            // If we're editing a subtask
            if (subtaskId && task.id === taskId) {
              return {
                ...task,
                subtasks: task.subtasks.map(subtask => {
                  if (subtask.id === subtaskId) {
                    if (field === 'title') {
                      return { ...subtask, title: value };
                    } else if (field === 'time') {
                      const time = parseFloat(value) || 0;
                      return { ...subtask, estimatedTime: time };
                    } else if (field === 'priority') {
                      return { ...subtask, priority: value as 'low' | 'medium' | 'high' };
                    }
                  }
                  return subtask;
                })
              };
            }
            
            // If we're editing the main task
            if (!subtaskId && task.id === taskId) {
              if (field === 'title') {
                return { ...task, title: value };
              } else if (field === 'time') {
                const time = parseFloat(value) || 0;
                return { ...task, estimatedTime: time };
              } else if (field === 'priority') {
                return { ...task, priority: value as 'low' | 'medium' | 'high' };
              }
            }
            
            return task;
          })
        };
      });
    });
    
    setEditing({ taskId: null, subtaskId: null, field: null, value: '' });
  }, [editing, boards]);

  const updateTaskPriority = useCallback((taskId: string, boardId: string, priority: 'low' | 'medium' | 'high') => {
    setHistory(prev => [...prev, boards]);
    
    setBoards(prevBoards => {
      return prevBoards.map(board => {
        if (board.id !== boardId) return board;
        
        return {
          ...board,
          tasks: board.tasks.map(task => {
            // Check if this is a main task
            if (task.id === taskId) {
              return { ...task, priority };
            }
            
            // Check if this is a subtask
            const updatedSubtasks = task.subtasks.map(subtask => {
              if (subtask.id === taskId) {
                return { ...subtask, priority };
              }
              return subtask;
            });
            
            if (task.subtasks.some(st => st.id === taskId)) {
              return { ...task, subtasks: updatedSubtasks };
            }
            
            return task;
          })
        };
      });
    });
  }, [boards]);
  
  const addSubtask = useCallback((taskId: string, boardId: string) => {
    setHistory(prev => [...prev, boards]);
    
    setBoards(prevBoards => {
      return prevBoards.map(board => {
        if (board.id !== boardId) return board;
        
        return {
          ...board,
          tasks: board.tasks.map(task => {
            if (task.id !== taskId) return task;
            
            return {
              ...task,
              expanded: true,
              subtasks: [
                ...task.subtasks,
                {
                  id: `subtask-${Date.now()}-${task.subtasks.length}`,
                  title: 'New subtask',
                  subtasks: [],
                  completed: false,
                  priority: task.priority,
                  estimatedTime: 0.5,
                  boardId
                }
              ]
            };
          })
        };
      });
    });
  }, [boards]);
  
  const updateBoardTitle = useCallback((boardId: string, newTitle: string) => {
    setHistory(prev => [...prev, boards]);
    
    setBoards(prevBoards => {
      return prevBoards.map(board => {
        if (board.id !== boardId) return board;
        return { ...board, title: newTitle };
      });
    });
  }, [boards]);
  
  const toggleExpanded = useCallback((taskId: string) => {
    setBoards(prevBoards => {
      return prevBoards.map(board => {
        return {
          ...board,
          tasks: board.tasks.map(task => {
            if (task.id !== taskId) return task;
            return { ...task, expanded: !task.expanded };
          })
        };
      });
    });
  }, []);
  
  const toggleComplete = useCallback((taskId: string, boardId: string) => {
    setHistory(prev => [...prev, boards]);
    
    setBoards(prevBoards => {
      return prevBoards.map(board => {
        if (board.id !== boardId) return board;
        
        return {
          ...board,
          tasks: board.tasks.map(task => {
            // If this is the main task
            if (task.id === taskId) {
              const newCompleted = !task.completed;
              
              // If completing the main task, complete all subtasks too
              if (newCompleted) {
                return {
                  ...task,
                  completed: newCompleted,
                  subtasks: task.subtasks.map(st => ({ ...st, completed: true }))
                };
              }
              
              return { ...task, completed: newCompleted };
            }
            
            // Check if this is a subtask
            const updatedSubtasks = task.subtasks.map(subtask => {
              if (subtask.id === taskId) {
                return { ...subtask, completed: !subtask.completed };
              }
              return subtask;
            });
            
            // Check if all subtasks are complete
            const allSubtasksComplete = updatedSubtasks.length > 0 && 
              updatedSubtasks.every(st => st.completed);
            
            return {
              ...task,
              subtasks: updatedSubtasks,
              completed: allSubtasksComplete
            };
          })
        };
      });
    });
  }, [boards]);

  const showFeedback = useCallback((taskId: string) => {
    setFeedback({ taskId, showing: true });
  }, []);
  
  const submitFeedback = useCallback((taskId: string, rating: number) => {
    setHistory(prev => [...prev, boards]);
    
    setBoards(prevBoards => {
      return prevBoards.map(board => {
        return {
          ...board,
          tasks: board.tasks.map(task => {
            if (task.id === taskId || task.subtasks.some(st => st.id === taskId)) {
              return {
                ...task,
                feedback: rating,
                subtasks: task.subtasks.map(st => {
                  if (st.id === taskId) {
                    return { ...st, feedback: rating };
                  }
                  return st;
                })
              };
            }
            return task;
          })
        };
      });
    });
    
    setFeedback({ taskId: '', showing: false });
  }, [boards]);
  
  const updateContext = useCallback((taskId: string) => {
    if (!contextInput.trim()) {
      setShowContextInput(null);
      setContextInput('');
      return;
    }
    
    setHistory(prev => [...prev, boards]);
    
    setBoards(prevBoards => {
      return prevBoards.map(board => {
        return {
          ...board,
          tasks: board.tasks.map(task => {
            if (task.id === taskId) {
              return { ...task, context: contextInput };
            }
            return task;
          })
        };
      });
    });
    
    setShowContextInput(null);
    setContextInput('');
  }, [contextInput, boards]);
  
  const deleteTask = useCallback((taskId: string, boardId: string) => {
    setHistory(prev => [...prev, boards]);
    
    setBoards(prevBoards => {
      return prevBoards.map(board => {
        if (board.id !== boardId) return board;
        
        // First check if it's a main task
        const updatedTasks = board.tasks.filter(task => task.id !== taskId);
        
        if (updatedTasks.length < board.tasks.length) {
          return { ...board, tasks: updatedTasks };
        }
        
        // If it's not a main task, check subtasks
        return {
          ...board,
          tasks: board.tasks.map(task => {
            return {
              ...task,
              subtasks: task.subtasks.filter(st => st.id !== taskId)
            };
          })
        };
      });
    });
  }, [boards]);
  
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    
    const previousState = history[history.length - 1];
    setBoards(previousState);
    setHistory(prev => prev.slice(0, -1));
  }, [history]);

  const startVoiceInput = async () => {
    if (!audioAvailable) {
      alert('Microphone access is not available');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      
      audioChunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];
        
        // Create form data to send to API
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.webm');
        formData.append('model', 'whisper-1');
        formData.append('language', 'en');
        
        try {
          setNewTask('Processing audio...');
          
          // Use local transcription or disable this feature
          setNewTask('Voice transcription is not available without direct API access');
          setIsListening(false);
          return;
          
          /* Voice transcription requires direct API access and can't be proxied easily
          // This feature is disabled when using the proxy
          
          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }

          const data = await response.json();
          
          if (data.text) {
            setNewTask(data.text);
            // Auto submit after a short delay
            setTimeout(() => {
              if (data.text.trim()) {
                const formEvent = new Event('submit', { bubbles: true, cancelable: true }) as unknown as React.FormEvent;
                handleAddTask(formEvent);
              }
            }, 1000);
          }
          */
        } catch (error) {
          console.error('Error processing audio:', error);
          setNewTask(error instanceof Error ? error.message : 'Error processing audio. Please try again.');
        }
        
        setIsListening(false);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsListening(true);
      setNewTask('Recording... Click mic to stop');
      
      // Automatically stop after 10 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          stopVoiceInput();
        }
      }, 10000);
      
    } catch (error) {
      console.error('Error starting audio recording:', error);
      setNewTask('Error accessing microphone. Please check permissions.');
      setIsListening(false);
    }
  };
  
  const stopVoiceInput = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };
  
  const regenerateTask = async (taskId: string) => {
    const task = boards.flatMap(b => b.tasks).find(t => t.id === taskId);
    if (!task) return;
    
    setActiveTask(taskId);
    setGenerating(true);
    
    try {
      // Use OpenAIService to make the request through the proxy
      const { data, rateLimit } = await OpenAIService.createChatCompletion({
        model: selectedModel,
        messages: [
          {
            role: 'system',
            content: 'You are a task management AI assistant. Rewrite this task to make it clearer and more actionable.'
          },
          {
            role: 'user',
            content: `Rewrite this task to make it more clear and actionable: "${task.title}"`
          }
        ]
      });
      
      // Update rate limit information
      syncRateLimitInfo(rateLimit);
      
      if (data.choices && data.choices[0]) {
        const improvedTask = data.choices[0].message.content.trim();
        
        setHistory(prev => [...prev, boards]);
        
        setBoards(prevBoards => {
          return prevBoards.map(board => {
            return {
              ...board,
              tasks: board.tasks.map(t => {
                if (t.id === taskId) {
                  return {
                    ...t,
                    title: improvedTask,
                    regenerateCount: (t.regenerateCount || 0) + 1
                  };
                }
                return t;
              })
            };
          });
        });
        
        // Update cost
        setTotalCost(prev => prev + (data.usage?.total_tokens || 0) * 0.000002);
        
        // No need to update executionCount here as it's already updated in syncRateLimitInfo
      }
    } catch (error) {
      console.error('Error regenerating task:', error);
      
      // Check if the error is due to rate limiting
      if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
        setRateLimited(true);
        alert('Rate limit exceeded. Please try again later.');
      }
    } finally {
      setGenerating(false);
      setActiveTask(null);
    }
  };
  
  const handleGenerateSubtasks = async (taskId: string) => {
    const task = boards.flatMap(b => b.tasks).find(t => t.id === taskId);
    if (!task) return;
    
    setActiveTask(taskId);
    setGenerating(true);
    
    // Determine the appropriate number of subtasks based on task complexity
    const determineSubtaskCount = (task: any) => {
      const title = task.title.toLowerCase();
      const context = task.context ? task.context.toLowerCase() : '';
      const combinedText = title + ' ' + context;
      
      // Check for complex tasks that likely need more subtasks
      if (
        combinedText.includes('project') ||
        combinedText.includes('plan') ||
        combinedText.includes('strategy') ||
        combinedText.includes('campaign') ||
        combinedText.includes('recipe') ||
        combinedText.includes('comprehensive') ||
        combinedText.includes('complete') ||
        combinedText.includes('detailed')
      ) {
        return 5; // More complex tasks get more subtasks
      }
      
      // Check for medium complexity tasks
      if (
        combinedText.includes('create') ||
        combinedText.includes('develop') ||
        combinedText.includes('implement') ||
        combinedText.includes('organize') ||
        combinedText.includes('prepare')
      ) {
        return 4; // Medium complexity tasks
      }
      
      // Simple tasks get fewer subtasks
      if (
        combinedText.includes('check') ||
        combinedText.includes('review') ||
        combinedText.includes('simple') ||
        combinedText.includes('quick') ||
        combinedText.includes('basic')
      ) {
        return 3; // Simple tasks
      }
      
      // Default to 4 subtasks if we can't determine complexity
      return 4;
    };
    
    // Set the breakdown level based on task complexity
    const intelligentBreakdownLevel = determineSubtaskCount(task);
    setBreakdownLevel(intelligentBreakdownLevel);
    
    try {
      // Create a prompt based on the selected use case
      let systemPrompt = `You are a task management AI assistant. Break down tasks into specific, actionable subtasks. Provide ${intelligentBreakdownLevel} subtasks. Return ONLY a JSON array of subtasks in the format [{"title": "Subtask title", "estimatedTime": 0.5, "priority": "low|medium|high"}].`;
      let userPrompt = `Break down this task into ${intelligentBreakdownLevel} specific, actionable subtasks: "${task.title}"${task.context ? `\nContext: ${task.context}` : ''}`;
      
      // Customize prompts based on use case
      if (selectedUseCase === 'recipe' || task.title.toLowerCase().includes('cake') || task.title.toLowerCase().includes('recipe') || task.title.toLowerCase().includes('bake') || task.title.toLowerCase().includes('cook')) {
        // For recipes, we need to ensure we get a higher number of subtasks and specific ingredients
        const recipeSubtaskCount = Math.max(intelligentBreakdownLevel, 6); // At least 6 subtasks for recipes
        setBreakdownLevel(recipeSubtaskCount);
        
        systemPrompt = `You are a culinary expert. Break down recipes into clear steps with a DETAILED INGREDIENTS LIST first, followed by preparation steps. The first 1-3 subtasks MUST be a list of ingredients with EXACT measurements (e.g., "Ingredients: 2 eggs, 1 cup flour, 1/2 cup sugar, 2 tbsp butter, 1 tsp vanilla extract"). Return ONLY a JSON array in the format [{"title": "Step description", "estimatedTime": time_in_minutes, "priority": "low|medium|high"}].`;
        userPrompt = `Break down this recipe into ${recipeSubtaskCount} steps: "${task.title}".
IMPORTANT: The first 1-3 subtasks MUST be a detailed ingredients list with exact measurements (e.g., "Ingredients: 2 eggs, 1 cup flour, 1/2 cup sugar").
Then include detailed preparation and cooking instructions as separate steps.
Make sure to include all necessary ingredients with precise measurements before any cooking steps.${task.context ? `\nContext: ${task.context}` : ''}`;
      } else if (selectedUseCase === 'marketing') {
        systemPrompt = `You are a marketing strategist. Break down marketing tasks into actionable project steps with clear deliverables. Return ONLY a JSON array in the format [{"title": "Step with deliverable", "estimatedTime": time_in_hours, "priority": "low|medium|high"}].`;
        userPrompt = `Break down this marketing task into ${intelligentBreakdownLevel} actionable project steps: "${task.title}". Include specific deliverables, timeline, and success metrics for each step.${task.context ? `\nContext: ${task.context}` : ''}`;
      } else if (selectedUseCase === 'goals') {
        systemPrompt = `You are a goal-setting and personal development expert. Break down goals into actionable steps with measurable outcomes. Return ONLY a JSON array in the format [{"title": "Step description", "estimatedTime": time_in_days, "priority": "low|medium|high"}].`;
        userPrompt = `Break down this goal into ${intelligentBreakdownLevel} actionable steps: "${task.title}". Include specific milestones, tracking methods, and success criteria for each step.${task.context ? `\nContext: ${task.context}` : ''}`;
      } else if (selectedUseCase === 'home') {
        systemPrompt = `You are a home organization and maintenance expert. Break down home tasks into detailed steps with required materials. Return ONLY a JSON array in the format [{"title": "Step description", "estimatedTime": time_in_minutes, "priority": "low|medium|high"}].`;
        userPrompt = `Break down this home task into ${intelligentBreakdownLevel} detailed steps: "${task.title}". Include required materials, tools, and specific instructions for each step.${task.context ? `\nContext: ${task.context}` : ''}`;
      } else if (selectedUseCase === 'travel') {
        systemPrompt = `You are a travel planning expert. Break down travel plans into detailed preparation and itinerary steps. Return ONLY a JSON array in the format [{"title": "Step description", "estimatedTime": time_in_hours_or_days, "priority": "low|medium|high"}].`;
        userPrompt = `Break down this travel plan into ${intelligentBreakdownLevel} detailed steps: "${task.title}". Include preparation tasks, booking details, and daily itinerary items.${task.context ? `\nContext: ${task.context}` : ''}`;
      } else if (selectedUseCase === 'study') {
        systemPrompt = `You are an educational expert. Break down study plans into focused learning sessions with specific objectives. Return ONLY a JSON array in the format [{"title": "Study session description", "estimatedTime": time_in_hours, "priority": "low|medium|high"}].`;
        userPrompt = `Break down this study plan into ${intelligentBreakdownLevel} focused learning sessions: "${task.title}". Include specific learning objectives, resources to use, and study techniques for each session.${task.context ? `\nContext: ${task.context}` : ''}`;
      }
      
      // Use OpenAIService to make the request through the proxy
      const { data, rateLimit } = await OpenAIService.createChatCompletion({
        model: selectedModel,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ]
      });
      
      // Update rate limit information
      syncRateLimitInfo(rateLimit);
      
      if (data.choices && data.choices[0]) {
        let subtasksContent = data.choices[0].message.content.trim();
        
        // Extract the JSON array if it's wrapped in backticks
        if (subtasksContent.includes('```')) {
          subtasksContent = subtasksContent.replace(/```json|```/g, '').trim();
        }
        
        try {
          const subtasks = JSON.parse(subtasksContent);
          
          if (Array.isArray(subtasks)) {
            setHistory(prev => [...prev, boards]);
            
            setBoards(prevBoards => {
              return prevBoards.map(board => {
                return {
                  ...board,
                  tasks: board.tasks.map(t => {
                    if (t.id === taskId) {
                      return {
                        ...t,
                        expanded: true,
                        subtasks: [
                          ...t.subtasks,
                          ...subtasks.map((st: any, index: number) => ({
                            id: `subtask-${Date.now()}-${index}`,
                            title: st.title,
                            subtasks: [],
                            completed: false,
                            priority: st.priority || 'medium',
                            estimatedTime: st.estimatedTime || 0.5,
                            boardId: t.boardId
                          }))
                        ]
                      };
                    }
                    return t;
                  })
                };
              });
            });
            
            // Update cost
            setTotalCost(prev => prev + (data.usage?.total_tokens || 0) * 0.000002);
            
            // No need to update executionCount here as it's already updated in syncRateLimitInfo
          }
        } catch (error) {
          console.error('Error parsing subtasks:', error);
        }
      }
    } catch (error) {
      console.error('Error generating subtasks:', error);
      
      // Check if the error is due to rate limiting
      if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
        setRateLimited(true);
        alert('Rate limit exceeded. Please try again later.');
      }
    } finally {
      setGenerating(false);
      setActiveTask(null);
    }
  };
  
  const handleSelectUseCase = useCallback((useCase: string) => {
    // Save current state to history before resetting
    setHistory(prev => [...prev, boards]);
    
    // Reset boards to empty state
    setBoards([
      { id: 'todo', title: 'To Do', tasks: [] },
      { id: 'inprogress', title: 'In Progress', tasks: [] },
      { id: 'done', title: 'Done', tasks: [] }
    ]);
    
    // Reset active states
    setActiveTask(null);
    setActiveId(null);
    setGenerating(false);
    setShowContextInput(null);
    
    // Set the new use case
    setSelectedUseCase(useCase);
    document.documentElement.style.setProperty('--primary-color', `var(--${useCase}-primary)`);
    document.documentElement.style.setProperty('--primary-light', `var(--${useCase}-light)`);
    document.documentElement.style.setProperty('--secondary-light', `var(--${useCase}-secondary)`);
  }, [boards]);
  
  const handleGenerateIdeas = async () => {
    // Set generating state to true to show loading indicator
    setGenerating(true);
    
    try {
      console.log("Generating ideas for use case:", selectedUseCase);
      
      // Get reCAPTCHA token
      const recaptchaToken = await getReCaptchaToken('generate_ideas');
      console.log("Got reCAPTCHA token for generate_ideas:", recaptchaToken ? "Yes" : "No");
      
      // Use OpenAIService to make the request through the proxy
      // Create a prompt based on the selected use case
      let systemPrompt = 'You are a helpful assistant that generates creative task ideas. Return a list of 5 task ideas, one per line, no numbers or bullets.';
      let userPrompt = `Generate 5 task ideas for ${selectedUseCase || 'general productivity'}`;
      
      // Customize prompts based on use case
      if (selectedUseCase === 'recipe') {
        systemPrompt = 'You are a culinary expert that creates detailed cooking recipes. For each recipe, include a title followed by a detailed ingredients list with precise measurements (e.g., 2 eggs, 1 cup flour, 2 tbsp butter) and step-by-step instructions.';
        userPrompt = 'Generate 5 recipe ideas with specific ingredients (including exact measurements) and cooking steps. Format each recipe with a clear title, detailed ingredients list with measurements, and numbered steps.';
      } else if (selectedUseCase === 'marketing') {
        systemPrompt = 'You are a marketing strategist that creates actionable marketing project plans. Each plan should have clear objectives and implementation steps.';
        userPrompt = 'Generate 5 marketing campaign ideas with specific objectives and implementation steps. Format each as a mini project plan with timeline, deliverables, and success metrics.';
      } else if (selectedUseCase === 'goals') {
        systemPrompt = 'You are a goal-setting and personal development expert. Create structured goal plans with measurable targets and action steps.';
        userPrompt = 'Generate 5 goal-setting ideas with SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound). Include milestones and tracking methods for each goal.';
      } else if (selectedUseCase === 'home') {
        systemPrompt = 'You are a home organization and maintenance expert. Create detailed home chore and maintenance plans.';
        userPrompt = 'Generate 5 home maintenance or organization tasks with specific steps, required materials, and estimated time to complete each task.';
      } else if (selectedUseCase === 'travel') {
        systemPrompt = 'You are a travel planning expert. Create detailed travel itineraries and planning checklists.';
        userPrompt = 'Generate 5 travel planning tasks with specific destinations, activities, accommodation options, and preparation steps for each trip idea.';
      } else if (selectedUseCase === 'study') {
        systemPrompt = 'You are an educational expert. Create detailed study plans and learning strategies.';
        userPrompt = 'Generate 5 study plan ideas with specific subjects, learning objectives, study techniques, and resource recommendations for each plan.';
      }
      
      console.log("Sending request to OpenAI with model:", selectedModel);
      
      const { data, rateLimit } = await OpenAIService.createChatCompletion({
        model: selectedModel,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ]
      }, recaptchaToken);
      
      console.log("Received response from OpenAI:", data);
      
      // Update rate limit information
      syncRateLimitInfo(rateLimit);
      
      if (!data.choices || !data.choices[0]) {
        console.error("No choices in OpenAI response");
        alert("Failed to generate ideas. Please try again.");
        setGenerating(false);
        return;
      }
      
      // Parse the response into an array of ideas
      const responseText = data.choices[0].message.content;
      console.log("Response text:", responseText);
      
      const ideas = responseText
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^\d+\.\s*|-\s*|\*\s*/, '').trim());
      
      console.log("Parsed ideas:", ideas);
      
      if (ideas.length === 0) {
        console.error("No ideas were parsed from the response");
        alert("Failed to generate ideas. Please try again.");
        setGenerating(false);
        return;
      }
      
      setHistory(prev => [...prev, boards]);
      
      setBoards(prevBoards => {
        const todoBoard = prevBoards.find(board => board.id === 'todo');
        if (!todoBoard) return prevBoards;

        return prevBoards.map(board =>
          board.id === 'todo'
            ? {
                ...board,
                tasks: [
                  ...board.tasks,
                  ...ideas.map((idea, index) => ({
                      id: `task-${Date.now()}-${index}`,
                      title: idea,
                      subtasks: [],
                      completed: false,
                      priority: 'medium' as 'low' | 'medium' | 'high',
                      estimatedTime: 1,
                      expanded: false,
                      boardId: 'todo'
                    }))
                  ]
                }
              : board
          );
        });

        // Update cost
        setTotalCost(prev => prev + (data.usage?.total_tokens || 0) * 0.000002);
        
        // No need to update executionCount here as it's already updated in syncRateLimitInfo
      
    } catch (error) {
      console.error('Error generating ideas:', error);
      
      // Check if the error is due to rate limiting
      if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
        setRateLimited(true);
        alert('Rate limit exceeded. Please try again later.');
      } else {
        alert("Failed to generate ideas. Please try again.");
      }
    } finally {
      // Always set generating to false when done, regardless of success or failure
      setGenerating(false);
    }
  };
  
  const getFilteredTasks = useCallback((boardId: string) => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return [];
    
    let filteredTasks = filterTasksByPriority(board.tasks, filterPriority);
    
    if (filterRating > 0) {
      filteredTasks = filterTasksByRating(filteredTasks, filterRating as 1 | 2 | 3 | 4 | 5);
    }
    
    return filteredTasks;
  }, [boards, filterPriority, filterRating]);

  const result: TasksContextType = {
    selectedModel,
    setSelectedModel,
    totalCost,
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
    rateLimited,
    rateLimitInfo,
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
  };
  
  return result;
}
