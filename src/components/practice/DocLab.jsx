import { useEffect, useRef, useState } from 'react'
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

const KEY = 'ol-practice-doc-v2'

const DEFAULT_HTML =
  '<h1 style="text-align:center;color:#1d4ed8">මගේ පාසල</h1>' +
  '<p>මම ඉගෙනුම ලබන්නේ කොළඹ පිහිටි පාසලකය. මගේ ප්‍රියතම විෂය තොරතුරු තාක්ෂණයයි.</p>' +
  '<p>පාසලේ පුස්තකාලයේ මට අවශ්‍ය පොත් සොයා ගත හැක. එහි නිහඬව කියවීමට ඉඩ ඇත.</p>'

const DEFAULT_DOC = {
  html: DEFAULT_HTML,
  margins: 'normal',
  orientation: 'portrait',
  columns: 1,
  lineHeight: 1.8,
  ruler: true,
  header: true,
  footer: true,
  zoom: 100,
}

const TABS = [
  { id: 'home', label: 'මුල් පිටුව' },
  { id: 'insert', label: 'ඇතුළු කරන්න' },
  { id: 'layout', label: 'සැලසුම' },
  { id: 'view', label: 'දර්ශනය' },
]

const MARGINS = { normal: '7% 9%', narrow: '4% 5%', wide: '11% 14%' }

const FONTS = [
  { value: 'Noto Sans Sinhala', label: 'Noto Sinhala' },
  { value: 'Iskoola Pota', label: 'Iskoola' },
  { value: 'Nirmala UI', label: 'Nirmala UI' },
  { value: 'Times New Roman', label: 'Times' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Calibri', label: 'Calibri' },
]

const SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 22, 26, 32, 40].map((n) => ({ value: String(n), label: String(n) }))

const words = (text) => {
  const t = String(text || '').replace(/\s+/g, ' ').trim()
  return t ? t.split(' ').length : 0
}

function Ruler() {
  return (
    <div className="flex h-4 items-end justify-between rounded-sm border border-slate-300 bg-white px-1.5 pb-0.5 text-[7px] leading-none text-slate-400">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
        <span key={n} className="flex flex-col items-center gap-[2px]">
          <span className="h-[3px] w-px bg-slate-300" />
          <span>{n}</span>
        </span>
      ))}
    </div>
  )
}

export function DocLab() {
  const boot = useRef(null)
  if (boot.current === null) {
    let v = DEFAULT_DOC
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) v = { ...DEFAULT_DOC, ...JSON.parse(raw) }
    } catch {
      v = DEFAULT_DOC
    }
    if (typeof v.html !== 'string' || !v.html) v = { ...v, html: DEFAULT_HTML }
    boot.current = v
  }

  const [doc, setDoc] = useState(boot.current)
  const docRef = useRef(doc)
  docRef.current = doc

  const initialHtml = useRef(boot.current.html)
  const editorRef = useRef(null)
  const saveTimer = useRef(null)

  const [tab, setTab] = useState('home')
  const [saveState, setSaveState] = useState('සුරකින ලදී')
  const [fmt, setFmt] = useState({})
  const [fontSize, setFontSize] = useState(14)
  const [font, setFont] = useState('Noto Sans Sinhala')
  const [color, setColor] = useState('#1d4ed8')
  const [highlight, setHighlight] = useState('#fef08a')
  const [stats, setStats] = useState({ words: 0, chars: 0 })

  const persist = (next) => {
    const d = next ?? docRef.current
    try {
      localStorage.setItem(KEY, JSON.stringify(d))
    } catch {
      /* ගබඩාව නොමැති වුවත් යෙදුම ක්‍රියා කරයි */
    }
  }

  useEffect(() => {
    const el = editorRef.current
    if (!el) return
    const text = el.innerText || ''
    setStats({ words: words(text), chars: text.replace(/\s/g, '').length })
  }, [])

  useEffect(
    () => () => {
      window.clearTimeout(saveTimer.current)
      persist()
    },
    [],
  )

  useEffect(() => {
    const onSelection = () => {
      if (document.activeElement !== editorRef.current) return
      try {
        setFmt({
          bold: document.queryCommandState('bold'),
          italic: document.queryCommandState('italic'),
          underline: document.queryCommandState('underline'),
          strike: document.queryCommandState('strikeThrough'),
          ul: document.queryCommandState('insertUnorderedList'),
          ol: document.queryCommandState('insertOrderedList'),
          left: document.queryCommandState('justifyLeft'),
          center: document.queryCommandState('justifyCenter'),
          right: document.queryCommandState('justifyRight'),
          full: document.queryCommandState('justifyFull'),
        })
      } catch {
        /* සමහර බ්‍රවුසරවල queryCommandState නොගැලපේ */
      }
    }
    document.addEventListener('selectionchange', onSelection)
    return () => document.removeEventListener('selectionchange', onSelection)
  }, [])

  const refresh = () => {
    const el = editorRef.current
    if (!el) return
    docRef.current = { ...docRef.current, html: el.innerHTML }
    const text = el.innerText || ''
    setStats({ words: words(text), chars: text.replace(/\s/g, '').length })
    setSaveState('සුරකිමින්…')
    window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(() => {
      persist()
      setSaveState('සුරකින ලදී')
    }, 700)
  }

  const patch = (p) => {
    const next = { ...docRef.current, ...p }
    docRef.current = next
    persist(next)
    setDoc(next)
  }

  const saveNow = () => {
    const el = editorRef.current
    if (el) docRef.current = { ...docRef.current, html: el.innerHTML }
    persist()
    setSaveState('සුරකින ලදී')
  }

  const exec = (cmd, val = null) => {
    const el = editorRef.current
    if (!el) return
    el.focus()
    try {
      document.execCommand(cmd, false, val)
    } catch {
      /* සමහර විධාන සෑම බ්‍රවුසරයකම නොපවතී */
    }
    refresh()
  }

  const applySize = (px) => {
    setFontSize(Number(px))
    const el = editorRef.current
    if (!el) return
    el.focus()
    try {
      document.execCommand('fontSize', false, '7')
      el.querySelectorAll('font[size="7"]').forEach((node) => {
        const span = document.createElement('span')
        span.style.fontSize = `${px}px`
        span.innerHTML = node.innerHTML
        node.replaceWith(span)
      })
    } catch {
      /* නොගැලපේ නම් පෙළ එලෙසම තබන්න */
    }
    refresh()
  }

  const applyFont = (name) => {
    setFont(name)
    exec('fontName', name)
  }

  const applyColor = (value) => {
    setColor(value)
    exec('foreColor', value)
  }

  const applyHighlight = (value) => {
    setHighlight(value)
    const el = editorRef.current
    if (!el) return
    el.focus()
    try {
      document.execCommand('styleWithCSS', false, true)
      document.execCommand('hiliteColor', false, value)
    } catch {
      /* hiliteColor සියලු බ්‍රවුසරවල නොපවතී */
    }
    refresh()
  }

  const insertTable = () => {
    const cell = (text, head) =>
      `<${head ? 'th' : 'td'} style="border:1px solid #94a3b8;padding:4px 8px;${
        head ? 'background:#eff6ff;font-weight:700' : ''
      }">${text}</${head ? 'th' : 'td'}>`
    const head = `<tr>${cell('නම', true)}${cell('විෂය', true)}${cell('ලකුණු', true)}</tr>`
    const body = ['අමල්', 'නිමල්', 'කමල්']
      .map((n) => `<tr>${cell(n)}${cell('ගණිතය')}${cell('—')}</tr>`)
      .join('')
    exec('insertHTML', `<table style="border-collapse:collapse;width:100%;margin:6px 0">${head}${body}</table><p><br></p>`)
  }

  const insertImage = () =>
    exec(
      'insertHTML',
      '<div style="border:1px dashed #94a3b8;background:#f8fafc;padding:18px;text-align:center;color:#64748b;font-size:11px;margin:6px 0">රූපය — Insert → Pictures මගින් රූපයක් තෝරන්න</div><p><br></p>',
    )

  const insertLink = () =>
    exec('insertHTML', '<a href="https://www.google.com" target="_blank" rel="noreferrer">Google</a>&nbsp;')

  const insertDate = () => {
    const text = new Date().toLocaleDateString('si-LK', { year: 'numeric', month: 'long', day: 'numeric' })
    exec('insertText', text)
  }

  const pageWidth = doc.orientation === 'portrait' ? 470 : 620

  return (
    <WinWindow>
      <TitleBar badge="W" color="#2b579a" file="මගේ පාසල.docx" app="Word" saving={saveState} />
      <RibbonTabs tabs={TABS} active={tab} onChange={setTab} hint="Ctrl + B / I / U = අකුරු සැකසුම" />
      <RibbonBar>
        {tab === 'home' ? (
          <>
            <RibbonGroup label="සුරකින්න">
              <RBtn icon="💾" label="සුරකින්න" onClick={saveNow} title="Ctrl + S" />
              <RBtn icon="↶" label="අහෝසි" onClick={() => exec('undo')} title="Ctrl + Z" />
              <RBtn icon="↷" label="නැවත" onClick={() => exec('redo')} title="Ctrl + Y" />
            </RibbonGroup>
            <RibbonGroup label="ෆොන්ට්">
              <RSelect value={font} onChange={applyFont} options={FONTS} label="ෆොන්ට්" className="w-[76px]" />
              <RSelect value={String(fontSize)} onChange={applySize} options={SIZES} label="ප්‍රමාණය" className="w-[48px]" />
              <div className="grid grid-cols-4 gap-0.5">
                <RBtn icon="B" label="" active={fmt.bold} onClick={() => exec('bold')} className="font-bold" />
                <RBtn icon="I" active={fmt.italic} onClick={() => exec('italic')} className="font-serif italic" />
                <RBtn icon="U" active={fmt.underline} onClick={() => exec('underline')} className="underline" />
                <RBtn icon="S" active={fmt.strike} onClick={() => exec('strikeThrough')} className="line-through" />
              </div>
              <div className="flex items-center gap-0.5">
                <label className="flex shrink-0 flex-col items-center gap-0.5" title="අකුරු වර්ණය">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => applyColor(e.target.value)}
                    className="h-[17px] w-[21px] cursor-pointer rounded border border-slate-300 bg-white p-0"
                    aria-label="අකුරු වර්ණය"
                  />
                  <span className="text-[7px] leading-none text-slate-400">වර්ණය</span>
                </label>
                <label className="flex shrink-0 flex-col items-center gap-0.5" title="ඉස්මතු වර්ණය">
                  <input
                    type="color"
                    value={highlight}
                    onChange={(e) => applyHighlight(e.target.value)}
                    className="h-[17px] w-[21px] cursor-pointer rounded border border-slate-300 bg-white p-0"
                    aria-label="ඉස්මතු වර්ණය"
                  />
                  <span className="text-[7px] leading-none text-slate-400">ඉස්මතු</span>
                </label>
                <RBtn icon="A✕" label="ඉවත්" onClick={() => exec('removeFormat')} title="සැකසුම් ඉවත් කරන්න" />
              </div>
            </RibbonGroup>
            <RibbonGroup label="ඡේදය">
              <RBtn icon="•" active={fmt.ul} onClick={() => exec('insertUnorderedList')} title="බුලට් ලැයිස්තුව" />
              <RBtn icon="1." active={fmt.ol} onClick={() => exec('insertOrderedList')} title="අංකිත ලැයිස්තුව" />
              <RBtn icon="⇤" onClick={() => exec('justifyLeft')} active={fmt.left} title="වමට" />
              <RBtn icon="⇔" onClick={() => exec('justifyCenter')} active={fmt.center} title="මැදට" />
              <RBtn icon="⇥" onClick={() => exec('justifyRight')} active={fmt.right} title="දකුණට" />
              <RBtn icon="☰" onClick={() => exec('justifyFull')} active={fmt.full} title="දෙපසට" />
            </RibbonGroup>
            <RibbonGroup label="පරතරය">
              <RSelect
                value={String(doc.lineHeight)}
                onChange={(v) => patch({ lineHeight: Number(v) })}
                options={[
                  { value: '1', label: '1.0' },
                  { value: '1.5', label: '1.5' },
                  { value: '1.8', label: '1.8' },
                  { value: '2', label: '2.0' },
                ]}
                label="පේළි"
              />
              <RBtn icon="→|" label="ඉන්ඩෙන්ට්" onClick={() => exec('indent')} />
            </RibbonGroup>
            <RibbonGroup label="ශෛලීන්">
              <RBtn icon="H1" label="මාතෘකාව 1" onClick={() => exec('formatBlock', 'h1')} />
              <RBtn icon="H2" label="මාතෘකාව 2" onClick={() => exec('formatBlock', 'h2')} />
              <RBtn icon="¶" label="සාමාන්‍ය" onClick={() => exec('formatBlock', 'p')} />
            </RibbonGroup>
          </>
        ) : null}

        {tab === 'insert' ? (
          <>
            <RibbonGroup label="වගුව">
              <RBtn icon="▦" label="වගුව" onClick={insertTable} />
            </RibbonGroup>
            <RibbonGroup label="රූප හා සබැඳි">
              <RBtn icon="🖼" label="රූපය" onClick={insertImage} />
              <RBtn icon="🔗" label="සබැඳිය" onClick={insertLink} />
            </RibbonGroup>
            <RibbonGroup label="පිටුව">
              <RBtn
                icon="⤓"
                label="පිටු බිඳුම"
                onClick={() =>
                  exec('insertHTML', '<hr style="border:0;border-top:2px dashed #94a3b8;margin:14px 0" /><p><br></p>')
                }
              />
              <RBtn
                icon="#"
                label="පිටු අංකය"
                active={doc.footer}
                onClick={() => patch({ footer: !doc.footer })}
              />
              <RBtn icon="H" label="ශීර්ෂය" active={doc.header} onClick={() => patch({ header: !doc.header })} />
            </RibbonGroup>
            <RibbonGroup label="පෙළ">
              <RBtn icon="📅" label="දිනය" onClick={insertDate} />
              <RBtn icon="©" label="සංකේතය" onClick={() => exec('insertText', '©')} />
              <RBtn icon="—" label="රේඛාව" onClick={() => exec('insertHorizontalRule')} />
            </RibbonGroup>
          </>
        ) : null}

        {tab === 'layout' ? (
          <>
            <RibbonGroup label="පිටු සැකසුම">
              <RSelect
                value={doc.margins}
                onChange={(v) => patch({ margins: v })}
                options={[
                  { value: 'normal', label: 'සාමාන්‍ය' },
                  { value: 'narrow', label: 'පටු' },
                  { value: 'wide', label: 'පළල්' },
                ]}
                label="ආන්තික"
              />
              <RBtn
                icon="▯"
                label="සිරස්"
                active={doc.orientation === 'portrait'}
                onClick={() => patch({ orientation: 'portrait' })}
              />
              <RBtn
                icon="▭"
                label="තිරස්"
                active={doc.orientation === 'landscape'}
                onClick={() => patch({ orientation: 'landscape' })}
              />
            </RibbonGroup>
            <RibbonGroup label="තීරු">
              <RSelect
                value={String(doc.columns)}
                onChange={(v) => patch({ columns: Number(v) })}
                options={[
                  { value: '1', label: '1 තීරුව' },
                  { value: '2', label: '2 තීරු' },
                  { value: '3', label: '3 තීරු' },
                ]}
                label="තීරු ගණන"
              />
            </RibbonGroup>
            <RibbonGroup label="පිටු පසුබිම">
              <RBtn
                icon="▨"
                label="ජාල රේඛා"
                active={doc.gridlines}
                onClick={() => patch({ gridlines: !doc.gridlines })}
              />
            </RibbonGroup>
          </>
        ) : null}

        {tab === 'view' ? (
          <>
            <RibbonGroup label="පෙන්වීම">
              <RBtn icon="📏" label="මාපකය" active={doc.ruler} onClick={() => patch({ ruler: !doc.ruler })} />
              <RBtn icon="▦" label="ජාල රේඛා" active={doc.gridlines} onClick={() => patch({ gridlines: !doc.gridlines })} />
              <RBtn icon="H" label="ශීර්ෂය" active={doc.header} onClick={() => patch({ header: !doc.header })} />
            </RibbonGroup>
            <RibbonGroup label="විශාලනය">
              <RSelect
                value={String(doc.zoom)}
                onChange={(v) => patch({ zoom: Number(v) })}
                options={[
                  { value: '50', label: '50%' },
                  { value: '75', label: '75%' },
                  { value: '100', label: '100%' },
                  { value: '125', label: '125%' },
                  { value: '150', label: '150%' },
                ]}
                label="විශාලනය"
              />
              <RBtn icon="⤢" label="ගැලපෙන" onClick={() => patch({ zoom: 100 })} />
            </RibbonGroup>
            <RibbonGroup label="සුරකින්න">
              <RBtn icon="💾" label="සුරකින්න" onClick={saveNow} />
            </RibbonGroup>
          </>
        ) : null}
      </RibbonBar>

      <div className="win-scroll min-h-0 flex-1 overflow-auto bg-[#e7eaf0] p-2" style={{ minHeight: 300 }}>
        <div className="mx-auto w-full" style={{ maxWidth: pageWidth }}>
          {doc.ruler ? <Ruler /> : null}
          <div
            className="mx-auto mt-1 bg-white shadow-[0_1px_3px_rgba(15,23,42,.25),0_10px_24px_-12px_rgba(15,23,42,.45)]"
            style={{
              aspectRatio: doc.orientation === 'portrait' ? '210 / 297' : '297 / 210',
              padding: MARGINS[doc.margins] ?? MARGINS.normal,
              overflowY: 'auto',
              fontSize: `${13 * (doc.zoom / 100)}px`,
              backgroundImage: doc.gridlines ? 'linear-gradient(#eef2f7 1px, transparent 1px)' : undefined,
              backgroundSize: doc.gridlines ? '100% 24px' : undefined,
            }}
          >
            {doc.header ? (
              <div className="mb-2 border-b border-slate-200 pb-1 text-[0.72em] italic text-slate-400">
                මගේ පාසල — 10 ශ්‍රේණිය
              </div>
            ) : null}
            <div
              ref={editorRef}
              className="doc-body min-h-[160px] outline-none"
              contentEditable
              suppressContentEditableWarning
              spellCheck={false}
              onInput={refresh}
              style={{ lineHeight: doc.lineHeight, columnCount: doc.columns, columnGap: '1.6em' }}
              dangerouslySetInnerHTML={{ __html: initialHtml.current }}
            />
            {doc.footer ? (
              <div className="mt-2 border-t border-slate-200 pt-1 text-center text-[0.7em] text-slate-400">1</div>
            ) : null}
          </div>
        </div>
      </div>

      <StatusBar
        left="පිටුව 1 / 1"
        center={`වචන: ${stats.words} · අකුරු: ${stats.chars}`}
        right={
          <span className="flex items-center gap-1">
            <span className="hidden sm:inline">සිංහල (ශ්‍රී ලංකා)</span>
            <button type="button" onClick={() => patch({ zoom: Math.max(50, doc.zoom - 10) })} aria-label="කුඩා කරන්න">
              −
            </button>
            <span className="w-7 text-center">{doc.zoom}%</span>
            <button type="button" onClick={() => patch({ zoom: Math.min(150, doc.zoom + 10) })} aria-label="විශාල කරන්න">
              +
            </button>
          </span>
        }
      />
    </WinWindow>
  )
}
