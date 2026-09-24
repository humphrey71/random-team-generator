import { describe, it, expect } from 'vitest';
import { shuffleArray } from '../src/lib/shuffle';

describe('shuffleArray', () => {
  it('should maintain array length and elements after shuffle', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const output = shuffleArray(input);

    expect(output).toHaveLength(input.length);
    expect(new Set(output)).toEqual(new Set(input));
  });

  it('should return a new array and not mutate the original', () => {
    const input = ['Alice', 'Bob', 'Charlie'];
    const copy = [...input];
    const output = shuffleArray(input);

    expect(input).toEqual(copy);
    expect(output).not.toBe(input);
  });

  it('should handle empty and single-element arrays', () => {
    expect(shuffleArray([])).toEqual([]);
    expect(shuffleArray([42])).toEqual([42]);
  });
});
