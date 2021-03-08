import classNames from 'classnames';
import { useSunk } from '../../ships/shipHooks';

const EndedCoordinate = (coordinateAPI) => {
  const {
    states: { shipId, occupied, hit },
  } = coordinateAPI;

  const sunk = useSunk(shipId);

  return (
    <button
      tabIndex="-1"
      className={classNames('coordinate', {
        coordinate__occupied: occupied,
        coordinate__sunk: sunk,
        coordinate__hit: hit,
      })}
    />
  );
};

export default EndedCoordinate;
