import { arrayWith } from '../../helpers';

const boardFactory = ({ player, size = 10 }) => {
  return {
    player,
    state: arrayWith(size, () =>
      arrayWith(size, () => ({
        occupied: false,
        hit: false,
        previewing: false,
      }))
    ),
    // orientation of the next ship
    orientation: 0,
    ships: [],
    preview: null,
    previewCoordinates: null,
  };
};

export default boardFactory;
