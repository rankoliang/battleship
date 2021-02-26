import { useSelector } from 'react-redux';
import { selectBoardById } from './boardsSlice';
import Row from './components/Row';
import styled from 'styled-components';
import PlayerContext from '../players/PlayerContext';
import { useRandomPlacement, useRotation } from './boardHooks';

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
  const board = useSelector((state) => selectBoardById(state, player.id));

  useRandomPlacement(player, player.computer);

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
