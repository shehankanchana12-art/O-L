import { useEffect, useMemo, useRef, useState } from 'react'
import { useStored } from './useStored.js'
import {
  RBtn,
  RibbonBar,
  RibbonGroup,
  RibbonTabs,
  RSelect,
  StatusBar,
  TitleBar,
  WinWindow,
} from './winui.jsx'

/* ----------------------------- සූත්‍ර ඇගයුම ----------------------------- */

const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const ROWS = 14

const colIdx = (c) => String(c).toUpperCase().charCodeAt(0) - 65
const colName = (i) => String.fromCharCode(65 + i)

function splitArgs(s) {
  const out = []
  let depth = 0
  let cur = ''
  for (const ch of String(s)) {
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

function compare(a, op, b) {
  const an = typeof a === 'number' ? a : Number(a)
  const bn = typeof b === 'number' ? b : Number(b)
  const numeric = Number.isFinite(an) && Number.isFinite(bn) && String(a).trim() !== '' && String(b).trim() !== ''
  if (numeric) {
    if (op === '>') return an > bn
    if (op === '<') return an < bn
    if (op === '>=') return an >= bn
    if (op === '<=') return an <= bn
    if (op === '<>') return an !== bn
    return an === bn
  }
  const x = String(a)
  const y = String(b)
  if (op === '>') return x > y
  if (op === '<') return x < y
  if (op === '>=') return x >= y
  if (op === '<=') return x <= y
  if (op === '<>') return x !== y
  return x === y
}

function parseCriteria(text) {
  const m = String(text).trim().match(/^(>=|<=|<>|>|<|=)?\s*(.*)$/)
  const op = (m && m[1]) || '='
  let rest = (m && m[2]) || ''
  rest = rest.trim()
  if (/^".*"$/.test(rest)) rest = rest.slice(1, -1)
  const n = Number(rest)
  return { op, target: rest !== '' && Number.isFinite(n) ? n : rest }
}

function rangeValues(arg, cells, depth) {
  const m = String(arg ?? '')
    .trim()
    .replace(/\$/g, '')
    .match(/^([A-Z]{1,2})(\d{1,3}):([A-Z]{1,2})(\d{1,3})$/i)
  if (!m) return null
  const c1 = colIdx(m[1])
  const c2 = colIdx(m[3])
  const r1 = Number(m[2])
  const r2 = Number(m[4])
  const out = []
  for (let c = Math.min(c1, c2); c <= Math.max(c1, c2); c += 1) {
    for (let r = Math.min(r1, r2); r <= Math.max(r1, r2); r += 1) {
      out.push(evalCell(`${colName(c)}${r}`, cells, depth + 1))
    }
  }
  return out
}

function applyFn(name, args, cells, depth) {
  if (name === 'IF') {
    const cond = evalExpr(args[0] ?? '', cells, depth + 1)
    const truthy =
      typeof cond === 'boolean'
        ? cond
        : typeof cond === 'number'
          ? cond !== 0
          : String(cond).toUpperCase() === 'TRUE'
    return truthy ? evalExpr(args[1] ?? '', cells, depth + 1) : evalExpr(args[2] ?? '', cells, depth + 1)
  }

  if (name === 'ROUND') {
    const v = Number(evalExpr(args[0] ?? '0', cells, depth + 1))
    const d = Number(evalExpr(args[1] ?? '0', cells, depth + 1)) || 0
    const p = 10 ** d
    return Math.round((Number.isFinite(v) ? v : 0) * p) / p
  }

  if (name === 'ABS') {
    const v = Number(evalExpr(args[0] ?? '0', cells, depth + 1))
    return Math.abs(Number.isFinite(v) ? v : 0)
  }

  if (name === 'COUNTIF' || name === 'SUMIF') {
    const vals = rangeValues(args[0], cells, depth) ?? []
    const { op, target } = parseCriteria(args[1] ?? '')
    const hits = vals.filter((v) => compare(v, op, target))
    if (name === 'COUNTIF') return hits.length
    return hits.reduce((s, v) => s + (typeof v === 'number' ? v : 0), 0)
  }

  const nums = []
  args.forEach((a) => {
    const rng = rangeValues(a, cells, depth)
    if (rng) {
      rng.forEach((v) => {
        if (typeof v === 'number') nums.push(v)
      })
      return
    }
    const v = evalExpr(a, cells, depth + 1)
    if (typeof v === 'number') nums.push(v)
  })
  const sum = nums.reduce((s, v) => s + v, 0)

  if (name === 'SUM') return sum
  if (name === 'PRODUCT') return nums.length ? nums.reduce((s, v) => s * v, 1) : 0
  if (name === 'AVERAGE') return nums.length ? sum / nums.length : '#DIV/0!'
  if (name === 'MIN') return nums.length ? Math.min(...nums) : 0
  if (name === 'MAX') return nums.length ? Math.max(...nums) : 0
  if (name === 'COUNT' || name === 'COUNTA') return nums.length
  if (name === 'MEDIAN') {
    if (!nums.length) return '#NUM!'
    const a = [...nums].sort((x, y) => x - y)
    const mid = Math.floor(a.length / 2)
    return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2
  }
  return '#NAME?'
}

export function evalExpr(raw, cells, depth = 0) {
  if (depth > 12) return '#REF!'
  let s = String(raw ?? '').trim()
  if (s.startsWith('=')) s = s.slice(1).trim()
  if (s === '') return ''
  if (/^"[^"]*"$/.test(s)) return s.slice(1, -1)
  if (/^-?\d+(\.\d+)?%?$/.test(s)) return s.endsWith('%') ? Number(s.slice(0, -1)) / 100 : Number(s)

  const call = s.match(/^([A-Za-z][A-Za-z0-9.]*)\s*\(([\s\S]*)\)$/)
  if (call) return applyFn(call[1].toUpperCase(), splitArgs(call[2]), cells, depth)

  const ref = s.replace(/\$/g, '').match(/^([A-Z]{1,2})(\d{1,3})$/i)
  if (ref) return evalCell(`${ref[1].toUpperCase()}${ref[2]}`, cells, depth + 1)

  const cmp = s.match(/^([\s\S]+?)(>=|<=|<>|>|<|=)([\s\S]+)$/)
  if (cmp) {
    const left = evalExpr(cmp[1], cells, depth + 1)
    const right = evalExpr(cmp[3], cells, depth + 1)
    return compare(left, cmp[2], right)
  }

  const replaced = s.replace(/\$?([A-Z]{1,2})\$?(\d{1,3})/gi, (m, c, row) => {
    const v = evalCell(`${c.toUpperCase()}${row}`, cells, depth + 1)
    return typeof v === 'number' ? `(${v})` : '0'
  })
  if (!/^[0-9+\-*/().\s]+$/.test(replaced)) return '#NAME?'
  try {
    // eslint-disable-next-line no-new-func
    const v = Function(`"use strict";return (${replaced})`)()
    return Number.isFinite(v) ? v : '#DIV/0!'
  } catch {
    return '#ERROR!'
  }
}

export function evalCell(key, cells, depth = 0) {
  const raw = cells ? cells[key] : undefined
  if (raw === undefined || raw === null) return ''
  const s = String(raw).trim()
  if (s === '') return ''
  if (s.startsWith('=')) return evalExpr(s, cells, depth + 1)
  const n = Number(s)
  if (Number.isFinite(n)) return n
  return s
}

export function displayValue(key, cells, fmtMap) {
  const v = evalCell(key, cells, 0)
  if (v === '' || v === undefined || v === null) return ''
  if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE'
  if (typeof v === 'number') {
    const f = fmtMap && fmtMap[key] ? fmtMap[key].num : undefined
    if (f === 'int') return Math.round(v).toLocaleString('en-US')
    if (f === 'dec2') return v.toFixed(2)
    if (f === 'pct') return `${Number(v.toFixed(1))}%`
    if (f === 'cur') return `රු. ${v.toFixed(2)}`
    return Number.isInteger(v) ? String(v) : String(Number(v.toFixed(4)))
  }
  return String(v)
}

/* ----------------------------- ආරම්භක දත්ත ----------------------------- */

const SEED = {
  A1: 'නම',
  B1: 'ගණිතය',
  C1: 'විද්‍යාව',
  D1: 'එකතුව',
  E1: 'සාමාන්‍යය',
  F1: 'සමත්?',
  A2: 'අමල්',
  B2: '78',
  C2: '85',
  D2: '=SUM(B2:C2)',
  E2: '=AVERAGE(B2:C2)',
  F2: '=IF(E2>=50,"සමත්","අසමත්")',
  A3: 'නිමල්',
  B3: '62',
  C3: '71',
  D3: '=SUM(B3:C3)',
  E3: '=AVERAGE(B3:C3)',
  F3: '=IF(E3>=50,"සමත්","අසමත්")',
  A4: 'කමල්',
  B4: '91',
  C4: '88',
  D4: '=SUM(B4:C4)',
  E4: '=AVERAGE(B4:C4)',
  F4: '=IF(E4>=50,"සමත්","අසමත්")',
  A5: 'සචිනි',
  B5: '55',
  C5: '49',
  D5: '=SUM(B5:C5)',
  E5: '=AVERAGE(B5:C5)',
  F5: '=IF(E5>=50,"සමත්","අසමත්")',
  A6: 'දිල්ෂා',
  B6: '84',
  C6: '79',
  D6: '=SUM(B6:C6)',
  E6: '=AVERAGE(B6:C6)',
  F6: '=IF(E6>=50,"සමත්","අසමත්")',
  A7: 'තරිඳු',
  B7: '47',
  C7: '52',
  D7: '=SUM(B7:C7)',
  E7: '=AVERAGE(B7:C7)',
  F7: '=IF(E7>=50,"සමත්","අසමත්")',
  A9: 'එකතුව',
  B9: '=SUM(B2:B7)',
  C9: '=SUM(C2:C7)',
  A10: 'උපරිම',
  B10: '=MAX(B2:B7)',
  C10: '=MAX(C2:C7)',
  A11: 'අවම',
  B11: '=MIN(B2:B7)',
  C11: '=MIN(C2:C7)',
  A12: 'සමත් ගණන',
  B12: '=COUNTIF(E2:E7,">=50")',
}

const DEFAULT_BOOK = {
  sheets: [
    { name: 'ලකුණු', cells: SEED, fmt: {} },
    { name: 'පත්‍රය 2', cells: {}, fmt: {} },
  ],
  active: 0,
}

const TABS = [
  { id: 'home', label: 'මුල් පිටුව' },
  { id: 'insert', label: 'ඇතුළු කරන්න' },
  { id: 'formulas', label: 'සූත්‍ර' },
  { id: 'data', label: 'දත්ත' },
  { id: 'view', label: 'දර්ශනය' },
]

const NUM_OPTS = [
  { value: 'auto', label: 'ස්වයංක්‍රීය' },
  { value: 'int', label: 'සංඛ්‍යාව' },
  { value: 'cur', label: 'මුදල්' },
  { value: 'pct', label: 'ප්‍රතිශතය' },
  { value: 'dec2', label: 'දශම 2' },
]

/* ------------------------------ ප්‍රස්තාරය ------------------------------ */

function Chart({ type, data, title }) {
  if (!data.length) {
    return (
      <div className="grid h-28 place-items-center rounded border border-dashed border-slate-300 text-[10.5px] text-slate-400">
        ප්‍රස්තාරයට සංඛ්‍යා ඇතුළත් කරන්න
      </div>
    )
  }
  const W = 330
  const H = 150
  const P = 22
  const max = Math.max(1, ...data.map((d) => d.v))
  const colors = ['#217346', '#4aa3f0', '#f2c14e', '#e8664a', '#8b5cf6', '#0f9d63', '#64748b', '#d946ef']

  if (type === 'pie') {
    const total = data.reduce((s, d) => s + Math.max(0, d.v), 0) || 1
    const cx = W / 2
    const cy = H / 2
    const r = Math.min(H, W) / 2 - 10
    let angle = -Math.PI / 2
    const slices = data.map((d, i) => {
      const a = (Math.max(0, d.v) / total) * Math.PI * 2
      const x1 = cx + r * Math.cos(angle)
      const y1 = cy + r * Math.sin(angle)
      angle += a
      const x2 = cx + r * Math.cos(angle)
      const y2 = cy + r * Math.sin(angle)
      const large = a > Math.PI ? 1 : 0
      const path =
        data.length === 1
          ? `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`
          : `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`
      return <path key={d.key} d={path} fill={colors[i % colors.length]} stroke="#fff" strokeWidth="1" />
    })
    return <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">{slices}</svg>
  }

  if (type === 'line') {
    const step = (W - P * 2) / Math.max(1, data.length - 1)
    const points = data.map((d, i) => `${P + i * step},${H - P - (d.v / max) * (H - P * 2)}`).join(' ')
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
        <line x1={P} y1={H - P} x2={W - P} y2={H - P} stroke="#cbd5e1" />
        <polyline points={points} fill="none" stroke="#217346" strokeWidth="1.8" />
        {data.map((d, i) => {
          const x = P + i * step
          const y = H - P - (d.v / max) * (H - P * 2)
          return (
            <g key={d.key}>
              <circle cx={x} cy={y} r="2.4" fill="#217346" />
              <text x={x} y={H - P + 9} fontSize="6" textAnchor="middle" fill="#94a3b8">
                {d.label.slice(0, 6)}
              </text>
            </g>
          )
        })}
      </svg>
    )
  }

  const slot = (W - P * 2) / Math.max(1, data.length)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
      <line x1={P} y1={H - P} x2={W - P} y2={H - P} stroke="#cbd5e1" />
      {data.map((d, i) => {
        const h = Math.max(1, (d.v / max) * (H - P * 2))
        const x = P + i * slot + slot * 0.18
        const w = slot * 0.64
        return (
          <g key={d.key}>
            <rect x={x} y={H - P - h} width={w} height={h} fill="#217346" rx="1.5" />
            <text x={x + w / 2} y={H - P - h - 3} fontSize="6.5" textAnchor="middle" fill="#475569">
              {d.v}
            </text>
            <text x={x + w / 2} y={H - P + 9} fontSize="6" textAnchor="middle" fill="#94a3b8">
              {d.label.slice(0, 6)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* ------------------------------ පත්‍රිකාව ------------------------------ */

export function SheetLab() {
  const [book, setBook] = useStored('ol-practice-sheet-v2', DEFAULT_BOOK)
  const sheets = Array.isArray(book.sheets) && book.sheets.length ? book.sheets : DEFAULT_BOOK.sheets
  const active = Math.min(Math.max(0, Number(book.active) || 0), sheets.length - 1)
  const sheet = sheets[active] || DEFAULT_BOOK.sheets[0]
  const cells = sheet.cells || {}
  const fmtMap = sheet.fmt || {}

  const [tab, setTab] = useState('home')
  const [sel, setSel] = useState('A1')
  const [draft, setDraft] = useState('')
  const [goto, setGoto] = useState('A1')
  const [showChart, setShowChart] = useState(true)
  const [chartType, setChartType] = useState('bar')
  const [filter, setFilter] = useState('')
  const [grid, setGrid] = useState(true)
  const [headings, setHeadings] = useState(true)
  const cellRef = useRef(null)

  useEffect(() => {
    setDraft(String(cells[sel] ?? ''))
    setGoto(sel)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel, active])

  useEffect(() => {
    if (typeof document !== 'undefined' && document.activeElement === document.body) {
      cellRef.current?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel])

  const updateActive = (fn) => {
    setBook((b) => {
      const list = Array.isArray(b.sheets) && b.sheets.length ? b.sheets : DEFAULT_BOOK.sheets
      const idx = Math.min(Math.max(0, Number(b.active) || 0), list.length - 1)
      const copy = list.slice()
      copy[idx] = fn(copy[idx] || { name: 'පත්‍රය', cells: {}, fmt: {} })
      return { ...b, sheets: copy, active: idx }
    })
  }

  const writeCell = (key, value) => updateActive((s) => ({ ...s, cells: { ...(s.cells || {}), [key]: value } }))
  const commit = (value) => {
    writeCell(sel, value)
    setDraft(value)
  }

  const setStyle = (prop, value) =>
    updateActive((s) => {
      const f = { ...(s.fmt || {}) }
      f[sel] = { ...(f[sel] || {}), [prop]: value }
      return { ...s, fmt: f }
    })

  const toggleStyle = (prop) =>
    updateActive((s) => {
      const f = { ...(s.fmt || {}) }
      const cur = f[sel] || {}
      f[sel] = { ...cur, [prop]: !cur[prop] }
      return { ...s, fmt: f }
    })

  const move = (dr, dc) => {
    const m = sel.match(/^([A-Z])(\d+)$/)
    const c = Math.min(COLS.length - 1, Math.max(0, colIdx(m ? m[1] : 'A') + dc))
    const r = Math.min(ROWS, Math.max(1, Number(m ? m[2] : 1) + dr))
    setSel(`${colName(c)}${r}`)
  }

  const onKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      commit(draft)
      move(1, 0)
    } else if (e.key === 'Tab') {
      e.preventDefault()
      commit(draft)
      move(0, 1)
    } else if (e.key === 'Escape') {
      setDraft(String(cells[sel] ?? ''))
    }
  }

  const jump = (value) => {
    const v = String(value).toUpperCase().replace(/[^A-Z0-9]/g, '')
    const m = v.match(/^([A-H])(\d{1,3})$/)
    if (!m) return
    const c = m[1]
    const r = Math.min(ROWS, Math.max(1, Number(m[2])))
    setSel(`${c}${r}`)
  }

  const autoSum = () => {
    const m = sel.match(/^([A-Z])(\d+)$/)
    if (!m) return
    const col = m[1]
    const end = Number(m[2]) - 1
    if (end < 1) {
      setDraft('=SUM(')
      return
    }
    let start = end
    while (start > 1 && String(cells[`${col}${start - 1}`] ?? '') !== '') start -= 1
    const text = `=SUM(${col}${start}:${col}${end})`
    writeCell(sel, text)
    setDraft(text)
  }

  const insertFn = (name) => {
    commit(draft)
    setDraft(`=${name}(`)
    requestAnimationFrame(() => cellRef.current?.focus())
  }

  const sortBy = (dir) => {
    updateActive((s) => {
      const cs = { ...(s.cells || {}) }
      let maxRow = 1
      Object.keys(cs).forEach((k) => {
        const m = k.match(/^([A-Z]{1,2})(\d{1,3})$/)
        if (m && String(cs[k] ?? '').trim() !== '') maxRow = Math.max(maxRow, Number(m[2]))
      })
      if (maxRow < 2) return s
      const rowsData = []
      for (let r = 2; r <= maxRow; r += 1) {
        const row = {}
        let filled = false
        COLS.forEach((c) => {
          row[c] = cs[`${c}${r}`] ?? ''
          if (String(row[c]).trim() !== '') filled = true
        })
        if (filled) rowsData.push({ row, val: evalCell(`${sel[0]}${r}`, cs, 0) })
      }
      rowsData.sort((a, b) => {
        if (typeof a.val === 'number' && typeof b.val === 'number') return dir === 'asc' ? a.val - b.val : b.val - a.val
        const as = String(a.val ?? '')
        const bs = String(b.val ?? '')
        return dir === 'asc' ? as.localeCompare(bs, 'si') : bs.localeCompare(as, 'si')
      })
      rowsData.forEach((item, i) => {
        const r = i + 2
        COLS.forEach((c) => {
          cs[`${c}${r}`] = item.row[c] ?? ''
        })
      })
      return { ...s, cells: cs }
    })
  }

  const addSheet = () =>
    setBook((b) => {
      const list = Array.isArray(b.sheets) && b.sheets.length ? b.sheets : DEFAULT_BOOK.sheets
      return { ...b, sheets: [...list, { name: `පත්‍රය ${list.length + 1}`, cells: {}, fmt: {} }], active: list.length }
    })

  const removeSheet = () =>
    setBook((b) => {
      const list = Array.isArray(b.sheets) && b.sheets.length ? b.sheets : DEFAULT_BOOK.sheets
      if (list.length < 2) return b
      const idx = Math.min(Math.max(0, Number(b.active) || 0), list.length - 1)
      return { ...b, sheets: list.filter((_, i) => i !== idx), active: Math.max(0, idx - 1) }
    })

  const chartRows = useMemo(() => {
    const col = sel.replace(/\d+/g, '') || 'A'
    const out = []
    for (let r = 2; r <= ROWS; r += 1) {
      const v = evalCell(`${col}${r}`, cells, 0)
      if (typeof v === 'number') {
        const label = displayValue(`A${r}`, cells, fmtMap) || `${col}${r}`
        out.push({ key: `${col}${r}`, label, v })
      }
    }
    return out
  }, [cells, sel, fmtMap])

  const visibleRows = useMemo(() => {
    const q = filter.trim().toLowerCase()
    return Array.from({ length: ROWS }, (_, i) => i + 1).filter((r) => {
      if (!q) return true
      return COLS.some((c) => displayValue(`${c}${r}`, cells, fmtMap).toLowerCase().includes(q))
    })
  }, [filter, cells, fmtMap])

  const selStyle = fmtMap[sel] || {}
  const selCol = (sel.match(/^([A-Z])/) || [])[1]

  return (
    <WinWindow>
      <TitleBar badge="X" color="#217346" file="ශිෂ්‍ය ලකුණු.xlsx" app="Excel" saving="සුරකින ලදී" />
      <RibbonTabs tabs={TABS} active={tab} onChange={setTab} hint="Enter = පහළට · Tab = දකුණට" />
      <RibbonBar>
        {tab === 'home' ? (
          <>
            <RibbonGroup label="ෆොන්ට්">
              <RBtn icon="B" active={selStyle.bold} onClick={() => toggleStyle('bold')} className="font-bold" />
              <RBtn icon="I" active={selStyle.italic} onClick={() => toggleStyle('italic')} className="italic" />
              <RBtn icon="🪣" label="පසුබිම" active={selStyle.fill} onClick={() => toggleStyle('fill')} />
            </RibbonGroup>
            <RibbonGroup label="පෙළගැස්ම">
              <RBtn icon="⇤" active={selStyle.align === 'left'} onClick={() => setStyle('align', 'left')} title="වමට" />
              <RBtn icon="⇔" active={selStyle.align === 'center'} onClick={() => setStyle('align', 'center')} title="මැදට" />
              <RBtn icon="⇥" active={selStyle.align === 'right'} onClick={() => setStyle('align', 'right')} title="දකුණට" />
            </RibbonGroup>
            <RibbonGroup label="සංඛ්‍යා ආකෘතිය">
              <RSelect
                value={selStyle.num || 'auto'}
                onChange={(v) => setStyle('num', v === 'auto' ? undefined : v)}
                options={NUM_OPTS}
                label="ආකෘතිය"
              />
              <RBtn icon="රු." label="මුදල්" onClick={() => setStyle('num', 'cur')} />
              <RBtn icon="%" label="ප්‍රතිශත" onClick={() => setStyle('num', 'pct')} />
            </RibbonGroup>
            <RibbonGroup label="සෛල">
              <RBtn icon="Σ" label="ස්වයං එකතුව" onClick={autoSum} title="Alt + =" />
              <RBtn
                icon="⌫"
                label="ඉවත් කරන්න"
                onClick={() => {
                  writeCell(sel, '')
                  setDraft('')
                }}
              />
            </RibbonGroup>
            <RibbonGroup label="සංස්කරණය">
              <RBtn icon="A→Z" label="ආරෝහණ" onClick={() => sortBy('asc')} />
              <RBtn icon="Z→A" label="අවරෝහණ" onClick={() => sortBy('desc')} />
            </RibbonGroup>
          </>
        ) : null}

        {tab === 'insert' ? (
          <>
            <RibbonGroup label="ප්‍රස්තාරය">
              <RSelect
                value={chartType}
                onChange={setChartType}
                options={[
                  { value: 'bar', label: 'තීරු' },
                  { value: 'line', label: 'රේඛා' },
                  { value: 'pie', label: 'පයි' },
                ]}
                label="වර්ගය"
              />
              <RBtn icon="📊" label="ප්‍රස්තාරය" active={showChart} onClick={() => setShowChart((v) => !v)} />
            </RibbonGroup>
            <RibbonGroup label="වගුව">
              <RBtn
                icon="▦"
                label="ශීර්ෂ පේළිය"
                onClick={() =>
                  updateActive((s) => {
                    const f = { ...(s.fmt || {}) }
                    const cur = f.A1 || {}
                    COLS.forEach((c) => {
                      f[`${c}1`] = { ...cur, bold: true, fill: true }
                    })
                    return { ...s, fmt: f }
                  })
                }
              />
            </RibbonGroup>
            <RibbonGroup label="පත්‍රිකා">
              <RBtn icon="＋" label="නව පත්‍රය" onClick={addSheet} />
            </RibbonGroup>
          </>
        ) : null}

        {tab === 'formulas' ? (
          <>
            <RibbonGroup label="ස්වයංක්‍රීය">
              <RBtn icon="Σ" label="එකතුව" onClick={autoSum} />
              <RBtn icon="fx" label="ශ්‍රිතය" onClick={() => insertFn('IF')} />
            </RibbonGroup>
            <RibbonGroup label="ගණිත">
              <RBtn icon="Σ" label="SUM" onClick={() => insertFn('SUM')} />
              <RBtn icon="x̄" label="AVERAGE" onClick={() => insertFn('AVERAGE')} />
              <RBtn icon="↑" label="MAX" onClick={() => insertFn('MAX')} />
              <RBtn icon="↓" label="MIN" onClick={() => insertFn('MIN')} />
              <RBtn icon="#" label="COUNT" onClick={() => insertFn('COUNT')} />
            </RibbonGroup>
            <RibbonGroup label="තර්ක">
              <RBtn icon="?" label="IF" onClick={() => insertFn('IF')} />
              <RBtn icon="∑?" label="COUNTIF" onClick={() => insertFn('COUNTIF')} />
              <RBtn icon="0.0" label="ROUND" onClick={() => insertFn('ROUND')} />
            </RibbonGroup>
          </>
        ) : null}

        {tab === 'data' ? (
          <>
            <RibbonGroup label="වර්ග කිරීම">
              <RBtn icon="A→Z" label="ආරෝහණ" onClick={() => sortBy('asc')} />
              <RBtn icon="Z→A" label="අවරෝහණ" onClick={() => sortBy('desc')} />
            </RibbonGroup>
            <RibbonGroup label="පෙරහන">
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="අගයක් සොයන්න…"
                aria-label="පෙරහන් අගය"
                className="h-[22px] w-[120px] rounded border border-slate-300 px-1.5 text-[10px] leading-tight outline-none focus:border-[#217346]"
              />
              <RBtn icon="✕" label="ඉවත්" onClick={() => setFilter('')} />
            </RibbonGroup>
          </>
        ) : null}

        {tab === 'view' ? (
          <>
            <RibbonGroup label="පෙන්වීම">
              <RBtn icon="▦" label="ජාල රේඛා" active={grid} onClick={() => setGrid((v) => !v)} />
              <RBtn icon="A1" label="ශීර්ෂ" active={headings} onClick={() => setHeadings((v) => !v)} />
              <RBtn icon="📊" label="ප්‍රස්තාරය" active={showChart} onClick={() => setShowChart((v) => !v)} />
            </RibbonGroup>
          </>
        ) : null}
      </RibbonBar>

      <div className="flex shrink-0 items-center gap-1 border-b border-slate-300 bg-white px-1.5 py-1">
        <input
          value={goto}
          onChange={(e) => setGoto(e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              jump(goto)
            }
          }}
          aria-label="සෛල ලිපිනය"
          className="h-[20px] w-[52px] rounded border border-slate-300 px-1 text-center font-mono text-[10px] font-bold leading-tight text-slate-700 outline-none focus:border-[#217346]"
        />
        <span className="shrink-0 px-0.5 font-serif text-[10px] italic leading-none text-slate-400">fx</span>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          onBlur={() => commit(draft)}
          aria-label="සූත්‍ර තීරුව"
          placeholder="අගය හෝ =SUM(B2:B7)"
          className="h-[20px] min-w-0 flex-1 rounded border border-slate-300 px-1.5 font-mono text-[10.5px] leading-tight text-slate-800 outline-none focus:border-[#217346]"
        />
      </div>

      {showChart ? (
        <div className="shrink-0 border-b border-slate-200 bg-white px-2 py-1">
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-bold text-slate-500">
              ප්‍රස්තාරය — {sel.replace(/\d+/g, '')} තීරුව
            </span>
            <button
              type="button"
              onClick={() => setShowChart(false)}
              aria-label="ප්‍රස්තාරය වසන්න"
              className="text-[10px] leading-none text-slate-400 hover:text-red-500"
            >
              ✕
            </button>
          </div>
          <div className="mx-auto max-w-[360px]">
            <Chart type={chartType} data={chartRows} />
          </div>
        </div>
      ) : null}

      <div className="win-scroll min-h-0 flex-1 overflow-auto bg-white">
        <table className="w-full min-w-[420px] border-collapse" style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th className="h-[20px] w-7 border border-slate-300 bg-[#f3f3f3] text-[8px] font-normal text-slate-400">
                ◢
              </th>
              {headings
                ? COLS.map((c) => (
                    <th
                      key={c}
                      className={`h-[20px] border border-slate-300 text-[9.5px] font-semibold ${
                        c === selCol ? 'bg-[#d7e8dd] text-[#155c34]' : 'bg-[#f3f3f3] text-slate-500'
                      }`}
                    >
                      {c}
                    </th>
                  ))
                : null}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((r) => (
              <tr key={r}>
                <th
                  className={`h-[21px] border border-slate-300 text-[8.5px] font-semibold ${
                    sel === `${selCol}${r}` ? 'bg-[#d7e8dd] text-[#155c34]' : 'bg-[#f3f3f3] text-slate-400'
                  }`}
                >
                  {r}
                </th>
                {COLS.map((c) => {
                  const key = `${c}${r}`
                  const s = fmtMap[key] || {}
                  const isSel = key === sel
                  const cellText = displayValue(key, cells, fmtMap)
                  const cellCls = `h-[21px] w-full border border-slate-200 px-1 text-left text-[10.5px] leading-none ${
                    s.bold ? 'font-bold' : ''
                  } ${s.italic ? 'italic' : ''} ${s.fill ? 'bg-[#fff7cc]' : ''} ${
                    s.align === 'center' ? 'text-center' : s.align === 'right' ? 'text-right' : ''
                  } ${grid ? '' : 'border-transparent'}`
                  return (
                    <td key={key} className="p-0">
                      {isSel ? (
                        <input
                          ref={cellRef}
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          onKeyDown={onKey}
                          onBlur={() => commit(draft)}
                          aria-label={`${key} සෛලය`}
                          className="block h-[21px] w-full border-2 border-[#217346] bg-white px-1 text-[10.5px] leading-none text-slate-900 outline-none"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSel(key)}
                          className={`${cellCls} block truncate text-slate-800 hover:bg-[#f1f8f4]`}
                          title={String(cells[key] ?? '')}
                        >
                          {cellText || '\u00a0'}
                        </button>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex shrink-0 items-center gap-1 border-t border-slate-300 bg-[#f3f3f3] px-1.5 py-0.5">
        <div className="win-ribbon flex items-center gap-0.5 overflow-x-auto">
          {sheets.map((s, i) => (
            <button
              key={`${s.name}-${i}`}
              type="button"
              onClick={() => setBook((b) => ({ ...b, sheets, active: i }))}
              className={`shrink-0 rounded-t border px-2 py-[1px] text-[9.5px] leading-tight ${
                i === active
                  ? 'border-slate-300 border-b-white bg-white font-semibold text-[#155c34]'
                  : 'border-transparent text-slate-500 hover:bg-slate-200/60'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={addSheet}
          aria-label="නව පත්‍රයක්"
          className="grid h-4 w-4 shrink-0 place-items-center rounded-full border border-slate-300 bg-white text-[9px] leading-none text-slate-500"
        >
          +
        </button>
        <button
          type="button"
          onClick={removeSheet}
          aria-label="පත්‍රය මකන්න"
          className="grid h-4 w-4 shrink-0 place-items-center rounded-full border border-slate-300 bg-white text-[8px] leading-none text-slate-500"
        >
          ✕
        </button>
        <span className="ml-2 shrink-0 text-[9px] leading-none text-slate-400">
          {filter ? `පෙරහන: ${filter}` : `${visibleRows.length} පේළි`}
        </span>
      </div>

      <StatusBar
        left="සූදානම්"
        center={`සෛලය: ${sel}`}
        right={`අගය: ${displayValue(sel, cells, fmtMap) || '—'}`}
      />
    </WinWindow>
  )
}
