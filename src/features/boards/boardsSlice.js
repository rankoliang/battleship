import { createSlice } from '@reduxjs/toolkit';
import reducers from './boardsReducers';
import extraReducers from './boardsThunks';
import getInitialState from './boardsInitialState';

export const boardsSlice = createSlice({
  name: 'boards',
  initialState: getInitialState(),
  reducers,
  extraReducers,
});

export const {
  tileSet,
  previewSet,
  previewRemoved,
  orientationUpdated,
  boardsReset,
} = boardsSlice.actions;

export * from './boardsThunks';

export * from './boardsSelectors';

export default boardsSlice.reducer;
