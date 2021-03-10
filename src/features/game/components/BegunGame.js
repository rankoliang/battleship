import React from 'react';
import { useSelector } from 'react-redux';
import { selectPlayers } from '../../players/playersSlice';
import Board from '../../boards/Board';
import { useReset } from '../gameHooks';

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

export default BegunGame;
