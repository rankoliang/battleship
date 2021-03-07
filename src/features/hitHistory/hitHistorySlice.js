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
        const { id, coordinate } = action.payload;
        const history = state[id].state;

        history.push(coordinate);
      },
      prepare: (id, coordinate) => {
        return {
          payload: { id, coordinate },
        };
      },
    },
  },
});

export const { hitRecorded } = hitHistorySlice.actions;

export const selectHitHistory = (state, id) => state.hitHistory[id].state;

export default hitHistorySlice.reducer;
