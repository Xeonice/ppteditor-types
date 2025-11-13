# PR #12 必需修改清单

## 📋 修改要求

**目标**: 将 PR #12 的 `Presentation` (V2) 类型结构修改为与 pptx2pptistjson 现有实现一致

**原因**: pptx2pptistjson 已有大量代码基于扁平结构（`width`/`height`/`title` 在顶层），PR #12 必须与之保持一致

---

## 🔴 核心结构差异

### 当前 PR #12 的结构（需要修改）

```typescript
// ❌ 当前 PR #12 的 Presentation (V2)
interface Presentation {
  size: {                    // ❌ 问题 1: 封装为对象
    width: number;
    height: number;
    aspectRatio: string;
  };
  slides: Slide[];
  theme: PresentationTheme;
  fileName: string;
  metadata: {                // ❌ 问题 2: metadata 必需
    version: '2.0';
    title?: string;          // ❌ 问题 3: title 在 metadata 中
    author?: string;
    created?: string;
    slideCount: number;
    elementCount: number;
    // ...
  };
}
```

### 要求的结构（必须改成这样）

```typescript
// ✅ 要求的 Presentation (V2) 结构
interface Presentation {
  width: number;             // ✅ 必需：顶层字段
  height: number;            // ✅ 必需：顶层字段
  slides: Slide[];
  theme: PresentationTheme;
  title: string;             // ✅ 必需：顶层字段
  fileName: string;
  metadata?: {               // ✅ 必需：可选字段
    version: '2.0';
    parsedAt?: string;
    features?: string[];
    author?: string;
    created?: string;
    modified?: string;
    description?: string;
  };
}
```

---

## 📝 具体修改清单

### 1. 修改类型定义文件

#### 文件: `src/presentation/presentation.ts`

**修改位置 1: PresentationSize 接口（删除）**

```diff
- /**
-  * 文档尺寸
-  */
- export interface PresentationSize {
-   /** 宽度（points） */
-   width: number
-
-   /** 高度（points） */
-   height: number
-
-   /** 宽高比 */
-   aspectRatio?: string
- }
```

**理由**: 不需要单独的 Size 对象，width/height 直接放在顶层

---

**修改位置 2: Presentation 接口**

```diff
 /**
  * V2 文档类型（Presentation）
  *
  * 标准格式，对应 backgroundFormat: "pptist"
  */
 export interface Presentation {
-   /** 文档尺寸 */
-   size: PresentationSize
+   /** 画布宽度（points） */
+   width: number
+
+   /** 画布高度（points） */
+   height: number

   /** 幻灯片数组 */
   slides: Slide[]

   /** 主题信息 */
   theme: SlideTheme

+   /** 文档标题 */
+   title: string

   /** 文件名 */
   fileName: string

-   /** 文档元数据 */
-   metadata: PresentationMetadata
+   /** 文档元数据（可选） */
+   metadata?: PresentationMetadata
 }
```

---

**修改位置 3: PresentationMetadata 接口**

```diff
 /**
  * V2 文档元数据
  */
 export interface PresentationMetadata {
   /** 格式版本 */
   version: '2.0'

   /** 解析时间 */
   parsedAt?: string

   /** 使用的功能特性 */
   features?: string[]

-   /** 文档标题 */
-   title?: string
-
   /** 作者 */
   author?: string

   /** 创建时间 */
   created?: string

   /** 修改时间 */
   modified?: string

   /** 描述 */
   description?: string
-
-   /** 幻灯片总数 */
-   slideCount?: number
-
-   /** 元素总数 */
-   elementCount?: number
 }
```

**理由**:
1. `title` 移到 Presentation 顶层
2. 删除 `slideCount` 和 `elementCount`（可以通过 `slides.length` 计算）

---

#### 文件: `src/presentation/index.ts`

**修改位置: 删除 PresentationSize 导出**

```diff
 // V2 Standard Types
 export type {
   Presentation,
   Document,
   V2Presentation,
   V2Document,
   PPTistPresentation,
   PresentationMetadata,
-   PresentationSize
 } from './presentation.js'
```

---

### 2. 修改适配器文件

#### 文件: `src/adapters/presentation-adapter.ts`

**修改位置 1: LegacyPresentationToV2Adapter.convert()**

```diff
 export class LegacyPresentationToV2Adapter {
   /**
    * 将 V1 文档转换为 V2 文档
    */
   static convert(legacy: LegacyPresentation): Presentation {
     return {
-       size: {
-         width: legacy.width,
-         height: legacy.height,
-         aspectRatio: this.calculateAspectRatio(legacy.width, legacy.height)
-       },
+       width: legacy.width,
+       height: legacy.height,
       slides: legacy.slides.map(slide => ({
         ...slide,
         elements: slide.elements.map(el => V1ToV2Adapter.toV2(el))
       })),
       theme: {
         fontName: legacy.theme.fontName,
         themeColor: legacy.theme.themeColor
       },
+       title: legacy.title,
       fileName: 'presentation.pptx',
       metadata: {
         version: '2.0',
-         title: legacy.title,
         author: legacy.metadata?.author,
         created: legacy.metadata?.created,
         modified: legacy.metadata?.modified,
-         description: legacy.metadata?.description,
-         slideCount: legacy.slides.length,
-         elementCount: legacy.slides.reduce(
-           (sum, slide) => sum + slide.elements.length,
-           0
-         )
+         description: legacy.metadata?.description
       }
     }
   }
-
-   private static calculateAspectRatio(width: number, height: number): string {
-     const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
-     const divisor = gcd(width, height)
-     return `${width / divisor}:${height / divisor}`
-   }
 }
```

---

**修改位置 2: V2PresentationToLegacyAdapter.convert()**

```diff
 export class V2PresentationToLegacyAdapter {
   /**
    * 将 V2 文档转换为 V1 文档
    */
   static convert(presentation: Presentation): LegacyPresentation {
     return {
-       width: presentation.size.width,
-       height: presentation.size.height,
+       width: presentation.width,
+       height: presentation.height,
       slides: presentation.slides.map(slide => ({
         ...slide,
         elements: slide.elements.map(el => V2ToV1Adapter.toV1(el))
       })),
       theme: {
         fontName: presentation.theme.fontName,
         themeColor: presentation.theme.themeColor
       },
-       title: presentation.metadata.title || 'Presentation',
+       title: presentation.title,
       metadata: {
-         title: presentation.metadata.title,
+         title: presentation.title,
         author: presentation.metadata?.author,
         created: presentation.metadata?.created,
         modified: presentation.metadata?.modified,
         description: presentation.metadata?.description
       }
     }
   }
 }
```

---

**修改位置 3: AutoPresentationAdapter.detectVersion()**

```diff
 export class AutoPresentationAdapter {
   /**
    * 检测文档版本
    */
   static detectVersion(data: any): 'v1' | 'v2' | 'unknown' {
     if (!data || typeof data !== 'object') return 'unknown'

-     // V2 特征：有 size 对象和 metadata.version
-     if (data.size && typeof data.size === 'object' && data.metadata?.version === '2.0') {
+     // V2 特征：有 fileName 字段和 metadata.version
+     if (typeof data.fileName === 'string' && data.metadata?.version === '2.0') {
       return 'v2'
     }

-     // V1 特征：有 width/height 字段且没有 size
-     if (typeof data.width === 'number' && typeof data.height === 'number' && !data.size) {
+     // V1 特征：有 width/height/title 字段但没有 fileName
+     if (typeof data.width === 'number' && typeof data.height === 'number' && !data.fileName) {
       return 'v1'
     }

     return 'unknown'
   }
 }
```

---

### 3. 修改验证器文件

#### 文件: `src/utils/presentation-validator.ts`

**修改位置: PresentationValidator.validate()**

```diff
 export class PresentationValidator {
   /**
    * 验证 V2 文档结构
    */
   static validate(data: unknown): data is Presentation {
     if (!data || typeof data !== 'object') return false

     const doc = data as any

     // 必需字段检查
-     if (!doc.size || typeof doc.size !== 'object') return false
-     if (typeof doc.size.width !== 'number') return false
-     if (typeof doc.size.height !== 'number') return false
+     if (typeof doc.width !== 'number') return false
+     if (typeof doc.height !== 'number') return false
     if (!Array.isArray(doc.slides)) return false
     if (!doc.theme || typeof doc.theme !== 'object') return false
+     if (typeof doc.title !== 'string') return false
     if (typeof doc.fileName !== 'string') return false
-     if (!doc.metadata || typeof doc.metadata !== 'object') return false
-     if (doc.metadata.version !== '2.0') return false
+
+     // metadata 是可选的，如果存在则验证
+     if (doc.metadata) {
+       if (typeof doc.metadata !== 'object') return false
+       if (doc.metadata.version && doc.metadata.version !== '2.0') return false
+     }

     // 幻灯片结构检查
     for (const slide of doc.slides) {
       if (!slide || typeof slide !== 'object') return false
       if (typeof slide.id !== 'string') return false
       if (!Array.isArray(slide.elements)) return false
     }

     return true
   }
 }
```

---

### 4. 更新测试文件

#### 文件: `tests/presentation/presentation.test.ts`

**修改位置: V2 文档创建测试**

```diff
 describe('Presentation (V2)', () => {
   it('应该创建有效的 V2 文档', () => {
     const doc: Presentation = {
-       size: {
-         width: 1280,
-         height: 720,
-         aspectRatio: '16:9'
-       },
+       width: 1280,
+       height: 720,
       slides: [
         {
           id: 'slide-1',
           elements: []
         }
       ],
       theme: {
         fontName: 'Arial'
       },
+       title: 'Test Presentation',
       fileName: 'test.pptx',
       metadata: {
         version: '2.0',
-         title: 'Test Presentation'
       }
     }

     expect(PresentationValidator.validate(doc)).toBe(true)
   })
 })
```

---

#### 文件: `tests/adapters/presentation-adapter.test.ts`

**修改位置: V1 → V2 转换测试**

```diff
 describe('PresentationAdapter', () => {
   it('应该将 V1 文档转换为 V2', () => {
     const v1Doc: LegacyPresentation = {
       width: 1280,
       height: 720,
       slides: [],
       theme: { fontName: 'Arial' },
       title: 'Test'
     }

     const v2Doc = LegacyPresentationToV2Adapter.convert(v1Doc)

-     expect(v2Doc.size.width).toBe(1280)
-     expect(v2Doc.size.height).toBe(720)
-     expect(v2Doc.size.aspectRatio).toBe('16:9')
+     expect(v2Doc.width).toBe(1280)
+     expect(v2Doc.height).toBe(720)
+     expect(v2Doc.title).toBe('Test')
     expect(v2Doc.metadata.version).toBe('2.0')
-     expect(v2Doc.metadata.title).toBe('Test')
   })

   it('应该自动检测文档版本', () => {
     const v1Doc = {
       width: 1280,
       height: 720,
       slides: [],
       theme: { fontName: 'Arial' },
       title: 'Test'
     }

     const v2Doc = {
-       size: { width: 1280, height: 720 },
+       width: 1280,
+       height: 720,
       slides: [],
       theme: { fontName: 'Arial' },
+       title: 'Test',
       fileName: 'test.pptx',
-       metadata: { version: '2.0', title: 'Test' }
+       metadata: { version: '2.0' }
     }

     expect(AutoPresentationAdapter.detectVersion(v1Doc)).toBe('v1')
     expect(AutoPresentationAdapter.detectVersion(v2Doc)).toBe('v2')
   })
 })
```

---

### 5. 更新文档

#### 文件: `PRESENTATION_TYPES_PROPOSAL.md`

**需要更新所有示例代码中的 Presentation 结构**

示例修改：

```diff
 ```typescript
 const presentation: Presentation = {
-   size: { width: 1280, height: 720 },
+   width: 1280,
+   height: 720,
   slides: [...],
   theme: { ... },
+   title: 'My Presentation',
   fileName: 'presentation.pptx',
   metadata: {
     version: '2.0',
-     title: 'My Presentation',
     parsedAt: '2025-01-12T10:00:00.000Z'
   }
 }
 ```
```

---

### 6. 更新 package.json 示例（可选）

如果 README.md 中有使用示例，也需要更新：

```diff
 import type { Presentation } from '@douglasdong/ppteditor-types';

 const doc: Presentation = {
-   size: { width: 1280, height: 720 },
+   width: 1280,
+   height: 720,
   slides: [...],
   theme: {...},
+   title: 'My Presentation',
   fileName: 'presentation.pptx'
 };
```

---

## 📋 修改文件清单

| 文件 | 修改类型 | 行数变化 |
|------|---------|---------|
| `src/presentation/presentation.ts` | 类型定义 | -20 / +10 |
| `src/presentation/index.ts` | 导出更新 | -1 |
| `src/adapters/presentation-adapter.ts` | 逻辑修改 | -25 / +8 |
| `src/utils/presentation-validator.ts` | 验证逻辑 | -5 / +7 |
| `tests/presentation/presentation.test.ts` | 测试更新 | -6 / +4 |
| `tests/adapters/presentation-adapter.test.ts` | 测试更新 | -8 / +7 |
| `PRESENTATION_TYPES_PROPOSAL.md` | 文档更新 | ~20 处 |
| **总计** | | **约 100 行** |

---

## ✅ 验收标准

修改完成后，必须满足：

### 1. 类型结构验证

```typescript
// ✅ 正确的 V2 类型
const v2: Presentation = {
  width: 1280,           // ✅ 顶层
  height: 720,           // ✅ 顶层
  title: "My PPT",       // ✅ 顶层
  slides: [],
  theme: { fontName: 'Arial' },
  fileName: "test.pptx"
  // metadata 可选
};

// ❌ 不应该编译通过
const wrong: Presentation = {
  size: { width: 1280, height: 720 },  // ❌ 不应该有 size
  // ...
};
```

### 2. 适配器正确性

```typescript
const v1: LegacyPresentation = {
  width: 1280,
  height: 720,
  title: "Test",
  slides: [],
  theme: { fontName: 'Arial' }
};

const v2 = LegacyPresentationToV2Adapter.convert(v1);

// ✅ 断言
expect(v2.width).toBe(1280);        // 不是 v2.size.width
expect(v2.height).toBe(720);        // 不是 v2.size.height
expect(v2.title).toBe("Test");      // 不是 v2.metadata.title
expect(v2.fileName).toBeDefined();
```

### 3. 版本检测正确性

```typescript
const v2Data = {
  width: 1280,
  height: 720,
  title: "Test",
  fileName: "test.pptx",
  slides: [],
  metadata: { version: '2.0' }
};

expect(AutoPresentationAdapter.detectVersion(v2Data)).toBe('v2');
```

### 4. 测试全部通过

```bash
npm test
# 所有测试（包括新增的）必须通过
```

---

## 🔗 参考对比

### V1 格式（无需修改）✅

```typescript
interface LegacyPresentation {
  width: number;
  height: number;
  slides: Slide[];
  theme: LegacyPresentationTheme;
  title: string;
  metadata?: LegacyPresentationMetadata;
}
```

### V2 格式修改前后对比

**修改前（当前 PR #12）❌**
```typescript
interface Presentation {
  size: { width, height, aspectRatio };  // ❌ 对象封装
  slides: Slide[];
  theme: PresentationTheme;
  fileName: string;
  metadata: {                             // ❌ 必需
    version: '2.0';
    title?: string;                       // ❌ 在 metadata 中
    slideCount: number;
    elementCount: number;
  };
}
```

**修改后（要求）✅**
```typescript
interface Presentation {
  width: number;                          // ✅ 顶层
  height: number;                         // ✅ 顶层
  slides: Slide[];
  theme: PresentationTheme;
  title: string;                          // ✅ 顶层
  fileName: string;
  metadata?: {                            // ✅ 可选
    version: '2.0';
    parsedAt?: string;
    features?: string[];
    author?: string;
  };
}
```

---

## 📞 联系信息

**提交给**: PR #12 作者 @Xeonice
**相关项目**: pptx2pptistjson
**紧急程度**: 高（阻塞后续集成）

---

## 🔄 后续流程

1. **提交修改请求** → PR 作者
2. **等待修改完成** → 预计 0.5-1 天
3. **验证修改** → pptx2pptistjson 团队
4. **合并 PR** → 发布 v2.6.0
5. **开始集成** → pptx2pptistjson 项目

---

**文档创建日期**: 2025-01-12
**文档版本**: 1.0
**状态**: 待提交给 PR 作者
