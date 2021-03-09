import {
  createAsyncThunk as createThunk,
  createSlice,
  createSelector,
} from '@reduxjs/toolkit';
import {
  attackReceived,
  selectHittableCoordinates,
  selectBoardById,
} from '../boards/boardsSlice';
import { adjacentTargets } from '../../helpers';
import { selectLastHitByBoardId } from '../hitHistory/hitHistorySlice';
import shuffle from 'shuffle-array';

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

const huntAiTurn = createThunk(
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

export const huntAiTargeted = createThunk(
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
  turns: 1,
  strategy: 'hunt',
  mode: 'hunting',
  targets: [],
});

export const aiSlice = createSlice({
  name: 'ai',
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

export const { aiModeSet, targetsAdded, targetsPopped } = aiSlice.actions;

export const selectAiTurns = (state) => state.ai.turns;

export default aiSlice.reducer;

export const selectAiMode = (state) => state.ai.mode;

export const selectTargets = (state) => state.ai.targets;

export const selectTargetsLeft = createSelector(
  selectTargets,
  (targets) => targets.length
);

export const selectStrategy = (state) => state.ai.strategy;

export const selectNextTarget = createSelector(
  selectTargets,
  (targets) => targets[targets.length - 1]
);

// private
const randomAttackChoice = (state, boardId) => {
  const coordinateOptions = selectHittableCoordinates(state, boardId);

  return shuffle.pick(coordinateOptions);
};

const coordinatesEqual = (a, b) => {
  return a[0] === b[0] && a[1] === b[1];
};
