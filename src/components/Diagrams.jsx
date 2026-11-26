const box = 'mx-auto block w-full max-w-sm lg:max-w-md'

export function UnitDiagram({ kind }) {
  switch (kind) {
    case 'line':
      return (
        <svg viewBox="0 0 300 150" className={box} role="img" aria-label="රේඛීය ප්‍රස්ථාරයේ රූප සටහන">
          <rect width="300" height="150" fill="#f8fafc" rx="12" />
          {[30, 60, 90, 120].map((y) => (
            <line key={y} x1="20" y1={y} x2="280" y2={y} stroke="#e2e8f0" />
          ))}
          <line x1="20" y1="120" x2="280" y2="120" stroke="#94a3b8" strokeWidth="1.4" />
          <line x1="50" y1="15" x2="50" y2="135" stroke="#94a3b8" strokeWidth="1.4" />
          <line x1="50" y1="120" x2="250" y2="25" stroke="#0f9d63" strokeWidth="3" />
          <circle cx="50" cy="103" r="4" fill="#0f9d63" />
          <text x="58" y="99" fontSize="10" fill="#0b7d4f">c (y-ඡේදනය)</text>
          <text x="150" y="60" fontSize="10" fill="#0b7d4f">බෑවුම = m</text>
          <text x="252" y="30" fontSize="10" fill="#64748b">y = mx + c</text>
          <text x="26" y="112" fontSize="9" fill="#64748b">O</text>
        </svg>
      )
    case 'atom':
      return (
        <svg viewBox="0 0 300 150" className={box} role="img" aria-label="පරමාණුවේ රූප සටහන">
          <rect width="300" height="150" fill="#f8fafc" rx="12" />
          <g transform="translate(150,75)">
            <circle r="12" fill="#fecaca" stroke="#ef4444" />
            <circle cx="-5" cy="-4" r="3" fill="#ef4444" />
            <circle cx="5" cy="2" r="3" fill="#ef4444" />
            <circle cx="0" cy="6" r="3" fill="#64748b" />
            <ellipse rx="36" ry="36" fill="none" stroke="#cbd5e1" strokeDasharray="3 4" />
            <ellipse rx="56" ry="56" fill="none" stroke="#cbd5e1" strokeDasharray="3 4" />
            <circle cx="0" cy="-36" r="3" fill="#eab308" />
            <circle cx="36" cy="0" r="3" fill="#eab308" />
            <circle cx="0" cy="56" r="3" fill="#eab308" />
            <circle cx="-56" cy="0" r="3" fill="#eab308" />
            <line x1="14" y1="0" x2="32" y2="0" stroke="#94a3b8" />
            <text x="34" y="-4" fontSize="9" fill="#475569">න්‍යෂ්ටිය</text>
          </g>
          <text x="14" y="20" fontSize="10" fill="#b91c1c">● ප්‍රෝටෝන (+)</text>
          <text x="14" y="34" fontSize="10" fill="#475569">● නියුට්‍රෝන (0)</text>
          <text x="14" y="48" fontSize="10" fill="#a16207">● ඉලෙක්ට්‍රෝන (−)</text>
        </svg>
      )
    case 'quad':
      return (
        <svg viewBox="0 0 300 150" className={box} role="img" aria-label="පරාවලයේ රූප සටහන">
          <rect width="300" height="150" fill="#f8fafc" rx="12" />
          <line x1="20" y1="110" x2="280" y2="110" stroke="#94a3b8" strokeWidth="1.4" />
          <line x1="150" y1="15" x2="150" y2="138" stroke="#94a3b8" strokeWidth="1.4" />
          <path d="M60 30 Q150 160 240 30" fill="none" stroke="#3167d6" strokeWidth="3" />
          <circle cx="150" cy="95" r="4" fill="#3167d6" />
          <line x1="150" y1="30" x2="150" y2="130" stroke="#94a3b8" strokeDasharray="4 3" />
          <text x="158" y="112" fontSize="9.5" fill="#475569">ශීර්ෂය</text>
          <text x="206" y="128" fontSize="9.5" fill="#475569">x = −b/2a</text>
          <text x="26" y="24" fontSize="10" fill="#2551b0">y = ax² + bx + c</text>
        </svg>
      )
    case 'triangle':
      return (
        <svg viewBox="0 0 300 150" className={box} role="img" aria-label="සෘජුකෝණී ත්‍රිකෝණයේ රූප සටහන">
          <rect width="300" height="150" fill="#f8fafc" rx="12" />
          <path d="M50 120 L240 120 L240 35 Z" fill="#eff6ff" stroke="#3167d6" strokeWidth="2" />
          <path d="M222 120 L222 102 L240 102" fill="none" stroke="#3167d6" strokeWidth="1.4" />
          <text x="140" y="136" fontSize="10" fill="#475569">යාබද බාහුව</text>
          <text x="248" y="82" fontSize="10" fill="#475569">විරුද්ධ</text>
          <text x="120" y="68" fontSize="10" fill="#0b7d4f">කර්ණය</text>
          <text x="64" y="114" fontSize="10" fill="#b45309">θ</text>
          <text x="60" y="30" fontSize="10.5" fill="#2551b0">sin θ = විරුද්ධ / කර්ණය</text>
        </svg>
      )
    case 'circuit':
      return (
        <svg viewBox="0 0 300 150" className={box} role="img" aria-label="ශ්‍රේණිගත පරිපථයේ රූප සටහන">
          <rect width="300" height="150" fill="#f8fafc" rx="12" />
          <path d="M40 100 H90 V50 H190 V100 H260 V40 H40 Z" fill="none" stroke="#ef4444" strokeWidth="2" />
          <rect x="34" y="62" width="12" height="32" rx="2" fill="#e2e8f0" stroke="#64748b" />
          <circle cx="140" cy="50" r="14" fill="#fef3c7" stroke="#94a3b8" />
          <path d="M132 50 h16" stroke="#a16207" strokeWidth="2" />
          <line x1="140" y1="64" x2="140" y2="100" stroke="#cbd5e1" strokeDasharray="3 3" />
          <text x="120" y="86" fontSize="9.5" fill="#475569">ධාරාව</text>
          <text x="50" y="80" fontSize="9.5" fill="#475569">V</text>
          <text x="212" y="80" fontSize="9.5" fill="#b91c1c">I</text>
        </svg>
      )
    case 'circle':
      return (
        <svg viewBox="0 0 300 150" className={box} role="img" aria-label="වෘත්තයේ ඡේදකයේ රූප සටහන">
          <rect width="300" height="150" fill="#f8fafc" rx="12" />
          <circle cx="150" cy="75" r="55" fill="#eff6ff" stroke="#3167d6" strokeWidth="2" />
          <circle cx="150" cy="75" r="3" fill="#3167d6" />
          <line x1="103" y1="47" x2="197" y2="47" stroke="#f59e0b" strokeWidth="3" />
          <line x1="150" y1="75" x2="150" y2="47" stroke="#64748b" strokeDasharray="3 3" />
          <line x1="150" y1="75" x2="197" y2="47" stroke="#94a3b8" />
          <text x="146" y="45" fontSize="9" fill="#b45309">ඡේදකය</text>
          <text x="154" y="66" fontSize="9" fill="#475569">d</text>
          <text x="176" y="66" fontSize="9" fill="#475569">r</text>
          <text x="120" y="140" fontSize="10" fill="#2551b0">r² = d² + (c/2)²</text>
        </svg>
      )
    case 'ph':
      return (
        <svg viewBox="0 0 300 150" className={box} role="img" aria-label="pH පරිමාණයේ රූප සටහන">
          <rect width="300" height="150" fill="#f8fafc" rx="12" />
          <defs>
            <linearGradient id="phMini" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="50%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>
          <rect x="30" y="62" width="240" height="16" rx="8" fill="url(#phMini)" />
          {[0, 7, 14].map((v) => (
            <text key={v} x={30 + (v / 14) * 240} y="96" textAnchor="middle" fontSize="10" fill="#475569">
              {v}
            </text>
          ))}
          <text x="30" y="50" fontSize="10" fill="#b91c1c">අම්ල</text>
          <text x="140" y="50" fontSize="10" fill="#15803d">උදාසීන</text>
          <text x="234" y="50" fontSize="10" fill="#1d4ed8">භෂ්ම</text>
          <text x="150" y="125" textAnchor="middle" fontSize="10" fill="#475569">
            pH = −log₁₀[H⁺]
          </text>
        </svg>
      )
    case 'wave':
      return (
        <svg viewBox="0 0 300 150" className={box} role="img" aria-label="තරංගයේ රූප සටහන">
          <rect width="300" height="150" fill="#f8fafc" rx="12" />
          <line x1="20" y1="75" x2="280" y2="75" stroke="#e2e8f0" strokeDasharray="3 4" />
          <path d="M20 75 Q45 20 70 75 T120 75 T170 75 T220 75 T270 75" fill="none" stroke="#3167d6" strokeWidth="2.6" />
          <line x1="70" y1="118" x2="120" y2="118" stroke="#0f9d63" strokeWidth="2" />
          <text x="95" y="132" textAnchor="middle" fontSize="9.5" fill="#0b7d4f">λ</text>
          <line x1="20" y1="45" x2="70" y2="45" stroke="#f59e0b" strokeWidth="1.4" />
          <text x="40" y="38" textAnchor="middle" fontSize="9.5" fill="#b45309">A</text>
          <text x="150" y="24" textAnchor="middle" fontSize="10.5" fill="#2551b0">v = fλ</text>
        </svg>
      )
    default:
      return null
  }
}
