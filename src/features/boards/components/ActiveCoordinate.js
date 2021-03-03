import { useContext, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { attackReceived } from '../boardsSlice';
import { shipIsSunk } from '../../ships/shipFactory';
import { selectShipById } from '../../ships/shipsSlice';
import PlayerContext from '../../players/PlayerContext';
import classNames from 'classnames';

const ActiveCoordinate = ({
  states: { shipId, hit, occupied },
  coordinate,
}) => {
  const dispatch = useDispatch();

  const ship = useSelector((state) => selectShipById(state, shipId));

  const [sunk, setSunk] = useState(false);

  useEffect(() => {
    if (ship) {
      setSunk(shipIsSunk(ship));
    }
  }, [ship]);

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
            coordinate__sunk: sunk,
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
