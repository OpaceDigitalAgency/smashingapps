import React, { useEffect, useRef, useState } from 'react';
import { Calendar, Target, MessageSquare, ChefHat, Home, Briefcase, Plane, ShoppingCart, GraduationCap, PartyPopper, Wrench, Palette } from 'lucide-react';
import { useCaseDefinitions } from '../utils/useCaseDefinitions';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  selectedUseCase: string | null;
  onSelectUseCase: (useCase: string) => void;
}

const useCases = [
  { id: 'daily', icon: Calendar, label: 'Daily Organizer' },
  { id: 'goals', icon: Target, label: 'Goal Planner' },
  { id: 'marketing', icon: MessageSquare, label: 'Marketing Tasks' },
  { id: 'recipe', icon: ChefHat, label: 'Recipe Steps' },
  { id: 'home', icon: Home, label: 'Home Chores' },
  { id: 'freelance', icon: Briefcase, label: 'Freelancer Projects' },
  { id: 'travel', icon: Plane, label: 'Trip Planner' },
  { id: 'shopping', icon: ShoppingCart, label: 'Shopping Tasks' },
  { id: 'study', icon: GraduationCap, label: 'Study Plan' },
  { id: 'events', icon: PartyPopper, label: 'Event Planning' },
  { id: 'diy', icon: Wrench, label: 'DIY Projects' },
  { id: 'creative', icon: Palette, label: 'Creative Projects' }
];

function Sidebar({ selectedUseCase, onSelectUseCase }: SidebarProps) {
  const [smashPosition, setSmashPosition] = useState({ top: 0, left: 0 });
  const [showSmashEffect, setShowSmashEffect] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  
  // Determine the current use case from the URL path
  useEffect(() => {
    const fullPath = location.pathname.substring(1); // Remove leading slash
    
    // Check if the path starts with 'tools/task-smasher/'
    if (fullPath.startsWith('tools/task-smasher/')) {
      // Extract the use case part from the path (trim trailing slash if present)
      let path = fullPath.substring('tools/task-smasher/'.length);
      
      // Remove trailing slash if present
      if (path.endsWith('/')) {
        path = path.slice(0, -1);
      }
      
      if (path) {
        const matchedUseCase = useCases.find(useCase =>
          useCase.label.toLowerCase().replace(/\s+/g, '-') === path.toLowerCase()
        );
        if (matchedUseCase && matchedUseCase.id !== selectedUseCase) {
          onSelectUseCase(matchedUseCase.id);
        }
      }
    } else if (!selectedUseCase) {
      // Default to daily if no path and no selected use case
      onSelectUseCase('daily');
    }
  }, [location, selectedUseCase, onSelectUseCase]);
  
  const handleUseCaseClick = (useCaseId: string, e: React.MouseEvent) => {
    // Only trigger animation if the use case is changing
    if (useCaseId !== selectedUseCase) {
      // Get position relative to sidebar
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        // Set smash position to click position
        setSmashPosition({ top: clickY, left: clickX });
        
        // Trigger smash effect
        setShowSmashEffect(true);
        
        // Clear effect after animation is complete
        setTimeout(() => {
          setShowSmashEffect(false);
        }, 800);
        
        // Actually change the use case
        onSelectUseCase(useCaseId);
      }
    }
  };

  // Get current use case label
  const currentUseCaseLabel = selectedUseCase 
    ? useCaseDefinitions[selectedUseCase]?.label || 'Use Cases'
    : 'Use Cases';

  return (
    <div 
      ref={containerRef}
      className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col gap-2 shadow-sm z-10 transition-colors duration-300 ease-in-out relative overflow-hidden"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        Use Case Categories
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Select a category below to create AI-generated tasks specific to that domain
      </p>
      
      {/* Active smash effect (appears on click) */}
      {showSmashEffect && (
        <div 
          className="absolute pointer-events-none z-50"
          style={{ 
            top: `${smashPosition.top - 40}px`, 
            left: `${smashPosition.left - 40}px`,
          }}
        >
          <div className="smash-effect">
            <svg viewBox="0 0 100 100" width="80" height="80">
              <polygon className="smash-star" points="50,0 61,35 95,35 67,57 79,90 50,70 21,90 33,57 5,35 39,35" fill="var(--primary-color)" />
            </svg>
            <div className="smash-text">SMASH!</div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col gap-2">
        {useCases.map(useCase => {
          const Icon = useCase.icon;
          const isSelected = selectedUseCase === useCase.id;
          
          return (
            <Link
              key={useCase.id}
              to={`/tools/task-smasher/${useCase.label.toLowerCase().replace(/\s+/g, '-')}/`}
              onClick={(e) => handleUseCaseClick(useCase.id, e)}
              className={`flex flex-col items-start gap-1 px-3 py-2 rounded-lg text-left transition-all duration-300 relative no-underline
                ${isSelected
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm scale-[1.02] font-medium'
                  : 'text-gray-700 hover:bg-gray-50'}`}
              style={{
                backgroundColor: isSelected ? `var(--${useCase.id}-light)` : '',
                color: isSelected ? `var(--${useCase.id}-primary)` : ''
              }}
            >
              <div className="flex items-center gap-3 w-full">
                <Icon
                  className={`w-5 h-5 transition-colors duration-300 ${isSelected ? 'text-indigo-600' : ''}`}
                  style={{ color: isSelected ? `var(--${useCase.id}-primary)` : '' }}
                />
                <span className="font-medium">{useCase.label}</span>
              </div>
              {isSelected && (
                <p className="text-xs text-gray-600 mt-1 pl-8">
                  {useCaseDefinitions[useCase.id]?.description || ''}
                </p>
              )}
            </Link>
          );
        })}
      </div>
      
      <div className="mt-auto pt-4 border-t border-gray-100 text-xs text-center text-gray-400">
        <span className="block mb-1 font-medium">TaskSmasher</span>
        <span>Click to smash your tasks!</span>
      </div>
    </div>
  );
}

export default Sidebar;