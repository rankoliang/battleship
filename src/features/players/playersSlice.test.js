import { configureStore } from '@reduxjs/toolkit';

import reducer, {
  nameChanged,
  turnEnded,
  selectPlayers,
  selectPlayerById,
  selectCurrentPlayer,
  selectOpponent,
} from './playersSlice';

describe('playersSlice', () => {
  let store;
  beforeEach(() => {
    store = configureStore({ reducer: { players: reducer } });
  });

  describe('initialState', () => {
    it('has two players', () => {
      expect(selectPlayers(store.getState())).toEqual([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          computer: false,
        }),
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          computer: true,
        }),
      ]);
    });
  });

  describe('nameChanged', () => {
    it("changes a player's name", () => {
      store.dispatch(nameChanged(1, 'John'));

      expect(selectPlayers(store.getState())[0].name).toBe('John');
    });
  });

  describe('turnEnded', () => {
    it('changes the current player', () => {
      const initialPlayer = selectCurrentPlayer(store.getState());
      const nextPlayer = selectPlayers(store.getState())[1];

      store.dispatch(turnEnded());

      expect(selectCurrentPlayer(store.getState())).not.toBe(initialPlayer);

      expect(selectCurrentPlayer(store.getState())).toBe(nextPlayer);
    });
  });

  describe('selectOpponent', () => {
    it('selects the opponent', () => {
      expect(selectOpponent(store.getState(), 1)).toBe(
        selectPlayerById(store.getState(), 2)
      );
    });
  });
});
