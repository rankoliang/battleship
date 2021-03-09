export const arrayWith = (size, callback = () => null) => {
  const arr = Array(size);

  for (let i = 0; i < arr.length; i++) {
    arr[i] = callback(i);
  }

  return arr;
};

// returns an array with its value updated at arr[index]
export const updateArrayAtIndex = (arr, index, value) => {
  return [...arr.slice(0, index), value, ...arr.slice(index + 1)];
};

export const toRads = (degrees) => {
  return (Math.PI * degrees) / 180;
};

export const outOfBounds = (coordinate, board) => {
  const board_length = board[0].length;
  const board_height = board.length;

  const [x, y] = coordinate;

  return x < 0 || x >= board_length || y < 0 || y >= board_height;
};

export const randomFromArray = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const adjacentCoordinates = ([x, y], board, callback = () => true) => {
  const adjacent = [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
  ];

  return adjacent.filter((coordinate) => {
    const [x, y] = coordinate;

    if (outOfBounds(coordinate, board)) {
      return false;
    } else {
      return callback(board[y][x]);
    }
  });
};

export const adjacentTargets = (coordinates, board) => {
  return adjacentCoordinates(coordinates, board, ({ hit }) => !hit);
};
