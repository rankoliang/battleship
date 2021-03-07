import reducer, { hitRecorded, selectHitHistory } from './hitHistorySlice';
import { configureStore } from '@reduxjs/toolkit';

describe('boardsSlice', () => {
  let store;
  beforeEach(() => {
    store = configureStore({ reducer: { hitHistory: reducer } });
  });

  describe('initialState', () => {
    it('is an empty array', () => {
      expect(selectHitHistory(store.getState(), 1)).toEqual([]);
    });
  });

  describe('hitRecorded', () => {
    it('pushes to the history', () => {
      store.dispatch(hitRecorded(1, [0, 0], 'miss'));

      expect(selectHitHistory(store.getState(), 1)).toEqual([[[0, 0], 'miss']]);
    });
  });
});
