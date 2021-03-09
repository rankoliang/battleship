import { createAsyncThunk as createThunk, createSlice } from '@reduxjs/toolkit';
import {
  attackReceived,
  selectHittableCoordinates,
} from '../boards/boardsSlice';
import shuffle from 'shuffle-array';

export const randomAiTurn = createThunk(
  'randomAiTurnStatus',
  ({ boardId }, { dispatch, getState }) => {
    const coordinateOptions = selectHittableCoordinates(getState(), boardId);
    const aiTurns = selectAiTurns(getState());

    const computerChoice = shuffle.pick(coordinateOptions, {
      picks: aiTurns,
    });

    if (aiTurns === 1) {
      dispatch(attackReceived(boardId, computerChoice));
    } else {
      for (let turn = 0; turn < aiTurns; turn++) {
        dispatch(attackReceived(boardId, computerChoice[turn]));
      }
    }
  }
);

export const aiTurn = createThunk(
  'aiTurnStatus',
  ({ boardId }, { dispatch }) => {
    dispatch(randomAiTurn({ boardId }));
  }
);

const getInitialState = () => ({
  turns: 2,
});

export const aiSlice = createSlice({
  name: 'ai',
  initialState: getInitialState(),
});

export const {} = aiSlice.actions;

export const selectAiTurns = (state) => state.ai.turns;

export default aiSlice.reducer;
