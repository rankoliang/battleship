import { configureStore } from '@reduxjs/toolkit';

import reducer, {
  nameChanged,
  turnEnded,
  selectPlayers,
  selectCurrentPlayer,
} from './playersSlice';

describe('playersSlice', () => {
  let store;
  beforeEach(() => {
    store = configureStore({ reducer: { players: reducer } });
  });

  describe('initialState', () => {
    it('has two players', () => {
      expect(Object.entries(selectPlayers(store.getState()))).toHaveLength(2);
    });
  });

  describe('nameChanged', () => {
    it("changes a player's name", () => {
      store.dispatch(nameChanged(1, 'John'));

      expect(selectPlayers(store.getState())[1].name).toBe('John');
    });
  });

  describe('turnEnded', () => {
    it('changes the current player', () => {
      const initialPlayer = selectCurrentPlayer(store.getState());
      const nextPlayer = selectPlayers(store.getState())[2];

      store.dispatch(turnEnded());

      expect(selectCurrentPlayer(store.getState())).not.toBe(initialPlayer);

      expect(selectCurrentPlayer(store.getState())).toBe(nextPlayer);
    });
  });
});
