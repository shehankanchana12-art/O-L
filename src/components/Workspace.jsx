import { useMemo, useState } from 'react'
import { SIMS } from './sims.jsx'
import { UnitDiagram } from './Diagrams.jsx'

const TABS = [
  { id: 'theory', label: 'සිද්ධාන්ත සහ කෙටි සටහන්', short: 'සිද්ධාන්ත', icon: '📘' },
  { id: 'lab', label: 'සජීවී අනුකරණ විද්‍යාගාරය', short: 'ප්‍රයෝගාගාරය', icon: '🧪' },
  { id: 'examples', label: 'පියවරෙන් පියවර උදාහරණ', short: 'උදාහරණ', icon: '✏️' },
  { id: 'quiz', label: 'පුහුණු ප්‍රශ්නාවලිය', short: 'ප්‍රශ්නාවලිය', icon: '🎯' },
]

function TabBar({ active, onChange }) {
  return (
    <div role="tablist" aria-label="පාඩම් කොටස්" className="grid grid-cols-2 gap-1.5 rounded-2xl bg-slate-100 p-1.5 sm:grid-cols-4">
      {TABS.map((t) => (
        <button
          key={t.id}
          role="tab"
          type="button"
          aria-selected={active === t.id}
          onClick={() => onChange(t.id)}
          className={`flex flex-col items-center justify-center gap-0.5 rounded-xl px-1.5 py-2 text-center text-[11px] font-semibold leading-snug transition sm:text-[12px] ${
            active === t.id ? 'bg-white text-leaf-700 shadow-sm' : 'text-slate-500 hover:text-ink'
          }`}
        >
          <span aria-hidden="true" className="text-base leading-none">
            {t.icon}
          </span>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  )
}

/* ------------------------------- Theory ------------------------------- */
function TheoryTab({ unit }) {
  return (
    <div className="space-y-3">
      {unit.diagram ? (
        <div className="card overflow-hidden p-2">
          <UnitDiagram kind={unit.diagram} />
        </div>
      ) : null}

      <section className="card border-l-4 border-leaf-500 p-4">
        <h3 className="text-[15.5px] font-bold text-ink">පාඩමේ අරමුණ</h3>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-700">{unit.objective}</p>
      </section>

      <div className="px-1 pt-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">
        මූලික සංකල්ප සහ නිර්වචන
      </div>

      {unit.theory.map((section, i) => (
        <section key={section.title} className="card p-4 sm:p-5">
          <h3 className="flex items-start gap-2 text-[15.5px] font-bold text-ink">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-leaf-50 text-[12px] font-bold text-leaf-700">
              {i + 1}
            </span>
            {section.title}
          </h3>
          {section.text.map((p, pi) => (
            <p key={pi} className="mt-2 text-[13.5px] leading-relaxed text-slate-700">
              {p}
            </p>
          ))}
          {section.formulas?.length ? (
            <div className="mt-3 rounded-xl border border-sky-100 bg-sky-50/70 px-3 py-2.5">
              <div className="text-[11px] font-bold uppercase tracking-wide text-sky-600">මතක තබා ගන්න</div>
              <div className="mt-1 space-y-1">
                {section.formulas.map((f) => (
                  <div key={f} className="font-mono text-[13px] font-semibold text-ink">
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {section.note ? (
            <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[12.5px] leading-relaxed text-amber-900">
              <span className="font-bold">විභාග ඉඟිය: </span>
              {section.note}
            </p>
          ) : null}
        </section>
      ))}

      {unit.laws?.length ? (
        <section className="card p-4">
          <h3 className="text-[15.5px] font-bold text-ink">සූත්‍ර, නියම සහ සබඳතා</h3>
          <div className="mt-2 space-y-2">
            {unit.laws.map((law) => (
              <div key={law.f} className="rounded-xl border border-sky-100 bg-sky-50/70 px-3 py-2">
                <div className="font-mono text-[13px] font-semibold text-ink">{law.f}</div>
                <div className="mt-0.5 text-[12px] leading-relaxed text-slate-600">{law.m}</div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {unit.examTips?.length ? (
        <section className="card p-4">
          <h3 className="text-[15.5px] font-bold text-ink">විභාග ඉඟි</h3>
          <ul className="mt-2 space-y-1.5">
            {unit.examTips.map((tip) => (
              <li key={tip} className="flex gap-2 text-[13px] leading-relaxed text-slate-700">
                <span aria-hidden="true">💡</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {unit.mistakes?.length ? (
        <section className="card p-4">
          <h3 className="text-[15.5px] font-bold text-ink">පොදු වැරදි</h3>
          <div className="mt-2 space-y-2">
            {unit.mistakes.map((m) => (
              <div key={m.w} className="rounded-xl border border-rose-100 bg-rose-50/50 px-3 py-2">
                <div className="text-[11.5px] font-bold text-rose-700">✕ වැරදි</div>
                <p className="text-[12.5px] leading-relaxed text-slate-700">{m.w}</p>
                <div className="mt-1.5 text-[11.5px] font-bold text-emerald-700">✓ නිවැරදි</div>
                <p className="text-[12.5px] leading-relaxed text-slate-700">{m.r}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

/* --------------------------------- Lab -------------------------------- */
function LabTab({ unit, done, onComplete }) {
  const [prediction, setPrediction] = useState(null)
  const [checked, setChecked] = useState([])
  const [takeawayAnswer, setTakeawayAnswer] = useState(null)
  const Sim = unit.sim ? SIMS[unit.sim.key] : null

  if (!unit.sim) {
    return (
      <div className="space-y-3">
        <section className="card p-4">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="text-lg">📘</span>
            <h3 className="text-[15px] font-bold">මෙම පාඩමට අනුකරණයක් අවශ්‍ය නොවේ</h3>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-slate-700">
            මෙම පාඩමේ සංකල්ප සිද්ධාන්ත, සූත්‍ර, උදාහරණ හා ප්‍රශ්නාවලිය හරහා සම්පූර්ණයෙන් ඉගෙන ගත හැක. ක්‍රියාවලියක් හෝ අත්හදා බැලීමක් නොමැති නිසා සජීවී අනුකරණයක් අවශ්‍ය නොවේ.
          </p>
        </section>
        <section className="card p-4">
          <h3 className="text-[14px] font-bold text-slate-700">මෙම පාඩමේ ආවරණය වන කරුණු</h3>
          <ul className="mt-2 space-y-1.5">
            {unit.topics.map((t) => (
              <li key={t} className="flex gap-2 text-[13px] leading-relaxed text-slate-700">
                <span className="text-leaf-600">✓</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 rounded-xl bg-leaf-50 px-3 py-2 text-[12.5px] leading-relaxed text-leaf-700">
            ඉගෙනීමේ පිළිවෙල: සිද්ධාන්ත සහ කෙටි සටහන් → පියවරෙන් පියවර උදාහරණ → පුහුණු ප්‍රශ්නාවලිය.
          </p>
        </section>
      </div>
    )
  }

  const { predict, takeaway } = unit.sim

  return (
    <div className="space-y-3">
      <div className="card p-4">
        <h3 className="text-[15px] font-bold">{unit.sim.title}</h3>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl bg-leaf-50 px-3 py-2">
            <div className="text-[11px] font-bold text-leaf-700">මෙම අනුකරණය උගන්වන සිද්ධාන්තය</div>
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-slate-700">{unit.sim.teaches}</p>
          </div>
          <div className="rounded-xl bg-sky-50 px-3 py-2">
            <div className="text-[11px] font-bold text-sky-600">ඔබ වෙනස් කරන විචල්‍යය</div>
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-slate-700">{unit.sim.variable}</p>
          </div>
        </div>
      </div>

      <div className="card p-3 sm:p-4">
        {Sim ? <Sim /> : <p className="p-4 text-sm text-slate-500">අනුකරණය තවම සම්බන්ධ කර නැත.</p>}
      </div>

      {/* Step 1 */}
      <section className="card p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-leaf-600 text-[12px] font-bold text-white">1</span>
          <h3 className="text-[14.5px] font-bold">පුරෝකථනය</h3>
        </div>
        <p className="mt-2 text-[13px] text-slate-700">{predict.q}</p>
        <div className="mt-2 space-y-1.5">
          {predict.options.map((opt, i) => {
            const chosen = prediction === i
            const answered = prediction !== null
            const isCorrect = i === predict.answer
            let cls = 'border-slate-200 bg-white hover:bg-slate-50'
            if (answered && isCorrect) cls = 'border-emerald-300 bg-emerald-50'
            else if (chosen) cls = 'border-rose-300 bg-rose-50'
            return (
              <button
                key={opt}
                type="button"
                disabled={answered}
                onClick={() => setPrediction(i)}
                className={`flex w-full items-start gap-2 rounded-xl border px-3 py-2 text-left text-[13px] transition ${cls}`}
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-300 text-[10.5px] font-bold text-slate-600">
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{opt}</span>
                {answered && isCorrect ? <span className="ml-auto text-emerald-600">✓</span> : null}
                {answered && chosen && !isCorrect ? <span className="ml-auto text-rose-500">✕</span> : null}
              </button>
            )
          })}
        </div>
        {prediction !== null ? (
          <p
            className={`mt-2 rounded-xl px-3 py-2 text-[12.5px] leading-relaxed ${
              prediction === predict.answer ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'
            }`}
          >
            {prediction === predict.answer ? 'නිවැරදි! ' : 'ඔබේ අනුමානය වෙනස්. '}
            {predict.explain}
          </p>
        ) : (
          <p className="mt-2 text-[11.5px] text-slate-500">අනුකරණයේ අගයන් වෙනස් කිරීමට පෙර ඔබේ අනුමානය තෝරන්න.</p>
        )}
      </section>

      {/* Step 2 */}
      <section className="card p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-600 text-[12px] font-bold text-white">2</span>
          <h3 className="text-[14.5px] font-bold">පරීක්ෂණය</h3>
        </div>
        <p className="mt-1 text-[12.5px] text-slate-500">අනුකරණයේ අගයන් වෙනස් කර පහත පියවර අනුපිළිවෙලට කරන්න.</p>
        <ul className="mt-2 space-y-2">
          {unit.sim.experiment.map((step, i) => {
            const on = checked.includes(i)
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setChecked((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]))}
                  className={`flex w-full items-start gap-2 rounded-xl border px-3 py-2 text-left text-[13px] transition ${
                    on ? 'border-sky-200 bg-sky-50/60 text-slate-700' : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[11px] font-bold ${
                      on ? 'border-sky-500 bg-sky-500 text-white' : 'border-slate-300 text-slate-500'
                    }`}
                  >
                    {on ? '✓' : i + 1}
                  </span>
                  <span>{step}</span>
                </button>
              </li>
            )
          })}
        </ul>
        <p className="mt-2 text-[11.5px] text-slate-500">
          {checked.length}/{unit.sim.experiment.length} පියවර සම්පූර්ණයි
        </p>
      </section>

      {/* Step 3 */}
      <section className="card p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-[12px] font-bold text-white">3</span>
          <h3 className="text-[14.5px] font-bold">විභාග නිගමනය</h3>
        </div>
        <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-[13px] leading-relaxed text-slate-800">{takeaway.text}</p>

        <div className="mt-3 rounded-xl border border-slate-200 p-3">
          <div className="text-[11.5px] font-bold text-slate-500">ඉක්මන් පරීක්ෂාව</div>
          <p className="mt-1 text-[13px] font-semibold">{takeaway.check.q}</p>
          <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {takeaway.check.options.map((opt, i) => {
              const answered = takeawayAnswer !== null
              const isCorrect = i === takeaway.check.answer
              let cls = 'border-slate-200 bg-white hover:bg-slate-50'
              if (answered && isCorrect) cls = 'border-emerald-300 bg-emerald-50'
              else if (answered && takeawayAnswer === i) cls = 'border-rose-300 bg-rose-50'
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={answered}
                  onClick={() => setTakeawayAnswer(i)}
                  className={`rounded-xl border px-3 py-2 text-left text-[12.5px] transition ${cls}`}
                >
                  {opt}
                </button>
              )
            })}
          </div>
          {takeawayAnswer !== null ? (
            <p className="mt-2 text-[12.5px] leading-relaxed text-slate-700">{takeaway.check.explain}</p>
          ) : null}
        </div>
      </section>

      <button type="button" onClick={onComplete} className={done ? 'btn-ghost w-full' : 'btn-primary w-full'}>
        {done ? '✓ ප්‍රයෝගය සම්පූර්ණ කර ඇත — නැවත සලකුණු කරන්න' : 'මෙම ප්‍රයෝගය සම්පූර්ණ කළා ලෙස සලකුණු කරන්න'}
      </button>
    </div>
  )
}

/* ------------------------------ Examples ------------------------------ */
function ExampleCard({ example, index }) {
  const [hint, setHint] = useState(0)
  const [showSolution, setShowSolution] = useState(false)

  return (
    <section className="card p-4">
      <h3 className="text-[14.5px] font-bold">{example.title}</h3>
      <p className="mt-1.5 rounded-xl bg-slate-50 px-3 py-2 text-[13px] leading-relaxed text-slate-800">{example.question}</p>

      <div className="mt-3 space-y-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setHint((h) => Math.max(h, 1))}
            className={`rounded-xl border px-3 py-1.5 text-[12px] font-semibold transition ${
              hint >= 1 ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-slate-200 bg-white text-slate-600'
            }`}
          >
            1 වන ඉඟිය: සූත්‍රය/සංකල්පය
          </button>
          <button
            type="button"
            onClick={() => setHint((h) => Math.max(h, 2))}
            disabled={hint < 1}
            className={`rounded-xl border px-3 py-1.5 text-[12px] font-semibold transition disabled:opacity-40 ${
              hint >= 2 ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-slate-200 bg-white text-slate-600'
            }`}
          >
            2 වන ඉඟිය: ආදේශය/ආරම්භය
          </button>
          <button
            type="button"
            onClick={() => setShowSolution(true)}
            disabled={hint < 2}
            className="rounded-xl border border-leaf-200 bg-leaf-50 px-3 py-1.5 text-[12px] font-semibold text-leaf-700 transition disabled:opacity-40"
          >
            සම්පූර්ණ විසඳුම
          </button>
        </div>

        {hint >= 1 ? (
          <p className="rounded-xl border border-amber-100 bg-amber-50/60 px-3 py-2 text-[12.5px] leading-relaxed text-slate-700">
            <span className="font-bold text-amber-800">ඉඟිය 1: </span>
            {example.hint1}
          </p>
        ) : null}
        {hint >= 2 ? (
          <p className="rounded-xl border border-amber-100 bg-amber-50/60 px-3 py-2 text-[12.5px] leading-relaxed text-slate-700">
            <span className="font-bold text-amber-800">ඉඟිය 2: </span>
            {example.hint2}
          </p>
        ) : null}
      </div>

      {showSolution ? (
        <div className="mt-3 rounded-xl border border-leaf-200 bg-leaf-50/50 p-3">
          <div className="text-[11.5px] font-bold text-leaf-700">සම්පූර්ණ විසඳුම</div>
          <ol className="mt-1.5 space-y-1.5">
            {example.solution.map((line, i) => (
              <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-slate-800">
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-[9.5px] font-bold text-white">
                  {i + 1}
                </span>
                <span className="font-medium">{line}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <p className="mt-2 text-[11.5px] text-slate-500">
          උදාහරණය {index + 1}: පළමුව තමන්ම උත්සාහ කර, පසුව ඉඟි බලන්න.
        </p>
      )}
    </section>
  )
}

function ExamplesTab({ unit }) {
  return (
    <div className="space-y-3">
      <p className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12.5px] leading-relaxed text-slate-600">
        සෑම ගැටලුවක්ම පියවරෙන් පියවර විසඳා ඇත. මුලින් තමන්ම උත්සාහ කර, අවශ්‍ය විට පමණක් ඉඟි හා සම්පූර්ණ විසඳුම බලන්න.
      </p>
      {unit.examples.map((ex, i) => (
        <ExampleCard key={ex.title} example={ex} index={i} />
      ))}
    </div>
  )
}

/* -------------------------------- Quiz -------------------------------- */
const norm = (s) =>
  String(s ?? '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[.,]/g, '')

function QuizTab({ unit, best, onSave }) {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const total = unit.quiz.length

  const results = useMemo(
    () =>
      unit.quiz.map((q, i) => {
        if (q.type === 'mcq') return answers[i] === q.answer
        const given = norm(answers[i])
        return given.length > 0 && q.answers.some((a) => norm(a) === given)
      }),
    [answers, unit.quiz],
  )

  const score = results.filter(Boolean).length
  const allAnswered = unit.quiz.every((q, i) => (q.type === 'mcq' ? answers[i] !== undefined : norm(answers[i]).length > 0))

  const submit = () => {
    setSubmitted(true)
    onSave(score, total)
    if (typeof window !== 'undefined') window.scrollTo({ top: window.scrollY, behavior: 'smooth' })
  }

  const reset = () => {
    setAnswers({})
    setSubmitted(false)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
        <p className="text-[12.5px] text-slate-600">
          ප්‍රශ්න {total}ක් · එක් එක් පිළිතුරට හේතුව දක්වා ඇත
        </p>
        {best ? (
          <span className="chip bg-leaf-50 text-leaf-700">
            හොඳම ලකුණු: {best.score}/{best.total}
          </span>
        ) : null}
      </div>

      {unit.quiz.map((q, i) => {
        const correct = results[i]
        const answered = q.type === 'mcq' ? answers[i] !== undefined : norm(answers[i]).length > 0
        return (
          <section
            key={i}
            className={`card p-4 ${
              submitted ? (correct ? 'ring-1 ring-emerald-200' : 'ring-1 ring-rose-200') : ''
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[11.5px] font-bold text-slate-600">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-semibold leading-relaxed">{q.q}</p>
                {q.type === 'mcq' ? (
                  <div className="mt-2 space-y-1.5">
                    {q.options.map((opt, oi) => {
                      const chosen = answers[i] === oi
                      let cls = 'border-slate-200 bg-white hover:bg-slate-50'
                      if (submitted && oi === q.answer) cls = 'border-emerald-300 bg-emerald-50'
                      else if (submitted && chosen) cls = 'border-rose-300 bg-rose-50'
                      else if (chosen) cls = 'border-leaf-400 bg-leaf-50'
                      return (
                        <label
                          key={opt}
                          className={`flex cursor-pointer items-start gap-2 rounded-xl border px-3 py-2 text-[13px] transition ${cls}`}
                        >
                          <input
                            type="radio"
                            name={`q-${unit.id}-${i}`}
                            className="mt-1 accent-leaf-600"
                            checked={chosen}
                            disabled={submitted}
                            onChange={() => setAnswers((a) => ({ ...a, [i]: oi }))}
                          />
                          <span>{opt}</span>
                        </label>
                      )
                    })}
                  </div>
                ) : (
                  <div className="mt-2">
                    <input
                      type="text"
                      className="field"
                      placeholder="ඔබේ පිළිතුර මෙහි ලියන්න"
                      aria-label={`ප්‍රශ්නය ${i + 1} සඳහා පිළිතුර`}
                      value={answers[i] ?? ''}
                      disabled={submitted}
                      onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
                    />
                    {submitted && !correct ? (
                      <p className="mt-1 text-[12px] text-slate-600">
                        නිවැරදි පිළිතුර: <span className="font-semibold text-ink">{q.answers[0]}</span>
                      </p>
                    ) : null}
                  </div>
                )}
                {submitted ? (
                  <p
                    className={`mt-2 rounded-xl px-3 py-2 text-[12.5px] leading-relaxed ${
                      correct ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900'
                    }`}
                  >
                    <span className="font-bold">{correct ? 'නිවැරදි! ' : 'වැරදි. '}</span>
                    {q.explain}
                  </p>
                ) : answered ? null : (
                  <p className="mt-1.5 text-[11.5px] text-slate-400">පිළිතුරක් තෝරන්න</p>
                )}
              </div>
            </div>
          </section>
        )
      })}

      {submitted ? (
        <div className="card space-y-2 p-4 text-center">
          <p className="text-[13px] text-slate-600">ඔබේ ලකුණු</p>
          <p className="text-3xl font-extrabold text-leaf-700">
            {score}
            <span className="text-base font-semibold text-slate-400"> / {total}</span>
          </p>
          <p className="text-[12.5px] text-slate-600">
            {score === total
              ? 'විශිෂ්ටයි! සියලු පිළිතුරු නිවැරදි. ඊළඟ පාඩමට යන්න.'
              : score >= total * 0.6
                ? 'හොඳයි. වැරදුණු ප්‍රශ්නවල පැහැදිලි කිරීම නැවත කියවන්න.'
                : 'තවත් පුහුණුවක් අවශ්‍යයි. සිද්ධාන්ත හා උදාහරණ නැවත බලන්න.'}
          </p>
          <button type="button" onClick={reset} className="btn-ghost w-full">
            නැවත උත්සාහ කරන්න
          </button>
        </div>
      ) : (
        <button type="button" onClick={submit} disabled={!allAnswered} className="btn-primary w-full disabled:opacity-40">
          පිළිතුරු ඉදිරිපත් කර ලකුණු ගන්න
        </button>
      )}
      {!submitted && !allAnswered ? (
        <p className="text-center text-[11.5px] text-slate-500">සියලු ප්‍රශ්නවලට පිළිතුරු දුන් පසු ඉදිරිපත් කළ හැක.</p>
      ) : null}
    </div>
  )
}

/* ------------------------------ Workspace ----------------------------- */
export function UnitWorkspace({ unit, labDone, bestScore, onToggleLab, onSaveQuiz }) {
  const [tab, setTab] = useState('theory')

  return (
    <div className="space-y-3">
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip bg-slate-100 text-slate-600">{unit.topics.length} උප මාතෘකා</span>
          {labDone ? <span className="chip bg-leaf-50 text-leaf-700">ප්‍රයෝගය ✓</span> : null}
          {bestScore ? (
            <span className="chip bg-sky-50 text-sky-600">
              ප්‍රශ්නාවලිය {bestScore.score}/{bestScore.total}
            </span>
          ) : null}
        </div>
        <h2 className="mt-1.5 text-lg font-extrabold leading-snug">{unit.title}</h2>
        <p className="text-[12.5px] text-slate-500">{unit.subtitle}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {unit.topics.map((t) => (
            <span key={t} className="rounded-full bg-slate-50 px-2 py-0.5 text-[11px] text-slate-500">
              {t}
            </span>
          ))}
        </div>
      </div>

      <TabBar active={tab} onChange={setTab} />

      <div>
        {tab === 'theory' ? <TheoryTab unit={unit} /> : null}
        {tab === 'lab' ? <LabTab unit={unit} done={labDone} onComplete={onToggleLab} /> : null}
        {tab === 'examples' ? <ExamplesTab unit={unit} /> : null}
        {tab === 'quiz' ? <QuizTab unit={unit} best={bestScore} onSave={onSaveQuiz} /> : null}
      </div>
    </div>
  )
}
