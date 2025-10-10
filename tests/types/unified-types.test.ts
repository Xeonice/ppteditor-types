/**
 * 统一类型接口测试
 */

import { describe, it, expect } from 'vitest';
import {
  UnifiedPPTElement,
  UnifiedPPTElementCollection,
  VersionConversionUtils
} from '../../src/types/unified-types.js';

describe('UnifiedPPTElement', () => {
  const v1Element = {
    id: 'test-1',
    type: 'text' as const,
    left: 100,
    top: 100,
    width: 200,
    height: 50,
    rotate: 0,
    content: 'Hello',
    defaultFontName: 'Arial',
    defaultColor: { color: '#000000' },
    fit: 'none' as const,
    tag: 'v1-tag'
  };

  const v2Element = {
    id: 'test-2',
    type: 'text' as const,
    left: 200,
    top: 200,
    width: 300,
    height: 60,
    rotate: 45,
    content: 'World',
    defaultFontName: 'Arial',
    defaultColor: '#ff0000',
    fit: 'none' as const
  };

  describe('constructor', () => {
    it('should detect V1 element correctly', () => {
      const unified = new UnifiedPPTElement(v1Element);
      expect(unified.version()).toBe('v1');
    });

    it('should detect V2 element correctly', () => {
      const unified = new UnifiedPPTElement(v2Element);
      expect(unified.version()).toBe('v2');
    });
  });

  describe('asV1', () => {
    it('should return V1 element unchanged', () => {
      const unified = new UnifiedPPTElement(v1Element);
      const result = unified.asV1();
      expect(result).toBe(v1Element);
    });

    it('should convert V2 element to V1', () => {
      const unified = new UnifiedPPTElement(v2Element);
      const result = unified.asV1();

      expect(result.id).toBe('test-2');
      expect(result.type).toBe('text');
      expect((result as any).defaultColor).toHaveProperty('color');
      // themeColor 现在是可选的，不强制要求存在
      expect((result as any).defaultColor.color).toBe('#ff0000');
    });
  });

  describe('asV2', () => {
    it('should convert V1 element to V2', () => {
      const unified = new UnifiedPPTElement(v1Element);
      const result = unified.asV2();

      expect(result).toBeTruthy();
      expect(result!.id).toBe('test-1');
      expect(result!.type).toBe('text');
      expect((result as any).tag).toBeUndefined();
    });

    it('should return V2 element unchanged', () => {
      const unified = new UnifiedPPTElement(v2Element);
      const result = unified.asV2();
      expect(result).toBe(v2Element);
    });
  });

  describe('position methods', () => {
    it('should get position correctly', () => {
      const unified = new UnifiedPPTElement(v1Element);
      const position = unified.getPosition();

      expect(position).toEqual({
        left: 100,
        top: 100,
        width: 200,
        height: 50
      });
    });

    it('should set position correctly', () => {
      const unified = new UnifiedPPTElement(v1Element);
      unified.setPosition({ left: 150, width: 250 });

      const position = unified.getPosition();
      expect(position.left).toBe(150);
      expect(position.width).toBe(250);
      expect(position.top).toBe(100); // unchanged
    });
  });

  describe('rotation methods', () => {
    it('should get rotation correctly', () => {
      const unified = new UnifiedPPTElement(v2Element);
      expect(unified.getRotation()).toBe(45);
    });

    it('should set rotation correctly', () => {
      // Create a copy to avoid affecting other tests
      const elementCopy = JSON.parse(JSON.stringify(v1Element));
      const unified = new UnifiedPPTElement(elementCopy);
      unified.setRotation(90);
      expect(unified.getRotation()).toBe(90);
    });
  });

  describe('clone', () => {
    it('should create independent copy', () => {
      // Create a copy to ensure fresh state
      const elementCopy = JSON.parse(JSON.stringify(v1Element));
      const unified = new UnifiedPPTElement(elementCopy);
      const cloned = unified.clone();

      expect(cloned.getId()).toBe(unified.getId());
      expect(cloned.raw()).not.toBe(unified.raw());

      // Modify original
      unified.setRotation(180);
      expect(cloned.getRotation()).toBe(0); // unchanged
    });
  });

  describe('JSON serialization', () => {
    it('should serialize to JSON correctly', () => {
      const unified = new UnifiedPPTElement(v1Element);
      const json = unified.toJSON();
      expect(json).toEqual(v1Element);
    });

    it('should deserialize from JSON correctly', () => {
      const unified = UnifiedPPTElement.fromJSON(v2Element);
      expect(unified.getId()).toBe('test-2');
      expect(unified.version()).toBe('v2');
    });
  });
});

describe('UnifiedPPTElementCollection', () => {
  const elements = [
    {
      id: '1',
      type: 'text' as const,
      left: 0, top: 0, width: 100, height: 50, rotate: 0,
      content: 'test1',
      defaultFontName: 'Arial',
      defaultColor: { color: '#000000' },
      fit: 'none' as const,
      tag: 'v1'
    },
    {
      id: '2',
      type: 'text' as const,
      left: 0, top: 0, width: 100, height: 50, rotate: 0,
      content: 'test2',
      defaultFontName: 'Arial',
      defaultColor: '#ff0000',
      fit: 'none' as const
    },
    {
      id: '3',
      type: 'shape' as const,
      left: 0, top: 0, width: 100, height: 100, rotate: 0,
      viewBox: [0, 0] as [number, number],
      path: 'M0,0 L100,100',
      fixedRatio: false,
      themeFill: { color: '#00ff00' }
    }
  ];

  describe('constructor', () => {
    it('should create collection from elements array', () => {
      const collection = new UnifiedPPTElementCollection(elements);
      expect(collection.count()).toBe(3);
    });

    it('should create empty collection', () => {
      const collection = new UnifiedPPTElementCollection();
      expect(collection.count()).toBe(0);
    });
  });

  describe('add and remove', () => {
    it('should add element correctly', () => {
      const collection = new UnifiedPPTElementCollection();
      collection.add(elements[0]);

      expect(collection.count()).toBe(1);
      expect(collection.findById('1')).toBeTruthy();
    });

    it('should remove element correctly', () => {
      const collection = new UnifiedPPTElementCollection(elements);
      const removed = collection.remove('2');

      expect(removed).toBe(true);
      expect(collection.count()).toBe(2);
      expect(collection.findById('2')).toBeUndefined();
    });

    it('should return false when removing non-existent element', () => {
      const collection = new UnifiedPPTElementCollection();
      const removed = collection.remove('non-existent');
      expect(removed).toBe(false);
    });
  });

  describe('filterByType', () => {
    it('should filter elements by type', () => {
      const collection = new UnifiedPPTElementCollection(elements);
      const textElements = collection.filterByType('text');

      expect(textElements).toHaveLength(2);
      expect(textElements[0].getType()).toBe('text');
      expect(textElements[1].getType()).toBe('text');
    });

    it('should return empty array for non-existent type', () => {
      const collection = new UnifiedPPTElementCollection(elements);
      const imageElements = collection.filterByType('image');
      expect(imageElements).toHaveLength(0);
    });
  });

  describe('version conversion', () => {
    it('should convert all elements to V1', () => {
      const collection = new UnifiedPPTElementCollection(elements);
      const v1Array = collection.asV1Array();

      expect(v1Array).toHaveLength(3);
      v1Array.forEach(el => {
        if (el.type === 'text') {
          expect((el as any).defaultColor).toHaveProperty('color');
        }
      });
    });

    it('should convert all elements to V2', () => {
      const collection = new UnifiedPPTElementCollection(elements);
      const v2Array = collection.asV2Array();

      expect(v2Array).toHaveLength(3);
      v2Array.forEach(el => {
        if (el.type === 'text') {
          expect(typeof (el as any).defaultColor).toBe('string');
        }
      });
    });
  });

  describe('getVersionStats', () => {
    it('should return correct version statistics', () => {
      const collection = new UnifiedPPTElementCollection(elements);
      const stats = collection.getVersionStats();

      expect(stats.total).toBe(3);
      expect(stats.v1).toBe(1); // element with tag
      expect(stats.v2).toBe(2); // elements without V1 markers
    });
  });

  describe('batchUpdate', () => {
    it('should update all elements', () => {
      const collection = new UnifiedPPTElementCollection(elements);
      collection.batchUpdate(el => el.setRotation(45));

      collection.getAll().forEach(el => {
        expect(el.getRotation()).toBe(45);
      });
    });
  });

  describe('iteration', () => {
    it('should be iterable', () => {
      const collection = new UnifiedPPTElementCollection(elements);
      const ids: string[] = [];

      for (const element of collection) {
        ids.push(element.getId());
      }

      expect(ids).toEqual(['1', '2', '3']);
    });
  });

  describe('clone', () => {
    it('should create independent copy', () => {
      const collection = new UnifiedPPTElementCollection(elements);
      const cloned = collection.clone();

      expect(cloned.count()).toBe(collection.count());

      cloned.remove('1');
      expect(collection.count()).toBe(3); // original unchanged
      expect(cloned.count()).toBe(2);
    });
  });
});

describe('VersionConversionUtils', () => {
  const mixedElements = [
    {
      id: '1',
      type: 'text' as const,
      left: 0, top: 0, width: 100, height: 50, rotate: 0,
      content: 'v1 text',
      defaultFontName: 'Arial',
      defaultColor: { color: '#000000' },
      fit: 'none' as const,
      tag: 'v1'
    },
    {
      id: '2',
      type: 'text' as const,
      left: 0, top: 0, width: 100, height: 50, rotate: 0,
      content: 'v2 text',
      defaultFontName: 'Arial',
      defaultColor: '#ff0000',
      fit: 'none' as const
    }
  ];

  describe('smartBatchConvert', () => {
    it('should convert all elements to target version', () => {
      const result = VersionConversionUtils.smartBatchConvert(mixedElements, 'v2');

      expect(result).toHaveLength(2);
      result.forEach(el => {
        if (el.type === 'text') {
          expect(typeof (el as any).defaultColor).toBe('string');
        }
      });
    });

    it('should convert all elements to V1', () => {
      const result = VersionConversionUtils.smartBatchConvert(mixedElements, 'v1');

      expect(result).toHaveLength(2);
      result.forEach(el => {
        if (el.type === 'text') {
          expect((el as any).defaultColor).toHaveProperty('color');
        }
      });
    });
  });

  describe('normalizeToVersion', () => {
    it('should provide detailed conversion statistics', () => {
      const result = VersionConversionUtils.normalizeToVersion(mixedElements, 'v2');

      expect(result.converted).toHaveLength(2);
      expect(result.stats.original.v1).toBe(1);
      expect(result.stats.original.v2).toBe(1);
      expect(result.stats.converted).toBe(2);
      expect(result.stats.skipped).toBe(0);
    });
  });

  describe('checkCompatibility', () => {
    it('should detect version mixing issues', () => {
      const result = VersionConversionUtils.checkCompatibility(mixedElements);

      expect(result.compatible).toBe(false);
      expect(result.issues).toContain('检测到版本混合：1个V1元素，1个V2元素');
      expect(result.recommendations).toContain('建议统一转换到V2版本以获得最佳兼容性');
    });

    it('should detect none element issues', () => {
      const elementsWithNone = [
        ...mixedElements,
        {
          id: '3',
          type: 'none' as const,
          left: 0, top: 0, width: 100, height: 50, rotate: 0,
          text: 'AI generated',
          from: 'ai'
        }
      ];

      const result = VersionConversionUtils.checkCompatibility(elementsWithNone);

      expect(result.issues.some(issue => issue.includes("'none'类型元素"))).toBe(true);
      expect(result.recommendations.some(rec => rec.includes('none元素'))).toBe(true);
    });

    it('should return compatible for uniform elements', () => {
      const uniformElements = [
        {
          id: '1',
          type: 'text' as const,
          left: 0, top: 0, width: 100, height: 50, rotate: 0,
          content: 'text1',
          defaultFontName: 'Arial',
          defaultColor: '#000000',
          fit: 'none' as const
        },
        {
          id: '2',
          type: 'text' as const,
          left: 0, top: 0, width: 100, height: 50, rotate: 0,
          content: 'text2',
          defaultFontName: 'Arial',
          defaultColor: '#ff0000',
          fit: 'none' as const
        }
      ];

      const result = VersionConversionUtils.checkCompatibility(uniformElements);
      expect(result.compatible).toBe(true);
      expect(result.issues).toHaveLength(0);
    });
  });
});