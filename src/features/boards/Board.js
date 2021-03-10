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
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  width: 75%;
  margin: 0 auto;
  padding: 1em;
  grid-gap: 2px;

  &:focus {
    outline: none;
  }
`;

const Board = ({ player }) => {
  const board = useSelector((state) => selectBoardById(state, player.boardId));

  useRandomPlacement(player, ({ computer }) => computer);

  useUpdateWinner(player);

  return (
    <PlayerContext.Provider value={player}>
      <div className="board">
        <h2 className="title is-3 my-3 is-primary">{player.name}</h2>
        <BoardInterface />
        <StyledBoard tabIndex={player.computer ? '-1' : '0'}>
          {board.map((row, yIndex) => (
            <Row row={row} yIndex={yIndex} key={yIndex} />
          ))}
        </StyledBoard>
      </div>
    </PlayerContext.Provider>
  );
};

export default Board;
