import React from 'react';
import Board from './features/boards/Board';
import './App.css';

function App() {
  return (
    <div className="App">
      <Board player={1} />
    </div>
  );
}

export default App;
