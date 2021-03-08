import { HitCoordinate, UndisturbedCoordinate } from './StyledCoordinates';

const StartedPlayerCoordinate = (props) => {
  const { coordinateAPI } = props;
  const { states } = coordinateAPI;
  const { hit } = states;

  if (hit) {
    return <HitCoordinate {...props} />;
  } else {
    return <UndisturbedCoordinate {...props} />;
  }
};

export default StartedPlayerCoordinate;
