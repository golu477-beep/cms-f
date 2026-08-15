import { render, screen } from '@testing-library/react';
import App from './App';
import axios from 'axios';

jest.mock('axios');

beforeEach(() => {
  axios.get.mockResolvedValue({ data: [] });
  axios.post.mockResolvedValue({ data: {} });
});

test('renders task management section', async () => {
  render(<App />);

  expect(await screen.findByText(/Task Management/i)).toBeInTheDocument();
  expect(screen.getByText(/Add Task/i)).toBeInTheDocument();
});
