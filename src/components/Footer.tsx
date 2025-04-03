import React from 'react';
import { Github, Mail, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <a href="/" className="flex items-center">
              <img 
                src="/smashingapps-ai.png" 
                alt="SmashingApps.ai Logo" 
                className="h-20 w-auto" 
              />
            </a>
            <p className="mt-4 text-gray-400 max-w-md">
              AI-powered micro-apps to help you smash through tasks with smart, fun, and focused tools.
            </p>
            <p className="mt-4 text-gray-400">
              "One idea in. Smart tasks out."
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white">Tools</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#task-smasher" className="text-gray-400 hover:text-white">TaskSmasher</a></li>
              <li><a href="#recipe-smasher" className="text-gray-400 hover:text-white">RecipeSmasher</a></li>
              <li><a href="#idea-smasher" className="text-gray-400 hover:text-white">IdeaSmasher</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Coming Soon</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Terms</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400">
            "Made by humans. Powered by AI." &copy; {new Date().getFullYear()} SmashingApps.ai
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;