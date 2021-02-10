import { configureStore, nanoid } from '@reduxjs/toolkit';

import reducer, {
  shipHit,
  selectShips,
  shipCreated,
  selectShipById,
  selectShipIsSunk,
} from './shipsSlice';

describe('shipsSlice', () => {
  let store;
  beforeEach(() => {
    store = configureStore({ reducer: { ships: reducer } });
  });

  describe('initialState', () => {
    it('has no ships', () => {
      expect(selectShips(store.getState())).toHaveLength(0);
    });
  });

  describe('shipCreated', () => {
    it('creates a ship', () => {
      let shipId = nanoid();
      store.dispatch(shipCreated({ player: 1, id: shipId, length: 4 }));

      expect(selectShips(store.getState())).toStrictEqual([
        {
          id: shipId,
          length: 4,
          hit: [false, false, false, false],
          player: 1,
        },
      ]);
    });
  });

  describe('shipHit', () => {
    let shipId;
    let getShip;

    beforeEach(() => {
      shipId = nanoid();
      store.dispatch(shipCreated({ player: 1, id: shipId, length: 3 }));
      getShip = () => selectShipById(store.getState(), shipId);
    });

    it('hits the designated location', () => {
      store.dispatch(shipHit(shipId, 0));

      expect(getShip().hit).toStrictEqual([true, false, false]);
    });

    describe('when the location is negative', () => {
      it('does not add a new entry', () => {
        store.dispatch(shipHit(shipId, -1));

        expect(getShip().hit).toStrictEqual([false, false, false]);
      });
    });

    describe('when the location is greater or equal to the ship length', () => {
      it('does not add a new entry', () => {
        store.dispatch(shipHit(shipId, 3));

        expect(getShip().hit).toStrictEqual([false, false, false]);
      });
    });
  });

  describe('selectShipIsSunk', () => {
    let shipId;

    beforeEach(() => {
      shipId = nanoid();
      store.dispatch(shipCreated({ player: 1, id: shipId, length: 1 }));
    });

    describe('when every location is hit', () => {
      it('returns true', () => {
        store.dispatch(shipHit(shipId, 0));

        expect(selectShipIsSunk(store.getState(), shipId)).toBe(true);
      });
    });

    describe('when every location is not hit', () => {
      it('returns false', () => {
        expect(selectShipIsSunk(store.getState(), shipId)).toBe(false);
      });
    });
  });
});
