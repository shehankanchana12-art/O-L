import { useEffect, useState } from 'react'

/* localStorage තුළ ප්‍රගතිය සුරකින කුඩා කොක්ක */
export function useStored(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return initial
      const parsed = JSON.parse(raw)
      if (initial && typeof initial === 'object' && !Array.isArray(initial)) {
        return { ...initial, ...parsed }
      }
      return parsed ?? initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* ගබඩාව නොමැති වුවත් යෙදුම දිගටම ක්‍රියා කරයි */
    }
  }, [key, value])

  return [value, setValue]
}
