import classNames from 'classnames';

const InterfaceElement = ({ children, className, ...props }) => {
  return (
    <span className={classNames('tag', className)} {...props}>
      {children}
    </span>
  );
};

export default InterfaceElement;
