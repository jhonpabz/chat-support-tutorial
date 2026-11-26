import type { ReactNode } from 'react';
import { FAQ } from '../data/content';
import type { TourKey } from '../data/types';
import { useI18n } from '../lib/i18n';
import { GENERATED_AT } from '../lib/shots';
import { Compare } from './Screenshot';
import { Tour, type TourState } from './Tour';
import { Band, Card, Icon, SectionHead, Wrap, cx, pill } from './ui';

interface TourProps {
  tours: Record<TourKey, TourState>;
  setTour: (key: TourKey, next: TourState) => void;
}

const refGrid = 'grid grid-cols-1 lg:grid-cols-3 gap-4 mt-[34px]';

function Row({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(96px,auto)_1fr] gap-3 items-baseline text-[13.5px]">
      {label}
      <span className="text-muted">{children}</span>
    </div>
  );
}

const statePill = 'inline-flex items-center gap-1.5 font-[650] text-[13px] whitespace-nowrap [&_svg]:size-[15px]';
const refPill = cx(pill, 'text-[12.5px] bg-surface-2 text-fg');
const DOT = { online: 'bg-success', busy: 'bg-warning', away: 'bg-orange', offline: 'bg-subtle' };
const Dot = ({ kind }: { kind: keyof typeof DOT }) => <span className={cx('size-[9px] rounded-full inline-block flex-none', DOT[kind])} />;
const Check1 = '<path d="M20 6 9 17l-5-5"/>';
const Check2 = '<path d="M18 6 7 17l-5-5M22 10l-7.5 7.5L13 16"/>';
const Tick = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: d }} />
);
const cardTitle = 'text-[16px] font-bold';

export function ChatSection({ tours, setTour }: TourProps) {
  const { tx } = useI18n();
  return (
    <Band id="chat">
      <SectionHead
        id="chat"
        kicker={tx('重点功能 · 会话', 'Highlight · Chat')}
        title={tx('会话工作台：接待访客的完整流程', 'The chat workspace, step by step')}
        intro={tx('客服每天在这里接待访客。点击左侧的步骤，截图会高亮对应位置；也可以直接点击截图上的编号。点击截图可放大查看。', 'This is where agents spend their day. Pick a step to highlight it on the screenshot, or click a number on the screenshot. Click a screenshot to enlarge it.')}
      />
      <Tour tour="chat" state={tours.chat} setState={(next) => setTour('chat', next)} />
      <div className={refGrid}>
        <Card>
          <h3 className={cardTitle}>{tx('消息状态', 'Message states')}</h3>
          <div className="grid gap-2.5">
            <Row label={<span className={cx(statePill, 'text-subtle')}><Tick d={Check1} />{tx('已发送', 'Sent')}</span>}>{tx('服务器已保存这条消息。', 'The server has saved the message.')}</Row>
            <Row label={<span className={cx(statePill, 'text-subtle')}><Tick d={Check2} />{tx('已送达', 'Delivered')}</span>}>{tx('对方的设备已收到。', "The other side's device received it.")}</Row>
            <Row label={<span className={cx(statePill, 'text-success-text')}><Tick d={Check2} />{tx('已读', 'Read')}</span>}>{tx('对方正在查看对话时才会标记。', 'Marked only when the other side has the chat on screen.')}</Row>
            <Row label={<span className="inline-flex items-center gap-[5px] text-[12px] font-[650] px-2 py-px rounded-md border border-dashed border-primary-border bg-primary-soft text-primary-strong whitespace-nowrap">{tx('自动欢迎语 / 自动回复', 'Automatic welcome / reply')}</span>}>
              {tx('由系统发送，不计入人工回复和首次响应时间。', 'Sent by the system; never counted as a human reply or first response.')}
            </Row>
          </div>
        </Card>
        <Card>
          <h3 className={cardTitle}>{tx('键盘操作', 'Keyboard')}</h3>
          <div className="grid gap-2.5">
            <Row label={<span><kbd>Enter</kbd></span>}>{tx('发送回复（默认）。', 'Send the reply (default).')}</Row>
            <Row label={<span><kbd>Shift</kbd> + <kbd>Enter</kbd></span>}>{tx('换行。', 'New line.')}</Row>
            <Row label={<span><kbd>Ctrl</kbd> + <kbd>Enter</kbd></span>}>{tx('在「设置 › 常规」或个人偏好中改为此方式发送后，Enter 只换行。', 'Sends instead once chosen in Settings › General or your preferences; Enter then adds a line.')}</Row>
            <Row label={<span><kbd>Esc</kbd></span>}>{tx('关闭经典聊天窗口（可关闭此行为），草稿保留。', 'Closes the classic chat window (can be turned off); drafts stay.')}</Row>
          </div>
          <p className="text-[13px] text-muted">{tx('使用输入法组字时按 Enter 只确认文字，不会发送。', 'While an IME is composing, Enter only confirms the characters and never sends.')}</p>
        </Card>
        <Card>
          <h3 className={cardTitle}>{tx('网络中断时', 'If the connection drops')}</h3>
          <div className="grid gap-2.5">
            <Row label={<span className={refPill}><Dot kind="away" />{tx('正在重连…', 'Reconnecting…')}</span>}>{tx('页面提示「连接已中断，草稿已保留」并自动重试。', 'The page says the connection was interrupted, keeps your draft and retries.')}</Row>
            <Row label={<span className={refPill}>{tx('重试', 'Retry')}</span>}>{tx('未确认的消息可安全重试，服务器只会保存一份。', 'Unconfirmed messages can be retried safely; the server stores one copy.')}</Row>
            <Row label={<span className={refPill}><Dot kind="online" />{tx('已连接', 'Connected')}</span>}>{tx('重连后自动补齐期间的新消息。', 'Messages sent meanwhile are fetched after reconnecting.')}</Row>
          </div>
        </Card>
      </div>
    </Band>
  );
}

function Meter({ value, color }: { value: number; color: string }) {
  return (
    <span className="w-16 h-1.5 rounded-full bg-surface-3 inline-block overflow-hidden align-middle">
      <i className={cx('block h-full', color)} style={{ width: `${value}%` }} />
    </span>
  );
}

export function AgentsSection({ tours, setTour }: TourProps) {
  const { tx } = useI18n();
  const card = 'bg-bg';
  return (
    <Band id="agents" alt>
      <SectionHead
        id="agents"
        kicker={tx('重点功能 · 团队', 'Highlight · Team')}
        title={tx('客服管理：团队、容量与权限', 'Agent management: team, capacity and permissions')}
        intro={tx('所有者和管理员在「客服管理」中邀请成员、设置每个人能同时接待的会话数、调整权限，并决定新会话如何分配。', 'Owners and admins use Agent management to invite people, set how many chats each person handles at once, adjust permissions and decide how new chats are routed.')}
      />
      <Tour tour="agents" state={tours.agents} setState={(next) => setTour('agents', next)} />
      <div className={refGrid}>
        <Card className={card}>
          <h3 className={cardTitle}>{tx('在线状态', 'Availability')}</h3>
          <div className="grid gap-2.5">
            <Row label={<span className={refPill}><Dot kind="online" />{tx('在线', 'Online')}</span>}>{tx('可以自动分配到新会话。', 'Receives new chats automatically.')}</Row>
            <Row label={<span className={refPill}><Dot kind="busy" />{tx('忙碌', 'Busy')}</span>}>{tx('保持连接，但不再分配新会话。', 'Stays connected but gets no new chats.')}</Row>
            <Row label={<span className={refPill}><Dot kind="away" />{tx('离开', 'Away')}</span>}>{tx('同上；在线时 5 分钟无操作会自动变为离开。', 'The same; online agents idle for 5 minutes become Away.')}</Row>
            <Row label={<span className={refPill}><Dot kind="offline" />{tx('离线', 'Offline')}</span>}>{tx('断开 60 秒后，进行中的会话退回队列。', 'After 60 s disconnected, active chats return to the queue.')}</Row>
          </div>
        </Card>
        <Card className={card}>
          <h3 className={cardTitle}>{tx('工作量', 'Workload')}</h3>
          <div className="grid gap-2.5">
            <Row label={<span className={refPill}><Meter value={100} color="bg-orange" />4 / 4</span>}>{tx('已达容量上限，暂停自动分配。', 'At capacity, so automatic assignment pauses.')}</Row>
            <Row label={<span className={refPill}><Meter value={33} color="bg-primary" />2 / 6</span>}>{tx('还能接待 4 个会话。', 'Room for four more chats.')}</Row>
          </div>
          <p className="text-[13px] text-muted">{tx('会话上限可设为 1–100。调低到当前负载以下时，已有会话不受影响，只是不再分配新会话。', 'Capacity ranges from 1 to 100. Lowering it below the current load keeps existing chats and only pauses new ones.')}</p>
        </Card>
        <Card className={card}>
          <h3 className={cardTitle}>{tx('连接时保持在线', 'Stay online while connected')}</h3>
          <p className="text-[14px] text-muted">{tx('勾选后，长时间未操作也不会被自动设为「离开」。它不会伪造连接：浏览器断开后，客服仍显示为离线，会话照常退回队列。', 'When ticked, long inactivity no longer switches you to Away. It never fakes a connection: once the browser disconnects you show as offline and chats return to the queue as usual.')}</p>
        </Card>
      </div>
    </Band>
  );
}

export function AppearanceSection({ tours, setTour }: TourProps) {
  const { tx } = useI18n();
  return (
    <Band id="appearance" alt>
      <SectionHead
        id="appearance"
        kicker={tx('个性化', 'Personal settings')}
        title={tx('浅色、深色与界面语言', 'Light, dark and your language')}
        intro={tx('每位成员都可以按自己的习惯设置界面，这些控件都在页面顶部。拖动下方滑块对比会话工作台的浅色和深色效果。', 'Everyone can set the interface up their own way; the controls sit in the top bar. Drag the slider below to compare the conversations workspace in light and dark.')}
      />
      <Tour tour="look" state={tours.look} setState={(next) => setTour('look', next)} />
      <Compare id="inbox" className="mt-[34px]" />
    </Band>
  );
}

export function FaqSection() {
  const { t, tx } = useI18n();
  return (
    <Band id="faq">
      <SectionHead id="faq" kicker={tx('常见问题', 'FAQ')} title={tx('大家常问的问题', 'Questions people ask')} />
      <div className="grid gap-2.5 max-w-[900px]">
        {FAQ.map(([q, a], i) => (
          <details key={i} className="group border border-line rounded-lg bg-surface">
            <summary className="cursor-pointer flex gap-3 items-center px-[18px] py-[15px] font-[650]">
              {t(q)}
              <Icon name="chev" className="ml-auto size-4 text-subtle transition-transform duration-200 flex-none group-open:rotate-180" />
            </summary>
            <p className="px-[18px] pb-4 text-muted text-[14.5px]">{t(a)}</p>
          </details>
        ))}
      </div>
    </Band>
  );
}

export function Footer() {
  const { lang, tx } = useI18n();
  const date = GENERATED_AT ? new Date(GENERATED_AT) : null;
  const shotDate = date && !Number.isNaN(date.getTime())
    ? `· ${tx('截图更新于', 'Screenshots captured')} ${date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`
    : '';
  return (
    <footer className="pt-10 pb-8 border-t border-line text-subtle text-[13px]">
      <Wrap>
        <div className="grid grid-cols-1 tab:grid-cols-[minmax(0,1fr)_auto] gap-x-14 gap-y-6 items-start">
          <div className="grid gap-2.5 max-w-[82ch]">
            <p><strong className="text-fg">{tx('在线客服 · 产品使用教程', 'Chat Support · Product guide')}</strong> <span>{shotDate}</span></p>
            <p>{tx('截图来自开发版本中的示例工作区：「暖巢家居」及其中的人物、订单和联系方式均为虚构，邮箱使用保留域名 .example，IP 地址使用文档专用网段。', 'Screenshots come from a sample workspace in the development build. "Cozynest" and every person, order and contact in it are fictional; e-mail addresses use the reserved .example domain and IP addresses come from documentation ranges.')}</p>
            <p>{tx('本教程描述 2026 年 11 月的版本。仍在开发中的功能包括：PDF 与文本附件、表情和链接工具、审计日志页面、所有权转移，以及数据永久删除。', 'This guide describes the November 2026 build. Still in development: PDF and text attachments, the emoji and link tools, an audit log page, ownership transfer and permanent data deletion.')}</p>
          </div>
          <aside className="flex items-center gap-[11px] py-2 pr-4 pl-[9px] border border-line rounded-full bg-surface shadow-xs justify-self-start tab:justify-self-auto" aria-label="开发者 / Developer">
            <img
              src="/avatar.webp" width={36} height={36} alt="" decoding="async"
              className="flex-none size-9 rounded-full object-cover bg-surface-2 shadow-[0_0_0_1.5px_var(--surface),0_0_0_3px_var(--orange)]"
            />
            <p className="text-[12.5px] font-bold text-subtle leading-[1.4] whitespace-nowrap en:uppercase en:tracking-[0.08em] en:text-[11px]">
              {tx('设计与开发', 'Designed and built by')}
            </p>
          </aside>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 mt-7 pt-[18px] border-t border-line">
          <p>{tx('© 2026 在线客服。保留所有权利。', '© 2026 Chat Support. All rights reserved.')}</p>
          <a href="#overview" className="inline-flex items-center gap-1.5 font-[650] no-underline">
            {tx('回到顶部', 'Back to top')}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-3.5">
              <path d="M12 19V5M6 11l6-6 6 6" />
            </svg>
          </a>
        </div>
      </Wrap>
    </footer>
  );
}
