import { useStored } from './useStored.js'

const SIZES = [
  { id: 'h1', label: 'Heading 1', cls: 'text-[22px] font-extrabold' },
  { id: 'h2', label: 'Heading 2', cls: 'text-[18px] font-bold' },
  { id: 'p', label: 'සාමාන්‍ය', cls: 'text-[13.5px]' },
]

const ALIGNS = [
  { id: 'left', label: 'වමට', cls: 'text-left' },
  { id: 'center', label: 'මැදට', cls: 'text-center' },
  { id: 'right', label: 'දකුණට', cls: 'text-right' },
]

const INITIAL = {
  title: 'මගේ පාසල',
  body: 'මම ඉගෙනුම ලබන්නේ කොළඹ පිහිටි පාසලකය. මගේ ප්‍රියතම විෂය තොරතුරු තාක්ෂණයයි.',
  bold: true,
  italic: false,
  underline: false,
  size: 'h1',
  align: 'center',
  list: true,
}

export function DocLab() {
  const [doc, setDoc] = useStored('ol-practice-doc-v1', INITIAL)

  const tasks = [
    { text: 'මාතෘකාවක් ලියන්න', done: doc.title.trim().length > 0 },
    { text: 'මාතෘකාව Heading 1 ලෙස සකසන්න', done: doc.size === 'h1' },
    { text: 'මාතෘකාව මැදට පෙළගසන්න', done: doc.align === 'center' },
    { text: 'ඡේදයේ වාක්‍ය එකක් හෝ වැඩි ගණනක් ලියන්න', done: doc.body.trim().length > 10 },
    { text: 'ඡේදය තද අකුරු හෝ ඇල අකුරු කරන්න', done: doc.bold || doc.italic },
    { text: 'ඡේදය ලැයිස්තුවක් ලෙස සකසන්න', done: Boolean(doc.list) },
  ]
  const doneCount = tasks.filter((t) => t.done).length

  const sizeCls = SIZES.find((s) => s.id === doc.size)?.cls ?? ''
  const alignCls = ALIGNS.find((a) => a.id === doc.align)?.cls ?? ''

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setDoc((d) => ({ ...d, bold: !d.bold }))}
          className={`rounded-lg border px-2.5 py-1 text-[12px] font-bold ${
            doc.bold ? 'border-leaf-500 bg-leaf-50 text-leaf-700' : 'border-slate-200 bg-white text-slate-600'
          }`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => setDoc((d) => ({ ...d, italic: !d.italic }))}
          className={`rounded-lg border px-2.5 py-1 text-[12px] font-semibold italic ${
            doc.italic ? 'border-leaf-500 bg-leaf-50 text-leaf-700' : 'border-slate-200 bg-white text-slate-600'
          }`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => setDoc((d) => ({ ...d, underline: !d.underline }))}
          className={`rounded-lg border px-2.5 py-1 text-[12px] font-semibold underline ${
            doc.underline ? 'border-leaf-500 bg-leaf-50 text-leaf-700' : 'border-slate-200 bg-white text-slate-600'
          }`}
        >
          U
        </button>
        <button
          type="button"
          onClick={() => setDoc((d) => ({ ...d, list: !d.list }))}
          className={`rounded-lg border px-2.5 py-1 text-[12px] font-semibold ${
            doc.list ? 'border-leaf-500 bg-leaf-50 text-leaf-700' : 'border-slate-200 bg-white text-slate-600'
          }`}
        >
          • ලැයිස්තුව
        </button>
        <div className="flex overflow-hidden rounded-lg border border-slate-200">
          {ALIGNS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setDoc((d) => ({ ...d, align: a.id }))}
              className={`px-2 py-1 text-[11.5px] font-semibold ${
                doc.align === a.id ? 'bg-leaf-50 text-leaf-700' : 'bg-white text-slate-500'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block">
          <span className="text-[10.5px] font-bold text-slate-500">මාතෘකාව</span>
          <input
            type="text"
            value={doc.title}
            onChange={(e) => setDoc((d) => ({ ...d, title: e.target.value }))}
            className="field mt-0.5 px-2 py-1.5 text-[12.5px]"
            aria-label="ලේඛන මාතෘකාව"
          />
        </label>
        <label className="block">
          <span className="text-[10.5px] font-bold text-slate-500">මාතෘකා මට්ටම</span>
          <select
            value={doc.size}
            onChange={(e) => setDoc((d) => ({ ...d, size: e.target.value }))}
            className="field mt-0.5 px-2 py-1.5 text-[12.5px]"
            aria-label="මාතෘකා මට්ටම"
          >
            {SIZES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="text-[10.5px] font-bold text-slate-500">ඡේදය</span>
        <textarea
          rows={4}
          value={doc.body}
          onChange={(e) => setDoc((d) => ({ ...d, body: e.target.value }))}
          className="field mt-0.5 text-[12.5px]"
          aria-label="ලේඛන ඡේදය"
        />
      </label>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10.5px] font-bold uppercase tracking-wide text-slate-400">පෙරදසුන — A4 පිටුව</span>
          <span className="text-[10px] text-slate-400">{doc.list ? 'ලැයිස්තු ලෙස' : 'ඡේද ලෙස'}</span>
        </div>
        <div className="mx-auto w-full max-w-[320px] rounded-md border border-slate-200 bg-white px-4 py-5 shadow-sm">
          <div
            className={`${sizeCls} ${alignCls} ${doc.bold ? 'font-bold' : ''} ${doc.italic ? 'italic' : ''} ${
              doc.underline ? 'underline' : ''
            } text-ink`}
          >
            {doc.title || 'මාතෘකාව මෙහි පෙනේ'}
          </div>
          <div className={`mt-2 ${alignCls} text-[12.5px] text-slate-700`}>
            {doc.list ? (
              <ul className="ml-4 list-disc space-y-0.5 text-left">
                {(doc.body || 'ඡේදය මෙහි පෙනේ')
                  .split(/(?<=\.)\s+/)
                  .filter(Boolean)
                  .map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
              </ul>
            ) : (
              <p className={`${doc.bold ? 'font-bold' : ''} ${doc.italic ? 'italic' : ''}`}>
                {doc.body || 'ඡේදය මෙහි පෙනේ'}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
        <div className="flex items-center justify-between">
          <span className="text-[11.5px] font-bold text-emerald-800">කාර්ය පිරික්සුම</span>
          <span className="font-mono text-[11px] font-bold text-emerald-700">
            {doneCount}/{tasks.length}
          </span>
        </div>
        <ul className="mt-1.5 space-y-1">
          {tasks.map((t) => (
            <li key={t.text} className="flex items-start gap-1.5 text-[12px] leading-relaxed">
              <span className={t.done ? 'text-emerald-600' : 'text-slate-400'}>{t.done ? '✓' : '○'}</span>
              <span className={t.done ? 'text-emerald-900' : 'text-slate-600'}>{t.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <div className="text-[11.5px] font-bold text-slate-600">Word හි අදාළ කෙටි මාර්ග</div>
        <div className="mt-1 grid gap-1 text-[12px] text-slate-700 sm:grid-cols-2">
          <span>තද: <b className="font-mono">Ctrl + B</b></span>
          <span>ඇල: <b className="font-mono">Ctrl + I</b></span>
          <span>යටින් ඉරි: <b className="font-mono">Ctrl + U</b></span>
          <span>මැදට: <b className="font-mono">Ctrl + E</b></span>
        </div>
      </div>
    </div>
  )
}
