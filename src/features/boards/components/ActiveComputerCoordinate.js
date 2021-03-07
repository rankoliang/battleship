import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  attackReceived,
  selectHittableCoordinates,
  lastCoordinateHitUpdated,
} from '../boardsSlice';
import { selectPlayerById } from '../../players/playersSlice';
import PlayerContext from '../../players/PlayerContext';
import classNames from 'classnames';
import shuffle from 'shuffle-array';

const ActiveComputerCoordinate = ({ coordinateAPI, sunk }) => {
  const { states, coordinate } = coordinateAPI;
  const { hit, occupied } = states;
  const player = useContext(PlayerContext);
  const opponent = useSelector((state) =>
    selectPlayerById(state, player.opponentId)
  );

  const coordinateOptions = useSelector((state) =>
    selectHittableCoordinates(state, opponent.boardId)
  );

  const dispatch = useDispatch();
  const attack = () => {
    dispatch(attackReceived(player.boardId, coordinate));

    const computerChoice = shuffle.pick(coordinateOptions);

    dispatch(attackReceived(opponent.boardId, computerChoice));
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
