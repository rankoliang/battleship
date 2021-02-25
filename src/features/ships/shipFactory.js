import { toRads, arrayWith } from '../../helpers';

const shipFactory = ({
  id,
  player,
  length,
  anchor = [0, 0],
  orientation = 0,
}) => {
  return {
    id,
    player,
    length,
    /* 
     The ship is oriented according to the polar coordinate system in degrees.
     0: ship's stern is facing rightwards
     90: ship's stern is facing upwards
     180: ship's stern is facing leftwards
     270: ship's stern is facing downwards
    */
    orientation,
    // The location of the ship's bow [x, y]
    anchor,
    hit: Array(length).fill(false),
  };
};

export default shipFactory;

export const shipCoordinates = (ship) => {
  const [x, y] = ship.anchor;

  return arrayWith(ship.length, (i) => [
    Math.floor(x + i * Math.cos(toRads(ship.orientation)) + 0.5),
    Math.floor(y + i * Math.sin(toRads(ship.orientation)) + 0.5),
  ]);
};

export const nextRotation = (orientation, offset = 90) => {
  return (orientation + offset) % 360;
};
