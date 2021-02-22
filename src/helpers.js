const arrayWith = (size, callback = () => null) => {
  const arr = Array(size);

  for (let i = 0; i < arr.length; i++) {
    arr[i] = callback(i);
  }

  return arr;
};

// returns an array with its value updated at arr[index]
const updateArrayAtIndex = (arr, index, value) => {
  return [...arr.slice(0, index), value, ...arr.slice(index + 1)];
};

const toRads = (degrees) => {
  return (Math.PI * degrees) / 180;
};

const outOfBounds = (coordinate, board) => {
  const board_length = board[0].length;
  const board_height = board.length;

  const [x, y] = coordinate;

  return x < 0 || x >= board_length || y < 0 || y >= board_height;
};

export { updateArrayAtIndex, toRads, outOfBounds, arrayWith };
