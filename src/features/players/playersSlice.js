import { createSlice } from '@reduxjs/toolkit';

export const playersSlice = createSlice({
  name: 'players',
  initialState: {
    current: 1,
    entities: {
      1: { name: 'Player 1' },
      2: { name: 'Player 2' },
    },
  },
  reducers: {
    nameChanged: {
      reducer: (state, action) => {
        const { number, name } = action.payload;
        state.entities[number].name = name;
      },
      prepare: (number, name) => {
        return { payload: { number, name } };
      },
    },
    turnEnded: (state) => {
      state.current =
        (state.current % Object.entries(state.entities).length) + 1;
    },
  },
});

export const { turnEnded, nameChanged } = playersSlice.actions;

export const selectPlayers = (state) => state.players.entities;
export const selectCurrentPlayer = (state) =>
  state.players.entities[state.players.current];

export default playersSlice.reducer;
