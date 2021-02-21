import { configureStore, nanoid } from '@reduxjs/toolkit';
import reducer, {
  tileSet,
  shipPlaced,
  selectBoardById,
  selectAllBoards,
  selectIsValidPlacement,
} from './boardsSlice';
import shipsReducer, { selectShipTotal } from '../ships/shipsSlice';

describe('boardsSlice', () => {
  let store;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        boards: reducer,
        ships: shipsReducer,
      },
    });
  });

  describe('initialState', () => {
    it('has two boards', () => {
      expect(selectAllBoards(store.getState())).toHaveLength(2);
    });
  });

  describe('shipPlaced', () => {
    it('creates a ship', () => {
      store.dispatch(
        shipPlaced({
          id: nanoid(),
          player: 1,
          length: 4,
          orientation: 0,
          anchor: [0, 0],
        })
      );

      expect(selectShipTotal(store.getState())).toBe(1);
    });
  });

  describe('selectIsValidPlacement', () => {
    describe('when there is nothing blocking the ship', () => {
      it('returns true', () => {
        const ship = {
          id: nanoid(),
          player: 1,
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
          player: 1,
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
          player: 1,
          length: 4,
          orientation: 180,
          anchor: [-1, -1],
        };

        expect(selectIsValidPlacement(store.getState(), ship)).toBe(false);
      });
    });
  });

  describe('tileSet', () => {
    it('occupies the tile', () => {
      store.dispatch(tileSet(1, [0, 0], { value: 1 }));

      expect(selectBoardById(store.getState(), 1)[0][0].occupied).toBe(true);
    });

    it('sets given properties to their values', () => {
      store.dispatch(tileSet(1, [0, 0], { property: 'value', value: 'value' }));

      expect(selectBoardById(store.getState(), 1)[0][0].value).toBe('value');
      expect(selectBoardById(store.getState(), 1)[0][0].property).toBe('value');
    });
  });
});
