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

const StatusMessage = ({ status }) => {
  const player = usePlayer();

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
      return <InterfaceElement>Unknown Status!</InterfaceElement>;
  }
};

const LastCoordinateHitStatus = () => {
  const [_, opponent] = usePlayers();
  const { boardId } = opponent;
  const hitHistory = useSelector((state) =>
    selectHitHistoryByBoardId(state, boardId)
  );

  const statuses = hitHistory
    .slice(Math.max(0, hitHistory.length - 1))
    .map(([_, status]) => status);

  if (statuses.length > 0) {
    return (
      <ul>
        {statuses.map((status, i) => {
          return (
            <li key={i}>
              <StatusMessage status={status} />
            </li>
          );
        })}
      </ul>
    );
  } else {
    return <InterfaceElement>No Moves Made yet.</InterfaceElement>;
  }
};

export default StartedInterface;
