import { createSlice, createSelector } from '@reduxjs/toolkit';

export const gameSlice = createSlice({
  name: 'game',
  initialState: {
    phases: ['placement', 'started', 'ended'],
  },
  reducers: {
    phaseAdvanced: (state) => {
      const phases = state.phases;

      phases.shift();
    },
  },
});

export const { phaseAdvanced } = gameSlice.actions;

export const selectGame = (state) => state.game;

export const selectPhase = createSelector(selectGame, (game) => game.phases[0]);

export default gameSlice.reducer;
