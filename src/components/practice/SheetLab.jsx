import { useMemo, useState } from 'react'
import { useStored } from './useStored.js'

const COLS = ['A', 'B', 'C', 'D']
const ROWS = 6

const SEED = {
  A1: 'ලකුණු',
  A2: '70',
  A3: '85',
  A4: '60',
  A5: '=SUM(A2:A4)',
  A6: '=AVERAGE(A2:A4)',
  B1: 'සමත්?',
  B2: '=IF(A2>=50,"සමත්","අසමත්")',
  B3: '=IF(A3>=50,"සමත්","අසමත්")',
  B4: '=IF(A4>=50,"සමත්","අසමත්")',
}

const colIndex = (c) => c.toUpperCase().charCodeAt(0) - 65

function splitArgs(s) {
  const out = []
  let depth = 0
  let cur = ''
  for (const ch of s) {
    if (ch === '(') depth += 1
    if (ch === ')') depth -= 1
    if (ch === ',' && depth === 0) {
      out.push(cur)
      cur = ''
    } else {
      cur += ch
    }
  }
  if (cur.trim() !== '') out.push(cur)
  return out
}

function numericCell(key, cells, depth) {
  if (depth > 8) return 0
  const raw = cells[key]
  if (raw === undefined || raw === '') return 0
  const s = String(raw).trim()
  if (!s.startsWith('=')) {
    const n = Number(s)
    return Number.isFinite(n) ? n : 0
  }
  const res = evalFormula(s, cells, depth + 1)
  return typeof res === 'number' && Number.isFinite(res) ? res : 0
}

function rangeNumbers(part, cells, depth) {
  const m = part.trim().match(/^([A-Z])(\d+):([A-Z])(\d+)$/i)
  if (!m) return []
  const c1 = colIndex(m[1])
  const c2 = colIndex(m[3])
  const r1 = Number(m[2])
  const r2 = Number(m[4])
  const out = []
  for (let c = Math.min(c1, c2); c <= Math.max(c1, c2); c += 1) {
    for (let r = Math.min(r1, r2); r <= Math.max(r1, r2); r += 1) {
      out.push(numericCell(`${COLS[c] ?? 'A'}${r}`, cells, depth))
    }
  }
  return out
}

function evalFormula(formula, cells, depth = 0) {
  if (depth > 8) return '#LOOP'
  const expr = String(formula).replace(/^=/, '').trim()
  const fnMatch = expr.match(/^(SUM|AVERAGE|MIN|MAX|COUNT|IF)\s*\(([\s\S]*)\)$/i)

  if (fnMatch) {
    const fn = fnMatch[1].toUpperCase()
    const args = splitArgs(fnMatch[2])

    if (fn === 'IF') {
      const cond = (args[0] ?? '').trim()
      const yes = (args[1] ?? '').trim()
      const no = (args[2] ?? '').trim()
      const m = cond.match(/^([A-Z]\d+)\s*(>=|<=|>|<|=)\s*(.+)$/i)
      let pass = false
      if (m) {
        const left = numericCell(m[1].toUpperCase(), cells, depth)
        const right = m[3].trim()
        const rightNum = /^[A-Z]\d+$/i.test(right) ? numericCell(right.toUpperCase(), cells, depth) : Number(right)
        const rv = Number.isFinite(rightNum) ? rightNum : 0
        if (m[2] === '>=') pass = left >= rv
        else if (m[2] === '<=') pass = left <= rv
        else if (m[2] === '>') pass = left > rv
        else if (m[2] === '<') pass = left < rv
        else pass = left === rv
      }
      const chosen = pass ? yes : no
      if (/^".*"$/.test(chosen)) return chosen.slice(1, -1)
      const n = Number(chosen)
      return Number.isFinite(n) ? n : chosen
    }

    const nums = []
    args.forEach((a) => {
      const t = a.trim()
      if (/^[A-Z]\d+:[A-Z]\d+$/i.test(t)) nums.push(...rangeNumbers(t, cells, depth))
      else if (/^[A-Z]\d+$/i.test(t)) nums.push(numericCell(t.toUpperCase(), cells, depth))
      else if (t !== '') {
        const n = Number(t)
        nums.push(Number.isFinite(n) ? n : 0)
      }
    })

    if (fn === 'SUM') return nums.reduce((s, v) => s + v, 0)
    if (fn === 'AVERAGE') return nums.length ? nums.reduce((s, v) => s + v, 0) / nums.length : 0
    if (fn === 'MIN') return nums.length ? Math.min(...nums) : 0
    if (fn === 'MAX') return nums.length ? Math.max(...nums) : 0
    if (fn === 'COUNT') return nums.length
  }

  const replaced = expr.replace(/\b([A-Z])(\d{1,2})\b/gi, (m, c, r) =>
    String(numericCell(`${c.toUpperCase()}${r}`, cells, depth)),
  )
  if (!/^[0-9+\-*/().\s]+$/.test(replaced)) return '#VALUE!'
  try {
    // eslint-disable-next-line no-new-func
    const v = Function(`"use strict";return (${replaced})`)()
    return Number.isFinite(v) ? v : '#VALUE!'
  } catch {
    return '#ERROR'
  }
}

export function displayCell(key, cells, depth = 0) {
  const raw = cells[key]
  if (raw === undefined || raw === '') return ''
  const s = String(raw).trim()
  if (!s.startsWith('=')) return String(raw)
  const res = evalFormula(s, cells, depth + 1)
  if (typeof res === 'number') return Number.isInteger(res) ? String(res) : res.toFixed(2)
  return String(res)
}

export function SheetLab() {
  const [state, setState] = useStored('ol-practice-sheet-v1', { cells: SEED, fmt: {} })
  const [selected, setSelected] = useState('A5')
  const [showChart, setShowChart] = useState(true)

  const cells = state.cells ?? SEED
  const fmt = state.fmt ?? {}
  const current = cells[selected] ?? ''

  const chart = useMemo(() => {
    return Array.from({ length: ROWS }, (_, i) => {
      const key = `A${i + 1}`
      const val = numericCell(key, cells, 0)
      return { key, val }
    }).filter((d) => d.val > 0)
  }, [cells])

  const maxVal = Math.max(1, ...chart.map((d) => d.val))

  const setCell = (raw) => setState((s) => ({ ...s, cells: { ...(s.cells ?? SEED), [selected]: raw } }))
  const toggleFmt = (name) =>
    setState((s) => {
      const f = s.fmt ?? {}
      const cur = f[selected] ?? {}
      return { ...s, fmt: { ...f, [selected]: { ...cur, [name]: !cur[name] } } }
    })

  const reset = () => {
    setState({ cells: SEED, fmt: {} })
    setSelected('A1')
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => toggleFmt('bold')}
          className={`rounded-lg border px-2.5 py-1 text-[12px] font-bold transition ${
            fmt[selected]?.bold ? 'border-leaf-500 bg-leaf-50 text-leaf-700' : 'border-slate-200 bg-white text-slate-600'
          }`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => toggleFmt('fill')}
          className={`rounded-lg border px-2.5 py-1 text-[12px] font-semibold transition ${
            fmt[selected]?.fill ? 'border-amber-400 bg-amber-100 text-amber-800' : 'border-slate-200 bg-white text-slate-600'
          }`}
        >
          පසුබිම
        </button>
        <button
          type="button"
          onClick={() => setShowChart((v) => !v)}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[12px] font-semibold text-slate-600"
        >
          {showChart ? 'ප්‍රස්තාරය සඟවන්න' : 'ප්‍රස්තාරය පෙන්වන්න'}
        </button>
        <button
          type="button"
          onClick={reset}
          className="ml-auto rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[12px] font-semibold text-slate-600"
        >
          නැවත සකසන්න
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr>
              <th className="w-8 border-b border-r border-slate-200 bg-slate-50 px-1 py-1 font-mono text-[10.5px] text-slate-400"></th>
              {COLS.map((c) => (
                <th key={c} className="border-b border-r border-slate-200 bg-slate-50 px-1 py-1 font-mono text-[11px] font-bold text-slate-500">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: ROWS }, (_, r) => (
              <tr key={r}>
                <th className="border-b border-r border-slate-200 bg-slate-50 px-1 py-1 font-mono text-[10.5px] font-bold text-slate-400">
                  {r + 1}
                </th>
                {COLS.map((c) => {
                  const key = `${c}${r + 1}`
                  const isSel = key === selected
                  return (
                    <td key={key} className="p-0">
                      <button
                        type="button"
                        onClick={() => setSelected(key)}
                        className={`block h-full min-h-[34px] w-full truncate border-b border-r border-slate-100 px-1.5 py-1 text-left ${
                          isSel ? 'bg-leaf-50 ring-2 ring-inset ring-leaf-400' : 'hover:bg-slate-50'
                        } ${fmt[key]?.bold ? 'font-bold' : ''} ${fmt[key]?.fill ? 'bg-amber-50' : ''}`}
                        title={displayCell(key, cells)}
                      >
                        {displayCell(key, cells)}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-white px-2 py-0.5 font-mono text-[11.5px] font-bold text-leaf-700">{selected}</span>
          <span className="text-[11px] text-slate-500">සූත්‍ර තීරුව</span>
        </div>
        <input
          type="text"
          value={current}
          onChange={(e) => setCell(e.target.value)}
          placeholder="අගයක් හෝ =SUM(A1:A3) වැනි සූත්‍රයක් ලියන්න"
          aria-label={`${selected} සෛලයේ අන්තර්ගතය`}
          className="field mt-1.5 font-mono text-[12.5px]"
        />
        <p className="mt-1.5 text-[11px] text-slate-500">
          ප්‍රතිඵලය: <span className="font-mono font-bold text-ink">{displayCell(selected, cells) || '—'}</span>
        </p>
      </div>

      {showChart ? (
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="text-[11.5px] font-bold text-slate-600">A තීරුවේ දත්තවල තීරු ප්‍රස්තාරය</div>
          <div className="mt-2 flex h-28 items-end gap-2">
            {chart.map((d) => (
              <div key={d.key} className="flex flex-1 flex-col items-center justify-end">
                <span className="mb-0.5 font-mono text-[10px] text-slate-500">{d.val}</span>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-leaf-600 to-leaf-400"
                  style={{ height: `${Math.max(4, (d.val / maxVal) * 78)}px` }}
                />
                <span className="mt-0.5 font-mono text-[9.5px] text-slate-400">{d.key}</span>
              </div>
            ))}
            {chart.length === 0 ? <p className="text-[12px] text-slate-400">A තීරුවේ සංඛ්‍යා ඇතුළත් කරන්න.</p> : null}
          </div>
        </div>
      ) : null}

      <div className="rounded-xl border border-sky-100 bg-sky-50/70 p-3">
        <div className="text-[11.5px] font-bold text-sky-700">පැතුරුම්පත් අභ්‍යාස</div>
        <ol className="mt-1 space-y-1 text-[12px] leading-relaxed text-slate-700">
          <li>1. A2:A4 අගයන් වෙනස් කර A5 හි එකතුව ස්වයංක්‍රීයව වෙනස් වන බව බලන්න.</li>
          <li>2. B2 සෛලයේ IF සූත්‍රය 60, 45 වැනි අගයන් සමඟ අත්හදා බලන්න.</li>
          <li>3. C1 සෛලයේ =MAX(A2:A4) ලියා උපරිම අගය සොයන්න.</li>
          <li>4. සෛලයක් තෝරා "B" හා "පසුබිම" මගින් සැකසුම් යොදන්න.</li>
        </ol>
      </div>
    </div>
  )
}
