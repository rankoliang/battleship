import { useContext } from 'react';
import { useShip, useShipPreview } from '../boardHooks';
import PlayerContext from '../../players/PlayerContext';
import './Coordinate.css';
import classNames from 'classnames';

const Coordinate = ({ coordinate, states }) => {
  const player = useContext(PlayerContext);
  const { ship, isValidPlacement, placeShip } = useShip(player, coordinate);

  const className = classNames('coordinate', {
    coordinate__occupied: states.occupied,
    'coordinate--valid-placement': isValidPlacement,
  });

  if (player.computer) {
    return (
      <button
        className={classNames('coordinate', {
          coordinate__occupied: states.occupied,
        })}
        tabIndex="-1"
      />
    );
  } else if (isValidPlacement) {
    return (
      <PreviewableCoordinate
        className={className}
        states={states}
        ship={ship}
        onClick={placeShip}
      />
    );
  } else {
    return (
      <PreviewableCoordinate
        className={className}
        states={states}
        ship={ship}
        tabIndex="-1"
      />
    );
  }
};

const PreviewableCoordinate = ({ states, ship, className, ...props }) => {
  const { isPreviewValid, setPreview, removePreview } = useShipPreview(ship);
  return (
    <button
      onFocus={setPreview}
      onBlur={removePreview}
      onMouseEnter={setPreview}
      onMouseLeave={removePreview}
      className={classNames(className, {
        coordinate__previewing: states.previewing,
        'coordinate__previewing--invalid': states.previewing && !isPreviewValid,
      })}
      {...props}
    />
  );
};

export default Coordinate;
