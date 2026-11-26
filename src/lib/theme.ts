import { createContext, useContext, useEffect, useState } from 'react';
import type { Theme } from './shots';

const query = '(prefers-color-scheme: dark)';

export const storage = {
  get(key: string) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key: string, value: string) { try { localStorage.setItem(key, value); } catch { /* storage unavailable */ } },
};

function initialTheme(): Theme | null {
  const fromUrl = new URLSearchParams(location.search).get('theme');
  const saved = fromUrl || storage.get('tutorial:theme');
  return saved === 'light' || saved === 'dark' ? saved : null;
}

/** Explicit choice (saved per browser) on top of the system preference. */
export function useThemeState() {
  const [chosen, setChosen] = useState<Theme | null>(initialTheme);
  const [systemDark, setSystemDark] = useState(() => matchMedia(query).matches);

  useEffect(() => {
    const media = matchMedia(query);
    const onChange = () => setSystemDark(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (chosen) document.documentElement.dataset.theme = chosen;
    else delete document.documentElement.dataset.theme;
  }, [chosen]);

  const theme: Theme = chosen ?? (systemDark ? 'dark' : 'light');
  const setTheme = (next: Theme) => { setChosen(next); storage.set('tutorial:theme', next); };
  return { theme, setTheme };
}

export const ThemeContext = createContext<Theme>('light');
export const useTheme = () => useContext(ThemeContext);

export function useReducedMotion() {
  const [reduce, setReduce] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduce(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);
  return reduce;
}
