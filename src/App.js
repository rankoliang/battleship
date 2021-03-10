import React from 'react';
import { useSelector } from 'react-redux';
import { selectPlayers } from './features/players/playersSlice';
import Board from './features/boards/Board';
import { useReset } from './features/game/gameHooks';
import { selectBegun } from './features/game/gameSlice';
import PhaseMessage from './features/game/components/PhaseMessage';
import DifficultyButtons from './features/ai/components/DifficultyButtons';
import 'bulma/css/bulma.css';
import './App.css';

function App() {
  const gameBegun = useSelector(selectBegun);

  return (
    <div className="App mb-5">
      <h1 className="title is-1 my-5">Battleship</h1>
      <div className="container is-fluid">
        <div className="box phase-message">
          <PhaseMessage />
        </div>
        {!gameBegun ? <DifficultyButtons /> : <BegunGame />}
      </div>
    </div>
  );
}

const BegunGame = () => {
  const players = useSelector(selectPlayers);
  const reset = useReset();

  return (
    <div>
      <button className="button is-primary is-outlined" onClick={reset}>
        Reset
      </button>
      <div className="boards">
        {players.map((player) => (
          <Board player={player} key={player.id} />
        ))}
      </div>
    </div>
  );
};

export default App;
