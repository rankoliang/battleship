import { configureStore } from '@reduxjs/toolkit';
import reducer, { selectGame, selectPhase, phaseAdvanced } from './gameSlice';

describe('gameSlice', () => {
  let store;
  beforeEach(() => {
    store = configureStore({ reducer: { game: reducer } });
  });

  describe('initialState', () => {
    it('has phases', () => {
      const game = selectGame(store.getState());

      expect(game.phases).toEqual(['placement', 'started', 'ended']);
    });
  });

  describe('selectPhase', () => {
    it('returns the current phase', () => {
      expect(selectPhase(store.getState(), 1)).toBe('placement');
    });
  });

  describe('phaseAdvanced', () => {
    it('advances to the next phase', () => {
      store.dispatch(phaseAdvanced(1));

      expect(selectPhase(store.getState(), 1)).toBe('started');
    });
  });
});
