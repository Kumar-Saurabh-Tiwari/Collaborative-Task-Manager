'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import { useTasks, useAuth, useNotifications } from '@/hooks/useTasks';
import '../globals.css';

/**
 * Notification Component
 */
const Notification = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[notification.type] || 'bg-blue-500';

  return (
    <div className={`${bgColor} text-white px-4 py-3 rounded shadow-lg mb-2 animate-slide-in`}>
      {notification.message}
    </div>
  );
};

/**
 * Dashboard Home Page
 * Main task management interface
 */
export default function Home() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth();
  const [activeView, setActiveView] = useState('all'); // all, assigned, created, overdue
  const { tasks, isLoading, error, mutate } = useTasks({ filter: activeView });
  const { notifications, removeNotification } = useNotifications();
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleTaskCreated = () => {
    setEditingTask(null);
    setShowForm(false);
    mutate();
  };

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setShowForm(false);
  };

  const filterCount = {
    all: tasks.length,
    assigned: tasks.filter(t => t.assignedTo && t.status !== 'Completed').length,
    created: tasks.length,
    overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 max-w-sm">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📋 Task Manager</h1>
              <p className="text-gray-600 mt-1">Welcome, {user?.name}!</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-500 text-white hover:bg-blue-600 font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                + New Task
              </button>
              <button
                onClick={logout}
                className="bg-gray-300 text-gray-800 hover:bg-gray-400 font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - View Selector */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Views</h2>
              <nav className="space-y-2">
                <button
                  onClick={() => handleViewChange('all')}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition duration-200 ${
                    activeView === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📋 All Tasks
                  <span className="float-right text-sm">({filterCount.all})</span>
                </button>
                <button
                  onClick={() => handleViewChange('assigned')}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition duration-200 ${
                    activeView === 'assigned'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📌 Assigned
                  <span className="float-right text-sm">({filterCount.assigned})</span>
                </button>
                <button
                  onClick={() => handleViewChange('created')}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition duration-200 ${
                    activeView === 'created'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ✍️ Created
                  <span className="float-right text-sm">({filterCount.created})</span>
                </button>
                <button
                  onClick={() => handleViewChange('overdue')}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition duration-200 ${
                    activeView === 'overdue'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ⏰ Overdue
                  <span className="float-right text-sm">({filterCount.overdue})</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Form Section */}
            {showForm && (
              <div className="mb-6">
                <TaskForm
                  onTaskCreated={handleTaskCreated}
                  initialData={editingTask}
                  onCancel={handleCancelEdit}
                />
              </div>
            )}

            {/* Tasks Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {activeView === 'all' && '📋 All Tasks'}
                {activeView === 'assigned' && '📌 Assigned to Me'}
                {activeView === 'created' && '✍️ Tasks I Created'}
                {activeView === 'overdue' && '⏰ Overdue Tasks'}
              </h2>
              <TaskList
                tasks={tasks}
                isLoading={isLoading}
                error={error}
                onRefresh={mutate}
                onEdit={handleEditTask}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
