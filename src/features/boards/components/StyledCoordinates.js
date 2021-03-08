import { useSunk } from '../../ships/shipHooks';
import { GiCrossMark } from 'react-icons/gi';
import { BiWater } from 'react-icons/bi';
import { FaSkull } from 'react-icons/fa';

export const UndisturbedCoordinate = (props) => {
  const { coordinateAPI } = props;
  const { states } = coordinateAPI;
  const { occupied } = states;

  if (occupied) {
    return <OccupiedCoordinate {...props} />;
  } else {
    return <DefaultCoordinate {...props} />;
  }
};

export const DamagedShipCoordinate = (props) => {
  return (
    <button
      className="coordinate coordinate__hit coordinate__occupied"
      {...props}
    >
      <GiCrossMark />
    </button>
  );
};

export const HitCoordinate = (props) => {
  const { coordinateAPI } = props;
  const { states } = coordinateAPI;
  const { occupied } = states;

  if (occupied) {
    return <SuccessfulHitCoordinate {...props} />;
  } else {
    return <MissedCoordinate {...props} />;
  }
};

export const SuccessfulHitCoordinate = (props) => {
  const { coordinateAPI } = props;
  const { states } = coordinateAPI;
  const { shipId } = states;
  const sunk = useSunk(shipId);

  if (sunk) {
    return <SunkCoordinate {...props} />;
  } else {
    return <DamagedShipCoordinate {...props} />;
  }
};

export const MissedCoordinate = (props) => {
  return (
    <button className="coordinate coordinate__miss" {...props}>
      <BiWater />
    </button>
  );
};

export const SunkCoordinate = (props) => {
  return (
    <button
      className="coordinate coordinate__occupied coordinate__sunk"
      {...props}
    >
      <FaSkull />
    </button>
  );
};

export const DefaultCoordinate = (props) => {
  return <button className="coordinate" {...props} />;
};

export const OccupiedCoordinate = (props) => {
  return <button className="coordinate coordinate__occupied" {...props} />;
};
