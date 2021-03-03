import { configureStore } from '@reduxjs/toolkit';
import playersReducer from '../features/players/playersSlice';
import boardsReducer from '../features/boards/boardsSlice';
import shipsReducer from '../features/ships/shipsSlice';
import gameReducer from '../features/game/gameSlice';

export default configureStore({
  reducer: {
    players: playersReducer,
    boards: boardsReducer,
    game: gameReducer,
    ships: shipsReducer,
  },
});
