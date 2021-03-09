import { createSlice, createSelector } from '@reduxjs/toolkit';
import { selectHitHistoryId } from '../boards/boardsSlice';

const getInitialState = () => {
  return {
    1: { id: 1, boardId: 1, state: [] },
    2: { id: 2, boardId: 2, state: [] },
  };
};

export const hitHistorySlice = createSlice({
  name: 'hitHistory',
  initialState: getInitialState(),
  reducers: {
    hitRecorded: {
      reducer: (state, action) => {
        const { id, coordinate, status } = action.payload;
        const history = state[id].state;

        history.push([coordinate, status]);
      },
      prepare: (id, coordinate, status = null) => {
        return {
          payload: { id, coordinate, status },
        };
      },
    },
    hitHistoryReset: getInitialState,
  },
});

export const { hitRecorded, hitHistoryReset } = hitHistorySlice.actions;

export const selectHitHistory = (state, id) => state.hitHistory[id].state;

export const selectHitHistoryByBoardId = (state, boardId) => {
  const hitHistoryId = selectHitHistoryId(state, boardId);

  return selectHitHistory(state, hitHistoryId);
};

export const selectLastHit = createSelector(
  selectHitHistory,
  (history) => history[history.length - 1]
);

export const selectLastHitByBoardId = (state, boardId) => {
  const hitHistoryId = selectHitHistoryId(state, boardId);

  return selectLastHit(state, hitHistoryId);
};

export default hitHistorySlice.reducer;
