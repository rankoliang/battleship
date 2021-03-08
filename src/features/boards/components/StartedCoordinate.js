import { useContext } from 'react';
import PlayerContext from '../../players/PlayerContext';
import StartedComputerCoordinate from './StartedComputerCoordinate';
import StartedPlayerCoordinate from './StartedPlayerCoordinate';
import { useSunk } from '../../ships/shipHooks';

const StartedCoordinate = (coordinateAPI) => {
  const {
    states: { shipId },
  } = coordinateAPI;
  const player = useContext(PlayerContext);

  const sunk = useSunk(shipId);

  if (player.computer) {
    return (
      <StartedComputerCoordinate coordinateAPI={coordinateAPI} sunk={sunk} />
    );
  } else {
    return (
      <StartedPlayerCoordinate coordinateAPI={coordinateAPI} tabIndex="-1" />
    );
  }
};

export default StartedCoordinate;
