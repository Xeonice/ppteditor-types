/**
 * Color helpers utility tests
 */

import { describe, it, expect } from 'vitest';
import { createThemeColorConfig, validateColorConfig } from '../../src/utils/color-helpers.js';

describe('Color Helpers', () => {
  describe('createThemeColorConfig', () => {
    it('should create valid color config without theme color', () => {
      const config = createThemeColorConfig('#ff0000');

      expect(config.color).toBe('#ff0000');
      expect(config.themeColor).toBeUndefined();
    });

    it('should create valid color config with theme color', () => {
      const config = createThemeColorConfig('#ff0000', 'accent1');

      expect(config.color).toBe('#ff0000');
      expect(config.themeColor).toEqual({
        color: '#ff0000',
        type: 'accent1'
      });
    });

    it('should create valid color config with opacity', () => {
      const config = createThemeColorConfig('#ff0000', 'accent1', undefined, 0.5);

      expect(config.color).toBe('#ff0000');
      expect(config.opacity).toBe(0.5);
      expect(config.themeColor).toEqual({
        color: '#ff0000',
        type: 'accent1'
      });
    });

    it('should create full config with all options', () => {
      const config = createThemeColorConfig('#ff0000', 'accent2', 1, 0.8);

      expect(config.color).toBe('#ff0000');
      expect(config.themeColor).toEqual({
        color: '#ff0000',
        type: 'accent2'
      });
      expect(config.colorIndex).toBe(1);
      expect(config.opacity).toBe(0.8);
    });

    it('should throw error for invalid color when creating theme color', () => {
      expect(() => {
        createThemeColorConfig('', 'accent1');
      }).toThrow('Invalid color value for theme color configuration');

      expect(() => {
        createThemeColorConfig(null as any, 'accent1');
      }).toThrow('Invalid color value for theme color configuration');

      expect(() => {
        createThemeColorConfig(undefined as any, 'accent1');
      }).toThrow('Invalid color value for theme color configuration');
    });

    it('should not throw error for invalid color when not creating theme color', () => {
      // Should not throw because colorType is not provided
      expect(() => {
        const config = createThemeColorConfig('');
        expect(config.color).toBe('');
      }).not.toThrow();
    });
  });

  describe('validateColorConfig - updated with new themeColor format', () => {
    it('should validate new themeColor object format', () => {
      expect(validateColorConfig({
        color: '#ff0000',
        themeColor: {
          color: '#ff0000',
          type: 'accent1'
        }
      })).toBe(true);
    });

    it('should reject invalid themeColor objects', () => {
      // Missing color field
      expect(validateColorConfig({
        color: '#ff0000',
        themeColor: {
          type: 'accent1'
        }
      })).toBe(false);

      // Missing type field
      expect(validateColorConfig({
        color: '#ff0000',
        themeColor: {
          color: '#ff0000'
        }
      })).toBe(false);

      // themeColor is null
      expect(validateColorConfig({
        color: '#ff0000',
        themeColor: null
      })).toBe(false);

      // themeColor is string (legacy format no longer supported)
      expect(validateColorConfig({
        color: '#ff0000',
        themeColor: '#ff0000'
      })).toBe(false);
    });

    it('should validate complete color config', () => {
      expect(validateColorConfig({
        color: '#ff0000',
        themeColor: {
          color: '#ff0000',
          type: 'accent1'
        },
        colorType: 'accent1',
        opacity: 0.8
      })).toBe(true);
    });

    it('should reject configs with missing required color field', () => {
      expect(validateColorConfig({
        themeColor: {
          color: '#ff0000',
          type: 'accent1'
        }
      })).toBe(false);
    });
  });
});