'use client';

import { z } from 'zod';

/**
 * Schema for task creation/editing
 */
export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).default('Medium'),
  status: z.enum(['To Do', 'In Progress', 'Review', 'Completed']).default('To Do'),
  assignedToId: z.string().uuid('Invalid user').optional(),
});

/**
 * Schema for user registration
 */
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/**
 * Schema for user login
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Schema for profile update
 */
export const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
});

/**
 * Validate data against a Zod schema
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {Object} data - Data to validate
 * @returns {Object} - { success, data, errors }
 */
export const validate = (schema, data) => {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
      errors: {},
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return {
        success: false,
        data: null,
        errors,
      };
    }
    return {
      success: false,
      data: null,
      errors: { general: 'Validation failed' },
    };
  }
};

export default {
  taskSchema,
  registerSchema,
  loginSchema,
  profileSchema,
  validate,
};
