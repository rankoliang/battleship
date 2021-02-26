import { shipCoordinates, nextRotation } from '../ships/shipFactory';
import { outOfBounds } from '../../helpers';

const reducer = {
  tileSet: {
    reducer: (state, action) => {
      const {
        player,
        coordinates: [x, y],
        props,
      } = action.payload;

      const board = state.entities[player].state;

      board[y][x] = { ...board[y][x], ...props, occupied: true };
    },
    prepare: (player, coordinates, props) => {
      return {
        payload: { player, coordinates, props },
      };
    },
  },
  previewSet: (state, action) => {
    const ship = action.payload;
    const { player } = ship;
    // filters out of bound coordinates
    const coords = shipCoordinates(ship).filter(
      (coordinate) => !outOfBounds(coordinate, state.entities[player].state)
    );
    const prevCoords = state.entities[player].previewCoordinates;

    prevCoords?.forEach(([x, y]) => {
      state.entities[player].state[y][x].previewing = false;
    });

    state.entities[player].preview = ship;
    state.entities[player].previewCoordinates = coords;
    coords.forEach(([x, y]) => {
      state.entities[player].state[y][x].previewing = true;
    });
  },
  previewRemoved: (state, action) => {
    const player = action.payload;
    const prevCoords = state.entities[player].previewCoordinates;

    prevCoords?.forEach(([x, y]) => {
      state.entities[player].state[y][x].previewing = false;
    });

    state.entities[player].preview = null;
    state.entities[player].previewCoordinates = null;
  },
  orientationUpdated: (state, action) => {
    const player = action.payload;
    const orientation = state.entities[player].orientation;

    state.entities[player].orientation = nextRotation(orientation);
  },
};

export default reducer;
