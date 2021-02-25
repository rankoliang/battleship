import {
  createSlice,
  createAsyncThunk as createThunk,
  createSelector,
} from '@reduxjs/toolkit';
import boardFactory from './boardFactory';
import { shipCreated, shipHit, selectShipById } from '../ships/shipsSlice';
import { shipCoordinates, nextRotation } from '../ships/shipFactory';
import { outOfBounds } from '../../helpers';

export const shipPlaced = createThunk(
  'boards/shipPlacedStatus',
  (ship, { dispatch, getState, rejectWithValue }) => {
    if (selectIsValidPlacement(getState(), ship)) {
      dispatch(shipCreated(ship));
      return ship;
    } else {
      return rejectWithValue('Ship cannot be placed');
    }
  }
);

const attackRecieved = createThunk(
  'boards/attackRecievedStatus',
  (
    { player, coordinate, coordinate: [x, y] },
    { dispatch, getState, rejectWithValue }
  ) => {
    const board = selectBoardById(getState(), player);
    if (outOfBounds(coordinate, board) || !board[y][x].occupied) {
      return rejectWithValue(`No ship on coordinates (${x}, ${y})`);
    } else {
      const { shipId, hitIndex } = board[y][x];
      dispatch(shipHit(shipId, hitIndex));
      return { player, coordinate };
    }
  }
);

const prepareAttackReceived = (player, coordinate) =>
  attackRecieved({ player, coordinate });

export { prepareAttackReceived as attackReceived };

export const boardsSlice = createSlice({
  name: 'boards',
  initialState: {
    ids: [1, 2],
    entities: {
      1: boardFactory({ player: 1, size: 10 }),
      2: boardFactory({ player: 2, size: 10 }),
    },
  },
  reducers: {
    tileSet: {
      reducer: (state, action) => {
        const {
          player,
          coordinates: [x, y],
          props,
        } = action.payload;

        const board = state.entities[player].state;

        board[y][x] = { ...board[y][x], ...props, occupied: true };
      },
      prepare: (player, coordinates, props) => {
        return {
          payload: { player, coordinates, props },
        };
      },
    },
    previewSet: (state, action) => {
      const ship = action.payload;
      const { player } = ship;
      // filters out of bound coordinates
      const coords = shipCoordinates(ship).filter(
        (coordinate) => !outOfBounds(coordinate, state.entities[player].state)
      );
      const prevCoords = state.entities[player].previewCoordinates;

      prevCoords?.forEach(([x, y]) => {
        state.entities[player].state[y][x].previewing = false;
      });

      state.entities[player].preview = ship;
      state.entities[player].previewCoordinates = coords;
      coords.forEach(([x, y]) => {
        state.entities[player].state[y][x].previewing = true;
      });
    },
    previewRemoved: (state, action) => {
      const player = action.payload;
      const prevCoords = state.entities[player].previewCoordinates;

      prevCoords?.forEach(([x, y]) => {
        state.entities[player].state[y][x].previewing = false;
      });

      state.entities[player].preview = null;
      state.entities[player].previewCoordinates = null;
    },
    orientationUpdated: (state, action) => {
      const player = action.payload;
      const orientation = state.entities[player].orientation;

      state.entities[player].orientation = nextRotation(orientation);
    },
  },
  extraReducers: {
    [shipPlaced.fulfilled]: (state, action) => {
      const ship = action.payload;
      const coordinates = shipCoordinates(ship);

      const board = state.entities[ship.player].state;

      coordinates.forEach(([x, y], i) => {
        board[y][x] = {
          ...board[y][x],
          shipId: ship.id,
          hitIndex: i,
          occupied: true,
        };
      });
      state.entities[ship.player].ships.push(ship.id);
    },
    [attackRecieved.fulfilled]: (state, action) => {
      const {
        player,
        coordinate: [x, y],
      } = action.payload;

      const board = state.entities[player].state;

      board[y][x].hit = true;
    },
  },
});

export const {
  tileSet,
  previewSet,
  previewRemoved,
  orientationUpdated,
} = boardsSlice.actions;

// Selectors
const selectBoardEntities = (state) => state.boards.entities;

export const selectBoardIds = (state) => state.boards.ids;

export const selectBoardById = (state, id) => state.boards.entities[id].state;

export const selectAllBoards = createSelector(
  selectBoardIds,
  selectBoardEntities,
  (ids, entities) => ids.map((id) => entities[id])
);

export const selectBoardShips = (state, id) => {
  return state.boards.entities[id].ships.map((shipId) =>
    selectShipById(state, shipId)
  );
};

export const selectBoardPreview = (state, id) => {
  return state.boards.entities[id].preview;
};

export const selectBoardPreviewCoordinates = (state, id) => {
  return state.boards.entities[id].previewCoordinates;
};

export const selectIsValidPlacement = (state, ship) => {
  if (ship === null) return false;

  const { player } = ship;
  const board = selectBoardById(state, player);

  // true if none of the coordinates are out of bounds or occupied
  return !shipCoordinates(ship).some((coordinate) => {
    const [x, y] = coordinate;
    return outOfBounds(coordinate, board) || board[y][x].occupied;
  });
};

export const selectOrientation = (state, id) =>
  state.boards.entities[id].orientation;

export default boardsSlice.reducer;
