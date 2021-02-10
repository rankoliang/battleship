const shipFactory = ({ id, player, length }) => {
  return {
    id,
    player,
    length,
    hit: Array(length).fill(false),
  };
};

export default shipFactory;
