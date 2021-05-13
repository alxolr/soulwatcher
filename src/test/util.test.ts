import assert from 'assert';
import { aggregate } from '../util';

describe('util', () => {
  describe('aggregate', () => {
    it('should aggregate simple object', () => {
      const expectedStats = {
        start: 1,
      };
      const stat = {};
      aggregate(stat, { start: 1 });

      assert.deepStrictEqual(expectedStats, stat);
    });

    it('should aggregate nested object', () => {
      const expectedStats = {
        level: {
          start: 1,
        },
      };
      const stat = {};
      aggregate(stat, { level: { start: 1 } });

      assert.deepStrictEqual(expectedStats, stat);
    });

    it('should aggregate nested with existing data', () => {
      const expectedStats = {
        level: {
          start: 5,
        },
      };
      const stat = {
        level: {
          start: 4,
        },
      };
      aggregate(stat, { level: { start: 1 } });

      assert.deepStrictEqual(expectedStats, stat);
    });
  });
});
