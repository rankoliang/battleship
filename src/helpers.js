const emptySquareArray = (size) => {
  return Array(8)
    .fill(undefined)
    .map(() => Array(size).fill(null));
};

// returns an array with its value updated at arr[index]
const updateArrayAtIndex = (arr, index, value) => {
  return [...arr.slice(0, index), value, ...arr.slice(index + 1)];
};

const toRads = (degrees) => {
  return (Math.PI * degrees) / 180;
};

export { emptySquareArray, updateArrayAtIndex, toRads };
