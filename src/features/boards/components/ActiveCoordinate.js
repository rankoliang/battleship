import { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { attackReceived } from '../boardsSlice';
import PlayerContext from '../../players/PlayerContext';
import classNames from 'classnames';

const ActiveCoordinate = ({ states: { hit, occupied }, coordinate }) => {
  const dispatch = useDispatch();

  const player = useContext(PlayerContext);
  const attack = () => {
    dispatch(attackReceived(player.boardId, coordinate));
  };

  if (player.computer) {
    if (hit) {
      return (
        <button
          className={classNames('coordinate', 'coordinate__hit', {
            coordinate__occupied: occupied,
          })}
        >
          {occupied}
        </button>
      );
    } else {
      return (
        <button
          onClick={attack}
          className={classNames('coordinate', 'cursor-pointer', {
            coordinate__hover: !occupied,
          })}
        />
      );
    }
  } else {
    return (
      <button
        className={classNames('coordinate', {
          coordinate__occupied: occupied,
        })}
      />
    );
  }
};

export default ActiveCoordinate;
