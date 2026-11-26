import { useState } from 'react'
import { Slider, SimFrame, Readout, ModeToggle } from './ui.jsx'

const FLAT = 'text-[11px] fill-slate-500'

/* ---------------------------- 6. කෝණ ---------------------------- */
const PAIRS = [
  { id: 'alt', label: 'ඒකාන්තර' },
  { id: 'corr', label: 'අනුරූප' },
  { id: 'co', label: 'සහභාගී' },
]

export function AnglesSim() {
  const [theta, setTheta] = useState(60)
  const [pair, setPair] = useState('alt')

  const rad = (theta * Math.PI) / 180
  const dx = 70 / Math.tan(rad)
  const alt = theta
  const co = 180 - theta
  const value = pair === 'co' ? co : alt

  return (
    <div className="space-y-3">
      <Slider label="ඡේදකයේ කෝණය (θ)" value={theta} onChange={setTheta} min={30} max={150} unit="°" />

      <SimFrame caption="සමාන්තර රේඛා දෙකක් ඡේදකයකින් කැපේ. තෝරන කෝණ යුගලය අනුව අගයන් සසඳන්න.">
        <svg viewBox="0 0 280 200" className="w-full" role="img" aria-label="සමාන්තර රේඛා කෝණ">
          <rect width="280" height="200" fill="#f8fafc" rx="12" />
          <line x1="20" y1="70" x2="260" y2="70" stroke="#3167d6" strokeWidth="2.5" />
          <line x1="20" y1="140" x2="260" y2="140" stroke="#3167d6" strokeWidth="2.5" />
          <line x1={140 - dx} y1="20" x2={140 + dx} y2="190" stroke="#b45309" strokeWidth="2" />
          <text x="252" y="64" fontSize="9" fill="#2551b0">
            l₁
          </text>
          <text x="252" y="134" fontSize="9" fill="#2551b0">
            l₂
          </text>
          <path d={`M${140 + 34} 140 A34 34 0 0 1 ${140 + 34 * Math.cos(-rad)} ${140 + 34 * Math.sin(-rad)}`} fill="none" stroke={pair === 'co' ? '#7c3aed' : '#0f9d63'} strokeWidth="3" />
          <path d={`M${140 + 34} 70 A34 34 0 0 1 ${140 + 34 * Math.cos(-rad)} ${70 + 34 * Math.sin(-rad)}`} fill="none" stroke="#0f9d63" strokeWidth="3" />
          <text x={196} y={140 - 12} fontSize="11" fontWeight="700" fill="#0b7d4f">
            {theta}°
          </text>
          <text x={196} y={70 - 12} fontSize="11" fontWeight="700" fill="#0b7d4f">
            {pair === 'co' ? `${co}°` : `${theta}°`}
          </text>
          <text x="140" y="188" textAnchor="middle" fontSize="10" className={FLAT}>
            θ = {theta}° · පරිපූරක කෝණය = {co}°
          </text>
        </svg>
      </SimFrame>

      <div className="grid grid-cols-3 gap-1.5">
        {PAIRS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPair(p.id)}
            className={`rounded-xl border px-2 py-1.5 text-[12px] font-semibold ${
              pair === p.id ? 'border-leaf-500 bg-leaf-50 text-leaf-700' : 'border-slate-200 bg-white text-slate-600'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <Readout
        items={[
          { label: 'ඡේදක කෝණය', value: `${theta}°` },
          { label: 'ඒකාන්තර කෝණ', value: `${alt}° = ${alt}°` },
          { label: 'අනුරූප කෝණ', value: `${alt}° = ${alt}°` },
          { label: 'සහභාගී එකතුව', value: `${theta}° + ${co}° = 180°` },
        ]}
      />
      <p className="rounded-xl bg-slate-50 px-3 py-2 text-[12px] leading-relaxed text-slate-600">
        {pair === 'alt'
          ? 'ඒකාන්තර කෝණ සමාන වේ (Z හැඩය).'
          : pair === 'corr'
            ? 'අනුරූප කෝණ සමාන වේ (F හැඩය).'
            : 'සහභාගී කෝණවල එකතුව 180° වේ (C හැඩය).'}{' '}
        තෝරාගත් අගය: {value}°.
      </p>
    </div>
  )
}

/* -------------------------- 7. සංඛ්‍යානය -------------------------- */
export function StatsSim() {
  const [values, setValues] = useState([4, 6, 7, 8, 9])
  const [outlier, setOutlier] = useState(false)

  const data = outlier ? [...values, 40] : values
  const sorted = [...data].sort((a, b) => a - b)
  const mean = data.reduce((s, v) => s + v, 0) / data.length
  const mid = Math.floor(sorted.length / 2)
  const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
  const counts = {}
  data.forEach((v) => {
    counts[v] = (counts[v] ?? 0) + 1
  })
  const maxCount = Math.max(...Object.values(counts))
  const modes = Object.keys(counts).filter((k) => counts[k] === maxCount && maxCount > 1)
  const mode = modes.length ? modes.join(', ') : 'නැත'

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-5 gap-1.5">
        {values.map((v, i) => (
          <label key={i} className="rounded-xl border border-slate-200 bg-white p-1.5 text-center">
            <span className="block text-[10px] text-slate-500">දත්ත {i + 1}</span>
            <input
              type="number"
              min="0"
              max="20"
              value={v}
              onChange={(e) => {
                const next = [...values]
                next[i] = Math.max(0, Math.min(20, Number(e.target.value) || 0))
                setValues(next)
              }}
              className="mt-0.5 w-full rounded-md border border-slate-200 px-1 py-0.5 text-center font-mono text-[13px] font-bold"
              aria-label={`දත්ත ${i + 1}`}
            />
          </label>
        ))}
      </div>

      <label className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[12.5px] font-semibold text-amber-900">
        <input type="checkbox" checked={outlier} onChange={(e) => setOutlier(e.target.checked)} className="accent-amber-600" />
        අතිරික්ත අගයක් (40) එකතු කරන්න
      </label>

      <SimFrame caption="තීරු උස අගයේ ප්‍රමාණය පෙන්වයි. අතිරික්ත අගය එකතු කළ විට මධ්‍යන්‍යය වැඩි වන ආකාරය බලන්න.">
        <div className="flex h-32 items-end gap-1.5 px-2 pt-2">
          {data.map((v, i) => (
            <div key={i} className="flex flex-1 flex-col items-center justify-end">
              <div
                className={`w-full rounded-t-md ${v === 40 ? 'bg-amber-400' : 'bg-leaf-500'}`}
                style={{ height: `${Math.min(v * 5, 100)}%` }}
              />
              <span className="mt-1 font-mono text-[10px] text-slate-500">{v}</span>
            </div>
          ))}
        </div>
      </SimFrame>

      <Readout
        items={[
          { label: 'මධ්‍යන්‍යය', value: mean.toFixed(2) },
          { label: 'මධ්‍යස්ථය', value: median },
          { label: 'බහුලකය', value: mode },
          { label: 'පරාසය', value: Math.max(...data) - Math.min(...data) },
        ]}
      />
      <p className="rounded-xl bg-slate-50 px-3 py-2 text-[12px] leading-relaxed text-slate-600">
        අතිරික්ත අගයක් ඇති විට මධ්‍යන්‍යය තදින් වෙනස් වේ; මධ්‍යස්ථය ස්ථාවරව පවතී. එබැවින් එවැනි දත්තවලදී මධ්‍යස්ථය වඩාත් නියෝජනාත්මකයි.
      </p>
    </div>
  )
}

/* --------------------------- 8. ඝන වස්තු --------------------------- */
const SHAPES = [
  { id: 'cylinder', label: 'සිලින්ඩරය' },
  { id: 'cone', label: 'කේතුව' },
  { id: 'sphere', label: 'ගෝලය' },
]

export function SolidsSim() {
  const [shape, setShape] = useState('cylinder')
  const [r, setR] = useState(4)
  const [h, setH] = useState(8)

  const pi = Math.PI
  let area = 0
  let volume = 0
  if (shape === 'cylinder') {
    area = 2 * pi * r * (r + h)
    volume = pi * r * r * h
  } else if (shape === 'cone') {
    const l = Math.sqrt(r * r + h * h)
    area = pi * r * (r + l)
    volume = (pi * r * r * h) / 3
  } else {
    area = 4 * pi * r * r
    volume = (4 / 3) * pi * r * r * r
  }

  return (
    <div className="space-y-3">
      <ModeToggle options={SHAPES.map((s) => ({ value: s.id, label: s.label }))} value={shape} onChange={setShape} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Slider label="අරය (r)" value={r} onChange={setR} min={1} max={10} unit=" cm" />
        <Slider
          label={shape === 'sphere' ? 'උස (අදාළ නොවේ)' : 'උස (h)'}
          value={h}
          onChange={setH}
          min={1}
          max={20}
          unit=" cm"
          display={shape === 'sphere' ? '—' : h}
        />
      </div>

      <SimFrame caption="අරය හා උස වෙනස් කළ විට පෘෂ්ඨ වර්ගඵලය හා පරිමාව සූත්‍ර අනුව වෙනස් වේ.">
        <svg viewBox="0 0 280 190" className="w-full" role="img" aria-label="ඝන වස්තු රූප සටහන">
          <rect width="280" height="190" fill="#f8fafc" rx="12" />
          {shape === 'cylinder' ? (
            <g>
              <ellipse cx="140" cy={150 - h * 4.5} rx={r * 5} ry={r * 1.8} fill="#dbeafe" stroke="#3167d6" strokeWidth="2" />
              <path d={`M${140 - r * 5} ${150 - h * 4.5} v${h * 4.5} a${r * 5} ${r * 1.8} 0 0 0 ${r * 10} 0 v-${h * 4.5}`} fill="#eff6ff" stroke="#3167d6" strokeWidth="2" />
              <ellipse cx="140" cy="150" rx={r * 5} ry={r * 1.8} fill="none" stroke="#3167d6" strokeWidth="2" />
              <line x1="140" y1={150 - h * 4.5} x2={140 + r * 5} y2={150 - h * 4.5} stroke="#b45309" strokeDasharray="3 3" />
              <text x={140 + r * 2.5} y={146 - h * 4.5} fontSize="9" fill="#b45309">
                r = {r}
              </text>
              <text x={148 + r * 5} y={150 - h * 2} fontSize="9" fill="#475569">
                h = {h}
              </text>
            </g>
          ) : shape === 'cone' ? (
            <g>
              <path d={`M140 ${25} L${140 - r * 5} 150 A${r * 5} ${r * 1.8} 0 0 0 ${140 + r * 5} 150 Z`} fill="#eff6ff" stroke="#3167d6" strokeWidth="2" />
              <ellipse cx="140" cy="150" rx={r * 5} ry={r * 1.8} fill="none" stroke="#3167d6" strokeWidth="2" />
              <line x1="140" y1="25" x2="140" y2="150" stroke="#94a3b8" strokeDasharray="3 3" />
              <text x="146" y="90" fontSize="9" fill="#475569">
                h = {h}
              </text>
              <text x={140 + r * 2} y="156" fontSize="9" fill="#b45309">
                r = {r}
              </text>
            </g>
          ) : (
            <g>
              <circle cx="140" cy="95" r={r * 7} fill="#eff6ff" stroke="#3167d6" strokeWidth="2" />
              <line x1="140" y1="95" x2={140 + r * 7} y2="95" stroke="#b45309" strokeDasharray="3 3" />
              <text x={140 + r * 3} y="90" fontSize="9" fill="#b45309">
                r = {r}
              </text>
            </g>
          )}
        </svg>
      </SimFrame>

      <Readout
        items={[
          { label: 'වස්තුව', value: SHAPES.find((s) => s.id === shape)?.label ?? '—' },
          { label: 'පෘෂ්ඨ වර්ගඵලය', value: `${area.toFixed(1)} cm²` },
          { label: 'පරිමාව', value: `${volume.toFixed(1)} cm³` },
          {
            label: 'සූත්‍රය',
            value: shape === 'cylinder' ? 'πr²h' : shape === 'cone' ? '⅓πr²h' : '(4/3)πr³',
          },
        ]}
      />
    </div>
  )
}

/* ------------------------- 9. සම්භාවිතාව ------------------------- */
export function ProbSim() {
  const [kind, setKind] = useState('coin')
  const [trials, setTrials] = useState(100)
  const [result, setResult] = useState(null)

  const run = () => {
    let success = 0
    if (kind === 'coin') {
      for (let i = 0; i < trials; i += 1) if (Math.random() < 0.5) success += 1
    } else {
      for (let i = 0; i < trials; i += 1) if (Math.floor(Math.random() * 6) + 1 === 6) success += 1
    }
    setResult({ success, total: trials })
  }

  const exp = result ? result.success / result.total : 0
  const theory = kind === 'coin' ? 0.5 : 1 / 6
  const label = kind === 'coin' ? 'ශීර්ෂය' : '6 අංකය'

  return (
    <div className="space-y-3">
      <ModeToggle
        options={[
          { value: 'coin', label: 'කාසිය' },
          { value: 'dice', label: 'දාදු කැටය' },
        ]}
        value={kind}
        onChange={(v) => {
          setKind(v)
          setResult(null)
        }}
      />
      <Slider label="අත්හදා බැලීම් ගණන" value={trials} onChange={setTrials} min={20} max={500} step={20} />
      <button type="button" onClick={run} className="btn-primary w-full py-2 text-[13px]">
        අත්හදා බැලීම් ධාවනය කරන්න
      </button>

      <SimFrame caption="අත්හදා බැලීම් ගණන වැඩි කළ විට පරීක්ෂණාත්මක අගය සෛද්ධාන්තික අගයට ළඟා වේ.">
        <div className="space-y-3 p-2">
          <div>
            <div className="flex justify-between text-[11px] text-slate-600">
              <span>පරීක්ෂණාත්මක ({label})</span>
              <span className="font-mono font-bold">{result ? exp.toFixed(3) : '—'}</span>
            </div>
            <div className="mt-1 h-3 rounded-full bg-slate-200">
              <div className="h-3 rounded-full bg-leaf-500" style={{ width: `${Math.min(exp * 100, 100)}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[11px] text-slate-600">
              <span>සෛද්ධාන්තික</span>
              <span className="font-mono font-bold">{theory.toFixed(3)}</span>
            </div>
            <div className="mt-1 h-3 rounded-full bg-slate-200">
              <div className="h-3 rounded-full bg-sky-500" style={{ width: `${theory * 100}%` }} />
            </div>
          </div>
          <p className="text-center text-[11.5px] text-slate-500">
            {result ? `වාර ${result.total}කින් ${result.success}ක් ලැබුණි` : 'ධාවනය කර ප්‍රතිඵලය බලන්න'}
          </p>
        </div>
      </SimFrame>

      <Readout
        items={[
          { label: 'අත්හදා බැලීම්', value: result ? result.total : trials },
          { label: 'සාර්ථක වාර', value: result ? result.success : '—' },
          { label: 'පරීක්ෂණාත්මක', value: result ? exp.toFixed(3) : '—' },
          { label: 'සෛද්ධාන්තික', value: theory.toFixed(3) },
        ]}
      />
    </div>
  )
}

/* ---------------------------- 10. පරිමාණය --------------------------- */
export function ScaleSim() {
  const [k, setK] = useState(2)

  const baseArea = 6 * 9
  const baseVolume = 6 * 9 * 4

  return (
    <div className="space-y-3">
      <Slider label="පරිමාණ සාධකය (k)" value={k} onChange={setK} min={0.5} max={3} step={0.5} display={k.toFixed(1)} />

      <SimFrame caption="කුඩා රූපය මුල් රූපයයි; විශාල රූපය k අනුව විශාල කර ඇත.">
        <svg viewBox="0 0 280 180" className="w-full" role="img" aria-label="සමරූපී රූප">
          <rect width="280" height="180" fill="#f8fafc" rx="12" />
          <rect x="30" y="100" width="60" height="40" rx="3" fill="#dbe8ff" stroke="#3167d6" strokeWidth="2" />
          <text x="60" y="156" textAnchor="middle" fontSize="9" fill="#475569">
            මුල් රූපය
          </text>
          <rect
            x="140"
            y={150 - 40 * k}
            width={60 * k}
            height={40 * k}
            rx="3"
            fill="#dcfce7"
            stroke="#0f9d63"
            strokeWidth="2"
            opacity="0.85"
          />
          <text x="200" y="172" textAnchor="middle" fontSize="9" fill="#0b7d4f">
            k = {k.toFixed(1)}
          </text>
        </svg>
      </SimFrame>

      <Readout
        items={[
          { label: 'දිග අනුපාතය', value: `× ${k.toFixed(1)}` },
          { label: 'වර්ගඵලය', value: `${(baseArea * k * k).toFixed(1)} cm²` },
          { label: 'වර්ගඵල අනුපාතය', value: `× ${(k * k).toFixed(2)}` },
          { label: 'පරිමාව', value: `${(baseVolume * k ** 3).toFixed(1)} cm³` },
        ]}
      />
      <p className="rounded-xl bg-slate-50 px-3 py-2 text-[12px] leading-relaxed text-slate-600">
        දිග k ගුණ වන විට වර්ගඵලය k² ගුණ ද පරිමාව k³ ගුණ ද වේ. k = {k.toFixed(1)} නම් වර්ගඵලය{' '}
        {(k * k).toFixed(2)} ගුණ ද පරිමාව {(k ** 3).toFixed(2)} ගුණ ද වේ.
      </p>
    </div>
  )
}
