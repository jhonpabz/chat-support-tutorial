import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type Ref } from 'react';
import { META } from '../data/content';
import { L, useI18n } from '../lib/i18n';
import { getShot } from '../lib/shots';
import { useTheme } from '../lib/theme';
import { Icon, cx } from './ui';

export const LightboxContext = createContext<(id: string) => void>(() => {});
export const useLightbox = () => useContext(LightboxContext);

export function useShot(id: string, theme?: 'light' | 'dark') {
  const { lang } = useI18n();
  const current = useTheme();
  return getShot(id, lang, theme ?? current);
}

export function WindowFrame({ id, children }: { id: string; children: ReactNode }) {
  const { t } = useI18n();
  const open = useLightbox();
  const meta = META[id] || ['', ''];
  return (
    <div className="rounded-xl overflow-hidden bg-surface border border-line-strong shadow-lg">
      <div className="flex items-center gap-2.5 h-[34px] px-3 bg-surface-2 border-b border-line">
        <span className="flex gap-1.5 flex-none" aria-hidden="true">
          {[0, 1, 2].map((i) => <i key={i} className="block size-2.5 rounded-full bg-line-strong" />)}
        </span>
        <span className="flex-1 min-w-0 max-w-[460px] mx-auto font-mono text-[11.5px] text-subtle bg-surface border border-line rounded-md px-2.5 py-px text-center whitespace-nowrap overflow-hidden text-ellipsis">
          {t(meta[0])}
        </span>
        <button
          type="button"
          onClick={() => open(id)}
          aria-label={t(L('放大截图', 'Enlarge screenshot'))}
          className="flex-none bg-transparent text-subtle size-[26px] rounded-md grid place-items-center hover:bg-surface-3 hover:text-fg"
        >
          <Icon name="zoom" className="size-[15px]" />
        </button>
      </div>
      {children}
    </div>
  );
}

/** The screenshot itself; `overlay` (spotlight + markers) is drawn on landscape shots only. */
export function Stage({ id, overlay, stageRef }: { id: string; overlay?: ReactNode; stageRef?: Ref<HTMLDivElement> }) {
  const { t } = useI18n();
  const open = useLightbox();
  const image = useShot(id);
  const meta = META[id] || ['', ''];
  if (!image) {
    return (
      <div className="relative overflow-hidden bg-surface-2">
        <div className="aspect-[16/10] grid place-items-center text-subtle text-sm p-6 text-center">
          {t(L('截图尚未嵌入。运行 tests/tutorial/capture.ts 生成截图。', 'Screenshots are not embedded yet. Run tests/tutorial/capture.ts to generate them.'))}
        </div>
      </div>
    );
  }
  const mobile = image.w < image.h;
  return (
    <div ref={stageRef} className={cx('relative overflow-hidden bg-surface-2', mobile && 'flex justify-center py-[18px]')}>
      <img
        src={image.src} width={image.w} height={image.h} alt={t(meta[1])} decoding="async"
        onClick={() => open(id)}
        className={cx(
          'block h-auto cursor-zoom-in',
          mobile ? 'w-[min(300px,70%)] rounded-[18px] border border-line-strong shadow-sm' : 'w-full',
        )}
      />
      {!mobile && overlay}
    </div>
  );
}

export function Caption({ children }: { children: ReactNode }) {
  return <figcaption className="text-[13px] text-subtle mt-2.5">{children}</figcaption>;
}

export function Lightbox({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { t } = useI18n();
  const ref = useRef<HTMLDialogElement>(null);
  const image = useShot(id ?? '');
  const meta = (id && META[id]) || ['', ''];

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (id && image && !dialog.open && typeof dialog.showModal === 'function') dialog.showModal();
  }, [id, image]);

  return (
    <dialog
      ref={ref}
      aria-label="截图 / Screenshot"
      onClose={onClose}
      onClick={(event) => { if (event.target === ref.current) ref.current?.close(); }}
      className="m-auto p-0 border-0 bg-transparent max-w-[min(1500px,96vw)] max-h-[94vh] overflow-visible"
    >
      <div className="grid gap-2.5">
        <div className="flex items-center gap-3 text-white text-[13.5px]">
          <span className="flex-1 min-w-0">{id ? `${t(meta[1])} · ${t(meta[0])}` : ''}</span>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="border-0 bg-white/14 text-white rounded-lg min-h-[34px] px-3 font-[650] hover:bg-white/24"
          >
            {t(L('关闭', 'Close'))} <kbd className="bg-transparent text-inherit border-white/35">Esc</kbd>
          </button>
        </div>
        <div className="max-h-[86vh] overflow-auto rounded-[10px] bg-surface">
          {image && <img src={image.src} alt={t(meta[1])} className="block max-w-full h-auto" />}
        </div>
      </div>
    </dialog>
  );
}

/** Light / dark slider over the same screen. */
export function Compare({ id, className }: { id: string; className?: string }) {
  const { t } = useI18n();
  const [pos, setPos] = useState(50);
  const a = useShot(id, 'light');
  const b = useShot(id, 'dark');
  const meta = META[id] || ['', ''];
  if (!a || !b || a === b) {
    return <figure className={cx('m-0', className)}><WindowFrame id={id}><Stage id={id} /></WindowFrame></figure>;
  }
  return (
    <figure className={cx('m-0', className)}>
      <WindowFrame id={id}>
        <div className="group relative overflow-hidden bg-surface-2 cursor-ew-resize touch-pan-y">
          <img
            src={a.src} width={a.w} height={a.h} draggable={false}
            alt={`${t(meta[1])} · ${t(L('浅色', 'light'))}`}
            className="block w-full h-auto select-none [-webkit-user-drag:none]"
          />
          <img
            src={b.src} draggable={false}
            alt={`${t(meta[1])} · ${t(L('深色', 'dark'))}`}
            style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
            className="absolute inset-0 size-full object-cover select-none [-webkit-user-drag:none]"
          />
          <span className="absolute top-2.5 left-2.5 z-[2] px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-surface text-fg border border-line-strong pointer-events-none">
            {t(L('浅色', 'Light'))}
          </span>
          <span className="absolute top-2.5 right-2.5 z-[2] px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-surface text-fg border border-line-strong pointer-events-none">
            {t(L('深色', 'Dark'))}
          </span>
          <span
            style={{ left: `${pos}%` }}
            className="absolute inset-y-0 w-0.5 -ml-px bg-surface shadow-[0_0_0_1px_var(--border-strong)] pointer-events-none z-[2]"
          >
            <span className="absolute top-1/2 left-1/2 size-[34px] -mt-[17px] -ml-[17px] rounded-full bg-surface border border-line-strong shadow-sm group-focus-within:shadow-[0_0_0_3px_var(--ring)]" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[52%] text-[15px] leading-[1.7] text-muted z-[1]">↔</span>
          </span>
          <input
            type="range" min={0} max={100} value={pos}
            onChange={(event) => setPos(Number(event.target.value))}
            aria-label={t(L('拖动对比浅色与深色', 'Drag to compare light and dark'))}
            className="absolute inset-0 size-full m-0 opacity-0 cursor-ew-resize z-[3]"
          />
        </div>
      </WindowFrame>
      <Caption>{t(L('拖动滑块对比同一界面的浅色与深色模式。', 'Drag the slider to compare the same screen in light and dark.'))}</Caption>
    </figure>
  );
}
