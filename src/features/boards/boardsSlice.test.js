import { configureStore, nanoid } from '@reduxjs/toolkit';
import reducer, {
  selectAllBoards,
  placeShip,
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
    it('has two 8x8 boards', () => {
      expect(selectAllBoards(store.getState())).toHaveLength(2);
    });
  });

  describe('placeShip', () => {
    it('creates a ship', () => {
      store.dispatch(
        placeShip({
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
  });
});
