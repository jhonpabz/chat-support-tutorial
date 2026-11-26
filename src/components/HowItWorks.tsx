import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { ALSO, DG_DESC, DG_LABELS, DG_NODES, DG_STEP, DIAGRAMS, JOURNEY, PLAY, STACK } from '../data/content';
import { ICON } from '../data/icons';
import { L, useI18n } from '../lib/i18n';
import { useReducedMotion } from '../lib/theme';
import { Band, Card, Checks, Icon, IconBadge, SectionHead, StepButton, btnDefault, btnPrimary, cx, groupLabel, Rich } from './ui';

type Kind = 'wide' | 'tall';

/** Message route drawn as inline SVG; two layouts (wide, and tall for phones). */
function RouteDiagram({ kind, step, svgRef }: { kind: Kind; step: number; svgRef: React.Ref<SVGSVGElement> }) {
  const { t } = useI18n();
  const G = DIAGRAMS[kind];
  const p = `jr-${kind}`;
  const s = JOURNEY[step];
  const active = new Set(s.route.map(([id]) => id));
  const tall = kind === 'tall';

  const head = (on: boolean) => (
    <marker
      id={`${p}-a${on ? '-on' : ''}`} viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse"
      markerWidth={G.arrow} markerHeight={G.arrow} orient="auto-start-reverse"
    >
      <path d="M0 0 10 5 0 10z" className={on ? 'fill-primary' : 'fill-line-strong'} />
    </marker>
  );

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${G.w} ${G.h}`} role="img" aria-labelledby={`${p}-t ${p}-d`}
      className={cx('w-full h-auto mx-auto', tall ? 'block max-w-[400px] sm:hidden' : 'hidden max-w-[860px] sm:block')}
    >
      <title id={`${p}-t`}>{t(L('消息路线图', 'Message route diagram'))}</title>
      <desc id={`${p}-d`}>{t(DG_DESC)}</desc>
      <defs>{head(false)}{head(true)}</defs>
      {Object.entries(G.links).map(([id, l]) => {
        const on = active.has(id);
        const m = `url(#${p}-a${on ? '-on' : ''})`;
        return (
          <g key={id} data-link={id}>
            <path
              d={l.d} markerEnd={m} markerStart={l.both ? m : undefined}
              className={cx(
                'fill-none transition-[stroke] duration-300',
                on ? 'stroke-primary [stroke-width:2.5]' : 'stroke-line-strong [stroke-width:2]',
                l.dash && '[stroke-dasharray:5_4]',
              )}
            />
            {G.labels && l.label && (
              <text x={l.label[0]} y={l.label[1]} textAnchor={l.label[2]} className={cx('font-sans font-semibold text-[12px]', on ? 'fill-primary-strong' : 'fill-subtle')}>
                {t(DG_LABELS[id])}
              </text>
            )}
            <g>
              <circle
                cx={l.badge[0]} cy={l.badge[1]} r={G.badge}
                className={cx('[stroke-width:1.5] transition-[fill,stroke] duration-300', on ? 'fill-marker stroke-marker' : 'fill-surface stroke-line-strong')}
              />
              <text
                x={l.badge[0]} y={l.badge[1]} dy="0.35em" textAnchor="middle"
                className={cx('font-sans font-extrabold', tall ? 'text-[12.5px]' : 'text-[11.5px]', on ? 'fill-on-marker' : 'fill-muted')}
              >
                {DG_STEP[id]}
              </text>
            </g>
          </g>
        );
      })}
      {Object.entries(G.nodes).map(([id, r]) => {
        const n = DG_NODES[id];
        const on = s.nodes.includes(id);
        const iy = r.top ? r.y + 14 : r.y + r.h / 2 - G.icon / 2;
        const tx = r.x + 16 + G.icon + 12;
        const ty = r.top ? r.y + 31 : r.y + r.h / 2 - 3;
        const sub = r.top ? '' : (G.short && n.short) || n.sub;
        return (
          <g key={id}>
            <rect
              x={r.x} y={r.y} width={r.w} height={r.h} rx={12}
              className={cx('transition-[fill,stroke] duration-300', on ? 'fill-primary-soft stroke-primary [stroke-width:2]' : 'fill-surface-2 stroke-line-strong [stroke-width:1.5]')}
            />
            <svg
              x={r.x + 16} y={iy} width={G.icon} height={G.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
              className={cx('transition-colors duration-300', on ? 'text-primary' : 'text-subtle')}
              dangerouslySetInnerHTML={{ __html: ICON[n.icon] }}
            />
            <text x={tx} y={ty} className={cx('font-sans font-[750] fill-fg', tall ? 'text-[16px]' : 'text-[15px]')}>{t(n.title)}</text>
            {sub && (
              <text x={tx} y={ty + (tall ? 18 : 17)} className={cx('font-sans font-medium fill-muted', tall ? 'text-[13.5px]' : 'text-[12.5px]')}>
                {t(sub)}
              </text>
            )}
            {id === 'api' && Object.entries(G.pills).map(([pid, q]) => {
              const pillOn = pid === s.pill;
              return (
                <g key={pid}>
                  <rect
                    x={q.x} y={q.y} width={q.w} height={q.h} rx={q.h / 2}
                    className={cx('[stroke-width:1.2] transition-[fill,stroke] duration-300', pillOn ? 'fill-primary stroke-primary' : 'fill-surface stroke-line-strong')}
                  />
                  <text
                    x={q.x + q.w / 2} y={q.y + q.h / 2} dy="0.35em" textAnchor="middle"
                    className={cx('font-mono font-[650]', tall ? 'text-[13.5px]' : 'text-[12px]', pillOn ? 'fill-on-primary' : 'fill-muted')}
                  >
                    {q.text}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
      <circle data-dot r={G.dot} cx={-20} cy={-20} opacity={0} className="fill-primary stroke-surface [stroke-width:3]" />
    </svg>
  );
}

function Journey() {
  const { t, lang } = useI18n();
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [live, setLive] = useState('');
  const run = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const wideRef = useRef<SVGSVGElement>(null);
  const tallRef = useRef<SVGSVGElement>(null);
  const last = JOURNEY.length - 1;

  // Moves the dot along a step's route (skipped with reduced motion).
  const animateRoute = (index: number, done?: () => void) => {
    const id = ++run.current;
    const svgEl = [wideRef.current, tallRef.current].find((el) => el && el.getBoundingClientRect().width > 0);
    const dot = svgEl?.querySelector<SVGCircleElement>('[data-dot]');
    const segments = svgEl
      ? JOURNEY[index].route
          .map(([link, dir]) => [svgEl.querySelector<SVGPathElement>(`[data-link="${link}"] path`), dir] as const)
          .filter(([path]) => path)
      : [];
    if (!dot || !segments.length || reduceMotion) { done?.(); return; }
    let i = 0;
    let start = 0;
    dot.setAttribute('opacity', '1');
    const frame = (now: number) => {
      if (id !== run.current) return;
      const [path, dir] = segments[i];
      const length = path!.getTotalLength();
      if (!start) start = now;
      const p = Math.min((now - start) / Math.max(420, length * 5), 1);
      const eased = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
      const point = path!.getPointAtLength(dir > 0 ? length * eased : length * (1 - eased));
      dot.setAttribute('cx', point.x.toFixed(1));
      dot.setAttribute('cy', point.y.toFixed(1));
      if (p < 1) { requestAnimationFrame(frame); return; }
      i += 1;
      start = 0;
      if (i < segments.length) { requestAnimationFrame(frame); return; }
      setTimeout(() => { if (id === run.current) dot.setAttribute('opacity', '0'); }, 600);
      done?.();
    };
    requestAnimationFrame(frame);
  };

  // Autoplay: animate the current hop, pause, then advance.
  useEffect(() => {
    if (!playing) return;
    let cancelled = false;
    let timer = 0;
    setLive(`${step + 1} / ${JOURNEY.length} · ${t(JOURNEY[step].title)}`);
    animateRoute(step, () => {
      if (cancelled) return;
      timer = window.setTimeout(() => {
        if (cancelled) return;
        if (step >= last) setPlaying(false);
        else setStep(step + 1);
      }, reduceMotion ? 4000 : 2600);
    });
    return () => { cancelled = true; clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, step]);

  // A language switch stops playback, as the original page re-rendered.
  useEffect(() => { setPlaying(false); run.current += 1; }, [lang]);

  // Show the first hop once when the section first comes into view.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      animateRoute(0);
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goStep = (next: number) => {
    flushSync(() => { setPlaying(false); setStep(next); });
    animateRoute(next);
  };
  const move = (delta: number) => {
    const next = Math.min(Math.max(step + delta, 0), last);
    goStep(next);
    if (next === 0 || next === last) rootRef.current?.querySelector<HTMLElement>('[data-step-btn][aria-current="step"]')?.focus();
  };
  const togglePlay = () => {
    if (playing) { setPlaying(false); return; }
    if (step >= last) setStep(0);
    setPlaying(true);
  };
  const mode = playing ? 'pause' : step === last ? 'replay' : 'play';

  return (
    <div ref={rootRef} className="grid grid-cols-1 gap-[30px] items-start xl:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]">
      <div className="grid gap-3.5 min-w-0">
        <ol className="grid gap-2">
          {JOURNEY.map((s, i) => (
            <li key={i}>
              <StepButton
                dataAttr={String(i)} index={i} active={i === step} printAll
                title={t(s.title)} body={<Rich text={s.body} />}
                extra={(
                  <span className={cx('mt-2 font-mono text-[12px] leading-[1.55] text-subtle print:block', i === step ? 'block' : 'hidden')}>
                    {t(s.tech)}
                  </span>
                )}
                onClick={() => goStep(i)}
              />
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-2 items-center print:hidden">
          <button type="button" className={btnPrimary} onClick={togglePlay}>
            <Icon name={mode} />{t(PLAY[mode])}
          </button>
          <button type="button" className={btnDefault} disabled={step === 0} onClick={() => move(-1)}>{t(L('上一步', 'Previous'))}</button>
          <button type="button" className={btnDefault} disabled={step === last} onClick={() => move(1)}>{t(L('下一步', 'Next'))}</button>
          <span className="ml-auto text-[13px] text-subtle tabular-nums">{step + 1} / {JOURNEY.length}</span>
        </div>
        <p className="sr-only" aria-live="polite">{live}</p>
      </div>
      <figure className="m-0 min-w-0 grid gap-3 -order-1 xl:order-none xl:sticky xl:top-[88px] print:static">
        <div className="p-2.5 sm:p-[18px] border border-line rounded-lg bg-surface shadow-sm">
          <RouteDiagram kind="wide" step={step} svgRef={wideRef} />
          <RouteDiagram kind="tall" step={step} svgRef={tallRef} />
        </div>
        <figcaption className="text-[13px] text-subtle">
          {t(L('圆圈中的编号对应各个步骤；虚线是返回给发送者的确认。', 'Numbers in circles match the steps; the dashed line is the confirmation back to the sender.'))}
        </figcaption>
        <p className="grid grid-cols-[18px_1fr] gap-2.5 px-3.5 py-3 rounded-[10px] bg-surface-2 text-muted text-[13.5px] leading-[1.6]">
          <Icon name="shield" className="size-[17px] mt-[3px] text-success" />
          <span>{t(L('提醒本身不含消息内容：消息文字从不经过 Redis，每次读取都会重新核对权限。即使错过一次提醒也没关系，页面在重新连接时和定期检查时都会自动补齐。', 'The nudge itself carries no message: message text never passes through Redis, and every read is checked again. A missed nudge does no harm, because the page also catches up when it reconnects and at regular intervals.'))}</span>
        </p>
      </figure>
    </div>
  );
}

export function HowItWorks() {
  const { t, tx } = useI18n();
  return (
    <Band id="how-it-works">
      <SectionHead
        id="how-it-works"
        kicker={tx('工作原理 · 技术架构', 'How it works')}
        title={tx('一条消息是怎样送达的', 'How a message travels')}
        intro={tx('在线客服由 Node.js + Express、Socket.io、Redis 和 PostgreSQL 组成，每个部分只负责一件事。点击步骤或「播放」，跟随一条消息从客服按下发送，到出现在访客的屏幕上。', 'Chat Support is built from Node.js with Express, Socket.io, Redis and PostgreSQL, and each part has one job. Pick a step or press Play to follow a message from the agent’s Send button to the visitor’s screen.')}
      />
      <Journey />
      <div className="grid gap-1.5 mt-[52px] mb-[18px] max-w-[780px]">
        <h3 className="text-[19px] font-bold">{tx('为什么用这套技术构建客服系统', 'Why this stack suits a chat system')}</h3>
        <p className="text-muted text-[14.5px]">{tx('客服系统需要同时做到三件事：连接多、更新快、记录不能出错。每项技术负责其中一部分。', 'A chat system has to do three things at once: hold many open connections, update instantly and never get the record wrong. Each technology covers one part of that.')}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STACK.map((s) => (
          <article key={s.name} className="border border-line rounded-lg bg-surface p-5 flex flex-col gap-3.5">
            <div className="flex items-center gap-3">
              <IconBadge icon={s.icon} tone={s.tone} />
              <div>
                <h4 className="text-[16px] font-bold leading-[1.35]">{s.name}</h4>
                <p className="text-[12.5px] font-bold text-primary">{t(s.role)}</p>
              </div>
            </div>
            <p className="text-[13.5px] text-muted">{t(s.what)}</p>
            <Checks items={s.points} className="gap-2" liClassName="text-[13.5px] leading-[1.6]" />
            <p className="flex flex-wrap gap-1.5 mt-auto pt-0.5">
              {s.ver.map((v) => (
                <span key={v} className="font-mono text-[11.5px] font-semibold px-2 py-px rounded-md border border-line bg-surface-2 text-muted">{v}</span>
              ))}
            </p>
          </article>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-4 mt-4">
        <div className="border border-line rounded-lg bg-surface p-5 grid grid-cols-[auto_1fr] gap-3 items-start content-start">
          <IconBadge icon="shield" tone="green" />
          <div>
            <h4 className="text-[16px] font-bold">{tx('为什么这样组合', 'Why this combination works')}</h4>
            <p className="text-muted text-[14px] mt-1.5">{tx('每个部分只做一件事。即使 Redis 或实时连接短暂中断，已确认的消息也不会丢失：所有已确认的消息都已保存在 PostgreSQL 中，页面恢复连接后会自动补齐。', 'Each part does one job. If Redis or a live connection drops for a moment, nothing that was confirmed is lost: every confirmed message is already in PostgreSQL, and pages catch up as soon as they reconnect.')}</p>
            <p className="text-muted text-[14px] mt-1.5">{tx('全部组件都通过 Docker Compose 部署在您自己的服务器上，不依赖第三方聊天云服务。', 'Every component runs on your own servers with Docker Compose; there is no third-party chat cloud.')}</p>
          </div>
        </div>
        <Card>
          <h4 className="text-[16px] font-bold">{tx('技术栈中还包括', 'Also in the stack')}</h4>
          {ALSO.map(([label, items], i) => (
            <div key={i} className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
              <span className={cx(groupLabel, 'basis-full')}>{t(label)}</span>
              {items.map((x, j) => <span key={j} className={'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12.5px] font-semibold bg-surface-2 text-fg border border-line'}>{t(x)}</span>)}
            </div>
          ))}
        </Card>
      </div>
    </Band>
  );
}

