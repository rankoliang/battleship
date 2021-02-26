import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectBoardById,
  selectBoardPreview,
  orientationUpdated,
  previewSet,
  randomShipsPlaced,
} from './boardsSlice';
import { nextRotation } from '.././ships/shipFactory';
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

const useRandomPlacement = (player) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (player.computer) {
      dispatch(randomShipsPlaced({ player }));
    }
  }, [dispatch, player]);
};

const useRotation = (player) => {
  const dispatch = useDispatch();
  const currentPreview = useSelector((state) =>
    selectBoardPreview(state, player.id)
  );

  let nextPreview;
  if (currentPreview) {
    nextPreview = {
      ...currentPreview,
      orientation: nextRotation(currentPreview.orientation),
    };
  } else {
    nextPreview = currentPreview;
  }

  return () => {
    if (nextPreview) {
      dispatch(orientationUpdated(1));
      dispatch(previewSet(nextPreview));
    }
  };
};

const Board = ({ player }) => {
  const board = useSelector((state) => selectBoardById(state, player.id));

  useRandomPlacement(player);

  const rotate = useRotation(player);

  const handleKeyPress = (event) => {
    if (event.key === 'r') {
      rotate();
    }
  };

  const handleHover = (event) => {
    event.target.focus();
  };

  return (
    <PlayerContext.Provider value={player}>
      <h2>{player.name}</h2>
      <StyledBoard
        onMouseEnter={handleHover}
        onKeyPress={handleKeyPress}
        tabIndex={player.computer ? '-1' : '0'}
      >
        {board.map((row, yIndex) => (
          <Row row={row} yIndex={yIndex} key={yIndex} />
        ))}
      </StyledBoard>
    </PlayerContext.Provider>
  );
};

export default Board;
