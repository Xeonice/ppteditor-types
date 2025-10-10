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
  LegacyV1ColorConfig,
  V1ShapeGradient,
  V1PPTElementShadow,
  V1PPTElementOutline
} from '../../src/types/v1-compat-types.js';

describe('V1ToV2Adapter', () => {
  describe('convertColor', () => {
    it('should convert V1ColorConfig to V2 string', () => {
      const v1Color: V1ColorConfig = {
        color: '#ff0000'
      };

      const result = V1ToV2Adapter.convertColor(v1Color);
      expect(result).toBe('#ff0000');
    });

    it('should use color from ColorConfig', () => {
      const v1Color: V1ColorConfig = {
        color: '#00ff00'
      };

      const result = V1ToV2Adapter.convertColor(v1Color);
      expect(result).toBe('#00ff00');
    });

    it('should handle new themeColor object format', () => {
      const v1Color: V1ColorConfig = {
        color: '#ff0000',
        themeColor: {
          color: '#ff0000',
          type: 'accent1'
        }
      };

      const result = V1ToV2Adapter.convertColor(v1Color);
      expect(result).toBe('#ff0000');
    });

    it('should handle themeColor as string (legacy format)', () => {
      const v1Color: LegacyV1ColorConfig = {
        color: '#0000ff',
        themeColor: '#ff0000' // 旧格式的字符串 themeColor
      };

      const result = V1ToV2Adapter.convertColor(v1Color);
      expect(result).toBe('#0000ff');
    });

    it('should prioritize themeColor.color when available', () => {
      const v1Color: V1ColorConfig = {
        color: '#000000',
        themeColor: {
          color: '#ff00ff',
          type: 'scheme'
        }
      };

      const result = V1ToV2Adapter.convertColor(v1Color);
      expect(result).toBe('#000000'); // 应该使用 color 字段，而不是 themeColor
    });
  });

  describe('convertShadow', () => {
    it('should convert V1PPTElementShadow to PPTElementShadow', () => {
      const v1Shadow: V1PPTElementShadow = {
        h: 10,
        v: 10,
        blur: 5,
        themeColor: { color: '#333333' }
      };

      const result = V1ToV2Adapter.convertShadow(v1Shadow);

      expect(result).toBeDefined();
      expect(result?.h).toBe(10);
      expect(result?.v).toBe(10);
      expect(result?.blur).toBe(5);
      expect(result?.color).toBe('#333333');
    });

    it('should return undefined for undefined input', () => {
      const result = V1ToV2Adapter.convertShadow(undefined);
      expect(result).toBeUndefined();
    });

    it('should handle shadow with partial color config', () => {
      const v1Shadow: V1PPTElementShadow = {
        h: 5,
        v: 5,
        blur: 2,
        themeColor: { color: '#999999' } as V1ColorConfig
      };

      const result = V1ToV2Adapter.convertShadow(v1Shadow);
      expect(result?.color).toBe('#999999');
    });
  });

  describe('convertOutline', () => {
    it('should convert V1PPTElementOutline to PPTElementOutline', () => {
      const v1Outline: V1PPTElementOutline = {
        style: 'dashed',
        width: 2,
        themeColor: { color: '#ff0000' }
      };

      const result = V1ToV2Adapter.convertOutline(v1Outline);

      expect(result).toBeDefined();
      expect(result?.style).toBe('dashed');
      expect(result?.width).toBe(2);
      expect(result?.color).toBe('#ff0000');
    });

    it('should return undefined for undefined input', () => {
      const result = V1ToV2Adapter.convertOutline(undefined);
      expect(result).toBeUndefined();
    });

    it('should handle outline with undefined themeColor', () => {
      const v1Outline: V1PPTElementOutline = {
        style: 'solid',
        width: 1
      };

      const result = V1ToV2Adapter.convertOutline(v1Outline);
      expect(result?.color).toBe('#000000');
    });

    it('should handle outline with partial fields', () => {
      const v1Outline: V1PPTElementOutline = {
        themeColor: { color: '#00ff00' }
      };

      const result = V1ToV2Adapter.convertOutline(v1Outline);
      expect(result?.style).toBeUndefined();
      expect(result?.width).toBeUndefined();
      expect(result?.color).toBe('#00ff00');
    });
  });

  describe('convertGradient', () => {
    it('should convert V1ShapeGradient to V2 Gradient', () => {
      const v1Gradient: V1ShapeGradient = {
        type: 'linear',
        themeColor: [
          { color: '#ff0000' },
          { color: '#0000ff' }
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

    it('should handle null colors in gradient themeColor array', () => {
      const v1Gradient: V1ShapeGradient = {
        type: 'linear',
        themeColor: [
          null as any, // 模拟 null 值
          { color: '#0000ff' }
        ],
        rotate: 45
      };

      // 不应该抛出错误
      expect(() => {
        const result = V1ToV2Adapter.convertGradient(v1Gradient);
        expect(result.colors).toHaveLength(2);
        expect(result.colors[0].color).toBe('#000000'); // 应该有默认值
        expect(result.colors[1].color).toBe('#0000ff');
      }).not.toThrow();
    });

    it('should handle undefined colors in gradient themeColor array', () => {
      const v1Gradient: V1ShapeGradient = {
        type: 'radial',
        themeColor: [
          { color: '#ff0000' },
          undefined as any // 模拟 undefined 值
        ],
        rotate: 90
      };

      expect(() => {
        const result = V1ToV2Adapter.convertGradient(v1Gradient);
        expect(result.colors).toHaveLength(2);
        expect(result.colors[0].color).toBe('#ff0000');
        expect(result.colors[1].color).toBe('#000000'); // 应该有默认值
      }).not.toThrow();
    });

    it('should handle gradient with new themeColor object format', () => {
      const v1Gradient: V1ShapeGradient = {
        type: 'linear',
        themeColor: [
          {
            color: '#ff0000',
            themeColor: {
              color: '#ff0000',
              type: 'accent1'
            }
          } as V1ColorConfig,
          {
            color: '#0000ff',
            themeColor: {
              color: '#0000ff',
              type: 'accent2'
            }
          } as V1ColorConfig
        ],
        rotate: 180
      };

      const result = V1ToV2Adapter.convertGradient(v1Gradient);
      expect(result.colors[0].color).toBe('#ff0000');
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
        defaultColor: { color: '#000000' },
        themeFill: { color: '#ffffff' },
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
      // themeColor 现在是可选的，不再强制要求
      expect(result.themeColor).toBeUndefined();
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
          color: '#ff0000'
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
            { color: '#ff0000' },
            { color: '#0000ff' }
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
        defaultColor: { color: '#000000' },
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
          defaultColor: { color: '#000000' },
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

describe('Round-trip Conversion Tests (V1→V2→V1)', () => {
  it('should preserve data integrity through V1→V2→V1 conversion', () => {
    const originalV1Color: V1ColorConfig = {
      color: '#ff0000',
      themeColor: {
        color: '#ff0000',
        type: 'accent1'
      },
      opacity: 0.8
    };

    // V1 → V2
    const v2Color = V1ToV2Adapter.convertColor(originalV1Color);
    expect(v2Color).toBe('#ff0000');

    // V2 → V1
    const convertedV1Color = V2ToV1Adapter.convertColor(v2Color);
    expect(convertedV1Color.color).toBe('#ff0000');
    expect(convertedV1Color.themeColor).toBeUndefined(); // themeColor is optional in V1
  });

  it('should handle gradient round-trip conversion', () => {
    const originalV1Gradient: V1ShapeGradient = {
      type: 'linear',
      themeColor: [
        {
          color: '#ff0000',
          themeColor: {
            color: '#ff0000',
            type: 'accent1'
          }
        } as V1ColorConfig,
        {
          color: '#0000ff',
          themeColor: {
            color: '#0000ff',
            type: 'accent2'
          }
        } as V1ColorConfig
      ],
      rotate: 45
    };

    // V1 → V2
    const v2Gradient = V1ToV2Adapter.convertGradient(originalV1Gradient);
    expect(v2Gradient.type).toBe('linear');
    expect(v2Gradient.colors).toHaveLength(2);
    expect(v2Gradient.rotate).toBe(45);

    // V2 → V1
    const convertedV1Gradient = V2ToV1Adapter.convertGradient(v2Gradient);
    expect(convertedV1Gradient.type).toBe('linear');
    expect(convertedV1Gradient.themeColor).toHaveLength(2);
    expect(convertedV1Gradient.rotate).toBe(45);

    // Verify colors are preserved
    expect(convertedV1Gradient.themeColor[0].color).toBe('#ff0000');
    expect(convertedV1Gradient.themeColor[1].color).toBe('#0000ff');
  });

  it('should preserve shadow properties through round-trip', () => {
    const originalV1Shadow: V1PPTElementShadow = {
      h: 10,
      v: 10,
      blur: 5,
      themeColor: {
        color: '#333333',
        themeColor: {
          color: '#333333',
          type: 'dk1'
        }
      } as V1ColorConfig
    };

    // V1 → V2
    const v2Shadow = V1ToV2Adapter.convertShadow(originalV1Shadow);
    expect(v2Shadow).toBeDefined();
    expect(v2Shadow!.h).toBe(10);
    expect(v2Shadow!.v).toBe(10);
    expect(v2Shadow!.blur).toBe(5);
    expect(v2Shadow!.color).toBe('#333333');

    // V2 → V1
    const convertedV1Shadow = V2ToV1Adapter.convertShadow(v2Shadow!);
    expect(convertedV1Shadow).toBeDefined();
    expect(convertedV1Shadow!.h).toBe(10);
    expect(convertedV1Shadow!.v).toBe(10);
    expect(convertedV1Shadow!.blur).toBe(5);
    expect(convertedV1Shadow!.themeColor).toEqual({ color: '#333333' }); // V2ToV1Adapter creates a color config
  });

  it('should handle text element round-trip conversion', () => {
    const originalV1Text: V1CompatibleTextElement = {
      id: 'text-roundtrip',
      type: 'text',
      left: 100,
      top: 100,
      width: 200,
      height: 50,
      rotate: 0,
      content: 'Round-trip Test',
      defaultFontName: 'Arial',
      defaultColor: {
        color: '#333333',
        themeColor: {
          color: '#333333',
          type: 'dk1'
        }
      } as V1ColorConfig,
      themeFill: {
        color: '#ffffff',
        themeColor: {
          color: '#ffffff',
          type: 'lt1'
        }
      } as V1ColorConfig,
      lineHeight: 1.5,
      fit: 'auto' as const
    };

    // V1 → V2
    const v2Text = V1ToV2Adapter.convertTextElement(originalV1Text);
    expect(v2Text.id).toBe('text-roundtrip');
    expect(v2Text.content).toBe('Round-trip Test');
    expect(v2Text.defaultColor).toBe('#333333');
    expect(v2Text.fill).toBe('#ffffff');

    // V2 → V1
    const convertedV1Text = V2ToV1Adapter.convertTextElement(v2Text);
    expect(convertedV1Text.id).toBe('text-roundtrip');
    expect(convertedV1Text.content).toBe('Round-trip Test');
    expect(convertedV1Text.defaultColor.color).toBe('#333333');
    expect(convertedV1Text.themeFill?.color).toBe('#ffffff');
    expect(convertedV1Text.lineHeight).toBe(1.5);
  });

  it('should handle edge cases in round-trip conversion', () => {
    // Test empty/undefined values
    const minimalV1Color: V1ColorConfig = {
      color: '#000000'
    };

    const v2Color = V1ToV2Adapter.convertColor(minimalV1Color);
    const backToV1 = V2ToV1Adapter.convertColor(v2Color);

    expect(backToV1.color).toBe('#000000');
    expect(backToV1.themeColor).toBeUndefined();
  });
});