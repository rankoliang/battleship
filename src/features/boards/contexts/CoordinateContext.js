import { createContext, useContext } from 'react';
import PlayerContext from '../../players/PlayerContext';
import { useShip, useShipPreview } from '../boardHooks';

const CoordinateContext = createContext();

export const withCoordinateContext = (Component) => ({ coordinateAPI }) => {
  const player = useContext(PlayerContext);

  const { coordinate } = coordinateAPI;
  const shipAPI = useShip(player, coordinate);
  const previewAPI = useShipPreview(shipAPI.ship);

  const APIS = {
    coordinate: coordinateAPI,
    ship: shipAPI,
    preview: previewAPI,
  };

  return (
    <CoordinateContext.Provider value={APIS}>
      <Component />
    </CoordinateContext.Provider>
  );
};

export default CoordinateContext;
