import { useDispatch } from 'react-redux';
import { difficultyChosen } from '../aiSlice';
import classNames from 'classnames';

const DifficultyButtons = () => {
  return (
    <div>
      <div>
        <DifficultyButton
          difficulty="easy"
          strategy="random"
          className="is-info"
        >
          Random Easy
        </DifficultyButton>
        <DifficultyButton
          difficulty="medium"
          strategy="random"
          className="is-success"
        >
          Random Medium
        </DifficultyButton>
        <DifficultyButton
          difficulty="hard"
          strategy="random"
          className="is-warning"
        >
          Random Hard
        </DifficultyButton>
      </div>
      <div>
        <DifficultyButton
          difficulty="easy"
          strategy="hunt"
          className="is-success"
        >
          Medium
        </DifficultyButton>
        <DifficultyButton
          difficulty="medium"
          strategy="hunt"
          className="is-warning"
        >
          Hard
        </DifficultyButton>
        <DifficultyButton
          difficulty="hard"
          strategy="hunt"
          className="is-danger"
        >
          Very Hard
        </DifficultyButton>
      </div>
    </div>
  );
};

const DifficultyButton = ({ difficulty, strategy, className, children }) => {
  const dispatch = useDispatch();
  return (
    <button
      className={classNames('button', className, 'm-1')}
      onClick={() => {
        dispatch(difficultyChosen({ difficulty, strategy }));
      }}
    >
      {children}
    </button>
  );
};

export default DifficultyButtons;
