import { describe, expect, it } from 'vitest';
import { cloudColors, gradientAt, pathGradients } from './palette';

describe('palette', () => {
	it('interpolates gradient stops', () => {
		const stops = ['#000000', '#ffffff'];
		expect(gradientAt(stops, 0)).toBe('rgb(0, 0, 0)');
		expect(gradientAt(stops, 1)).toBe('rgb(255, 255, 255)');
		expect(gradientAt(stops, 0.5)).toBe('rgb(128, 128, 128)');
		expect(gradientAt(stops, 2)).toBe('rgb(255, 255, 255)');
	});
	it('starts the default gradient near black and ends at gold', () => {
		expect(gradientAt(pathGradients[0], 0)).toBe('rgb(26, 26, 26)');
		expect(gradientAt(pathGradients[0], 1)).toBe('rgb(234, 182, 81)');
		expect(pathGradients.length).toBeGreaterThanOrEqual(3);
	});
	it('colors all six emotions', () => {
		expect(Object.keys(cloudColors).sort()).toEqual(
			['anger', 'disgust', 'fear', 'happiness', 'sadness', 'surprise']
		);
	});
});
