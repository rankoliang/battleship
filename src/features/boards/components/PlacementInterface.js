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
      <div className="box tags is-justify-content-center">
        <InterfaceElement className="is-warning is-large">
          Waiting for you to place your pieces...
        </InterfaceElement>
      </div>
    );
  } else {
    return (
      <div className="box">
        <div className="tags is-justify-content-center is-align-items-baseline">
          <InterfaceElement className="is-info is-large">
            Ships left to place: {shipsRemaining}
          </InterfaceElement>
          <button
            className="tag button is-large is-outlined  is-info"
            onClick={rotate}
          >
            Rotate: <span className="orientation">{orientation}&deg;</span>
          </button>
        </div>
      </div>
    );
  }
};

export default PlacementInterface;
