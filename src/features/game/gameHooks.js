import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectPhase, gameReset, phaseAdvanced, winnerSet } from './gameSlice';
import { selectOpponent } from '../players/playersSlice';
import { useRemainingShips } from '../ships/shipHooks';
import { selectShipsToBePlaced } from '../boards/boardsSlice';
import { animateScroll as scroll } from 'react-scroll';

export const useReset = () => {
  const dispatch = useDispatch();

  return () => {
    dispatch(gameReset());
  };
};

export const useWinnerDetermined = (player) => {
  const phase = useSelector(selectPhase);
  const shipsRemaining = useRemainingShips(player);
  const shipsRemainingToBePlaced = useSelector((state) =>
    selectShipsToBePlaced(state, player.boardId)
  );

  return (
    phase === 'started' &&
    shipsRemaining === 0 &&
    shipsRemainingToBePlaced === 0
  );
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
