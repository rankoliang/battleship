import { useSelector } from 'react-redux';
import { selectBoardById } from './boardsSlice';
import Row from './components/Row';
import styled from 'styled-components';

const StyledBoard = styled.div`
  padding: 0;
  margin: 20px;
  width: 100%;
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
