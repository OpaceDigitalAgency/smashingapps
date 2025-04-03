import React, { useEffect, useState } from 'react';
import { AlertCircle, ThumbsUp, AlertTriangle } from 'lucide-react';
import { useCaseDefinitions } from '../utils/useCaseDefinitions';

type TaskMismatchPopupProps = {
  isVisible: boolean;
  reason: string;
  suggestedUseCase: string | undefined;
  onClose: () => void;
  onSwitchUseCase: (useCase: string) => void;
};

const TaskMismatchPopup: React.FC<TaskMismatchPopupProps> = ({
  isVisible,
  reason,
  suggestedUseCase,
  onClose,
  onSwitchUseCase
}) => {
  const [animation, setAnimation] = useState('');
  
  // Apply animation when visibility changes
  useEffect(() => {
    if (isVisible) {
      setAnimation('animate-in');
      
      // Auto-close after 8 seconds if not interacted with
      const timer = setTimeout(() => {
        setAnimation('animate-out');
        setTimeout(onClose, 500);
      }, 8000);
      
      return () => clearTimeout(timer);
    } else {
      setAnimation('animate-out');
    }
  }, [isVisible, onClose]);
  
  if (!isVisible) return null;
  
  const handleSwitch = () => {
    if (suggestedUseCase) {
      onSwitchUseCase(suggestedUseCase);
    }
    setAnimation('animate-out');
    setTimeout(onClose, 500);
  };
  
  const handleIgnore = () => {
    setAnimation('animate-out');
    setTimeout(onClose, 500);
  };
  
  const suggestedUseCaseName = suggestedUseCase 
    ? useCaseDefinitions[suggestedUseCase]?.label || suggestedUseCase
    : '';
  
  return (
    <div 
      className={`fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-md w-full z-50 ${animation}`}
      style={{
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transform: animation === 'animate-in' 
          ? 'translate(-50%, -50%) scale(1)' 
          : 'translate(-50%, -30%) scale(0.95)',
        opacity: animation === 'animate-in' ? 1 : 0,
        transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          <div className="bg-yellow-50 p-2 rounded-full">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 mb-1">Task Mismatch Detected!</h3>
          <p className="text-gray-600 mb-3">{reason}</p>
          
          {suggestedUseCase && (
            <div className="bg-gray-50 rounded-md p-3 mb-3 border border-gray-100">
              <p className="text-sm text-gray-700">
                Would you like to switch to <span className="font-semibold">{suggestedUseCaseName}</span> instead?
              </p>
            </div>
          )}
          
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={handleIgnore}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Ignore
            </button>
            
            {suggestedUseCase && (
              <button
                onClick={handleSwitch}
                className="px-4 py-1.5 text-sm font-medium text-white rounded-md"
                style={{
                  background: `linear-gradient(135deg, var(--${suggestedUseCase}-primary), color-mix(in srgb, var(--${suggestedUseCase}-primary) 70%, white))`
                }}
              >
                Switch Now
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Progress bar for auto-close */}
      <div className="absolute bottom-0 left-0 h-1 bg-gray-200 w-full rounded-b-lg overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
          style={{
            width: '100%',
            animation: 'shrink 8s linear forwards'
          }}
        />
      </div>
    </div>
  );
};

export default TaskMismatchPopup;