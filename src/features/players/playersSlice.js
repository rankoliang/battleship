import { createSlice } from '@reduxjs/toolkit';

export const playersSlice = createSlice({
  name: 'counter',
  initialState: [
    { number: 1, name: 'Player 1' },
    { number: 2, name: 'Player 2' },
  ],
  reducers: {
    nameChanged: {
      reducer: (state, action) => {
        const { number, name } = action.payload;
        state.find((player) => player.number === number).name = name;
      },
      prepare: (number, name) => {
        return { payload: { number, name } };
      },
    },
    turnEnded: (state) => {
      state.push(state.shift());
    },
  },
});

export const { turnEnded, nameChanged } = playersSlice.actions;

export const selectPlayers = (state) => state.players;
export const selectCurrentPlayer = (state) => state.players[0];
export const createSelectPlayer = (number) => (state) =>
  state.players.find((player) => player.number === number);

export default playersSlice.reducer;
