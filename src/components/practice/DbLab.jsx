import { useMemo, useState } from 'react'
import { useStored } from './useStored.js'
import {
  RBtn,
  RibbonBar,
  RibbonGroup,
  RibbonTabs,
  StatusBar,
  TitleBar,
  WinWindow,
} from './winui.jsx'

/* ------------------------------ දත්ත ------------------------------ */

const SEED = [
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
  { id: 'name', label: 'Name' },
  { id: 'grade', label: 'Grade' },
  { id: 'marks', label: 'Marks' },
  { id: 'city', label: 'City' },
]

const DEFAULT_QUERY = {
  cols: [
    { field: 'name', sort: '', show: true, criteria: '' },
    { field: 'grade', sort: '', show: true, criteria: '10' },
    { field: 'marks', sort: 'desc', show: true, criteria: '' },
    { field: 'city', sort: '', show: true, criteria: '' },
  ],
}

const OBJECTS = [
  { group: 'Tables', items: [{ id: 'students', label: 'Students', icon: '▦' }] },
  { group: 'Queries', items: [{ id: 'query', label: 'qryStudents', icon: '🔎' }] },
  { group: 'Reports', items: [{ id: 'report', label: 'rptMarks', icon: '📄' }] },
]

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'create', label: 'Create' },
  { id: 'tools', label: 'Database Tools' },
]

function matches(value, criteria) {
  const raw = String(criteria ?? '').trim()
  if (!raw) return true

  const like = raw.match(/^like\s+"?(.*?)"?$/i)
  if (like) {
    const pattern = like[1]
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.')
    try {
      return new RegExp(`^${pattern}$`, 'i').test(String(value))
    } catch {
      return true
    }
  }

  const m = raw.match(/^(>=|<=|<>|>|<|=)?\s*(.*)$/)
  const op = (m && m[1]) || '='
  let target = ((m && m[2]) || '').trim()
  if (/^".*"$/.test(target)) target = target.slice(1, -1)

  const num = Number(target)
  const v = Number(value)
  const numeric = target !== '' && Number.isFinite(num) && Number.isFinite(v)
  if (numeric) {
    if (op === '>') return v > num
    if (op === '<') return v < num
    if (op === '>=') return v >= num
    if (op === '<=') return v <= num
    if (op === '<>') return v !== num
    return v === num
  }

  const a = String(value)
  const b = String(target)
  if (op === '<>') return a !== b
  if (op === '>') return a > b
  if (op === '<') return a < b
  if (op === '>=') return a >= b
  if (op === '<=') return a <= b
  return a === b
}

function sqlCondition(criteria) {
  const raw = String(criteria ?? '').trim()
  const m = raw.match(/^(>=|<=|<>|>|<|=)?\s*(.*)$/)
  const op = (m && m[1]) || '='
  let target = ((m && m[2]) || '').trim()
  if (/^".*"$/.test(target)) target = target.slice(1, -1)
  const num = Number(target)
  const out = target !== '' && Number.isFinite(num) ? target : `'${target}'`
  return `${op === '=' ? '=' : op} ${out}`
}

/* ------------------------------ යෙදුම ------------------------------ */

export function DbLab() {
  const [db, setDb] = useStored('ol-practice-db-v2', { records: SEED, query: DEFAULT_QUERY })
  const records = Array.isArray(db.records) && db.records.length ? db.records : SEED
  const query = db.query && Array.isArray(db.query.cols) ? db.query : DEFAULT_QUERY

  const [object, setObject] = useState('students')
  const [queryView, setQueryView] = useState('design')
  const [tab, setTab] = useState('home')
  const [selectedId, setSelectedId] = useState(1)
  const [search, setSearch] = useState('')

  const patchDb = (patch) => setDb((d) => ({ ...d, ...patch }))

  const updateRecord = (id, patch) =>
    setDb((d) => ({
      ...d,
      records: (Array.isArray(d.records) && d.records.length ? d.records : SEED).map((r) =>
        r.id === id ? { ...r, ...patch } : r,
      ),
    }))

  const addRecord = () => {
    const nextId = Math.max(0, ...records.map((r) => Number(r.id) || 0)) + 1
    setDb((d) => ({
      ...d,
      records: [
        ...(Array.isArray(d.records) && d.records.length ? d.records : SEED),
        { id: nextId, name: 'New Student', grade: 9, marks: 0, city: '' },
      ],
    }))
    setSelectedId(nextId)
  }

  const deleteRecord = () =>
    setDb((d) => ({
      ...d,
      records: (Array.isArray(d.records) && d.records.length ? d.records : SEED).filter(
        (r) => r.id !== selectedId,
      ),
    }))

  const patchCol = (i, patch) =>
    setDb((d) => {
      const base = d.query && Array.isArray(d.query.cols) ? d.query : DEFAULT_QUERY
      return {
        ...d,
        query: { ...base, cols: base.cols.map((c, idx) => (idx === i ? { ...c, ...patch } : c)) },
      }
    })

  const results = useMemo(() => {
    let rows = records.slice()
    query.cols.forEach((c) => {
      if (c.criteria && String(c.criteria).trim()) rows = rows.filter((r) => matches(r[c.field], c.criteria))
    })
    const sortCol = query.cols.find((c) => c.sort)
    if (sortCol) {
      rows.sort((a, b) => {
        const av = a[sortCol.field]
        const bv = b[sortCol.field]
        if (typeof av === 'number' && typeof bv === 'number') {
          return sortCol.sort === 'desc' ? bv - av : av - bv
        }
        const as = String(av ?? '')
        const bs = String(bv ?? '')
        return sortCol.sort === 'desc' ? bs.localeCompare(as, 'si') : as.localeCompare(bs, 'si')
      })
    }
    return rows
  }, [records, query])

  const visibleFields = query.cols.filter((c) => c.show)

  const sql = useMemo(() => {
    const cols = visibleFields.length ? visibleFields.map((c) => c.field).join(', ') : '*'
    const conds = query.cols
      .filter((c) => c.criteria && String(c.criteria).trim())
      .map((c) => `${c.field} ${sqlCondition(c.criteria)}`)
    const where = conds.length ? `\nWHERE ${conds.join(' AND ')}` : ''
    const sortCol = query.cols.find((c) => c.sort)
    const order = sortCol ? `\nORDER BY ${sortCol.field} ${sortCol.sort === 'desc' ? 'DESC' : 'ASC'}` : ''
    return `SELECT ${cols}\nFROM Students${where}${order};`
  }, [query, visibleFields])

  const baseRows = object === 'query' ? results : records
  const q = search.trim().toLowerCase()
  const shown = q
    ? baseRows.filter((r) =>
        [r.id, r.name, r.grade, r.marks, r.city].some((v) => String(v ?? '').toLowerCase().includes(q)),
      )
    : baseRows

  const currentIdx = shown.findIndex((r) => r.id === selectedId)
  const go = (delta) => {
    if (!shown.length) return
    const idx = Math.min(shown.length - 1, Math.max(0, (currentIdx < 0 ? 0 : currentIdx) + delta))
    if (shown[idx]) setSelectedId(shown[idx].id)
  }

  const goObject = (id) => {
    setObject(id)
    if (id === 'query') setQueryView('design')
  }

  const sumMarks = records.reduce((s, r) => s + (Number(r.marks) || 0), 0)
  const avgMarks = records.length ? sumMarks / records.length : 0
  const maxMarks = records.length ? Math.max(...records.map((r) => Number(r.marks) || 0)) : 0

  return (
    <WinWindow>
      <TitleBar badge="A" color="#a4373a" file="ශිෂ්‍ය දත්ත.accdb" app="Access" saving="Saved" />
      <RibbonTabs tabs={TABS} active={tab} onChange={setTab} hint="F5 = run query" />
      <RibbonBar>
        {tab === 'home' ? (
          <>
            <RibbonGroup label="Views">
              <RBtn icon="▦" label="Datasheet" active={object === 'students'} onClick={() => goObject('students')} />
              <RBtn icon="🔎" label="Query" active={object === 'query'} onClick={() => goObject('query')} />
              <RBtn icon="📄" label="Report" active={object === 'report'} onClick={() => goObject('report')} />
            </RibbonGroup>
            <RibbonGroup label="Query">
              <RBtn icon="▤" label="Design" active={queryView === 'design'} onClick={() => setQueryView('design')} />
              <RBtn icon="!" label="Run" onClick={() => { setObject('query'); setQueryView('results') }} />
              <RBtn icon="SQL" label="SQL" active={queryView === 'sql'} onClick={() => { setObject('query'); setQueryView('sql') }} />
            </RibbonGroup>
            <RibbonGroup label="Records">
              <RBtn icon="＋" label="New Record" onClick={addRecord} />
              <RBtn icon="🗑" label="Delete" onClick={deleteRecord} />
              <RBtn icon="💾" label="Save" onClick={() => patchDb({})} />
            </RibbonGroup>
            <RibbonGroup label="Find">
              <RBtn icon="⏷" label="Filter" onClick={() => setSearch('')} />
            </RibbonGroup>
          </>
        ) : null}

        {tab === 'create' ? (
          <>
            <RibbonGroup label="Tables">
              <RBtn icon="▦" label="Table" onClick={() => goObject('students')} />
              <RBtn icon="📋" label="Table Design" onClick={() => goObject('students')} />
            </RibbonGroup>
            <RibbonGroup label="Queries">
              <RBtn icon="🔎" label="Query Design" onClick={() => { setObject('query'); setQueryView('design') }} />
              <RBtn icon="!" label="Run Query" onClick={() => { setObject('query'); setQueryView('results') }} />
            </RibbonGroup>
            <RibbonGroup label="Reports">
              <RBtn icon="📄" label="Report" onClick={() => setObject('report')} />
              <RBtn icon="🖨" label="Print Preview" onClick={() => setObject('report')} />
            </RibbonGroup>
          </>
        ) : null}

        {tab === 'tools' ? (
          <>
            <RibbonGroup label="Database Tools">
              <RBtn icon="🔗" label="Relationships" onClick={() => setObject('students')} />
              <RBtn icon="📦" label="Compact and Repair" onClick={() => patchDb({})} />
              <RBtn icon="🔒" label="Security" disabled />
            </RibbonGroup>
            <RibbonGroup label="Printing">
              <RBtn icon="🖨" label="Report" onClick={() => setObject('report')} />
            </RibbonGroup>
          </>
        ) : null}
      </RibbonBar>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="win-scroll hidden w-[120px] shrink-0 overflow-y-auto border-r border-slate-300 bg-[#f3f3f3] p-1 sm:block">
          <div className="mb-1 flex items-center justify-between px-1">
            <span className="text-[8.5px] font-bold uppercase tracking-wide text-slate-400">All Access Objects</span>
            <span className="text-[9px] text-slate-400">▾</span>
          </div>
          {OBJECTS.map((g) => (
            <div key={g.group} className="mb-1.5">
              <div className="px-1 text-[8.5px] font-bold text-slate-500">{g.group}</div>
              {g.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goObject(item.id)}
                  className={`flex w-full items-center gap-1 rounded px-1 py-[2px] text-left text-[10px] leading-tight ${
                    object === item.id ? 'bg-[#a4373a] text-white' : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="win-scroll flex min-w-0 flex-1 flex-col overflow-auto bg-[#e9ecef] p-1.5">
          <div className="mb-1 flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => goObject('students')}
              className={`rounded-t border px-2 py-[2px] text-[10px] leading-tight ${
                object === 'students' ? 'border-slate-300 border-b-white bg-white font-semibold text-[#7c2b2e]' : 'border-transparent bg-[#f3f3f3] text-slate-500'
              }`}
            >
              Students
            </button>
            <button
              type="button"
              onClick={() => goObject('query')}
              className={`rounded-t border px-2 py-[2px] text-[10px] leading-tight ${
                object === 'query' ? 'border-slate-300 border-b-white bg-white font-semibold text-[#7c2b2e]' : 'border-transparent bg-[#f3f3f3] text-slate-500'
              }`}
            >
              qryStudents
            </button>
            <button
              type="button"
              onClick={() => goObject('report')}
              className={`rounded-t border px-2 py-[2px] text-[10px] leading-tight ${
                object === 'report' ? 'border-slate-300 border-b-white bg-white font-semibold text-[#7c2b2e]' : 'border-transparent bg-[#f3f3f3] text-slate-500'
              }`}
            >
              rptMarks
            </button>
          </div>

          {object === 'report' ? (
            <div className="mx-auto w-full max-w-[480px] bg-white p-4 shadow ring-1 ring-slate-300">
              <div className="text-center">
                <div className="text-[13px] font-extrabold leading-tight">ශිෂ්‍ය ලකුණු වාර්තාව</div>
                <div className="text-[8.5px] text-slate-500">
                  Students table · {new Date().toLocaleDateString('en-GB')} · Access Report
                </div>
              </div>
              <table className="mt-3 w-full border-collapse text-[9.5px]">
                <thead>
                  <tr className="bg-slate-100 text-left text-slate-600">
                    <th className="border border-slate-300 px-1 py-0.5">ID</th>
                    <th className="border border-slate-300 px-1 py-0.5">Name</th>
                    <th className="border border-slate-300 px-1 py-0.5">Grade</th>
                    <th className="border border-slate-300 px-1 py-0.5">Marks</th>
                    <th className="border border-slate-300 px-1 py-0.5">City</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r.id} className="text-slate-700">
                      <td className="border border-slate-300 px-1 py-0.5 font-mono text-slate-400">{r.id}</td>
                      <td className="border border-slate-300 px-1 py-0.5">{r.name}</td>
                      <td className="border border-slate-300 px-1 py-0.5">{r.grade}</td>
                      <td className="border border-slate-300 px-1 py-0.5 font-mono">{r.marks}</td>
                      <td className="border border-slate-300 px-1 py-0.5">{r.city}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2 flex justify-between border-t border-slate-300 pt-1 text-[8.5px] text-slate-600">
                <span>Records: {records.length}</span>
                <span>Average: {avgMarks.toFixed(1)}</span>
                <span>Maximum: {maxMarks}</span>
              </div>
              <div className="mt-2 text-right text-[8px] text-slate-400">Page 1 of 1</div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-sm bg-white shadow ring-1 ring-slate-300">
              {object === 'query' ? (
                <div className="flex items-center gap-1 border-b border-slate-200 bg-[#f3f3f3] px-1.5 py-0.5">
                  <span className="text-[9px] font-semibold text-slate-500">qryStudents</span>
                  {['design', 'sql', 'results'].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setQueryView(v)}
                      className={`rounded px-1.5 py-[1px] text-[9px] leading-none ${
                        queryView === v ? 'bg-white font-semibold text-[#7c2b2e] ring-1 ring-slate-300' : 'text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {v === 'design' ? 'Design' : v === 'sql' ? 'SQL' : 'Results'}
                    </button>
                  ))}
                  <span className="ml-auto text-[8.5px] text-slate-400">View: Datasheet</span>
                </div>
              ) : null}

              {object === 'query' && queryView === 'design' ? (
                <div className="win-scroll overflow-x-auto bg-[#eef1f4] p-2">
                  <table className="w-full min-w-[420px] border-collapse text-[9.5px]">
                    <tbody>
                      <tr>
                        <th className="w-[68px] border border-slate-300 bg-[#f3f3f3] px-1 py-1 text-left font-semibold text-slate-500">
                          Field
                        </th>
                        {query.cols.map((c, i) => (
                          <td key={i} className="border border-slate-300 bg-white p-0">
                            <select
                              value={c.field}
                              onChange={(e) => patchCol(i, { field: e.target.value })}
                              aria-label={`Field ${i + 1}`}
                              className="w-full bg-transparent px-1 py-0.5 text-[9.5px] leading-tight outline-none"
                            >
                              {FIELDS.map((f) => (
                                <option key={f.id} value={f.id}>
                                  {f.label}
                                </option>
                              ))}
                            </select>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <th className="border border-slate-300 bg-[#f3f3f3] px-1 py-1 text-left font-semibold text-slate-500">
                          Table
                        </th>
                        {query.cols.map((c, i) => (
                          <td key={i} className="border border-slate-300 bg-[#f8f9fa] px-1 py-0.5 text-slate-500">
                            Students
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <th className="border border-slate-300 bg-[#f3f3f3] px-1 py-1 text-left font-semibold text-slate-500">
                          Sort
                        </th>
                        {query.cols.map((c, i) => (
                          <td key={i} className="border border-slate-300 bg-white p-0">
                            <select
                              value={c.sort}
                              onChange={(e) => patchCol(i, { sort: e.target.value })}
                              aria-label={`Sort ${i + 1}`}
                              className="w-full bg-transparent px-1 py-0.5 text-[9.5px] leading-tight outline-none"
                            >
                              <option value="">—</option>
                              <option value="asc">Ascending</option>
                              <option value="desc">Descending</option>
                            </select>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <th className="border border-slate-300 bg-[#f3f3f3] px-1 py-1 text-left font-semibold text-slate-500">
                          Show
                        </th>
                        {query.cols.map((c, i) => (
                          <td key={i} className="border border-slate-300 bg-white px-1 py-0.5 text-center">
                            <input
                              type="checkbox"
                              checked={Boolean(c.show)}
                              onChange={(e) => patchCol(i, { show: e.target.checked })}
                              aria-label={`Show ${i + 1}`}
                              className="h-3 w-3 accent-[#a4373a]"
                            />
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <th className="border border-slate-300 bg-[#f3f3f3] px-1 py-1 text-left font-semibold text-slate-500">
                          Criteria
                        </th>
                        {query.cols.map((c, i) => (
                          <td key={i} className="border border-slate-300 bg-white p-0">
                            <input
                              value={c.criteria}
                              onChange={(e) => patchCol(i, { criteria: e.target.value })}
                              placeholder={">75, 10, “කොළඹ”"}
                              aria-label={`Criteria ${i + 1}`}
                              className="w-full px-1 py-0.5 text-[9.5px] leading-tight outline-none"
                            />
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                  <p className="mt-1.5 px-1 text-[8.5px] leading-snug text-slate-500">
                    Criteria examples: <span className="font-mono">&gt;75</span>, <span className="font-mono">10</span>,{' '}
                    <span className="font-mono">&quot;කොළඹ&quot;</span>. Use <span className="font-mono">&gt;=60</span>{' '}
                    instead of <span className="font-mono">Between 60 And 80</span>.
                  </p>
                </div>
              ) : object === 'query' && queryView === 'sql' ? (
                <div className="bg-[#1e1e1e] p-2">
                  <pre className="win-scroll overflow-x-auto whitespace-pre-wrap font-mono text-[10px] leading-relaxed text-[#d7e8dd]">
                    {sql}
                  </pre>
                </div>
              ) : null}

              {object === 'students' || (object === 'query' && queryView === 'results') ? (
                <div className="win-scroll overflow-x-auto">
                  <table className="w-full min-w-[420px] border-collapse text-left text-[9.5px]">
                    <thead>
                      <tr className="bg-[#f3f3f3] text-slate-500">
                        <th className="w-5 border border-slate-300 px-0.5 py-1">▸</th>
                        <th className="border border-slate-300 px-1 py-1 font-semibold">ID</th>
                        {FIELDS.map((f) => (
                          <th key={f.id} className="border border-slate-300 px-1 py-1 font-semibold">
                            {f.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {shown.map((r) => {
                        const isSel = r.id === selectedId
                        return (
                          <tr
                            key={r.id}
                            onClick={() => setSelectedId(r.id)}
                            className={isSel ? 'bg-[#f6e7e8]' : 'hover:bg-[#fafbfc]'}
                          >
                            <td className="border border-slate-200 px-0.5 text-center text-[8px] text-slate-400">
                              {isSel ? '▸' : ''}
                            </td>
                            <td className="border border-slate-200 px-1 py-0 font-mono text-slate-400">{r.id}</td>
                            <td className="border border-slate-200 p-0">
                              <input
                                value={r.name}
                                onChange={(e) => updateRecord(r.id, { name: e.target.value })}
                                aria-label={`${r.id} name`}
                                className="w-full bg-transparent px-1 py-[2px] text-[9.5px] leading-tight outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-[#a4373a]"
                              />
                            </td>
                            <td className="border border-slate-200 p-0">
                              <select
                                value={r.grade}
                                onChange={(e) => updateRecord(r.id, { grade: Number(e.target.value) })}
                                aria-label={`${r.id} grade`}
                                className="w-full bg-transparent px-0.5 py-[2px] text-[9.5px] leading-tight outline-none focus:bg-white"
                              >
                                <option value={9}>9</option>
                                <option value={10}>10</option>
                                <option value={11}>11</option>
                              </select>
                            </td>
                            <td className="border border-slate-200 p-0">
                              <input
                                value={r.marks}
                                onChange={(e) => updateRecord(r.id, { marks: e.target.value === '' ? '' : Number(e.target.value) })}
                                inputMode="numeric"
                                aria-label={`${r.id} marks`}
                                className="w-full bg-transparent px-1 py-[2px] font-mono text-[9.5px] leading-tight outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-[#a4373a]"
                              />
                            </td>
                            <td className="border border-slate-200 p-0">
                              <input
                                value={r.city}
                                onChange={(e) => updateRecord(r.id, { city: e.target.value })}
                                aria-label={`${r.id} city`}
                                className="w-full bg-transparent px-1 py-[2px] text-[9.5px] leading-tight outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-[#a4373a]"
                              />
                            </td>
                          </tr>
                        )
                      })}
                      {shown.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="border border-slate-200 px-2 py-2 text-center text-[9.5px] text-slate-400">
                            No matching records
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-1 border-t border-slate-300 bg-[#f3f3f3] px-1.5 py-0.5 text-[9px] leading-none text-slate-600">
        <button type="button" onClick={() => go(-999)} aria-label="First record" className="px-1">
          |◀
        </button>
        <button type="button" onClick={() => go(-1)} aria-label="Previous record" className="px-1">
          ◀
        </button>
        <span className="rounded border border-slate-300 bg-white px-1.5 py-[1px]">
          Record {shown.length ? Math.max(0, currentIdx) + 1 : 0} of {shown.length}
        </span>
        <button type="button" onClick={() => go(1)} aria-label="Next record" className="px-1">
          ▶
        </button>
        <button type="button" onClick={() => go(999)} aria-label="Last record" className="px-1">
          ▶|
        </button>
        <span className="mx-1 text-slate-300">|</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          aria-label="Search records"
          className="h-[17px] w-[96px] rounded border border-slate-300 px-1 text-[9px] leading-tight outline-none focus:border-[#a4373a]"
        />
        <button
          type="button"
          onClick={addRecord}
          className="ml-auto rounded border border-slate-300 bg-white px-1.5 py-[1px] text-[9px] leading-tight hover:bg-slate-50"
        >
          ＋ New Record
        </button>
      </div>

      <StatusBar left={`${shown.length} records`} center="Primary Key: ID" right="Access · Datasheet View" />
    </WinWindow>
  )
}
