# SmashingApps.ai

A modern suite of AI-powered productivity tools, hosted at [smashingapps.ai](https://smashingapps.ai).

## Overview

SmashingApps.ai provides intuitive, AI-powered tools to help users "smash" through specific tasks. The application consists of a main landing page and various specialized tools, with the primary tool being TaskSmasher.

## Application Structure

This is a unified React application that combines:

1. **Main Homepage** (`/`) - Introduces the brand and links to various tools
2. **TaskSmasher** (`/tools/task-smasher/`) - AI-powered task management application with various use cases

### Unified Architecture

- The application uses React Router for client-side routing
- Both the homepage and TaskSmasher are part of the same React application
- All routes are handled through React Router
- The app is built as a single SPA (Single Page Application)

## Development

### Prerequisites

- Node.js 18+ and npm

### Setup

1. Clone the repository
   ```
   git clone https://github.com/OpaceDigitalAgency/smashingapps.git
   cd smashingapps
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Run the development server
   ```
   npm run dev
   ```

The app will be available at http://localhost:5173/

## Deployment

The application is configured for deployment on Netlify:

1. Push changes to the repository
2. Netlify automatically builds and deploys the application
3. The build process creates a single unified application

### Build Configuration

- The build process is defined in `netlify.toml`
- The app is built with `npm run build`
- All redirects are configured to support SPA routing

## Routing

The application handles both URLs with and without trailing slashes:

- `/tools/task-smasher` and `/tools/task-smasher/` both work
- All use case paths like `/tools/task-smasher/daily-organizer` and `/tools/task-smasher/daily-organizer/` work correctly

## Available Tools

Currently available tools:

- **TaskSmasher** - AI-powered task management with specialized use cases:
  - Daily Organizer
  - Goal Planner
  - Marketing Tasks
  - And more...

## License

Copyright © 2024 Opace Digital Agency. All rights reserved.