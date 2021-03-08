import { useContext } from 'react';
import PlayerContext from '../../players/PlayerContext';
import InteractableCoordinate from './InteractableCoordinate';
import classNames from 'classnames';
import { DefaultCoordinate } from './StyledCoordinates';

const PlacementCoordinate = ({ coordinate, states }) => {
  const player = useContext(PlayerContext);

  if (player.computer) {
    return <DefaultCoordinate tabIndex="-1" />;
  } else {
    return <InteractableCoordinate coordinateAPI={{ coordinate, states }} />;
  }
};

export default PlacementCoordinate;
