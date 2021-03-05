import { useSelector } from 'react-redux';
import { selectBoardById } from './boardsSlice';
import Row from './components/Row';
import styled from 'styled-components';
import PlayerContext from '../players/PlayerContext';
import { useRandomPlacement } from './boardHooks';
import { useUpdateWinner } from '../game/gameHooks';
import BoardInterface from './components/BoardInterface';
import './Board.css';

const StyledBoard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;

  &:focus {
    outline: none;
  }
`;

const Container = styled.div`
  margin: 1em;
`;

const Board = ({ player }) => {
  const board = useSelector((state) => selectBoardById(state, player.boardId));

  useRandomPlacement(player, ({ computer }) => computer);

  useUpdateWinner(player);

  return (
    <PlayerContext.Provider value={player}>
      <Container>
        <h2>{player.computer ? 'Computer' : 'Your'} Board</h2>
        <div className="interface">
          <BoardInterface />
        </div>
        <StyledBoard tabIndex={player.computer ? '-1' : '0'}>
          {board.map((row, yIndex) => (
            <Row row={row} yIndex={yIndex} key={yIndex} />
          ))}
        </StyledBoard>
      </Container>
    </PlayerContext.Provider>
  );
};

export default Board;
