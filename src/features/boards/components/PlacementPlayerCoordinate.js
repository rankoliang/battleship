import { useContext } from 'react';
import PreviewableCoordinate from './PreviewableCoordinate';
import CoordinateContext, {
  withCoordinateContext,
} from '../contexts/CoordinateContext';

const PlacementPlayerCoordinate = () => {
  const APIS = useContext(CoordinateContext);
  const { isValidPlacement, placeShip } = APIS.ship;

  if (isValidPlacement) {
    return <PreviewableCoordinate onClick={placeShip} />;
  } else {
    return <PreviewableCoordinate tabIndex="-1" />;
  }
};

export default withCoordinateContext(PlacementPlayerCoordinate);
