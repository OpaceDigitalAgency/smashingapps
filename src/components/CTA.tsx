import React from 'react';
import { ArrowRight } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Ready to smash through your tasks?
        </h2>
        <p className="mt-4 text-xl text-white opacity-90 max-w-2xl mx-auto">
          Join thousands of professionals using SmashingApps.ai to boost their productivity with AI.
        </p>
        <div className="mt-8">
          <a 
            href="#tools" 
            className="inline-flex items-center px-8 py-4 bg-secondary text-gray-800 rounded-full shadow-lg font-bold hover:bg-secondary-light transition-all duration-300"
          >
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;