import styled from 'styled-components';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { shipPlaced, previewSet, selectIsValidPlacement } from '../boardsSlice';

const StyledElement = styled.button`
  background-color: ${({ states: { occupied, previewing } }) => {
    if (occupied) {
      return 'black';
    } else if (previewing) {
      return 'lightgray';
    } else {
      return 'white';
    }
  }};
  width: 100px;
  height: 100px;
  border: 1px solid black;
  margin: 2px;
  cursor: pointer;
`;

const Element = ({ xIndex, yIndex, element }) => {
  const dispatch = useDispatch();
  const [ship, setShip] = useState({
    id: nanoid(),
    player: 1,
    length: 5,
    orientation: 0,
    anchor: [xIndex, yIndex],
  });

  const isValidPlacement = useSelector((state) =>
    selectIsValidPlacement(state, ship)
  );

  const placeShip = () => {
    isValidPlacement && dispatch(shipPlaced(ship));
  };

  const setPreview = () => {
    isValidPlacement && dispatch(previewSet(ship));
  };

  return (
    <StyledElement
      onMouseEnter={setPreview}
      onClick={placeShip}
      xIndex={xIndex}
      yIndex={yIndex}
      states={element}
    />
  );
};

export default Element;
