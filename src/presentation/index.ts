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
  PresentationMetadata,
  PresentationTheme
} from './presentation.js'

// 统一导出（方便使用）
export type {
  Presentation as StandardPresentation
} from './presentation.js'

export type {
  LegacyPresentation as CompatPresentation
} from './legacy-presentation.js'
