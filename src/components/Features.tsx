import React from 'react';
import { Brain, Target, Sparkles } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'Smart AI',
      description: 'Built with GPT for rapid results, our tools understand what you need and deliver instantly.'
    },
    {
      icon: Target,
      title: 'Clear Purpose',
      description: 'Each tool does one job extremely well. No confusing options or bloated features.'
    },
    {
      icon: Sparkles,
      title: 'Satisfyingly Simple',
      description: 'UX you don\'t have to think about. Intuitive design that just works.'
    }
  ];

  return (
    <section id="why" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Why <span className="text-primary">Smashing</span><span className="text-secondary">Apps</span>?
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            We're building the toolbox for the AI era — fun, powerful, and designed with humans in mind.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="feature-card card-hover border-t-4 border-secondary">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white mb-5">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;