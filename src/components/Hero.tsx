import { VALUES } from '../data/content';
import type { IconName } from '../data/icons';
import type { RoleKey, Tone } from '../data/types';
import { useI18n } from '../lib/i18n';
import { Compare } from './Screenshot';
import { Avatar, Band, Checks, Icon, IconBadge, SectionHead, Wrap, btnDefault, btnPrimary, eyebrow, lead } from './ui';

const FACTS: [IconName, Tone, string, string, string, string][] = [
  ['zap', '', '实时同步', 'Real time', '消息即时推送，断线重连后自动补齐。', 'Messages arrive instantly and catch up after a reconnect.'],
  ['route', 'green', '3 种分配策略', '3 routing modes', '按工作量、优先原客服、轮询分配。', 'By workload, previous agent first, or round-robin.'],
  ['globe', 'amber', '3 种界面语言', '3 languages', '简体中文、English、Português，访客也可自选。', '简体中文, English and Português, for visitors too.'],
  ['shield', 'violet', '3 种角色', '3 roles', '所有者、管理员、客服，权限在服务器端校验。', 'Owner, admin and agent, enforced on the server.'],
];


export function Hero({ onRoleJump }: { onRoleJump: (role: RoleKey) => void }) {
  const { tx } = useI18n();
  const roles: [RoleKey, string, string, string][] = [
    ['owner', 'O', '所有者', 'Owner'],
    ['admin', 'A', '管理员', 'Admin'],
    ['agent', 'C', '客服', 'Agent'],
  ];
  return (
    <section id="overview" className="pt-9 pb-12 xs:pt-[60px] xs:pb-[72px] scroll-mt-[112px] xl:scroll-mt-[76px]">
      <Wrap>
        <div className="grid grid-cols-1 gap-9 items-center lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-[52px]">
          <div>
            <p className={eyebrow}>{tx('产品使用教程 · 适用于所有者、管理员和客服', 'Product guide for owners, admins and agents')}</p>
            <h1 className="mt-3 text-[clamp(38px,5.4vw,58px)] font-extrabold tracking-[-0.02em] leading-[1.12]">{tx('在线客服', 'Chat Support')}</h1>
            <p className="text-[clamp(18px,2.1vw,22px)] font-[650] mt-4 leading-normal">
              {tx('从访客发起咨询，到客服接待、团队管理，在同一个工作台完成。', "From a visitor's first message to agent replies and team management, in one workspace.")}
            </p>
            <p className={`${lead} mt-3.5`}>
              {tx('教程中的截图全部来自真实系统（使用示例数据）。随时可以切换中文 / English 和浅色 / 深色模式，截图会一起切换。', 'Every screenshot comes from the real app, filled with sample data. Switch between 中文 and English or light and dark at any time, and the screenshots switch with you.')}
            </p>
            <div className="flex flex-wrap gap-2.5 mt-[26px]">
              <a className={btnPrimary} href="#chat">{tx('从会话工作台开始', 'Start with the chat workspace')}<Icon name="arrow" /></a>
              <a className={btnDefault} href="#roles">{tx('查看角色与权限', 'See roles and permissions')}</a>
            </div>
            <div className="mt-[22px] flex flex-wrap items-center gap-2 text-[13.5px] text-muted">
              <span>{tx('按角色阅读：', 'Read as:')}</span>
              {roles.map(([key, initial, zh, en]) => (
                <button
                  key={key} type="button" onClick={() => onRoleJump(key)}
                  className="border border-line bg-surface rounded-full py-1 pr-3 pl-1.5 inline-flex items-center gap-[7px] font-semibold text-fg hover:border-primary-border hover:bg-primary-soft"
                >
                  <Avatar role={key} small>{initial}</Avatar>{tx(zh, en)}
                </button>
              ))}
            </div>
          </div>
          <Compare id="inbox" />
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-[52px]">
          {FACTS.map(([icon, tone, zh, en, dzh, den]) => (
            <div key={icon} className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 items-start p-4 border border-line rounded-lg bg-surface">
              <IconBadge icon={icon} tone={tone} muted className="row-span-2" />
              <strong className="text-[15px]">{tx(zh, en)}</strong>
              <span className="text-muted text-[13.5px] leading-[1.55]">{tx(dzh, den)}</span>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

export function ValueSection() {
  const { t, tx } = useI18n();
  return (
    <Band id="value" alt>
      <SectionHead
        id="value"
        kicker={tx('产品价值', 'Why it works')}
        title={tx('快速、高效、安全', 'Fast, efficient and secure')}
        intro={tx('为日常接待量大的客服团队设计：消息不丢失、不重复，客服少走弯路，数据只有授权的人能看到。', 'Built for busy support teams: no lost or duplicated messages, fewer clicks for agents, and data only the right people can see.')}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {VALUES.map((v) => (
          <article key={v.icon} className="flex flex-col gap-4 p-[26px] border border-line rounded-lg bg-bg">
            <div className="flex items-center gap-3">
              <IconBadge icon={v.icon} tone={v.tone} />
              <h3 className="text-[19px] font-bold">{t(v.title)}</h3>
            </div>
            <div className="grid gap-0.5 pt-1 pb-0.5">
              <b className="text-[36px] font-extrabold tracking-[-0.02em] tabular-nums leading-[1.15]">{t(v.metric)}</b>
              <span className="text-[13px] text-muted">{t(v.metricLabel)}</span>
            </div>
            <Checks items={v.points} />
            {v.note && <p className="text-[12.5px] text-subtle border-t border-line pt-3 mt-auto">{t(v.note)}</p>}
          </article>
        ))}
      </div>
      <p className="mt-6">
        <a href="#how-it-works" className="inline-flex items-center gap-1.5 font-[650] text-[14.5px] no-underline">
          {tx('了解背后的技术和消息路线', 'See the technology behind it')}<Icon name="down" className="size-4" />
        </a>
      </p>
    </Band>
  );
}
