import { createAsyncThunk as createThunk, createSlice } from '@reduxjs/toolkit';
import {
  attackReceived,
  selectHittableCoordinates,
} from '../boards/boardsSlice';
import { gameReset, gameBegun } from '../game/gameSlice';
import shuffle from 'shuffle-array';
import { huntAiTurn } from '../huntAi/huntAiSlice';

export const randomAiTurn = createThunk(
  'randomAiTurnStatus',
  ({ boardId }, { dispatch, getState }) => {
    const attack = randomAttackChoice(getState(), boardId);
    dispatch(attackReceived(boardId, attack));
  }
);

export const aiTurn = createThunk(
  'aiTurnStatus',
  async ({ boardId }, { dispatch, getState }) => {
    const aiTurns = selectAiTurns(getState());

    for (let turn = 0; turn < aiTurns; turn++) {
      switch (selectStrategy(getState())) {
        case 'hunt':
          await dispatch(huntAiTurn({ boardId }));
          break;
        case 'random':
        default:
          await dispatch(randomAiTurn({ boardId }));
      }
    }
  }
);

export const difficultyChosen = createThunk(
  'difficultyChosenStatus',
  async (payload, { dispatch }) => {
    await dispatch(gameReset());
    dispatch(gameBegun());

    return payload;
  }
);

const getInitialState = () => ({
  turns: 1,
  strategy: 'hunt',
});

export const aiSlice = createSlice({
  name: 'ai',
  initialState: getInitialState(),
  extraReducers: {
    [difficultyChosen.fulfilled]: (state, action) => {
      const { difficulty, strategy } = action.payload;

      state.strategy = strategy;

      switch (difficulty) {
        case 'easy':
          state.turns = 1;
          break;
        case 'hard':
          state.turns = 3;
          break;
        case 'medium':
        default:
          state.turns = 2;
          break;
      }
    },
  },
});

// export const { difficultyChosen } = aiSlice.actions;

export const selectAiTurns = (state) => state.ai.turns;

export default aiSlice.reducer;

export const selectStrategy = (state) => state.ai.strategy;

// private
const randomAttackChoice = (state, boardId) => {
  const coordinateOptions = selectHittableCoordinates(state, boardId);

  return shuffle.pick(coordinateOptions);
};
