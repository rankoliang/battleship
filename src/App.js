import React from 'react';
import { useSelector } from 'react-redux';
import { selectPlayers } from './features/players/playersSlice';
import Board from './features/boards/Board';
import { selectWinner, selectPhase } from './features/game/gameSlice';
import { useReset } from './features/game/gameHooks';
import './App.css';

function App() {
  const players = useSelector(selectPlayers);
  const reset = useReset();

  return (
    <div className="App">
      <h1>Battleship</h1>
      <PhaseMessage />
      <button onClick={reset}>Reset</button>
      <div className="boards">
        {players.map((player) => (
          <Board player={player} key={player.id} />
        ))}
      </div>
    </div>
  );
}

const PhaseMessage = () => {
  const phase = useSelector(selectPhase);

  switch (phase) {
    case 'placement':
      return <PlacementMessage />;
    case 'ended':
      return <EndPhaseMessage />;
    default:
      return <p>Current phase: {phase}</p>;
  }
};

const PlacementMessage = () => {
  return (
    <div>
      <p>
        To place your ship, hover over your board. Press r to rotate your ship
        or click on the rotate button.
      </p>
    </div>
  );
};

const EndPhaseMessage = () => {
  const winner = useSelector(selectWinner);

  if (winner.computer) {
    return <p>The computer won. Try again?</p>;
  } else {
    return <p>You won! Play another round?</p>;
  }
};

export default App;
