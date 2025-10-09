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

### 新特性：项目扩展类型 🎉

v2.2.0 版本新增了项目扩展类型，提供了基于标准 `Slide` 类型的增强版本，专门用于支持 frontend-new-ppt 项目的特定需求：

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
- [类型差异详细分析](./SLIDE_TYPE_DIFFERENCES.md)

## 类型结构

- `enums/` - 枚举定义
- `base/` - 基础类型
- `elements/` - 元素类型
- `animation/` - 动画类型
- `slide/` - 幻灯片类型
- `extensions/` - 项目扩展类型（v2.2.0+）
- `types/` - V1/V2 兼容类型
- `adapters/` - 版本适配器
- `utils/` - 版本转换工具
- `middleware/` - 版本中间件

## 协议

MIT