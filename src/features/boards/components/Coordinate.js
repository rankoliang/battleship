import { useContext } from 'react';
import { useSelector } from 'react-redux';
import PlayerContext from '../../players/PlayerContext';
import classNames from 'classnames';
import InteractableCoordinate from './InteractableCoordinate';
import { selectPhase } from '../../game/gameSlice';
import './Coordinate.css';

const Coordinate = (props) => {
  const phase = useSelector(selectPhase);

  switch (phase) {
    case 'placement':
      return <PlacementCoordinate {...props} />;
    default:
      return <InertCoordinate {...props} />;
  }
};

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

const InertCoordinate = ({ states }) => {
  return (
    <button
      className={classNames('coordinate', {
        coordinate__occupied: states.occupied,
      })}
    />
  );
};

export default Coordinate;
