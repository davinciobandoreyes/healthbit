import React from 'react';
import type { DesignTopic, TopicStatus } from './content';

const statusClass: Record<TopicStatus, string> = {
  Use: 'bg-violet-50 text-violet-700 border-violet-200/80',
  Current: 'bg-amber-50 text-amber-700 border-amber-200/80',
  "Don't": 'bg-rose-50 text-rose-700 border-rose-200',
};

export const StatusMark: React.FC<{ status: TopicStatus }> = ({ status }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${statusClass[status]}`}>
    {status}
  </span>
);

export const Mark: React.FC<{ n: number }> = ({ n }) => (
  <span
    className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-bold shrink-0"
    aria-hidden="true"
  >
    {n}
  </span>
);

export const AMark: React.FC<{ n: number }> = ({ n }) => (
  <span
    className="inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-md bg-indigo-600 text-white text-[10px] font-bold shrink-0 whitespace-nowrap"
    aria-hidden="true"
  >
    A{n}
  </span>
);

export const Stage: React.FC<{ children: React.ReactNode; label?: string; tone?: 'porcelain' | 'white' }> = ({
  children,
  label,
  tone = 'porcelain',
}) => (
  <div className={`rounded-2xl border border-slate-200/80 p-4 sm:p-5 space-y-3 ${tone === 'white' ? 'bg-white' : 'bg-slate-50'}`}>
    {label ? <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p> : null}
    {children}
  </div>
);

export const TopicView: React.FC<{ topic: DesignTopic }> = ({ topic }) => (
  <article id={topic.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-8">
    <header className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-wider text-violet-700">{topic.group}</p>
      <h1 tabIndex={-1} className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 outline-none">
        {topic.label}
      </h1>
      <p className="text-sm text-slate-600 max-w-2xl">{topic.purpose}</p>
    </header>

    <section className="space-y-3">
      <h2 className="text-base font-bold text-slate-900">Specimen</h2>
      <topic.Specimen />
    </section>

    {topic.annotations && topic.annotations.length > 0 ? (
      <section className="space-y-3" aria-labelledby={`${topic.id}-usability`}>
        <h2 id={`${topic.id}-usability`} className="text-base font-bold text-slate-900">
          Usability
        </h2>
        <ol className="space-y-2">
          {topic.annotations.map((item) => (
            <li key={item.n} className="flex items-start gap-2">
              <Mark n={item.n} />
              <span className="text-xs sm:text-sm text-slate-600">
                <span className="sr-only">{item.n}. </span>
                {item.note}
              </span>
            </li>
          ))}
        </ol>
      </section>
    ) : null}

    {topic.a11y && topic.a11y.length > 0 ? (
      <section className="space-y-3" aria-labelledby={`${topic.id}-accessibility`}>
        <h2 id={`${topic.id}-accessibility`} className="text-base font-bold text-slate-900">
          Accessibility
        </h2>
        <ol className="space-y-2">
          {topic.a11y.map((item) => (
            <li key={item.n} className="flex items-start gap-2">
              <AMark n={item.n} />
              <span className="text-xs sm:text-sm text-slate-600">
                <span className="sr-only">A{item.n}. </span>
                {item.note}
              </span>
              {item.status ? <StatusMark status={item.status} /> : null}
            </li>
          ))}
        </ol>
      </section>
    ) : null}

    {topic.anatomy && topic.anatomy.length > 0 ? (
      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">Anatomy</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {topic.anatomy.map((part) => (
            <div key={part.part} className="rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2.5">
              <dt className="text-xs font-bold text-slate-900">{part.part}</dt>
              <dd className="text-xs text-slate-600 mt-0.5">{part.note}</dd>
            </div>
          ))}
        </dl>
      </section>
    ) : null}

    <section className="space-y-3">
      <h2 className="text-base font-bold text-slate-900">Spec</h2>
      <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
        <table className="w-full min-w-[640px] text-left text-xs">
          <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-3 py-2 font-bold">Name</th>
              <th className="px-3 py-2 font-bold">Value</th>
              <th className="px-3 py-2 font-bold">Class</th>
              <th className="px-3 py-2 font-bold">Source</th>
              <th className="px-3 py-2 font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {topic.specs.map((row) => (
              <tr key={`${row.name}-${row.className}`} className="border-t border-slate-100 align-top">
                <td className="px-3 py-2.5 font-bold text-slate-900 whitespace-nowrap">{row.name}</td>
                <td className="px-3 py-2.5 text-slate-600">{row.value}</td>
                <td className="px-3 py-2.5">
                  <code className="font-mono text-[11px] text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-md">{row.className}</code>
                </td>
                <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap">{row.source}</td>
                <td className="px-3 py-2.5">
                  <StatusMark status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <section className="space-y-3">
      <h2 className="text-base font-bold text-slate-900">Guidance</h2>
      <ul className="space-y-2">
        {topic.guidance.map((item) => (
          <li key={item.text} className="flex items-start gap-2">
            <StatusMark status={item.status} />
            <span className="text-xs sm:text-sm text-slate-600">{item.text}</span>
          </li>
        ))}
      </ul>
    </section>
  </article>
);
