import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import playersReducer from '../features/players/playersSlice';
import boardsReducer from '../features/boards/boardsSlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
    players: playersReducer,
    boards: boardsReducer,
  },
});
