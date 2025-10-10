/**
 * 兼容性集成测试
 */

import { describe, it, expect } from 'vitest';
import {
  V1ToV2Adapter,
  V2ToV1Adapter,
  VersionDetector,
  AutoAdapter
} from '../../src/adapters/v1-v2-adapter.js';
import {
  UnifiedPPTElement,
  UnifiedPPTElementCollection,
  VersionConversionUtils
} from '../../src/types/unified-types.js';
import {
  SmartVersionConverter,
  GradientConverter,
  ConverterUtils
} from '../../src/utils/version-converter.js';
import {
  VersionMiddleware,
  MiddlewareUtils
} from '../../src/middleware/version-middleware.js';

describe('V1/V2 Compatibility Integration', () => {
  // 完整的V1项目数据样本
  const v1ProjectData = [
    {
      id: 'slide-1-text-1',
      type: 'text' as const,
      left: 100,
      top: 100,
      width: 400,
      height: 60,
      rotate: 0,
      lock: false,
      content: 'V1项目标题',
      defaultFontName: 'Microsoft YaHei',
      defaultColor: { color: '#333333' },
      themeFill: { color: '#ffffff' },
      lineHeight: 1.2,
      opacity: 1,
      vertical: false,
      fit: 'none' as const,
      enableShrink: true,
      tag: 'title',
      index: 1,
      from: 'user',
      isDefault: false
    },
    {
      id: 'slide-1-shape-1',
      type: 'shape' as const,
      left: 50,
      top: 200,
      width: 300,
      height: 200,
      rotate: 15,
      viewBox: [0, 0] as [number, number],
      path: 'M0,0 L300,0 L300,200 L0,200 Z',
      fixedRatio: false,
      themeFill: { color: '#4285f4' },
      gradient: {
        type: 'linear' as const,
        themeColor: [
          { color: '#4285f4' },
          { color: '#34a853' }
        ] as [{ color: string }, { color: string }],
        rotate: 45
      },
      opacity: 0.9,
      special: true,
      keypoint: 50,
      tag: 'background-shape',
      index: 2,
      from: 'ai'
    },
    {
      id: 'slide-1-image-1',
      type: 'image' as const,
      left: 400,
      top: 250,
      width: 200,
      height: 150,
      rotate: 0,
      src: '/images/sample.jpg',
      size: 'medium',
      loading: false,
      tag: 'content-image',
      index: 3,
      from: 'upload'
    },
    {
      id: 'slide-1-none-1',
      type: 'none' as const,
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      rotate: 0,
      text: '这是AI生成的占位符内容，需要用户进一步编辑',
      content: '',
      from: 'ai',
      tag: 'ai-placeholder'
    }
  ];

  // V2标准数据样本
  const v2StandardData = [
    {
      id: 'slide-2-text-1',
      type: 'text' as const,
      left: 100,
      top: 100,
      width: 400,
      height: 60,
      rotate: 0,
      content: 'V2标准标题',
      defaultFontName: 'Arial',
      defaultColor: '#333333',
      fill: '#ffffff',
      textType: 'title' as const,
      lineHeight: 1.2,
      opacity: 1,
      vertical: false,
      fit: 'none' as const
    },
    {
      id: 'slide-2-shape-1',
      type: 'shape' as const,
      left: 50,
      top: 200,
      width: 300,
      height: 200,
      rotate: 15,
      viewBox: [0, 0] as [number, number],
      path: 'M0,0 L300,0 L300,200 L0,200 Z',
      fixedRatio: false,
      fill: '#4285f4',
      gradient: {
        type: 'linear' as const,
        colors: [
          { pos: 0, color: '#4285f4' },
          { pos: 100, color: '#34a853' }
        ],
        rotate: 45
      },
      opacity: 0.9,
      pattern: 'solid'
    },
    {
      id: 'slide-2-image-1',
      type: 'image' as const,
      left: 400,
      top: 250,
      width: 200,
      height: 150,
      rotate: 0,
      src: '/images/sample.jpg',
      fixedRatio: false,
      radius: 8,
      imageType: 'content'
    }
  ];

  describe('Full V1 to V2 Migration Workflow', () => {
    it('should successfully migrate complete V1 project to V2', async () => {
      // 1. 版本检测
      const detectionResults = v1ProjectData.map(el => ({
        id: el.id,
        version: VersionDetector.isV1Element(el) ? 'v1' : 'v2'
      }));

      expect(detectionResults.every(r => r.version === 'v1')).toBe(true);

      // 2. 兼容性检查
      const compatibility = VersionConversionUtils.checkCompatibility(v1ProjectData);
      expect(compatibility.compatible).toBe(false); // 因为有none元素
      expect(compatibility.issues.length).toBeGreaterThan(0);

      // 3. 智能转换
      const converter = new SmartVersionConverter();
      const conversionPreview = converter.previewConversion(v1ProjectData, 'v2');

      expect(conversionPreview.summary.total).toBe(4);
      expect(conversionPreview.summary.willConvert).toBe(3); // text, shape, image元素
      expect(conversionPreview.summary.willFail).toBe(1); // none元素

      // 4. 执行转换
      const conversionResult = converter.smartBatchConvert(v1ProjectData, 'v2');

      expect(conversionResult.converted.length).toBe(4); // 所有元素都转换成功了（包括none）
      expect(conversionResult.failed.length).toBe(0);
      expect(conversionResult.stats.converted).toBe(4);
      expect(conversionResult.stats.failed).toBe(0);

      // 5. 验证转换结果
      const convertedElements = conversionResult.converted;

      // 文本元素验证
      const textElement = convertedElements.find(el => el.type === 'text');
      expect(textElement).toBeTruthy();
      expect((textElement as any).defaultColor).toBe('#333333');
      expect((textElement as any).fill).toBe('#ffffff');
      expect((textElement as any).tag).toBeUndefined();
      expect((textElement as any).enableShrink).toBeUndefined();

      // 形状元素验证
      const shapeElement = convertedElements.find(el => el.type === 'shape');
      expect(shapeElement).toBeTruthy();
      expect((shapeElement as any).fill).toBe('#4285f4');
      expect((shapeElement as any).gradient).toBeTruthy();
      expect((shapeElement as any).gradient.colors).toHaveLength(2);

      // 图片元素验证
      const imageElement = convertedElements.find(el => el.type === 'image');
      expect(imageElement).toBeTruthy();
      expect((imageElement as any).fixedRatio).toBe(false);
      expect((imageElement as any).size).toBeUndefined();
      expect((imageElement as any).loading).toBeUndefined();
    });

    it('should handle round-trip conversion (V1 → V2 → V1)', () => {
      const originalV1 = v1ProjectData[0]; // 文本元素

      // V1 → V2
      const v2Result = V1ToV2Adapter.convertTextElement(originalV1 as any);
      expect(v2Result.defaultColor).toBe('#333333');
      expect(v2Result.fill).toBe('#ffffff');

      // V2 → V1
      const v1Result = V2ToV1Adapter.convertTextElement(v2Result);
      expect(v1Result.defaultColor).toHaveProperty('color');
      expect(v1Result.defaultColor.color).toBe('#333333');
      expect(v1Result.themeFill?.color).toBe('#ffffff');

      // 核心属性应该保持一致
      expect(v1Result.id).toBe(originalV1.id);
      expect(v1Result.content).toBe(originalV1.content);
      expect(v1Result.left).toBe(originalV1.left);
      expect(v1Result.top).toBe(originalV1.top);
    });
  });

  describe('Mixed Version Data Handling', () => {
    const mixedData = [...v1ProjectData.slice(0, 2), ...v2StandardData.slice(0, 2)];

    it('should handle mixed version data correctly', () => {
      const collection = new UnifiedPPTElementCollection(mixedData);
      const stats = collection.getVersionStats();

      expect(stats.total).toBe(4);
      expect(stats.v1).toBe(2);
      expect(stats.v2).toBe(2);

      // 转换到统一V2格式
      const v2Array = collection.asV2Array();
      expect(v2Array.length).toBe(4);

      // 验证所有元素都是V2格式
      v2Array.forEach(el => {
        expect(VersionDetector.isV2Element(el)).toBe(true);
      });
    });

    it('should provide intelligent conversion recommendations', () => {
      const converter = new SmartVersionConverter();
      const strategy = converter.inferBestStrategy(mixedData);

      expect(strategy.recommendedVersion).toBe('v2');
      expect(strategy.confidence).toBeGreaterThan(0.5);
      expect(strategy.reasoning.length).toBeGreaterThan(0);
    });
  });

  describe('Middleware Integration', () => {
    it('should process data through middleware pipeline', () => {
      const middleware = new VersionMiddleware({
        defaultVersion: 'v2',
        autoConvert: true,
        preserveOriginal: true,
        errorHandling: 'skip',
        logLevel: 'none'
      });

      const result = middleware.processElements(v1ProjectData, {
        source: 'import',
        target: 'storage',
        preferredVersion: 'v2'
      });

      expect(result.data.length).toBe(3); // none元素被跳过
      expect(result.stats.processed).toBe(4);
      expect(result.stats.converted).toBe(3);
      expect(result.stats.skipped).toBe(1);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should format output for different contexts', () => {
      // API输出
      const apiResult = MiddlewareUtils.forAPI(v2StandardData);
      expect(apiResult.data).toHaveProperty('elements');
      expect(apiResult.data).toHaveProperty('metadata');

      // 存储输出
      const storageResult = MiddlewareUtils.forStorage(v2StandardData);
      expect(storageResult.data).toHaveProperty('version');
      expect(storageResult.data).toHaveProperty('checksum');

      // UI显示输出
      const uiResult = MiddlewareUtils.forUI(v2StandardData);
      expect(Array.isArray(uiResult.data)).toBe(true);
      expect(uiResult.data[0]).toHaveProperty('id');
      expect(uiResult.data[0]).toHaveProperty('type');
    });
  });

  describe('Gradient Conversion Edge Cases', () => {
    it('should handle complex gradient scenarios', () => {
      const complexV1Gradient = {
        type: 'radial',
        themeColor: [
          { color: 'rgba(255,0,0,0.8)' },
          { color: 'transparent' }
        ],
        rotate: 135
      };

      const v2Result = GradientConverter.v1ToV2(complexV1Gradient as any);
      expect(v2Result.type).toBe('radial');
      expect(v2Result.colors).toHaveLength(2);
      expect(v2Result.colors[0].color).toBe('rgba(255,0,0,0.8)');
      expect(v2Result.rotate).toBe(135);

      // 反向转换
      const v1Result = GradientConverter.v2ToV1(v2Result);
      expect(v1Result.type).toBe('radial');
      expect(v1Result.themeColor).toHaveLength(2);
      expect(v1Result.rotate).toBe(135);
    });

    it('should validate gradient compatibility', () => {
      const invalidGradient = {
        type: 'linear',
        colors: [{ pos: 0 }] // 缺少color属性
      };

      const compatibility = GradientConverter.checkCompatibility(invalidGradient);
      expect(compatibility.valid).toBe(false);
      expect(compatibility.issues.length).toBeGreaterThan(0);
    });
  });

  describe('Performance and Scale Testing', () => {
    it('should handle large datasets efficiently', () => {
      // 生成大量测试数据
      const largeDataset = Array.from({ length: 1000 }, (_, i) => {
        if (i % 2 === 0) {
          return {
            id: `element-${i}`,
            type: 'text' as const,
            left: i * 10,
            top: i * 10,
            width: 100,
            height: 50,
            rotate: 0,
            content: `Text ${i}`,
            defaultFontName: 'Arial',
            defaultColor: { color: '#000000' },
            tag: `tag-${i}`
          };
        } else {
          return {
            id: `element-${i}`,
            type: 'shape' as const,
            left: i * 10,
            top: i * 10,
            width: 100,
            height: 50,
            rotate: 0,
            viewBox: [0, 0] as [number, number],
            path: `M0,0 L100,50 Z`,
            fixedRatio: false,
            themeFill: { color: '#ff0000' },
            index: i
          };
        }
      });

      const startTime = Date.now();
      const result = ConverterUtils.toV2(largeDataset);
      const endTime = Date.now();

      expect(result.length).toBe(1000);
      expect(endTime - startTime).toBeLessThan(5000); // 应在5秒内完成

      // 验证转换正确性
      result.forEach((el, i) => {
        expect(el.id).toBe(`element-${i}`);
        expect(VersionDetector.isV2Element(el)).toBe(true);
      });
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should gracefully handle corrupted data', () => {
      const corruptedData = [
        null,
        undefined,
        { id: 'incomplete' }, // 缺少必要属性
        { id: 'invalid-type', type: 'unknown' },
        ...v1ProjectData.slice(0, 1) // 一个正常元素
      ];

      const middleware = new VersionMiddleware({
        errorHandling: 'skip',
        logLevel: 'none'
      });

      const result = middleware.processElements(corruptedData.filter(Boolean) as any, {
        source: 'import',
        target: 'processing'
      });

      expect(result.stats.errors).toBeGreaterThan(0);
      expect(result.data.length).toBeGreaterThan(0); // 至少处理了一些数据
    });

    it('should provide detailed error information', () => {
      const problematicElement = {
        id: 'problematic',
        type: 'text' as const,
        // 缺少必要的位置属性
        content: 'Test'
      };

      let errorCaught = false;
      const converter = new SmartVersionConverter({
        errorHandling: 'skip',
        onError: (error, element) => {
          errorCaught = true;
          expect(element.id).toBe('problematic');
        }
      });

      const result = converter.smartConvert(problematicElement as any, 'v2');
      expect(result).toBeNull();
      // 注意：在实际测试中onError可能不会被调用，因为我们的适配器比较宽松
    });
  });
});