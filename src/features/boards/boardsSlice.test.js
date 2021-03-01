import { configureStore, nanoid } from '@reduxjs/toolkit';
import reducer, {
  tileSet,
  attackReceived,
  shipPlaced,
  previewSet,
  previewRemoved,
  orientationUpdated,
  nextShipPlaced,
  phaseAdvanced,
  selectOrientation,
  selectBoardById,
  selectAllBoards,
  selectIsValidPlacement,
  selectBoardShips,
  selectBoardPreview,
  selectRemainingShips,
  selectShipsToBePlaced,
  selectNextShip,
  makeSelectValidPlacements,
  selectPhase,
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

  describe('previewReset', () => {
    let ship, board;
    beforeEach(() => {
      ship = {
        id: nanoid(),
        player: 1,
        length: 3,
        orientation: 0,
        anchor: [0, 0],
      };
      store.dispatch(previewSet(ship));
      store.dispatch(previewRemoved(1));

      board = selectBoardById(store.getState(), 1);
    });

    it('sets the preview to null', () => {
      expect(selectBoardPreview(store.getState(), 1)).toEqual(null);
    });

    it('sets previous previewing squares to false', () => {
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

    describe('when the ship is null', () => {
      it('returns false', () => {
        expect(selectIsValidPlacement(store.getState(), null)).toBe(false);
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

  describe('orientationUpdated', () => {
    it('adds 90 degrees the orientation', () => {
      store.dispatch(orientationUpdated(1));

      expect(selectOrientation(store.getState(), 1)).toBe(90);
    });

    describe('when the orientation will be 360', () => {
      it('sets the orientation to 0', () => {
        store.dispatch(orientationUpdated(1));
        store.dispatch(orientationUpdated(1));
        store.dispatch(orientationUpdated(1));
        store.dispatch(orientationUpdated(1));

        expect(selectOrientation(store.getState(), 1)).toBe(0);
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
      const { name, length, quantity } = selectNextShip(store.getState(), 1);

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
      it('updates the nextShip', async () => {
        while (selectShipsToBePlaced(store.getState(), 1) > 0) {
          await store.dispatch(nextShipPlaced(1, [0, 0], 0));
        }

        expect(selectNextShip(store.getState(), 1)).toBe(null);
      });
    });
  });

  describe('selectPhase', () => {
    it('returns the current phase', () => {
      expect(selectPhase(store.getState(), 1)).toBe('placement');
    });
  });

  describe('phaseAdvanced', () => {
    it('advances to the next phase', () => {
      store.dispatch(phaseAdvanced(1));

      expect(selectPhase(store.getState(), 1)).toBe('started');
    });
  });
});
