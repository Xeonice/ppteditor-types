/**
 * Color helpers utility tests
 */

import { describe, it, expect } from 'vitest';
import {
  createThemeColorConfig,
  validateColorConfig,
  isThemeColorObject,
  migrateColorConfig
} from '../../src/utils/color-helpers.js';

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

  describe('isThemeColorObject', () => {
    it('should return true for valid theme color objects', () => {
      expect(isThemeColorObject({
        color: '#ff0000',
        type: 'accent1'
      })).toBe(true);
    });

    it('should return false for string values', () => {
      expect(isThemeColorObject('#ff0000')).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(isThemeColorObject(null)).toBe(false);
      expect(isThemeColorObject(undefined)).toBe(false);
    });

    it('should return false for objects missing required fields', () => {
      expect(isThemeColorObject({ color: '#ff0000' })).toBe(false);
      expect(isThemeColorObject({ type: 'accent1' })).toBe(false);
      expect(isThemeColorObject({})).toBe(false);
    });

    it('should return false for objects with wrong field types', () => {
      expect(isThemeColorObject({
        color: 123,
        type: 'accent1'
      })).toBe(false);
      expect(isThemeColorObject({
        color: '#ff0000',
        type: true
      })).toBe(false);
    });
  });

  describe('migrateColorConfig', () => {
    it('should migrate legacy string themeColor to new object format', () => {
      const oldConfig = {
        color: '#ff0000',
        themeColor: '#00ff00',  // Legacy string format
        colorType: 'accent2'
      };

      const migrated = migrateColorConfig(oldConfig);

      expect(migrated.color).toBe('#ff0000');
      expect(migrated.themeColor).toEqual({
        color: '#00ff00',
        type: 'accent2'
      });
      expect(migrated.colorType).toBe('accent2');
    });

    it('should use default colorType when not provided for legacy format', () => {
      const oldConfig = {
        color: '#ff0000',
        themeColor: '#00ff00'  // No colorType provided
      };

      const migrated = migrateColorConfig(oldConfig, 'dk1');

      expect(migrated.themeColor).toEqual({
        color: '#00ff00',
        type: 'dk1'
      });
      expect(migrated.colorType).toBe('dk1');
    });

    it('should preserve new format themeColor unchanged', () => {
      const oldConfig = {
        color: '#ff0000',
        themeColor: {
          color: '#00ff00',
          type: 'accent3'
        }
      };

      const migrated = migrateColorConfig(oldConfig);

      expect(migrated.themeColor).toEqual({
        color: '#00ff00',
        type: 'accent3'
      });
    });

    it('should preserve all other fields during migration', () => {
      const oldConfig = {
        color: '#ff0000',
        themeColor: '#00ff00',
        colorType: 'accent1',
        colorIndex: 2,
        opacity: 0.7
      };

      const migrated = migrateColorConfig(oldConfig);

      expect(migrated.colorIndex).toBe(2);
      expect(migrated.opacity).toBe(0.7);
    });

    it('should handle configs without themeColor', () => {
      const oldConfig = {
        color: '#ff0000',
        opacity: 0.5
      };

      const migrated = migrateColorConfig(oldConfig);

      expect(migrated.color).toBe('#ff0000');
      expect(migrated.opacity).toBe(0.5);
      expect(migrated.themeColor).toBeUndefined();
    });

    it('should throw error for invalid config', () => {
      expect(() => migrateColorConfig(null)).toThrow('Invalid color config for migration');
      expect(() => migrateColorConfig(undefined)).toThrow('Invalid color config for migration');
      expect(() => migrateColorConfig('invalid')).toThrow('Invalid color config for migration');
    });

    it('should provide default color when missing', () => {
      const oldConfig = {
        themeColor: '#00ff00',
        colorType: 'accent1'
      };

      const migrated = migrateColorConfig(oldConfig);

      expect(migrated.color).toBe('#000000');  // Default color
    });
  });
});