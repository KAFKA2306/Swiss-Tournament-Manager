import React from 'react';
import { render, screen } from '@testing-library/react';
import Register from './Register';

test('renders the registration form', () => {
  render(<Register />);
  expect(screen.getByPlaceholderText('Name')).toBeTruthy();
  expect(screen.getByPlaceholderText('Email')).toBeTruthy();
  expect(screen.getByPlaceholderText('Password')).toBeTruthy();
});
