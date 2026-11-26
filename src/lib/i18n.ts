import { createContext, useContext } from 'react';

export type Lang = 'zh' | 'en';
export type Text = string | { zh: string; en: string };

export const L = (zh: string, en: string) => ({ zh, en });

export function translate(value: Text | null | undefined, lang: Lang): string {
  if (value == null) return '';
  return typeof value === 'string' ? value : (value[lang] ?? value.zh ?? '');
}

export const LangContext = createContext<Lang>('zh');

export function useI18n() {
  const lang = useContext(LangContext);
  return {
    lang,
    t: (value: Text | null | undefined) => translate(value, lang),
    /** Inline bilingual string. */
    tx: (zh: string, en: string) => (lang === 'en' ? en : zh),
  };
}
