import reducer, {
  hitRecorded,
  selectHitHistory,
  selectLastHit,
} from './hitHistorySlice';
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
      store.dispatch(hitRecorded(1, [0, 0], { status: 'miss' }));

      expect(selectHitHistory(store.getState(), 1)).toEqual([
        [[0, 0], { status: 'miss' }],
      ]);
    });
  });

  describe('selectLastHit', () => {
    it('returns the last hit', () => {
      store.dispatch(hitRecorded(1, [0, 0], { status: 'miss' }));
      store.dispatch(hitRecorded(1, [1, 0], { status: 'hit' }));

      expect(selectLastHit(store.getState(), 1)).toEqual([
        [1, 0],
        { status: 'hit' },
      ]);
    });
  });
});
