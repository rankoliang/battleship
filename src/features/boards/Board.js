import { useSelector, useDispatch } from 'react-redux';
import {
  selectBoardById,
  selectOrientation,
  selectBoardPreview,
  orientationUpdated,
  previewSet,
} from './boardsSlice';
import Row from './components/Row';
import styled from 'styled-components';
import PlayerContext from '../players/PlayerContext';

const StyledBoard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;

  &:focus {
    outline: none;
  }
`;

const Board = ({ player }) => {
  const dispatch = useDispatch();

  const board = useSelector((state) => selectBoardById(state, player.id));
  const currentPreview = useSelector((state) =>
    selectBoardPreview(state, player.id)
  );

  const handleHover = (event) => {
    event.target.focus();
  };

  const currentOrientation = useSelector((state) =>
    selectOrientation(state, player.id)
  );

  const nextPreview =
    currentPreview === null
      ? null
      : { ...currentPreview, orientation: (currentOrientation + 90) % 360 };

  const handleKeyPress = (event) => {
    if (event.key === 'r' && currentPreview) {
      dispatch(orientationUpdated(1));
      dispatch(previewSet(nextPreview));
    }
  };

  return (
    <PlayerContext.Provider value={player}>
      <h2>{player.name}</h2>
      <StyledBoard
        onMouseEnter={handleHover}
        onKeyPress={handleKeyPress}
        tabIndex="0"
      >
        {board.map((row, yIndex) => (
          <Row row={row} yIndex={yIndex} key={yIndex} />
        ))}
      </StyledBoard>
    </PlayerContext.Provider>
  );
};

export default Board;
