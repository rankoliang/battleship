import classNames from 'classnames';
import { useAttack } from '../boardHooks';
import { HitCoordinate, DefaultCoordinate } from './StyledCoordinates';

const StartedComputerCoordinate = (props) => {
  const { coordinateAPI } = props;
  const { states, coordinate } = coordinateAPI;
  const { hit } = states;

  const attack = useAttack(coordinate);

  if (hit) {
    return <HitCoordinate tabIndex="-1" {...props} />;
  } else {
    return (
      <DefaultCoordinate
        className="cursor-pointer coordinate__hover"
        onClick={attack}
        {...props}
      />
    );
    // return (
    //   <button
    //     tabIndex="0"
    //     onClick={attack}
    //     className={classNames(
    //       'coordinate',
    //       'cursor-pointer',
    //       'coordinate__hover'
    //     )}
    //   />
    // );
  }
};

export default StartedComputerCoordinate;
