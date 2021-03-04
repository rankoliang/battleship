import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectPhase, gameReset, phaseAdvanced, winnerSet } from './gameSlice';
import { selectOpponent } from '../players/playersSlice';
import { useRemainingShips } from '../ships/shipHooks';
import { animateScroll as scroll } from 'react-scroll';

export const useReset = () => {
  const dispatch = useDispatch();

  return () => {
    debugger;
    dispatch(gameReset());
    debugger;
  };
};

export const useWinnerDetermined = (player) => {
  const phase = useSelector(selectPhase);
  const shipsRemaining = useRemainingShips(player);

  return phase === 'started' && shipsRemaining === 0;
};

export const useUpdateWinner = (player) => {
  const dispatch = useDispatch();
  const opponent = useSelector((state) => selectOpponent(state, player.id));
  const winnerDetermined = useWinnerDetermined(player);

  useEffect(() => {
    if (winnerDetermined) {
      dispatch(phaseAdvanced());
      dispatch(winnerSet(opponent));
      scroll.scrollToTop();
    }
  }, [dispatch, winnerDetermined, opponent]);
};
