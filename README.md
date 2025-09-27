# @douglasdong/ppteditor-types

TypeScript type definitions for PPT Editor elements

[![npm version](https://badge.fury.io/js/%40douglasdong%2Fppteditor-types.svg)](https://www.npmjs.com/package/@douglasdong/ppteditor-types)
[![GitHub](https://img.shields.io/github/license/Xeonice/ppteditor-types)](https://github.com/Xeonice/ppteditor-types/blob/main/LICENSE)

## 描述

这个包含了 PPT 编辑器中所有元素类型的 TypeScript 定义，包括：

- 枚举类型：形状路径公式、元素类型等
- 基础类型：渐变、阴影、边框、链接等
- 元素类型：文本、图片、形状、线条、图表、表格、LaTeX、视频、音频
- 动画类型：动画定义和配置
- 幻灯片类型：幻灯片结构、背景、主题、模板等

## 安装

```bash
npm install @douglasdong/ppteditor-types
```

## 使用

```typescript
import { PPTElement, Slide, ElementTypes } from '@douglasdong/ppteditor-types';

// 或者按需导入
import { PPTTextElement } from '@douglasdong/ppteditor-types/elements';
import { SlideTheme } from '@douglasdong/ppteditor-types/slide';
```

## 类型结构

- `enums/` - 枚举定义
- `base/` - 基础类型
- `elements/` - 元素类型
- `animation/` - 动画类型
- `slide/` - 幻灯片类型

## 协议

MIT