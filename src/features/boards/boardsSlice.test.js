import { configureStore, nanoid } from '@reduxjs/toolkit';
import reducer, {
  tileSet,
  lastCoordinateHitUpdated,
  selectAllBoards,
  selectIsValidPlacement,
  selectBoardPreview,
  selectLastCoordinateHitStatus,
  makeSelectValidPlacements,
} from './boardsSlice';
import shipsReducer from '../ships/shipsSlice';
import playersReducer from '../players/playersSlice';

describe('boardsSlice', () => {
  let store;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        boards: reducer,
        ships: shipsReducer,
        players: playersReducer,
      },
    });
  });

  describe('initialState', () => {
    it('has two boards', () => {
      expect(selectAllBoards(store.getState())).toHaveLength(2);
    });

    it('has a preview that is initially null', () => {
      const preview = selectBoardPreview(store.getState(), 1);

      expect(preview).toBe(null);
    });
  });

  describe('selectIsValidPlacement', () => {
    describe('when there is nothing blocking the ship', () => {
      it('returns true', () => {
        const ship = {
          id: nanoid(),
          boardId: 1,
          playerId: 1,
          length: 4,
          orientation: 0,
          anchor: [0, 0],
        };

        expect(selectIsValidPlacement(store.getState(), ship)).toBe(true);
      });
    });

    describe('when there is a ship in the way', () => {
      it('returns false', () => {
        const ship = {
          id: nanoid(),
          boardId: 1,
          playerId: 1,
          length: 4,
          orientation: 0,
          anchor: [0, 0],
        };

        store.dispatch(
          tileSet(1, [0, 0], {
            shipId: ship.id,
            shipLocation: 0,
          })
        );

        expect(selectIsValidPlacement(store.getState(), ship)).toBe(false);
      });
    });

    describe('when the ship is out of bounds', () => {
      it('returns false', () => {
        const ship = {
          id: nanoid(),
          boardId: 1,
          playerId: 1,
          length: 4,
          orientation: 180,
          anchor: [-1, -1],
        };

        expect(selectIsValidPlacement(store.getState(), ship)).toBe(false);
      });
    });

    describe('when the ship is null', () => {
      it('returns false', () => {
        expect(selectIsValidPlacement(store.getState(), null)).toBe(false);
      });
    });
  });

  describe('selectValidPlacements', () => {
    it('returns valid placement coordinates', () => {
      expect(makeSelectValidPlacements(2, 10)(store.getState())).toEqual([
        [[0, 0], 0],
        [[0, 1], 0],
        [[0, 2], 0],
        [[0, 3], 0],
        [[0, 4], 0],
        [[0, 5], 0],
        [[0, 6], 0],
        [[0, 7], 0],
        [[0, 8], 0],
        [[0, 9], 0],
        [[0, 0], 90],
        [[1, 0], 90],
        [[2, 0], 90],
        [[3, 0], 90],
        [[4, 0], 90],
        [[5, 0], 90],
        [[6, 0], 90],
        [[7, 0], 90],
        [[8, 0], 90],
        [[9, 0], 90],
        [[9, 0], 180],
        [[9, 1], 180],
        [[9, 2], 180],
        [[9, 3], 180],
        [[9, 4], 180],
        [[9, 5], 180],
        [[9, 6], 180],
        [[9, 7], 180],
        [[9, 8], 180],
        [[9, 9], 180],
        [[0, 9], 270],
        [[1, 9], 270],
        [[2, 9], 270],
        [[3, 9], 270],
        [[4, 9], 270],
        [[5, 9], 270],
        [[6, 9], 270],
        [[7, 9], 270],
        [[8, 9], 270],
        [[9, 9], 270],
      ]);
    });
  });

  describe('selectLastCoordinateHitStatus', () => {
    describe('when the tile is not occupied', () => {
      it('return miss', () => {
        store.dispatch(lastCoordinateHitUpdated(1, [0, 0]));

        expect(selectLastCoordinateHitStatus(store.getState(), 1)).toBe('miss');
      });
    });

    describe('when the tile is occupied', () => {
      it('return hit', () => {
        store.dispatch(tileSet(1, [0, 0], { occupied: true }));
        store.dispatch(lastCoordinateHitUpdated(1, [0, 0]));

        expect(selectLastCoordinateHitStatus(store.getState(), 1)).toBe('hit');
      });
    });
  });
});
