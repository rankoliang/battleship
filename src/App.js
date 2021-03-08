import React from 'react';
import { useSelector } from 'react-redux';
import { selectPlayers } from './features/players/playersSlice';
import Board from './features/boards/Board';
import { selectWinner, selectPhase } from './features/game/gameSlice';
import { useReset } from './features/game/gameHooks';
import 'bulma/css/bulma.css';
import './App.css';

function App() {
  const players = useSelector(selectPlayers);
  const reset = useReset();

  return (
    <div className="App">
      <h1 className="title is-1 my-5">Battleship</h1>
      <div className="container is-fluid">
        <div className="box">
          <PhaseMessage />
        </div>
        <button className="button is-primary is-outlined" onClick={reset}>
          Reset
        </button>
        <div className="boards">
          {players.map((player) => (
            <Board player={player} key={player.id} />
          ))}
        </div>
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
    <p>
      To place your ship, hover over your board. Press r to rotate your ship or
      click on the rotate button.
    </p>
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
