# PPTEditor Types Migration Guide

This guide helps you migrate from V1 to V2 type definitions in the PPTEditor Types library.

## Overview

The V2 version introduces a standardized, more maintainable type system while maintaining full backward compatibility through our dual-version support system.

## Quick Start

### 1. Check Your Current Version

```typescript
import { VersionDetector } from 'ppteditor-types/adapters';

// Check if your data is V1 or V2
const version = VersionDetector.detectElementsVersion(yourElements);
console.log(`Your data is: ${version}`); // 'v1', 'v2', or 'mixed'
```

### 2. Automatic Migration

For most use cases, use the AutoAdapter for seamless conversion:

```typescript
import { AutoAdapter } from 'ppteditor-types/adapters';

// Automatically convert any element to V2
const v2Element = AutoAdapter.toV2(yourElement);

// Batch convert an array of elements
const v2Elements = AutoAdapter.elementsToV2(yourElements);
```

### 3. Manual Migration

For more control over the migration process:

```typescript
import { V1ToV2Adapter } from 'ppteditor-types/adapters';

// Convert specific element types
const v2Text = V1ToV2Adapter.convertTextElement(v1TextElement);
const v2Shape = V1ToV2Adapter.convertShapeElement(v1ShapeElement);
const v2Image = V1ToV2Adapter.convertImageElement(v1ImageElement);
const v2Line = V1ToV2Adapter.convertLineElement(v1LineElement);

// Convert colors and gradients
const v2Color = V1ToV2Adapter.convertColor(v1ColorConfig);
const v2Gradient = V1ToV2Adapter.convertGradient(v1ShapeGradient);
```

## Key Differences Between V1 and V2

### Color System

**V1 (Object-based):**
```typescript
{
  color: '#ff0000',
  themeColor: '#ff0000'
}
```

**V2 (String-based):**
```typescript
'#ff0000'
```

### Gradient System

**V1 (Limited to 2 colors):**
```typescript
{
  type: 'linear',
  themeColor: [colorConfig1, colorConfig2],
  rotate: 45
}
```

**V2 (Unlimited colors with positions):**
```typescript
{
  type: 'linear',
  colors: [
    { pos: 0, color: '#ff0000' },
    { pos: 50, color: '#00ff00' },
    { pos: 100, color: '#0000ff' }
  ],
  rotate: 45
}
```

### Element Properties

**V1-specific properties (removed in V2):**
- `tag` - metadata tag
- `index` - element index
- `from` - source indicator
- `isDefault` - default flag
- `enableShrink` - text shrinking
- `keypoint` - shape keypoint
- `loading` - image loading state

**V2 additions:**
- `textType` for text elements
- Standardized property names
- Better TypeScript support

## Migration Strategies

### Strategy 1: Gradual Migration (Recommended)

Use the UnifiedPPTElement type to support both versions simultaneously:

```typescript
import { UnifiedPPTElement } from 'ppteditor-types/unified';

function processElement(element: UnifiedPPTElement) {
  // Automatically handles both V1 and V2
  const v2Element = element.toV2();
  // Process V2 element...
}
```

### Strategy 2: Full Migration

1. **Backup your data** before starting migration
2. **Test with a small dataset** first
3. **Convert all data** to V2:

```typescript
import { AutoAdapter } from 'ppteditor-types/adapters';
import fs from 'fs';

// Load your V1 data
const v1Data = JSON.parse(fs.readFileSync('data-v1.json', 'utf-8'));

// Convert to V2
const v2Data = {
  ...v1Data,
  elements: AutoAdapter.elementsToV2(v1Data.elements)
};

// Save V2 data
fs.writeFileSync('data-v2.json', JSON.stringify(v2Data, null, 2));
```

### Strategy 3: Compatibility Mode

Keep using V1 types with automatic conversion when needed:

```typescript
import { V1CompatiblePPTElement } from 'ppteditor-types/v1-compat';
import { AutoAdapter } from 'ppteditor-types/adapters';

// Continue using V1 types
const v1Element: V1CompatiblePPTElement = getV1Element();

// Convert only when interfacing with V2 systems
const v2Element = AutoAdapter.toV2(v1Element);
sendToV2System(v2Element);
```

## Error Handling

The conversion system includes robust error handling:

```typescript
import { V1ToV2Adapter } from 'ppteditor-types/adapters';

try {
  // Will validate gradient has at least 2 colors
  const v2Gradient = V1ToV2Adapter.convertGradient(v1Gradient);
} catch (error) {
  console.error('Conversion failed:', error.message);
  // Handle error or use fallback
}
```

### Common Issues and Solutions

1. **Missing colors in gradients**
   - V1 requires exactly 2 colors
   - Solution: Ensure gradients have at least 2 color stops

2. **Null or undefined color configs**
   - V2 adapter provides fallback to '#000000'
   - Solution: Clean your data or rely on automatic fallbacks

3. **Unknown element types**
   - V1's 'none' type is not supported in V2
   - Solution: Filter out unsupported types during conversion

4. **Non-string shape paths**
   - V2 preserves original path structure
   - Solution: No action needed, paths are handled correctly

## Performance Optimization

The conversion system includes memoization for better performance:

- Color conversions are cached
- Element conversions are cached
- Batch operations use optimized array processing

For large datasets (1000+ elements), the conversion typically completes in under 5 seconds.

## Testing Your Migration

Always test your migration thoroughly:

```typescript
import { VersionDetector, AutoAdapter } from 'ppteditor-types/adapters';

function testMigration(originalData: any[]) {
  // Convert to V2
  const v2Data = AutoAdapter.elementsToV2(originalData);

  // Convert back to V1 for validation
  const v1Data = AutoAdapter.elementsToV1(v2Data);

  // Verify critical properties are preserved
  originalData.forEach((original, index) => {
    const converted = v1Data[index];
    assert(original.id === converted.id);
    assert(original.type === converted.type);
    // Add more assertions as needed
  });
}
```

## Support

If you encounter issues during migration:

1. Check the [test files](./tests/adapters/) for examples
2. Review the [adapter source code](./src/adapters/v1-v2-adapter.ts)
3. Open an issue on GitHub with:
   - Your V1 data sample (sanitized)
   - The error message
   - Expected V2 output

## Next Steps

After successful migration:

1. Update your TypeScript imports to use V2 types
2. Remove V1-specific code gradually
3. Take advantage of V2 features:
   - Better type safety
   - More flexible gradients
   - Cleaner API surface

Remember: The dual-version system means you can migrate at your own pace without breaking existing code!