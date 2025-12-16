# Task Management Frontend

A modern and responsive task management application built with Next.js, React, and Tailwind CSS.

## Features

- 📝 Create, read, update, and delete tasks
- 🎯 Track task status (Pending, In Progress, Completed)
- 🎨 Beautiful and responsive UI with Tailwind CSS
- ⚡ Fast data fetching with SWR
- 🔄 Real-time task updates
- 📱 Mobile-friendly design
- ✅ Form validation and error handling

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-management-frontend
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
```

## Running the Application

### Development Mode
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

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
