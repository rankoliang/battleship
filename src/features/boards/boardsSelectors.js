import { createSelector } from '@reduxjs/toolkit';
import { selectShipById } from '../ships/shipsSlice';
import { shipCoordinates } from '../ships/shipFactory';
import { outOfBounds } from '../../helpers';

const selectBoardEntities = (state) => state.boards.entities;

const selectBoardEntityById = (state, id) =>
  id ? state.boards.entities[id] : undefined;

export const selectBoardIds = (state) => state.boards.ids;

export const selectBoardById = createSelector(
  selectBoardEntityById,
  (entity) => entity.state
);

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

export const selectBoardPreview = createSelector(
  selectBoardEntityById,
  (boardEntity) => boardEntity?.preview
);

export const selectBoardPreviewCoordinates = createSelector(
  selectBoardEntityById,
  (boardEntity) => boardEntity?.previewCoordinates
);

export const selectIsValidPlacement = (state, ship) => {
  if (ship === null || ship === undefined) return false;

  const { boardId } = ship;
  const board = selectBoardById(state, boardId);

  // true if none of the coordinates are out of bounds or occupied
  return !shipCoordinates(ship).some((coordinate) => {
    const [x, y] = coordinate;
    return outOfBounds(coordinate, board) || board[y][x].occupied;
  });
};

export const selectOrientation = createSelector(
  selectBoardEntityById,
  (boardEntity) => boardEntity?.orientation
);

export const makeSelectValidPlacements = (id, length) => (state) => {
  const board = selectBoardById(state, id);

  const orientations = [0, 90, 180, 270];
  const placements = [];

  orientations.forEach((orientation) => {
    board.forEach((row, yIndex) => {
      row.forEach((_, xIndex) => {
        const coordinate = [xIndex, yIndex];
        const ship = {
          boardId: id,
          length,
          orientation,
          anchor: coordinate,
        };

        if (selectIsValidPlacement(state, ship)) {
          placements.push([coordinate, orientation]);
        }
      });
    });
  });

  return placements;
};

export const selectNextShip = createSelector(
  selectBoardEntityById,
  selectOrientation,
  ({ selectedShip, shipsToPlace }, orientation) => {
    if (selectedShip === null) {
      return null;
    } else {
      return { ...shipsToPlace[selectedShip], orientation };
    }
  }
);

export const selectRemainingShips = createSelector(
  selectBoardEntityById,
  ({ shipsToPlace }) => {
    return shipsToPlace;
  }
);

export const selectShipsToBePlaced = createSelector(
  selectBoardEntityById,
  ({ shipsToPlace }) => {
    return Object.values(shipsToPlace).reduce(
      (sum, { quantity }) => sum + quantity,
      0
    );
  }
);

const objectSum = (obj, callback) => {
  return Object.values(obj).reduce((sum, value) => {
    return sum + callback(value);
  }, 0);
};

export const selectAllShipsRemianing = createSelector(
  selectBoardEntities,
  (entities) => {
    return objectSum(entities, ({ shipsToPlace }) =>
      objectSum(shipsToPlace, ({ quantity }) => quantity)
    );
  }
);

export const selectPlayerId = createSelector(
  selectBoardEntityById,
  ({ playerId }) => playerId
);
