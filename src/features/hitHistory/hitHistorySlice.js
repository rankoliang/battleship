import { createSlice } from '@reduxjs/toolkit';

export const hitHistorySlice = createSlice({
  name: 'hitHistory',
  initialState: {
    1: { id: 1, boardId: 1, state: [] },
    2: { id: 2, boardId: 2, state: [] },
  },
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
  },
});

export const { hitRecorded } = hitHistorySlice.actions;

export const selectHitHistory = (state, id) => state.hitHistory[id].state;

export default hitHistorySlice.reducer;
