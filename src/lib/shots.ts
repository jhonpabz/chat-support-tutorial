import data from '../data/shots.json';
import type { Shot } from '../data/types';
import type { Lang } from './i18n';

export type Theme = 'light' | 'dark';

export const GENERATED_AT: string | undefined = data.generatedAt;
const SHOTS = data.shots as Record<string, Record<string, Shot>>;

/** Screenshot for the current language and theme, falling back to light / Chinese. */
export function getShot(id: string, lang: Lang, theme: Theme): Shot | null {
  const set = SHOTS[id];
  if (!set) return null;
  return set[`${lang}-${theme}`] || set[`${lang}-light`] || set['zh-light'] || Object.values(set)[0] || null;
}

export function hasVariant(id: string, lang: Lang, theme: Theme): boolean {
  return Boolean(SHOTS[id]?.[`${lang}-${theme}`]);
}
