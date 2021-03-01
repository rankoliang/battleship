import classNames from 'classnames';

const PreviewableCoordinate = ({ APIS, ...props }) => {
  const {
    states: { occupied, previewing },
  } = APIS.coordinate;
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
