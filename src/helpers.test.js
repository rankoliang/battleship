import { arrayWith, outOfBounds } from './helpers';

describe('helpers', () => {
  describe('outOfBounds', () => {
    let board;
    beforeEach(() => {
      board = arrayWith(10, () => arrayWith(10));
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

  describe('arrayWith', () => {
    it('creates an empty array initialized with null', () => {
      expect(arrayWith(2)).toEqual([null, null]);
    });

    it('creates an initialized with the result of the callback', () => {
      expect(arrayWith(3, () => 1)).toEqual([1, 1, 1]);
      expect(arrayWith(2, () => arrayWith(2))).toEqual([
        [null, null],
        [null, null],
      ]);
    });
  });
});
