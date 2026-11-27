import { useState } from 'react'
import { WINDOWS_APPS } from '../data/practice.js'
import { WIN_APPS, WinDesktop } from './practice/winui.jsx'
import { SheetLab } from './practice/SheetLab.jsx'
import { DocLab } from './practice/DocLab.jsx'
import { PptLab } from './practice/PptLab.jsx'
import { DbLab } from './practice/DbLab.jsx'
import { HtmlStudio } from './practice/HtmlStudio.jsx'

const MODES = [
  { id: 'apps', label: 'වින්ඩෝස් මෘදුකාංග පුහුණුව', icon: '🪟' },
  { id: 'html', label: 'සජීවී HTML ඉගෙනුම් පිටුව', icon: '💻' },
]

const EXERCISES = {
  word: [
    'මාතෘකාව Heading 1 ලෙස සකසා මැදට පෙළගසන්න (Ctrl + E).',
    'Insert → Table මගින් වගුවක් ඇතුළත් කර එය පුරවන්න.',
    'Layout → Margins "Narrow" ලෙස වෙනස් කර පිටුව බලන්න.',
    'ඡේදයක් තෝරා B, I, U හා ඉස්මතු වර්ණය යොදන්න.',
    'View → Zoom 125% කර පසුව නැවත 100% කරන්න.',
  ],
  excel: [
    'B2:B7 අගයන් වෙනස් කර D හා E තීරු ස්වයංක්‍රීයව යාවත්කාලීන වන බව බලන්න.',
    'F2 සෛලයේ IF සූත්‍රය 45, 60 වැනි අගයන් සමඟ අත්හදා බලන්න.',
    'නව සෛලයක =MAX(B2:B7) හා =COUNTIF(B2:B7,">=75") ලියන්න.',
    'Insert → Chart මගින් තීරු ප්‍රස්තාරයක් පෙන්වන්න.',
    'පත්‍රිකා ටැබයේ "+" මගින් නව පත්‍රයක් එකතු කරන්න.',
  ],
  ppt: [
    'නව ස්ලයිඩයක් එකතු කර මාතෘකාවක් හා කරුණු 3ක් ලියන්න.',
    'Design ටැබයෙන් තේමාවක් තෝරන්න.',
    'ස්ලයිඩ සටහන් කොටසේ ඉදිරිපත් කිරීමේ සටහන් ලියන්න.',
    'F5 මගින් ඉදිරිපත් කිරීම ආරම්භ කර ඊතල යතුරුවලින් යන්න.',
  ],
  access: [
    'Students වගුවේ නව වාර්තාවක් එකතු කර අගයන් පුරවන්න.',
    'විමසුම් සැලසුමේ Marks කොන්දේසියට >75 ලියා ප්‍රතිඵල බලන්න.',
    'Grade කොන්දේසිය 10 ලෙස තබා වර්ගය අවරෝහණ කරන්න.',
    'SQL ටැබයෙන් සෑදෙන විමසුම කියවන්න.',
    'rptMarks වාර්තාව විවෘත කර සාමාන්‍යය හා උපරිම බලන්න.',
  ],
}

function AppGuide({ item }) {
  return (
    <details className="card group p-3 open:ring-1 open:ring-leaf-200">
      <summary className="flex cursor-pointer list-none items-start gap-2">
        <span aria-hidden="true" className="text-lg leading-none">
          {item.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="chip bg-slate-100 text-slate-600">{item.grade} ශ්‍රේණිය</span>
            <span className="chip bg-sky-50 text-sky-700">{item.app}</span>
          </div>
          <div className="mt-1 text-[13px] font-bold leading-snug">{item.title}</div>
          <p className="mt-0.5 text-[11.5px] leading-relaxed text-slate-500">{item.summary}</p>
        </div>
        <span className="text-slate-400 transition group-open:rotate-180" aria-hidden="true">
          ▾
        </span>
      </summary>

      <div className="mt-3 space-y-2.5">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">පියවරෙන් පියවර කාර්ය</div>
          <ol className="mt-1 space-y-1">
            {item.tasks.map((t, i) => (
              <li key={t} className="flex gap-1.5 text-[12.5px] leading-relaxed text-slate-700">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-[9px] font-bold text-white">
                  {i + 1}
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Windows කෙටි මාර්ග</div>
          <div className="mt-1 grid gap-1 sm:grid-cols-2">
            {item.shortcuts.map((s) => (
              <div key={s.keys} className="flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-1">
                <code className="shrink-0 rounded bg-white px-1.5 py-0.5 font-mono text-[10.5px] font-bold text-sky-700">
                  {s.keys}
                </code>
                <span className="text-[11.5px] text-slate-600">{s.what}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">භාවිත ඉඟි</div>
          <ul className="mt-1 space-y-1">
            {item.tips.map((t) => (
              <li key={t} className="flex gap-1.5 text-[12px] leading-relaxed text-slate-700">
                <span aria-hidden="true">💡</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">ප්‍රායෝගික ප්‍රශ්න</div>
          <div className="mt-1 space-y-1">
            {item.questions.map((q) => (
              <details key={q.q} className="rounded-lg border border-slate-200 px-2.5 py-1.5">
                <summary className="cursor-pointer text-[12px] font-semibold leading-relaxed text-slate-700">
                  {q.q}
                </summary>
                <p className="mt-1 text-[12px] leading-relaxed text-slate-600">{q.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </details>
  )
}

export function PracticePage({ onBack }) {
  const [mode, setMode] = useState('apps')
  const [grade, setGrade] = useState('all')
  const [app, setApp] = useState('word')

  const apps = WINDOWS_APPS.filter((a) => grade === 'all' || String(a.grade) === grade)
  const meta = WIN_APPS.find((a) => a.id === app) || WIN_APPS[0]

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-3xl px-3 py-2 lg:max-w-[1180px] lg:px-6 lg:py-3">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] font-bold text-slate-600 transition hover:bg-slate-50"
            >
              <span aria-hidden="true">←</span> ආපසු පාඩම්වලට
            </button>
            <div className="text-right">
              <div className="text-[13px] font-extrabold leading-tight">ප්‍රායෝගික පිටුව</div>
              <div className="text-[10px] leading-tight text-slate-500">Windows Apps & HTML Lab</div>
            </div>
          </div>

          <div role="tablist" aria-label="ප්‍රායෝගික කොටස්" className="mt-2 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 lg:max-w-md">
            {MODES.map((m) => (
              <button
                key={m.id}
                role="tab"
                type="button"
                aria-selected={mode === m.id}
                onClick={() => setMode(m.id)}
                className={`rounded-lg px-2 py-1.5 text-[11.5px] font-bold leading-snug transition ${
                  mode === m.id ? 'bg-white text-leaf-700 shadow-sm' : 'text-slate-500 hover:text-ink'
                }`}
              >
                <span aria-hidden="true" className="mr-1">
                  {m.icon}
                </span>
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-3 pb-16 pt-3 lg:max-w-[1180px] lg:px-6 lg:pt-5">
        {mode === 'apps' ? (
          <div className="space-y-3">
            <section className="card border-l-4 border-sky-500 p-4">
              <h1 className="text-[15.5px] font-extrabold">වින්ඩෝස් මෘදුකාංග පුහුණුව — 9, 10, 11 ශ්‍රේණි</h1>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-700">
                පහත වැඩතලයේ Word, Excel, PowerPoint හා Access කවුළු විවෘත වේ. සැබෑ Windows මෘදුකාංගයේ
                මෙන්ම සියලු මෙනු, Ribbon ටැබ, විධාන හා ස්ථිති තීරු (status bar) ඉංග්‍රීසියෙන්ම දක්නට ලැබේ —
                එම නිසා පන්තියේ හෝ විභාගයේදී සැබෑ යෙදුමක් භාවිත කරන විට එම නම් හඳුනාගත හැක. Ribbon මෙනු,
                සූත්‍ර තීරුව, පත්‍රිකා හා විමසුම් සැලසුම භාවිත කර ලේඛන, ගණනය, ඉදිරිපත් කිරීම් හා දත්ත සමුදා
                අභ්‍යාස කරන්න. කවුළු වසන්න හෝ අවම කරන්නත්, කාර්ය තීරුවෙන් නැවත විවෘත කරන්නත් හැක.
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {['all', '9', '10', '11'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrade(g)}
                    className={`rounded-full border px-3 py-1 text-[12px] font-bold transition ${
                      grade === g
                        ? 'border-leaf-500 bg-leaf-50 text-leaf-700'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    {g === 'all' ? 'සියලු ශ්‍රේණි' : `${g} ශ්‍රේණිය`}
                  </button>
                ))}
              </div>
            </section>

            <WinDesktop app={app} onApp={setApp}>
              {app === 'word' ? <DocLab /> : null}
              {app === 'excel' ? <SheetLab /> : null}
              {app === 'ppt' ? <PptLab /> : null}
              {app === 'access' ? <DbLab /> : null}
            </WinDesktop>

            <section className="card p-3">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <h2 className="text-[12.5px] font-extrabold">
                  පුහුණු කාර්ය — {meta.label} ({meta.sub})
                </h2>
                <span className="text-[10px] font-semibold text-slate-400">ඉහත කවුළුව තුළම කරන්න</span>
              </div>
              <ol className="mt-1.5 space-y-1">
                {EXERCISES[app].map((t, i) => (
                  <li key={t} className="flex gap-1.5 text-[12px] leading-relaxed text-slate-700">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-[9px] font-bold text-white">
                      {i + 1}
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ol>
            </section>

            <div className="px-1 pt-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">
              මෘදුකාංග මාර්ගෝපදේශ ({apps.length})
            </div>
            <div className="space-y-2">
              {apps.map((a) => (
                <AppGuide key={a.id} item={a} />
              ))}
            </div>

            <p className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11.5px] leading-relaxed text-slate-500">
              සටහන: මෙම කවුළු බ්‍රවුසරය තුළ ක්‍රියා කරන අභ්‍යාස පිටපත් වේ. සැබෑ Word, Excel, PowerPoint හෝ Access
              මෘදුකාංගයේ මෙනු නාම, Ribbon ටැබ හා කෙටි මාර්ග ඉංග්‍රීසියෙන් එලෙසම භාවිත කර ඇති බැවින් පන්තියේදී
              ඒවා අනුගමනය කළ හැක. ඔබේ වෙනස්කම් මෙම උපාංගයේම සුරැකේ.
            </p>
          </div>
        ) : (
          <HtmlStudio />
        )}
      </main>
    </div>
  )
}
