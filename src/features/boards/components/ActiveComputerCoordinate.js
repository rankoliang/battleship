import { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { attackReceived } from '../boardsSlice';
import PlayerContext from '../../players/PlayerContext';
import classNames from 'classnames';

const ActiveComputerCoordinate = ({ coordinateAPI, sunk }) => {
  const { states, coordinate } = coordinateAPI;
  const { hit, occupied } = states;

  const dispatch = useDispatch();
  const player = useContext(PlayerContext);
  const attack = () => {
    dispatch(attackReceived(player.boardId, coordinate));
  };

  if (hit) {
    return (
      <button
        tabIndex="-1"
        className={classNames('coordinate', 'coordinate__hit', {
          coordinate__occupied: occupied,
          coordinate__sunk: sunk,
        })}
      />
    );
  } else {
    return (
      <button
        tabIndex="0"
        onClick={attack}
        className={classNames(
          'coordinate',
          'cursor-pointer',
          'coordinate__hover'
        )}
      />
    );
  }
};

export default ActiveComputerCoordinate;
