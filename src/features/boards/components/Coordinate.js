import { useContext } from 'react';
import PlayerContext from '../../players/PlayerContext';
import classNames from 'classnames';
import InteractableCoordinate from './InteractableCoordinate';
import './Coordinate.css';

const Coordinate = (coordinateAPI) => {
  const player = useContext(PlayerContext);
  const { states } = coordinateAPI;

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
    return <InteractableCoordinate coordinateAPI={coordinateAPI} />;
  }
};

export default Coordinate;
