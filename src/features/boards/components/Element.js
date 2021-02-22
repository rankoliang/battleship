import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { shipPlaced } from '../boardsSlice';

const StyledElement = styled.button`
  background-color: ${({ occupied }) => (occupied ? 'lightgray' : 'white')};
  width: 100px;
  height: 100px;
  border: 1px solid black;
  margin: 2px;
  cursor: pointer;
`;

const Element = ({ xIndex, yIndex, element }) => {
  const dispatch = useDispatch();
  const placeShip = () => {
    dispatch(
      shipPlaced({
        id: nanoid(),
        player: 1,
        length: 2,
        orientation: 0,
        anchor: [xIndex, yIndex],
      })
    );
  };
  return (
    <StyledElement
      onClick={placeShip}
      xIndex={xIndex}
      yIndex={yIndex}
      occupied={element.occupied}
    />
  );
};

export default Element;
