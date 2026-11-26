import type { ReactNode } from 'react';
import { ICON, type IconName } from '../data/icons';
import type { Tone } from '../data/types';
import { useI18n, type Text } from '../lib/i18n';

export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ');

export function Icon({ name, className, strokeWidth = 2 }: { name: IconName; className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}
      dangerouslySetInnerHTML={{ __html: ICON[name] }}
    />
  );
}

/** Text with `code` spans. */
export function Rich({ text }: { text: Text }) {
  const { t } = useI18n();
  return <>{t(text).split(/`([^`]+)`/g).map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part))}</>;
}

/** Text with <b> emphasis (task examples). */
export function Bold({ text }: { text: Text }) {
  const { t } = useI18n();
  return <>{t(text).split(/<b>(.*?)<\/b>/g).map((part, i) => (i % 2 ? <b key={i} className="text-fg">{part}</b> : part))}</>;
}

export const btn =
  'inline-flex items-center gap-2 min-h-[42px] px-4 rounded-[10px] font-[650] text-[14.5px] no-underline border [&_svg]:size-4';
export const btnDefault = `${btn} border-line-strong bg-surface text-fg hover:bg-surface-2 hover:text-fg`;
export const btnPrimary = `${btn} border-primary bg-primary text-on-primary hover:bg-primary-strong hover:border-primary-strong hover:text-on-primary`;

export function tabClass(selected: boolean) {
  return cx(
    'min-h-[34px] px-[13px] rounded-full border text-[13.5px] font-semibold',
    selected ? 'bg-fg border-fg text-bg' : 'border-line bg-surface text-muted hover:text-fg hover:border-line-strong',
  );
}

/** Pill shape; add a text size (12.5px by default in the original) at the call site. */
export const pill = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-[650] whitespace-nowrap';

const TONES: Record<Tone, string> = {
  '': 'bg-primary-soft text-primary',
  green: 'bg-success-soft text-success',
  violet: 'bg-violet-soft text-violet',
  amber: 'bg-warning-soft text-warning',
};

/** `muted` reproduces the original hero facts, where `.fact span` greyed out the untoned icon. */
export function IconBadge({ icon, tone = '', className, muted }: { icon: IconName; tone?: Tone; className?: string; muted?: boolean }) {
  return (
    <span className={cx('size-[34px] rounded-[9px] grid place-items-center flex-none', muted && !tone ? 'bg-primary-soft text-muted' : TONES[tone], className)}>
      <Icon name={icon} className="size-[17px]" />
    </span>
  );
}

const AVATAR = {
  owner: 'bg-violet-soft text-violet-text',
  admin: 'bg-primary-soft text-primary-strong',
  agent: 'bg-success-soft text-success-text',
};

export function Avatar({ role, small, children }: { role: keyof typeof AVATAR; small?: boolean; children: ReactNode }) {
  return (
    <span
      className={cx(
        'rounded-full grid place-items-center font-[750] relative flex-none',
        AVATAR[role],
        small
          ? 'size-6 text-[11.5px]'
          : "size-10 text-[15px] after:content-[''] after:absolute after:right-0 after:bottom-px after:size-2.5 after:rounded-full after:bg-success after:border-2 after:border-surface",
      )}
    >
      {children}
    </span>
  );
}

export function Checks({ items, className, liClassName, iconClassName = 'text-success' }: {
  items: Text[]; className?: string; liClassName?: string; iconClassName?: string;
}) {
  return (
    <ul className={cx('grid', className ?? 'gap-2.5')}>
      {items.map((p, i) => (
        <li key={i} className={cx('grid grid-cols-[18px_1fr] gap-2.5', liClassName ?? 'text-[14.5px] leading-[1.6]')}>
          <Icon name="check" className={cx('size-4 mt-1', iconClassName)} />
          <span><Rich text={p} /></span>
        </li>
      ))}
    </ul>
  );
}

export function Wrap({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx('max-w-[1240px] mx-auto pl-[max(16px,env(safe-area-inset-left,0px))] pr-[max(16px,env(safe-area-inset-right,0px))]', className)}>
      {children}
    </div>
  );
}

export const eyebrow = 'text-[13px] font-bold text-primary en:uppercase en:tracking-[0.08em] en:text-[12px]';
export const lead = 'text-muted text-[16.5px] max-w-[68ch]';
export const groupLabel = 'text-[12px] font-bold text-subtle en:uppercase en:tracking-[0.06em] en:text-[11px]';

export function Band({ id, alt, children }: { id: string; alt?: boolean; children: ReactNode }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cx('py-[76px] scroll-mt-[112px] xl:scroll-mt-[76px]', alt && 'bg-surface border-y border-line')}
    >
      <Wrap>{children}</Wrap>
    </section>
  );
}

export function SectionHead({ id, kicker, title, intro }: { id: string; kicker: string; title: string; intro?: string }) {
  return (
    <div className="grid gap-2.5 max-w-[780px] mb-[34px]">
      <p className={eyebrow}>{kicker}</p>
      <h2 id={`${id}-title`} className="text-[clamp(25px,3.2vw,34px)] font-[750] tracking-[-0.01em]">{title}</h2>
      {intro && <p className={lead}>{intro}</p>}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('border border-line rounded-lg p-5 grid gap-3 content-start', className ?? 'bg-surface')}>{children}</div>;
}

export function Num({ n, active }: { n: number; active?: boolean }) {
  return (
    <span
      className={cx(
        'size-[26px] rounded-full grid place-items-center text-[12.5px] font-extrabold tabular-nums flex-none',
        active ? 'bg-marker text-on-marker' : 'bg-surface-2 text-muted',
      )}
    >
      {n}
    </span>
  );
}

/** One entry of a numbered step list (tours and the message journey). */
export function StepButton({ index, active, title, body, extra, onClick, printAll, dataAttr }: {
  index: number;
  active: boolean;
  title: string;
  body: ReactNode;
  extra?: ReactNode;
  onClick: () => void;
  printAll?: boolean;
  dataAttr: string;
}) {
  return (
    <button
      type="button"
      data-step-btn={dataAttr}
      aria-current={active ? 'step' : undefined}
      onClick={onClick}
      className={cx(
        'w-full text-left grid grid-cols-[28px_1fr] gap-3 items-start px-3.5 py-3 rounded-[10px] border',
        active ? 'border-primary-border bg-primary-soft' : 'border-line bg-surface hover:border-line-strong',
      )}
    >
      <Num n={index + 1} active={active} />
      <span>
        <strong className="block text-[14.5px] leading-[1.45]">{title}</strong>
        <span className={cx('text-muted text-[13.5px] leading-[1.65] mt-1', active ? 'block' : 'hidden', printAll && 'print:block')}>{body}</span>
        {extra}
      </span>
    </button>
  );
}

/** Arrow-key / Home / End navigation for a group of tabs. */
export function tabKeys(event: React.KeyboardEvent<HTMLElement>, selector: string) {
  const scope = event.currentTarget;
  const tab = (event.target as HTMLElement).closest<HTMLElement>(selector);
  if (!tab || !scope.contains(tab)) return;
  const all = [...scope.querySelectorAll<HTMLElement>(selector)];
  const index = all.indexOf(tab);
  const next = ({ ArrowRight: index + 1, ArrowDown: index + 1, ArrowLeft: index - 1, ArrowUp: index - 1, Home: 0, End: all.length - 1 } as Record<string, number>)[event.key];
  if (next == null) return;
  event.preventDefault();
  const target = all[(next + all.length) % all.length];
  target.click();
  target.focus();
}
