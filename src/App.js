import React from 'react';
import { useSelector } from 'react-redux';
import { selectBegun } from './features/game/gameSlice';
import BegunGame from './features/game/components/BegunGame';
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

export default App;
