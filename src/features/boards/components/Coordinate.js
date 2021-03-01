import { useContext } from 'react';
import PlayerContext from '../../players/PlayerContext';
import classNames from 'classnames';
import InteractableCoordinate from './InteractableCoordinate';
import './Coordinate.css';

const Coordinate = ({ coordinate, states }) => {
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

export default Coordinate;
