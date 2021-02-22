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
    ships: [],
    preview: null,
    previewCoordinates: null,
  };
};

export default boardFactory;
