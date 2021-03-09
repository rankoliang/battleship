import { useContext } from 'react';
import PlayerContext from '../../players/PlayerContext';
import PlacementPlayerCoordinate from './PlacementPlayerCoordinate';
import { DefaultCoordinate } from './StyledCoordinates';

const PlacementCoordinate = ({ coordinate, states }) => {
  const player = useContext(PlayerContext);

  if (player.computer) {
    return <DefaultCoordinate tabIndex="-1" />;
  } else {
    return <PlacementPlayerCoordinate coordinateAPI={{ coordinate, states }} />;
  }
};

export default PlacementCoordinate;
