import styled, { css } from 'styled-components';
import { useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import {
  shipPlaced,
  previewSet,
  previewRemoved,
  selectIsValidPlacement,
  selectOrientation,
  selectBoardPreview,
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
  ${({ isPlacementValid, isPreviewValid, states: { previewing } }) => {
    if (!isPreviewValid && previewing) {
      return css`
        border: 2px solid red;
      `;
    } else if (isPlacementValid) {
      return css`
        cursor: pointer;
      `;
    }
  }}

  &:focus {
    outline: none;
  }
`;

const Element = ({ xIndex, yIndex, element }) => {
  const dispatch = useDispatch();
  const player = useContext(PlayerContext);
  const shipOrientation = useSelector((state) =>
    selectOrientation(state, player.id)
  );

  const previewShip = useSelector((state) =>
    selectBoardPreview(state, player.id)
  );

  const isPreviewValid = useSelector((state) =>
    selectIsValidPlacement(state, previewShip)
  );

  const [ship, setShip] = useState({
    id: nanoid(),
    player: player.id,
    length: 5,
    orientation: shipOrientation,
    anchor: [xIndex, yIndex],
  });

  useEffect(() => {
    setShip((state) => ({
      ...state,
      orientation: shipOrientation,
    }));
  }, [shipOrientation]);

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
        xIndex={xIndex}
        yIndex={yIndex}
        states={element}
        onFocus={setPreview}
        onBlur={removePreview}
        onMouseEnter={setPreview}
        onMouseLeave={removePreview}
        onClick={placeShip}
        isPlacementValid={true}
        isPreviewValid={isPreviewValid}
      />
    );
  } else if (player.computer) {
    return (
      <StyledElement
        xIndex={xIndex}
        yIndex={yIndex}
        states={element}
        isPlacementValid={false}
        tabIndex="-1"
      />
    );
  } else {
    return (
      <StyledElement
        xIndex={xIndex}
        yIndex={yIndex}
        states={element}
        onFocus={setPreview}
        onBlur={removePreview}
        onMouseEnter={setPreview}
        onMouseLeave={removePreview}
        isPlacementValid={false}
        isPreviewValid={isPreviewValid}
        tabIndex="-1"
      />
    );
  }
};

export default Element;
