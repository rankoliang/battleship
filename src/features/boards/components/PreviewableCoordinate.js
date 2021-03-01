import { useContext } from 'react';
import classNames from 'classnames';
import CoordinateContext from '../contexts/CoordinateContext';

const PreviewableCoordinate = ({ ...props }) => {
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
    />
  );
};

export default PreviewableCoordinate;
