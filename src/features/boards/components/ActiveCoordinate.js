import { useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { shipIsSunk } from '../../ships/shipFactory';
import { selectShipById } from '../../ships/shipsSlice';
import PlayerContext from '../../players/PlayerContext';
import classNames from 'classnames';
import ActiveComputerCoordinate from './ActiveComputerCoordinate';

const ActiveCoordinate = (coordinateAPI) => {
  const {
    states: { shipId, occupied, hit },
  } = coordinateAPI;
  const player = useContext(PlayerContext);
  const ship = useSelector((state) => selectShipById(state, shipId));

  const [sunk, setSunk] = useState(false);

  useEffect(() => {
    if (ship) {
      setSunk(shipIsSunk(ship));
    }
  }, [ship]);

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
