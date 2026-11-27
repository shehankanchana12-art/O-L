/* ------------------------------------------------------------------
   lessonsData — සියලු පාඩම් එකට එකතු කරන මධ්‍යස්ථානය
   පාඩමක් එකතු කිරීමට අදාළ units/*.js ගොනුවට පමණක් වස්තුවක් එකතු කරන්න.
-------------------------------------------------------------------*/

import { GRADES as BASE } from './curriculum.js'
import { NOTES_EXTRAS } from './notesExtras.js'
import { G9MATH_A } from './units/g9math-a.js'
import { G9MATH_B } from './units/g9math-b.js'
import { G9MATH_C } from './units/g9math-c.js'
import { G9SCI_A } from './units/g9sci-a.js'
import { G9SCI_B } from './units/g9sci-b.js'
import { G9SCI_C } from './units/g9sci-c.js'
import { G10MATH_A } from './units/g10math-a.js'
import { G10MATH_B } from './units/g10math-b.js'
import { G10SCI_A } from './units/g10sci-a.js'
import { G10SCI_B } from './units/g10sci-b.js'
import { G11MATH_A } from './units/g11math-a.js'
import { G11MATH_B } from './units/g11math-b.js'
import { G11MATH_C } from './units/g11math-c.js'
import { G11SCI_A } from './units/g11sci-a.js'
import { G11SCI_B } from './units/g11sci-b.js'
import { G11SCI_C } from './units/g11sci-c.js'
import { G9ICT } from './units/ict-g9.js'
import { G10ICT } from './units/ict-g10.js'
import { G11ICT } from './units/ict-g11.js'

const EXTRA = {
  g9: {
    math: [...G9MATH_A, ...G9MATH_B, ...G9MATH_C],
    science: [...G9SCI_A, ...G9SCI_B, ...G9SCI_C],
    ict: [...G9ICT],
  },
  g10: {
    math: [...G10MATH_A, ...G10MATH_B],
    science: [...G10SCI_A, ...G10SCI_B],
    ict: [...G10ICT],
  },
  g11: {
    math: [...G11MATH_A, ...G11MATH_B, ...G11MATH_C],
    science: [...G11SCI_A, ...G11SCI_B, ...G11SCI_C],
    ict: [...G11ICT],
  },
}

const normalise = (unit, notes = {}) => ({
  ...unit,
  objective: unit.objective ?? notes.objective ?? '',
  laws: unit.laws ?? notes.laws ?? [],
  examTips: unit.examTips ?? notes.examTips ?? [],
  mistakes: unit.mistakes ?? notes.mistakes ?? [],
  hasSimulation: Boolean(unit.sim),
})

const mergeSubject = (baseUnits, extraUnits) => [
  ...baseUnits.map((u) => normalise(u, NOTES_EXTRAS[u.id])),
  ...extraUnits.map((u) => normalise(u)),
]

export const GRADES = BASE.map((grade) => ({
  ...grade,
  subjects: {
    math: {
      ...grade.subjects.math,
      units: mergeSubject(grade.subjects.math.units, EXTRA[grade.id].math),
    },
    science: {
      ...grade.subjects.science,
      units: mergeSubject(grade.subjects.science.units, EXTRA[grade.id].science),
    },
    ict: {
      label: 'තොරතුරු හා සන්නිවේදන තාක්ෂණය',
      short: 'ICT',
      units: mergeSubject([], EXTRA[grade.id].ict),
    },
  },
}))

export const TOTAL_LESSONS = GRADES.reduce(
  (sum, g) =>
    sum +
    Object.values(g.subjects).reduce((n, subject) => n + subject.units.length, 0),
  0,
)
