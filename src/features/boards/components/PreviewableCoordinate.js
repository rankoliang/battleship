import { useContext } from 'react';
import classNames from 'classnames';
import CoordinateContext from '../contexts/CoordinateContext';
import { ImBlocked } from 'react-icons/im';

// A Coordinate that controls the preview state based on mouse movements
// or toggling focus
const PreviewableCoordinate = ({ className, ...props }) => {
  const APIS = useContext(CoordinateContext);
  const { states } = APIS.coordinate;
  const { occupied, previewing } = states;
  const { isValidPlacement } = APIS.ship;
  const { isPreviewValid, setPreview, removePreview } = APIS.preview;

  return (
    <button
      onFocus={setPreview}
      onMouseEnter={setPreview}
      onBlur={removePreview}
      onMouseLeave={removePreview}
      className={classNames('coordinate', {
        coordinate__occupied: occupied,
        coordinate__previewing: previewing,
        'coordinate__previewing--invalid': previewing && !isPreviewValid,
        'coordinate--valid-placement': isValidPlacement,
      })}
      {...props}
    >
      {previewing && !isPreviewValid && <ImBlocked />}
    </button>
  );
};

export default PreviewableCoordinate;
