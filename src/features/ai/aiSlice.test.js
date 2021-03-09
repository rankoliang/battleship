import reducer, { selectAiMode, aiModeSet } from './aiSlice';
import boardsReducer from '../boards/boardsSlice';
import hitHistoryReducer from '../hitHistory/hitHistorySlice';
import { configureStore } from '@reduxjs/toolkit';

describe('boardsSlice', () => {
  let store;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        ai: reducer,
        board: boardsReducer,
        hitHistory: hitHistoryReducer,
      },
    });
  });

  describe('modeSet', () => {
    it('sets the mode', () => {
      expect(selectAiMode(store.getState())).toBe('hunting');

      store.dispatch(aiModeSet('targeting'));

      expect(selectAiMode(store.getState())).toBe('targeting');
    });
  });
});
