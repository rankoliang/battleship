import { usePlayer } from '../../players/playerHooks';
import { useSelector } from 'react-redux';
import { selectOrientation } from '../boardsSlice';
import { useRotation } from '../boardHooks';

const PlacementInterface = () => {
  const player = usePlayer();
  const rotate = useRotation(player.boardId, 'r');
  const orientation = useSelector((state) =>
    selectOrientation(state, player.boardId)
  );

  if (player.computer) {
    return null;
  } else {
    return (
      <div>
        <button onClick={rotate}>Rotate</button>
        <p>Current Orientation: {orientation}</p>
      </div>
    );
  }
};

export default PlacementInterface;
