import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import { emptySquareArray } from '../../helpers';

export const boardsSlice = createSlice({
  name: 'boards',
  initialState: {
    ids: [1, 2],
    entities: {
      1: {
        player: 1,
        state: emptySquareArray(8),
      },
      2: {
        player: 2,
        state: emptySquareArray(8),
      },
    },
  },
});

// Selectors
const selectBoardEntities = (state) => state.boards.entities;
export const selectBoardIds = (state) => state.boards.ids;
export const selectBoardById = (state, id) => state.boards.entities[id];
export const selectAllBoards = createSelector(
  selectBoardIds,
  selectBoardEntities,
  (ids, entities) => ids.map((id) => entities[id])
);

export default boardsSlice.reducer;
