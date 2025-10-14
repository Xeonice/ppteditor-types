# @douglasdong/ppteditor-types

TypeScript type definitions for PPT Editor elements

[![npm version](https://badge.fury.io/js/%40douglasdong%2Fppteditor-types.svg)](https://www.npmjs.com/package/@douglasdong/ppteditor-types)
[![GitHub](https://img.shields.io/github/license/Xeonice/ppteditor-types)](https://github.com/Xeonice/ppteditor-types/blob/main/LICENSE)

## 描述

PPTEditor V2 标准化类型定义库，包含：

- 枚举类型：形状路径公式、元素类型等
- 基础类型：渐变、阴影、边框、链接等
- 元素类型：文本、图片、形状、线条、图表、表格、LaTeX、视频、音频
- 动画类型：动画定义和配置
- 幻灯片类型：幻灯片结构、背景、主题、模板等
- **项目扩展**：基于标准类型的项目特定扩展（v2.2.0+）

### ⚠️ v2.4.0 破坏性变更

v2.4.0 对表格相关类型进行了重构，以匹配实际导出数据：

**V1TableCellStyle 变更：**
- `fontsize` → `fontSize` (驼峰命名)
- `themeColor: V1ColorConfig` → `color: string` (十六进制颜色值)
- `themeBackcolor: V1ColorConfig` → `backcolor: string`

**V1PPTElementOutline 变更：**
- `themeColor: V1ColorConfig` → `color: string`

详见 [CHANGELOG](./CHANGELOG.md) 和 [迁移指南](./MIGRATION.md)

### 项目扩展类型 🎉

v2.2.0+ 版本提供了基于标准 `Slide` 类型的增强版本，专门用于支持 frontend-new-ppt 项目的特定需求：

- ✅ **ProjectSlide** - 扩展的幻灯片类型，支持项目特有字段（pageId, tag, aiImage 等）
- ✅ **ProjectSlideList** - 列表页专用类型，支持模板付费系统
- ✅ **ProjectSlideBackground** - 扩展的背景类型，支持主题色系统
- ✅ **ColorConfig** - 高级颜色配置，支持主题色引用和不透明度
- ✅ 完全向后兼容标准类型

详见 [项目扩展类型使用指南](./PROJECT_EXTENSIONS.md)

## 安装

```bash
npm install @douglasdong/ppteditor-types
```

## 使用

### 标准类型

```typescript
import { PPTElement, Slide, ElementTypes } from '@douglasdong/ppteditor-types';

// 或者按需导入
import { PPTTextElement } from '@douglasdong/ppteditor-types/elements';
import { SlideTheme } from '@douglasdong/ppteditor-types/slide';
```

### 项目扩展类型（v2.2.0+）

```typescript
// 导入项目扩展类型
import type {
  ProjectSlide,
  ProjectSlideList,
  ProjectSlideBackground,
  ColorConfig
} from '@douglasdong/ppteditor-types';

// 或者从扩展子包导入
import type { ProjectSlide } from '@douglasdong/ppteditor-types/extensions';

// 使用示例
const slide: ProjectSlide = {
  id: 'slide-1',
  elements: [],
  tag: 'content',
  pageId: 'page-123',
  aiImage: true,
  background: {
    type: 'solid',
    themeColor: {
      color: '#FFFFFF'
    }
  }
};
```

详细使用方法请参阅：
- [项目扩展类型使用指南](./PROJECT_EXTENSIONS.md)
- [迁移指南](./MIGRATION.md)

## 类型结构

- `enums/` - 枚举定义
- `base/` - 基础类型
- `elements/` - 元素类型
- `animation/` - 动画类型
- `slide/` - 幻灯片类型
- `extensions/` - 项目扩展类型（v2.2.0+）
- `types/` - V1/V2 兼容类型
  - `V1SlideNote` - 幻灯片备注/评论类型（v2.5.2+）
  - `V1SlideNoteReply` - 备注回复类型（v2.5.2+）
- `adapters/` - 版本适配器
- `utils/` - 工具函数
  - `validation-helpers` - 类型验证工具（v2.5.2+）
  - `color-helpers` - 颜色配置工具
  - `version-converter` - 版本转换工具
- `middleware/` - 版本中间件

## 新增功能 (v2.5.2)

### V1PPTElementOutline 主题颜色支持

元素描边现在支持主题颜色系统:

```typescript
import type { V1PPTElementOutline } from '@douglasdong/ppteditor-types';

// 使用主题颜色的描边
const outline: V1PPTElementOutline = {
  style: 'solid',
  width: 2,
  themeColor: {
    color: '#4472C4',
    themeColor: { color: '#4472C4', type: 'accent1' }
  }
  // themeColor 优先级高于 color，确保主题一致性
};
```

### V1SlideBase gist 字段

幻灯片现在支持存储关键要点或摘要:

```typescript
import type { V1SlideBase } from '@douglasdong/ppteditor-types';

const slide: V1SlideBase = {
  id: 'slide-1',
  elements: [],
  gist: [
    '关键要点 1：产品特性介绍',
    '关键要点 2：市场优势分析',
    '关键要点 3：未来发展规划'
  ]
};
```

### 验证工具函数

新增类型安全的验证辅助函数:

```typescript
import {
  isValidGist,
  isValidNonEmptyGist,
  isValidGistWithNonEmptyStrings,
  isValidSlideNote,
  isValidSlideNoteReply,
  isValidSlideNotes
} from '@douglasdong/ppteditor-types/utils';

// 验证 gist 字段
const data: unknown = ['point 1', 'point 2'];
if (isValidGist(data)) {
  // TypeScript 现在知道 data 是 string[]
  console.log(data.length);
}

// 验证幻灯片备注
const noteData: unknown = {
  id: 'note-1',
  content: '备注内容',
  time: Date.now(),
  user: 'user-123'
};
if (isValidSlideNote(noteData)) {
  // TypeScript 类型安全
  console.log(noteData.content);
}
```

### 独立的备注类型

备注和回复现在有独立的类型定义，提高可读性和可重用性:

```typescript
import type { V1SlideNote, V1SlideNoteReply } from '@douglasdong/ppteditor-types';

const reply: V1SlideNoteReply = {
  id: 'reply-1',
  content: '已修改',
  time: Date.now(),
  user: 'user-456'
};

const note: V1SlideNote = {
  id: 'note-1',
  content: '这里需要修改标题文案',
  time: Date.now(),
  user: 'user-123',
  elId: 'text-element-1',  // 关联到特定元素
  replies: [reply]
};
```

## 协议

MIT