import { useEffect, useState } from 'react'
import { Slider, SimFrame, Readout, ModeToggle } from './ui.jsx'

const FLAT = 'text-[11px] fill-slate-500'

/* ------------------------------ 1. බලය ------------------------------ */
export function ForceSim() {
  const [mass, setMass] = useState(5)
  const [force, setForce] = useState(20)
  const [friction, setFriction] = useState(4)
  const [t, setT] = useState(0)
  const [running, setRunning] = useState(false)

  const net = force - friction
  const a = net > 0 ? net / mass : 0
  const x = Math.min(0.5 * a * t * t * 8, 170)

  useEffect(() => {
    if (!running) return undefined
    const id = setInterval(() => setT((v) => v + 0.1), 100)
    return () => clearInterval(id)
  }, [running])

  return (
    <div className="space-y-3">
      <SimFrame caption="වස්තුව මත යොදන බලය (→) හා ඝර්ෂණය (←). සම්පූර්ණ බලය ධන නම් වස්තුව ත්වරණය වේ.">
        <svg viewBox="0 0 280 170" className="w-full" role="img" aria-label="බල රූප සටහන">
          <rect width="280" height="170" fill="#f8fafc" rx="12" />
          <line x1="10" y1="130" x2="270" y2="130" stroke="#94a3b8" strokeWidth="2" />
          <rect x={20 + x} y="100" width="50" height="30" rx="4" fill="#dbe8ff" stroke="#3167d6" strokeWidth="2" />
          <text x={30 + x} y="120" fontSize="11" fontWeight="700" fill="#132033">
            {mass}kg
          </text>
          {net > 0 ? (
            <g>
              <line x1={70 + x} y1="112" x2={110 + x} y2="112" stroke="#0f9d63" strokeWidth="3" />
              <path d={`M${110 + x} 112 l-8 -5 v10 z`} fill="#0f9d63" />
              <text x={78 + x} y="104" fontSize="10" fill="#0b7d4f">
                F = {force} N
              </text>
            </g>
          ) : null}
          {friction > 0 ? (
            <g>
              <line x1={20 + x} y1="88" x2={20 + x - Math.min(friction * 2, 45)} y2="88" stroke="#ef4444" strokeWidth="3" />
              <path d={`M${20 + x - Math.min(friction * 2, 45)} 88 l8 -5 v10 z`} fill="#ef4444" />
              <text x={18 + x} y="80" fontSize="10" fill="#b91c1c">
                f = {friction} N
              </text>
            </g>
          ) : null}
          <text x="140" y="155" textAnchor="middle" fontSize="10" className={FLAT}>
            {net > 0 ? `ත්වරණය ${a.toFixed(2)} m/s²` : 'සම්පූර්ණ බලය ශුන්‍යයි — චලිතයක් නැත'}
          </text>
        </svg>
      </SimFrame>

      <div className="grid gap-3 sm:grid-cols-3">
        <Slider label="ස්කන්ධය" value={mass} onChange={setMass} min={1} max={20} unit=" kg" />
        <Slider label="යොදන බලය" value={force} onChange={setForce} min={0} max={60} unit=" N" />
        <Slider label="ඝර්ෂණ බලය" value={friction} onChange={setFriction} min={0} max={30} unit=" N" />
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={() => setRunning((r) => !r)} className="btn-primary flex-1 py-2 text-[13px]">
          {running ? 'නවත්වන්න' : 'චලිතය අරඹන්න'}
        </button>
        <button
          type="button"
          onClick={() => {
            setRunning(false)
            setT(0)
          }}
          className="btn-ghost px-4 py-2 text-[13px]"
        >
          යළි සකසන්න
        </button>
      </div>

      <Readout
        items={[
          { label: 'සම්පූර්ණ බලය', value: `${net} N` },
          { label: 'ත්වරණය', value: `${a.toFixed(2)} m/s²` },
          { label: 'චලනය', value: net > 0 ? 'ත්වරණය වේ' : 'නිශ්චල' },
          { label: 'F = ma', value: `${net} = ${mass} × ${a.toFixed(2)}` },
        ]}
      />
    </div>
  )
}

/* ----------------------------- 2. පීඩනය ----------------------------- */
const LIQUIDS = [
  { label: 'ජලය', value: 1000 },
  { label: 'ලුණු ජලය', value: 1200 },
  { label: 'තෙල්', value: 800 },
]

export function PressureSim() {
  const [mode, setMode] = useState('liquid')
  const [depth, setDepth] = useState(3)
  const [density, setDensity] = useState(1000)
  const [objDensity, setObjDensity] = useState(600)

  const g = 10
  const pressure = (density * g * depth) / 1000
  const volume = 0.002
  const buoyant = (1000 * g * volume).toFixed(0)
  const weight = (objDensity * g * volume).toFixed(0)
  const floats = objDensity < 1000

  return (
    <div className="space-y-3">
      <ModeToggle
        options={[
          { value: 'liquid', label: 'දියර පීඩනය' },
          { value: 'buoyancy', label: 'උත්ප්ලාවනය' },
        ]}
        value={mode}
        onChange={setMode}
      />

      {mode === 'liquid' ? (
        <>
          <Slider label="ගැඹුර (h)" value={depth} onChange={setDepth} min={0.5} max={10} step={0.5} unit=" m" />
          <div className="grid grid-cols-3 gap-1.5">
            {LIQUIDS.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => setDensity(l.value)}
                className={`rounded-xl border px-2 py-1.5 text-[12px] font-semibold ${
                  density === l.value ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <Slider label="වස්තුවේ ඝනත්වය" value={objDensity} onChange={setObjDensity} min={200} max={2000} step={50} unit=" kg/m³" />
          <p className="rounded-xl bg-slate-50 px-3 py-2 text-[12px] text-slate-600">
            වස්තුවේ පරිමාව නියතයි: 2 dm³ (0.002 m³). ඝනත්වය පමණක් වෙනස් කරන්න.
          </p>
        </>
      )}

      <SimFrame
        caption={
          mode === 'liquid'
            ? 'ගැඹුර වැඩි වන විට පහළ ලක්ෂ්‍යයේ පීඩනය වැඩි වේ (P = ρgh).'
            : 'වස්තුවේ ඝනත්වය ජලයට වඩා අඩු නම් පාවේ; වැඩි නම් ගිලේ.'
        }
      >
        <svg viewBox="0 0 280 190" className="w-full" role="img" aria-label="පීඩන රූප සටහන">
          <rect width="280" height="190" fill="#f8fafc" rx="12" />
          <rect x="40" y="34" width="200" height="130" rx="6" fill={mode === 'liquid' ? '#dbeafe' : '#e0f2fe'} stroke="#64748b" />
          {mode === 'liquid' ? (
            <g>
              <circle cx="70" cy={34 + (depth / 10) * 120} r="4" fill="#1d4ed8" />
              <line x1="70" y1="34" x2="70" y2={34 + (depth / 10) * 120} stroke="#1d4ed8" strokeDasharray="3 3" />
              <text x="78" y={40 + (depth / 10) * 120} fontSize="10" fill="#1e3a8a">
                h = {depth} m
              </text>
              <text x="140" y="88" textAnchor="middle" fontSize="20" fontWeight="800" fill="#1e40af">
                {pressure.toFixed(1)} kPa
              </text>
              <text x="140" y="108" textAnchor="middle" fontSize="10" className={FLAT}>
                P = ρgh
              </text>
            </g>
          ) : (
            <g>
              <rect
                x="115"
                y={floats ? 74 : 130}
                width="50"
                height="34"
                rx="4"
                fill={floats ? '#fef3c7' : '#fecaca'}
                stroke={floats ? '#b45309' : '#b91c1c'}
              />
              <text x="140" y={floats ? 96 : 152} textAnchor="middle" fontSize="11" fontWeight="700" fill="#132033">
                ρ={objDensity}
              </text>
              <text x="140" y="182" textAnchor="middle" fontSize="11" fontWeight="700" fill={floats ? '#0b7d4f' : '#b91c1c'}>
                {floats ? 'පාවේ ✓' : 'ගිලේ'}
              </text>
            </g>
          )}
        </svg>
      </SimFrame>

      <Readout
        items={
          mode === 'liquid'
            ? [
                { label: 'දියර ඝනත්වය', value: `${density} kg/m³` },
                { label: 'ගැඹුර', value: `${depth} m` },
                { label: 'පීඩනය', value: `${pressure.toFixed(1)} kPa` },
                { label: 'P = ρgh', value: `${density}×10×${depth}` },
              ]
            : [
                { label: 'උත්ප්ලාවන බලය', value: `${buoyant} N` },
                { label: 'වස්තුවේ බර', value: `${weight} N` },
                { label: 'තත්ත්වය', value: floats ? 'පාවේ' : 'ගිලේ' },
                { label: 'නියමය', value: 'ආකිමිඩීස්' },
              ]
        }
      />
    </div>
  )
}

/* ------------------------------ 3. ශක්තිය ---------------------------- */
const MATERIALS = [
  { label: 'ඇලුමිනියම්', value: 23 },
  { label: 'යකඩ', value: 12 },
  { label: 'තඹ', value: 17 },
]

export function EnergySim() {
  const [mode, setMode] = useState('power')
  const [mass, setMass] = useState(5)
  const [height, setHeight] = useState(5)
  const [time, setTime] = useState(2)
  const [length, setLength] = useState(2)
  const [dT, setDT] = useState(50)
  const [alpha, setAlpha] = useState(23)

  const g = 10
  const pe = mass * g * height
  const speed = Math.sqrt(2 * g * height)
  const power = pe / time
  const expansion = (alpha * 1e-6 * length * dT * 1000).toFixed(3)

  return (
    <div className="space-y-3">
      <ModeToggle
        options={[
          { value: 'power', label: 'ශක්තිය හා ක්ෂමතාව' },
          { value: 'expand', label: 'තාප ප්‍රසාරණය' },
        ]}
        value={mode}
        onChange={setMode}
      />

      {mode === 'power' ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <Slider label="ස්කන්ධය" value={mass} onChange={setMass} min={1} max={20} unit=" kg" />
          <Slider label="උස" value={height} onChange={setHeight} min={1} max={20} unit=" m" />
          <Slider label="කාලය" value={time} onChange={setTime} min={1} max={20} unit=" s" />
        </div>
      ) : (
        <div className="space-y-3">
          <Slider label="දණ්ඩේ දිග" value={length} onChange={setLength} min={0.5} max={5} step={0.5} unit=" m" />
          <Slider label="උෂ්ණත්ව වෙනස (ΔT)" value={dT} onChange={setDT} min={10} max={200} step={10} unit=" °C" />
          <div className="grid grid-cols-3 gap-1.5">
            {MATERIALS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setAlpha(m.value)}
                className={`rounded-xl border px-2 py-1.5 text-[12px] font-semibold ${
                  alpha === m.value ? 'border-leaf-500 bg-leaf-50 text-leaf-700' : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <SimFrame
        caption={
          mode === 'power'
            ? 'උසකින් තැබූ වස්තුවේ ස්ථිතික ශක්තිය වැටෙන විට චාලක ශක්තිය බවට හැරේ.'
            : 'උෂ්ණත්වය වැඩි වන විට දණ්ඩ ප්‍රසාරණය වේ (ΔL = αLΔT).'
        }
      >
        <svg viewBox="0 0 280 170" className="w-full" role="img" aria-label="ශක්ති රූප සටහන">
          <rect width="280" height="170" fill="#f8fafc" rx="12" />
          {mode === 'power' ? (
            <g>
              <line x1="20" y1="140" x2="260" y2="140" stroke="#94a3b8" strokeWidth="2" />
              <rect x="60" y={140 - Math.min(height * 5, 100)} width="40" height="26" rx="4" fill="#dbe8ff" stroke="#3167d6" />
              <line x1="80" y1="140" x2="80" y2={140 - Math.min(height * 5, 100)} stroke="#cbd5e1" strokeDasharray="3 3" />
              <text x="86" y={140 - Math.min(height * 5, 100) - 4} fontSize="10" fill="#2551b0">
                {height} m
              </text>
              <text x="170" y="70" fontSize="12" fontWeight="700" fill="#132033">
                PE = {pe} J
              </text>
              <text x="170" y="90" fontSize="11" fill="#0b7d4f">
                v ≈ {speed.toFixed(1)} m/s
              </text>
              <text x="170" y="110" fontSize="11" fill="#b45309">
                P = {power.toFixed(1)} W
              </text>
            </g>
          ) : (
            <g>
              <rect x="40" y="78" width={120 + Number(expansion) * 12} height="14" rx="4" fill="#fde68a" stroke="#b45309" />
              <line x1="40" y1="104" x2="160" y2="104" stroke="#94a3b8" />
              <text x="40" y="122" fontSize="10" fill="#475569">
                මුල් දිග {length} m
              </text>
              <text x="140" y="58" textAnchor="middle" fontSize="13" fontWeight="700" fill="#b45309">
                ΔL = {expansion} mm
              </text>
            </g>
          )}
        </svg>
      </SimFrame>

      <Readout
        items={
          mode === 'power'
            ? [
                { label: 'ස්ථිතික ශක්තිය', value: `${pe} J` },
                { label: 'චාලක ශක්තිය', value: `≈ ${pe} J` },
                { label: 'වේගය', value: `${speed.toFixed(1)} m/s` },
                { label: 'ක්ෂමතාව', value: `${power.toFixed(1)} W` },
              ]
            : [
                { label: 'ද්‍රව්‍යය', value: MATERIALS.find((m) => m.value === alpha)?.label ?? '—' },
                { label: 'මුල් දිග', value: `${length} m` },
                { label: 'ΔT', value: `${dT} °C` },
                { label: 'ප්‍රසාරණය', value: `${expansion} mm` },
              ]
        }
      />
    </div>
  )
}

/* ------------------------------ 4. කාච ------------------------------ */
export function OpticsSim() {
  const [mode, setMode] = useState('lens')
  const [f, setF] = useState(10)
  const [u, setU] = useState(30)

  const denom = u - f
  const v = Math.abs(denom) < 0.001 ? Infinity : (u * f) / denom
  const m = Number.isFinite(v) ? Math.abs(v / u) : Infinity
  const real = Number.isFinite(v) && v > 0
  const inside = u <= f

  return (
    <div className="space-y-3">
      <ModeToggle
        options={[
          { value: 'lens', label: 'උත්තල කාචය' },
          { value: 'mirror', label: 'අවතල දර්පණය' },
        ]}
        value={mode}
        onChange={setMode}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Slider label="නාභි දුර (f)" value={f} onChange={setF} min={5} max={30} unit=" cm" />
        <Slider label="වස්තු දුර (u)" value={u} onChange={setU} min={5} max={60} unit=" cm" />
      </div>

      <SimFrame caption="වස්තුව නාභිය තුළ ඇත්නම් ප්‍රතිබිම්බය මවාගත්, කෙළින් හා විශාල වේ.">
        <svg viewBox="0 0 280 170" className="w-full" role="img" aria-label="කාච රූප සටහන">
          <rect width="280" height="170" fill="#f8fafc" rx="12" />
          <line x1="10" y1="85" x2="270" y2="85" stroke="#cbd5e1" strokeDasharray="4 3" />
          {mode === 'lens' ? (
            <ellipse cx="140" cy="85" rx="8" ry="46" fill="#dbeafe" stroke="#3167d6" strokeWidth="2" />
          ) : (
            <path d="M150 39 Q120 85 150 131" fill="none" stroke="#3167d6" strokeWidth="3" />
          )}
          <circle cx={mode === 'lens' ? 140 : 140} cy="85" r="2.5" fill="#1d4ed8" />
          <text x="146" y="42" fontSize="9" fill="#475569">
            F
          </text>
          <line x1={140 - (u / 60) * 110} y1="85" x2={140 - (u / 60) * 110} y2="55" stroke="#0f9d63" strokeWidth="3" />
          <path d={`M${140 - (u / 60) * 110} 55 l-5 8 h10 z`} fill="#0f9d63" />
          <text x={140 - (u / 60) * 110 - 12} y="50" fontSize="9" fill="#0b7d4f">
            u
          </text>
          {Number.isFinite(v) && Math.abs(v) < 120 ? (
            <g>
              <line
                x1={140 + (v / 60) * 110}
                y1="85"
                x2={140 + (v / 60) * 110}
                y2={real ? 60 : 105}
                stroke={real ? '#b45309' : '#7c3aed'}
                strokeWidth="3"
              />
              <text x={140 + (v / 60) * 110 - 12} y={real ? 56 : 118} fontSize="9" fill={real ? '#b45309' : '#7c3aed'}>
                v
              </text>
            </g>
          ) : null}
          <text x="140" y="158" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={real ? '#b45309' : '#7c3aed'}>
            {!Number.isFinite(v) ? 'ප්‍රතිබිම්බය අනන්තයේ' : real ? 'සැබෑ, පෙරළුණු ප්‍රතිබිම්බය' : 'මවාගත්, කෙළින් ප්‍රතිබිම්බය'}
          </text>
        </svg>
      </SimFrame>

      <Readout
        items={[
          { label: 'නාභි දුර f', value: `${f} cm` },
          { label: 'වස්තු දුර u', value: `${u} cm` },
          { label: 'ප්‍රතිබිම්බ දුර v', value: Number.isFinite(v) ? `${v.toFixed(1)} cm` : '∞' },
          { label: 'විශාලනය m', value: Number.isFinite(m) ? m.toFixed(2) : '∞' },
        ]}
      />
      <p className="rounded-xl bg-slate-50 px-3 py-2 text-[12px] leading-relaxed text-slate-600">
        {inside
          ? 'වස්තුව නාභිය තුළ ඇති නිසා මවාගත්, කෙළින් හා විශාල ප්‍රතිබිම්බයක් සෑදේ. භූතානාච්ඡාදන කාචය මෙලෙස ක්‍රියා කරයි.'
          : 'වස්තුව නාභියට වඩා දුරින් ඇති නිසා සැබෑ, පෙරළුණු ප්‍රතිබිම්බයක් සෑදේ. කැමරාව මෙලෙස ක්‍රියා කරයි.'}
      </p>
    </div>
  )
}

/* --------------------------- 5. ප්‍රේරණය ---------------------------- */
export function InductionSim() {
  const [turns, setTurns] = useState(80)
  const [speed, setSpeed] = useState(4)
  const [field, setField] = useState(3)

  const emf = (turns * speed * field) / 400
  const glow = Math.min(emf / 3, 1)

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <Slider label="දඟර ලූප ගණන" value={turns} onChange={setTurns} min={20} max={200} step={10} />
        <Slider label="චුම්බකයේ වේගය" value={speed} onChange={setSpeed} min={0} max={10} />
        <Slider label="චුම්බක බලය" value={field} onChange={setField} min={1} max={5} />
      </div>

      <SimFrame caption="චුම්බකය චලනය වන විට පමණක් ධාරාවක් ප්‍රේරණය වේ. වේගය 0 නම් බල්බය නිවී යයි.">
        <svg viewBox="0 0 280 170" className="w-full" role="img" aria-label="ප්‍රේරණ රූප සටහන">
          <rect width="280" height="170" fill="#f8fafc" rx="12" />
          <rect x="60" y="60" width="80" height="50" rx="6" fill="none" stroke="#94a3b8" strokeWidth="2" />
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={60 + i * 20} y1="60" x2={60 + i * 20} y2="110" stroke="#cbd5e1" strokeWidth="2" />
          ))}
          <text x="100" y="128" textAnchor="middle" fontSize="10" fill="#475569">
            ලූප {turns}
          </text>
          {speed > 0 ? (
            <g>
              <animateTransform attributeName="transform" type="translate" values="0 0; 34 0; 0 0" dur={`${Math.max(3 - speed * 0.2, 0.8)}s`} repeatCount="indefinite" />
              <rect x="168" y="66" width="34" height="38" rx="4" fill="#ef4444" />
              <rect x="168" y="66" width="17" height="38" fill="#3b82f6" />
              <text x="185" y="120" textAnchor="middle" fontSize="9" fill="#475569">
                N | S
              </text>
            </g>
          ) : (
            <g>
              <rect x="168" y="66" width="34" height="38" rx="4" fill="#ef4444" />
              <rect x="168" y="66" width="17" height="38" fill="#3b82f6" />
            </g>
          )}
          <circle cx="240" cy="85" r="16" fill={`rgba(250, 204, 21, ${0.15 + glow * 0.85})`} stroke="#b45309" />
          <path d="M232 85 h16" stroke="#b45309" strokeWidth="2" />
          <text x="140" y="155" textAnchor="middle" fontSize="11" fontWeight="700" fill="#132033">
            ප්‍රේරිත emf ≈ {emf.toFixed(2)} V
          </text>
        </svg>
      </SimFrame>

      <Readout
        items={[
          { label: 'ලූප ගණන (N)', value: turns },
          { label: 'වේගය', value: `${speed}` },
          { label: 'චුම්බක බලය', value: `${field}` },
          { label: 'ප්‍රේරිත emf', value: `${emf.toFixed(2)} V` },
        ]}
      />
      <p className="rounded-xl bg-slate-50 px-3 py-2 text-[12px] leading-relaxed text-slate-600">
        ෆැරඩේ නියමය: emf ∝ දඟර ලූප ගණන × චුම්බක බලය × චලිත වේගය. චුම්බකය නිශ්චල නම් ප්‍රවාහය වෙනස් නොවන නිසා ධාරාවක් නොමැත.
      </p>
    </div>
  )
}
