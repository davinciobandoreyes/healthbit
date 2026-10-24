import React, { useEffect, useState } from 'react';
import { GROUPS, TOPICS, type TopicGroup } from './content';
import { TopicView } from './Topic';

const topicFromHash = (): string => {
  const id = window.location.hash.replace(/^#/, '');
  return TOPICS.some((topic) => topic.id === id) ? id : TOPICS[0].id;
};

export const DesignSystemShell: React.FC = () => {
  const [activeId, setActiveId] = useState(topicFromHash);

  useEffect(() => {
    const sync = () => {
      const id = window.location.hash.replace(/^#/, '');
      if (!TOPICS.some((topic) => topic.id === id)) {
        window.history.replaceState(null, '', `#${TOPICS[0].id}`);
        setActiveId(TOPICS[0].id);
        return;
      }
      setActiveId(id);
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  useEffect(() => {
    document.getElementById(activeId)?.querySelector('h1')?.focus();
  }, [activeId]);

  const active = TOPICS.find((topic) => topic.id === activeId) ?? TOPICS[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 lg:flex">
      <aside className="lg:sticky lg:top-0 lg:h-screen lg:w-[232px] shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-slate-200/80 z-40">
        <div className="px-4 sm:px-3 py-4 border-b border-slate-200/80">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Plasty</p>
          <h2 className="text-base font-black tracking-tight text-slate-900">Design system</h2>
        </div>
        <nav aria-label="Design system" className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:h-[calc(100vh-73px)] px-3 py-3">
          {GROUPS.map((group) => (
            <GroupLinks key={group} group={group} activeId={active.id} />
          ))}
        </nav>
      </aside>
      <main className="flex-1 min-w-0 px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <TopicView topic={active} />
        </div>
      </main>
    </div>
  );
};

const GroupLinks: React.FC<{ group: TopicGroup; activeId: string }> = ({ group, activeId }) => (
  <div className="min-w-max lg:min-w-0 space-y-1">
    <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">{group}</p>
    <ul className="flex lg:flex-col gap-1">
      {TOPICS.filter((topic) => topic.group === group).map((topic) => {
        const selected = topic.id === activeId;
        return (
          <li key={topic.id}>
            <a
              href={`#${topic.id}`}
              aria-current={selected ? 'page' : undefined}
              className={`flex items-center min-h-[44px] px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selected ? 'text-violet-700 bg-violet-50' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {topic.label}
            </a>
          </li>
        );
      })}
    </ul>
  </div>
);
