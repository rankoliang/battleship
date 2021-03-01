import { useContext } from 'react';
import { useSelector } from 'react-redux';
import PlayerContext from '../../players/PlayerContext';
import classNames from 'classnames';
import InteractableCoordinate from './InteractableCoordinate';
import { selectPhase } from '../../game/gameSlice';
import './Coordinate.css';

const Coordinate = ({ coordinate, states }) => {
  const player = useContext(PlayerContext);
  const phase = useSelector(selectPhase);

  if (phase === 'placement') {
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
  } else {
    return (
      <button
        className={classNames('coordinate', {
          coordinate__occupied: states.occupied,
        })}
      />
    );
  }
};

export default Coordinate;
