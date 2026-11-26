import { useEffect, useState } from 'react'

export function Slider({ label, value, onChange, min, max, step = 1, unit = '' }) {
  // අතින් ටයිප් කරන අගය — අගුළු දමන තෙක් ටයිප් කරන පෙළ එලෙසම තබා ගනී
  const [text, setText] = useState(String(value))
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (!editing) setText(String(value))
  }, [value, editing])

  const applyTyped = (raw) => {
    const n = Number(raw)
    if (raw.trim() === '' || !Number.isFinite(n)) return
    // ස්ලයිඩරයේ සීමා නොසලකා ටයිප් කළ අගය එලෙසම යොදයි
    onChange(n)
  }

  return (
    <label className="block">
      <span className="flex items-center justify-between gap-2 text-[13px] font-semibold text-slate-600">
        <span className="min-w-0 leading-snug">{label}</span>
        <span className="flex shrink-0 items-center gap-1">
          <input
            type="text"
            inputMode="decimal"
            value={text}
            onChange={(e) => {
              const raw = e.target.value
              setText(raw)
              applyTyped(raw)
            }}
            onFocus={() => setEditing(true)}
            onBlur={() => {
              setEditing(false)
              setText(String(value))
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur()
            }}
            aria-label={`${label} — අගය ටයිප් කරන්න`}
            className="w-[4.75rem] rounded-lg border border-slate-300 bg-white px-1.5 py-1 text-right font-mono text-[12px] font-normal text-ink outline-none focus:border-leaf-500 focus:ring-2 focus:ring-leaf-100"
          />
          {unit.trim() ? <span className="font-mono text-[11px] font-normal text-slate-500">{unit.trim()}</span> : null}
        </span>
      </span>
      <input
        type="range"
        className="mt-2"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
    </label>
  )
}

export function SimFrame({ children, caption }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-2">
      <div className="mx-auto w-full max-w-sm lg:max-w-xl">{children}</div>
      {caption ? (
        <p className="mt-1 px-2 pb-1 text-center text-[11.5px] leading-relaxed text-slate-500">{caption}</p>
      ) : null}
    </div>
  )
}

export function Readout({ items }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {items.map((it) => (
        <div key={it.label} className="rounded-xl border border-slate-200 bg-white px-2.5 py-2">
          <div className="text-[11px] font-medium text-slate-500">{it.label}</div>
          <div className="font-mono text-[13.5px] font-bold text-ink">{it.value}</div>
        </div>
      ))}
    </div>
  )
}

export function ModeToggle({ options, value, onChange }) {
  return (
    <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`flex-1 rounded-lg px-2 py-1.5 text-[12.5px] font-semibold transition ${
            value === o.value ? 'bg-white text-ink shadow-sm' : 'text-slate-500 hover:text-ink'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
