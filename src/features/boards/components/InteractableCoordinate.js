import { useContext } from 'react';
import PreviewableCoordinate from './PreviewableCoordinate';
import classNames from 'classnames';
import CoordinateContext, {
  withCoordinateContext,
} from '../contexts/CoordinateContext';

const InteractableCoordinate = () => {
  const APIS = useContext(CoordinateContext);

  const {
    states: { occupied },
  } = APIS.coordinate;
  const { ship, isValidPlacement, placeShip } = APIS.ship;

  if (ship) {
    if (isValidPlacement) {
      return <PreviewableCoordinate onClick={placeShip} />;
    } else {
      return <PreviewableCoordinate tabIndex="-1" />;
    }
  } else {
    return (
      <button
        className={classNames('coordinate', {
          coordinate__occupied: occupied,
        })}
      />
    );
  }
};

export default withCoordinateContext(InteractableCoordinate);
