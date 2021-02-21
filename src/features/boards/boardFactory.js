import { arrayWith } from '../../helpers';

const boardFactory = ({ player, size = 10 }) => {
  return {
    player,
    state: arrayWith(size, () =>
      arrayWith(size, () => ({ occupied: false, hit: false }))
    ),
    ships: [],
  };
};

export default boardFactory;
