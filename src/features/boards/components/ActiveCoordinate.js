import { useContext } from 'react';
import PlayerContext from '../../players/PlayerContext';
import classNames from 'classnames';
import ActiveComputerCoordinate from './ActiveComputerCoordinate';
import { useSunk } from '../../ships/shipHooks';

const ActiveCoordinate = (coordinateAPI) => {
  const {
    states: { shipId, occupied, hit },
  } = coordinateAPI;
  const player = useContext(PlayerContext);

  const sunk = useSunk(shipId);

  if (player.computer) {
    return (
      <ActiveComputerCoordinate coordinateAPI={coordinateAPI} sunk={sunk} />
    );
  } else {
    return (
      <button
        tabIndex="-1"
        className={classNames('coordinate', {
          coordinate__occupied: occupied,
          coordinate__hit: hit,
          coordinate__sunk: sunk,
        })}
      />
    );
  }
};

export default ActiveCoordinate;
