import { createAsyncThunk as createThunk, createSlice } from '@reduxjs/toolkit';
import {
  attackReceived,
  selectHittableCoordinates,
} from '../boards/boardsSlice';
import shuffle from 'shuffle-array';

export const randomAiTurn = createThunk(
  'randomAiTurnStatus',
  ({ boardId }, { dispatch, getState }) => {
    const attacks = randomAttackChoice(getState(), boardId);
    dispatch(attackReceived(boardId, attacks));
  }
);

export const aiTurn = createThunk(
  'aiTurnStatus',
  async (payload, { dispatch, getState }) => {
    const aiTurns = selectAiTurns(getState());

    for (let turn = 0; turn < aiTurns; turn++) {
      await dispatch(randomAiTurn(payload));
    }
  }
);

const getInitialState = () => ({
  turns: 2,
  mode: 'hunting',
});

export const aiSlice = createSlice({
  name: 'ai',
  initialState: getInitialState(),
  reducers: {
    aiModeSet: (state, action) => {
      state.mode = action.payload;
    },
  },
});

export const { aiModeSet } = aiSlice.actions;

export const selectAiTurns = (state) => state.ai.turns;

export default aiSlice.reducer;

export const selectAiMode = (state) => state.ai.mode;

// private
const randomAttackChoice = (state, boardId) => {
  const coordinateOptions = selectHittableCoordinates(state, boardId);

  return shuffle.pick(coordinateOptions);
};
