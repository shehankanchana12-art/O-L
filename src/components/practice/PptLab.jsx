import { useEffect, useRef, useState } from 'react'
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

const KEY = 'ol-practice-ppt-v1'

const THEMES = [
  { id: 'leaf', name: 'Green', accent: '#0f9d63', title: '#0a6340', bg: '#ffffff' },
  { id: 'ocean', name: 'Blue', accent: '#2563eb', title: '#1e3a8a', bg: '#f8fbff' },
  { id: 'sunset', name: 'Sunset', accent: '#ea580c', title: '#9a3412', bg: '#fffaf5' },
  { id: 'slate', name: 'Slate', accent: '#475569', title: '#1e293b', bg: '#f8fafc' },
]

const LAYOUTS = [
  { value: 'title', label: 'Title Slide' },
  { value: 'content', label: 'Title and Content' },
  { value: 'section', label: 'Section Header' },
]

const DEFAULT = {
  theme: 'leaf',
  active: 0,
  slides: [
    {
      id: 1,
      layout: 'title',
      title: 'මගේ පාසල',
      subtitle: '10 ශ්‍රේණිය — තොරතුරු තාක්ෂණය',
      bullets: [],
      notes: 'ආයුබෝවන් කියා ඉදිරිපත් කිරීම ආරම්භ කරන්න.',
    },
    {
      id: 2,
      layout: 'content',
      title: 'පාසලේ විෂයයන්',
      subtitle: '',
      bullets: ['ගණිතය', 'විද්‍යාව', 'තොරතුරු තාක්ෂණය'],
      notes: 'විෂයයන් තුන ගැන කෙටියෙන් කතා කරන්න.',
    },
    {
      id: 3,
      layout: 'content',
      title: 'ස්තූතියි',
      subtitle: '',
      bullets: ['ප්‍රශ්න ඇසීමට කාලය'],
      notes: '',
    },
  ],
}

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'insert', label: 'Insert' },
  { id: 'design', label: 'Design' },
  { id: 'show', label: 'Slide Show' },
]

function Thumb({ slide, theme }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-sm border border-slate-300 shadow-sm"
      style={{ aspectRatio: '16 / 9', backgroundColor: theme.bg }}
    >
      <div className="absolute inset-x-0 top-0 h-[2px]" style={{ backgroundColor: theme.accent }} />
      <div className={`flex h-full flex-col px-1.5 ${slide.layout === 'title' ? 'justify-center text-center' : 'justify-start pt-2'}`}>
        <div className="truncate text-[6.5px] font-bold leading-tight" style={{ color: theme.title }}>
          {slide.title || 'Click to add title'}
        </div>
        {slide.layout === 'title' ? (
          <div className="truncate text-[4.5px] leading-tight text-slate-400">{slide.subtitle}</div>
        ) : (
          <div className="mt-0.5 space-y-[1px]">
            {(slide.bullets || []).slice(0, 3).map((b, i) => (
              <div key={i} className="truncate text-[4.5px] leading-tight text-slate-500">
                • {b}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ShowSlide({ slide, theme }) {
  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden"
      style={{ backgroundColor: theme.bg }}
    >
      <div className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: theme.accent }} />
      {slide.layout === 'title' ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
          <div className="text-[clamp(16px,3.4vw,30px)] font-extrabold leading-tight" style={{ color: theme.title }}>
            {slide.title}
          </div>
          {slide.subtitle ? (
            <div className="text-[clamp(8px,1.5vw,13px)]" style={{ color: theme.accent }}>
              {slide.subtitle}
            </div>
          ) : null}
        </div>
      ) : slide.layout === 'section' ? (
        <div className="flex h-full flex-col items-center justify-center px-8 text-center">
          <div className="text-[clamp(14px,2.8vw,24px)] font-bold" style={{ color: theme.title }}>
            {slide.title}
          </div>
          <div className="mt-2 h-1 w-12" style={{ backgroundColor: theme.accent }} />
        </div>
      ) : (
        <div className="flex h-full flex-col px-[7%] py-[6%]">
          <div className="text-[clamp(12px,2.4vw,21px)] font-extrabold leading-tight" style={{ color: theme.title }}>
            {slide.title}
          </div>
          <div className="mt-2 h-[3px] w-10" style={{ backgroundColor: theme.accent }} />
          <div className="mt-3 space-y-1.5">
            {(slide.bullets || []).map((b, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: theme.accent }} />
                <span className="text-[clamp(8px,1.5vw,13px)] leading-snug text-slate-700">{b}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function PptLab() {
  const [deck, setDeck] = useStored(KEY, DEFAULT)
  const slides = Array.isArray(deck.slides) && deck.slides.length ? deck.slides : DEFAULT.slides
  const active = Math.min(Math.max(0, Number(deck.active) || 0), slides.length - 1)
  const slide = slides[active]
  const theme = THEMES.find((t) => t.id === deck.theme) || THEMES[0]

  const [tab, setTab] = useState('home')
  const [presenting, setPresenting] = useState(false)
  const [presentIdx, setPresentIdx] = useState(0)
  const [showNotes, setShowNotes] = useState(true)
  const bulletRefs = useRef([])

  useEffect(() => {
    if (!presenting) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setPresenting(false)
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        setPresentIdx((i) => Math.min(slides.length - 1, i + 1))
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setPresentIdx((i) => Math.max(0, i - 1))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [presenting, slides.length])

  const patchDeck = (patch) => setDeck((d) => ({ ...d, ...patch }))

  const patchSlide = (patch, idx = active) =>
    setDeck((d) => {
      const list = (Array.isArray(d.slides) && d.slides.length ? d.slides : DEFAULT.slides).slice()
      list[idx] = { ...list[idx], ...patch }
      return { ...d, slides: list, active: idx }
    })

  const addSlide = () =>
    setDeck((d) => {
      const list = (Array.isArray(d.slides) && d.slides.length ? d.slides : DEFAULT.slides).slice()
      list.push({
        id: Date.now(),
        layout: 'content',
        title: 'New Slide',
        subtitle: '',
        bullets: ['First bullet point'],
        notes: '',
      })
      return { ...d, slides: list, active: list.length - 1 }
    })

  const duplicateSlide = () =>
    setDeck((d) => {
      const list = (Array.isArray(d.slides) && d.slides.length ? d.slides : DEFAULT.slides).slice()
      const copy = { ...list[active], id: Date.now() }
      list.splice(active + 1, 0, copy)
      return { ...d, slides: list, active: active + 1 }
    })

  const removeSlide = () =>
    setDeck((d) => {
      const list = (Array.isArray(d.slides) && d.slides.length ? d.slides : DEFAULT.slides).slice()
      if (list.length < 2) return d
      list.splice(active, 1)
      return { ...d, slides: list, active: Math.max(0, active - 1) }
    })

  const bullets = Array.isArray(slide.bullets) ? slide.bullets : []

  const setBullet = (i, value) => {
    const next = [...bullets]
    next[i] = value
    patchSlide({ bullets: next })
  }

  const addBullet = (i) => {
    const next = [...bullets]
    next.splice(i + 1, 0, '')
    patchSlide({ bullets: next })
    window.setTimeout(() => bulletRefs.current[i + 1]?.focus(), 0)
  }

  const removeBullet = (i) => {
    const next = bullets.filter((_, idx) => idx !== i)
    patchSlide({ bullets: next })
    window.setTimeout(() => bulletRefs.current[Math.max(0, i - 1)]?.focus(), 0)
  }

  const startShow = (from) => {
    setPresentIdx(from ? active : 0)
    setPresenting(true)
  }

  useEffect(() => {
    if (presenting) return undefined
    const onKey = (e) => {
      if (e.key !== 'F5') return
      e.preventDefault()
      setPresentIdx(e.shiftKey ? active : 0)
      setPresenting(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [presenting, active])

  return (
    <WinWindow>
      <TitleBar badge="P" color="#c43e1c" file="මගේ පාසල.pptx" app="PowerPoint" saving="Saved" />
      <RibbonTabs tabs={TABS} active={tab} onChange={setTab} hint="F5 = start slide show" />
      <RibbonBar>
        {tab === 'home' ? (
          <>
            <RibbonGroup label="Slides">
              <RBtn icon="＋" label="New Slide" onClick={addSlide} title="Ctrl + M" />
              <RBtn icon="⧉" label="Duplicate" onClick={duplicateSlide} />
              <RBtn icon="🗑" label="Delete" onClick={removeSlide} />
            </RibbonGroup>
            <RibbonGroup label="Layout">
              <RSelect
                value={slide.layout}
                onChange={(v) => patchSlide({ layout: v })}
                options={LAYOUTS}
                label="Layout"
              />
            </RibbonGroup>
            <RibbonGroup label="Themes">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => patchDeck({ theme: t.id })}
                  aria-label={t.name}
                  title={t.name}
                  className={`grid h-6 w-6 place-items-center rounded border ${
                    deck.theme === t.id ? 'border-slate-500 ring-1 ring-slate-400' : 'border-slate-300'
                  }`}
                  style={{ backgroundColor: t.accent }}
                >
                  {deck.theme === t.id ? <span className="text-[10px] leading-none text-white">✓</span> : null}
                </button>
              ))}
            </RibbonGroup>
            <RibbonGroup label="Text">
              <RBtn icon="•" label="Bullet" onClick={() => addBullet(bullets.length - 1)} />
              <RBtn icon="🗒" label="Notes" active={showNotes} onClick={() => setShowNotes((v) => !v)} />
            </RibbonGroup>
          </>
        ) : null}

        {tab === 'insert' ? (
          <>
            <RibbonGroup label="Text">
              <RBtn icon="T" label="Text Box" onClick={() => addBullet(bullets.length - 1)} />
              <RBtn icon="•" label="Bullet" onClick={() => addBullet(bullets.length - 1)} />
            </RibbonGroup>
            <RibbonGroup label="Objects">
              <RBtn
                icon="🖼"
                label="Pictures"
                onClick={() => patchSlide({ bullets: [...bullets, 'Picture placeholder (Insert → Pictures)'] })}
              />
              <RBtn icon="▦" label="Table" onClick={() => patchSlide({ bullets: [...bullets, 'Insert a table'] })} />
            </RibbonGroup>
            <RibbonGroup label="Notes">
              <RBtn icon="🗒" label="Notes" active={showNotes} onClick={() => setShowNotes((v) => !v)} />
            </RibbonGroup>
          </>
        ) : null}

        {tab === 'design' ? (
          <>
            <RibbonGroup label="Themes">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => patchDeck({ theme: t.id })}
                  className={`flex shrink-0 flex-col items-center gap-0.5 rounded border px-1.5 py-1 ${
                    deck.theme === t.id ? 'border-slate-500 bg-slate-100' : 'border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="h-3 w-8 rounded-sm" style={{ backgroundColor: t.accent }} />
                  <span className="text-[8px] leading-none text-slate-500">{t.name}</span>
                </button>
              ))}
            </RibbonGroup>
            <RibbonGroup label="Layout">
              <RSelect
                value={slide.layout}
                onChange={(v) => patchSlide({ layout: v })}
                options={LAYOUTS}
                label="Layout"
              />
            </RibbonGroup>
          </>
        ) : null}

        {tab === 'show' ? (
          <>
            <RibbonGroup label="Start Slide Show">
              <RBtn icon="▶" label="From Beginning" onClick={() => startShow(false)} title="F5" />
              <RBtn icon="▶|" label="From Current Slide" onClick={() => startShow(true)} title="Shift + F5" />
              <RBtn icon="🗒" label="Notes" active={showNotes} onClick={() => setShowNotes((v) => !v)} />
            </RibbonGroup>
          </>
        ) : null}
      </RibbonBar>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="win-scroll hidden w-[106px] shrink-0 space-y-1.5 overflow-y-auto border-r border-slate-300 bg-[#f3f3f3] p-1.5 sm:block">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => patchDeck({ active: i })}
              className={`flex w-full items-start gap-1 rounded p-0.5 text-left ${
                i === active ? 'bg-white ring-1 ring-[#c43e1c]' : 'hover:bg-white/70'
              }`}
            >
              <span className="w-3 shrink-0 pt-0.5 text-right text-[8px] leading-none text-slate-400">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <Thumb slide={s} theme={theme} />
              </span>
            </button>
          ))}
          <button
            type="button"
            onClick={addSlide}
            className="w-full rounded border border-dashed border-slate-300 py-1 text-[10px] leading-none text-slate-400 hover:bg-white"
          >
            ＋ Slide
          </button>
        </div>

        <div className="win-scroll min-w-0 flex-1 overflow-y-auto bg-[#e9ebef] p-2">
          <div className="mx-auto w-full max-w-[560px]">
            <div
              className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-white shadow-[0_2px_10px_rgba(15,23,42,.2)] ring-1 ring-slate-300"
              style={{ backgroundColor: theme.bg }}
            >
              <div className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: theme.accent }} />

              {slide.layout === 'title' ? (
                <div className="flex h-full flex-col items-center justify-center gap-1 px-[8%] text-center">
                  <input
                    value={slide.title}
                    onChange={(e) => patchSlide({ title: e.target.value })}
                    aria-label="Slide title"
                    className="w-full bg-transparent text-center text-[clamp(14px,2.6vw,22px)] font-extrabold leading-tight outline-none"
                    style={{ color: theme.title }}
                  />
                  <input
                    value={slide.subtitle || ''}
                    onChange={(e) => patchSlide({ subtitle: e.target.value })}
                    aria-label="Subtitle"
                    className="w-full bg-transparent text-center text-[clamp(8px,1.3vw,11px)] outline-none"
                    style={{ color: theme.accent }}
                  />
                </div>
              ) : slide.layout === 'section' ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 px-[8%] text-center">
                  <input
                    value={slide.title}
                    onChange={(e) => patchSlide({ title: e.target.value })}
                    aria-label="Section title"
                    className="w-full bg-transparent text-center text-[clamp(13px,2.2vw,19px)] font-bold outline-none"
                    style={{ color: theme.title }}
                  />
                  <span className="h-1 w-10" style={{ backgroundColor: theme.accent }} />
                  <input
                    value={slide.subtitle || ''}
                    onChange={(e) => patchSlide({ subtitle: e.target.value })}
                    aria-label="Section subtitle"
                    className="w-full bg-transparent text-center text-[10px] outline-none"
                    style={{ color: theme.accent }}
                  />
                </div>
              ) : (
                <div className="flex h-full flex-col px-[6%] py-[5%]">
                  <input
                    value={slide.title}
                    onChange={(e) => patchSlide({ title: e.target.value })}
                    aria-label="Slide title"
                    className="w-full bg-transparent text-[clamp(12px,2vw,18px)] font-extrabold leading-tight outline-none"
                    style={{ color: theme.title }}
                  />
                  <span className="mt-1 h-[3px] w-10 shrink-0" style={{ backgroundColor: theme.accent }} />
                  <div className="win-scroll mt-1.5 min-h-0 flex-1 space-y-1 overflow-y-auto">
                    {bullets.map((b, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span
                          className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: theme.accent }}
                        />
                        <input
                          ref={(el) => {
                            bulletRefs.current[i] = el
                          }}
                          value={b}
                          onChange={(e) => setBullet(i, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addBullet(i)
                            } else if (e.key === 'Backspace' && b === '' && bullets.length > 1) {
                              e.preventDefault()
                              removeBullet(i)
                            }
                          }}
                          aria-label={`Bullet ${i + 1}`}
                          className="min-w-0 flex-1 bg-transparent text-[clamp(8px,1.25vw,11px)] leading-snug text-slate-700 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeBullet(i)}
                          aria-label={`Remove bullet ${i + 1}`}
                          className="shrink-0 text-[8px] leading-none text-slate-300 hover:text-red-500"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addBullet(bullets.length - 1)}
                      className="text-[8.5px] leading-none text-slate-400 hover:text-slate-600"
                    >
                      + Bullet
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-2 flex items-center justify-between text-[9px] leading-none text-slate-500">
              <span>
                Slide {active + 1} of {slides.length}
              </span>
              <span>{LAYOUTS.find((l) => l.value === slide.layout)?.label}</span>
            </div>

            {showNotes ? (
              <div className="mt-1 rounded border border-slate-300 bg-white p-1.5">
                <div className="mb-0.5 text-[8.5px] font-bold uppercase tracking-wide text-slate-400">
                  Speaker Notes
                </div>
                <textarea
                  rows={2}
                  value={slide.notes || ''}
                  onChange={(e) => patchSlide({ notes: e.target.value })}
                  aria-label="Notes"
                  className="w-full resize-none rounded border border-slate-200 px-1.5 py-1 text-[10px] leading-snug outline-none focus:border-[#c43e1c]"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <StatusBar
        left={`Slide ${active + 1} of ${slides.length}`}
        center={`Theme: ${theme.name}`}
        right="F5 = start slide show"
      />

      {presenting ? (
        <div className="absolute inset-0 z-30 flex flex-col bg-black">
          <div className="flex shrink-0 items-center justify-between px-3 py-1.5 text-[10px] leading-none text-white/70">
            <span>
              {presentIdx + 1} / {slides.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPresentIdx((i) => Math.max(0, i - 1))}
                className="rounded px-2 py-0.5 hover:bg-white/20"
              >
                ‹ Previous
              </button>
              <button
                type="button"
                onClick={() => setPresentIdx((i) => Math.min(slides.length - 1, i + 1))}
                className="rounded px-2 py-0.5 hover:bg-white/20"
              >
                Next ›
              </button>
              <button
                type="button"
                onClick={() => setPresenting(false)}
                className="rounded bg-white/20 px-2 py-0.5 hover:bg-white/30"
              >
                Esc — End Show
              </button>
            </div>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center p-4">
            <div
              className="relative w-full max-w-[720px] overflow-hidden rounded bg-white shadow-2xl"
              style={{ aspectRatio: '16 / 9' }}
            >
              <ShowSlide slide={slides[presentIdx]} theme={theme} />
            </div>
          </div>
        </div>
      ) : null}
    </WinWindow>
  )
}
