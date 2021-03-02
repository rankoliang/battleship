import classNames from 'classnames';

const InertCoordinate = ({ states }) => {
  return (
    <button
      className={classNames('coordinate', {
        coordinate__occupied: states.occupied,
      })}
    />
  );
};

export default InertCoordinate;
