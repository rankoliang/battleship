import reducer, {
  selectTargets,
  targetsAdded,
  selectAiMode,
  aiModeSet,
} from './huntAiSlice';
import boardsReducer from '../boards/boardsSlice';
import hitHistoryReducer from '../hitHistory/hitHistorySlice';
import { configureStore } from '@reduxjs/toolkit';

describe('boardsSlice', () => {
  let store;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        huntAi: reducer,
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

    it('resets the target array', () => {
      store.dispatch(
        targetsAdded([
          [0, 0],
          [0, 1],
        ])
      );
      store.dispatch(aiModeSet('hunting'));

      expect(selectTargets(store.getState())).toEqual([]);
    });
  });

  describe('targetsAdded', () => {
    it('pushes to the targets array', () => {
      expect(selectTargets(store.getState())).toEqual([]);

      store.dispatch(
        targetsAdded([
          [0, 0],
          [0, 1],
        ])
      );

      expect(selectTargets(store.getState())).toEqual([
        [0, 0],
        [0, 1],
      ]);
    });
  });
});
