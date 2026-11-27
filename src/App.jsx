import { useEffect, useMemo, useState } from 'react'
import { GRADES } from './data/lessonsData.js'
import { UnitWorkspace } from './components/Workspace.jsx'
import { PracticePage } from './components/PracticePage.jsx'

const STORAGE_KEY = 'ol-si-sinhala-progress-v1'

const SUBJECTS = [
  { id: 'math', label: 'ගණිතය', icon: '📐' },
  { id: 'science', label: 'විද්‍යාව', icon: '🔬' },
  { id: 'ict', label: 'තොරතුරු තාක්ෂණය', icon: '💻' },
]

const readRoute = () =>
  typeof window !== 'undefined' && window.location.hash.startsWith('#/practice') ? 'practice' : 'lessons'

function loadProgress() {
  const base = { grade: 'g9', subject: 'math', unitId: null, labs: {}, quizzes: {} }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return base
    const saved = JSON.parse(raw)
    return {
      ...base,
      ...saved,
      labs: saved.labs ?? {},
      quizzes: saved.quizzes ?? {},
    }
  } catch {
    return base
  }
}

export default function App() {
  const [progress, setProgress] = useState(loadProgress)
  const [route, setRoute] = useState(readRoute)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {
      /* ගබඩාව ලබා ගත නොහැකි වුවත් යෙදුම දිගටම ක්‍රියා කරයි */
    }
  }, [progress])

  useEffect(() => {
    const onHash = () => setRoute(readRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const grade = GRADES.find((g) => g.id === progress.grade) ?? GRADES[0]
  const subjectId = SUBJECTS.some((s) => s.id === progress.subject) ? progress.subject : 'math'
  const units = grade.subjects[subjectId].units
  const unit = units.find((u) => u.id === progress.unitId) ?? units[0]

  const gradeStats = useMemo(() => {
    const all = Object.values(grade.subjects).flatMap((s) => s.units)
    const simUnits = all.filter((u) => u.hasSimulation)
    const simTotal = simUnits.length
    const labs = simUnits.filter((u) => progress.labs[u.id]).length
    const quizzed = all.filter((u) => progress.quizzes[u.id])
    const avg = quizzed.length
      ? Math.round(
          (quizzed.reduce((s, u) => s + progress.quizzes[u.id].score / progress.quizzes[u.id].total, 0) /
            quizzed.length) *
            100,
        )
      : null
    return { total: all.length, simTotal, labs, avg }
  }, [grade, progress.labs, progress.quizzes])

  const openPractice = () => {
    if (typeof window !== 'undefined') window.location.hash = '#/practice'
    setRoute('practice')
    window.scrollTo({ top: 0 })
  }

  const backToLessons = () => {
    if (typeof window !== 'undefined') window.location.hash = ''
    setRoute('lessons')
    window.scrollTo({ top: 0 })
  }

  const selectGrade = (id) => {
    const g = GRADES.find((x) => x.id === id)
    const nextUnits = g.subjects[subjectId].units
    const remembered = progress.unitId && nextUnits.find((u) => u.id === progress.unitId)
    setProgress((p) => ({ ...p, grade: id, unitId: remembered ? progress.unitId : nextUnits[0].id }))
  }

  const selectSubject = (id) => {
    const nextUnits = grade.subjects[id].units
    setProgress((p) => ({ ...p, subject: id, unitId: nextUnits[0].id }))
  }

  const toggleLab = (unitId) =>
    setProgress((p) => {
      const labs = { ...p.labs }
      if (labs[unitId]) delete labs[unitId]
      else labs[unitId] = true
      return { ...p, labs }
    })

  const saveQuiz = (unitId, score, total) =>
    setProgress((p) => {
      const prev = p.quizzes[unitId]
      if (prev && prev.score >= score && prev.total === total) return p
      return { ...p, quizzes: { ...p.quizzes, [unitId]: { score, total } } }
    })

  if (route === 'practice') return <PracticePage onBack={backToLessons} />

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-3xl px-3 pb-2 pt-2 lg:max-w-[1180px] lg:px-6 lg:pb-3 lg:pt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-leaf-600 text-[15px] font-extrabold text-white">
                ∑
              </span>
              <div>
                <h1 className="text-[15px] font-extrabold leading-tight">ගණිතය · විද්‍යාව · ICT</h1>
                <p className="text-[10.5px] leading-tight text-slate-500">O/L සූදානම · 9, 10, 11 ශ්‍රේණි</p>
              </div>
            </div>
            <div className="rounded-xl bg-leaf-50 px-2.5 py-1 text-right">
              <div className="text-[10px] leading-tight text-leaf-700">ප්‍රයෝග සම්පූර්ණයි</div>
              <div className="text-[12px] font-bold leading-tight text-leaf-700">
                {gradeStats.labs}/{gradeStats.simTotal}
              </div>
            </div>
          </div>

          <div role="tablist" aria-label="ශ්‍රේණිය තෝරන්න" className="mt-2 grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 lg:mt-3 lg:max-w-sm">
            {GRADES.map((g) => (
              <button
                key={g.id}
                role="tab"
                type="button"
                aria-selected={g.id === grade.id}
                onClick={() => selectGrade(g.id)}
                className={`rounded-lg px-2 py-2 text-[12.5px] font-bold transition sm:text-[13.5px] ${
                  g.id === grade.id ? 'bg-white text-leaf-700 shadow-sm' : 'text-slate-500 hover:text-ink'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={openPractice}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-leaf-600 px-3 py-2 text-[12.5px] font-bold text-white shadow-sm transition hover:brightness-105 lg:mt-3 lg:w-auto lg:px-4"
          >
            <span aria-hidden="true">🖥️</span>
            ප්‍රායෝගික පිටුව — Windows Apps & සජීවී HTML
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-3 pb-16 pt-3 lg:grid lg:max-w-[1180px] lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start lg:gap-5 lg:px-6 lg:pb-10 lg:pt-5">
        <div className="space-y-3">
        <section className="card p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip bg-leaf-600 text-white">{grade.label}</span>
            <span className="chip bg-slate-100 text-slate-600">{grade.focus}</span>
          </div>
          <p className="mt-2 text-[12.5px] leading-relaxed text-slate-600">{grade.blurb}</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-slate-50 px-2.5 py-2">
              <div className="text-[10.5px] text-slate-500">පාඩම්</div>
              <div className="text-[15px] font-bold">{gradeStats.total}</div>
            </div>
            <div className="rounded-xl bg-slate-50 px-2.5 py-2">
              <div className="text-[10.5px] text-slate-500">ප්‍රයෝග සම්පූර්ණයි</div>
              <div className="text-[15px] font-bold">
                {gradeStats.labs}/{gradeStats.simTotal}
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 px-2.5 py-2">
              <div className="text-[10.5px] text-slate-500">ප්‍රශ්නාවලිය සාමාන්‍යය</div>
              <div className="text-[15px] font-bold">{gradeStats.avg === null ? '—' : `${gradeStats.avg}%`}</div>
            </div>
          </div>
        </section>

        <section className="card p-3">
          <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">විෂය තෝරන්න</div>
          <div className="mt-1.5 grid grid-cols-3 gap-1.5">
            {SUBJECTS.map((s) => {
              const on = s.id === subjectId
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => selectSubject(s.id)}
                  aria-pressed={on}
                  className={`flex flex-col items-center justify-center gap-0.5 rounded-xl border px-1 py-2 text-center text-[11.5px] font-bold leading-tight transition sm:flex-row sm:gap-2 sm:text-[13px] ${
                    on
                      ? 'border-leaf-500 bg-leaf-50 text-leaf-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span aria-hidden="true">{s.icon}</span>
                  {s.label}
                </button>
              )
            })}
          </div>

          <div className="mt-3 text-[11px] font-bold uppercase tracking-wide text-slate-500">පාඩම තෝරන්න</div>
          <div className="mt-1.5 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
            {units.map((u) => {
              const on = u.id === unit.id
              const lab = progress.labs[u.id]
              const q = progress.quizzes[u.id]
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setProgress((p) => ({ ...p, unitId: u.id }))}
                  aria-current={on ? 'true' : undefined}
                  className={`rounded-xl border px-3 py-2 text-left transition ${
                    on ? 'border-leaf-500 bg-leaf-50/60' : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className={`text-[13px] font-bold leading-snug ${on ? 'text-leaf-700' : 'text-ink'}`}>{u.title}</div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="truncate">{u.subtitle}</span>
                  </div>
                  <div className="mt-1 flex gap-1">
                    {lab ? <span className="chip bg-emerald-50 px-1.5 py-0 text-[10px] text-emerald-700">ප්‍රයෝග ✓</span> : null}
                    {q ? (
                      <span className="chip bg-sky-50 px-1.5 py-0 text-[10px] text-sky-700">
                        {q.score}/{q.total}
                      </span>
                    ) : null}
                    {u.practice ? (
                      <span className="chip bg-violet-50 px-1.5 py-0 text-[10px] text-violet-700">ප්‍රායෝගික</span>
                    ) : null}
                  </div>
                </button>
              )
            })}
          </div>
        </section>
        </div>

        <div className="mt-3 space-y-3 lg:mt-0">
        <UnitWorkspace
          key={unit.id}
          unit={unit}
          labDone={Boolean(progress.labs[unit.id])}
          bestScore={progress.quizzes[unit.id]}
          onToggleLab={() => toggleLab(unit.id)}
          onSaveQuiz={(score, total) => saveQuiz(unit.id, score, total)}
          onOpenPractice={openPractice}
        />

        <p className="px-2 pt-2 text-center text-[11px] leading-relaxed text-slate-400">
          සියලු ප්‍රගතිය මෙම උපාංගයේම සුරකිනු ලැබේ. අන්තර්ජාලය නොමැතිව ද භාවිත කළ හැක.
        </p>
        </div>
      </main>
    </div>
  )
}
