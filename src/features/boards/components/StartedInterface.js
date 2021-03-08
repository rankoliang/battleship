import { useRemainingShips } from '../../ships/shipHooks';
import { usePlayer, usePlayers } from '../../players/playerHooks';
import { useSelector } from 'react-redux';
import { selectHitHistoryByBoardId } from '../../hitHistory/hitHistorySlice';
import { selectComputerTurns } from '../../game/gameSlice';
import InterfaceElement from './InterfaceElement';
import classNames from 'classnames';

const StartedInterface = () => {
  const player = usePlayer();
  const shipsRemaining = useRemainingShips(player);

  return (
    <div className="box tags is-justify-content-center is-flex-direction-column">
      <StartedPrompt className="title is-4" />
      <InterfaceElement className="is-large is-info is-outlined">
        Ships Remaining: {shipsRemaining}
      </InterfaceElement>
      <div className="tags">
        <LastCoordinateHitStatus />
      </div>
    </div>
  );
};

const StartedPrompt = ({ className }) => {
  const opponent = usePlayers()[1];
  const computerSinksPerTurn = useSelector(selectComputerTurns);

  if (opponent.computer) {
    return (
      <h3 className={className}>
        The computer is sinking {computerSinksPerTurn}{' '}
        {computerSinksPerTurn === 1 ? 'ship' : 'ships'} per turn
      </h3>
    );
  } else {
    return (
      <h3 className={classNames(className, 'has-text-success')}>
        Click on the board to sink your opponent's ships!
      </h3>
    );
  }
};

const StatusMessage = ({ status }) => {
  const player = usePlayer();

  switch (status) {
    case 'miss':
      return (
        <InterfaceElement className="is-danger">
          {player.name} took a shot and missed.
        </InterfaceElement>
      );
    case 'sunk':
      return (
        <InterfaceElement className="is-success">
          {player.name} sunk a ship!
        </InterfaceElement>
      );
    case 'hit':
      return (
        <InterfaceElement className="is-info">
          {player.name} hit a ship!
        </InterfaceElement>
      );
    default:
      return <InterfaceElement>Unknown Status!</InterfaceElement>;
  }
};

const LastCoordinateHitStatus = () => {
  const [player, opponent] = usePlayers();
  const { boardId } = opponent;
  const hitHistory = useSelector((state) =>
    selectHitHistoryByBoardId(state, boardId)
  );

  const computerTurns = useSelector(selectComputerTurns);

  const turnLookbehind = player.computer ? computerTurns : 1;

  const statuses = hitHistory
    .slice(Math.max(0, hitHistory.length - turnLookbehind))
    .map(([_, status]) => status);

  if (statuses.length > 0) {
    return <Statuses statuses={statuses} />;
  } else {
    return <InterfaceElement>No Moves Made yet.</InterfaceElement>;
  }
};

const Statuses = ({ statuses }) => {
  return statuses.map((status, i) => {
    return <StatusMessage status={status} key={i} />;
  });
};

export default StartedInterface;
