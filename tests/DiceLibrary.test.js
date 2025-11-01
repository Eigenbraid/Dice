/**
 * Tests for DiceLibrary.js - Core dice rolling utilities
 *
 * Run with: npm test
 */

import { describe, it, expect, vi } from 'vitest';
import { rollSingleDie, rollSingleExplodingDie, rollDice, formatDiceRoll, parseDiceNotation, dropDice, countSuccesses } from '../DiceLibrary.js';

describe('rollSingleDie', () => {
    it('returns a value between 1 and sides', () => {
        const result = rollSingleDie(20);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(20);
    });

    it('throws error for invalid sides', () => {
        expect(() => rollSingleDie(0)).toThrow('Invalid dice sides');
        expect(() => rollSingleDie(-5)).toThrow('Invalid dice sides');
        expect(() => rollSingleDie(1.5)).toThrow('Invalid dice sides');
    });

    it('generates different values over multiple rolls', () => {
        const rolls = Array(100).fill(0).map(() => rollSingleDie(6));
        const uniqueValues = new Set(rolls);

        // With 100 rolls of d6, we should see at least 3 different values
        expect(uniqueValues.size).toBeGreaterThanOrEqual(3);
    });
});

describe('rollDice', () => {
    it('returns correct number of rolls', () => {
        const result = rollDice(5, 20);
        expect(result.rolls).toHaveLength(5);
        expect(result.rolls.every(r => r >= 1 && r <= 20)).toBe(true);
    });

    it('calculates total correctly', () => {
        // Mock Math.random to get predictable results
        const mockRandom = vi.spyOn(Math, 'random');
        mockRandom.mockReturnValue(0.5);

        const result = rollDice(3, 6);

        // With 0.5, Math.floor(0.5 * 6) + 1 = 3 + 1 = 4
        expect(result.rolls).toEqual([4, 4, 4]);
        expect(result.total).toBe(12);

        mockRandom.mockRestore();
    });

    it('throws error for invalid number of dice', () => {
        expect(() => rollDice(0, 6)).toThrow('Invalid number of dice');
        expect(() => rollDice(-1, 6)).toThrow('Invalid number of dice');
    });

    it('throws error for invalid dice type', () => {
        expect(() => rollDice(3, 0)).toThrow('Invalid dice type');
        expect(() => rollDice(3, -6)).toThrow('Invalid dice type');
    });
});

describe('formatDiceRoll', () => {
    it('formats a basic roll correctly', () => {
        const formatted = formatDiceRoll(3, 6, [3, 6, 1], 10);
        expect(formatted).toBe('Rolled 3d6 (3, 6, 1) = 10');
    });

    it('formats a single die roll', () => {
        const formatted = formatDiceRoll(1, 20, [15], 15);
        expect(formatted).toBe('Rolled 1d20 (15) = 15');
    });
});

describe('parseDiceNotation', () => {
    it('parses standard notation correctly', () => {
        expect(parseDiceNotation('3d6')).toEqual({ numDice: 3, diceType: 6 });
        expect(parseDiceNotation('2d20')).toEqual({ numDice: 2, diceType: 20 });
        expect(parseDiceNotation('10d10')).toEqual({ numDice: 10, diceType: 10 });
    });

    it('parses single die notation', () => {
        expect(parseDiceNotation('d20')).toEqual({ numDice: 1, diceType: 20 });
        expect(parseDiceNotation('d6')).toEqual({ numDice: 1, diceType: 6 });
    });

    it('handles whitespace', () => {
        expect(parseDiceNotation('  3d6  ')).toEqual({ numDice: 3, diceType: 6 });
    });

    it('is case insensitive', () => {
        expect(parseDiceNotation('3D6')).toEqual({ numDice: 3, diceType: 6 });
    });

    it('throws error for invalid notation', () => {
        expect(() => parseDiceNotation('abc')).toThrow('Invalid dice notation');
        expect(() => parseDiceNotation('3x6')).toThrow('Invalid dice notation');
        expect(() => parseDiceNotation('d')).toThrow('Invalid dice notation');
    });
});

describe('dropDice', () => {
    it('drops lowest dice correctly', () => {
        const rolls = [6, 2, 4, 1, 5];
        const result = dropDice(rolls, 2, 'lowest');

        expect(result.droppedRolls).toEqual([1, 2]);
        expect(result.keptRolls).toEqual([4, 5, 6]);
        expect(result.total).toBe(15);
    });

    it('drops highest dice correctly', () => {
        const rolls = [6, 2, 4, 1, 5];
        const result = dropDice(rolls, 2, 'highest');

        expect(result.droppedRolls).toEqual([5, 6]);
        expect(result.keptRolls).toEqual([1, 2, 4]);
        expect(result.total).toBe(7);
    });

    it('throws error if dropping too many dice', () => {
        expect(() => dropDice([1, 2, 3], 3, 'lowest')).toThrow('Cannot drop');
        expect(() => dropDice([1, 2], 5, 'lowest')).toThrow('Cannot drop');
    });
});

describe('countSuccesses', () => {
    it('counts successes with >= comparison', () => {
        const rolls = [6, 4, 2, 5, 1, 6];
        const result = countSuccesses(rolls, 5, '>=');

        expect(result.successCount).toBe(3);
        expect(result.successes).toEqual([6, 5, 6]);
        expect(result.failures).toEqual([4, 2, 1]);
    });

    it('counts successes with > comparison', () => {
        const rolls = [6, 5, 5, 4];
        const result = countSuccesses(rolls, 5, '>');

        expect(result.successCount).toBe(1);
        expect(result.successes).toEqual([6]);
    });

    it('counts successes with == comparison', () => {
        const rolls = [6, 6, 5, 6, 4];
        const result = countSuccesses(rolls, 6, '==');

        expect(result.successCount).toBe(3);
        expect(result.successes).toEqual([6, 6, 6]);
    });

    it('throws error for invalid comparison', () => {
        expect(() => countSuccesses([1, 2], 3, '!=')).toThrow('Invalid comparison');
    });
});

describe('rollSingleExplodingDie', () => {
    it('returns object with value, display, and breakdown', () => {
        const result = rollSingleExplodingDie(6);
        expect(result).toHaveProperty('value');
        expect(result).toHaveProperty('display');
        expect(result).toHaveProperty('breakdown');
        expect(Array.isArray(result.breakdown)).toBe(true);
    });

    it('does not explode when rolling below max', () => {
        const mockRandom = vi.spyOn(Math, 'random');
        mockRandom.mockReturnValue(0.5); // Will roll 4 on d6 (0.5 * 6 = 3, floor + 1 = 4)

        const result = rollSingleExplodingDie(6);

        expect(result.breakdown).toHaveLength(1);
        expect(result.value).toBe(4);
        expect(result.display).toBe('4');

        mockRandom.mockRestore();
    });

    it('explodes only once in standard mode when rolling max', () => {
        const mockRandom = vi.spyOn(Math, 'random');
        // First roll: 6 (max), second roll: 6 (max)
        mockRandom.mockReturnValueOnce(0.99); // 6
        mockRandom.mockReturnValueOnce(0.99);  // 6

        const result = rollSingleExplodingDie(6, 'standard');

        expect(result.breakdown).toEqual([6, 6]);
        expect(result.value).toBe(12);
        expect(result.display).toBe('6+6');

        mockRandom.mockRestore();
    });

    it('keeps exploding in compound mode', () => {
        const mockRandom = vi.spyOn(Math, 'random');
        // Rolls: 6, 6, 6, 2 (0.3 * 6 = 1.8, floor = 1, +1 = 2)
        mockRandom.mockReturnValueOnce(0.99); // 6
        mockRandom.mockReturnValueOnce(0.99); // 6
        mockRandom.mockReturnValueOnce(0.99); // 6
        mockRandom.mockReturnValueOnce(0.3);  // 2

        const result = rollSingleExplodingDie(6, 'compound');

        expect(result.breakdown).toEqual([6, 6, 6, 2]);
        expect(result.value).toBe(20);
        expect(result.display).toBe('6+6+6+2');

        mockRandom.mockRestore();
    });

    it('throws error for invalid dice type', () => {
        expect(() => rollSingleExplodingDie(1)).toThrow('Invalid dice type');
        expect(() => rollSingleExplodingDie(0)).toThrow('Invalid dice type');
        expect(() => rollSingleExplodingDie(-5)).toThrow('Invalid dice type');
    });

    it('works with different die sizes', () => {
        const mockRandom = vi.spyOn(Math, 'random');
        // Roll max on d20 (20), then roll 15
        mockRandom.mockReturnValueOnce(0.99);  // 20
        mockRandom.mockReturnValueOnce(0.725); // 15

        const result = rollSingleExplodingDie(20, 'standard');

        expect(result.breakdown).toEqual([20, 15]);
        expect(result.value).toBe(35);
        expect(result.display).toBe('20+15');

        mockRandom.mockRestore();
    });
});
