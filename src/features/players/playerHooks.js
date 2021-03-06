import { useContext } from 'react';
import { useSelector } from 'react-redux';
import PlayerContext from './PlayerContext';
import { selectOpponent } from './playersSlice';

export const usePlayer = () => {
  return useContext(PlayerContext);
};

export const usePlayers = () => {
  const player = usePlayer();
  const opponent = useSelector((state) => selectOpponent(state, player.id));

  return [player, opponent];
};
