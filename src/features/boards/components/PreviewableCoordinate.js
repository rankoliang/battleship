import { useContext } from 'react';
import classNames from 'classnames';
import CoordinateContext from '../contexts/CoordinateContext';
import { ImBlocked } from 'react-icons/im';

const PreviewableCoordinate = (props) => {
  const APIS = useContext(CoordinateContext);
  const { states } = APIS.coordinate;
  const { occupied, previewing } = states;
  const { isValidPlacement } = APIS.ship;
  const { isPreviewValid, setPreview, removePreview } = APIS.preview;

  if (previewing) {
    if (isPreviewValid) {
      return (
        <button
          onFocus={setPreview}
          onMouseEnter={setPreview}
          onBlur={removePreview}
          onMouseLeave={removePreview}
          className={classNames('coordinate', 'coordinate__previewing', {
            coordinate__occupied: occupied,
            'coordinate--valid-placement': isValidPlacement,
          })}
          {...props}
        />
      );
    } else {
      return (
        <InvalidPreviewPlacementCoordinate
          onFocus={setPreview}
          onMouseEnter={setPreview}
          onBlur={removePreview}
          onMouseLeave={removePreview}
          className={classNames('coordinate', 'coordinate__previewing', {
            coordinate__occupied: occupied,
            'coordinate--valid-placement': isValidPlacement,
          })}
          {...props}
        />
      );
    }
  } else {
    return (
      <button
        onFocus={setPreview}
        onMouseEnter={setPreview}
        onBlur={removePreview}
        onMouseLeave={removePreview}
        className={classNames('coordinate', {
          coordinate__occupied: occupied,
          'coordinate--valid-placement': isValidPlacement,
        })}
        {...props}
      />
    );
  }
};

const InvalidPreviewPlacementCoordinate = ({ className, ...props }) => {
  return (
    <button
      className={classNames(className, 'coordinate__previewing--invalid')}
      {...props}
    >
      <ImBlocked />
    </button>
  );
};

export default PreviewableCoordinate;
