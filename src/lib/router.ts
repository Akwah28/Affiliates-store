import { useState, useEffect } from 'react';

// Lightweight browser history router that supports:
// - Direct path navigation without reload (pushState)
// - Popstate back/forward navigation
// - Dynamic parameterized path matching (e.g. /product/:slug, /category/:slug, /go/:productId, /admin/products/:id/edit)

export interface RouteMatch {
  path: string;
  params: Record<string, string>;
}

export function matchPath(pattern: string, pathname: string): Record<string, string> | null {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = pathname.split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    if (patternPart.startsWith(':')) {
      const paramName = patternPart.slice(1);
      params[paramName] = decodeURIComponent(pathPart);
    } else if (patternPart !== pathPart) {
      return null;
    }
  }

  return params;
}

export function navigate(to: string) {
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function useRouter() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return {
    path: currentPath,
    navigate,
    match: (pattern: string) => matchPath(pattern, currentPath)
  };
}
