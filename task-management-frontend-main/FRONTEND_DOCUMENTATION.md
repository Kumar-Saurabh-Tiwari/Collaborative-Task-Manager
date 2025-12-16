# Task Management Application - Frontend

A modern, responsive React/Next.js application for task management with real-time collaboration features, user authentication, and WebSocket support.

## Features

### 1. User Authentication
- **Registration**: Create new user accounts with validation
- **Login**: Secure login with JWT tokens
- **Profile Management**: View and update user profile
- **Session Persistence**: Automatic session handling

### 2. Task Management
- **Create Tasks**: Add new tasks with multiple attributes
- **Edit Tasks**: Update task details and status
- **Delete Tasks**: Remove completed or unnecessary tasks
- **Task Attributes**:
  - Title (required, max 100 chars)
  - Description (optional, multi-line)
  - Due Date (optional, with date/time picker)
  - Priority (Low, Medium, High, Urgent)
  - Status (To Do, In Progress, Review, Completed)
  - Assigned To (assign to team members)

### 3. Real-Time Collaboration
- **Live Updates**: See changes instantly across all connected clients
- **Status Updates**: Real-time task status changes
- **Assignment Notifications**: Get notified when assigned a task
- **WebSocket Connection**: Seamless real-time synchronization

### 4. Dashboard & Views
- **Personal Dashboard**: Overview of your tasks
- **Multiple Views**:
  - All Tasks: Complete task list
  - Assigned to Me: Tasks assigned to current user
  - Created by Me: Tasks created by current user
  - Overdue: Tasks past their due date
- **Filtering**: Filter by status and priority
- **Sorting**: Sort by due date and other fields

### 5. User Experience
- **Responsive Design**: Fully responsive for desktop and mobile
- **Loading States**: Skeleton loaders for smooth data loading
- **Error Handling**: Clear error messages and recovery options
- **Notifications**: In-app notifications for important events
- **Form Validation**: Client-side validation with helpful messages

## Tech Stack

- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form
- **Validation**: Zod
- **HTTP Client**: Axios
- **Real-Time**: Socket.io Client
- **Testing**: Jest

## Installation

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher

### Setup

1. **Navigate to frontend directory**
   ```bash
   cd task-management-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` to point to your backend:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Frontend will run on http://localhost:3000

## Project Structure

```
src/
├── app/
│   ├── page.js              # Main dashboard page
│   ├── login.js             # Login page
│   ├── register.js          # Registration page
│   ├── layout.tsx           # Root layout
│   └── layout.js            # App layout
├── components/
│   ├── TaskForm.js          # Task creation/editing form
│   ├── TaskItem.js          # Individual task component
│   └── TaskList.js          # Task list with grouping
├── hooks/
│   └── useTasks.js          # Custom hooks (useTasks, useAuth, useNotifications)
├── lib/
│   ├── apiClient.js         # API client and endpoints
│   ├── socket.js            # Socket.io client utilities
│   └── validation.js        # Zod schemas and validation
└── globals.css              # Global styles
```

## Available Scripts

```bash
# Development
npm run dev                  # Start development server

# Production
npm run build               # Build for production
npm start                   # Start production server

# Linting
npm run lint                # Run ESLint

# Testing
npm test                    # Run tests
npm run test:watch          # Run tests in watch mode
```

## Components

### TaskForm
Handles task creation and editing with full validation.

**Props:**
- `onTaskCreated`: Callback when task is created
- `initialData`: Task data for editing (optional)
- `onCancel`: Callback when cancelled (optional)

### TaskItem
Displays individual task with status and priority selectors.

**Props:**
- `task`: Task object
- `onTaskUpdated`: Callback on update
- `onTaskDeleted`: Callback on deletion
- `onEdit`: Callback for edit button

### TaskList
Groups and displays tasks by status with loading states.

**Props:**
- `tasks`: Array of tasks
- `isLoading`: Loading state
- `error`: Error message
- `onRefresh`: Refresh callback
- `onEdit`: Edit task callback
- `showStatus`: Show status grouping (default: true)

## Hooks

### useTasks
Manages task data fetching and real-time updates.

```javascript
const { tasks, isLoading, error, mutate } = useTasks({
  filter: 'all',        // 'all', 'assigned', 'created', 'overdue'
  status: 'To Do',      // Optional filter
  priority: 'High',     // Optional filter
  sortBy: 'dueDate'     // Sort field
});
```

### useAuth
Manages user authentication state.

```javascript
const { user, isLoading, isAuthenticated, logout, setUser } = useAuth();
```

### useNotifications
Manages in-app notifications.

```javascript
const { notifications, addNotification, removeNotification } = useNotifications();
```

## API Integration

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### User Endpoints
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update profile
- `GET /api/users` - Get all users

### Task Endpoints
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/dashboard/assigned` - Get assigned tasks
- `GET /api/tasks/dashboard/created` - Get created tasks
- `GET /api/tasks/dashboard/overdue` - Get overdue tasks

## WebSocket Integration

The frontend automatically connects to the backend WebSocket server and listens for:

- `task-updated`: When a task is updated by any user
- `task-created`: When a new task is created
- `task-deleted`: When a task is deleted
- `assignment-notification`: When user is assigned a task

## Form Validation

Uses Zod schemas for type-safe validation:

- `taskSchema`: Task creation/editing
- `loginSchema`: User login
- `registerSchema`: User registration
- `profileSchema`: Profile updates

## Error Handling

The application handles various error scenarios:

- **Network Errors**: Automatic retry with user feedback
- **Validation Errors**: Field-level error messages
- **Authentication Errors**: Automatic redirect to login
- **Authorization Errors**: Clear message about lack of permissions

## Responsive Design

The application is fully responsive using Tailwind CSS:

- **Mobile**: Optimized for small screens
- **Tablet**: Responsive layout adjustments
- **Desktop**: Full-featured experience with sidebar navigation

### Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## Performance Optimizations

- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Using Next.js Image component
- **CSS-in-JS**: Tailwind CSS for minimal CSS
- **API Caching**: SWR for automatic data caching
- **WebSocket Efficiency**: Only listening to relevant events

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Development Tips

### Debug Mode
Set environment variable for verbose logging:
```bash
DEBUG=* npm run dev
```

### API Debugging
Use browser DevTools Network tab to inspect API calls and WebSocket messages.

### Component Testing
Use React DevTools extension to inspect component props and state.

## Troubleshooting

### Cannot connect to backend
1. Verify backend is running on http://localhost:5000
2. Check NEXT_PUBLIC_API_URL in .env.local
3. Check CORS configuration in backend

### Real-time updates not working
1. Ensure WebSocket connection is established
2. Check Socket.io connection in browser console
3. Verify backend Socket.io is configured correctly

### Login issues
1. Clear browser cookies
2. Check JWT token expiration
3. Verify backend authentication endpoints

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set environment variables for production

3. Start production server:
   ```bash
   npm start
   ```

4. Use a reverse proxy (nginx) for HTTPS

## License

MIT
