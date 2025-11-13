# ppteditor-types 文档级别类型增强方案

## 📋 需求背景

**当前状态**: `@douglasdong/ppteditor-types` (v2.5.2) 只提供了元素级别（Element）和幻灯片级别（Slide）的类型定义。

**缺失内容**: 缺少文档级别（Presentation/Document）的类型定义，用于表示完整的 PPT 文档结构。

**使用场景**:
- pptx2pptistjson 项目需要文档级别类型来表示解析结果
- 其他 PPT 编辑器项目需要完整的文档结构类型
- 需要支持 V1/V2 两种文档格式

---

## 🎯 目标

在 `@douglasdong/ppteditor-types` 包中添加：

1. **V1 文档类型**（LegacyPresentation）- 向后兼容
2. **V2 文档类型**（Presentation）- 标准格式
3. **文档适配器** - V1/V2 转换工具
4. **文档验证器** - 类型验证工具

---

## 🏗️ 类型定义方案

### 1. 目录结构

```
ppteditor-types/
├── src/
│   ├── presentation/              # 新增：文档级别类型
│   │   ├── index.ts               # 导出文件
│   │   ├── presentation.ts        # V2 文档类型
│   │   ├── legacy-presentation.ts # V1 文档类型
│   │   ├── theme.ts               # 文档主题类型（扩展）
│   │   └── metadata.ts            # 文档元数据类型
│   ├── adapters/
│   │   ├── v1-v2-adapter.ts       # 现有适配器
│   │   └── presentation-adapter.ts # 新增：文档适配器
│   ├── utils/
│   │   └── presentation-validator.ts # 新增：文档验证器
│   └── index.ts                   # 主导出文件（需更新）
```

### 2. V1 文档类型（Legacy）

```typescript
// src/presentation/legacy-presentation.ts

import type { Slide } from '../slide/slide.js'

/**
 * V1 文档主题类型
 */
export interface LegacyPresentationTheme {
  /** 字体名称 */
  fontName: string

  /** 主题颜色映射 */
  themeColor?: Record<string, string>
}

/**
 * V1 文档元数据
 */
export interface LegacyPresentationMetadata {
  /** 文档标题 */
  title?: string

  /** 作者 */
  author?: string

  /** 创建时间 */
  created?: string

  /** 修改时间 */
  modified?: string

  /** 描述 */
  description?: string
}

/**
 * V1 文档类型（Legacy Presentation）
 *
 * 用于向后兼容，对应 backgroundFormat: "legacy"
 *
 * @example
 * ```typescript
 * const legacyDoc: LegacyPresentation = {
 *   width: 1280,
 *   height: 720,
 *   slides: [...],
 *   theme: {
 *     fontName: 'Arial',
 *     themeColor: { accent1: '#4472C4' }
 *   },
 *   title: 'My Presentation'
 * }
 * ```
 */
export interface LegacyPresentation {
  /** 画布宽度（points） */
  width: number

  /** 画布高度（points） */
  height: number

  /** 幻灯片数组 */
  slides: Slide[]

  /** 主题信息 */
  theme: LegacyPresentationTheme

  /** 文档标题 */
  title: string

  /** 元数据（可选） */
  metadata?: LegacyPresentationMetadata
}

/**
 * V1 文档类型别名（用于兼容不同命名习惯）
 */
export type LegacyDocument = LegacyPresentation
export type V1Presentation = LegacyPresentation
export type V1Document = LegacyPresentation
```

### 3. V2 文档类型（Standard）

```typescript
// src/presentation/presentation.ts

import type { Slide } from '../slide/slide.js'
import type { SlideTheme } from '../slide/theme.js'

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

  /** 作者 */
  author?: string

  /** 创建时间 */
  created?: string

  /** 修改时间 */
  modified?: string

  /** 描述 */
  description?: string
}

/**
 * V2 文档类型（Presentation）
 *
 * 标准格式，对应 backgroundFormat: "pptist"
 *
 * @example
 * ```typescript
 * const presentation: Presentation = {
 *   width: 1280,
 *   height: 720,
 *   slides: [...],
 *   theme: { ... },
 *   fileName: 'presentation.pptx',
 *   title: 'My Presentation',
 *   metadata: {
 *     version: '2.0',
 *     parsedAt: '2025-01-12T10:00:00.000Z'
 *   }
 * }
 * ```
 */
export interface Presentation {
  /** 画布宽度（points） */
  width: number

  /** 画布高度（points） */
  height: number

  /** 幻灯片数组 */
  slides: Slide[]

  /** 主题信息 */
  theme: SlideTheme

  /** 文件名 */
  fileName: string

  /** 文档标题 */
  title: string

  /** 文档元数据（可选） */
  metadata?: PresentationMetadata
}

/**
 * V2 文档类型别名
 */
export type Document = Presentation
export type V2Presentation = Presentation
export type V2Document = Presentation
export type PPTistPresentation = Presentation
```

### 4. 导出文件

```typescript
// src/presentation/index.ts

// V1 Legacy Types
export type {
  LegacyPresentation,
  LegacyDocument,
  V1Presentation,
  V1Document,
  LegacyPresentationTheme,
  LegacyPresentationMetadata
} from './legacy-presentation.js'

// V2 Standard Types
export type {
  Presentation,
  Document,
  V2Presentation,
  V2Document,
  PPTistPresentation,
  PresentationMetadata
} from './presentation.js'

// 统一导出（方便使用）
export type {
  Presentation as StandardPresentation,
  LegacyPresentation as CompatPresentation
} from './presentation.js'
```

### 5. 文档适配器

```typescript
// src/adapters/presentation-adapter.ts

import type { LegacyPresentation } from '../presentation/legacy-presentation.js'
import type { Presentation } from '../presentation/presentation.js'
import { V1ToV2Adapter, V2ToV1Adapter } from './v1-v2-adapter.js'

/**
 * V1 → V2 文档适配器
 */
export class LegacyPresentationToV2Adapter {
  /**
   * 将 V1 文档转换为 V2 文档
   */
  static convert(legacy: LegacyPresentation): Presentation {
    return {
      width: legacy.width,
      height: legacy.height,
      slides: legacy.slides.map(slide => ({
        ...slide,
        elements: slide.elements.map(el => V1ToV2Adapter.toV2(el))
      })),
      theme: {
        fontName: legacy.theme.fontName,
        themeColor: legacy.theme.themeColor
      },
      fileName: 'presentation.pptx',
      title: legacy.title,
      metadata: {
        version: '2.0',
        author: legacy.metadata?.author,
        created: legacy.metadata?.created,
        modified: legacy.metadata?.modified,
        description: legacy.metadata?.description
      }
    }
  }
}

/**
 * V2 → V1 文档适配器
 */
export class V2PresentationToLegacyAdapter {
  /**
   * 将 V2 文档转换为 V1 文档
   */
  static convert(presentation: Presentation): LegacyPresentation {
    return {
      width: presentation.width,
      height: presentation.height,
      slides: presentation.slides.map(slide => ({
        ...slide,
        elements: slide.elements.map(el => V2ToV1Adapter.toV1(el))
      })),
      theme: {
        fontName: presentation.theme.fontName,
        themeColor: presentation.theme.themeColor
      },
      title: presentation.title,
      metadata: {
        title: presentation.title,
        author: presentation.metadata?.author,
        created: presentation.metadata?.created,
        modified: presentation.metadata?.modified,
        description: presentation.metadata?.description
      }
    }
  }
}

/**
 * 自动检测并转换文档
 */
export class AutoPresentationAdapter {
  /**
   * 检测文档版本
   */
  static detectVersion(data: any): 'v1' | 'v2' | 'unknown' {
    if (!data || typeof data !== 'object') return 'unknown'

    // V2 特征：有 fileName 和 metadata.version
    if (data.fileName && data.metadata?.version === '2.0') {
      return 'v2'
    }

    // V1 特征：有 width/height 字段且有 title（V1 的 title 是必需的）
    if (typeof data.width === 'number' && typeof data.height === 'number' && typeof data.title === 'string') {
      return 'v1'
    }

    return 'unknown'
  }

  /**
   * 自动转换为 V2
   */
  static toV2(data: LegacyPresentation | Presentation): Presentation {
    const version = this.detectVersion(data)

    if (version === 'v2') {
      return data as Presentation
    }

    if (version === 'v1') {
      return LegacyPresentationToV2Adapter.convert(data as LegacyPresentation)
    }

    throw new Error('Cannot detect presentation version')
  }

  /**
   * 自动转换为 V1
   */
  static toV1(data: LegacyPresentation | Presentation): LegacyPresentation {
    const version = this.detectVersion(data)

    if (version === 'v1') {
      return data as LegacyPresentation
    }

    if (version === 'v2') {
      return V2PresentationToLegacyAdapter.convert(data as Presentation)
    }

    throw new Error('Cannot detect presentation version')
  }
}
```

### 6. 文档验证器

```typescript
// src/utils/presentation-validator.ts

import type { LegacyPresentation } from '../presentation/legacy-presentation.js'
import type { Presentation } from '../presentation/presentation.js'

/**
 * V1 文档验证器
 */
export class LegacyPresentationValidator {
  /**
   * 验证 V1 文档结构
   */
  static validate(data: unknown): data is LegacyPresentation {
    if (!data || typeof data !== 'object') return false

    const doc = data as any

    // 必需字段检查
    if (typeof doc.width !== 'number') return false
    if (typeof doc.height !== 'number') return false
    if (!Array.isArray(doc.slides)) return false
    if (!doc.theme || typeof doc.theme !== 'object') return false
    if (typeof doc.theme.fontName !== 'string') return false
    if (typeof doc.title !== 'string') return false

    // 幻灯片结构检查
    for (const slide of doc.slides) {
      if (!slide || typeof slide !== 'object') return false
      if (typeof slide.id !== 'string') return false
      if (!Array.isArray(slide.elements)) return false
    }

    return true
  }

  /**
   * 验证并抛出错误
   */
  static validateOrThrow(data: unknown): asserts data is LegacyPresentation {
    if (!this.validate(data)) {
      throw new Error('Invalid LegacyPresentation structure')
    }
  }
}

/**
 * V2 文档验证器
 */
export class PresentationValidator {
  /**
   * 验证 V2 文档结构
   */
  static validate(data: unknown): data is Presentation {
    if (!data || typeof data !== 'object') return false

    const doc = data as any

    // 必需字段检查
    if (typeof doc.width !== 'number') return false
    if (typeof doc.height !== 'number') return false
    if (!Array.isArray(doc.slides)) return false
    if (!doc.theme || typeof doc.theme !== 'object') return false
    if (typeof doc.fileName !== 'string') return false
    if (typeof doc.title !== 'string') return false

    // 幻灯片结构检查
    for (const slide of doc.slides) {
      if (!slide || typeof slide !== 'object') return false
      if (typeof slide.id !== 'string') return false
      if (!Array.isArray(slide.elements)) return false
    }

    return true
  }

  /**
   * 验证并抛出错误
   */
  static validateOrThrow(data: unknown): asserts data is Presentation {
    if (!this.validate(data)) {
      throw new Error('Invalid Presentation structure')
    }
  }
}
```

### 7. 更新主导出文件

```typescript
// src/index.ts（在现有基础上添加）

// ===== 文档级别类型导出（新增）=====
export * from './presentation/index.js';

// ===== 文档适配器导出（新增）=====
export {
  LegacyPresentationToV2Adapter,
  V2PresentationToLegacyAdapter,
  AutoPresentationAdapter
} from './adapters/presentation-adapter.js';

// ===== 文档验证器导出（新增）=====
export {
  LegacyPresentationValidator,
  PresentationValidator
} from './utils/presentation-validator.js';

// ===== Namespace Exports（更新）=====
import * as PresentationModule from './presentation/index.js';
import * as PresentationAdaptersModule from './adapters/presentation-adapter.js';
import * as PresentationValidatorsModule from './utils/presentation-validator.js';

// 文档类型分组导出
export const PresentationTypes = {
  Legacy: PresentationModule,
  Adapters: PresentationAdaptersModule,
  Validators: PresentationValidatorsModule
};

// 现有导出保持不变...
```

---

## 🧪 测试用例

### 1. V1 文档类型测试

```typescript
// tests/presentation/legacy-presentation.test.ts

import { describe, it, expect } from 'vitest'
import type { LegacyPresentation } from '../../src/presentation/legacy-presentation.js'
import { LegacyPresentationValidator } from '../../src/utils/presentation-validator.js'

describe('LegacyPresentation', () => {
  it('应该创建有效的 V1 文档', () => {
    const doc: LegacyPresentation = {
      width: 1280,
      height: 720,
      slides: [
        {
          id: 'slide-1',
          elements: []
        }
      ],
      theme: {
        fontName: 'Arial'
      },
      title: 'Test Presentation'
    }

    expect(LegacyPresentationValidator.validate(doc)).toBe(true)
  })

  it('应该拒绝无效的 V1 文档', () => {
    const invalidDoc = {
      width: 1280,
      // 缺少 height
      slides: [],
      theme: {},
      title: 'Test'
    }

    expect(LegacyPresentationValidator.validate(invalidDoc)).toBe(false)
  })
})
```

### 2. V2 文档类型测试

```typescript
// tests/presentation/presentation.test.ts

import { describe, it, expect } from 'vitest'
import type { Presentation } from '../../src/presentation/presentation.js'
import { PresentationValidator } from '../../src/utils/presentation-validator.js'

describe('Presentation (V2)', () => {
  it('应该创建有效的 V2 文档', () => {
    const doc: Presentation = {
      width: 1280,
      height: 720,
      slides: [
        {
          id: 'slide-1',
          elements: []
        }
      ],
      theme: {
        fontName: 'Arial'
      },
      fileName: 'test.pptx',
      title: 'Test Presentation',
      metadata: {
        version: '2.0'
      }
    }

    expect(PresentationValidator.validate(doc)).toBe(true)
  })
})
```

### 3. 文档适配器测试

```typescript
// tests/adapters/presentation-adapter.test.ts

import { describe, it, expect } from 'vitest'
import { LegacyPresentationToV2Adapter, AutoPresentationAdapter } from '../../src/adapters/presentation-adapter.js'
import type { LegacyPresentation } from '../../src/presentation/legacy-presentation.js'

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

    expect(v2Doc.width).toBe(1280)
    expect(v2Doc.height).toBe(720)
    expect(v2Doc.metadata?.version).toBe('2.0')
    expect(v2Doc.title).toBe('Test')
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
      width: 1280,
      height: 720,
      slides: [],
      theme: { fontName: 'Arial' },
      fileName: 'test.pptx',
      title: 'Test',
      metadata: { version: '2.0' }
    }

    expect(AutoPresentationAdapter.detectVersion(v1Doc)).toBe('v1')
    expect(AutoPresentationAdapter.detectVersion(v2Doc)).toBe('v2')
  })
})
```

---

## 📦 package.json 更新

```json
{
  "name": "@douglasdong/ppteditor-types",
  "version": "2.6.0",
  "description": "PPTEditor 标准化类型定义库（支持文档级别类型）- 增强版",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "default": "./dist/index.js"
    },
    "./presentation": {
      "types": "./dist/presentation/index.d.ts",
      "import": "./dist/presentation/index.js"
    },
    "./presentation/legacy": {
      "types": "./dist/presentation/legacy-presentation.d.ts",
      "import": "./dist/presentation/legacy-presentation.js"
    },
    "./presentation/v2": {
      "types": "./dist/presentation/presentation.d.ts",
      "import": "./dist/presentation/presentation.js"
    },
    "./adapters/presentation": {
      "types": "./dist/adapters/presentation-adapter.d.ts",
      "import": "./dist/adapters/presentation-adapter.js"
    },
    "./validators/presentation": {
      "types": "./dist/utils/presentation-validator.d.ts",
      "import": "./dist/utils/presentation-validator.js"
    }
  }
}
```

---

## 📚 使用示例

### 基础使用

```typescript
import type { Presentation, LegacyPresentation } from '@douglasdong/ppteditor-types';

// V2 文档（推荐）
const v2Doc: Presentation = {
  width: 1280,
  height: 720,
  slides: [...],
  theme: { fontName: 'Arial' },
  fileName: 'presentation.pptx',
  title: 'My Presentation',
  metadata: {
    version: '2.0'
  }
};

// V1 文档（兼容）
const v1Doc: LegacyPresentation = {
  width: 1280,
  height: 720,
  slides: [...],
  theme: { fontName: 'Arial' },
  title: 'My Presentation'
};
```

### 使用适配器

```typescript
import {
  LegacyPresentationToV2Adapter,
  AutoPresentationAdapter
} from '@douglasdong/ppteditor-types/adapters/presentation';

// V1 → V2
const v2Doc = LegacyPresentationToV2Adapter.convert(v1Doc);

// 自动转换
const autoV2 = AutoPresentationAdapter.toV2(unknownDoc);
```

### 使用验证器

```typescript
import {
  PresentationValidator,
  LegacyPresentationValidator
} from '@douglasdong/ppteditor-types/validators/presentation';

// 验证 V2 文档
if (PresentationValidator.validate(data)) {
  // TypeScript 知道 data 是 Presentation 类型
  console.log(data.title);
}

// 验证并抛出错误
PresentationValidator.validateOrThrow(data);
```

---

## 🚀 发布流程

### 1. 版本规划

- **v2.6.0** - 添加文档级别类型（Breaking Change: 无）
- 向后兼容，不影响现有用户

### 2. 发布清单

- [ ] 代码实现完成
- [ ] 测试用例通过（`npm test`）
- [ ] 类型检查通过（`npm run lint`）
- [ ] 文档更新（README.md）
- [ ] CHANGELOG.md 更新
- [ ] package.json 版本号更新

### 3. 发布命令

```bash
# 1. 构建
npm run build

# 2. 测试
npm test

# 3. 发布
npm publish

# 4. 打 tag
git tag v2.6.0
git push origin v2.6.0
```

---

## 📝 CHANGELOG 示例

```markdown
# Changelog

## [2.6.0] - 2025-01-12

### Added

- ✨ 新增文档级别类型定义
  - `Presentation` (V2 标准文档类型，扁平结构)
  - `LegacyPresentation` (V1 兼容文档类型)
  - `PresentationMetadata` (文档元数据)

- ✨ 新增文档适配器
  - `LegacyPresentationToV2Adapter` (V1 → V2 转换)
  - `V2PresentationToLegacyAdapter` (V2 → V1 转换)
  - `AutoPresentationAdapter` (自动检测转换)

- ✨ 新增文档验证器
  - `PresentationValidator` (V2 文档验证)
  - `LegacyPresentationValidator` (V1 文档验证)

### Changed

- 📦 导出点新增 `./presentation`, `./adapters/presentation`, `./validators/presentation`

### Notes

- 完全向后兼容，不影响现有用户
- 元素和幻灯片级别类型保持不变
```

---

## 🔗 相关链接

- **仓库**: https://github.com/Xeonice/ppteditor-types
- **NPM**: https://www.npmjs.com/package/@douglasdong/ppteditor-types
- **使用项目**: pptx2pptistjson

---

## ✅ 验收标准

### 类型定义
- [ ] `Presentation` 类型正确定义
- [ ] `LegacyPresentation` 类型正确定义
- [ ] 所有字段有完整的 JSDoc 注释

### 适配器
- [ ] V1 → V2 转换正确
- [ ] V2 → V1 转换正确
- [ ] 自动检测版本准确

### 验证器
- [ ] V1 验证逻辑正确
- [ ] V2 验证逻辑正确
- [ ] 类型守卫工作正常

### 测试
- [ ] 所有测试用例通过
- [ ] 类型检查无错误
- [ ] 覆盖率 ≥ 80%

### 文档
- [ ] README 包含使用示例
- [ ] CHANGELOG 完整
- [ ] 类型导出正确

---

**文档版本**: 1.0.0
**创建日期**: 2025-01-12
**目标版本**: @douglasdong/ppteditor-types v2.6.0
