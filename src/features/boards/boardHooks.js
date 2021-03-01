import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nextRotation } from '../ships/shipFactory';
import { nanoid } from '@reduxjs/toolkit';
import {
  randomShipsPlaced,
  orientationUpdated,
  previewSet,
  nextShipPlaced,
  previewRemoved,
  selectBoardPreview,
  selectShipsToBePlaced,
  selectOrientation,
  selectIsValidPlacement,
  selectNextShip,
} from './boardsSlice';

const useRandomPlacement = (player, condition) => {
  const dispatch = useDispatch();
  const shipsRemaining = useSelector((state) =>
    selectShipsToBePlaced(state, player.id)
  );

  useEffect(() => {
    if (shipsRemaining > 0 && condition) {
      dispatch(randomShipsPlaced({ player }));
    }
  }, [dispatch, condition, player]);
};

const useRotation = (player) => {
  const dispatch = useDispatch();
  const currentPreview = useSelector((state) =>
    selectBoardPreview(state, player.id)
  );

  let nextPreview;
  if (currentPreview) {
    nextPreview = {
      ...currentPreview,
      orientation: nextRotation(currentPreview.orientation),
    };
  } else {
    nextPreview = currentPreview;
  }

  return function rotate() {
    if (nextPreview) {
      dispatch(orientationUpdated(1));
      dispatch(previewSet(nextPreview));
    }
  };
};

const useShip = ({ id }, [xIndex, yIndex]) => {
  const dispatch = useDispatch();

  const nextShip = useSelector((state) => selectNextShip(state, id));

  const [ship, setShip] = useState({
    ...nextShip,
    id: nanoid(),
    player: id,
    anchor: [xIndex, yIndex],
  });

  useEffect(() => {
    if (nextShip) {
      setShip((state) => ({ ...state, ...nextShip }));
    } else {
      setShip(null);
    }
  }, [nextShip]);

  const placeShip = () => {
    if (ship) {
      dispatch(nextShipPlaced(id, ship.anchor, ship.orientation));
    }
  };

  const isValidPlacement = useSelector((state) =>
    selectIsValidPlacement(state, ship)
  );

  return { ship, isValidPlacement, placeShip };
};

const useShipPreview = (ship) => {
  const dispatch = useDispatch();
  const id = ship?.player;

  const previewShip = useSelector((state) => selectBoardPreview(state, id));

  const isPreviewValid = useSelector((state) =>
    selectIsValidPlacement(state, previewShip)
  );

  const setPreview = () => {
    if (ship) {
      dispatch(previewSet(ship));
    }
  };

  const removePreview = () => {
    if (ship) {
      dispatch(previewRemoved(id));
    }
  };

  return { isPreviewValid, setPreview, removePreview };
};

export { useRandomPlacement, useRotation, useShip, useShipPreview };
