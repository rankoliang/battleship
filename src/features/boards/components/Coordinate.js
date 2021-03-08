import { useSelector } from 'react-redux';
import PlacementCoordinate from './PlacementCoordinate';
import StartedCoordinate from './StartedCoordinate';
import EndedCoordinate from './EndedCoordinate';
import { selectPhase } from '../../game/gameSlice';
import './Coordinate.scss';

const Coordinate = (props) => {
  const phase = useSelector(selectPhase);

  switch (phase) {
    case 'placement':
      return <PlacementCoordinate {...props} />;
    case 'started':
      return <StartedCoordinate {...props} />;
    default:
      return <EndedCoordinate {...props} />;
  }
};

export default Coordinate;
