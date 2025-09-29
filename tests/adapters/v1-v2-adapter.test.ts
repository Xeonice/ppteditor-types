/**
 * V1/V2适配器测试
 */

import { describe, it, expect } from 'vitest';
import {
  V1ToV2Adapter,
  V2ToV1Adapter,
  VersionDetector,
  AutoAdapter
} from '../../src/adapters/v1-v2-adapter.js';
import type {
  V1CompatibleTextElement,
  V1CompatibleShapeElement,
  V1ColorConfig,
  V1ShapeGradient
} from '../../src/types/v1-compat-types.js';

describe('V1ToV2Adapter', () => {
  describe('convertColor', () => {
    it('should convert V1ColorConfig to V2 string', () => {
      const v1Color: V1ColorConfig = {
        color: '#ff0000',
        themeColor: '#ff0000'
      };

      const result = V1ToV2Adapter.convertColor(v1Color);
      expect(result).toBe('#ff0000');
    });

    it('should use themeColor as fallback', () => {
      const v1Color: V1ColorConfig = {
        color: '',
        themeColor: '#00ff00'
      };

      const result = V1ToV2Adapter.convertColor(v1Color);
      expect(result).toBe('#00ff00');
    });
  });

  describe('convertGradient', () => {
    it('should convert V1ShapeGradient to V2 Gradient', () => {
      const v1Gradient: V1ShapeGradient = {
        type: 'linear',
        themeColor: [
          { color: '#ff0000', themeColor: '#ff0000' },
          { color: '#0000ff', themeColor: '#0000ff' }
        ],
        rotate: 45
      };

      const result = V1ToV2Adapter.convertGradient(v1Gradient);

      expect(result.type).toBe('linear');
      expect(result.rotate).toBe(45);
      expect(result.colors).toHaveLength(2);
      expect(result.colors[0].pos).toBe(0);
      expect(result.colors[0].color).toBe('#ff0000');
      expect(result.colors[1].pos).toBe(100);
      expect(result.colors[1].color).toBe('#0000ff');
    });
  });

  describe('convertTextElement', () => {
    it('should convert V1 text element to V2', () => {
      const v1Element: V1CompatibleTextElement = {
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
        themeFill: { color: '#ffffff', themeColor: '#ffffff' },
        fit: 'none',
        enableShrink: true,
        tag: 'test-tag',
        index: 1,
        from: 'ai'
      };

      const result = V1ToV2Adapter.convertTextElement(v1Element);

      expect(result.id).toBe('text-1');
      expect(result.type).toBe('text');
      expect(result.content).toBe('Hello World');
      expect(result.defaultColor).toBe('#000000');
      expect(result.fill).toBe('#ffffff');
      expect(result.textType).toBe('content');

      // V1特有属性应该被移除
      expect((result as any).tag).toBeUndefined();
      expect((result as any).enableShrink).toBeUndefined();
    });
  });
});

describe('V2ToV1Adapter', () => {
  describe('convertColor', () => {
    it('should convert V2 string to V1ColorConfig', () => {
      const result = V2ToV1Adapter.convertColor('#ff0000');

      expect(result.color).toBe('#ff0000');
      expect(result.themeColor).toBe('#ff0000');
    });
  });

  describe('convertGradient', () => {
    it('should convert V2 Gradient to V1ShapeGradient', () => {
      const v2Gradient = {
        type: 'radial' as const,
        colors: [
          { pos: 0, color: '#ff0000' },
          { pos: 50, color: '#00ff00' },
          { pos: 100, color: '#0000ff' }
        ],
        rotate: 90
      };

      const result = V2ToV1Adapter.convertGradient(v2Gradient);

      expect(result.type).toBe('radial');
      expect(result.rotate).toBe(90);
      expect(result.themeColor).toHaveLength(2);
      expect(result.themeColor[0].color).toBe('#ff0000');
      expect(result.themeColor[1].color).toBe('#00ff00');
    });

    it('should handle gradients with less than 2 colors', () => {
      const v2Gradient = {
        type: 'linear' as const,
        colors: [
          { pos: 0, color: '#ff0000' }
        ],
        rotate: 0
      };

      const result = V2ToV1Adapter.convertGradient(v2Gradient);

      expect(result.themeColor).toHaveLength(2);
      expect(result.themeColor[0].color).toBe('#ff0000');
      expect(result.themeColor[1].color).toBe('#ff0000');
    });
  });
});

describe('VersionDetector', () => {
  describe('isV1Element', () => {
    it('should detect V1 element by tag property', () => {
      const element = {
        id: 'test',
        type: 'text',
        tag: 'test-tag'
      };

      expect(VersionDetector.isV1Element(element)).toBe(true);
    });

    it('should detect V1 element by ColorConfig format', () => {
      const element = {
        id: 'test',
        type: 'text',
        defaultColor: {
          color: '#ff0000',
          themeColor: '#ff0000'
        }
      };

      expect(VersionDetector.isV1Element(element)).toBe(true);
    });

    it('should detect V1 element by gradient format', () => {
      const element = {
        id: 'test',
        type: 'shape',
        gradient: {
          type: 'linear',
          themeColor: [
            { color: '#ff0000', themeColor: '#ff0000' },
            { color: '#0000ff', themeColor: '#0000ff' }
          ]
        }
      };

      expect(VersionDetector.isV1Element(element)).toBe(true);
    });

    it('should return false for V2 elements', () => {
      const element = {
        id: 'test',
        type: 'text',
        defaultColor: '#ff0000'
      };

      expect(VersionDetector.isV1Element(element)).toBe(false);
    });
  });

  describe('detectElementsVersion', () => {
    it('should detect v1 for all V1 elements', () => {
      const elements = [
        { id: '1', tag: 'test' },
        { id: '2', index: 1 }
      ];

      expect(VersionDetector.detectElementsVersion(elements)).toBe('v1');
    });

    it('should detect v2 for all V2 elements', () => {
      const elements = [
        { id: '1', type: 'text', defaultColor: '#ff0000' },
        { id: '2', type: 'shape', fill: '#00ff00' }
      ];

      expect(VersionDetector.detectElementsVersion(elements)).toBe('v2');
    });

    it('should detect mixed for mixed elements', () => {
      const elements = [
        { id: '1', tag: 'test' },
        { id: '2', type: 'text', defaultColor: '#ff0000' }
      ];

      expect(VersionDetector.detectElementsVersion(elements)).toBe('mixed');
    });

    it('should return v2 for empty array', () => {
      expect(VersionDetector.detectElementsVersion([])).toBe('v2');
    });
  });
});

describe('AutoAdapter', () => {
  describe('toV2', () => {
    it('should convert V1 element to V2', () => {
      const v1Element = {
        id: 'test',
        type: 'text',
        left: 0,
        top: 0,
        width: 100,
        height: 50,
        rotate: 0,
        content: 'test',
        defaultFontName: 'Arial',
        defaultColor: { color: '#000000', themeColor: '#000000' },
        tag: 'test-tag'
      };

      const result = AutoAdapter.toV2(v1Element);

      expect(result).toBeTruthy();
      expect(result?.type).toBe('text');
      expect((result as any).tag).toBeUndefined();
    });

    it('should return V2 element unchanged', () => {
      const v2Element = {
        id: 'test',
        type: 'text',
        left: 0,
        top: 0,
        width: 100,
        height: 50,
        rotate: 0,
        content: 'test',
        defaultColor: '#000000'
      };

      const result = AutoAdapter.toV2(v2Element);
      expect(result).toBe(v2Element);
    });
  });

  describe('elementsToV2', () => {
    it('should convert mixed array to V2', () => {
      const elements = [
        {
          id: '1',
          type: 'text',
          left: 0, top: 0, width: 100, height: 50, rotate: 0,
          content: 'test1',
          defaultFontName: 'Arial',
          defaultColor: { color: '#000000', themeColor: '#000000' },
          tag: 'v1-element'
        },
        {
          id: '2',
          type: 'text',
          left: 0, top: 0, width: 100, height: 50, rotate: 0,
          content: 'test2',
          defaultColor: '#000000'
        }
      ];

      const result = AutoAdapter.elementsToV2(elements);

      expect(result).toHaveLength(2);
      expect((result[0] as any).tag).toBeUndefined();
      expect(result[1].id).toBe('2');
    });
  });
});