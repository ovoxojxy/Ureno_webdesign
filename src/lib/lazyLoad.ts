import React, { lazy } from 'react';

/**
 * Helper function to create lazily loaded components with better error handling
 */
export function lazyLoad(importFn: () => Promise<any>, fallbackLoadingMs: number = 0) {
  if (fallbackLoadingMs > 0) {
    return lazy(() =>
      Promise.all([
        importFn(),
        new Promise(resolve => setTimeout(resolve, fallbackLoadingMs))
      ]).then(([moduleExports]) => moduleExports)
    );
  }

  return lazy(async () => {
    try {
      return await importFn();
    } catch (error) {
      console.error('Error loading component:', error);
      return {
        
      };
    }
  });
}

export default lazyLoad;

