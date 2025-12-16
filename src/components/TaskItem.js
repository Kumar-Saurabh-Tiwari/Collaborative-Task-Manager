'use client';

import React, { useState } from 'react';
import { taskAPI } from '../lib/apiClient';
import { emitTaskUpdated, emitTaskDeleted } from '../lib/socket';

/**
 * TaskItem Component
 * Displays a single task with options to edit, update status, and delete
 * @param {Object} props - Component props
 * @param {Object} props.task - Task data
 * @param {Function} props.onTaskUpdated - Callback when task is updated
 * @param {Function} props.onTaskDeleted - Callback when task is deleted
 * @param {Function} props.onEdit - Callback when edit is clicked
 * @returns {JSX.Element}
 */
export default function TaskItem({ task, onTaskUpdated, onTaskDeleted, onEdit }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const statusOptions = ['To Do', 'In Progress', 'Review', 'Completed'];
  const priorityOptions = ['Low', 'Medium', 'High', 'Urgent'];

  /**
   * Handle status change
   */
  const handleStatusChange = async (newStatus) => {
    if (newStatus === task.status) return;

    setIsUpdating(true);
    try {
      const response = await taskAPI.updateTask(task.id, { status: newStatus });
      emitTaskUpdated(response.data?.data);
      onTaskUpdated?.();
    } catch (err) {
      console.error('Failed to update task status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Handle priority change
   */
  const handlePriorityChange = async (newPriority) => {
    if (newPriority === task.priority) return;

    setIsUpdating(true);
    try {
      const response = await taskAPI.updateTask(task.id, { priority: newPriority });
      emitTaskUpdated(response.data?.data);
      onTaskUpdated?.();
    } catch (err) {
      console.error('Failed to update task priority:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Handle task deletion
   */
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await taskAPI.deleteTask(task.id);
      emitTaskDeleted(task.id);
      setShowDeleteConfirm(false);
      onTaskDeleted?.();
    } catch (err) {
      console.error('Failed to delete task:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Get status badge color
   */
  const getStatusColor = (status) => {
    const colors = {
      'To Do': 'bg-gray-100 text-gray-800 border-gray-300',
      'In Progress': 'bg-blue-100 text-blue-800 border-blue-300',
      Review: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      Completed: 'bg-green-100 text-green-800 border-green-300',
    };
    return colors[status] || colors['To Do'];
  };

  /**
   * Get priority badge color
   */
  const getPriorityColor = (priority) => {
    const colors = {
      Low: 'bg-green-100 text-green-800 border-green-300',
      Medium: 'bg-blue-100 text-blue-800 border-blue-300',
      High: 'bg-orange-100 text-orange-800 border-orange-300',
      Urgent: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[priority] || colors.Medium;
  };

  /**
   * Check if task is overdue
   */
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';

  /**
   * Format date
   */
  const formatDate = (date) => {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 mb-3 border-l-4 transition duration-200 ${
      isOverdue ? 'border-l-red-500 bg-red-50' : 'border-l-blue-500'
    }`}>
      <div className="flex flex-col gap-3">
        {/* Header: Title and Delete */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${isOverdue ? 'text-red-700' : 'text-gray-800'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{task.description}</p>
            )}
          </div>
          {showDeleteConfirm && (
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-300 text-gray-800 px-2 py-1 rounded text-sm hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          )}
          {!showDeleteConfirm && (
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(task)}
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Task Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {/* Status */}
          <div>
            <label className="block text-gray-500 text-xs font-medium mb-1">Status</label>
            <div className="flex gap-1 flex-wrap">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={isUpdating}
                  className={`px-3 py-1 rounded border text-xs font-medium transition duration-200 ${
                    task.status === status
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  } disabled:opacity-50`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-gray-500 text-xs font-medium mb-1">Priority</label>
            <select
              value={task.priority}
              onChange={(e) => handlePriorityChange(e.target.value)}
              disabled={isUpdating}
              className={`w-full px-3 py-1 rounded border text-xs font-medium ${getPriorityColor(
                task.priority
              )} disabled:opacity-50 focus:outline-none`}
            >
              {priorityOptions.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-gray-500 text-xs font-medium mb-1">Due Date</label>
            <p className={`text-xs ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
              {formatDate(task.dueDate)}
            </p>
          </div>

          {/* Assigned To */}
          <div>
            <label className="block text-gray-500 text-xs font-medium mb-1">Assigned To</label>
            <p className="text-xs text-gray-600">
              {task.assignedTo ? `${task.assignedTo.name}` : 'Unassigned'}
            </p>
          </div>
        </div>

        {/* Creator Info */}
        <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
          Created by {task.creator?.name || 'Unknown'}
        </div>
      </div>
    </div>
  );
}
