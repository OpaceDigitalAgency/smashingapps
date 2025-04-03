import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';

// Import main site components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Tools from './components/Tools';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';

// Import TaskSmasher wrapper
import TaskSmasherApp from './tools/task-smasher/TaskSmasherApp';

// Import the TaskSmasher context providers and use case definitions directly
import { TasksProvider } from '../tools/task-smasher/src/hooks/useTasksContext';
import ReCaptchaProvider from '../tools/task-smasher/src/components/ReCaptchaProvider';
import { useCaseDefinitions } from '../tools/task-smasher/src/utils/useCaseDefinitions';

// HomePage component for the root route
const HomePage = () => (
  <div className="min-h-screen bg-gray-50">
    <Helmet>
      <title>SmashingApps.ai | AI-powered tools for getting things done</title>
      <meta name="description" content="SmashingApps.ai provides intuitive AI tools that help you get things done faster and more efficiently." />
      <link rel="canonical" href="https://smashingapps.ai/" />
    </Helmet>
    <Navbar />
    <main>
      <Hero />
      <Tools />
      <Features />
      <Testimonials />
      <CTA />
    </main>
    <Footer />
  </div>
);

// Main App component that handles all routing
function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          {/* Main homepage route */}
          <Route path="/" element={<HomePage />} />
          
          {/* TaskSmasher base routes - handle both with and without trailing slash */}
          <Route
            path="/tools/task-smasher"
            element={
              <ReCaptchaProvider>
                <TasksProvider initialUseCase="daily">
                  <TaskSmasherApp />
                </TasksProvider>
              </ReCaptchaProvider>
            }
          />
          
          <Route
            path="/tools/task-smasher/"
            element={
              <ReCaptchaProvider>
                <TasksProvider initialUseCase="daily">
                  <TaskSmasherApp />
                </TasksProvider>
              </ReCaptchaProvider>
            }
          />
          
          {/* TaskSmasher use case routes - handle both with and without trailing slash */}
          {Object.entries(useCaseDefinitions).flatMap(([id, definition]) => {
            const basePath = `/tools/task-smasher/${definition.label.toLowerCase().replace(/\s+/g, '-')}`;
            const pathWithSlash = `${basePath}/`;
            
            const routeElement = (
              <ReCaptchaProvider>
                <TasksProvider initialUseCase={id}>
                  <TaskSmasherApp />
                </TasksProvider>
              </ReCaptchaProvider>
            );
            
            return [
              <Route key={`${id}-no-slash`} path={basePath} element={routeElement} />,
              <Route key={`${id}-with-slash`} path={pathWithSlash} element={routeElement} />
            ];
          })}
          
          {/* Catch-all redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;