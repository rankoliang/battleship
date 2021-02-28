import styled, { css } from 'styled-components';
import { useContext } from 'react';
import { useShip, useShipPreview } from '../boardHooks';
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

const Element = ({ coordinate, element }) => {
  const player = useContext(PlayerContext);
  const { ship, isValidPlacement, placeShip } = useShip(player, coordinate);
  const { isPreviewValid, setPreview, removePreview } = useShipPreview(ship);

  if (isValidPlacement && !player.computer) {
    return (
      <StyledElement
        states={element}
        isPlacementValid={true}
        onFocus={setPreview}
        onBlur={removePreview}
        onMouseEnter={setPreview}
        onMouseLeave={removePreview}
        onClick={placeShip}
        isPreviewValid={isPreviewValid}
      />
    );
  } else if (player.computer) {
    return (
      <StyledElement states={element} isPlacementValid={false} tabIndex="-1" />
    );
  } else {
    return (
      <StyledElement
        states={element}
        isPlacementValid={false}
        onFocus={setPreview}
        onBlur={removePreview}
        onMouseEnter={setPreview}
        onMouseLeave={removePreview}
        isPreviewValid={isPreviewValid}
        tabIndex="-1"
      />
    );
  }
};

export default Element;
