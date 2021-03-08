import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => ({
  current: 1,
  entities: {
    1: {
      id: 1,
      name: 'Player',
      computer: false,
      opponentId: 2,
      boardId: 1,
    },
    2: {
      id: 2,
      name: 'Computer',
      computer: true,
      opponentId: 1,
      boardId: 2,
    },
  },
});

export const playersSlice = createSlice({
  name: 'players',
  initialState: getInitialState(),
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
    playersReset: getInitialState,
  },
});

export const { turnEnded, nameChanged, playersReset } = playersSlice.actions;

export const selectPlayers = (state) => Object.values(state.players.entities);

export const selectCurrentPlayer = (state) =>
  state.players.entities[state.players.current];

export const selectPlayerById = (state, id) => state.players.entities[id];

export const selectOpponent = (state, id) => {
  const player = state.players.entities[id];
  return state.players.entities[player.opponentId];
};

export default playersSlice.reducer;
