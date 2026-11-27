import { useMemo, useState } from 'react'
import { Slider, SimFrame, Readout } from './ui.jsx'

/* ------------------------------------------------------------------ */
/* 1. සංඛ්‍යා පාද පරිවර්තකය                                               */
/* ------------------------------------------------------------------ */
const BASES = [
  { value: 2, label: 'ද්විමය', short: '2' },
  { value: 8, label: 'අෂ්ටමය', short: '8' },
  { value: 16, label: 'ෂඩ්දශම', short: '16' },
]

export function NumberBaseSim() {
  const [value, setValue] = useState(13)
  const [base, setBase] = useState(2)

  const n = Math.max(0, Math.floor(value))
  const digits = n.toString(base).toUpperCase()
  const binary = n.toString(2)
  const bits = binary.padStart(Math.max(8, binary.length), '0').split('')

  return (
    <div className="space-y-3">
      <Slider label="දශම අගය" value={value} onChange={setValue} min={0} max={255} unit="" />

      <div className="flex gap-1.5">
        {BASES.map((b) => (
          <button
            key={b.value}
            type="button"
            onClick={() => setBase(b.value)}
            className={`flex-1 rounded-xl border px-2 py-1.5 text-[12px] font-semibold transition ${
              base === b.value
                ? 'border-leaf-500 bg-leaf-50 text-leaf-700'
                : 'border-slate-200 bg-white text-slate-600'
            }`}
          >
            {b.label} ({b.short})
          </button>
        ))}
      </div>

      <SimFrame caption={`දශම ${n} — ${BASES.find((b) => b.value === base).label} පාදයෙන් ලියූ අගය පහත දැක්වේ.`}>
        <div className="rounded-xl bg-slate-900 px-3 py-4 text-center">
          <div className="break-all font-mono text-2xl font-bold tracking-widest text-emerald-300">{digits}</div>
          <div className="mt-1 text-[11px] text-slate-400">
            පාදය {base} · ඉලක්කම් {digits.length}
          </div>
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-1">
          {bits.map((bit, i) => (
            <span
              key={i}
              className={`flex h-8 w-7 items-center justify-center rounded-md border font-mono text-[13px] font-bold ${
                bit === '1'
                  ? 'border-leaf-300 bg-leaf-50 text-leaf-700'
                  : 'border-slate-200 bg-white text-slate-400'
              }`}
            >
              {bit}
            </span>
          ))}
        </div>
        <div className="mt-1 text-center text-[11px] text-slate-500">ද්විමය බිට් රටාව (වමේ සිට දකුණට බර අඩු වේ)</div>
      </SimFrame>

      <Readout
        items={[
          { label: 'දශම', value: String(n) },
          { label: 'ද්විමය', value: n.toString(2) },
          { label: 'අෂ්ටමය', value: n.toString(8) },
          { label: 'ෂඩ්දශම', value: n.toString(16).toUpperCase() },
        ]}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 2. තර්ක ද්වාර                                                       */
/* ------------------------------------------------------------------ */
const GATES = [
  { id: 'AND', label: 'AND' },
  { id: 'OR', label: 'OR' },
  { id: 'NOT', label: 'NOT' },
  { id: 'NAND', label: 'NAND' },
  { id: 'NOR', label: 'NOR' },
  { id: 'XOR', label: 'XOR' },
]

function gateOutput(gate, a, b) {
  switch (gate) {
    case 'AND':
      return a && b ? 1 : 0
    case 'OR':
      return a || b ? 1 : 0
    case 'NOT':
      return a ? 0 : 1
    case 'NAND':
      return a && b ? 0 : 1
    case 'NOR':
      return a || b ? 0 : 1
    case 'XOR':
      return a !== b ? 1 : 0
    default:
      return 0
  }
}

const GATE_EXPLAIN = {
  AND: 'ආදාන දෙකම 1 වූ විට පමණක් ප්‍රතිදානය 1 වේ.',
  OR: 'එක් ආදානයක් හෝ 1 වූ විට ප්‍රතිදානය 1 වේ.',
  NOT: 'ආදානය ප්‍රතිලෝම කරයි. ආදානයක් එකක් පමණි.',
  NAND: 'AND හි ප්‍රතිලෝමය. ආදාන දෙකම 1 වූ විට පමණක් 0 වේ.',
  NOR: 'OR හි ප්‍රතිලෝමය. ආදාන දෙකම 0 වූ විට පමණක් 1 වේ.',
  XOR: 'ආදාන දෙක වෙනස් වූ විට පමණක් 1 වේ.',
}

export function LogicGateSim() {
  const [a, setA] = useState(1)
  const [b, setB] = useState(0)
  const [gate, setGate] = useState('AND')

  const out = gateOutput(gate, Boolean(a), Boolean(b))
  const rows = [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ]

  const toggle = (setter) => (e) => setter(Number(e.currentTarget.dataset.v))

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-1.5">
        {GATES.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setGate(g.id)}
            className={`rounded-xl border px-2 py-1.5 font-mono text-[12px] font-bold transition ${
              gate === g.id
                ? 'border-leaf-500 bg-leaf-50 text-leaf-700'
                : 'border-slate-200 bg-white text-slate-600'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <SimFrame caption={GATE_EXPLAIN[gate]}>
        <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-2 py-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500">A</span>
              {[0, 1].map((v) => (
                <button
                  key={v}
                  type="button"
                  data-v={v}
                  onClick={toggle(setA)}
                  className={`h-7 w-7 rounded-md border font-mono text-[12px] font-bold transition ${
                    a === v ? 'border-leaf-600 bg-leaf-600 text-white' : 'border-slate-300 bg-white text-slate-500'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            {gate !== 'NOT' ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-500">B</span>
                {[0, 1].map((v) => (
                  <button
                    key={v}
                    type="button"
                    data-v={v}
                    onClick={toggle(setB)}
                    className={`h-7 w-7 rounded-md border font-mono text-[12px] font-bold transition ${
                      b === v ? 'border-leaf-600 bg-leaf-600 text-white' : 'border-slate-300 bg-white text-slate-500'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-[10.5px] text-slate-400">NOT ට ආදාන එකක් පමණි</div>
            )}
          </div>

          <div className="flex flex-1 items-center justify-center gap-1">
            <div className="h-px w-4 bg-slate-300" />
            <div className="flex h-14 w-20 items-center justify-center rounded-lg border-2 border-sky-300 bg-sky-50 font-mono text-[13px] font-bold text-sky-700">
              {gate}
            </div>
            <div className="h-px w-4 bg-slate-300" />
          </div>

          <div className="flex flex-col items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-mono text-lg font-extrabold ${
                out ? 'border-emerald-400 bg-emerald-100 text-emerald-700' : 'border-slate-300 bg-slate-100 text-slate-400'
              }`}
            >
              {out}
            </div>
            <span className="mt-1 text-[10px] font-semibold text-slate-500">ප්‍රතිදානය</span>
          </div>
        </div>
      </SimFrame>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-center text-[12px]">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-2 py-1.5 font-semibold">A</th>
              <th className="px-2 py-1.5 font-semibold">B</th>
              <th className="px-2 py-1.5 font-semibold">ප්‍රතිදානය</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([ra, rb]) => {
              const result = gateOutput(gate, Boolean(ra), Boolean(rb))
              const active = ra === a && (gate === 'NOT' || rb === b)
              return (
                <tr key={`${ra}${rb}`} className={active ? 'bg-leaf-50 font-bold text-leaf-700' : 'text-slate-600'}>
                  <td className="border-t border-slate-100 px-2 py-1 font-mono">{ra}</td>
                  <td className="border-t border-slate-100 px-2 py-1 font-mono">{gate === 'NOT' ? '—' : rb}</td>
                  <td className="border-t border-slate-100 px-2 py-1 font-mono">{result}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 3. ප්‍රවාහ සටහන් ධාවකය                                               */
/* ------------------------------------------------------------------ */
function buildFlowTrace(n) {
  const trace = []
  let total = 0
  trace.push({ node: 'start', i: '—', total: '—', note: 'ආරම්භය' })
  trace.push({ node: 'init', i: 1, total: 0, note: 'total = 0, i = 1 ලෙස තබන්න' })
  for (let i = 1; i <= n; i += 1) {
    trace.push({ node: 'check', i, total, note: `i ≤ ${n} ද? — ඔව්` })
    total += i
    trace.push({ node: 'add', i, total, note: `total = total + i = ${total}` })
    trace.push({ node: 'inc', i: i + 1, total, note: `i = i + 1 = ${i + 1}` })
  }
  trace.push({ node: 'check', i: n + 1, total, note: `i ≤ ${n} ද? — නැත` })
  trace.push({ node: 'out', i: n + 1, total, note: `total පෙන්වන්න = ${total}` })
  return trace
}

const FLOW_NODES = [
  { id: 'start', text: 'ආරම්භය', tone: 'rounded-full border-emerald-300 bg-emerald-50 text-emerald-700' },
  { id: 'init', text: 'total = 0, i = 1', tone: 'border-slate-300 bg-white text-slate-700' },
  { id: 'check', text: 'i ≤ n ද?', tone: 'border-amber-300 bg-amber-50 text-amber-800' },
  { id: 'add', text: 'total = total + i', tone: 'border-slate-300 bg-white text-slate-700' },
  { id: 'inc', text: 'i = i + 1', tone: 'border-slate-300 bg-white text-slate-700' },
  { id: 'out', text: 'total පෙන්වන්න', tone: 'border-sky-300 bg-sky-50 text-sky-700' },
]

export function FlowchartSim() {
  const [n, setN] = useState(5)
  const [step, setStep] = useState(0)

  const trace = useMemo(() => buildFlowTrace(Math.max(0, Math.floor(n))), [n])
  const current = trace[Math.min(step, trace.length - 1)]

  return (
    <div className="space-y-3">
      <Slider label="අවසාන අගය (n)" value={n} onChange={setN} min={0} max={20} />

      <SimFrame caption="1 සිට n දක්වා සංඛ්‍යා එකතු කරන ඇල්ගොරිතමය. පියවරෙන් පියවර ධාවනය කර ලූපය නිරීක්ෂණය කරන්න.">
        <div className="rounded-xl bg-slate-50 p-2">
          <div className="mx-auto max-w-[230px] space-y-0.5">
            {FLOW_NODES.map((node, idx) => (
              <div key={node.id}>
                <div
                  className={`rounded-lg border px-2 py-1.5 text-center text-[11.5px] font-semibold transition ${
                    current.node === node.id ? 'border-2 border-leaf-500 bg-leaf-50 text-leaf-800 shadow-sm' : node.tone
                  }`}
                >
                  {node.text}
                  {node.id === 'check' ? <span className="ml-1 text-[10px] font-normal">( ඔව් → පහළට / නැත → total පෙන්වන්න )</span> : null}
                </div>
                {idx < FLOW_NODES.length - 1 ? <div className="text-center text-[10px] leading-none text-slate-400">↓</div> : null}
              </div>
            ))}
            <div className="text-center text-[10px] leading-none text-slate-400">↺ i = i + 1 න් පසු නැවත i ≤ n පරීක්ෂාවට</div>
          </div>
        </div>
      </SimFrame>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-center">
          <div className="text-[10.5px] text-slate-500">i</div>
          <div className="font-mono text-[13px] font-bold">{current.i}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-center">
          <div className="text-[10.5px] text-slate-500">total</div>
          <div className="font-mono text-[13px] font-bold">{current.total}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-center">
          <div className="text-[10.5px] text-slate-500">පියවර</div>
          <div className="font-mono text-[13px] font-bold">
            {Math.min(step, trace.length - 1) + 1}/{trace.length}
          </div>
        </div>
      </div>

      <p className="rounded-xl bg-amber-50 px-3 py-2 text-[12px] leading-relaxed text-amber-900">{current.note}</p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="btn-ghost flex-1 py-2 text-[12.5px] disabled:opacity-40"
        >
          ← පෙර පියවර
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(trace.length - 1, s + 1))}
          disabled={step >= trace.length - 1}
          className="btn-primary flex-1 py-2 text-[12.5px] disabled:opacity-40"
        >
          ඊළඟ පියවර →
        </button>
      </div>
      <button type="button" onClick={() => setStep(0)} className="w-full text-[11.5px] font-semibold text-slate-500">
        නැවත ආරම්භ කරන්න
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 4. දත්ත සමුදා විමසුම් මෙවලම                                          */
/* ------------------------------------------------------------------ */
const STUDENTS = [
  { name: 'අමල්', grade: 9, marks: 78 },
  { name: 'නිමල්', grade: 10, marks: 62 },
  { name: 'කමල්', grade: 11, marks: 91 },
  { name: 'සචිනි', grade: 9, marks: 55 },
  { name: 'දිල්ෂා', grade: 10, marks: 84 },
  { name: 'තරිඳු', grade: 11, marks: 47 },
  { name: 'නදීෂා', grade: 9, marks: 66 },
  { name: 'රුවන්', grade: 10, marks: 73 },
]

export function QuerySim() {
  const [field, setField] = useState('marks')
  const [op, setOp] = useState('>')
  const [value, setValue] = useState('70')

  const numeric = Number(value)
  const valid = value.trim() !== '' && Number.isFinite(numeric)

  const rows = useMemo(() => {
    if (!valid) return STUDENTS
    return STUDENTS.filter((r) => {
      const cell = r[field]
      if (op === '=') return cell === numeric
      if (op === '>') return cell > numeric
      if (op === '<') return cell < numeric
      if (op === '>=') return cell >= numeric
      return cell <= numeric
    })
  }, [field, op, numeric, valid])

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-1.5">
        <label className="block">
          <span className="text-[10.5px] font-semibold text-slate-500">ක්ෂේත්‍රය</span>
          <select value={field} onChange={(e) => setField(e.target.value)} className="field mt-0.5 px-2 py-1.5 text-[12px]">
            <option value="marks">ලකුණු</option>
            <option value="grade">ශ්‍රේණිය</option>
          </select>
        </label>
        <label className="block">
          <span className="text-[10.5px] font-semibold text-slate-500">කොන්දේසිය</span>
          <select value={op} onChange={(e) => setOp(e.target.value)} className="field mt-0.5 px-2 py-1.5 text-[12px]">
            {['=', '>', '<', '>=', '<='].map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-[10.5px] font-semibold text-slate-500">අගය</span>
          <input
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="field mt-0.5 px-2 py-1.5 text-[12px]"
            aria-label="විමසුමේ අගය"
          />
        </label>
      </div>

      <div className="overflow-x-auto rounded-xl bg-slate-900 px-3 py-2">
        <code className="whitespace-nowrap font-mono text-[11.5px] text-emerald-300">
          SELECT * FROM students WHERE {field} {op} {valid ? numeric : '?'};
        </code>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-left text-[12px]">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-2 py-1.5 font-semibold">නම</th>
              <th className="px-2 py-1.5 font-semibold">ශ්‍රේණිය</th>
              <th className="px-2 py-1.5 text-right font-semibold">ලකුණු</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t border-slate-100 text-slate-700">
                <td className="px-2 py-1.5">{r.name}</td>
                <td className="px-2 py-1.5">{r.grade}</td>
                <td className="px-2 py-1.5 text-right font-mono">{r.marks}</td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-2 py-3 text-center text-[12px] text-slate-400">
                  ගැලපෙන වාර්තා නැත
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <p className="text-center text-[11.5px] text-slate-500">
        වාර්තා {rows.length}ක් ගැලපේ · මුළු වාර්තා {STUDENTS.length}
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 5. පැතුරුම්පත් ශ්‍රිත පරීක්ෂකය                                        */
/* ------------------------------------------------------------------ */
const FNS = ['SUM', 'AVERAGE', 'MIN', 'MAX', 'COUNT', 'IF']

export function SheetFnsSim() {
  const [values, setValues] = useState(['5', '10', '15'])
  const [fn, setFn] = useState('SUM')

  const nums = values.map((v) => {
    const n = Number(v)
    return v.trim() !== '' && Number.isFinite(n) ? n : 0
  })

  const result = useMemo(() => {
    const sum = nums.reduce((s, v) => s + v, 0)
    if (fn === 'SUM') return sum
    if (fn === 'AVERAGE') return nums.length ? sum / nums.length : 0
    if (fn === 'MIN') return Math.min(...nums)
    if (fn === 'MAX') return Math.max(...nums)
    if (fn === 'COUNT') return nums.filter((n) => n !== 0).length
    return nums[0] >= nums[1] ? `"සමත්"` : `"අසමත්"`
  }, [fn, nums])

  const formula =
    fn === 'IF' ? '=IF(A1>=A2,"සමත්","අසමත්")' : `=${fn}(A1:A${values.length})`

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-1.5">
        {values.map((v, i) => (
          <label key={i} className="block">
            <span className="text-[10.5px] font-semibold text-slate-500">A{i + 1}</span>
            <input
              type="text"
              inputMode="decimal"
              value={v}
              onChange={(e) =>
                setValues((prev) => prev.map((old, idx) => (idx === i ? e.target.value : old)))
              }
              className="field mt-0.5 px-2 py-1.5 text-center font-mono text-[12.5px]"
              aria-label={`A${i + 1} සෛලයේ අගය`}
            />
          </label>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {FNS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFn(f)}
            className={`rounded-xl border px-2 py-1.5 font-mono text-[11.5px] font-bold transition ${
              fn === f ? 'border-leaf-500 bg-leaf-50 text-leaf-700' : 'border-slate-200 bg-white text-slate-600'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <SimFrame caption="සෛල අගයන් වෙනස් කර ශ්‍රිතය තෝරන්න. සූත්‍රය හා ප්‍රතිඵලය එකවර යාවත්කාලීන වේ.">
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="font-mono text-[12.5px] font-bold text-sky-700">{formula}</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-[11px] text-slate-500">ප්‍රතිඵලය</span>
            <span className="font-mono text-2xl font-extrabold text-leaf-700">{String(result)}</span>
          </div>
        </div>
      </SimFrame>
      <Readout
        items={[
          { label: 'එකතුව', value: String(nums.reduce((s, v) => s + v, 0)) },
          { label: 'සාමාන්‍යය', value: (nums.reduce((s, v) => s + v, 0) / nums.length).toFixed(2) },
          { label: 'අවම', value: String(Math.min(...nums)) },
          { label: 'උපරිම', value: String(Math.max(...nums)) },
        ]}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 6. ක්‍රමලේඛ ධාවන සිමාකරණය                                            */
/* ------------------------------------------------------------------ */
const CODE = ['total = 0', 'for i in range(1, n+1):', '    total = total + i', 'print(total)']

function buildTrace(n) {
  const steps = [{ line: 0, i: '—', total: '—', out: '', note: 'total = 0 ලෙස ආරම්භ කරයි' }]
  let total = 0
  for (let i = 1; i <= n; i += 1) {
    steps.push({ line: 1, i, total, out: '', note: `i = ${i} ලෙස ලූපයට ඇතුළු වේ` })
    total += i
    steps.push({ line: 2, i, total, out: '', note: `total = ${total - i} + ${i} = ${total}` })
  }
  steps.push({ line: 1, i: n + 1, total, out: '', note: `i = ${n + 1} නිසා range අවසන් — ලූපය නවතී` })
  steps.push({ line: 3, i: n + 1, total, out: String(total), note: `ප්‍රතිදානය: ${total}` })
  return steps
}

export function TraceSim() {
  const [n, setN] = useState(4)
  const [step, setStep] = useState(0)

  const steps = useMemo(() => buildTrace(Math.max(0, Math.floor(n))), [n])
  const cur = steps[Math.min(step, steps.length - 1)]

  return (
    <div className="space-y-3">
      <Slider label="ලූපයේ අවසාන අගය (n)" value={n} onChange={setN} min={0} max={12} />

      <SimFrame caption="Python ක්‍රමලේඛයක් පේළියෙන් පේළිය ධාවනය වන ආකාරය. එක් එක් පියවරේදී විචල්‍ය අගයන් බලන්න.">
        <div className="overflow-hidden rounded-xl bg-slate-900 p-3 font-mono text-[12px] leading-[1.9]">
          {CODE.map((line, idx) => (
            <div
              key={idx}
              className={`flex gap-3 rounded px-2 ${
                cur.line === idx ? 'bg-emerald-500/20 text-emerald-200' : 'text-slate-300'
              }`}
            >
              <span className="w-3 shrink-0 text-right text-slate-500">{idx + 1}</span>
              <span className="whitespace-pre">{line}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-slate-50 px-2 py-1">
            <div className="text-[10px] text-slate-500">i</div>
            <div className="font-mono text-[12.5px] font-bold">{cur.i}</div>
          </div>
          <div className="rounded-lg bg-slate-50 px-2 py-1">
            <div className="text-[10px] text-slate-500">total</div>
            <div className="font-mono text-[12.5px] font-bold">{cur.total}</div>
          </div>
          <div className="rounded-lg bg-slate-50 px-2 py-1">
            <div className="text-[10px] text-slate-500">ප්‍රතිදානය</div>
            <div className="font-mono text-[12.5px] font-bold">{cur.out || '—'}</div>
          </div>
        </div>
      </SimFrame>

      <p className="rounded-xl bg-amber-50 px-3 py-2 text-[12px] leading-relaxed text-amber-900">{cur.note}</p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="btn-ghost flex-1 py-2 text-[12.5px] disabled:opacity-40"
        >
          ← පෙර
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
          disabled={step >= steps.length - 1}
          className="btn-primary flex-1 py-2 text-[12.5px] disabled:opacity-40"
        >
          ඊළඟ →
        </button>
      </div>
      <button type="button" onClick={() => setStep(0)} className="w-full text-[11.5px] font-semibold text-slate-500">
        නැවත ධාවනය කරන්න
      </button>
    </div>
  )
}
