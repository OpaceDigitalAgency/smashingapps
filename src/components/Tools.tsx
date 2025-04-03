import React from 'react';
import { ListChecks, ChefHat, Lightbulb, Calendar, MessageSquare } from 'lucide-react';

const Tools: React.FC = () => {
  const tools = [
    {
      id: 'task-smasher',
      name: 'TaskSmasher',
      description: 'Turn a single word into a fully organised task list.',
      useCases: [
        { name: 'Marketing Tasks', path: '/tools/task-smasher/marketing-tasks' },
        { name: 'Daily Organizer', path: '/tools/task-smasher/daily-organizer' },
        { name: 'Goal Planner', path: '/tools/task-smasher/goal-planner' }
      ],
      icon: ListChecks,
      color: 'from-purple-500 to-purple-600',
      comingSoon: false
    },
    {
      id: 'recipe-smasher',
      name: 'RecipeSmasher',
      description: 'Get AI-generated recipe steps from any ingredients.',
      icon: ChefHat,
      color: 'from-blue-500 to-blue-600',
      comingSoon: false
    },
    {
      id: 'idea-smasher',
      name: 'IdeaSmasher',
      description: 'Turn vague thoughts into step-by-step action plans.',
      icon: Lightbulb,
      color: 'from-yellow-500 to-yellow-600',
      comingSoon: false
    },
    {
      id: 'schedule-smasher',
      name: 'ScheduleSmasher',
      description: 'Create the perfect daily schedule in seconds.',
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      comingSoon: true
    },
    {
      id: 'email-smasher',
      name: 'EmailSmasher',
      description: 'Generate professional emails from quick prompts.',
      icon: MessageSquare,
      color: 'from-red-500 to-red-600',
      comingSoon: true
    }
  ];

  return (
    <section id="tools" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Your <span className="text-secondary">AI Toolbox</span>
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Simple tools with powerful results. Each one designed to solve one specific task quickly and perfectly.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <div key={tool.id} id={tool.id} className="tool-card card-hover">
              <div className={`inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-r ${tool.color} mb-5`}>
                <tool.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{tool.name}</h3>
              <p className="mt-2 text-gray-600">
                {tool.description}
              </p>
              <div className="mt-4">
                {tool.comingSoon ? (
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                    Coming soon
                  </span>
                ) : (
                  <>
                    <a
                      href={tool.id === 'task-smasher' ? '/tools/task-smasher/' : `#${tool.id}`}
                      className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
                    >
                      Try now <span className="ml-1">→</span>
                    </a>
                    
                    {tool.useCases && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {tool.useCases.map(useCase => (
                          <a
                            key={useCase.path}
                            href={useCase.path}
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded-full transition-colors"
                          >
                            {useCase.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tools;