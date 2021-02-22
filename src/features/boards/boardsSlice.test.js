import { configureStore, nanoid } from '@reduxjs/toolkit';
import reducer, {
  tileSet,
  attackReceived,
  shipPlaced,
  previewSet,
  selectBoardById,
  selectAllBoards,
  selectIsValidPlacement,
  selectBoardShips,
  selectBoardPreview,
  selectBoardPreviewCoordinates,
} from './boardsSlice';
import shipsReducer, {
  selectShipTotal,
  selectShipById,
} from '../ships/shipsSlice';
import { shipCoordinates } from '../ships/shipFactory';
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

    it('places the ship', async () => {
      const ship = {
        id: nanoid(),
        player: 1,
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
        player: 1,
        length: 3,
        orientation: 0,
        anchor: [0, 0],
      };

      await store.dispatch(shipPlaced(ship));

      expect(selectBoardShips(store.getState(), 1)).toHaveLength(1);
    });
  });

  describe('preview', () => {
    it('is initially null', () => {
      const preview = selectBoardPreview(store.getState(), 1);

      expect(preview).toBe(null);
    });
  });

  describe('previewSet', () => {
    it('sets the preview', () => {
      const ship = {
        id: nanoid(),
        player: 1,
        length: 3,
        orientation: 0,
        anchor: [0, 0],
      };

      store.dispatch(previewSet(ship));

      const preview = selectBoardPreview(store.getState(), 1);

      expect(preview).toEqual(ship);
    });

    it('sets the preview coordinates', () => {
      const ship = {
        id: nanoid(),
        player: 1,
        length: 3,
        orientation: 0,
        anchor: [0, 0],
      };

      store.dispatch(previewSet(ship));

      const board = selectBoardById(store.getState(), 1);

      shipCoordinates(ship).forEach(([x, y]) => {
        expect(board[y][x].previewing).toEqual(true);
      });
    });

    it('overrides the old preview', () => {
      const ship = {
        id: nanoid(),
        player: 1,
        length: 3,
        orientation: 0,
        anchor: [0, 0],
      };
      const nextShip = {
        id: nanoid(),
        player: 1,
        length: 1,
        orientation: 0,
        anchor: [5, 5],
      };
      store.dispatch(previewSet(ship));
      store.dispatch(previewSet(nextShip));

      const board = selectBoardById(store.getState(), 1);

      expect(selectBoardPreview(store.getState(), 1)).toEqual(nextShip);

      shipCoordinates(ship).forEach(([x, y]) => {
        expect(board[y][x].previewing).toEqual(false);
      });
    });
  });

  describe('attackReceived', () => {
    it('sets the tile to hit', async () => {
      const ship = {
        id: nanoid(),
        player: 1,
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
        player: 1,
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
