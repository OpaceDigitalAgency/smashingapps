import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <img 
                src="/smashingapps-ai.png" 
                alt="SmashingApps.ai Logo" 
                className="h-20 w-auto" 
              />
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <a href="#tools" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Tools
            </a>
            <a href="#why" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Why SmashingApps
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Testimonials
            </a>
            <a href="#contact" className="btn-primary !py-2 !px-4 text-sm">
              Get Started
            </a>
          </div>
          
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white py-2 px-4 shadow-inner">
          <a 
            href="#tools" 
            className="block text-gray-700 hover:text-primary hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsOpen(false)}
          >
            Tools
          </a>
          <a 
            href="#why" 
            className="block text-gray-700 hover:text-primary hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsOpen(false)}
          >
            Why SmashingApps
          </a>
          <a 
            href="#testimonials" 
            className="block text-gray-700 hover:text-primary hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsOpen(false)}
          >
            Testimonials
          </a>
          <div className="mt-2 pt-2 border-t border-gray-200">
            <a 
              href="#contact" 
              className="block btn-primary !py-2 !px-4 text-center"
              onClick={() => setIsOpen(false)}
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;