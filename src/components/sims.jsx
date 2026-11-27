import { useState } from 'react'
import { Slider, SimFrame, Readout, ModeToggle } from './ui.jsx'
import {
  ForceSim,
  PressureSim,
  EnergySim,
  OpticsSim,
  InductionSim,
} from './sims-mech.jsx'
import { AnglesSim, StatsSim, SolidsSim, ProbSim, ScaleSim } from './sims-data.jsx'
import {
  NumberBaseSim,
  LogicGateSim,
  FlowchartSim,
  QuerySim,
  SheetFnsSim,
  TraceSim,
} from './sims-ict.jsx'

const FLAT = 'text-[11px] fill-slate-400'
const AXIS = '#94a3b8'

/* ------------------------------------------------------------------ */
/* 1. Build an Atom                                                    */
/* ------------------------------------------------------------------ */
const ELEMENTS = [
  ['—', '—'],
  ['හයිඩ්‍රජන්', 'H'],
  ['හීලියම්', 'He'],
  ['ලිතියම්', 'Li'],
  ['බෙරිලියම්', 'Be'],
  ['බෝරෝන්', 'B'],
  ['කාබන්', 'C'],
  ['නයිට්‍රජන්', 'N'],
  ['ඔක්සිජන්', 'O'],
  ['ෆ්ලෝරීන්', 'F'],
  ['නියෝන්', 'Ne'],
  ['සෝඩියම්', 'Na'],
  ['මැග්නීසියම්', 'Mg'],
  ['ඇලුමිනියම්', 'Al'],
  ['සිලිකන්', 'Si'],
  ['පොස්පරස්', 'P'],
  ['සල්ෆර්', 'S'],
  ['ක්ලෝරීන්', 'Cl'],
  ['ආගන්', 'Ar'],
  ['පොටෑසියම්', 'K'],
  ['කැල්සියම්', 'Ca'],
]

const SHELL_CAP = [2, 8, 8]

function shellLayout(electrons) {
  const left = []
  let rest = electrons
  for (const cap of SHELL_CAP) {
    const n = Math.min(cap, rest)
    left.push(n)
    rest -= n
  }
  if (rest > 0) left.push(rest)
  return left
}

function Stepper({ label, symbol, value, onChange, color }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2">
      <div className="min-w-0">
        <div className="text-[11.5px] text-slate-500">{label}</div>
        <div className="flex items-baseline gap-1">
          <span className={`font-mono text-base font-bold ${color}`}>{symbol}</span>
          <span className="font-mono text-sm font-bold text-ink">{value}</span>
        </div>
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          aria-label={`${label} එකක් අඩු කරන්න`}
          onClick={() => onChange(Math.max(0, value - 1))}
          className="h-8 w-8 rounded-lg border border-slate-200 bg-slate-50 text-base font-bold text-slate-600 active:scale-95"
        >
          −
        </button>
        <button
          type="button"
          aria-label={`${label} එකක් එකතු කරන්න`}
          onClick={() => onChange(Math.min(30, value + 1))}
          className="h-8 w-8 rounded-lg border border-leaf-500/30 bg-leaf-50 text-base font-bold text-leaf-700 active:scale-95"
        >
          +
        </button>
      </div>
    </div>
  )
}

export function AtomSim() {
  const [protons, setProtons] = useState(6)
  const [neutrons, setNeutrons] = useState(6)
  const [electrons, setElectrons] = useState(6)

  const charge = protons - electrons
  const mass = protons + neutrons
  const [nameEn, symbol] = ELEMENTS[Math.min(protons, 20)]
  const shells = shellLayout(electrons)
  const stable = electrons === 2 || electrons === 10 || electrons === 18
  const ionLabel =
    charge === 0 ? 'උදාසීන පරමාණුව' : charge > 0 ? `ධන අයනය (+${charge})` : `සෘණ අයනය (${charge})`

  const nucleons = []
  for (let i = 0; i < Math.min(protons + neutrons, 40); i += 1) {
    const isProton = i % 2 === 0 ? i / 2 < protons : Math.floor(i / 2) < protons
    const count = isProton ? Math.floor(i / 2) : Math.floor(i / 2)
    const angle = count * 2.399
    const r = 4 + 4.2 * Math.sqrt(count)
    nucleons.push({
      key: i,
      cx: 140 + Math.cos(angle) * Math.min(r, 26),
      cy: 108 + Math.sin(angle) * Math.min(r, 26),
      proton: isProton,
    })
  }

  return (
    <div className="space-y-3">
      <SimFrame caption="න්‍යෂ්ටියේ ප්‍රෝටෝන (රතු) හා නියුට්‍රෝන (නිල්), වටා ඉලෙක්ට්‍රෝන කවච (කහ).">
        <svg viewBox="0 0 280 240" role="img" aria-label="පරමාණුක ආකෘතිය" className="w-full">
          <defs>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c7d2fe" stopOpacity=".55" />
              <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="140" cy="108" r="92" fill="url(#glow)" />
          {[46, 70, 92].slice(0, Math.max(shells.length, 1)).map((r, si) => (
            <circle key={r} cx="140" cy="108" r={r} fill="none" stroke="#cbd5e1" strokeDasharray="3 4" />
          ))}
          {shells.map((count, si) =>
            Array.from({ length: count }).map((_, ei) => {
              const radius = [46, 70, 92][si] || 100
              const a = (ei / Math.max(count, 1)) * Math.PI * 2 - Math.PI / 2 + si * 0.45
              return (
                <circle
                  key={`${si}-${ei}`}
                  cx={140 + Math.cos(a) * radius}
                  cy={108 + Math.sin(a) * radius}
                  r="3.6"
                  fill="#eab308"
                  stroke="#a16207"
                  strokeWidth=".8"
                />
              )
            }),
          )}
          {nucleons.map((n) => (
            <circle
              key={n.key}
              cx={n.cx}
              cy={n.cy}
              r="5.4"
              fill={n.proton ? '#ef4444' : '#64748b'}
              stroke="#fff"
              strokeWidth="1"
            />
          ))}
          <text x="140" y="200" textAnchor="middle" className="fill-ink" fontSize="12" fontWeight="700">
            {protons === 0 ? 'න්‍යෂ්ටියක් නැත' : `${nameEn} (${symbol})`}
          </text>
          <text x="140" y="218" textAnchor="middle" className={FLAT} fontSize="10.5">
            {stable ? 'ඉලෙක්ට්‍රෝන කවච සම්පූර්ණයි → ස්ථායී' : 'ඉලෙක්ට්‍රෝන කවච අසම්පූර්ණයි'}
          </text>
        </svg>
      </SimFrame>

      <div className="grid gap-2 sm:grid-cols-3">
        <Stepper label="ප්‍රෝටෝන (p)" symbol="+" value={protons} onChange={setProtons} color="text-rose-600" />
        <Stepper label="නියුට්‍රෝන (n)" symbol="0" value={neutrons} onChange={setNeutrons} color="text-slate-600" />
        <Stepper label="ඉලෙක්ට්‍රෝන (e)" symbol="−" value={electrons} onChange={setElectrons} color="text-amber-600" />
      </div>

      <Readout
        items={[
          { label: 'පරමාණුක ක්‍රමාංකය (Z)', value: protons },
          { label: 'ස්කන්ධ ක්‍රමාංකය (A)', value: mass },
          { label: 'ශුද්ධ ආරෝපණය', value: charge > 0 ? `+${charge}` : charge },
          { label: 'තත්ත්වය', value: ionLabel },
        ]}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 2. Graphing Lines                                                   */
/* ------------------------------------------------------------------ */
const U = 20
const CX = 140
const CY = 140

function Grid() {
  return (
    <>
      {Array.from({ length: 15 }).map((_, i) => {
        const p = 20 + i * U
        return (
          <g key={i}>
            <line x1={p} y1="0" x2={p} y2="280" stroke="#eef2f7" />
            <line x1="0" y1={p} x2="280" y2={p} stroke="#eef2f7" />
          </g>
        )
      })}
      <line x1="0" y1={CY} x2="280" y2={CY} stroke={AXIS} strokeWidth="1.4" />
      <line x1={CX} y1="0" x2={CX} y2="280" stroke={AXIS} strokeWidth="1.4" />
      <text x="268" y={CY - 5} className={FLAT} fontSize="10">
        x
      </text>
      <text x={CX + 5} y="12" className={FLAT} fontSize="10">
        y
      </text>
    </>
  )
}

export function LineSim() {
  const [m, setM] = useState(1)
  const [c, setC] = useState(0)

  const toPx = (x, y) => [CX + x * U, CY - y * U]
  const [x1, y1] = toPx(-7, m * -7 + c)
  const [x2, y2] = toPx(7, m * 7 + c)
  const xInt = m !== 0 ? -c / m : null

  const steep =
    m === 0 ? 'තිරස් රේඛාවක්' : Math.abs(m) < 1 ? 'මෘදු බෑවුමක්' : Math.abs(m) < 3 ? 'මධ්‍යම බෑවුමක්' : 'තද බෑවුමක්'

  return (
    <div className="space-y-3">
      <SimFrame caption="රේඛාවේ බෑවුම හා එය y අක්ෂය හමුවන තැන මාරු කර බලන්න.">
        <svg viewBox="0 0 280 280" role="img" aria-label="රේඛීය ප්‍රස්ථාරය" className="w-full">
          <clipPath id="plotArea">
            <rect x="0" y="0" width="280" height="280" />
          </clipPath>
          <Grid />
          <g clipPath="url(#plotArea)">
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0f9d63" strokeWidth="3" strokeLinecap="round" />
            <circle cx={CX} cy={CY - c * U} r="4.5" fill="#0f9d63" stroke="#fff" strokeWidth="1.6" />
            {xInt !== null && Math.abs(xInt) <= 7 ? (
              <circle cx={CX + xInt * U} cy={CY} r="4.5" fill="#f59e0b" stroke="#fff" strokeWidth="1.6" />
            ) : null}
          </g>
          <text x="12" y="20" fontSize="12.5" fontWeight="700" className="fill-ink">
            y = {m}x {c >= 0 ? '+' : '−'} {Math.abs(c)}
          </text>
        </svg>
      </SimFrame>

      <div className="grid gap-3 sm:grid-cols-2">
        <Slider label="අනුක්‍රමණය m" value={m} onChange={setM} min={-4} max={4} step={0.5} />
        <Slider label="y-ඡේදනය c" value={c} onChange={setC} min={-5} max={5} step={0.5} />
      </div>

      <Readout
        items={[
          { label: 'බෑවුම', value: steep },
          { label: 'y-ඡේදනය', value: `(0, ${c})` },
          { label: 'x-ඡේදනය', value: xInt === null ? 'නැත' : `(${xInt.toFixed(2)}, 0)` },
          { label: 'සමීකරණය', value: `y = ${m}x ${c >= 0 ? '+' : '−'} ${Math.abs(c)}` },
        ]}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 3. Quadratic                                                        */
/* ------------------------------------------------------------------ */
export function QuadSim() {
  const [a, setA] = useState(1)
  const [b, setB] = useState(0)
  const [c, setC] = useState(-4)

  const yAt = (x) => a * x * x + b * x + c
  const pts = []
  for (let x = -7; x <= 7.001; x += 0.1) {
    const [px, py] = [CX + x * U, CY - yAt(x) * U]
    pts.push(`${px.toFixed(1)},${py.toFixed(1)}`)
  }

  const disc = b * b - 4 * a * c
  const vertex = a !== 0 ? { x: -b / (2 * a), y: c - (b * b) / (4 * a) } : null
  let roots = 'මූල නැත'
  if (a !== 0 && disc > 0) {
    const r1 = (-b - Math.sqrt(disc)) / (2 * a)
    const r2 = (-b + Math.sqrt(disc)) / (2 * a)
    roots = `${Math.min(r1, r2).toFixed(2)}, ${Math.max(r1, r2).toFixed(2)}`
  } else if (a !== 0 && Math.abs(disc) < 1e-9) {
    roots = `${(-b / (2 * a)).toFixed(2)}`
  }

  return (
    <div className="space-y-3">
      <SimFrame caption="a, b, c වෙනස් කර පරාවලයේ හැඩය, ශීර්ෂය සහ මූල නිරීක්ෂණය කරන්න.">
        <svg viewBox="0 0 280 280" role="img" aria-label="වර්ගජ ශ්‍රිතයේ ප්‍රස්ථාරය" className="w-full">
          <clipPath id="quadArea">
            <rect x="0" y="0" width="280" height="280" />
          </clipPath>
          <Grid />
          <g clipPath="url(#quadArea)">
            <polyline points={pts.join(' ')} fill="none" stroke="#3167d6" strokeWidth="2.6" />
            {vertex ? (
              <>
                <line
                  x1={CX + vertex.x * U}
                  y1="0"
                  x2={CX + vertex.x * U}
                  y2="280"
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                />
                <circle cx={CX + vertex.x * U} cy={CY - vertex.y * U} r="4.5" fill="#3167d6" stroke="#fff" strokeWidth="1.6" />
              </>
            ) : null}
          </g>
          <text x="12" y="20" fontSize="11.5" fontWeight="700" className="fill-ink">
            y = {a}x² {b >= 0 ? '+' : '−'} {Math.abs(b)}x {c >= 0 ? '+' : '−'} {Math.abs(c)}
          </text>
        </svg>
      </SimFrame>

      <div className="grid gap-3 sm:grid-cols-3">
        <Slider label="a (හැඩය)" value={a} onChange={setA} min={-2} max={2} step={0.5} />
        <Slider label="b (අක්ෂය)" value={b} onChange={setB} min={-6} max={6} step={1} />
        <Slider label="c (උස)" value={c} onChange={setC} min={-6} max={6} step={1} />
      </div>

      <Readout
        items={[
          { label: 'ශීර්ෂය', value: vertex ? `(${vertex.x.toFixed(1)}, ${vertex.y.toFixed(1)})` : '—' },
          { label: 'සමමිතික අක්ෂය', value: vertex ? `x = ${vertex.x.toFixed(1)}` : '—' },
          { label: 'මූල', value: roots },
          { label: 'විචක්ෂකය', value: a === 0 ? '—' : disc.toFixed(1) },
        ]}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 4. Trig Tour                                                        */
/* ------------------------------------------------------------------ */
export function TrigSim() {
  const [angle, setAngle] = useState(30)
  const rad = (angle * Math.PI) / 180
  const R = 88
  const cx = 140
  const cy = 132
  const px = cx + Math.cos(rad) * R
  const py = cy - Math.sin(rad) * R
  const sin = Math.sin(rad)
  const cos = Math.cos(rad)
  const tan = Math.abs(Math.cos(rad)) < 1e-6 ? null : Math.tan(rad)

  const fmt = (v) => (Math.abs(v) < 1e-9 ? '0' : v.toFixed(3))
  const quadrant =
    angle % 90 === 0
      ? angle === 0 || angle === 360
        ? 'ධන x අක්ෂයේ'
        : angle === 90
          ? 'ධන y අක්ෂයේ'
          : angle === 180
            ? 'සෘණ x අක්ෂයේ'
            : 'සෘණ y අක්ෂයේ'
      : `${Math.floor(angle / 90) + 1} වන චතුරස්‍රයේ`

  return (
    <div className="space-y-3">
      <SimFrame caption="ඒකක වෘත්තයේ ලක්ෂ්‍යය කෝණය සමඟ ගමන් කරයි. පාදයේ දිග = cos, උස = sin.">
        <svg viewBox="0 0 280 260" role="img" aria-label="ත්‍රිකෝණමිතික ඒකක වෘත්තය" className="w-full">
          <line x1="20" y1={cy} x2="260" y2={cy} stroke={AXIS} strokeWidth="1.3" />
          <line x1={cx} y1="14" x2={cx} y2="250" stroke={AXIS} strokeWidth="1.3" />
          <circle cx={cx} cy={cy} r={R} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1={cx} y1={cy} x2={px} y2={py} stroke="#0f9d63" strokeWidth="2.4" />
          <line x1={px} y1={py} x2={px} y2={cy} stroke="#3167d6" strokeWidth="2.4" strokeDasharray="5 3" />
          <line x1={cx} y1={cy} x2={px} y2={cy} stroke="#f59e0b" strokeWidth="2.4" />
          <circle cx={px} cy={py} r="5" fill="#0f9d63" stroke="#fff" strokeWidth="1.6" />
          <path
            d={`M ${cx + 26} ${cy} A 26 26 0 0 ${angle > 180 ? 1 : 0} ${cx + 26 * Math.cos(rad)} ${
              cy - 26 * Math.sin(rad)
            }`}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
          />
          <text x={cx + 32} y={cy - 12} fontSize="11" fill="#ef4444" fontWeight="700">
            {angle}°
          </text>
          <text x={px + 6} y={py - 6} fontSize="10" className="fill-slate-500">
            ({cos.toFixed(2)}, {sin.toFixed(2)})
          </text>
        </svg>
      </SimFrame>

      <Slider label="කෝණය θ" value={angle} onChange={setAngle} min={0} max={360} step={5} unit="°" />

      <Readout
        items={[
          { label: 'sin θ', value: fmt(sin) },
          { label: 'cos θ', value: fmt(cos) },
          { label: 'tan θ', value: tan === null ? 'අර්ථ නොදැක්වේ' : fmt(tan) },
          { label: 'පිහිටීම', value: quadrant },
        ]}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 5. Circuit Construction Kit                                         */
/* ------------------------------------------------------------------ */
export function CircuitSim() {
  const [mode, setMode] = useState('series')
  const [voltage, setVoltage] = useState(6)
  const [r1, setR1] = useState(4)
  const [r2, setR2] = useState(4)

  const brightness = (p) => Math.max(0.08, Math.min(1, p / 9))

  let current = 0
  let v1 = 0
  let v2 = 0
  let i1 = 0
  let i2 = 0
  if (mode === 'series') {
    current = voltage / (r1 + r2)
    i1 = current
    i2 = current
    v1 = current * r1
    v2 = current * r2
  } else {
    i1 = voltage / r1
    i2 = voltage / r2
    current = i1 + i2
    v1 = voltage
    v2 = voltage
  }
  const p1 = v1 * i1
  const p2 = v2 * i2

  const Bulb = ({ x, y, lit }) => (
    <g>
      <circle cx={x} cy={y} r="17" fill="#fff7ed" stroke="#cbd5e1" strokeWidth="1.6" />
      <circle cx={x} cy={y} r="10" fill="#fbbf24" opacity={lit} />
      <path d={`M ${x - 9} ${y} L ${x + 9} ${y}`} stroke="#a16207" strokeWidth="2" />
    </g>
  )

  return (
    <div className="space-y-3">
      <SimFrame caption="රතු රේඛා = ධාරාව ගලන මාර්ගය. බුල්බ් දීප්තිය ජවයට සමානුපාතිකයි.">
        <svg viewBox="0 0 280 200" role="img" aria-label="විදුලි පරිපථ රූප සටහන" className="w-full">
          {/* battery */}
          <g>
            <rect x="16" y="78" width="12" height="44" rx="3" fill="#e2e8f0" stroke="#64748b" />
            <line x1="22" y1="78" x2="22" y2="122" stroke="#64748b" strokeWidth="2" />
            <text x="4" y="70" fontSize="10" className="fill-slate-500">
              {voltage}V
            </text>
          </g>
          {mode === 'series' ? (
            <>
              <path d="M28 82 H 120 V 60 H 124 M 156 60 H 190 V 82 H 252 V 118 H 190 V 140 H 156 M 124 140 H 120 V 118 H 28" fill="none" stroke="#ef4444" strokeWidth="2" />
              <Bulb x={140} y={60} lit={brightness(p1)} />
              <Bulb x={140} y={140} lit={brightness(p2)} />
            </>
          ) : (
            <>
              <path d="M28 100 H 70" fill="none" stroke="#ef4444" strokeWidth="2" />
              <path d="M70 100 V 55 H 124 M 156 55 H 250 V 100" fill="none" stroke="#ef4444" strokeWidth="2" />
              <path d="M70 100 V 145 H 124 M 156 145 H 250 V 100" fill="none" stroke="#ef4444" strokeWidth="2" />
              <path d="M28 100 V 145 H 20" fill="none" stroke="#ef4444" strokeWidth="2" />
              <Bulb x={140} y={55} lit={brightness(p1)} />
              <Bulb x={140} y={145} lit={brightness(p2)} />
              <text x="200" y="95" fontSize="10" className="fill-slate-500">
                සමාන්තර
              </text>
            </>
          )}
        </svg>
      </SimFrame>

      <ModeToggle
        value={mode}
        onChange={setMode}
        options={[
          { value: 'series', label: 'ශ්‍රේණිගත' },
          { value: 'parallel', label: 'සමාන්තර' },
        ]}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <Slider label="බැටරි වෝල්ටීයතාව" value={voltage} onChange={setVoltage} min={3} max={12} step={1} unit="V" />
        <Slider label="බුල්බ් 1 ප්‍රතිරෝධය" value={r1} onChange={setR1} min={2} max={12} step={1} unit="Ω" />
        <Slider label="බුල්බ් 2 ප්‍රතිරෝධය" value={r2} onChange={setR2} min={2} max={12} step={1} unit="Ω" />
      </div>

      <Readout
        items={[
          { label: 'මුළු ධාරාව', value: `${current.toFixed(2)} A` },
          { label: 'බුල්බ් 1 වෝල්ටීයතාව', value: `${v1.toFixed(1)} V` },
          { label: 'බුල්බ් 2 වෝල්ටීයතාව', value: `${v2.toFixed(1)} V` },
          { label: 'මුළු ජවය', value: `${(p1 + p2).toFixed(1)} W` },
        ]}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 6. pH Scale                                                         */
/* ------------------------------------------------------------------ */
const PH_EXAMPLES = [
  { max: 1, text: 'බැටරි අම්ලය' },
  { max: 3, text: 'දිව ඇඹුල් යුෂ / ලෙමන්' },
  { max: 5, text: 'විනාකිරි / කෝපි' },
  { max: 6, text: 'දෙහි යුෂ / කිරි' },
  { max: 7, text: 'පිරිසිදු ජලය' },
  { max: 8, text: 'මුහුදු ජලය' },
  { max: 10, text: 'බේකින් සෝඩා ද්‍රාවණය' },
  { max: 12, text: 'සබන් ද්‍රාවණය' },
  { max: 14, text: 'සෝඩියම් හයිඩ්‍රොක්සයිඩ්' },
]

export function PhSim() {
  const [ph, setPh] = useState(7)
  const hue = (ph / 14) * 240
  const color = `hsl(${hue}, 68%, 45%)`
  const hPlus = Math.pow(10, -ph)
  const kind = ph < 7 ? 'අම්ල' : ph === 7 ? 'උදාසීන' : 'භෂ්ම'
  const strength =
    ph === 7
      ? '—'
      : ph < 4
        ? 'බලවත් අම්ල'
        : ph < 7
          ? 'දුර්වල අම්ල'
          : ph <= 10
            ? 'දුර්වල භෂ්ම'
            : 'බලවත් භෂ්ම'
  const example = PH_EXAMPLES.find((e) => ph <= e.max)?.text ?? ''
  const exponent = ph.toFixed(0)

  return (
    <div className="space-y-3">
      <SimFrame caption="pH අගය වැඩි වන විට H⁺ සාන්ද්‍රණය 10 ගුණයකින් අඩු වේ.">
        <svg viewBox="0 0 280 190" role="img" aria-label="pH පරිමාණය" className="w-full">
          <defs>
            <linearGradient id="phGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="50%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
          <rect x="18" y="96" width="244" height="16" rx="8" fill="url(#phGrad)" />
          {Array.from({ length: 15 }).map((_, i) => {
            const x = 18 + (i / 14) * 244
            return (
              <g key={i}>
                <line x1={x} y1="112" x2={x} y2={i % 7 === 0 ? 124 : 119} stroke="#94a3b8" strokeWidth="1.2" />
                <text x={x} y="136" textAnchor="middle" fontSize="9" className="fill-slate-500">
                  {i}
                </text>
              </g>
            )
          })}
          <line x1={18 + (ph / 14) * 244} y1="70" x2={18 + (ph / 14) * 244} y2="112" stroke="#132033" strokeWidth="2" />
          <circle cx={18 + (ph / 14) * 244} cy="96" r="12" fill={color} stroke="#fff" strokeWidth="3" />
          <text x="140" y="30" textAnchor="middle" fontSize="26" fontWeight="800" fill={color}>
            pH {ph}
          </text>
          <text x="140" y="52" textAnchor="middle" fontSize="11.5" fill="#475569">
            {kind} · {strength}
          </text>
          <text x="20" y="164" fontSize="9.5" fill="#64748b">
            අම්ල (0–6)
          </text>
          <text x="122" y="164" fontSize="9.5" fill="#64748b">
            උදාසීන (7)
          </text>
          <text x="204" y="164" fontSize="9.5" fill="#64748b">
            භෂ්ම (8–14)
          </text>
          <text x="140" y="182" textAnchor="middle" fontSize="10" fill="#475569">
            උදා: {example}
          </text>
        </svg>
      </SimFrame>

      <Slider label="pH අගය" value={ph} onChange={setPh} min={0} max={14} step={1} />

      <Readout
        items={[
          { label: 'H⁺ සාන්ද්‍රණය', value: `1 × 10⁻${exponent} mol/dm³` },
          { label: 'වර්ගය', value: kind },
          { label: 'ශක්තිය', value: strength },
          { label: 'ලිට්මස්', value: ph < 7 ? 'නිල් → රතු' : ph > 7 ? 'රතු → නිල්' : 'වෙනසක් නැත' },
        ]}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 7. Wave on a String                                                 */
/* ------------------------------------------------------------------ */
export function WaveSim() {
  const [freq, setFreq] = useState(2)
  const [amp, setAmp] = useState(0.8)
  const [damping, setDamping] = useState(0.02)

  const speed = 2 // m/s
  const lambda = speed / freq
  const W = 280
  const H = 150
  const cycles = 2.2
  const points = []
  for (let i = 0; i <= 100; i += 1) {
    const t = i / 100
    const envelope = Math.exp(-damping * t * 8)
    const y = H / 2 - amp * 52 * envelope * Math.sin(t * cycles * 2 * Math.PI)
    points.push(`${(10 + t * (W - 20)).toFixed(1)},${y.toFixed(1)}`)
  }

  return (
    <div className="space-y-3">
      <SimFrame caption="සංඛ්‍යාතය වැඩි වන විට තරංග ආයාමය කෙටි වේ (වේගය නියතයි).">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="තන්තුවක් මත තරංගය" className="w-full">
          <line x1="10" y1={H / 2} x2={W - 10} y2={H / 2} stroke="#e2e8f0" strokeDasharray="3 4" />
          <polyline points={points.join(' ')} fill="none" stroke="#3167d6" strokeWidth="2.6" strokeLinecap="round" />
          {points.filter((_, i) => i % 10 === 0).map((p) => {
            const [x, y] = p.split(',')
            return <circle key={p} cx={x} cy={y} r="1.8" fill="#93c5fd" />
          })}
          <line x1="10" y1={H - 18} x2={10 + (W - 20) / 2} y2={H - 18} stroke="#0f9d63" strokeWidth="2" />
          <text x={10 + (W - 20) / 4} y={H - 24} textAnchor="middle" fontSize="9.5" fill="#0b7d4f">
            λ = {lambda.toFixed(2)} m
          </text>
          <text x={W / 2} y="18" textAnchor="middle" fontSize="10" className="fill-slate-500">
            විස්තාරය {amp.toFixed(1)} m · සංඛ්‍යාතය {freq.toFixed(1)} Hz
          </text>
        </svg>
      </SimFrame>

      <div className="grid gap-3 sm:grid-cols-3">
        <Slider label="සංඛ්‍යාතය f" value={freq} onChange={setFreq} min={0.5} max={4} step={0.5} unit="Hz" />
        <Slider label="විස්තාරය A" value={amp} onChange={setAmp} min={0.2} max={1.4} step={0.2} unit="m" />
        <Slider label="අවශෝෂණය" value={damping} onChange={setDamping} min={0} max={0.12} step={0.02} />
      </div>

      <Readout
        items={[
          { label: 'වේගය v = fλ', value: `${speed.toFixed(1)} m/s` },
          { label: 'තරංග ආයාමය λ', value: `${lambda.toFixed(2)} m` },
          { label: 'ආවර්ත කාලය T', value: `${(1 / freq).toFixed(2)} s` },
          { label: 'ශක්තිය ∝ A²', value: `${(amp * amp).toFixed(2)} (සාපේක්ෂ)` },
        ]}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 8. Circle & Line Explorer                                           */
/* ------------------------------------------------------------------ */
export function CircleSim() {
  const [mode, setMode] = useState('circle')
  const [radius, setRadius] = useState(4)
  const [dist, setDist] = useState(2)
  const [p1, setP1] = useState({ x: -3, y: -1 })
  const [p2, setP2] = useState({ x: 3, y: 3 })
  const [drag, setDrag] = useState(null)

  const cx = 140
  const cy = 140
  const R = radius * 20
  const chordHalf = Math.sqrt(Math.max(radius * radius - dist * dist, 0))

  const toPx = (x, y) => [cx + x * 20, cy - y * 20]

  const grad = p1.x === p2.x ? null : (p2.y - p1.y) / (p2.x - p1.x)
  const perp = grad === null ? 0 : Math.abs(grad) < 1e-9 ? null : -1 / grad

  const onMove = (e) => {
    if (drag === null) return
    const rect = e.currentTarget.getBoundingClientRect()
    const sx = ((e.clientX - rect.left) / rect.width) * 280
    const sy = ((e.clientY - rect.top) / rect.height) * 280
    const x = Math.max(-5.5, Math.min(5.5, Math.round(((sx - cx) / 20) * 2) / 2))
    const y = Math.max(-4.5, Math.min(4.5, Math.round(((cy - sy) / 20) * 2) / 2))
    if (drag === 1) setP1({ x, y })
    else setP2({ x, y })
  }

  return (
    <div className="space-y-3">
      <SimFrame caption="ලක්ෂ්‍ය ඇදගෙන ගොස් වෘත්තයේ හා අනුක්‍රමණයේ සම්බන්ධතා පරීක්ෂා කරන්න.">
        <svg
          viewBox="0 0 280 280"
          role="img"
          aria-label="වෘත්ත හා රේඛා අන්තර්ක්‍රියාකාරී ජ්‍යාමිතිය"
          className="w-full touch-none select-none"
          onPointerMove={onMove}
          onPointerUp={() => setDrag(null)}
          onPointerLeave={() => setDrag(null)}
        >
          <Grid />
          {mode === 'circle' ? (
            <>
              <circle cx={cx} cy={cy} r={R} fill="#eff6ff" stroke="#3167d6" strokeWidth="2" />
              <circle cx={cx} cy={cy} r="3.5" fill="#3167d6" />
              <text x={cx + 6} y={cy - 6} fontSize="9.5" fill="#3167d6">
                O
              </text>
              <line x1={cx} y1={cy - dist * 20} x2={cx} y2={cy - R} stroke="#0f9d63" strokeWidth="1.6" strokeDasharray="4 3" />
              <line
                x1={cx - chordHalf * 20}
                y1={cy - dist * 20}
                x2={cx + chordHalf * 20}
                y2={cy - dist * 20}
                stroke="#f59e0b"
                strokeWidth="3"
              />
              <line x1={cx} y1={cy} x2={cx + chordHalf * 20} y2={cy - dist * 20} stroke="#64748b" strokeWidth="1.6" />
              <circle cx={cx - chordHalf * 20} cy={cy - dist * 20} r="4" fill="#f59e0b" />
              <circle cx={cx + chordHalf * 20} cy={cy - dist * 20} r="4" fill="#f59e0b" />
              <text x={cx - chordHalf * 20 - 4} y={cy - dist * 20 - 8} fontSize="9" fill="#b45309">
                A
              </text>
              <text x={cx + chordHalf * 20 + 4} y={cy - dist * 20 - 8} fontSize="9" fill="#b45309">
                B
              </text>
              <text x={cx + 18} y={cy - dist * 10 - 6} fontSize="9.5" fill="#64748b">
                r = {radius}
              </text>
            </>
          ) : (
            <>
              {(() => {
                const [x1, y1] = toPx(p1.x, p1.y)
                const [x2, y2] = toPx(p2.x, p2.y)
                const dx = x2 - x1
                const dy = y2 - y1
                const len = Math.hypot(dx, dy) || 1
                const ux = dx / len
                const uy = dy / len
                return (
                  <>
                    <line x1={x1 - ux * 240} y1={y1 - uy * 240} x2={x1 + ux * 240} y2={y1 + uy * 240} stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4 4" />
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0f9d63" strokeWidth="3" />
                    <line x1={x1} y1={y1} x2={x2} y2={y1} stroke="#cbd5e1" strokeWidth="1.4" />
                    <line x1={x2} y1={y1} x2={x2} y2={y2} stroke="#cbd5e1" strokeWidth="1.4" />
                    <circle
                      cx={x1}
                      cy={y1}
                      r="8"
                      fill="#0f9d63"
                      stroke="#fff"
                      strokeWidth="2"
                      className="cursor-grab"
                      onPointerDown={(e) => {
                        e.currentTarget.setPointerCapture?.(e.pointerId)
                        setDrag(1)
                      }}
                    />
                    <circle
                      cx={x2}
                      cy={y2}
                      r="8"
                      fill="#3167d6"
                      stroke="#fff"
                      strokeWidth="2"
                      className="cursor-grab"
                      onPointerDown={(e) => {
                        e.currentTarget.setPointerCapture?.(e.pointerId)
                        setDrag(2)
                      }}
                    />
                    <text x={x1 + 10} y={y1 + 4} fontSize="10" fill="#0b7d4f" fontWeight="700">
                      A({p1.x}, {p1.y})
                    </text>
                    <text x={x2 + 10} y={y2 + 4} fontSize="10" fill="#2551b0" fontWeight="700">
                      B({p2.x}, {p2.y})
                    </text>
                  </>
                )
              })()}
            </>
          )}
        </svg>
      </SimFrame>

      <ModeToggle
        value={mode}
        onChange={setMode}
        options={[
          { value: 'circle', label: 'වෘත්තය හා ඡේදකය' },
          { value: 'gradient', label: 'අනුක්‍රමණය' },
        ]}
      />

      {mode === 'circle' ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <Slider label="අරය r" value={radius} onChange={setRadius} min={2} max={5} step={0.5} />
          <Slider label="කේන්ද්‍රයේ සිට දුර d" value={dist} onChange={setDist} min={0} max={radius - 1.5} step={0.5} />
        </div>
      ) : (
        <p className="rounded-xl bg-slate-50 px-3 py-2 text-[12.5px] text-slate-600">
          ලක්ෂ්‍ය A හෝ B ඇදගෙන ගොස් අනුක්‍රමණය වෙනස් වන ආකාරය බලන්න.
        </p>
      )}

      <Readout
        items={
          mode === 'circle'
            ? [
                { label: 'ඡේදකයේ දිග', value: `${(2 * chordHalf).toFixed(2)}` },
                { label: 'ලම්බ දුර d', value: `${dist}` },
                { label: 'r² = d² + (c/2)²', value: `${(radius * radius).toFixed(2)} = ${(dist * dist + chordHalf * chordHalf).toFixed(2)}` },
                { label: 'ලම්බය', value: 'ඡේදකය සමද්විභාග කරයි' },
              ]
            : [
                { label: 'අනුක්‍රමණය m', value: grad === null ? 'අර්ථ නොදැක්වේ' : grad.toFixed(2) },
                { label: 'ලම්බ අනුක්‍රමණය', value: perp === null ? '0' : perp === 0 ? 'අර්ථ නොදැක්වේ' : perp.toFixed(2) },
                { label: 'A → B දුර', value: Math.hypot(p2.x - p1.x, p2.y - p1.y).toFixed(2) },
                { label: 'මධ්‍ය ලක්ෂ්‍යය', value: `(${((p1.x + p2.x) / 2).toFixed(1)}, ${((p1.y + p2.y) / 2).toFixed(1)})` },
              ]
        }
      />
    </div>
  )
}

export const SIMS = {
  atom: AtomSim,
  lines: LineSim,
  quad: QuadSim,
  trig: TrigSim,
  circuit: CircuitSim,
  ph: PhSim,
  wave: WaveSim,
  circle: CircleSim,
  force: ForceSim,
  pressure: PressureSim,
  energy: EnergySim,
  optics: OpticsSim,
  induction: InductionSim,
  angles: AnglesSim,
  stats: StatsSim,
  solids: SolidsSim,
  prob: ProbSim,
  scale: ScaleSim,
  numberbase: NumberBaseSim,
  logic: LogicGateSim,
  flowchart: FlowchartSim,
  query: QuerySim,
  sheetFns: SheetFnsSim,
  trace: TraceSim,
}
