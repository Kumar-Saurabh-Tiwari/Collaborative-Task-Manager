'use client';

import React, { useMemo } from 'react';
import TaskItem from './TaskItem';

/**
 * SkeletonLoader Component
 * Shows loading skeleton for tasks
 */
const SkeletonLoader = () => (
  <div className="space-y-3">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
        <div className="h-5 bg-gray-300 rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    ))}
  </div>
);

/**
 * TaskList Component
 * Displays tasks organized by status with filtering and sorting
 * @param {Object} props - Component props
 * @param {Array} props.tasks - Array of tasks
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message
 * @param {Function} props.onRefresh - Callback to refresh tasks
 * @param {Function} props.onEdit - Callback when edit is clicked
 * @returns {JSX.Element}
 */
export default function TaskList({ tasks, isLoading, error, onRefresh, onEdit, showStatus = true }) {
  // Group tasks by status
  const groupedTasks = useMemo(() => {
    const groups = {
      'To Do': [],
      'In Progress': [],
      Review: [],
      Completed: [],
    };

    tasks.forEach((task) => {
      if (groups[task.status]) {
        groups[task.status].push(task);
      }
    });

    return groups;
  }, [tasks]);

  // Skeleton loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-700 mb-3">Loading Tasks...</h3>
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
        <p className="font-semibold">Error loading tasks</p>
        <p className="text-sm mt-2">{error}</p>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="mt-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="text-5xl mb-3">📝</div>
        <p className="text-gray-600 text-lg">No tasks found</p>
        <p className="text-gray-500 text-sm mt-1">Create your first task to get started!</p>
      </div>
    );
  }

  // Display tasks grouped by status
  const statusOrder = ['To Do', 'In Progress', 'Review', 'Completed'];
  const statusIcons = {
    'To Do': '📋',
    'In Progress': '⚙️',
    Review: '👀',
    Completed: '✅',
  };

  return (
    <div className="space-y-6">
      {statusOrder.map((status) => {
        const statusTasks = groupedTasks[status];
        if (statusTasks.length === 0) return null;

        return (
          <div key={status}>
            <h3 className="text-lg font-bold text-gray-700 mb-3">
              {statusIcons[status]} {status} ({statusTasks.length})
            </h3>
            <div className="space-y-2">
              {statusTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onTaskUpdated={onRefresh}
                  onTaskDeleted={onRefresh}
                  onEdit={onEdit}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
