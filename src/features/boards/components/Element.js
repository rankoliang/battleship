import styled, { css } from 'styled-components';
import { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import {
  shipPlaced,
  previewSet,
  previewRemoved,
  selectIsValidPlacement,
} from '../boardsSlice';
import PlayerContext from '../../players/PlayerContext';

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
  margin: 1px;
  outline-color: orange;
  ${({ isValid }) => {
    if (isValid) {
      return css`
        cursor: pointer;
      `;
    }
  }}
`;

const Element = ({ xIndex, yIndex, element }) => {
  const dispatch = useDispatch();
  const player = useContext(PlayerContext);
  const [ship, setShip] = useState({
    id: nanoid(),
    player: player.id,
    length: 3,
    orientation: 0,
    anchor: [xIndex, yIndex],
  });

  const isValidPlacement = useSelector((state) =>
    selectIsValidPlacement(state, ship)
  );

  const placeShip = () => {
    dispatch(shipPlaced(ship));
  };

  const setPreview = () => {
    dispatch(previewSet(ship));
  };

  const removePreview = () => {
    dispatch(previewRemoved(player.id));
  };

  if (isValidPlacement && !player.computer) {
    return (
      <StyledElement
        onFocus={setPreview}
        onBlur={removePreview}
        onMouseEnter={setPreview}
        onMouseLeave={removePreview}
        onClick={placeShip}
        xIndex={xIndex}
        yIndex={yIndex}
        states={element}
        isValid={isValidPlacement}
      />
    );
  } else {
    return (
      <StyledElement
        xIndex={xIndex}
        yIndex={yIndex}
        states={element}
        tabIndex="-1"
      />
    );
  }
};

export default Element;
