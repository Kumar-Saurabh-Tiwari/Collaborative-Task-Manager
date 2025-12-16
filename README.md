# Collaborative Task Manager

A modern and responsive task management application built with Next.js, React, and Tailwind CSS for the frontend, with a robust backend API and PostgreSQL database.

## Overview

This is a full-stack task management system consisting of:
- **Frontend**: Next.js 13+ with React and Tailwind CSS
- **Backend**: RESTful API (Node.js/Express or similar)
- **Database**: PostgreSQL

## Features

- 📝 Create, read, update, and delete tasks
- 🎯 Track task status (Pending, In Progress, Completed)
- 🎨 Beautiful and responsive UI with Tailwind CSS
- ⚡ Fast data fetching with SWR
- 🔄 Real-time task updates with WebSocket support
- 📱 Mobile-friendly design
- ✅ Form validation and error handling
- 🔐 Secure API communication
- 💾 Persistent data storage with PostgreSQL

## Prerequisites

### Frontend Requirements
- Node.js (v14 or higher)
- npm or yarn

### Backend Requirements
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### System Requirements
- Git
- Internet connection for external API calls

## Installation

### Frontend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd task-management-frontend-main/task-management-frontend-main
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file based on `.env.local.example`:
```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your API endpoint:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=ws://localhost:5000
```

### Backend Setup

1. Clone or navigate to the backend repository:
```bash
git clone <backend-repository-url>
cd task-management-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
DATABASE_URL=postgresql://username:password@localhost:5432/task_management
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
```

4. Setup PostgreSQL database:
```bash
npm run db:migrate
npm run db:seed
```

5. Start the backend server:
```bash
npm run dev
```

## Running the Application

### Frontend Development Mode
```bash
npm run dev
```

The frontend application will be available at `http://localhost:3000`

### Backend Development Mode
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Production Build
```bash
npm run build
npm start
```

### Full Stack Development

To run the entire application in development mode:

1. Open Terminal 1 - Backend:
```bash
cd task-management-backend
npm run dev
```

2. Open Terminal 2 - Frontend:
```bash
cd task-management-frontend-main/task-management-frontend-main
npm run dev
```

3. Access the application at `http://localhost:3000`

## Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout
│   ├── page.js          # Home page
│   └── globals.css      # Global styles
├── components/
│   ├── TaskForm.js      # Task creation form
│   ├── TaskItem.js      # Individual task component
│   └── TaskList.js      # Task list container
├── lib/
│   └── apiClient.js     # API client configuration
└── hooks/
    └── useTasks.js      # Custom hook for fetching tasks

__tests__/
└── TaskForm.test.js     # Component tests
```

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## API Integration

The frontend communicates with the backend API at the `NEXT_PUBLIC_API_URL` endpoint.

### API Endpoints Used

- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get current user profile

## Backend Architecture

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize or TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time Communication**: Socket.io

### Database Schema

**Users Table**
- id (Primary Key)
- email
- password (hashed)
- name
- created_at
- updated_at

**Tasks Table**
- id (Primary Key)
- user_id (Foreign Key)
- title
- description
- status (Pending, In Progress, Completed)
- priority
- due_date
- created_at
- updated_at

## Why PostgreSQL?

PostgreSQL is chosen as the database for this application for several critical reasons:

### 1. **ACID Compliance**
PostgreSQL provides full ACID (Atomicity, Consistency, Isolation, Durability) compliance, ensuring data integrity. This is essential for task management where data consistency is critical.

### 2. **Reliable Data Integrity**
- Foreign key constraints prevent orphaned records
- Data validation at the database level
- Transactions ensure atomic operations

### 3. **Advanced Query Capabilities**
- Complex JOIN operations for retrieving user-specific tasks
- Full-text search capabilities for task filtering
- Aggregate functions for task analytics

### 4. **Scalability**
- Handles large datasets efficiently
- Supports indexing for faster queries
- Connection pooling for optimal performance

### 5. **Open Source & Free**
- No licensing costs
- Large community support
- Regular updates and security patches

### 6. **JSON Support**
- Native JSON and JSONB data types for flexible data storage
- Useful for storing task metadata and configurations

### 7. **Concurrency Control**
- Multi-version Concurrency Control (MVCC) prevents locking issues
- Multiple users can work on tasks simultaneously

### 8. **Security Features**
- Row-level security (RLS)
- Built-in encryption functions
- Role-based access control

## Technologies Used

- **Next.js** - React framework
- **React** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **SWR** - Data fetching library
- **Axios** - HTTP client
- **Jest** - Testing framework
- **React Testing Library** - Component testing

## Environment Variables

```
NEXT_PUBLIC_API_URL - Backend API URL (default: http://localhost:5000)
```

## Features in Detail

### Task Management
- **Create Tasks**: Add new tasks with title and description
- **View Tasks**: See all tasks organized by status
- **Update Status**: Change task status between Pending, In Progress, and Completed
- **Delete Tasks**: Remove tasks with confirmation
- **Real-time Updates**: Tasks update automatically across the application

### User Interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Status Colors**: Visual indicators for task status
- **Loading States**: User feedback during data operations
- **Error Handling**: Graceful error messages
- **Accessibility**: Semantic HTML and ARIA labels

## Deployment

The frontend can be deployed to various platforms:

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload the .next folder to Netlify
```

### Other Hosting Platforms
Any platform supporting Node.js can host the Next.js application.

## Performance Optimizations

- SWR for efficient data fetching and caching
- Image optimization
- Code splitting
- Lazy loading of components
- CSS minification

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC

## Support

For issues or questions, please create an issue in the repository.
