import { useMemo } from 'react'
import { useStored } from './useStored.js'

const RECORDS = [
  { id: 1, name: 'අමල්', grade: 9, marks: 78, city: 'කොළඹ' },
  { id: 2, name: 'නිමල්', grade: 10, marks: 62, city: 'කොළඹ' },
  { id: 3, name: 'කමල්', grade: 11, marks: 91, city: 'මහනුවර' },
  { id: 4, name: 'සචිනි', grade: 9, marks: 55, city: 'ගාල්ල' },
  { id: 5, name: 'දිල්ෂා', grade: 10, marks: 84, city: 'මහනුවර' },
  { id: 6, name: 'තරිඳු', grade: 11, marks: 47, city: 'ගාල්ල' },
  { id: 7, name: 'නදීෂා', grade: 9, marks: 66, city: 'කොළඹ' },
  { id: 8, name: 'රුවන්', grade: 10, marks: 73, city: 'මහනුවර' },
]

const FIELDS = [
  { id: 'grade', label: 'ශ්‍රේණිය' },
  { id: 'marks', label: 'ලකුණු' },
  { id: 'city', label: 'නගරය' },
]

const OPS = ['=', '>', '<', '>=', '<=']

export function DbLab() {
  const [q, setQ] = useStored('ol-practice-db-v1', { field: 'grade', op: '=', value: '10' })

  const rows = useMemo(() => {
    const raw = q.value.trim()
    if (raw === '') return RECORDS
    const num = Number(raw)
    const isNum = Number.isFinite(num) && raw !== ''
    return RECORDS.filter((r) => {
      const cell = r[q.field]
      if (typeof cell === 'string' && !isNum) {
        return q.op === '=' ? cell === raw : cell > raw || cell < raw
      }
      const v = Number(cell)
      if (!isNum) return false
      if (q.op === '=') return v === num
      if (q.op === '>') return v > num
      if (q.op === '<') return v < num
      if (q.op === '>=') return v >= num
      return v <= num
    })
  }, [q])

  const tasks = [
    { text: '10 ශ්‍රේණියේ සිසුන් පෙරන්න', done: q.field === 'grade' && q.op === '=' && q.value.trim() === '10' },
    { text: 'ලකුණු 75 ට වැඩි සිසුන් පෙරන්න', done: q.field === 'marks' && q.op === '>' && Number(q.value) === 75 },
    { text: 'ලකුණු 50 ට අඩු සිසුන් පෙරන්න', done: q.field === 'marks' && q.op === '<' && Number(q.value) === 50 },
    { text: 'නගරය අනුව සිසුන් පෙරන්න', done: q.field === 'city' && q.value.trim().length > 1 },
  ]
  const doneCount = tasks.filter((t) => t.done).length

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-1.5">
        <label className="block">
          <span className="text-[10.5px] font-bold text-slate-500">ක්ෂේත්‍රය</span>
          <select
            value={q.field}
            onChange={(e) => setQ((s) => ({ ...s, field: e.target.value }))}
            className="field mt-0.5 px-2 py-1.5 text-[12px]"
            aria-label="විමසුමේ ක්ෂේත්‍රය"
          >
            {FIELDS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-[10.5px] font-bold text-slate-500">කොන්දේසිය</span>
          <select
            value={q.op}
            onChange={(e) => setQ((s) => ({ ...s, op: e.target.value }))}
            className="field mt-0.5 px-2 py-1.5 text-[12px]"
            aria-label="විමසුමේ කොන්දේසිය"
          >
            {OPS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-[10.5px] font-bold text-slate-500">අගය</span>
          <input
            type="text"
            value={q.value}
            onChange={(e) => setQ((s) => ({ ...s, value: e.target.value }))}
            className="field mt-0.5 px-2 py-1.5 text-[12px]"
            aria-label="විමසුමේ අගය"
          />
        </label>
      </div>

      <div className="overflow-x-auto rounded-xl bg-slate-900 px-3 py-2">
        <code className="whitespace-nowrap font-mono text-[11.5px] text-emerald-300">
          SELECT * FROM students WHERE {q.field} {q.op} {typeof q.value === 'string' && !Number.isFinite(Number(q.value)) ? `'${q.value}'` : q.value || '?'};
        </code>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-[12px]">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-2 py-1.5 font-semibold">ID</th>
              <th className="px-2 py-1.5 font-semibold">නම</th>
              <th className="px-2 py-1.5 font-semibold">ශ්‍රේණිය</th>
              <th className="px-2 py-1.5 font-semibold">ලකුණු</th>
              <th className="px-2 py-1.5 font-semibold">නගරය</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-slate-100 text-slate-700">
                <td className="px-2 py-1.5 font-mono text-slate-400">{r.id}</td>
                <td className="px-2 py-1.5">{r.name}</td>
                <td className="px-2 py-1.5">{r.grade}</td>
                <td className="px-2 py-1.5 font-mono">{r.marks}</td>
                <td className="px-2 py-1.5">{r.city}</td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-2 py-3 text-center text-[12px] text-slate-400">
                  ගැලපෙන වාර්තා නැත
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <p className="text-center text-[11.5px] text-slate-500">
        වාර්තා {rows.length}ක් · මුළු වාර්තා {RECORDS.length} · ප්‍රධාන යතුර: ID
      </p>

      <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
        <div className="flex items-center justify-between">
          <span className="text-[11.5px] font-bold text-emerald-800">විමසුම් අභ්‍යාස</span>
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
    </div>
  )
}
