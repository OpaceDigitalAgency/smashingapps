import React from 'react';
import { CheckCircle2, Hammer } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="hero-gradient py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Smash through tasks with <span className="text-primary">AI-powered</span> <span className="text-secondary">simplicity</span>.
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-2xl">
              SmashingApps.ai is your playful productivity toolbox. AI tools that get things done — without the overwhelm.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#tools" className="btn-primary">
                Explore Tools
              </a>
              <a href="#task-smasher" className="btn-secondary">
                Try TaskSmasher Now
              </a>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                <span>No sign-up required</span>
              </div>
              <div className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-secondary mr-2" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center text-gray-600">
                <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                <span>Instant results</span>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 mt-12 lg:mt-0 relative">
            <div className="relative mx-auto w-full max-w-md">
              <div className="bg-white rounded-2xl shadow-xl p-6 relative z-10">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full ml-2"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full ml-2"></div>
                  <div className="ml-4 text-gray-700 font-medium">TaskSmasher</div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="mt-1.5">
                      <Hammer className="h-5 w-5 text-primary animate-smash" />
                    </div>
                    <div className="ml-3 bg-gray-100 rounded-lg p-3 w-full">
                      <p className="text-gray-700 font-medium">Plan marketing campaign</p>
                    </div>
                  </div>
                  
                  <div className="pl-8 space-y-2">
                    <div className="bg-gray-50 rounded-lg p-2 border-l-2 border-primary animate-pulse">
                      <p className="text-gray-600 text-sm">1. Define target audience</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 border-l-2 border-secondary animate-pulse" style={{ animationDelay: "0.2s" }}>
                      <p className="text-gray-600 text-sm">2. Set campaign goals</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 border-l-2 border-primary animate-pulse" style={{ animationDelay: "0.4s" }}>
                      <p className="text-gray-600 text-sm">3. Create content calendar</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 border-l-2 border-secondary animate-pulse" style={{ animationDelay: "0.6s" }}>
                      <p className="text-gray-600 text-sm">4. Design assets</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 border-l-2 border-primary animate-pulse" style={{ animationDelay: "0.8s" }}>
                      <p className="text-gray-600 text-sm">5. Schedule posts</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-secondary opacity-30 rounded-full blur-3xl"></div>
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-primary opacity-30 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;