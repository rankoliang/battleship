import { useContext } from 'react';
import PlayerContext from '../../players/PlayerContext';
import StartedComputerCoordinate from './StartedComputerCoordinate';
import StartedPlayerCoordinate from './StartedPlayerCoordinate';

const StartedCoordinate = (coordinateAPI) => {
  const player = useContext(PlayerContext);

  if (player.computer) {
    return <StartedComputerCoordinate coordinateAPI={coordinateAPI} />;
  } else {
    return (
      <StartedPlayerCoordinate coordinateAPI={coordinateAPI} tabIndex="-1" />
    );
  }
};

export default StartedCoordinate;
