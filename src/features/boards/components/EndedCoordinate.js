import { HitCoordinate, UndisturbedCoordinate } from './StyledCoordinates';

const EndedCoordinate = ({ coordinate, states, ...props }) => {
  const coordinateAPI = { coordinate, states };
  const { hit } = states;

  if (hit) {
    return <HitCoordinate coordinateAPI={coordinateAPI} {...props} />;
  } else {
    return <UndisturbedCoordinate coordinateAPI={coordinateAPI} {...props} />;
  }
};

export default EndedCoordinate;
