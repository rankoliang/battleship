import React from 'react';
import { useSelector } from 'react-redux';
import { selectPlayers } from './features/players/playersSlice';
import Board from './features/boards/Board';
import './App.css';

function App() {
  const players = useSelector(selectPlayers);

  return (
    <div className="App">
      <h1>Battleship</h1>
      <div className="boards">
        {players.map((player) => (
          <Board player={player} key={player.id} />
        ))}
      </div>
    </div>
  );
}

export default App;
