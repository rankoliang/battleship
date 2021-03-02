import { useContext } from 'react';
import PlayerContext from '../../players/PlayerContext';
import InteractableCoordinate from './InteractableCoordinate';
import classNames from 'classnames';

const PlacementCoordinate = ({ coordinate, states }) => {
  const player = useContext(PlayerContext);

  if (player.computer) {
    return (
      <button
        className={classNames('coordinate', {
          coordinate__occupied: states.occupied,
        })}
        tabIndex="-1"
      />
    );
  } else {
    return <InteractableCoordinate coordinateAPI={{ coordinate, states }} />;
  }
};

export default PlacementCoordinate;
