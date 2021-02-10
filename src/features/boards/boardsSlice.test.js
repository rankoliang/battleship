import { configureStore } from '@reduxjs/toolkit';
import reducer, { selectAllBoards } from './boardsSlice';

// import { reducer }

describe('boardsSlice', () => {
  let store;
  beforeEach(() => {
    store = configureStore({
      reducer: { boards: reducer },
    });
  });

  describe('initialState', () => {
    it('has two 8x8 boards', () => {
      expect(selectAllBoards(store.getState())).toHaveLength(2);
    });
  });
});
