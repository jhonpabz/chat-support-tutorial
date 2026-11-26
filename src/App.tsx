import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { Features, type FeatureState } from './components/Features';
import { Header } from './components/Header';
import { Hero, ValueSection } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Roles } from './components/Roles';
import { Lightbox, LightboxContext } from './components/Screenshot';
import { AgentsSection, AppearanceSection, ChatSection, FaqSection, Footer } from './components/Sections';
import type { TourState } from './components/Tour';
import { FEATURES, TOURS } from './data/content';
import type { Link, RoleKey, TourKey } from './data/types';
import { LangContext, type Lang } from './lib/i18n';
import { ThemeContext, storage, useThemeState } from './lib/theme';

function initialLang(): Lang {
  const value = new URLSearchParams(location.search).get('lang') || storage.get('tutorial:lang');
  return value === 'en' ? 'en' : 'zh';
}

const focusQuiet = (selector: string) => document.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true });

export default function App() {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const { theme, setTheme } = useThemeState();
  const [role, setRole] = useState<RoleKey>('agent');
  const [feature, setFeature] = useState<FeatureState>({ id: 'dashboard', sub: 0 });
  const [tours, setTours] = useState<Record<TourKey, TourState>>({
    chat: { view: 0, step: 0 },
    agents: { view: 0, step: 0 },
    look: { view: 0, step: 0 },
  });
  const [zoom, setZoom] = useState<string | null>(null);

  const setLang = (next: Lang) => { setLangState(next); storage.set('tutorial:lang', next); };
  const setTour = useCallback((key: TourKey, next: TourState) => setTours((all) => ({ ...all, [key]: next })), []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.lang = lang;
    root.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = lang === 'zh' ? '在线客服使用教程' : 'Chat Support Guide';
  }, [lang]);

  // Honour a #section link on first load.
  useEffect(() => {
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }, []);

  /** "See it on screen" links from the role tasks. */
  const goTo = (link: Link) => {
    if ('tour' in link) {
      const index = Math.max(TOURS[link.tour].findIndex((v) => v.id === link.view), 0);
      flushSync(() => setTour(link.tour, { view: index, step: 0 }));
      document.getElementById(link.tour === 'look' ? 'appearance' : link.tour)?.scrollIntoView();
      focusQuiet(`#tour-${link.tour} [role="tab"][aria-selected="true"]`);
    } else {
      const f = FEATURES.find((x) => x.id === link.module);
      const sub = Math.max(0, f ? f.subs.findIndex((s) => s[0] === link.sub) : 0);
      flushSync(() => setFeature({ id: link.module, sub }));
      document.getElementById('features')?.scrollIntoView();
      focusQuiet(`#feature-${link.module}`);
    }
  };

  const jumpToRole = (next: RoleKey) => {
    flushSync(() => setRole(next));
    document.getElementById('roles')?.scrollIntoView();
    focusQuiet(`#role-${next}`);
  };

  return (
    <LangContext.Provider value={lang}>
      <ThemeContext.Provider value={theme}>
        <LightboxContext.Provider value={setZoom}>
          <Header setLang={setLang} setTheme={setTheme} />
          <main>
            <Hero onRoleJump={jumpToRole} />
            <ValueSection />
            <HowItWorks />
            <Roles role={role} setRole={setRole} goTo={goTo} />
            <ChatSection tours={tours} setTour={setTour} />
            <AgentsSection tours={tours} setTour={setTour} />
            <Features state={feature} setState={setFeature} />
            <AppearanceSection tours={tours} setTour={setTour} />
            <FaqSection />
          </main>
          <Footer />
          <Lightbox id={zoom} onClose={() => setZoom(null)} />
        </LightboxContext.Provider>
      </ThemeContext.Provider>
    </LangContext.Provider>
  );
}
