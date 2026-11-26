import { useEffect, useState } from 'react';
import { useI18n, type Lang } from '../lib/i18n';
import type { Theme } from '../lib/shots';
import { useTheme } from '../lib/theme';
import { Icon, Wrap, cx } from './ui';

const SECTIONS: [string, string, string][] = [
  ['overview', '概览', 'Overview'],
  ['how-it-works', '工作原理', 'How it works'],
  ['roles', '角色与权限', 'Roles'],
  ['chat', '会话工作台', 'Chat'],
  ['agents', '客服管理', 'Agents'],
  ['features', '更多功能', 'Features'],
  ['appearance', '主题与语言', 'Theme & language'],
  ['faq', '常见问题', 'FAQ'],
];

/** Highlights the nav link of the section in view. */
function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const seen = new Map<string, number>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => seen.set(entry.target.id, entry.intersectionRatio));
      let best: [string, number] | null = null;
      for (const [id, ratio] of seen) if (ratio > 0 && (!best || ratio > best[1])) best = [id, ratio];
      setActive(best ? (best[0] === 'value' ? 'overview' : best[0]) : null);
    }, { rootMargin: '-90px 0px -45% 0px', threshold: [0, 0.15, 0.4, 0.7] });
    document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return active;
}

const segButton = (pressed: boolean) => cx(
  'border-0 text-[13px] font-[650] leading-none min-h-8 px-[9px] xs:px-[11px] rounded-[7px] inline-flex items-center gap-1.5',
  pressed ? 'bg-surface text-fg shadow-xs' : 'bg-transparent text-muted',
);

export function Header({ setLang, setTheme }: { setLang: (lang: Lang) => void; setTheme: (theme: Theme) => void }) {
  const { lang, tx } = useI18n();
  const theme = useTheme();
  const active = useActiveSection();
  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-20 bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] backdrop-blur-[12px] backdrop-saturate-[1.4] border-b border-line">
      <Wrap className="flex flex-wrap items-center gap-x-[18px] gap-y-0 min-h-[62px] pt-2 xl:flex-nowrap xl:pt-0">
        <a href="#overview" className="flex items-center gap-2.5 text-fg hover:text-fg no-underline flex-none">
          <span className="size-9 rounded-[10px] grid place-items-center bg-primary text-on-primary shadow-xs" aria-hidden="true">
            <Icon name="chat" className="size-[19px]" />
          </span>
          <span className="grid leading-[1.2]">
            <strong className="text-[15px]">{tx('在线客服', 'Chat Support')}</strong>
            <small className="hidden xs:block text-[12px] text-subtle">{tx('产品使用教程', 'Product guide')}</small>
          </span>
        </a>
        <nav
          aria-label="章节 / Sections"
          className="flex gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden order-3 w-full mt-1.5 pb-2 xl:order-none xl:w-auto xl:m-0 xl:ml-auto xl:pb-0"
        >
          {SECTIONS.map(([id, zh, en]) => {
            const current = active === id;
            return (
              <a
                key={id} href={`#${id}`} aria-current={current ? 'true' : 'false'}
                className={cx(
                  'no-underline text-[14px] font-[550] px-2.5 py-[7px] rounded-lg whitespace-nowrap',
                  current ? 'text-primary bg-primary-soft hover:text-primary' : 'text-muted hover:bg-surface-2 hover:text-fg',
                )}
              >
                {lang === 'en' ? en : zh}
              </a>
            );
          })}
        </nav>
        <div className="flex items-center gap-2 flex-none ml-auto xl:ml-0">
          <div className="inline-flex gap-0.5 p-[3px] bg-surface-2 border border-line rounded-[10px]" role="group" aria-label="Language / 语言">
            <button type="button" lang="zh-CN" aria-pressed={lang === 'zh'} onClick={() => setLang('zh')} className={segButton(lang === 'zh')}>中文</button>
            <button type="button" lang="en" aria-pressed={lang === 'en'} onClick={() => setLang('en')} className={segButton(lang === 'en')}>EN</button>
          </div>
          <div className="inline-flex gap-0.5 p-[3px] bg-surface-2 border border-line rounded-[10px]" role="group" aria-label="主题 / Theme">
            <button type="button" aria-pressed={theme === 'light'} onClick={() => setTheme('light')} className={segButton(theme === 'light')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="size-[15px]">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
              <span className="sr-only xs:not-sr-only">{tx('浅色', 'Light')}</span>
            </button>
            <button type="button" aria-pressed={theme === 'dark'} onClick={() => setTheme('dark')} className={segButton(theme === 'dark')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="size-[15px]">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
              <span className="sr-only xs:not-sr-only">{tx('深色', 'Dark')}</span>
            </button>
          </div>
        </div>
      </Wrap>
    </header>
  );
}
