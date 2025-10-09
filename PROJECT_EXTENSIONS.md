# 项目扩展类型使用指南

本文档介绍如何使用 `ppteditor-types` 库的项目扩展类型（Project Extensions）。

## 概述

项目扩展类型提供了基于标准 `Slide` 类型的增强版本，专门用于支持 `frontend-new-ppt` 项目的特定需求。这些扩展类型在保持与标准库兼容的同时，添加了项目特有的字段和功能。

相关文档：
- [类型差异详细分析](./SLIDE_TYPE_DIFFERENCES.md)
- [标准类型定义](./src/slide/slide.ts)

## 安装

```bash
npm install @douglasdong/ppteditor-types
```

## 快速开始

### 基础导入

```typescript
// 方式 1: 从主包导入
import type { ProjectSlide, ProjectSlideBackground, ColorConfig } from '@douglasdong/ppteditor-types'

// 方式 2: 从扩展子包导入
import type { ProjectSlide, ProjectSlideBackground } from '@douglasdong/ppteditor-types/extensions'

// 方式 3: 使用命名空间
import { ProjectExtensions } from '@douglasdong/ppteditor-types'
type Slide = ProjectExtensions.ProjectSlide
```

## 核心类型

### 1. ProjectSlideBackground

项目扩展的背景类型，支持主题色系统。

```typescript
import type { ProjectSlideBackground, ColorConfig } from '@douglasdong/ppteditor-types'

// 纯色背景（支持主题色）
const solidBg: ProjectSlideBackground = {
  type: 'solid',
  themeColor: {
    color: '#FFFFFF',
    themeColor: {
      color: '#FFFFFF',
      type: 'accent1'
    },
    opacity: 0.9
  }
}

// 图片背景
const imageBg: ProjectSlideBackground = {
  type: 'image',
  image: 'https://example.com/image.jpg',
  imageSize: 'cover'
}

// 渐变背景
const gradientBg: ProjectSlideBackground = {
  type: 'gradient',
  gradientType: 'linear',
  gradientColor: [
    { color: '#FF0000' },
    { color: '#0000FF' }
  ],
  gradientRotate: 90
}
```

### 2. ProjectSlide

项目扩展的幻灯片类型，包含标准字段和项目特有字段。

```typescript
import type { ProjectSlide } from '@douglasdong/ppteditor-types'

// 基础幻灯片
const slide: ProjectSlide = {
  // 标准字段
  id: 'slide-1',
  elements: [],
  notes: [],
  remark: 'This is a remark',
  animations: [],
  turningMode: 'fade',

  // 项目扩展字段
  pageId: 'page-123',
  tag: 'content',
  aiImage: true,
  aiImageStatus: 'success',
  fillPageType: 1,

  // 项目扩展的背景
  background: {
    type: 'solid',
    themeColor: {
      color: '#F5F5F5'
    }
  }
}
```

### 3. ProjectSlideList

项目特有的列表页类型。

```typescript
import type { ProjectSlideList } from '@douglasdong/ppteditor-types'

const listSlide: ProjectSlideList = {
  // 标准字段
  id: 'slide-1',
  elements: [],

  // 列表页必需字段
  tag: 'list',
  payType: 'free',
  listFlag: 'template-list-1',
  autoFill: true,

  // 可选扩展字段
  listCount: 10,
  pageId: 'page-456'
}
```

### 4. ColorConfig

支持主题色系统的颜色配置类型。

```typescript
import type { ColorConfig } from '@douglasdong/ppteditor-types'

// 简单颜色
const simpleColor: ColorConfig = {
  color: '#FF0000'
}

// 主题色
const themeColor: ColorConfig = {
  color: '#FF0000',
  themeColor: {
    color: '#FF0000',
    type: 'accent1'
  },
  opacity: 0.8,
  colorIndex: 1
}
```

### 5. PageTag

页面类型标签枚举。

```typescript
import type { PageTag } from '@douglasdong/ppteditor-types'

const tags: PageTag[] = [
  'title',      // 标题页
  'catalogue',  // 目录页
  'chapter',    // 章节页
  'content',    // 内容页
  'end',        // 结束页
  'list'        // 列表页（项目特有）
]
```

## 使用场景

### 场景 1: 创建内容页

```typescript
import type { ProjectSlide } from '@douglasdong/ppteditor-types'

const contentSlide: ProjectSlide = {
  id: 'content-1',
  elements: [
    {
      type: 'text',
      id: 'text-1',
      left: 100,
      top: 100,
      width: 400,
      height: 200,
      rotate: 0,
      content: 'Hello World'
    }
  ],
  tag: 'content',
  background: {
    type: 'solid',
    themeColor: {
      color: '#FFFFFF'
    }
  }
}
```

### 场景 2: 创建列表页（模板库）

```typescript
import type { ProjectSlideList } from '@douglasdong/ppteditor-types'

const templateListSlide: ProjectSlideList = {
  id: 'list-1',
  elements: [],
  tag: 'list',
  payType: 'free',
  listFlag: 'business-template-list',
  autoFill: true,
  listCount: 20,
  background: {
    type: 'gradient',
    gradientType: 'linear',
    gradientColor: [
      { color: '#4A90E2' },
      { color: '#7B68EE' }
    ],
    gradientRotate: 45
  }
}
```

### 场景 3: AI 图片生成

```typescript
import type { ProjectSlide } from '@douglasdong/ppteditor-types'

const aiSlide: ProjectSlide = {
  id: 'ai-slide-1',
  elements: [
    {
      type: 'image',
      id: 'ai-image-1',
      left: 0,
      top: 0,
      width: 800,
      height: 600,
      rotate: 0,
      src: 'https://ai-generated.com/image.jpg'
    }
  ],
  tag: 'content',
  aiImage: true,
  aiImageStatus: 'pending'  // 'pending' | 'success' | 'failed'
}
```

### 场景 4: 类型守卫和类型区分

```typescript
import type { ProjectSlide, ProjectSlideList } from '@douglasdong/ppteditor-types'

function handleSlide(slide: ProjectSlide) {
  // 区分列表页和普通页
  if (slide.tag === 'list' && 'payType' in slide) {
    // TypeScript 会推断 slide 为 ProjectSlideList
    const listSlide = slide as ProjectSlideList
    console.log('List slide:', listSlide.payType, listSlide.autoFill)
  } else {
    // 普通幻灯片
    console.log('Regular slide:', slide.tag)
  }
}
```

## 与标准类型的兼容性

项目扩展类型继承自标准 `Slide` 类型，因此可以使用所有标准字段：

```typescript
import type { ProjectSlide, Slide } from '@douglasdong/ppteditor-types'

const projectSlide: ProjectSlide = {
  id: 'slide-1',
  elements: [],
  // 标准字段完全兼容
  notes: [{
    id: 'note-1',
    content: 'Note content',
    time: Date.now(),
    user: 'user@example.com'
  }],
  remark: 'This is a remark',
  animations: [],
  turningMode: 'slideX',
  // 项目扩展字段
  pageId: 'page-1',
  tag: 'content'
}

// 访问标准字段
console.log(projectSlide.id)          // ✅ 兼容
console.log(projectSlide.notes)       // ✅ 兼容
console.log(projectSlide.turningMode) // ✅ 兼容

// 访问扩展字段
console.log(projectSlide.pageId)      // ✅ 项目特有
console.log(projectSlide.tag)         // ✅ 项目特有
```

## 关键差异说明

### 1. Background 字段

**标准库**使用嵌套对象结构：
```typescript
background: {
  type: 'image',
  image: {
    src: 'url',
    size: 'cover'
  }
}
```

**项目扩展**使用扁平结构：
```typescript
background: {
  type: 'image',
  image: 'url',
  imageSize: 'cover'
}
```

### 2. 颜色系统

**标准库**使用简单字符串：
```typescript
background: {
  type: 'solid',
  color: '#FFFFFF'
}
```

**项目扩展**使用 ColorConfig 对象：
```typescript
background: {
  type: 'solid',
  themeColor: {
    color: '#FFFFFF',
    themeColor: {
      color: '#FFFFFF',
      type: 'accent1'
    }
  }
}
```

### 3. 渐变色数量

- **标准库**：支持多色渐变（`GradientColor[]`）
- **项目扩展**：仅支持双色渐变（`[ColorConfig, ColorConfig]`）

## TypeScript 类型检查

项目扩展类型提供完整的 TypeScript 类型支持：

```typescript
import type { ProjectSlide, PageTag } from '@douglasdong/ppteditor-types'

// ✅ 正确：tag 为有效值
const validSlide: ProjectSlide = {
  id: 'slide-1',
  elements: [],
  tag: 'content'
}

// ❌ 错误：tag 为无效值
const invalidSlide: ProjectSlide = {
  id: 'slide-1',
  elements: [],
  tag: 'invalid-tag'  // TypeScript 报错
}

// ✅ 正确：列表页包含必需字段
const listSlide: ProjectSlide = {
  id: 'slide-1',
  elements: [],
  tag: 'list',
  payType: 'free',
  listFlag: 'flag',
  autoFill: true
}

// ❌ 错误：列表页缺少必需字段
const incompleteListSlide: ProjectSlide = {
  id: 'slide-1',
  elements: [],
  tag: 'list'
  // 缺少 payType, listFlag, autoFill - TypeScript 报错
}
```

## 最佳实践

### 1. 使用类型别名简化代码

```typescript
import type {
  ProjectSlide as Slide,
  ProjectSlideBackground as Background,
  ColorConfig as Color
} from '@douglasdong/ppteditor-types'

const slide: Slide = { /* ... */ }
const bg: Background = { /* ... */ }
const color: Color = { /* ... */ }
```

### 2. 创建工厂函数

```typescript
import type { ProjectSlide, PageTag } from '@douglasdong/ppteditor-types'

function createSlide(tag: PageTag, options?: Partial<ProjectSlide>): ProjectSlide {
  return {
    id: generateId(),
    elements: [],
    tag,
    ...options
  }
}

const titleSlide = createSlide('title', {
  background: {
    type: 'solid',
    themeColor: { color: '#F5F5F5' }
  }
})
```

### 3. 使用类型守卫

```typescript
import type { ProjectSlide, ProjectSlideList } from '@douglasdong/ppteditor-types'

function isListSlide(slide: ProjectSlide): slide is ProjectSlideList {
  return slide.tag === 'list' && 'payType' in slide
}

function processSlide(slide: ProjectSlide) {
  if (isListSlide(slide)) {
    // slide 类型被缩窄为 ProjectSlideList
    console.log(slide.payType, slide.autoFill)
  }
}
```

## 完整示例

```typescript
import type {
  ProjectSlide,
  ProjectSlideList,
  ProjectSlideBackground,
  ColorConfig,
  PageTag
} from '@douglasdong/ppteditor-types'

// 创建标题页
const titleSlide: ProjectSlide = {
  id: 'title-1',
  elements: [
    {
      type: 'text',
      id: 'title-text',
      left: 100,
      top: 100,
      width: 600,
      height: 100,
      rotate: 0,
      content: '项目标题'
    }
  ],
  tag: 'title',
  background: {
    type: 'gradient',
    gradientType: 'linear',
    gradientColor: [
      { color: '#4A90E2' },
      { color: '#7B68EE' }
    ],
    gradientRotate: 45
  }
}

// 创建内容页
const contentSlide: ProjectSlide = {
  id: 'content-1',
  elements: [],
  tag: 'content',
  pageId: 'page-123',
  aiImage: true,
  aiImageStatus: 'success',
  background: {
    type: 'solid',
    themeColor: {
      color: '#FFFFFF',
      themeColor: {
        color: '#FFFFFF',
        type: 'accent1'
      },
      opacity: 1
    }
  }
}

// 创建列表页
const listSlide: ProjectSlideList = {
  id: 'list-1',
  elements: [],
  tag: 'list',
  payType: 'free',
  listFlag: 'business-templates',
  autoFill: true,
  listCount: 20,
  background: {
    type: 'image',
    image: 'https://example.com/background.jpg',
    imageSize: 'cover'
  }
}

// 幻灯片集合
const presentation: ProjectSlide[] = [
  titleSlide,
  contentSlide,
  listSlide
]
```

## 版本兼容性

- **库版本**: v2.1.1+
- **TypeScript**: >= 4.5.0
- **Node.js**: >= 16.0.0

## 相关资源

- [类型差异详细文档](./SLIDE_TYPE_DIFFERENCES.md)
- [标准 Slide 类型](./src/slide/slide.ts)
- [项目扩展类型源码](./src/extensions/project-extended.ts)
- [测试用例](./tests/extensions/project-extended.test.ts)

## 常见问题

### Q: 项目扩展类型可以和标准类型混用吗？

A: 可以。项目扩展类型继承自标准类型，所有标准字段都是兼容的。但是 `background` 字段的结构不同，不能直接互换。

### Q: 如何处理列表页的类型区分？

A: 使用类型守卫或检查 `tag === 'list'` 并配合 `'payType' in slide` 来区分列表页。

### Q: ColorConfig 和简单的 string 颜色有什么区别？

A: ColorConfig 支持主题色系统，可以关联到主题色并支持不透明度等高级特性，而简单的 string 只能表示纯颜色值。

### Q: 为什么渐变色只支持双色？

A: 这是项目实现的业务限制。标准库支持多色渐变，但项目扩展类型为了简化实现只支持双色渐变。

## 反馈与贡献

如有问题或建议，请访问 [GitHub Issues](https://github.com/Xeonice/ppteditor-types/issues)。
