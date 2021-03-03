import { useDispatch } from 'react-redux';
import { gameReset } from './gameSlice';

export const useReset = () => {
  const dispatch = useDispatch();

  return () => dispatch(gameReset());
};
