import { createSelector } from '@reduxjs/toolkit';
import { selectShipById } from '../ships/shipsSlice';
import { shipCoordinates } from '../ships/shipFactory';
import { outOfBounds } from '../../helpers';

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

export const makeSelectValidPlacements = (player, length) => (state) => {
  const board = selectBoardById(state, player);

  const orientations = [0, 90, 180, 270];
  const placements = [];

  orientations.forEach((orientation) => {
    board.forEach((row, yIndex) => {
      row.forEach((_, xIndex) => {
        const coordinate = [xIndex, yIndex];
        const ship = {
          player,
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

export const selectNextShip = (state, id) => {
  const { selectedShip, shipsToPlace } = state.boards.entities[id];

  return shipsToPlace[selectedShip];
};

export const selectRemainingShips = (state, id) => {
  return state.boards.entities[id].shipsToPlace;
};
