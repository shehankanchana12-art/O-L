import { createContext, useContext, useEffect, useState } from 'react'

/* Windows වැඩතලයේ හා කවුළු රාමුවේ පොදු කොටස් */

export const WIN_APPS = [
  { id: 'word', badge: 'W', color: '#2b579a', label: 'Word', sub: 'ලේඛන සැකසුම', icon: '📝' },
  { id: 'excel', badge: 'X', color: '#217346', label: 'Excel', sub: 'විද්‍යුත් පැතුරුම්පත්', icon: '📊' },
  { id: 'ppt', badge: 'P', color: '#c43e1c', label: 'PowerPoint', sub: 'ඉදිරිපත් කිරීම්', icon: '📽️' },
  { id: 'access', badge: 'A', color: '#a4373a', label: 'Access', sub: 'දත්ත සමුදා', icon: '🗄️' },
]

const WinCtx = createContext(null)
export const useWin = () => useContext(WinCtx)

export function WinDesktop({ app, onApp, children }) {
  const [wide, setWide] = useState(() =>
    typeof window === 'undefined' ? true : window.matchMedia('(min-width: 1024px)').matches,
  )
  const [state, setState] = useState('open')
  const [start, setStart] = useState(false)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const handle = () => setWide(mq.matches)
    handle()
    mq.addEventListener('change', handle)
    return () => mq.removeEventListener('change', handle)
  }, [])

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 20000)
    return () => window.clearInterval(t)
  }, [])

  const open = (id) => {
    onApp(id)
    setState('open')
    setStart(false)
  }

  const controls = {
    minimize: () => setState('min'),
    maximize: () => setState((s) => (s === 'max' ? 'open' : 'max')),
    close: () => setState('min'),
  }

  if (!wide) {
    return (
      <div className="space-y-2">
        <div className="win-ribbon flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1">
          {WIN_APPS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => onApp(a.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition ${
                app === a.id ? 'bg-slate-100 ring-1 ring-slate-300' : 'hover:bg-slate-50'
              }`}
            >
              <span
                className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[3px] text-[9px] font-black text-white"
                style={{ backgroundColor: a.color }}
              >
                {a.badge}
              </span>
              <span className="whitespace-nowrap text-[11.5px] font-bold leading-none text-slate-700">{a.label}</span>
            </button>
          ))}
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-card">{children}</div>
      </div>
    )
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-slate-700/50 shadow-card"
      style={{
        height: 620,
        background: 'linear-gradient(135deg,#0b2a52 0%,#12538f 42%,#1b7fbf 72%,#0a2a52 100%)',
      }}
    >
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />

      <div className="absolute left-2.5 top-3 grid w-[72px] gap-3">
        {WIN_APPS.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => open(a.id)}
            className="flex flex-col items-center gap-0.5 rounded p-1 text-white/90 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <span
              className="grid h-8 w-8 place-items-center rounded-md text-[13px] font-black text-white shadow-md"
              style={{ backgroundColor: a.color }}
            >
              {a.badge}
            </span>
            <span className="rounded px-0.5 text-[9px] leading-tight text-white/90 drop-shadow">{a.label}</span>
          </button>
        ))}
      </div>

      {state !== 'min' ? (
        <div
          className={`absolute flex flex-col overflow-hidden bg-white shadow-2xl ring-1 ring-black/30 ${
            state === 'max' ? 'inset-0 bottom-[46px] rounded-none' : 'bottom-[58px] left-[86px] right-3 top-3 rounded-lg'
          }`}
        >
          <WinCtx.Provider value={controls}>{children}</WinCtx.Provider>
        </div>
      ) : (
        <div className="absolute inset-x-24 top-24 rounded-lg border border-white/20 bg-white/10 p-4 text-center text-white/80 backdrop-blur">
          <p className="text-[12px] leading-relaxed">යෙදුම අවම කර ඇත. පහත කාර්ය තීරුවෙන් නැවත විවෘත කරන්න.</p>
        </div>
      )}

      {start ? (
        <div className="absolute bottom-[48px] left-2 w-[252px] overflow-hidden rounded-xl border border-white/40 bg-white/95 shadow-2xl backdrop-blur">
          <div className="border-b border-slate-200 px-3 py-2 text-[9.5px] font-bold uppercase tracking-wide text-slate-400">
            ආයුබෝවන් · සියලු මෘදුකාංග
          </div>
          <div className="grid gap-0.5 p-2">
            {WIN_APPS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => open(a.id)}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left transition hover:bg-slate-100"
              >
                <span
                  className="grid h-5 w-5 shrink-0 place-items-center rounded text-[10px] font-bold text-white"
                  style={{ backgroundColor: a.color }}
                >
                  {a.badge}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[11.5px] font-semibold leading-tight text-slate-700">
                    {a.label}
                  </span>
                  <span className="block truncate text-[9px] leading-tight text-slate-400">{a.sub}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="border-t border-slate-200 px-3 py-1.5 text-[9px] text-slate-400">
            O/L තොරතුරු තාක්ෂණ පුහුණු වැඩතලය
          </div>
        </div>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 flex h-[46px] items-center gap-1.5 border-t border-white/15 bg-[#0a1b2e]/85 px-2 backdrop-blur">
        <button
          type="button"
          onClick={() => setStart((v) => !v)}
          aria-label="ආරම්භක මෙනුව"
          className={`grid h-8 w-8 shrink-0 place-items-center rounded transition hover:bg-white/15 ${
            start ? 'bg-white/20' : ''
          }`}
        >
          <span className="grid grid-cols-2 gap-[2px]">
            <span className="h-[6px] w-[6px] rounded-[1px] bg-[#4aa3f0]" />
            <span className="h-[6px] w-[6px] rounded-[1px] bg-[#7bc86c]" />
            <span className="h-[6px] w-[6px] rounded-[1px] bg-[#f2c14e]" />
            <span className="h-[6px] w-[6px] rounded-[1px] bg-[#e8664a]" />
          </span>
        </button>
        <div className="hidden h-7 w-40 items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 text-[10px] leading-none text-white/60 sm:flex">
          <span aria-hidden="true">🔍</span> මෙහි සොයන්න
        </div>
        <div className="mx-auto flex items-center gap-1">
          {WIN_APPS.map((a) => {
            const active = app === a.id && state !== 'min'
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => (app === a.id ? setState((s) => (s === 'min' ? 'open' : 'min')) : open(a.id))}
                title={a.label}
                className={`relative grid h-8 w-9 place-items-center rounded transition hover:bg-white/15 ${
                  active ? 'bg-white/20' : ''
                }`}
              >
                <span
                  className="grid h-[18px] w-[18px] place-items-center rounded text-[9px] font-black leading-none text-white"
                  style={{ backgroundColor: a.color }}
                >
                  {a.badge}
                </span>
                <span
                  className={`absolute bottom-[2px] h-[2px] w-4 rounded-full ${active ? 'bg-sky-300' : 'bg-white/30'}`}
                />
              </button>
            )
          })}
        </div>
        <div className="ml-auto hidden shrink-0 items-center gap-2 pr-1 text-[9px] leading-tight text-white/85 sm:flex">
          <span aria-hidden="true">🔊</span>
          <span aria-hidden="true">🌐</span>
          <span className="text-right">
            <span className="block">{now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="block text-white/60">{now.toLocaleDateString('en-GB')}</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export function WinWindow({ children }) {
  return <div className="flex h-full min-h-0 w-full flex-col bg-white">{children}</div>
}

export function TitleBar({ badge, color, file, app, saving }) {
  const win = useWin()
  return (
    <div className="flex h-[30px] shrink-0 select-none items-center gap-1.5 border-b border-slate-300 bg-[#f3f3f3] pl-2">
      <span
        className="grid h-[15px] w-[15px] shrink-0 place-items-center rounded-[2px] text-[9px] font-black leading-none text-white"
        style={{ backgroundColor: color }}
      >
        {badge}
      </span>
      <span className="truncate text-[11px] font-semibold leading-none text-slate-700">{file}</span>
      <span className="hidden shrink-0 truncate text-[9px] leading-none text-slate-400 sm:inline">— {app}</span>
      {saving ? (
        <span
          className={`shrink-0 text-[8.5px] leading-none ${
            saving === 'සුරකිමින්…' ? 'text-amber-600' : 'text-slate-400'
          }`}
        >
          {saving}
        </span>
      ) : null}
      {win ? (
        <span className="ml-auto flex h-full shrink-0">
          <button
            type="button"
            onClick={win.minimize}
            aria-label="අවම කරන්න"
            className="grid w-9 place-items-center text-[11px] leading-none text-slate-500 transition hover:bg-slate-300/70"
          >
            —
          </button>
          <button
            type="button"
            onClick={win.maximize}
            aria-label="විශාල කරන්න"
            className="grid w-9 place-items-center text-[10px] leading-none text-slate-500 transition hover:bg-slate-300/70"
          >
            ▢
          </button>
          <button
            type="button"
            onClick={win.close}
            aria-label="වසන්න"
            className="grid w-9 place-items-center text-[10px] leading-none text-slate-500 transition hover:bg-[#e81123] hover:text-white"
          >
            ✕
          </button>
        </span>
      ) : null}
    </div>
  )
}

export function RibbonTabs({ tabs, active, onChange, hint }) {
  return (
    <div className="win-ribbon flex shrink-0 items-end gap-0.5 overflow-x-auto border-b border-slate-300 bg-[#f3f3f3] px-1.5 pt-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`shrink-0 rounded-t-md border px-2.5 py-[3px] text-[10.5px] font-semibold leading-tight transition ${
            active === t.id
              ? 'border-slate-300 border-b-white bg-white text-slate-800'
              : 'border-transparent text-slate-500 hover:bg-slate-200/70'
          }`}
        >
          {t.label}
        </button>
      ))}
      {hint ? <span className="ml-auto hidden shrink-0 pr-1 text-[8.5px] leading-none text-slate-400 sm:block">{hint}</span> : null}
    </div>
  )
}

export function RibbonBar({ children }) {
  return (
    <div
      className="win-ribbon flex shrink-0 items-stretch overflow-x-auto border-b border-slate-300 bg-[#fbfbfc] px-1 py-1"
      style={{ minHeight: 58 }}
    >
      {children}
    </div>
  )
}

export function RibbonGroup({ label, children }) {
  return (
    <div className="flex shrink-0 flex-col justify-between border-r border-slate-200 px-1.5 last:border-r-0">
      <div className="flex items-center gap-0.5">{children}</div>
      <div className="pt-0.5 text-center text-[7.5px] leading-none text-slate-400">{label}</div>
    </div>
  )
}

export function RBtn({ icon, label, active, disabled, onClick, title, className = '' }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      title={title ?? label ?? icon}
      className={`flex shrink-0 flex-col items-center justify-center gap-0.5 rounded px-1.5 py-1 leading-none transition ${
        active ? 'bg-sky-100 text-sky-900 ring-1 ring-inset ring-sky-300' : 'text-slate-600 hover:bg-slate-200/70'
      } disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      <span className="text-[12px] leading-none">{icon}</span>
      {label ? <span className="max-w-[58px] truncate text-[8px] leading-none">{label}</span> : null}
    </button>
  )
}

export function RSelect({ value, onChange, options, label, className = '' }) {
  return (
    <span className="flex shrink-0 flex-col items-center gap-0.5">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`rounded border border-slate-300 bg-white px-1 py-[1px] text-[9.5px] leading-tight text-slate-700 outline-none focus:border-sky-400 ${className}`}
      >
        {options.map((o) => (
          <option key={String(o.value ?? o)} value={o.value ?? o}>
            {o.label ?? o}
          </option>
        ))}
      </select>
      {label ? <span className="text-[7.5px] leading-none text-slate-400">{label}</span> : null}
    </span>
  )
}

export function StatusBar({ left, center, right }) {
  return (
    <div className="flex h-[21px] shrink-0 items-center gap-2 overflow-hidden border-t border-slate-300 bg-[#f3f3f3] px-2 text-[9px] leading-none text-slate-600">
      <span className="shrink-0 truncate">{left}</span>
      <span className="ml-auto shrink-0 truncate">{center}</span>
      {right ? <span className="shrink-0 truncate">{right}</span> : null}
    </div>
  )
}
