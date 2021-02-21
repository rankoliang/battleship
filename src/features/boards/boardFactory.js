import { arrayWith } from '../../helpers';

const boardFactory = ({ player, size = 10 }) => {
  return {
    player,
    state: arrayWith(size, () => arrayWith(size)),
    ships: [],
  };
};

export default boardFactory;
