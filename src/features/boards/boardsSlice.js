import { createSlice } from '@reduxjs/toolkit';
import boardFactory from './boardFactory';
import reducers from './boardsReducers';
import extraReducers from './boardsThunks';

export const boardsSlice = createSlice({
  name: 'boards',
  initialState: {
    ids: [1, 2],
    entities: {
      1: boardFactory({ player: 1, size: 10 }),
      2: boardFactory({ player: 2, size: 10 }),
    },
  },
  reducers,
  extraReducers,
});

export const {
  tileSet,
  previewSet,
  previewRemoved,
  orientationUpdated,
} = boardsSlice.actions;

export * from './boardsThunks';

export * from './boardsSelectors';

export default boardsSlice.reducer;
