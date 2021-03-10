import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectPlayers } from '../../players/playersSlice';
import Board from '../../boards/Board';
import { useReset } from '../gameHooks';
import { selectPhase } from '../gameSlice';
import { animateScroll as scroll } from 'react-scroll';

const BegunGame = () => {
  const players = useSelector(selectPlayers);
  const reset = useReset();
  const phase = useSelector(selectPhase);

  useEffect(() => {
    if (phase !== 'ended') {
      scroll.scrollToBottom();
    }
  }, [phase]);

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
