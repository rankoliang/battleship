import { arrayWith } from '../../helpers';

const boardFactory = ({ id, playerId, size = 10 }) => {
  return {
    id,
    playerId,
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
    hitHistoryID: id,
    shipsToPlace: {
      Carrier: { name: 'Carrier', length: 5, quantity: 1 },
      Battleship: { name: 'Battleship', length: 4, quantity: 1 },
      Cruiser: { name: 'Cruiser', length: 3, quantity: 1 },
      Submarine: { name: 'Submarine', length: 3, quantity: 1 },
      Destroyer: { name: 'Destroyer', length: 2, quantity: 1 },
    },
    selectedShip: 'Carrier',
  };
};

export default boardFactory;
