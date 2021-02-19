import { emptySquareArray } from '../../helpers';

const boardFactory = ({ player, size = 10 }) => {
  return {
    player,
    state: emptySquareArray(size),
    ships: [],
  };
};

export default boardFactory;
