import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import useKeypress from 'react-use-keypress';
import shuffle from 'shuffle-array';
import { selectPhase, selectComputerTurns } from '../game/gameSlice';
import {
  randomShipsPlaced,
  orientationUpdated,
  previewSet,
  nextShipPlaced,
  previewRemoved,
  selectPlayerId,
  selectBoardPreview,
  selectShipsToBePlaced,
  selectIsValidPlacement,
  selectNextShip,
  attackReceived,
  selectHittableCoordinates,
} from './boardsSlice';
import { selectPlayerById } from '../players/playersSlice';
import { usePlayers } from '../players/playerHooks';
import { nextRotation } from '../ships/shipFactory';

const useRandomPlacement = (player, callback) => {
  const { boardId } = player;
  const dispatch = useDispatch();
  const shipsRemaining = useSelector((state) =>
    selectShipsToBePlaced(state, boardId)
  );

  /* eslint-disable */
  useEffect(() => {
    if (shipsRemaining > 0 && callback(player)) {
      dispatch(randomShipsPlaced({ boardId }));
    }
  }, [dispatch, player]);
  /* eslint-enable */
};

const useRotation = (boardId, key = 'r') => {
  const dispatch = useDispatch();
  const phase = useSelector(selectPhase);
  const currentPreview = useSelector((state) =>
    selectBoardPreview(state, boardId)
  );
  const playerId = useSelector((state) => selectPlayerId(state, boardId));
  const player = useSelector((state) => selectPlayerById(state, playerId));

  let nextPreview;
  if (currentPreview) {
    nextPreview = {
      ...currentPreview,
      orientation: nextRotation(currentPreview.orientation),
    };
  } else {
    nextPreview = currentPreview;
  }

  const rotate = () => {
    if (!player.computer && phase === 'placement') {
      dispatch(orientationUpdated(1));
      if (nextPreview) {
        dispatch(previewSet(nextPreview));
      }
    }
  };

  useKeypress(key, rotate);
  return rotate;
};

const useShip = ({ boardId, id: playerId }, [xIndex, yIndex]) => {
  const dispatch = useDispatch();

  const nextShip = useSelector((state) => selectNextShip(state, boardId));

  const [ship, setShip] = useState({
    ...nextShip,
    id: nanoid(),
    boardId,
    playerId,
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
      dispatch(nextShipPlaced(boardId, ship.anchor, ship.orientation));
    }
  };

  const isValidPlacement = useSelector((state) =>
    selectIsValidPlacement(state, ship)
  );

  return { ship, isValidPlacement, placeShip };
};

const useShipPreview = (ship) => {
  const dispatch = useDispatch();
  const boardId = ship?.boardId;

  const previewShip = useSelector((state) =>
    selectBoardPreview(state, boardId)
  );

  const isPreviewValid = useSelector((state) =>
    selectIsValidPlacement(state, previewShip)
  );

  const setPreview = () => {
    ship && dispatch(previewSet(ship));
  };

  const removePreview = () => {
    ship && dispatch(previewRemoved(boardId));
  };

  return { isPreviewValid, setPreview, removePreview };
};

const useAttack = (coordinate) => {
  const dispatch = useDispatch();
  const [player, opponent] = usePlayers();
  const coordinateOptions = useSelector((state) =>
    selectHittableCoordinates(state, opponent.boardId)
  );
  const computerTurns = useSelector(selectComputerTurns);

  return () => {
    dispatch(attackReceived(player.boardId, coordinate));

    const computerChoice = shuffle.pick(coordinateOptions, {
      picks: computerTurns,
    });

    if (computerTurns === 1) {
      dispatch(attackReceived(opponent.boardId, computerChoice));
    } else {
      for (let turn = 0; turn < computerTurns; turn++) {
        dispatch(attackReceived(opponent.boardId, computerChoice[turn]));
      }
    }
  };
};

export { useRandomPlacement, useRotation, useShip, useShipPreview, useAttack };
