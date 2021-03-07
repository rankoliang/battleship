import { useRemainingShips } from '../../ships/shipHooks';
import { usePlayer, usePlayers } from '../../players/playerHooks';
import { useSelector } from 'react-redux';
import { selectHitHistoryByBoardId } from '../../hitHistory/hitHistorySlice';
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
  const hitHistory = useSelector((state) =>
    selectHitHistoryByBoardId(state, boardId)
  );

  const status =
    hitHistory.length < 1 ? null : hitHistory[hitHistory.length - 1][1];

  switch (status) {
    case 'miss':
      return (
        <InterfaceElement>
          {player.name} took a shot and missed.
        </InterfaceElement>
      );
    case 'sunk':
      return <InterfaceElement>{player.name} sunk a ship!</InterfaceElement>;
    case 'hit':
      return <InterfaceElement>{player.name} hit a ship!</InterfaceElement>;
    default:
      return <InterfaceElement>No Moves Made yet.</InterfaceElement>;
  }
};

export default StartedInterface;
