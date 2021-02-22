import { useSelector } from 'react-redux';
import { selectBoardById } from './boardsSlice';
import Row from './components/Row';
import styled from 'styled-components';

const StyledBoard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
`;

const Board = ({ player }) => {
  const board = useSelector((state) => selectBoardById(state, player));

  return (
    <StyledBoard>
      {board.map((row, yIndex) => (
        <Row row={row} yIndex={yIndex} key={yIndex} />
      ))}
    </StyledBoard>
  );
};

export default Board;
