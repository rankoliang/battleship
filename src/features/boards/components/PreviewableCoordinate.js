import { useContext } from 'react';
import classNames from 'classnames';
import CoordinateContext from '../contexts/CoordinateContext';
import { ImBlocked } from 'react-icons/im';

// Decides whether the coordinate goes into the preview state or not
const PreviewableCoordinate = (props) => {
  const APIS = useContext(CoordinateContext);
  const { states } = APIS.coordinate;
  const { previewing } = states;

  if (previewing) {
    return <PreviewingCoordinate {...props} />;
  } else {
    return <PreviewControllingCoordinate className="coordinate" {...props} />;
  }
};

// A coordinate that has the coordinate__previewing style.
// Two states: Blocked or Unblocked
const PreviewingCoordinate = (props) => {
  const APIS = useContext(CoordinateContext);
  const { isPreviewValid } = APIS.preview;

  if (isPreviewValid) {
    return (
      <PreviewControllingCoordinate
        className="coordinate coordinate__previewing"
        {...props}
      />
    );
  } else {
    return (
      <BlockedPreviewingCoordinate
        className="coordinate coordinate__previewing"
        {...props}
      />
    );
  }
};

// Shows a red cross icon in the center
const BlockedPreviewingCoordinate = ({ className, ...props }) => {
  return (
    <PreviewControllingCoordinate
      className={classNames(className, 'coordinate__previewing--invalid')}
      {...props}
    >
      <ImBlocked />
    </PreviewControllingCoordinate>
  );
};

// A Coordinate that controls the preview state based on mouse movements
// or toggling focus
const PreviewControllingCoordinate = ({ className, ...props }) => {
  const APIS = useContext(CoordinateContext);
  const { states } = APIS.coordinate;
  const { occupied } = states;
  const { isValidPlacement } = APIS.ship;
  const { setPreview, removePreview } = APIS.preview;

  return (
    <button
      onFocus={setPreview}
      onMouseEnter={setPreview}
      onBlur={removePreview}
      onMouseLeave={removePreview}
      className={classNames(className, {
        coordinate__occupied: occupied,
        'coordinate--valid-placement': isValidPlacement,
      })}
      {...props}
    ></button>
  );
};

export default PreviewableCoordinate;
