import {
  createSlice,
  createAsyncThunk as createThunk,
  createSelector,
} from '@reduxjs/toolkit';
import boardFactory from './boardFactory';
import { shipCreated } from '../ships/shipsSlice';
import { shipCoordinates } from '../ships/shipFactory';
import { outOfBounds } from '../../helpers';

export const shipPlaced = createThunk(
  'boards/shipPlacedStatus',
  async (ship, { dispatch, getState, rejectWithValue }) => {
    if (selectIsValidPlacement(getState(), ship)) {
      dispatch(shipCreated(ship));
      return ship;
    } else {
      return rejectWithValue('Ship cannot be placed');
    }
  }
);

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
  },
  extraReducers: {
    // TODO Update the tiles on the board
    [shipPlaced.fulfilled]: (state, action) => {},
  },
});

export const { tileSet } = boardsSlice.actions;

// Selectors
const selectBoardEntities = (state) => state.boards.entities;
export const selectBoardIds = (state) => state.boards.ids;
export const selectBoardById = (state, id) => state.boards.entities[id].state;
export const selectAllBoards = createSelector(
  selectBoardIds,
  selectBoardEntities,
  (ids, entities) => ids.map((id) => entities[id])
);

export const selectIsValidPlacement = (state, ship) => {
  const { player } = ship;
  const board = selectBoardById(state, player);

  // true if none of the coordinates are out of bounds or occupied
  return !shipCoordinates(ship).some((coordinate) => {
    const [x, y] = coordinate;
    return outOfBounds(coordinate, board) || board[y][x].occupied;
  });
};

export default boardsSlice.reducer;
