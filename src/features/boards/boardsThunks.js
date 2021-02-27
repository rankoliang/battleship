import { createAsyncThunk as createThunk } from '@reduxjs/toolkit';
import {
  makeSelectValidPlacements,
  selectIsValidPlacement,
  selectBoardById,
  selectNextShip,
  selectShipsToBePlaced,
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
  async ({ player: { id } }, { dispatch, getState }) => {
    while (selectShipsToBePlaced(getState(), id) > 0) {
      const { length } = selectNextShip(getState(), id);

      const selectValidPlacements = makeSelectValidPlacements(id, length);

      const validPlacements = selectValidPlacements(getState());

      const [anchor, orientation] = shuffle.pick(validPlacements);

      await dispatch(nextShipPlaced({ id, anchor, orientation }));
    }
  },
  {
    condition: ({ player: { id } }, { getState }) => {
      return selectShipsToBePlaced(getState(), id) > 0;
    },
  }
);

const nextShipPlaced = createThunk(
  'boards/nextShipPlacedStatus',
  async (
    { id, anchor, orientation },
    { dispatch, getState, rejectWithValue }
  ) => {
    const nextShip = selectNextShip(getState(), id);
    if (nextShip.quantity <= 0)
      return rejectWithValue('Not enough ships remaining');

    const ship = {
      id: nanoid(),
      length: nextShip.length,
      anchor,
      orientation,
      player: id,
    };

    await dispatch(shipPlaced(ship));

    return [nextShip, id];
  }
);

const prepareNextShipPlaced = (id, anchor, orientation) =>
  nextShipPlaced({ id, anchor, orientation });

export { prepareNextShipPlaced as nextShipPlaced };

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
  [nextShipPlaced.fulfilled]: (state, action) => {
    const [{ name }, id] = action.payload;

    const { shipsToPlace } = state.entities[id];

    const ship = shipsToPlace[name];

    if (ship.quantity > 0) {
      ship.quantity = ship.quantity - 1;
    }

    if (ship.quantity === 0) {
      const shipEntries = Object.values(shipsToPlace);
      const availableShips = shipEntries.filter(({ quantity }) => {
        return quantity > 0;
      });
      if (availableShips.length === 0) {
        state.entities[id].selectedShip = null;
      } else {
        state.entities[id].selectedShip = availableShips[0].name;
      }
    }
  },
};

export default extraReducers;
