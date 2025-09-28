# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Build
```bash
npm run build        # Compile TypeScript to JavaScript
npm run build:watch  # Watch mode for development
```

### Testing
```bash
npm run test:all     # Run all type tests
npm run test:types   # Test type definitions only
npm run test:compatibility  # Test compatibility
npm run test:example # Test example file
```

### Development
```bash
npm install         # Install dependencies
tsc --noEmit       # Type check without emitting files
```

## Architecture

This is a TypeScript type definitions library for PPT Editor elements. The codebase follows a modular structure:

### Module Organization
- **`src/enums/`** - Enumeration types for shape paths, element types, and constants
- **`src/base/`** - Core base types (gradients, shadows, borders, links, common properties)
- **`src/elements/`** - PPT element type definitions (text, image, shape, line, chart, table, LaTeX, video, audio)
- **`src/animation/`** - Animation type definitions and configurations
- **`src/slide/`** - Slide-level types (slide structure, backgrounds, themes, templates)

### Key Type Hierarchy
- All PPT elements extend from base element interfaces with common properties (id, width, height, left, top, rotate, etc.)
- Each element type (`PPTTextElement`, `PPTImageElement`, etc.) has specific properties relevant to its function
- The main `PPTElement` type is a union of all element types
- Slides contain arrays of elements and maintain theme/template relationships

### Export Strategy
The library uses ESM modules with `.js` extensions in imports. The main `index.ts` provides:
1. Direct exports from all modules (`export * from './module/index.js'`)
2. Namespace exports for grouped imports (e.g., `Elements`, `Enums`, `Base`)

### Type Safety Considerations
- All element types include a discriminator field `type` from the `ElementTypes` enum
- Optional properties are clearly marked throughout the definitions
- Complex types like gradients and animations have well-defined structures