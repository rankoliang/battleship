import { configureStore, nanoid } from '@reduxjs/toolkit';

import reducer, {
  shipHit,
  selectShips,
  shipCreated,
  selectShipById,
  selectShipIsSunk,
  selectShipCoordinates,
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
      store.dispatch(
        shipCreated({
          id: shipId,
          playerId: 1,
          boardId: 1,
          length: 4,
          orientation: 0,
          anchor: [0, 0],
        })
      );

      expect(selectShips(store.getState())).toStrictEqual([
        {
          id: shipId,
          length: 4,
          playerId: 1,
          boardId: 1,
          orientation: 0,
          anchor: [0, 0],
          hit: [false, false, false, false],
        },
      ]);
    });
  });

  describe('shipHit', () => {
    let shipId;
    let getShip;

    beforeEach(() => {
      shipId = nanoid();
      store.dispatch(
        shipCreated({ playerId: 1, boardId: 1, id: shipId, length: 3 })
      );
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
      store.dispatch(
        shipCreated({ playerId: 1, boardId: 1, id: shipId, length: 1 })
      );
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

  describe('selectShipCoordinates', () => {
    describe('when the orientation is 0', () => {
      it('returns a ship along the x axis', () => {
        const shipId = nanoid();
        store.dispatch(
          shipCreated({
            playerId: 1,
            boardId: 1,
            id: shipId,
            length: 3,
            orientation: 0,
            anchor: [0, 0],
          })
        );

        expect(selectShipCoordinates(store.getState(), shipId)).toStrictEqual([
          [0, 0],
          [1, 0],
          [2, 0],
        ]);
      });
    });

    describe('when the orientation is 90', () => {
      it('returns a ship along the x axis', () => {
        const shipId = nanoid();
        store.dispatch(
          shipCreated({
            boardId: 1,
            playerId: 1,
            id: shipId,
            length: 3,
            orientation: 90,
            anchor: [0, 0],
          })
        );

        expect(selectShipCoordinates(store.getState(), shipId)).toStrictEqual([
          [0, 0],
          [0, 1],
          [0, 2],
        ]);
      });
    });

    describe('when the orientation is 180', () => {
      it('returns a ship along the x axis', () => {
        const shipId = nanoid();
        store.dispatch(
          shipCreated({
            boardId: 1,
            playerId: 1,
            id: shipId,
            length: 3,
            orientation: 180,
            anchor: [0, 0],
          })
        );

        expect(selectShipCoordinates(store.getState(), shipId)).toStrictEqual([
          [0, 0],
          [-1, 0],
          [-2, 0],
        ]);
      });
    });

    describe('when the orientation is 270', () => {
      it('returns a ship along the x axis', () => {
        const shipId = nanoid();
        store.dispatch(
          shipCreated({
            playerId: 1,
            boardId: 1,
            id: shipId,
            length: 3,
            orientation: 270,
            anchor: [0, 0],
          })
        );

        expect(selectShipCoordinates(store.getState(), shipId)).toStrictEqual([
          [0, 0],
          [0, -1],
          [0, -2],
        ]);
      });
    });

    describe('when the anchor is shifted', () => {
      it('returns offset coordinates', () => {
        const shipId = nanoid();
        store.dispatch(
          shipCreated({
            playerId: 1,
            boardId: 1,
            id: shipId,
            length: 3,
            orientation: 0,
            anchor: [3, 3],
          })
        );

        expect(selectShipCoordinates(store.getState(), shipId)).toStrictEqual([
          [3, 3],
          [4, 3],
          [5, 3],
        ]);
      });
    });
  });
});
