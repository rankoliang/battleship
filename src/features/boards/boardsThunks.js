import { createAsyncThunk as createThunk } from '@reduxjs/toolkit';
import {
  makeSelectValidPlacements,
  selectPlayerId,
  selectIsValidPlacement,
  selectBoardById,
  selectNextShip,
  selectShipsToBePlaced,
  selectAllShipsLeftToBePlaced,
} from './boardsSlice';
import { shipCoordinates } from '../ships/shipFactory';
import {
  shipCreated,
  shipHit,
  makeSelectShipsLeftForPlayer,
} from '../ships/shipsSlice';
import { selectOpponent } from '../players/playersSlice';
import { phaseAdvanced } from '../game/gameSlice';
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
    { boardId, coordinate, coordinate: [x, y] },
    { dispatch, getState, rejectWithValue }
  ) => {
    const board = selectBoardById(getState(), boardId);
    if (opponentShipsLeft(getState(), boardId) === 0) {
      return rejectWithValue(`All ships have been placed!`);
    }

    if (outOfBounds(coordinate, board)) {
      return rejectWithValue(`The coordinates (${x}, ${y}) are out of bounds`);
    } else if (board[y][x].occupied) {
      const { shipId, hitIndex } = board[y][x];
      dispatch(shipHit(shipId, hitIndex));
    }
    return { boardId, coordinate };
  }
);

const prepareAttackReceived = (boardId, coordinate) =>
  attackReceived({ boardId, coordinate });

export { prepareAttackReceived as attackReceived };

export const randomShipsPlaced = createThunk(
  'boards/randomShipsPlacedStatus',
  async ({ boardId }, { dispatch, getState }) => {
    while (selectShipsToBePlaced(getState(), boardId) > 0) {
      const nextShip = selectNextShip(getState(), boardId);
      const [anchor, orientation] = randomPlacement(
        getState(),
        boardId,
        nextShip
      );

      await dispatch(nextShipPlaced({ boardId, anchor, orientation }));
    }
  },
  {
    condition: ({ boardId }, { getState }) => {
      return selectShipsToBePlaced(getState(), boardId) > 0;
    },
  }
);

const nextShipPlaced = createThunk(
  'boards/nextShipPlacedStatus',
  async (
    { boardId, anchor, orientation },
    { dispatch, getState, rejectWithValue }
  ) => {
    const nextShip = selectNextShip(getState(), boardId);
    const playerId = selectPlayerId(getState(), boardId);

    if (nextShip.quantity <= 0) {
      return rejectWithValue('Not enough ships remaining');
    }

    const shipsRemaining = selectAllShipsLeftToBePlaced(getState()) - 1;

    const ship = {
      id: nanoid(),
      length: nextShip.length,
      anchor,
      orientation,
      boardId,
      playerId,
    };

    await dispatch(shipPlaced(ship));

    if (shipsRemaining === 0) {
      dispatch(phaseAdvanced());
    }

    return [nextShip, boardId];
  }
);

const prepareNextShipPlaced = (boardId, anchor, orientation) =>
  nextShipPlaced({ boardId, anchor, orientation });

export { prepareNextShipPlaced as nextShipPlaced };

// Private functions
const updateNextSelectedShip = (state, id) => {
  const { shipsToPlace } = state.entities[id];
  const availableShips = availableShipsFor(shipsToPlace);

  if (availableShips.length === 0) {
    state.entities[id].selectedShip = null;
    state.entities[id].preview = null;
    state.entities[id].previewCoordinates = null;
  } else {
    state.entities[id].selectedShip = availableShips[0].name;
  }
};

const availableShipsFor = (shipsToPlace) => {
  const shipEntries = Object.values(shipsToPlace);

  return shipEntries.filter(({ quantity }) => {
    return quantity > 0;
  });
};

const randomPlacement = (state, id, ship) => {
  const { length } = ship;
  const selectValidPlacements = makeSelectValidPlacements(id, length);
  const validPlacements = selectValidPlacements(state);
  const [anchor, orientation] = shuffle.pick(validPlacements);

  return [anchor, orientation];
};

const placeShipOnBoard = (board, ship) => {
  shipCoordinates(ship).forEach(([x, y], i) => {
    board[y][x] = {
      ...board[y][x],
      shipId: ship.id,
      hitIndex: i,
      occupied: true,
    };
  });
};

const opponentShipsLeft = (state, boardId) => {
  const playerId = selectPlayerId(state, boardId);
  const opponent = selectOpponent(state, playerId);
  const selectShipsLeftForPlayer = makeSelectShipsLeftForPlayer(opponent.id);
  return selectShipsLeftForPlayer(state);
};

// Default export
const extraReducers = {
  [shipPlaced.fulfilled]: (state, action) => {
    const ship = action.payload;
    const board = state.entities[ship.boardId].state;

    placeShipOnBoard(board, ship);
    state.entities[ship.boardId].ships.push(ship.id);
  },
  [attackReceived.fulfilled]: (state, action) => {
    const {
      boardId,
      coordinate: [x, y],
    } = action.payload;

    const board = state.entities[boardId].state;

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
      updateNextSelectedShip(state, id);
    }
  },
};

export default extraReducers;
