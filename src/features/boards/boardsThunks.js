import { createAsyncThunk as createThunk } from '@reduxjs/toolkit';
import {
  makeSelectValidPlacements,
  selectIsValidPlacement,
  selectBoardById,
} from './boardsSlice';
import { shipCoordinates } from '../ships/shipFactory';
import { shipCreated, shipHit } from '../ships/shipsSlice';
import shuffle from 'shuffle-array';
import { nanoid } from '@reduxjs/toolkit';
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

const attackReceived = createThunk(
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
  attackReceived({ player, coordinate });

export { prepareAttackReceived as attackReceived };

export const randomShipsPlaced = createThunk(
  'boards/randomShipsPlacedStatus',
  async ({ player, lengths = [5, 4, 3, 3, 2] }, { dispatch, getState }) => {
    const shuffledLengths = shuffle(lengths, { copy: true });

    for (const length of shuffledLengths) {
      const selectValidPlacements = makeSelectValidPlacements(
        player.id,
        length
      );

      const validPlacements = selectValidPlacements(getState());

      const validOrientations = Object.keys(validPlacements).filter(
        (orientation) => validPlacements[orientation].length > 0
      );

      const orientation = shuffle.pick(validOrientations);

      const anchors = validPlacements[orientation];

      await dispatch(
        shipPlaced({
          length,
          orientation,
          id: nanoid(),
          player: player.id,
          anchor: shuffle.pick(anchors),
        })
      );
    }
  }
);

const extraReducers = {
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
  [attackReceived.fulfilled]: (state, action) => {
    const {
      player,
      coordinate: [x, y],
    } = action.payload;

    const board = state.entities[player].state;

    board[y][x].hit = true;
  },
};

export default extraReducers;
