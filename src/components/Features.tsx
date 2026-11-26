import { FEATURES, META, WHO } from '../data/content';
import type { WhoKey } from '../data/types';
import { useI18n } from '../lib/i18n';
import { Caption, Stage, WindowFrame } from './Screenshot';
import { Band, Checks, Icon, SectionHead, cx, pill, tabClass, tabKeys } from './ui';

export interface FeatureState { id: string; sub: number }

const WHO_STYLE: Record<WhoKey, string> = {
  owner: 'bg-violet-soft text-violet-text',
  admin: 'bg-primary-soft text-primary-strong',
  agent: 'bg-success-soft text-success-text',
  grant: 'bg-warning-soft text-warning-text',
  visitor: 'bg-surface-2 text-muted',
  staff: 'bg-surface-2 text-fg',
};

export function Features({ state, setState }: { state: FeatureState; setState: (next: FeatureState) => void }) {
  const { t, tx } = useI18n();
  const f = FEATURES.find((x) => x.id === state.id) ?? FEATURES[0];
  const subIndex = Math.min(state.sub, f.subs.length - 1);
  const sub = f.subs[subIndex];
  const points = f.subPoints?.[sub[0]] ?? f.points ?? [];

  return (
    <Band id="features">
      <SectionHead
        id="features"
        kicker={tx('更多功能', 'More features')}
        title={tx('其他页面同样一目了然', 'Every other page, explained')}
        intro={tx('选择左侧的功能，查看谁可以使用、能做什么，以及真实截图。', 'Pick a feature to see who can use it, what it does and a real screenshot.')}
      />
      <div className="grid grid-cols-1 xl:grid-cols-[250px_minmax(0,1fr)] gap-[30px] items-start">
        <div
          id="fnav" role="tablist" aria-orientation="vertical" aria-label="功能 / Features"
          onKeyDown={(e) => tabKeys(e, '[role="tab"]')}
          className="flex overflow-x-auto gap-1.5 pb-1 [scrollbar-width:thin] xl:grid xl:gap-0.5 xl:pb-0 xl:overflow-visible xl:sticky xl:top-[88px]"
        >
          {FEATURES.map((x) => {
            const selected = x.id === f.id;
            return (
              <button
                key={x.id} type="button" role="tab" id={`feature-${x.id}`}
                aria-selected={selected} aria-controls="fpanel" tabIndex={selected ? 0 : -1}
                onClick={() => setState({ id: x.id, sub: 0 })}
                className={cx(
                  'flex flex-none items-center gap-2.5 text-left text-[14px] font-semibold',
                  'border border-line rounded-full px-[13px] py-[7px] xl:border-0 xl:rounded-[9px] xl:px-3 xl:py-[9px]',
                  selected ? 'bg-primary-soft text-primary-strong' : 'bg-surface text-muted xl:bg-transparent hover:bg-surface-2 hover:text-fg',
                )}
              >
                <Icon name={x.icon} className="size-4 flex-none" />
                <span>{t(x.name)}</span>
              </button>
            );
          })}
        </div>
        <div id="fpanel" role="tabpanel" aria-labelledby={`feature-${f.id}`} className="grid gap-[18px] min-w-0">
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2.5">
            <h3 className="text-[22px] font-bold">{t(f.name)}</h3>
            <div className="flex flex-wrap gap-1.5">
              {f.who.map((w) => <span key={w} className={cx(pill, 'text-[12px]', WHO_STYLE[w])}>{t(WHO[w])}</span>)}
            </div>
          </div>
          <p className="text-muted text-[15.5px] max-w-[68ch]">{t(f.summary)}</p>
          <Checks items={points} className="grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-2.5" iconClassName="text-primary" />
          {f.subs.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label={t(f.name)} onKeyDown={(e) => tabKeys(e, '[data-sub]')}>
              {f.subs.map((s, i) => (
                <button
                  key={s[0]} type="button" role="tab" data-sub={i}
                  aria-selected={i === subIndex} tabIndex={i === subIndex ? 0 : -1}
                  onClick={() => setState({ id: f.id, sub: i })}
                  className={tabClass(i === subIndex)}
                >
                  {t(s[1])}
                </button>
              ))}
            </div>
          )}
          <figure className="m-0">
            <WindowFrame id={sub[0]}><Stage id={sub[0]} /></WindowFrame>
            <Caption>{t((META[sub[0]] || [])[1])}</Caption>
          </figure>
        </div>
      </div>
    </Band>
  );
}
