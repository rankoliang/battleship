import classNames from 'classnames';
import { useAttack } from '../boardHooks';
import { GiCrossMark } from 'react-icons/gi';

const StartedComputerCoordinate = ({ coordinateAPI, sunk }) => {
  const { states, coordinate } = coordinateAPI;
  const { hit, occupied } = states;

  const attack = useAttack(coordinate);

  if (hit) {
    return (
      <button
        tabIndex="-1"
        className={classNames('coordinate', 'coordinate__hit', {
          coordinate__occupied: occupied,
          coordinate__sunk: sunk,
        })}
      >
        {hit && <GiCrossMark />}
      </button>
    );
  } else {
    return (
      <button
        tabIndex="0"
        onClick={attack}
        className={classNames(
          'coordinate',
          'cursor-pointer',
          'coordinate__hover'
        )}
      />
    );
  }
};

export default StartedComputerCoordinate;
