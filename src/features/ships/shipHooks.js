import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectShipById } from './shipsSlice';
import { shipIsSunk } from './shipFactory';

export const useSunk = (shipId) => {
  const ship = useSelector((state) => selectShipById(state, shipId));
  const [sunk, setSunk] = useState(false);

  useEffect(() => {
    if (ship) {
      setSunk(shipIsSunk(ship));
    }
  }, [ship]);

  return sunk;
};
