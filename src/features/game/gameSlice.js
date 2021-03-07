import {
  createAsyncThunk as createThunk,
  createSlice,
  createSelector,
} from '@reduxjs/toolkit';
import { shipsReset } from '../ships/shipsSlice';
import { boardsReset } from '../boards/boardsSlice';
import { playersReset } from '../players/playersSlice';
import { hitHistoryReset } from '../hitHistory/hitHistorySlice';

export const gameReset = createThunk(
  'game/gameResetStatus',
  async (_, { dispatch }) => {
    dispatch(hitHistoryReset());
    dispatch(boardsReset());
    dispatch(playersReset());
    dispatch(shipsReset());
  }
);

const getInitialState = () => ({
  phases: ['placement', 'started', 'ended'],
  winner: null,
  computerTurns: 2,
});

export const gameSlice = createSlice({
  name: 'game',
  initialState: getInitialState(),
  reducers: {
    phaseAdvanced: (state) => {
      state.phases.shift();
    },
    winnerSet: (state, action) => {
      state.winner = action.payload;
    },
  },
  extraReducers: {
    [gameReset.fulfilled]: getInitialState,
  },
});

export const { phaseAdvanced, winnerSet } = gameSlice.actions;

export const selectGame = (state) => state.game;

export const selectPhase = createSelector(selectGame, (game) => game.phases[0]);

export const selectWinner = createSelector(selectGame, (game) => game.winner);

export const selectComputerTurns = (state) => state.game.computerTurns;

export default gameSlice.reducer;
