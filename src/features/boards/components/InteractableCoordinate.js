import { useContext } from 'react';
import PreviewableCoordinate from './PreviewableCoordinate';
import { useShip, useShipPreview } from '../boardHooks';
import PlayerContext from '../../players/PlayerContext';

const InteractableCoordinate = ({ coordinateAPI }) => {
  const player = useContext(PlayerContext);

  const { coordinate } = coordinateAPI;
  const shipAPI = useShip(player, coordinate);
  const previewAPI = useShipPreview(shipAPI.ship);

  const APIS = {
    coordinate: coordinateAPI,
    ship: shipAPI,
    preview: previewAPI,
  };

  const { isValidPlacement, placeShip } = APIS.ship;

  if (isValidPlacement) {
    return <PreviewableCoordinate APIS={APIS} onClick={placeShip} />;
  } else {
    return <PreviewableCoordinate APIS={APIS} tabIndex="-1" />;
  }
};

export default InteractableCoordinate;
