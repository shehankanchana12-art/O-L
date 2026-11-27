import { useEffect, useState } from 'react'
import { HTML_TEMPLATES, HTML_GUIDES, HTML_CHALLENGES } from '../../data/practice.js'
import { useStored } from './useStored.js'

const STARTER = HTML_TEMPLATES[0].code

export function HtmlStudio() {
  const [state, setState] = useStored('ol-practice-html-v1', { code: STARTER, done: [] })
  const [preview, setPreview] = useState(state.code ?? STARTER)
  const [template, setTemplate] = useState('basic')
  const [openSolution, setOpenSolution] = useState(null)

  const code = state.code ?? STARTER
  const done = Array.isArray(state.done) ? state.done : []

  useEffect(() => {
    const timer = setTimeout(() => setPreview(code), 600)
    return () => clearTimeout(timer)
  }, [code])

  const loadTemplate = (id) => {
    const t = HTML_TEMPLATES.find((x) => x.id === id)
    if (!t) return
    setTemplate(id)
    setState((s) => ({ ...s, code: t.code }))
    setPreview(t.code)
  }

  const markDone = (id) =>
    setState((s) => {
      const list = Array.isArray(s.done) ? s.done : []
      return { ...s, done: list.includes(id) ? list : [...list, id] }
    })

  return (
    <div className="space-y-4">
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="card overflow-hidden p-0">
          <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-2.5 py-2">
            <span className="text-[11px] font-bold text-slate-500">HTML කේතය</span>
            <select
              value={template}
              onChange={(e) => loadTemplate(e.target.value)}
              className="ml-auto rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11.5px] font-semibold text-slate-600"
              aria-label="උදාහරණ ආකෘතිය තෝරන්න"
            >
              {HTML_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={code}
            onChange={(e) => setState((s) => ({ ...s, code: e.target.value }))}
            spellCheck={false}
            rows={16}
            aria-label="HTML කේත සංස්කාරකය"
            className="w-full resize-y border-0 bg-slate-900 px-3 py-2.5 font-mono text-[12px] leading-[1.75] text-emerald-100 outline-none"
          />
          <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-200 bg-white px-2.5 py-2">
            <button type="button" onClick={() => setPreview(code)} className="btn-primary px-3 py-1.5 text-[12px]">
              ▶ ධාවනය කරන්න
            </button>
            <button
              type="button"
              onClick={() => loadTemplate(template)}
              className="btn-ghost px-3 py-1.5 text-[12px]"
            >
              නැවත සකසන්න
            </button>
            <button
              type="button"
              onClick={() => loadTemplate('basic')}
              className="btn-ghost px-3 py-1.5 text-[12px]"
            >
              මූලික ආකෘතිය
            </button>
            <span className="ml-auto text-[10.5px] text-slate-400">{code.length} අකුරු</span>
          </div>
        </div>

        <div className="card overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-2.5 py-2">
            <span className="text-[11px] font-bold text-slate-500">සජීවී පෙරදසුන</span>
            <span className="text-[10px] text-slate-400">ස්වයංක්‍රීයව යාවත්කාලීන වේ</span>
          </div>
          <iframe
            title="HTML පෙරදසුන"
            srcDoc={preview}
            sandbox=""
            className="h-[420px] w-full bg-white"
          />
        </div>
      </div>

      <section className="card p-4">
        <h3 className="text-[14.5px] font-bold">භාවිත කරන ආකාරය — ප්‍රධාන ඉඟි</h3>
        <ul className="mt-2 grid gap-1.5 text-[12.5px] leading-relaxed text-slate-700 sm:grid-cols-2">
          <li>• සෑම ටැගයක්ම <b className="font-mono">&lt;ටැගය&gt;</b> ලෙස ආරම්භ වේ.</li>
          <li>• බොහෝ ටැග් <b className="font-mono">&lt;/ටැගය&gt;</b> ලෙස අවසන් කළ යුතුය.</li>
          <li>• ගුණාංග ලියන්නේ ආරම්භක ටැගය තුළය: <b className="font-mono">&lt;a href="..."&gt;</b>.</li>
          <li>• කේතය වෙනස් කළ විට පෙරදසුන තත්පරයක් තුළ යාවත්කාලීන වේ.</li>
          <li>• කුඩා කොටසක් ලියා "ධාවනය කරන්න" ඔබමින් පියවරෙන් පියවර පරීක්ෂා කරන්න.</li>
          <li>• දෝෂයක් ඇත්නම් අවසන් ටැගය අමතක වී ඇත්දැයි පළමුව බලන්න.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="px-1 text-[13px] font-bold text-slate-600">පියවරෙන් පියවර මාර්ගෝපදේශ</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {HTML_GUIDES.map((g) => (
            <div key={g.id} className="card p-3">
              <div className="text-[13px] font-bold">{g.title}</div>
              <ol className="mt-1.5 space-y-1">
                {g.steps.map((s) => (
                  <li key={s} className="text-[12px] leading-relaxed text-slate-700">
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[13px] font-bold text-slate-600">ප්‍රායෝගික ප්‍රශ්න (අභියෝග)</h3>
          <span className="chip bg-leaf-50 text-leaf-700">
            {done.length}/{HTML_CHALLENGES.length} සම්පූර්ණයි
          </span>
        </div>
        {HTML_CHALLENGES.map((c) => {
          const passed = c.test(code)
          const saved = done.includes(c.id)
          return (
            <div key={c.id} className="card p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[13px] font-bold">{c.title}</div>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-slate-700">{c.prompt}</p>
                </div>
                <span
                  className={`chip shrink-0 ${
                    passed || saved ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {passed || saved ? '✓ සම්පූර්ණයි' : 'තවම නැත'}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setOpenSolution((v) => (v === c.id ? null : c.id))}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11.5px] font-semibold text-slate-600"
                >
                  {openSolution === c.id ? 'විසඳුම සඟවන්න' : 'ආදර්ශ විසඳුම'}
                </button>
                <span className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11.5px] text-amber-900">
                  ඉඟිය: {c.hint}
                </span>
                {passed ? (
                  <button
                    type="button"
                    onClick={() => markDone(c.id)}
                    className="ml-auto rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11.5px] font-semibold text-emerald-700"
                  >
                    සම්පූර්ණ කළා ලෙස සලකුණු කරන්න
                  </button>
                ) : null}
              </div>
              {openSolution === c.id ? (
                <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-900 px-3 py-2 font-mono text-[11.5px] leading-relaxed text-emerald-200">
                  {c.solution}
                </pre>
              ) : null}
            </div>
          )
        })}
      </section>
    </div>
  )
}
