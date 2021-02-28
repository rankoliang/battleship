import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nextRotation } from '../ships/shipFactory';
import { nanoid } from '@reduxjs/toolkit';
import {
  randomShipsPlaced,
  orientationUpdated,
  previewSet,
  shipPlaced,
  previewRemoved,
  selectBoardPreview,
  selectShipsToBePlaced,
  selectOrientation,
  selectIsValidPlacement,
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
  }, []);
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

  return () => {
    if (nextPreview) {
      dispatch(orientationUpdated(1));
      dispatch(previewSet(nextPreview));
    }
  };
};

const useShip = (player, [xIndex, yIndex]) => {
  const dispatch = useDispatch();

  const shipOrientation = useSelector((state) =>
    selectOrientation(state, player.id)
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

  const placeShip = () => {
    dispatch(shipPlaced(ship));
  };

  const isValidPlacement = useSelector((state) =>
    selectIsValidPlacement(state, ship)
  );

  return { ship, isValidPlacement, placeShip };
};

const useShipPreview = (ship) => {
  const dispatch = useDispatch();

  const previewShip = useSelector((state) =>
    selectBoardPreview(state, ship.player)
  );

  const isPreviewValid = useSelector((state) =>
    selectIsValidPlacement(state, previewShip)
  );

  const setPreview = () => {
    dispatch(previewSet(ship));
  };

  const removePreview = () => {
    dispatch(previewRemoved(ship.player));
  };

  return { isPreviewValid, setPreview, removePreview };
};

export { useRandomPlacement, useRotation, useShip, useShipPreview };
