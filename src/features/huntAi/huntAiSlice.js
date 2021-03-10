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
        dispatch(huntAiHunted({ boardId }));
        break;
      case 'targeting':
        dispatch(huntAiTargeted({ boardId }));
        break;
      default:
        dispatch(huntAiHunted({ boardId }));
    }
  }
);

const huntAiHunted = createThunk(
  'huntAiHunted',
  async ({ boardId }, { dispatch }) => {
    dispatch(randomAiTurn({ boardId }));

    dispatch(
      adjacentTargetsAdded({
        boardId,
        onHit: () => {
          dispatch(aiModeSet('targeting'));
        },
      })
    );
  }
);

const huntAiTargeted = createThunk(
  'huntAiTargeted',
  async ({ boardId }, { dispatch, getState }) => {
    const target = selectNextTarget(getState());

    dispatch(attackReceived(boardId, target));

    dispatch(adjacentTargetsAdded({ boardId }));

    return target;
  }
);

const adjacentTargetsAdded = createThunk(
  'adjacentTargetsAdded',
  async ({ boardId, onHit = () => {} }, { dispatch, getState }) => {
    const [lastCoordinate, { status, length }] = selectLastHitByBoardId(
      getState(),
      boardId
    );

    if (status !== 'miss') {
      onHit();

      const board = selectBoardById(getState(), boardId);
      const targets = adjacentTargets(lastCoordinate, board);

      dispatch(targetsAdded(targets));
    }

    switch (status) {
      case 'hit':
        dispatch(targetHit());
        break;
      case 'sunk':
        const hits = selectTargetingHits(getState()) - length + 1;
        if (hits === 0) {
          dispatch(aiModeSet('hunting'));
        } else {
          dispatch(setTargetingHits(selectTargetingHits()));
        }
        break;
      default:
    }
  }
);

const getInitialState = () => ({
  mode: 'hunting',
  targets: [],
  targetingHits: 0,
});

export const huntAiSlice = createSlice({
  name: 'huntAi',
  initialState: getInitialState(),
  reducers: {
    aiModeSet: (state, action) => {
      state.mode = action.payload;
      state.targets = [];
      state.targetingHits = 0;
    },
    targetsAdded: (state, action) => {
      state.targets.push(...action.payload);
    },
    targetHit: (state) => {
      state.targetingHits++;
    },
    setTargetingHits: (state, action) => {
      state.targetingHits = action.payload;
    },
  },
  extraReducers: {
    [huntAiTargeted.fulfilled]: (state, action) => {
      if (state.mode === 'targeting') {
        state.targets = state.targets.filter((target) => {
          return !coordinatesEqual(target, action.payload);
        });
      }
    },
  },
});

export const {
  aiModeSet,
  targetsAdded,
  targetHit,
  setTargetingHits,
} = huntAiSlice.actions;

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

const selectTargetingHits = (state) => state.huntAi.targetingHits;

// private

const coordinatesEqual = (a, b) => {
  return a[0] === b[0] && a[1] === b[1];
};
