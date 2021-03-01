import { shipCoordinates, nextRotation } from '../ships/shipFactory';
import { outOfBounds } from '../../helpers';

// Private functions
const inBoundCoords = (ship, board) => {
  return shipCoordinates(ship).filter(
    (coordinate) => !outOfBounds(coordinate, board)
  );
};

const resetPreview = (boardEntity) => {
  const { previewCoordinates, state: board } = boardEntity;

  previewCoordinates?.forEach(([x, y]) => {
    board[y][x].previewing = false;
  });
};

const setPreview = (boardEntity) => {
  const { previewCoordinates, state: board } = boardEntity;

  previewCoordinates?.forEach(([x, y]) => {
    board[y][x].previewing = true;
  });
};

const occupyBoard = (board, props, [x, y]) => {
  board[y][x] = { ...board[y][x], ...props, occupied: true };
};

// Default export
const reducer = {
  tileSet: {
    reducer: (state, action) => {
      const { boardId, coordinates, props } = action.payload;

      const board = state.entities[boardId].state;

      occupyBoard(board, props, coordinates);
    },
    prepare: (boardId, coordinates, props) => {
      return {
        payload: { boardId, coordinates, props },
      };
    },
  },
  previewSet: (state, action) => {
    const ship = action.payload;
    const { boardId } = ship;
    const boardEntity = state.entities[boardId];

    resetPreview(boardEntity);

    boardEntity.preview = ship;
    boardEntity.previewCoordinates = inBoundCoords(ship, boardEntity.state);

    setPreview(boardEntity);
  },
  previewRemoved: (state, action) => {
    const id = action.payload;
    const boardEntity = state.entities[id];

    resetPreview(boardEntity);

    boardEntity.preview = null;
    boardEntity.previewCoordinates = null;
  },
  orientationUpdated: (state, action) => {
    const id = action.payload;
    const boardEntity = state.entities[id];
    const orientation = state.entities[id].orientation;

    boardEntity.orientation = nextRotation(orientation);
  },
};

export default reducer;
