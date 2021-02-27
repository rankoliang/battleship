import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nextRotation } from '../ships/shipFactory';
import {
  randomShipsPlaced,
  orientationUpdated,
  previewSet,
  selectBoardPreview,
  selectShipsToBePlaced,
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

export { useRandomPlacement, useRotation };
