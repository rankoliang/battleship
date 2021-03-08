import { useContext } from 'react';
import PlayerContext from '../../players/PlayerContext';
import ActiveComputerCoordinate from './ActiveComputerCoordinate';
import { useSunk } from '../../ships/shipHooks';
import StartedPlayerCoordinate from './StartedPlayerCoordinate';

const ActiveCoordinate = (coordinateAPI) => {
  const {
    states: { shipId },
  } = coordinateAPI;
  const player = useContext(PlayerContext);

  const sunk = useSunk(shipId);

  if (player.computer) {
    return (
      <ActiveComputerCoordinate coordinateAPI={coordinateAPI} sunk={sunk} />
    );
  } else {
    return (
      <StartedPlayerCoordinate coordinateAPI={coordinateAPI} tabIndex="-1" />
    );
  }
};

export default ActiveCoordinate;
