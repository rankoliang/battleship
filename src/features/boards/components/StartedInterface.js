import { useRemainingShips } from '../../ships/shipHooks';
import { usePlayer } from '../../players/playerHooks';

const StartedInterface = () => {
  const player = usePlayer();
  const shipsRemaining = useRemainingShips(player);

  return <p>Ships Remaining: {shipsRemaining}</p>;
};

export default StartedInterface;
