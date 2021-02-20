import { emptySquareArray, outOfBounds } from './helpers';

describe('helpers', () => {
  describe('outOfBounds', () => {
    let board;
    beforeEach(() => {
      board = emptySquareArray(10);
    });

    describe('when the x coordinate is less than 0', () => {
      it('returns true', () => {
        expect(outOfBounds([-1, 0], board)).toBe(true);
      });
    });

    describe('when the x coordinate is greater than the length of the board', () => {
      it('returns true', () => {
        expect(outOfBounds([10, 0], board)).toBe(true);
      });
    });

    describe('when the y coordinate is less than 0', () => {
      it('returns true', () => {
        expect(outOfBounds([0, -1], board)).toBe(true);
      });
    });

    describe('when the y coordinate is greater than the height of the board', () => {
      it('returns true', () => {
        expect(outOfBounds([0, 10], board)).toBe(true);
      });
    });

    describe('when the coordinates are between 0 and the max dimension', () => {
      it('returns true', () => {
        expect(outOfBounds([9, 9], board)).toBe(false);
      });
    });
  });
});
