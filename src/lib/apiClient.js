import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://task-management-backend-rsgy.onrender.com' || 'http://localhost:5000';

/**
 * Axios instance for API calls
 * Includes automatic cookie handling for authentication
 */
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true, // Enable cookie handling
});

/**
 * Request interceptor to add authorization headers
 */
apiClient.interceptors.request.use(
  (config) => {
    // Add token from localStorage if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle errors
 * Note: 401 errors are not automatically redirected here.
 * Each component should handle auth errors gracefully.
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Don't auto-redirect on 401 - let components handle it
    // This prevents blocking the app flow
    return Promise.reject(error);
  }
);

/**
 * Authentication API endpoints
 */
export const authAPI = {
  /**
   * Register a new user
   * @param {string} email - User email
   * @param {string} name - User name
   * @param {string} password - User password
   * @returns {Promise<Object>}
   */
  register: (email, name, password) =>
    apiClient.post('/api/auth/register', { email, name, password }),

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>}
   */
  login: (email, password) =>
    apiClient.post('/api/auth/login', { email, password }),

  /**
   * Logout user
   * @returns {Promise<Object>}
   */
  logout: () => apiClient.post('/api/auth/logout'),
};

/**
 * User API endpoints
 */
export const userAPI = {
  /**
   * Get current user profile
   * @returns {Promise<Object>}
   */
  getCurrentUser: () => apiClient.get('/api/users/me'),

  /**
   * Update user profile
   * @param {Object} data - Profile data
   * @returns {Promise<Object>}
   */
  updateProfile: (data) => apiClient.put('/api/users/me', data),

  /**
   * Get all users
   * @returns {Promise<Object>}
   */
  getAllUsers: () => apiClient.get('/api/users'),
};

/**
 * Task API endpoints
 */
export const taskAPI = {
  /**
   * Get all tasks
   * @param {Object} options - Query options
   * @returns {Promise<Object>}
   */
  getAllTasks: (options = {}) => {
    const params = new URLSearchParams();
    if (options.status) params.append('status', options.status);
    if (options.priority) params.append('priority', options.priority);
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);
    
    const queryString = params.toString();
    return apiClient.get(`/api/tasks${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Get task by ID
   * @param {string} id - Task ID
   * @returns {Promise<Object>}
   */
  getTaskById: (id) => apiClient.get(`/api/tasks/${id}`),

  /**
   * Create a new task
   * @param {Object} data - Task data
   * @returns {Promise<Object>}
   */
  createTask: (data) => apiClient.post('/api/tasks', data),

  /**
   * Update a task
   * @param {string} id - Task ID
   * @param {Object} data - Task data
   * @returns {Promise<Object>}
   */
  updateTask: (id, data) => apiClient.put(`/api/tasks/${id}`, data),

  /**
   * Delete a task
   * @param {string} id - Task ID
   * @returns {Promise<Object>}
   */
  deleteTask: (id) => apiClient.delete(`/api/tasks/${id}`),

  /**
   * Get assigned tasks
   * @returns {Promise<Object>}
   */
  getAssignedTasks: () => apiClient.get('/api/tasks/dashboard/assigned'),

  /**
   * Get created tasks
   * @returns {Promise<Object>}
   */
  getCreatedTasks: () => apiClient.get('/api/tasks/dashboard/created'),

  /**
   * Get overdue tasks
   * @returns {Promise<Object>}
   */
  getOverdueTasks: () => apiClient.get('/api/tasks/dashboard/overdue'),
};

export default apiClient;
