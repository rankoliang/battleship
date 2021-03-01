import { configureStore, nanoid } from '@reduxjs/toolkit';
import reducer, {
  attackReceived,
  shipPlaced,
  nextShipPlaced,
  selectBoardById,
  selectBoardShips,
  selectRemainingShips,
  selectShipsToBePlaced,
  selectNextShip,
} from './boardsSlice';
import shipsReducer, {
  selectShipTotal,
  selectShipById,
} from '../ships/shipsSlice';
import { shipCoordinates } from '../ships/shipFactory';
import playersReducer from '../players/playersSlice';

describe('boardsThunks', () => {
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
  describe('attackReceived', () => {
    it('sets the tile to hit', async () => {
      const ship = {
        id: nanoid(),
        boardId: 1,
        playerId: 1,
        length: 3,
        orientation: 0,
        anchor: [0, 0],
      };

      await store.dispatch(shipPlaced(ship));

      expect(selectBoardById(store.getState(), 1)[0][0].hit).toBe(false);

      await store.dispatch(attackReceived(1, [0, 0]));

      expect(selectBoardById(store.getState(), 1)[0][0].hit).toBe(true);
    });

    it('hits the ship', async () => {
      const ship = {
        id: nanoid(),
        boardId: 1,
        playerId: 1,
        length: 3,
        orientation: 0,
        anchor: [0, 0],
      };

      await store.dispatch(shipPlaced(ship));

      expect(selectShipById(store.getState(), ship.id).hit[0]).toBe(false);

      await store.dispatch(attackReceived(1, [0, 0]));

      expect(selectShipById(store.getState(), ship.id).hit[0]).toBe(true);
    });
  });

  describe('shipPlaced', () => {
    it('creates a ship', () => {
      store.dispatch(
        shipPlaced({
          id: nanoid(),
          playerId: 1,
          boardId: 1,
          length: 4,
          orientation: 0,
          anchor: [0, 0],
        })
      );

      expect(selectShipTotal(store.getState())).toBe(1);
    });

    it('places the ship', async () => {
      const ship = {
        id: nanoid(),
        playerId: 1,
        boardId: 1,
        length: 3,
        orientation: 0,
        anchor: [0, 0],
      };

      await store.dispatch(shipPlaced(ship));

      const board = selectBoardById(store.getState(), 1);

      shipCoordinates(ship).forEach(([x, y], i) => {
        expect(board[y][x].shipId).toBe(ship.id);
        expect(board[y][x].hitIndex).toBe(i);
      });
    });

    it('adds the ship to the board', async () => {
      const ship = {
        id: nanoid(),
        playerId: 1,
        boardId: 1,
        length: 3,
        orientation: 0,
        anchor: [0, 0],
      };

      await store.dispatch(shipPlaced(ship));

      expect(selectBoardShips(store.getState(), 1)).toHaveLength(1);
    });
  });

  describe('nextShipPlaced', () => {
    it('places the ship', async () => {
      const { length } = selectNextShip(store.getState(), 1);

      const ship = {
        length,
        orientation: 0,
        anchor: [0, 0],
      };

      await store.dispatch(nextShipPlaced(1, ship.anchor, ship.orientation));

      const board = selectBoardById(store.getState(), 1);

      shipCoordinates(ship).forEach(([x, y], i) => {
        expect(board[y][x].occupied).toBe(true);
        expect(board[y][x].hitIndex).toBe(i);
      });
    });

    it('decrements the quantity by 1', async () => {
      const { name, quantity } = selectNextShip(store.getState(), 1);

      expect(quantity).toEqual(1);

      await store.dispatch(nextShipPlaced(1, [0, 0], 0));

      const remainingShips = selectRemainingShips(store.getState(), 1);

      expect(remainingShips[name].quantity).toEqual(0);
    });

    describe('when the quantity becomes 0', () => {
      it('updates the nextShip', async () => {
        await store.dispatch(nextShipPlaced(1, [0, 0], 0));

        expect(selectNextShip(store.getState(), 1).quantity).toBeGreaterThan(0);
      });
    });

    describe('when there are no next ships remaining', () => {
      it('updates the nextShip to null', async () => {
        while (selectShipsToBePlaced(store.getState(), 1) > 0) {
          await store.dispatch(nextShipPlaced(1, [0, 0], 0));
        }

        expect(selectNextShip(store.getState(), 1)).toBe(null);
      });
    });
  });
});
