import { useRemainingShips } from '../../ships/shipHooks';
import { usePlayer, usePlayers } from '../../players/playerHooks';
import { useSelector } from 'react-redux';
import {
  selectLastCoordinateHitStatus,
  selectLastCoordinateHit,
  selectCoordinate,
} from '../boardsSlice';
import { useSunk } from '../../ships/shipHooks';
import InterfaceElement from './InterfaceElement';

const StartedInterface = () => {
  const player = usePlayer();
  const shipsRemaining = useRemainingShips(player);

  return (
    <>
      <LastCoordinateHitStatus />
      <InterfaceElement>Ships Remaining: {shipsRemaining}</InterfaceElement>
    </>
  );
};

const LastCoordinateHitStatus = () => {
  const [player, opponent] = usePlayers();
  const { boardId } = opponent;
  const lastCoordinateHitStatus = useSelector((state) =>
    selectLastCoordinateHitStatus(state, boardId)
  );
  const lastCoordinateHit = useSelector((state) =>
    selectLastCoordinateHit(state, boardId)
  );
  const lastCoordinateStates = useSelector((state) =>
    selectCoordinate(state, boardId, lastCoordinateHit)
  );

  let shipId;
  let sunk;
  if (lastCoordinateStates) {
    shipId = lastCoordinateStates.shipId;
  }

  sunk = useSunk(shipId);

  switch (lastCoordinateHitStatus) {
    case 'miss':
      return (
        <InterfaceElement>
          {player.name} took a shot and missed.
        </InterfaceElement>
      );
    case 'hit':
      if (sunk) {
        return <InterfaceElement>{player.name} sunk a ship!</InterfaceElement>;
      } else {
        return <InterfaceElement>{player.name} hit a ship!</InterfaceElement>;
      }
    default:
      return <InterfaceElement>No Moves Made yet.</InterfaceElement>;
  }
};

export default StartedInterface;
