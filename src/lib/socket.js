import io from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL ||  'https://task-management-backend-rsgy.onrender.com' || 'http://localhost:5000';

let socket = null;

/**
 * Initialize Socket.io connection
 * @param {string} userId - Current user ID
 * @returns {Object} - Socket.io instance
 */
export const initSocket = (userId) => {
  if (socket?.connected) {
    socket.emit('user-join', userId);
    return socket;
  }

  socket = io(API_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('Connected to server');
    socket.emit('user-join', userId);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  return socket;
};

/**
 * Get Socket.io instance
 * @returns {Object} - Socket.io instance or null
 */
export const getSocket = () => {
  return socket;
};

/**
 * Close Socket.io connection
 */
export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Emit task updated event
 * @param {Object} taskData - Updated task data
 */
export const emitTaskUpdated = (taskData) => {
  if (socket) {
    socket.emit('task-updated', taskData);
  }
};

/**
 * Emit task created event
 * @param {Object} taskData - New task data
 */
export const emitTaskCreated = (taskData) => {
  if (socket) {
    socket.emit('task-created', taskData);
  }
};

/**
 * Emit task deleted event
 * @param {string} taskId - Task ID
 */
export const emitTaskDeleted = (taskId) => {
  if (socket) {
    socket.emit('task-deleted', taskId);
  }
};

/**
 * Emit task assigned event
 * @param {string} assignedToId - User ID to assign to
 * @param {string} taskTitle - Task title
 * @param {string} taskId - Task ID
 */
export const emitTaskAssigned = (assignedToId, taskTitle, taskId) => {
  if (socket) {
    socket.emit('task-assigned', {
      assignedToId,
      taskTitle,
      taskId,
    });
  }
};

/**
 * Listen to task updates
 * @param {Function} callback - Callback function
 */
export const onTaskUpdated = (callback) => {
  if (socket) {
    socket.on('task-updated', callback);
  }
};

/**
 * Listen to task created
 * @param {Function} callback - Callback function
 */
export const onTaskCreated = (callback) => {
  if (socket) {
    socket.on('task-created', callback);
  }
};

/**
 * Listen to task deleted
 * @param {Function} callback - Callback function
 */
export const onTaskDeleted = (callback) => {
  if (socket) {
    socket.on('task-deleted', callback);
  }
};

/**
 * Listen to assignment notifications
 * @param {Function} callback - Callback function
 */
export const onAssignmentNotification = (callback) => {
  if (socket) {
    socket.on('assignment-notification', callback);
  }
};

export default socket;
