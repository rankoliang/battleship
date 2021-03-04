import { useSelector } from 'react-redux';
import { selectPhase } from '../../game/gameSlice';
import StartedInterface from './StartedInterface';
import PlacementInterface from './PlacementInterface';

const BoardInterface = () => {
  const phase = useSelector(selectPhase);

  switch (phase) {
    case 'placement':
      return <PlacementInterface />;
    case 'started':
      return <StartedInterface />;
    default:
      return null;
  }
};

export default BoardInterface;
