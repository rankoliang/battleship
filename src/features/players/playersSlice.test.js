import { configureStore } from '@reduxjs/toolkit';

import reducer, {
  nameChanged,
  turnEnded,
  selectPlayers,
  selectCurrentPlayer,
  createSelectPlayer,
} from './playersSlice';

describe('playersSlice', () => {
  let store;
  beforeEach(() => {
    store = configureStore({ reducer: { players: reducer } });
  });

  describe('initialState', () => {
    it('has two players', () => {
      expect(selectPlayers(store.getState())).toHaveLength(2);
    });
  });

  describe('nameChanged', () => {
    it("changes a player's name", () => {
      store.dispatch(nameChanged(1, 'John'));
      const selectPlayerOne = createSelectPlayer(1);

      expect(selectPlayerOne(store.getState()).name).toBe('John');
    });
  });

  describe('turnEnded', () => {
    it('changes the current player', () => {
      const initialPlayer = selectCurrentPlayer(store.getState());
      const nextPlayer = createSelectPlayer(2)(store.getState());

      store.dispatch(turnEnded());

      expect(selectCurrentPlayer(store.getState())).not.toBe(initialPlayer);

      expect(selectCurrentPlayer(store.getState())).toBe(nextPlayer);
    });
  });
});
