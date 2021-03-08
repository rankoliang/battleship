import { useSelector } from 'react-redux';
import PlacementCoordinate from './PlacementCoordinate';
import InertCoordinate from './InertCoordinate';
import { selectPhase } from '../../game/gameSlice';
import ActiveCoordinate from './ActiveCoordinate';
import './Coordinate.scss';

const Coordinate = (props) => {
  const phase = useSelector(selectPhase);

  switch (phase) {
    case 'placement':
      return <PlacementCoordinate {...props} />;
    case 'started':
      return <ActiveCoordinate {...props} />;
    default:
      return <InertCoordinate {...props} />;
  }
};

export default Coordinate;
