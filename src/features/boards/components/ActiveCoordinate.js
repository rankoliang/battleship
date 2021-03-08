import { useContext } from 'react';
import PlayerContext from '../../players/PlayerContext';
import ActiveComputerCoordinate from './ActiveComputerCoordinate';
import { useSunk } from '../../ships/shipHooks';
import { GiCrossMark } from 'react-icons/gi';
import { BiWater } from 'react-icons/bi';
import { FaSkull } from 'react-icons/fa';

const ActiveCoordinate = (coordinateAPI) => {
  const {
    states: { shipId, occupied, hit },
  } = coordinateAPI;
  const player = useContext(PlayerContext);

  const sunk = useSunk(shipId);

  if (player.computer) {
    return (
      <ActiveComputerCoordinate coordinateAPI={coordinateAPI} sunk={sunk} />
    );
  } else {
    if (hit) {
      if (occupied) {
        if (sunk) {
          return <SunkCoordinate />;
        } else {
          return <HitCoordinate />;
        }
      } else {
        return <MissedCoordinate />;
      }
    } else {
      if (occupied) {
        return <OccupiedCoordinate />;
      } else {
        return <DefaultCoordinate />;
      }
    }
  }
};

const HitCoordinate = () => {
  return (
    <button
      tabIndex="-1"
      className="coordinate coordinate__hit coordinate__occupied"
    >
      <GiCrossMark />
    </button>
  );
};

const MissedCoordinate = () => {
  return (
    <button tabIndex="-1" className="coordinate coordinate__miss">
      <BiWater />
    </button>
  );
};

const SunkCoordinate = () => {
  return (
    <button
      className="coordinate coordinate__occupied coordinate__sunk"
      tabIndex="-1"
    >
      <FaSkull />
    </button>
  );
};

const DefaultCoordinate = () => {
  return <button tabIndex="-1" className="coordinate" />;
};

const OccupiedCoordinate = () => {
  return <button tabIndex="-1" className="coordinate coordinate__occupied" />;
};

export default ActiveCoordinate;
