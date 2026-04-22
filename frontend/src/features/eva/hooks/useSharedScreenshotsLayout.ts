import { useSyncExternalStore } from 'react';
import { useLocation } from 'react-router';

/** True when Vite env requests screenshot layout (e.g. static capture builds). */
function envScreenshots(): boolean {
  try {
    return import.meta.env.VITE_SHARED_SCREENSHOTS === 'true';
  } catch {
    return false;
  }
}

/** Parse `sharedscreenshots` from full URL (hash router + pre-hash query + path token). */
export function readSharedScreenshotsLayout(): boolean {
  if (typeof window === 'undefined') return false;
  if (envScreenshots()) return true;

  const { search, hash } = window.location;

  const beforeHash = new URLSearchParams(search);
  if (beforeHash.has('sharedscreenshots')) return true;

  const decoded = decodeURIComponent(hash);
  const q = decoded.indexOf('?');
  if (q !== -1) {
    const fromHash = new URLSearchParams(decoded.slice(q + 1));
    if (fromHash.has('sharedscreenshots')) return true;
  }

  // `#/moment1/sharedscreenshots` or `...#sharedscreenshots`
  if (/[#/]sharedscreenshots(?:[?/#]|$)/i.test(decoded)) return true;

  return false;
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener('hashchange', onStoreChange);
  window.addEventListener('popstate', onStoreChange);
  return () => {
    window.removeEventListener('hashchange', onStoreChange);
    window.removeEventListener('popstate', onStoreChange);
  };
}

function getSnapshot(): boolean {
  return readSharedScreenshotsLayout();
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Reactive flag for screenshot-friendly layout. Supports:
 * - `?sharedscreenshots` before `#` (e.g. `/?sharedscreenshots#/moment1`)
 * - `?sharedscreenshots` in hash (e.g. `#/moment1?sharedscreenshots`)
 * - Path token `#/moment1/sharedscreenshots`
 * - `VITE_SHARED_SCREENSHOTS=true` at build time
 */
export function useSharedScreenshotsLayout(): boolean {
  const location = useLocation();
  const fromWindow = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const fromRouterSearch = new URLSearchParams(location.search).has('sharedscreenshots');
  return fromWindow || fromRouterSearch;
}
