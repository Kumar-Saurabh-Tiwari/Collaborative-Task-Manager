import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskForm from '@/components/TaskForm';

jest.mock('@/lib/apiClient');

describe('TaskForm Component', () => {
  it('renders form with inputs', () => {
    const mockCallback = jest.fn();
    render(<TaskForm onTaskCreated={mockCallback} />);

    expect(screen.getByLabelText(/task title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
  });

  it('shows error when title is empty', async () => {
    const mockCallback = jest.fn();
    render(<TaskForm onTaskCreated={mockCallback} />);

    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });
});
