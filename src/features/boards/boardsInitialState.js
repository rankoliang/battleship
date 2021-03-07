import boardFactory from './boardFactory';

const getInitialState = () => ({
  ids: [1, 2],
  entities: {
    1: boardFactory({ id: 1, playerId: 1, size: 10 }),
    2: boardFactory({ id: 2, playerId: 2, size: 10 }),
  },
});

export default getInitialState;
