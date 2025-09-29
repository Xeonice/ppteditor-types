/**
 * Simple memoization utility for conversion functions
 */

type AnyFunction = (...args: any[]) => any;

/**
 * Creates a memoized version of a function
 * Uses WeakMap for object arguments to prevent memory leaks
 */
export function memoize<T extends AnyFunction>(fn: T): T {
  const cache = new WeakMap<object, any>();
  const primitiveCache = new Map<string, any>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    // For single object argument, use WeakMap
    if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
      if (cache.has(args[0])) {
        return cache.get(args[0]);
      }
      const result = fn(...args);
      cache.set(args[0], result);
      return result;
    }

    // For primitive or multiple arguments, use Map with string key
    const key = JSON.stringify(args);
    if (primitiveCache.has(key)) {
      return primitiveCache.get(key);
    }
    const result = fn(...args);
    primitiveCache.set(key, result);
    return result;
  }) as T;
}

/**
 * Batch memoization for array operations
 * Caches results based on array reference
 */
export function memoizeBatch<T extends (items: any[]) => any[]>(fn: T): T {
  const cache = new WeakMap<any[], any[]>();

  return ((items: any[]): any[] => {
    if (cache.has(items)) {
      return cache.get(items)!;
    }
    const result = fn(items);
    cache.set(items, result);
    return result;
  }) as T;
}