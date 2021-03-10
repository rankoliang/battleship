import { usePlayer } from '../../players/playerHooks';
import { useSelector } from 'react-redux';
import { selectOrientation, selectShipsToBePlaced } from '../boardsSlice';
import { useRotation } from '../boardHooks';
import InterfaceElement from './InterfaceElement';

const PlacementInterface = () => {
  const player = usePlayer();
  const rotate = useRotation(player.boardId, 't');
  const orientation = useSelector((state) =>
    selectOrientation(state, player.boardId)
  );
  const shipsRemaining = useSelector((state) =>
    selectShipsToBePlaced(state, player.boardId)
  );

  if (player.computer) {
    return (
      <div className="box mx-3">
        <h2 className="title is-3 mb-3">Waiting...</h2>
        <div className="tags is-justify-content-center">
          <InterfaceElement className="is-warning is-large is-light">
            Waiting for you to place your pieces...
          </InterfaceElement>
        </div>
      </div>
    );
  } else {
    return (
      <div className="box mx-3">
        <h2 className="title is-3 has-text-success mb-3 has-white-space-nowrap">
          Place your pieces
        </h2>
        <div className="tags is-justify-content-center is-align-items-baseline is-flex-wrap-nowrap">
          <button
            className="tag button is-large is-outlined is-info"
            onClick={rotate}
          >
            Rotate: <span className="orientation">{orientation}&deg;</span>
          </button>
          <InterfaceElement className="is-info is-large is-light">
            {shipsRemaining} {shipsRemaining === 1 ? 'ship' : 'ships'} left to
            place
          </InterfaceElement>
        </div>
      </div>
    );
  }
};

export default PlacementInterface;
