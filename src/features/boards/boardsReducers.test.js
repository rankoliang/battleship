import { configureStore, nanoid } from '@reduxjs/toolkit';
import reducer, {
  tileSet,
  orientationUpdated,
  previewSet,
  previewRemoved,
  lastCoordinateHitUpdated,
  selectOrientation,
  selectBoardById,
  selectBoardPreview,
  selectLastCoordinateHit,
} from './boardsSlice';
import { shipCoordinates } from '../ships/shipFactory';
import shipsReducer from '../ships/shipsSlice';
import playersReducer from '../players/playersSlice';

describe('boardsReducer', () => {
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

  describe('previewSet', () => {
    it('sets the preview', () => {
      const ship = {
        id: nanoid(),
        boardId: 1,
        playerId: 1,
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
        boardId: 1,
        playerId: 1,
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
        boardId: 1,
        playerId: 1,
        length: 3,
        orientation: 0,
        anchor: [0, 0],
      };
      const nextShip = {
        id: nanoid(),
        boardId: 1,
        playerId: 1,
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
        boardId: 1,
        playerId: 1,
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

  describe('lastCoordinateHitUpdated', () => {
    it('updates the last coordinate', () => {
      store.dispatch(lastCoordinateHitUpdated(1, [0, 0]));

      expect(selectLastCoordinateHit(store.getState(), 1)).toEqual([0, 0]);
    });
  });
});
