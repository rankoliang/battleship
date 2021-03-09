import {
  createAsyncThunk as createThunk,
  createSlice,
  createSelector,
} from '@reduxjs/toolkit';
import { attackReceived, selectBoardById } from '../boards/boardsSlice';
import { adjacentTargets } from '../../helpers';
import { selectLastHitByBoardId } from '../hitHistory/hitHistorySlice';
import { randomAiTurn } from '../ai/aiSlice';

export const huntAiTurn = createThunk(
  'huntAiTurnStatus',
  async ({ boardId }, { dispatch, getState }) => {
    if (
      selectAiMode(getState()) === 'targeting' &&
      selectTargetsLeft(getState()) === 0
    ) {
      dispatch(aiModeSet('hunting'));
    }

    switch (selectAiMode(getState())) {
      case 'hunting':
        await dispatch(huntAiHunted({ boardId }));
        break;
      case 'targeting':
        await dispatch(huntAiTargeted({ boardId }));
        break;
      default:
        await dispatch(huntAiHunted({ boardId }));
    }
  }
);

const huntAiHunted = createThunk(
  'huntAiHunted',
  async ({ boardId }, { dispatch, getState }) => {
    await dispatch(randomAiTurn({ boardId }));
    const [lastCoordinate, status] = selectLastHitByBoardId(
      getState(),
      boardId
    );

    if (status !== 'miss') {
      dispatch(aiModeSet('targeting'));
      const board = selectBoardById(getState(), boardId);
      const targets = adjacentTargets(lastCoordinate, board);

      dispatch(targetsAdded(targets));
    }
  }
);

const huntAiTargeted = createThunk(
  'huntAiTargeted',
  async ({ boardId }, { dispatch, getState }) => {
    const target = selectNextTarget(getState());

    await dispatch(attackReceived(boardId, target));
    const [lastCoordinate, status] = selectLastHitByBoardId(
      getState(),
      boardId
    );

    if (status !== 'miss') {
      const board = selectBoardById(getState(), boardId);
      const targets = adjacentTargets(lastCoordinate, board);

      dispatch(targetsAdded(targets));
    }

    return target;
  }
);

const getInitialState = () => ({
  mode: 'hunting',
  targets: [],
});

export const huntAiSlice = createSlice({
  name: 'huntAi',
  initialState: getInitialState(),
  reducers: {
    aiModeSet: (state, action) => {
      state.mode = action.payload;
      state.targets = [];
    },
    targetsAdded: (state, action) => {
      state.targets.push(...action.payload);
    },
  },
  extraReducers: {
    [huntAiTargeted.fulfilled]: (state, action) => {
      state.targets = state.targets.filter((target) => {
        return !coordinatesEqual(target, action.payload);
      });
    },
  },
});

export const { aiModeSet, targetsAdded } = huntAiSlice.actions;

export default huntAiSlice.reducer;

export const selectAiMode = (state) => state.huntAi.mode;

export const selectTargets = (state) => state.huntAi.targets;

export const selectTargetsLeft = createSelector(
  selectTargets,
  (targets) => targets.length
);

export const selectNextTarget = createSelector(
  selectTargets,
  (targets) => targets[targets.length - 1]
);

// private
const coordinatesEqual = (a, b) => {
  return a[0] === b[0] && a[1] === b[1];
};
