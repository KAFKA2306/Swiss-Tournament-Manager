import React from 'react';
import { render, screen } from '@testing-library/react';
import axios from 'axios';
import Dashboard from './Dashboard';

jest.mock('axios');

test('renders tournament configuration from the server', async () => {
  axios.get.mockResolvedValueOnce({
    data: {
      tournamentName: 'JoinWars at VRChat',
      tableSize: 4,
      preliminaryRounds: 4,
      finalistCut: 22,
    },
  });
  axios.post.mockResolvedValueOnce({ data: [] });

  render(<Dashboard />);

  expect(await screen.findByText('JoinWars at VRChat')).toBeTruthy();
  expect(screen.getByText('4人卓 / 予選4ラウンド / 上位22名が決勝進出')).toBeTruthy();
});
