/**
 * Ilustración vectorial del frasco. Se usa cuando el producto todavía no tiene
 * foto cargada desde el panel de administración, para que nunca se vea un
 * ícono de imagen rota.
 */
export function IlustracionFrasco({ producto, className = '' }) {
  const { fondo, contenido, acento, tapa } = producto.tono
  const id = `f-${producto.id}`
  const sic = Math.min(producto.ingredientes.length, 7)

  return (
    <svg
      viewBox="0 0 400 460"
      className={className}
      role="img"
      aria-label={producto.nombre}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`${id}-vidrio`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="18%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="82%" stopColor="#000000" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id={`${id}-brillo`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-fondo`} cx="50%" cy="38%" r="72%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor={fondo} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="460" fill={fondo} />
      <rect width="400" height="460" fill={`url(#${id}-fondo)`} />

      {/* ingredientes frescos sueltos al fondo */}
      <g opacity="0.5">
        <circle cx="52" cy="392" r="34" fill={contenido} opacity="0.35" />
        <circle cx="348" cy="410" r="26" fill={acento} opacity="0.3" />
        <circle cx="356" cy="70" r="30" fill={contenido} opacity="0.22" />
        <path
          d="M28 118c14-26 40-30 56-14s6 44-10 54-46-12-46-40Z"
          fill={contenido}
          opacity="0.3"
        />
      </g>

      {/* sombra de apoyo */}
      <ellipse cx="200" cy="418" rx="104" ry="16" fill={acento} opacity="0.22" />

      {/* cuerpo del frasco */}
      <g>
        <rect x="132" y="88" width="136" height="300" rx="26" fill={contenido} />
        <rect
          x="132"
          y="88"
          width="136"
          height="300"
          rx="26"
          fill={`url(#${id}-vidrio)`}
        />

        {/* contenido dentro del frasco */}
        <g clipPath={`url(#clip-${id})`}>
          <clipPath id={`clip-${id}`}>
            <rect x="132" y="88" width="136" height="300" rx="26" />
          </clipPath>
          {Array.from({ length: sic }, (_, i) => {
            const filas = sic > 4 ? 3 : 2
            const x = 150 + (i % 2) * 62 + (i > 3 ? -14 : 0)
            const y = 150 + Math.floor(i / 2) * (300 / filas)
            const radio = 15 + ((i * 7) % 9)
            return (
              <circle
                key={i}
                cx={x + 22}
                cy={y - 20}
                r={radio}
                fill={i % 3 === 0 ? acento : contenido}
                opacity={0.9}
                stroke={acento}
                strokeWidth="2"
                strokeOpacity="0.5"
              />
            )
          })}
          <rect x="132" y="230" width="136" height="80" fill={acento} opacity="0.35" />
        </g>

        {/* hombro y cuello */}
        <path d="M150 88h100v-8a14 14 0 0 0-14-14h-72a14 14 0 0 0-14 14v8Z" fill={tapa} />
        <rect x="138" y="70" width="124" height="26" rx="7" fill={tapa} />
        <rect x="138" y="70" width="124" height="9" rx="4.5" fill="#ffffff" opacity="0.14" />

        {/* etiqueta */}
        <rect
          x="146"
          y="186"
          width="108"
          height="128"
          rx="9"
          fill="#FBF7EF"
          stroke={acento}
          strokeOpacity="0.25"
          strokeWidth="1.5"
        />
        <rect x="158" y="200" width="84" height="4" rx="2" fill={tapa} opacity="0.85" />
        <rect x="164" y="212" width="72" height="9" rx="3" fill={acento} opacity="0.55" />
        <rect x="172" y="228" width="56" height="3" rx="1.5" fill="#241F1A" opacity="0.25" />
        <rect x="166" y="238" width="68" height="3" rx="1.5" fill="#241F1A" opacity="0.18" />
        <rect x="162" y="272" width="76" height="22" rx="5" fill={tapa} opacity="0.08" />
        <text
          x="200"
          y="288"
          textAnchor="middle"
          fontFamily="Fraunces, Georgia, serif"
          fontSize="14"
          fill={tapa}
          letterSpacing="1.5"
        >
          DISFRUTA
        </text>

        {/* brillo de vidrio */}
        <path
          d="M150 108c-6 52-6 168 2 250"
          stroke="#ffffff"
          strokeWidth="9"
          strokeLinecap="round"
          opacity="0.4"
          fill="none"
        />
        <rect
          x="132"
          y="88"
          width="136"
          height="300"
          rx="26"
          fill={`url(#${id}-brillo)`}
          opacity="0.35"
        />
      </g>
    </svg>
  )
}
