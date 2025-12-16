'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { taskSchema, validate } from '../lib/validation';
import { taskAPI, userAPI } from '../lib/apiClient';
import { emitTaskCreated, emitTaskAssigned } from '../lib/socket';

/**
 * TaskForm Component
 * Handles task creation and editing with form validation
 * @param {Object} props - Component props
 * @param {Function} props.onTaskCreated - Callback when task is created
 * @param {Object} props.initialData - Initial task data (for editing)
 * @param {Function} props.onCancel - Callback when form is cancelled
 * @returns {JSX.Element}
 */
export default function TaskForm({ onTaskCreated, initialData = null, onCancel }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: initialData || {
      title: '',
      description: '',
      priority: 'Medium',
      status: 'To Do',
      dueDate: '',
      assignedToId: '',
    },
  });

  const assignedToId = watch('assignedToId');

  // Fetch available users for assignment
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userAPI.getAllUsers();
        setUsers(response.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  /**
   * Handle form submission
   */
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');

      // Validate data
      const validation = validate(taskSchema, {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      });

      if (!validation.success) {
        setError('Validation failed');
        return;
      }

      const submitData = {
        ...validation.data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      };

      if (initialData) {
        // Update existing task
        const response = await taskAPI.updateTask(initialData.id, submitData);
        emitTaskCreated(response.data?.data);
      } else {
        // Create new task
        const response = await taskAPI.createTask(submitData);
        emitTaskCreated(response.data?.data);

        // Send assignment notification if assigned
        if (submitData.assignedToId) {
          emitTaskAssigned(submitData.assignedToId, submitData.title, response.data?.data?.id);
        }
      }

      reset();
      onTaskCreated?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {initialData ? 'Edit Task' : 'Create New Task'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Title Field */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          id="title"
          type="text"
          {...register('title', { required: 'Title is required' })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Task title"
          maxLength={100}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>

      {/* Description Field */}
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Task description"
          rows={3}
        />
      </div>

      {/* Due Date Field */}
      <div className="mb-4">
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
          Due Date
        </label>
        <input
          id="dueDate"
          type="datetime-local"
          {...register('dueDate')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Priority Field */}
      <div className="mb-4">
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
          Priority
        </label>
        <select
          id="priority"
          {...register('priority')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>
      </div>

      {/* Status Field */}
      <div className="mb-4">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          id="status"
          {...register('status')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Review">Review</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Assign To Field */}
      <div className="mb-4">
        <label htmlFor="assignedToId" className="block text-sm font-medium text-gray-700 mb-2">
          Assign To
        </label>
        {isLoadingUsers ? (
          <div className="text-gray-500 text-sm">Loading users...</div>
        ) : (
          <select
            id="assignedToId"
            {...register('assignedToId')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Task' : 'Create Task'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-400 transition duration-200"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
