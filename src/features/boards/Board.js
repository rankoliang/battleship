import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectBoardById } from './boardsSlice';
import Row from './components/Row';
import styled from 'styled-components';
import PlayerContext from '../players/PlayerContext';
import { useRandomPlacement, useRotation } from './boardHooks';
import { makeSelectShipsLeftForPlayer } from '../ships/shipsSlice';
import useKeypress from 'react-use-keypress';

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
  // const phase = useSelector(selectPhase);
  const selectShipsLeftForPlayer = useMemo(
    () => makeSelectShipsLeftForPlayer(player.id),
    [player]
  );

  const shipsRemaining = useSelector(selectShipsLeftForPlayer);

  useRandomPlacement(player.boardId, player.computer);

  const rotate = useRotation(player.boardId);

  useKeypress('r', () => rotate());

  return (
    <PlayerContext.Provider value={player}>
      <Container>
        <h2>{player.name}</h2>
        <p>Ships Remaining: {shipsRemaining}</p>
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
