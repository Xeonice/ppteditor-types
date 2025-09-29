/**
 * Tests for handling malformed V1 data
 */

import { describe, it, expect } from 'vitest';
import {
  V1ToV2Adapter,
  VersionDetector,
  AutoAdapter
} from '../../src/adapters/v1-v2-adapter.js';
import type {
  V1CompatibleTextElement,
  V1CompatibleShapeElement,
  V1ShapeGradient
} from '../../src/types/v1-compat-types.js';

describe('Malformed V1 Data Handling', () => {
  describe('V1ToV2Adapter - Color Conversion', () => {
    it('should handle null color config', () => {
      const result = V1ToV2Adapter.convertColor(null as any);
      expect(result).toBe('#000000');
    });

    it('should handle undefined color config', () => {
      const result = V1ToV2Adapter.convertColor(undefined as any);
      expect(result).toBe('#000000');
    });

    it('should handle empty color config', () => {
      const result = V1ToV2Adapter.convertColor({ color: '', themeColor: '' } as any);
      expect(result).toBe('#000000');
    });

    it('should handle color config with only one field', () => {
      const result1 = V1ToV2Adapter.convertColor({ color: '#ff0000' } as any);
      expect(result1).toBe('#ff0000');

      const result2 = V1ToV2Adapter.convertColor({ themeColor: '#00ff00' } as any);
      expect(result2).toBe('#00ff00');
    });

    it('should handle malformed color values', () => {
      const result = V1ToV2Adapter.convertColor({
        color: null as any,
        themeColor: undefined as any
      });
      expect(result).toBe('#000000');
    });
  });

  describe('V1ToV2Adapter - Gradient Conversion', () => {
    it('should throw error for gradient with no colors', () => {
      const v1Gradient: any = {
        type: 'linear',
        themeColor: [],
        rotate: 0
      };

      expect(() => V1ToV2Adapter.convertGradient(v1Gradient)).toThrow('V1 gradient requires at least 2 colors');
    });

    it('should throw error for gradient with one color', () => {
      const v1Gradient: any = {
        type: 'linear',
        themeColor: [
          { color: '#ff0000', themeColor: '#ff0000' }
        ],
        rotate: 0
      };

      expect(() => V1ToV2Adapter.convertGradient(v1Gradient)).toThrow('V1 gradient requires at least 2 colors');
    });

    it('should throw error for gradient with null themeColor', () => {
      const v1Gradient: any = {
        type: 'linear',
        themeColor: null,
        rotate: 0
      };

      expect(() => V1ToV2Adapter.convertGradient(v1Gradient)).toThrow('V1 gradient requires at least 2 colors');
    });

    it('should throw error for gradient with undefined themeColor', () => {
      const v1Gradient: any = {
        type: 'linear',
        themeColor: undefined,
        rotate: 0
      };

      expect(() => V1ToV2Adapter.convertGradient(v1Gradient)).toThrow('V1 gradient requires at least 2 colors');
    });

    it('should handle gradient with malformed color objects', () => {
      const v1Gradient: V1ShapeGradient = {
        type: 'linear',
        themeColor: [
          null as any,
          undefined as any
        ],
        rotate: 0
      };

      const result = V1ToV2Adapter.convertGradient(v1Gradient);
      expect(result.colors[0].color).toBe('#000000');
      expect(result.colors[1].color).toBe('#000000');
    });
  });

  describe('V1ToV2Adapter - Element Conversion', () => {
    it('should handle text element with missing required fields', () => {
      const v1Element: any = {
        id: 'text-1',
        type: 'text',
        left: 100,
        top: 100,
        // Missing width, height, rotate, content, defaultColor, etc.
      };

      const result = V1ToV2Adapter.convertTextElement(v1Element);
      expect(result.id).toBe('text-1');
      expect(result.type).toBe('text');
      expect(result.defaultColor).toBe('#000000');
    });

    it('should handle shape element with non-string path', () => {
      const v1Element: V1CompatibleShapeElement = {
        id: 'shape-1',
        type: 'shape',
        left: 0,
        top: 0,
        width: 100,
        height: 100,
        rotate: 0,
        viewBox: [0, 0],
        path: { d: 'M0,0 L100,100' } as any, // Non-string path
        fixedRatio: false,
        themeFill: { color: '#ff0000', themeColor: '#ff0000' }
      };

      const result = V1ToV2Adapter.convertShapeElement(v1Element);
      expect(result.path).toEqual({ d: 'M0,0 L100,100' });
    });

    it('should handle image element without fixedRatio', () => {
      const v1Element: any = {
        id: 'img-1',
        type: 'image',
        left: 0,
        top: 0,
        width: 200,
        height: 150,
        rotate: 0,
        src: 'image.png'
      };

      const result = V1ToV2Adapter.convertImageElement(v1Element);
      expect(result.fixedRatio).toBe(false);
    });

    it('should handle image element with existing fixedRatio', () => {
      const v1Element: any = {
        id: 'img-1',
        type: 'image',
        left: 0,
        top: 0,
        width: 200,
        height: 150,
        rotate: 0,
        src: 'image.png',
        fixedRatio: true
      };

      const result = V1ToV2Adapter.convertImageElement(v1Element);
      expect(result.fixedRatio).toBe(true);
    });

    it('should return null for unknown element type', () => {
      const v1Element: any = {
        id: 'unknown-1',
        type: 'unknown-type',
        left: 0,
        top: 0
      };

      const result = V1ToV2Adapter.convertElement(v1Element);
      expect(result).toBeNull();
    });

    it('should return null for none element type', () => {
      const v1Element: any = {
        id: 'none-1',
        type: 'none',
        left: 0,
        top: 0
      };

      const result = V1ToV2Adapter.convertElement(v1Element);
      expect(result).toBeNull();
    });

    it('should filter out null elements in batch conversion', () => {
      const v1Elements: any[] = [
        {
          id: 'text-1',
          type: 'text',
          left: 0, top: 0, width: 100, height: 50, rotate: 0,
          content: 'test',
          defaultFontName: 'Arial',
          defaultColor: { color: '#000000', themeColor: '#000000' }
        },
        {
          id: 'none-1',
          type: 'none'
        },
        {
          id: 'unknown-1',
          type: 'unknown'
        }
      ];

      const result = V1ToV2Adapter.convertElements(v1Elements);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('text-1');
    });
  });

  describe('VersionDetector - Edge Cases', () => {
    it('should handle null element', () => {
      expect(VersionDetector.isV1Element(null)).toBe(false);
      expect(VersionDetector.isV2Element(null)).toBe(true);
    });

    it('should handle undefined element', () => {
      expect(VersionDetector.isV1Element(undefined)).toBe(false);
      expect(VersionDetector.isV2Element(undefined)).toBe(true);
    });

    it('should handle non-object element', () => {
      expect(VersionDetector.isV1Element('string')).toBe(false);
      expect(VersionDetector.isV1Element(123)).toBe(false);
      expect(VersionDetector.isV1Element(true)).toBe(false);
    });

    it('should handle empty object', () => {
      expect(VersionDetector.isV1Element({})).toBe(false);
      expect(VersionDetector.isV2Element({})).toBe(true);
    });

    it('should handle malformed color format', () => {
      const element = {
        id: 'test',
        defaultColor: {
          invalidProp: 'value'
        }
      };
      expect(VersionDetector.isV1Element(element)).toBe(false);
    });

    it('should handle malformed gradient format', () => {
      const element = {
        id: 'test',
        gradient: {
          type: 'linear',
          invalidProp: 'value'
        }
      };
      expect(VersionDetector.isV1Element(element)).toBe(false);
    });
  });

  describe('AutoAdapter - Error Recovery', () => {
    it('should handle null element in toV2', () => {
      const result = AutoAdapter.toV2(null);
      expect(result).toBeNull();
    });

    it('should handle undefined element in toV2', () => {
      const result = AutoAdapter.toV2(undefined);
      expect(result).toBeNull(); // AutoAdapter returns null for falsy values
    });

    it('should handle malformed V1 element in toV1', () => {
      const element = {
        id: 'test',
        // Missing type and other required fields
      };

      expect(() => AutoAdapter.toV1(element)).toThrow();
    });

    it('should filter null values in batch conversion', () => {
      const elements = [
        {
          id: '1',
          type: 'text',
          left: 0, top: 0, width: 100, height: 50, rotate: 0,
          content: 'test',
          defaultFontName: 'Arial',
          defaultColor: { color: '#000000', themeColor: '#000000' },
          tag: 'v1'
        },
        null,
        undefined,
        {
          id: '2',
          type: 'none',
          tag: 'v1'
        }
      ];

      const result = AutoAdapter.elementsToV2(elements as any);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });
  });

  describe('Performance - Memoization', () => {
    it('should return same reference for repeated color conversion', () => {
      const color = { color: '#ff0000', themeColor: '#ff0000' };
      const result1 = V1ToV2Adapter.convertColor(color);
      const result2 = V1ToV2Adapter.convertColor(color);

      // Due to memoization, should be the same result
      expect(result1).toBe(result2);
    });

    it('should return same reference for repeated element conversion', () => {
      const element: V1CompatibleTextElement = {
        id: 'text-1',
        type: 'text',
        left: 100,
        top: 100,
        width: 200,
        height: 50,
        rotate: 0,
        content: 'Hello World',
        defaultFontName: 'Arial',
        defaultColor: { color: '#000000', themeColor: '#000000' },
        fit: 'none'
      };

      const result1 = V1ToV2Adapter.convertTextElement(element);
      const result2 = V1ToV2Adapter.convertTextElement(element);

      // Due to memoization, should be the same object reference
      expect(result1).toBe(result2);
    });
  });
});