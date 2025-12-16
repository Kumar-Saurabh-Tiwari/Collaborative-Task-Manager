'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { taskAPI } from '../lib/apiClient';
import {
  initSocket,
  closeSocket,
  onTaskUpdated,
  onTaskCreated,
  onTaskDeleted,
} from '../lib/socket';

/**
 * Custom hook for fetching and managing tasks
 * Includes real-time updates via Socket.io
 * @param {Object} options - Hook options
 * @param {string} options.filter - Task filter (all, assigned, created, overdue)
 * @param {string} options.status - Filter by status
 * @param {string} options.priority - Filter by priority
 * @param {string} options.sortBy - Sort field
 * @returns {Object} - Tasks data, loading state, and helper functions
 */
export const useTasks = (options = {}) => {
  const { filter = 'all', status, priority, sortBy = 'dueDate' } = options;
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Determine which API endpoint to use based on filter
  const getTasksData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let response;
      switch (filter) {
        case 'assigned':
          response = await taskAPI.getAssignedTasks();
          break;
        case 'created':
          response = await taskAPI.getCreatedTasks();
          break;
        case 'overdue':
          response = await taskAPI.getOverdueTasks();
          break;
        default:
          response = await taskAPI.getAllTasks({ status, priority, sortBy });
      }

      setTasks(response.data?.data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.response?.data?.message || 'Failed to fetch tasks');

      if (err.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  }, [filter, status, priority, sortBy, router]);

  // Fetch tasks on mount and when dependencies change
  useEffect(() => {
    getTasksData();
  }, [getTasksData]);

  // Setup Socket.io listeners for real-time updates
  useEffect(() => {
    const unsubscribeUpdated = onTaskUpdated((updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? { ...task, ...updatedTask } : task
        )
      );
    });

    const unsubscribeCreated = onTaskCreated((newTask) => {
      setTasks((prevTasks) => [newTask, ...prevTasks]);
    });

    const unsubscribeDeleted = onTaskDeleted((deletedTaskId) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== deletedTaskId));
    });

    return () => {
      unsubscribeUpdated?.();
      unsubscribeCreated?.();
      unsubscribeDeleted?.();
    };
  }, []);

  return {
    tasks,
    isLoading,
    error,
    mutate: getTasksData,
  };
};

/**
 * Custom hook for user authentication
 * @returns {Object} - User data, auth state, and helper functions
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/me', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.data);
          setIsAuthenticated(true);

          // Initialize Socket.io connection
          const { initSocket } = await import('../lib/socket');
          initSocket(data.data.id);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      closeSocket();
      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [router]);

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
    setUser,
  };
};

/**
 * Custom hook for notifications
 * @returns {Object} - Notifications and helper functions
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  // Setup Socket.io listener for assignment notifications
  useEffect(() => {
    const { onAssignmentNotification } = require('../lib/socket');

    const unsubscribe = onAssignmentNotification((notification) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newNotification = { id, ...notification };

      setNotifications((prev) => [newNotification, ...prev]);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 5000);
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  return {
    notifications,
    addNotification: (message, type = 'info') => {
      const id = Math.random().toString(36).substr(2, 9);
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 5000);
    },
    removeNotification: (id) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    },
  };
};

export default useTasks;
