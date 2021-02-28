import { useContext } from 'react';
import { useShip, useShipPreview } from '../boardHooks';
import PlayerContext from '../../players/PlayerContext';
import './Element.css';
import classNames from 'classnames';

const Element = ({ coordinate, states }) => {
  const player = useContext(PlayerContext);
  const { ship, isValidPlacement, placeShip } = useShip(player, coordinate);

  const className = classNames('element', {
    element__occupied: states.occupied,
    'element--valid-placement': isValidPlacement,
  });

  if (player.computer) {
    return (
      <button
        className={classNames('element', {
          element__occupied: states.occupied,
        })}
        tabIndex="-1"
      />
    );
  } else if (isValidPlacement) {
    return (
      <PreviewableElement
        className={className}
        states={states}
        ship={ship}
        onClick={placeShip}
      />
    );
  } else {
    return (
      <PreviewableElement
        className={className}
        states={states}
        ship={ship}
        tabIndex="-1"
      />
    );
  }
};

const PreviewableElement = ({ states, ship, className, ...props }) => {
  const { isPreviewValid, setPreview, removePreview } = useShipPreview(ship);
  return (
    <button
      onFocus={setPreview}
      onBlur={removePreview}
      onMouseEnter={setPreview}
      onMouseLeave={removePreview}
      className={classNames(className, {
        element__previewing: states.previewing,
        'element__previewing--invalid': states.previewing && !isPreviewValid,
      })}
      {...props}
    />
  );
};

export default Element;
