import { usePlayer } from '../../players/playerHooks';
import { useSelector } from 'react-redux';
import { selectOrientation, selectShipsToBePlaced } from '../boardsSlice';
import { useRotation } from '../boardHooks';
import InterfaceElement from './InterfaceElement';

const PlacementInterface = () => {
  const player = usePlayer();
  const rotate = useRotation(player.boardId, 'r');
  const orientation = useSelector((state) =>
    selectOrientation(state, player.boardId)
  );
  const shipsRemaining = useSelector((state) =>
    selectShipsToBePlaced(state, player.boardId)
  );

  if (player.computer) {
    return (
      <>
        <InterfaceElement>
          Waiting for you to place your pieces...
        </InterfaceElement>
      </>
    );
  } else {
    return (
      <>
        <InterfaceElement>
          Ships left to place: {shipsRemaining}
        </InterfaceElement>
        <InterfaceElement>Current Orientation: {orientation}</InterfaceElement>
        <button onClick={rotate}>Rotate</button>
      </>
    );
  }
};

export default PlacementInterface;
