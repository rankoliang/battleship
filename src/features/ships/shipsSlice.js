import {
  createEntityAdapter,
  createSlice,
  createSelector,
} from '@reduxjs/toolkit';
import { updateArrayAtIndex } from '../../helpers';
import shipFactory, { shipCoordinates } from './shipFactory';

const shipsAdapter = createEntityAdapter();

export const shipsSlice = createSlice({
  name: 'ships',
  initialState: shipsAdapter.getInitialState(),
  reducers: {
    shipCreated: (state, action) => {
      shipsAdapter.addOne(state, shipFactory(action.payload));
    },
    shipHit: {
      reducer: (state, action) => {
        const { id, location } = action.payload;

        const ship = shipsSelectors.selectById(state, id);

        if (location < 0 || location >= ship.length) {
          return state;
        }

        shipsAdapter.updateOne(state, {
          id,
          changes: {
            hit: updateArrayAtIndex(ship.hit, location, true),
          },
        });
      },
      prepare: (id, location) => ({ payload: { id, location } }),
    },
    shipsReset: shipsAdapter.getInitialState,
  },
});

export const { shipCreated, shipHit } = shipsSlice.actions;

const shipsSelectors = shipsAdapter.getSelectors();

const globalizedSelectors = shipsAdapter.getSelectors((state) => state.ships);

export const {
  selectAll: selectShips,
  selectById: selectShipById,
  selectTotal: selectShipTotal,
} = globalizedSelectors;

export const selectShipIsSunk = createSelector(selectShipById, (ship) => {
  return ship.hit.every((location) => location === true);
});

export const selectShipCoordinates = createSelector(
  selectShipById,
  shipCoordinates
);

export default shipsSlice.reducer;
