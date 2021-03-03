import React from 'react';
import { useSelector } from 'react-redux';
import { selectPlayers } from './features/players/playersSlice';
import Board from './features/boards/Board';
import { selectPhase } from './features/game/gameSlice';
import { useReset } from './features/game/gameHooks';
import './App.css';

function App() {
  const players = useSelector(selectPlayers);
  const phase = useSelector(selectPhase);
  const reset = useReset();

  return (
    <div className="App">
      <h1>Battleship</h1>
      <p>Current phase: {phase}</p>
      <button onClick={reset}>Reset</button>
      <div className="boards">
        {players.map((player) => (
          <Board player={player} key={player.id} />
        ))}
      </div>
    </div>
  );
}

export default App;
