import { useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { META, TOURS } from '../data/content';
import type { ShotBox, TourKey } from '../data/types';
import { L, useI18n } from '../lib/i18n';
import { hasVariant } from '../lib/shots';
import { useTheme } from '../lib/theme';
import { Caption, Stage, WindowFrame, useShot } from './Screenshot';
import { Rich, StepButton, btnDefault, btnPrimary, cx, groupLabel, tabClass, tabKeys } from './ui';

export interface TourState { view: number; step: number }

/** Step list beside a screenshot with a spotlight and numbered markers. */
export function Tour({ tour, state, setState }: {
  tour: TourKey;
  state: TourState;
  setState: (next: TourState) => void;
}) {
  const { t, lang } = useI18n();
  const theme = useTheme();
  const views = TOURS[tour];
  const view = views[state.view];
  const image = useShot(view.shot);
  const boxes = image?.boxes ?? {};
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [image?.src]);

  // Group the view tabs ("Main screens", "Reply tools", ...).
  const groups: { name: string; items: number[] }[] = [];
  views.forEach((v, i) => {
    const name = v.group ? t(v.group) : '';
    let group = groups.find((g) => g.name === name);
    if (!group) groups.push((group = { name, items: [] }));
    group.items.push(i);
  });

  // Keep markers from covering each other; on narrow screenshots only the current
  // step's marker is shown (the step list sits right below).
  const narrow = size.w > 0 && size.w < 640;
  const placed: [number, number][] = [];
  const markers = view.steps.map((s, i) => {
    const b: ShotBox | undefined = boxes[s.box];
    if (!b) return null;
    const left = Math.min(Math.max(b.x, 1), 97);
    const top = Math.min(Math.max(b.y, 1.5), 96);
    const current = i === state.step;
    if (narrow && !current) return null;
    let style: React.CSSProperties = { left: `${left}%`, top: `${top}%` };
    if (size.w && size.h) {
      let x = (left / 100) * size.w;
      const y = (top / 100) * size.h;
      for (let guard = 0; guard < 12 && placed.some(([px, py]) => Math.abs(px - x) < 30 && Math.abs(py - y) < 30); guard++) x += 30;
      x = Math.min(x, size.w - 16);
      placed.push([x, y]);
      style = { left: `${x}px`, top: `${y}px` };
    }
    return { i, style, current, title: t(s.title) };
  });

  const active = boxes[view.steps[state.step]?.box];
  const overlay = (
    <>
      <div
        className="absolute rounded-lg pointer-events-none outline-2 outline-focus outline-offset-1 shadow-[0_0_0_200vmax_var(--scrim)] [transition:left_.35s_ease,top_.35s_ease,width_.35s_ease,height_.35s_ease,opacity_.25s_ease]"
        style={active
          ? { left: `${active.x}%`, top: `${active.y}%`, width: `${active.w}%`, height: `${active.h}%`, opacity: 1 }
          : { left: 0, top: 0, width: 0, height: 0, opacity: 0 }}
      />
      {markers.map((m) => m && (
        <button
          key={m.i}
          type="button"
          data-marker={m.i}
          style={m.style}
          aria-label={`${t(L('步骤', 'Step'))} ${m.i + 1}: ${m.title}`}
          aria-current={m.current ? 'step' : undefined}
          onClick={() => setState({ ...state, step: m.i })}
          className={cx(
            'absolute z-[2] size-[26px] -mt-2.5 -ml-2.5 rounded-full border-2 border-surface bg-marker text-on-marker',
            'text-[12.5px] font-extrabold leading-none grid place-items-center tabular-nums transition-transform duration-200',
            m.current ? 'scale-[1.22] shadow-[0_0_0_4px_var(--ring)]' : 'shadow-sm hover:scale-[1.12]',
          )}
        >
          {m.i + 1}
        </button>
      ))}
    </>
  );

  const last = view.steps.length - 1;
  const move = (delta: number) => {
    const step = Math.min(Math.max(state.step + delta, 0), last);
    flushSync(() => setState({ ...state, step }));
    const root = rootRef.current;
    const same = root?.querySelector<HTMLButtonElement>(`[data-move="${delta}"]:not([disabled])`);
    (same ?? root?.querySelector<HTMLElement>('[data-step-btn][aria-current="step"]'))?.focus();
  };

  const lightOnly = image && image.w > image.h && !hasVariant(view.shot, lang, 'dark') && theme === 'dark';

  return (
    <div ref={rootRef} id={`tour-${tour}`}>
      {views.length > 1 && (
        <div className="flex flex-wrap gap-x-[22px] gap-y-3.5 mb-[22px]" role="tablist" aria-label={t(L('视图', 'Views'))} onKeyDown={(e) => tabKeys(e, '[role="tab"]')}>
          {groups.map((g) => (
            <div key={g.name} className="flex flex-wrap items-center gap-1.5">
              {g.name && <span className={cx(groupLabel, 'mr-0.5')}>{g.name}</span>}
              {g.items.map((i) => (
                <button
                  key={i} type="button" role="tab"
                  aria-selected={i === state.view} tabIndex={i === state.view ? 0 : -1}
                  onClick={() => setState({ view: i, step: 0 })}
                  className={tabClass(i === state.view)}
                >
                  {t(views[i].label)}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 gap-[30px] items-start xl:grid-cols-[minmax(290px,380px)_minmax(0,1fr)]">
        <div className="grid gap-3.5 min-w-0">
          <p className="text-muted text-[14.5px]"><Rich text={view.intro} /></p>
          <ol className="grid gap-2">
            {view.steps.map((s, i) => (
              <li key={i}>
                <StepButton
                  dataAttr={String(i)} index={i} active={i === state.step}
                  title={t(s.title)} body={<Rich text={s.body} />}
                  onClick={() => setState({ ...state, step: i })}
                />
              </li>
            ))}
          </ol>
          <div className="flex gap-2 items-center">
            <button type="button" className={btnDefault} data-move="-1" disabled={state.step === 0} onClick={() => move(-1)}>
              {t(L('上一步', 'Previous'))}
            </button>
            <button type="button" className={btnPrimary} data-move="1" disabled={state.step === last} onClick={() => move(1)}>
              {t(L('下一步', 'Next'))}
            </button>
            <span className="ml-auto text-[13px] text-subtle tabular-nums">{state.step + 1} / {view.steps.length}</span>
          </div>
        </div>
        <figure className="m-0 min-w-0 -order-1 xl:order-none xl:sticky xl:top-[88px]">
          <WindowFrame id={view.shot}>
            <Stage id={view.shot} stageRef={stageRef} overlay={overlay} />
          </WindowFrame>
          <Caption>
            {t((META[view.shot] || [])[1])}
            {lightOnly ? ` · ${t(L('此截图为浅色模式', 'Shown in light mode'))}` : ''}
          </Caption>
        </figure>
      </div>
    </div>
  );
}
