import { MATRIX, MENU, PERM, ROLES } from '../data/content';
import type { Link, PermKind, RoleKey } from '../data/types';
import { L, useI18n } from '../lib/i18n';
import { Avatar, Band, Bold, Icon, Num, Rich, SectionHead, cx, tabKeys } from './ui';

const ROLE_KEYS = Object.keys(ROLES) as RoleKey[];

const PERM_STYLE: Record<PermKind, string> = {
  yes: 'bg-success-soft text-success-text',
  no: 'bg-surface-2 text-subtle',
  grant: 'bg-warning-soft text-warning-text',
  scope: 'bg-primary-soft text-primary-strong',
};

function Perm({ kind, inCurrent }: { kind: PermKind; inCurrent?: boolean }) {
  const { t } = useI18n();
  const [label, icon] = PERM[kind];
  return (
    <span className={cx(
      'inline-flex items-center gap-[5px] px-[9px] py-px rounded-full text-[12.5px] font-[650] whitespace-nowrap',
      inCurrent && kind === 'scope' ? 'bg-surface text-primary-strong' : PERM_STYLE[kind],
    )}
    >
      <Icon name={icon} className="size-[13px]" />{t(label)}
    </span>
  );
}

export function Roles({ role, setRole, goTo }: { role: RoleKey; setRole: (role: RoleKey) => void; goTo: (link: Link) => void }) {
  const { t, tx } = useI18n();
  const r = ROLES[role];
  // Matches the original, where `.role-intro p` (14.5px, muted) outranked `.menu-group` except in English.
  const menuGroup = 'text-[14.5px] font-bold text-muted px-2.5 pt-2 pb-0.5 en:uppercase en:tracking-[0.07em] en:text-[10.5px]';

  return (
    <Band id="roles" alt>
      <SectionHead
        id="roles"
        kicker={tx('角色与权限', 'Roles and permissions')}
        title={tx('三种角色，各司其职', 'Three roles, clear responsibilities')}
        intro={tx('切换角色，查看该角色能看到的菜单、常用操作流程和完整权限。所有权限都由服务器校验，界面上的隐藏或灰色按钮只是提示。', "Switch roles to see each one's menu, everyday tasks and full permissions. The server enforces every permission; hidden or greyed-out buttons are only hints.")}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3" role="tablist" aria-label="角色 / Role" onKeyDown={(e) => tabKeys(e, '[role="tab"]')}>
        {ROLE_KEYS.map((key) => {
          const x = ROLES[key];
          const selected = key === role;
          return (
            <button
              key={key} type="button" role="tab" id={`role-${key}`}
              aria-selected={selected} aria-controls="role-panel" tabIndex={selected ? 0 : -1}
              onClick={() => setRole(key)}
              className={cx(
                'text-left grid grid-cols-[auto_1fr] gap-x-3 gap-y-[3px] items-center px-4 py-3.5 rounded-lg border',
                selected ? 'border-primary shadow-[0_0_0_1px_var(--primary)] bg-primary-soft' : 'border-line bg-surface hover:border-line-strong',
              )}
            >
              <span className="row-span-2"><Avatar role={key}>{t(x.initial)}</Avatar></span>
              <strong className="text-[16px]">{t(x.name)} · {t(x.person)}</strong>
              <small className="text-muted text-[13px] leading-[1.45]">{t(x.tagline)}</small>
            </button>
          );
        })}
      </div>

      <div id="role-panel" role="tabpanel" aria-labelledby={`role-${role}`} className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-6 mt-6 items-start">
        <div className="grid gap-4">
          <p className="text-muted text-[14.5px]">{t(r.desc)}</p>
          <div className="border border-line rounded-lg bg-surface px-2.5 py-3.5 grid gap-1" aria-label={t(L('左侧菜单', 'Sidebar menu'))}>
            <h4 className="text-[13px] text-muted px-2 pb-1.5 font-[650]">{tx('左侧菜单中可见的页面', 'Pages in the sidebar')}</h4>
            {MENU.map((g, gi) => (
              <div key={gi} className="contents">
                <p className={menuGroup}>{t(g.group)}</p>
                {g.items.map(([icon, label, grant], i) => {
                  const hidden = g.manage && r.menu.manage === 'agent';
                  return (
                    <div key={i} className={cx('flex items-center gap-2.5 px-2.5 py-[5px] rounded-[7px] text-[13.5px]', hidden && 'text-subtle')}>
                      <Icon name={icon} className="size-[15px] text-subtle flex-none" />
                      <span className={cx(hidden && 'line-through decoration-line-strong')}>{t(label)}</span>
                      {hidden && (
                        <span className={cx(
                          'ml-auto text-[11px] font-[650] px-[7px] rounded-full whitespace-nowrap',
                          grant ? 'bg-warning-soft text-warning-text' : 'bg-surface-2 text-subtle',
                        )}
                        >
                          {grant ? tx('需授权', 'With grant') : tx('不显示', 'Hidden')}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-2.5">
          {r.tasks.map((task, i) => (
            <details key={`${role}-${i}`} open={i === 0} className="group border border-line rounded-lg bg-surface">
              <summary className="cursor-pointer flex items-center gap-3 px-4 py-3.5 font-[650] text-[15px]">
                <Num n={i + 1} />
                <span>{t(task.title)}</span>
                <Icon name="chev" className="ml-auto size-4 text-subtle transition-transform duration-200 flex-none group-open:rotate-180" />
              </summary>
              <div className="pr-4 pb-4 pl-4 xs:pl-14 grid gap-3">
                <ol className="list-decimal pl-[1.2em] grid gap-1.5 text-fg text-[14px]">
                  {task.steps.map((s, j) => <li key={j}><Rich text={s} /></li>)}
                </ol>
                {task.example && (
                  <p className="text-[13.5px] bg-surface-2 rounded-[10px] px-3 py-2.5 text-muted"><Bold text={task.example} /></p>
                )}
                <button
                  type="button" onClick={() => goTo(task.link)}
                  className="justify-self-start inline-flex items-center gap-1.5 text-[13.5px] font-[650] bg-transparent border-0 p-0 text-primary"
                >
                  {tx('查看图解', 'See it on screen')}<Icon name="arrow" className="size-[15px]" />
                </button>
              </div>
            </details>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3 mt-11 mb-3.5">
        <h3 id="matrix-title" className="text-[19px] font-bold">{tx('权限对照表', 'Permission matrix')}</h3>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PERM) as PermKind[]).map((k) => <Perm key={k} kind={k} />)}
        </div>
      </div>
      <div className="overflow-x-auto border border-line rounded-lg bg-surface" tabIndex={0} role="region" aria-labelledby="matrix-title">
        <table className="w-full min-w-[660px] border-collapse text-[14px] [&_th]:px-3.5 [&_th]:py-2.5 [&_td]:px-3.5 [&_td]:py-2.5 [&_th]:border-b [&_td]:border-b [&_th]:border-line [&_td]:border-line [&_th]:text-left [&_td]:text-left [&_th]:align-top [&_td]:align-top [&_tbody_tr:last-child>*]:border-b-0">
          <thead>
            <tr>
              <th scope="col" className="sticky top-0 bg-surface text-[13px] text-muted font-bold">{tx('能力', 'Capability')}</th>
              {ROLE_KEYS.map((key) => (
                <th key={key} scope="col" className={cx('sticky top-0 w-[140px] text-[13px] font-bold', key === role ? 'bg-primary-soft text-primary-strong' : 'bg-surface text-muted')}>
                  {t(ROLES[key].name)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MATRIX.map((g, gi) => (
              <MatrixGroupRows key={gi} group={g} role={role} />
            ))}
          </tbody>
        </table>
      </div>
    </Band>
  );
}

function MatrixGroupRows({ group, role }: { group: (typeof MATRIX)[number]; role: RoleKey }) {
  const { t } = useI18n();
  return (
    <>
      <tr>
        <th colSpan={4} scope="colgroup" className="bg-surface-2 text-[12.5px] text-muted font-bold py-[7px]!">{t(group.group)}</th>
      </tr>
      {group.rows.map(([label, a, b, c, note], i) => (
        <tr key={i}>
          <th scope="row" className="font-medium">
            {t(label)}
            {note && <small className="block text-subtle text-[12.5px] mt-0.5">{t(note)}</small>}
          </th>
          {[a, b, c].map((kind, j) => {
            const current = ROLE_KEYS[j] === role;
            return (
              <td key={j} className={cx('w-[140px]', current && 'bg-primary-soft')}>
                <Perm kind={kind} inCurrent={current} />
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}
