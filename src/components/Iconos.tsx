import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>

const base = (p: P) => ({
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...p,
})

export const IconoCarrito = (p: P) => (
  <svg {...base(p)}>
    <path d="M2.5 3h2.2l2.1 10.6a1.8 1.8 0 0 0 1.8 1.5h8.3a1.8 1.8 0 0 0 1.8-1.4L20 7H6" />
    <circle cx="9.5" cy="19.5" r="1.4" />
    <circle cx="17" cy="19.5" r="1.4" />
  </svg>
)

export const IconoUsuario = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </svg>
)

export const IconoCorazon = ({ lleno, ...p }: P & { lleno?: boolean }) => (
  <svg
    {...base(p)}
    fill={lleno ? 'currentColor' : 'none'}
    strokeWidth={lleno ? 0 : 1.6}
  >
    <path d="M12 20.2s-7.4-4.6-7.4-9.6a4.2 4.2 0 0 1 7.4-2.7 4.2 4.2 0 0 1 7.4 2.7c0 5-7.4 9.6-7.4 9.6Z" />
  </svg>
)

export const IconoEstrella = ({ llena, ...p }: P & { llena?: boolean }) => (
  <svg {...base(p)} fill={llena ? 'currentColor' : 'none'} strokeWidth={llena ? 0 : 1.5}>
    <path d="m12 3.2 2.7 5.5 6 .9-4.35 4.24 1.03 6-5.38-2.83L6.62 19.84l1.03-6L3.3 9.6l6-.9L12 3.2Z" />
  </svg>
)

export const IconoWhatsapp = (p: P) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.38-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35Z" />
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.25-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23Z" />
  </svg>
)

export const IconoChef = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 20h10" />
    <path d="M6.5 17h11l.5-6.5a4.3 4.3 0 1 0-3.4-6.1 4.3 4.3 0 0 0-6.7 0 4.3 4.3 0 1 0-3.4 6.1L6.5 17Z" />
  </svg>
)

export const IconoHoja = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 20c0-8 5-14 16-15 0 10-5 15-13 15H4Z" />
    <path d="M9 15c2-2 4.5-3.5 8-4.5" />
  </svg>
)

export const IconoCorazonManos = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 20.5S3.5 15.7 3.5 9.6A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8.5 2.6c0 6.1-8.5 10.9-8.5 10.9Z" />
    <path d="M9.5 11.5c.6-.7 1.5-.7 2.1 0 .6-.7 1.5-.7 2.1 0" />
    <path d="M9.5 11.5c0 .9.9 1.6 2.5 1.6s2.5-.7 2.5-1.6" />
  </svg>
)

export const IconoFuego = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 22c3.9 0 6.5-2.4 6.5-6 0-4.4-4.3-6.2-4-11-2.3 1.2-3.2 3.4-3.2 5.4 0 1.2-1 1.8-1.7 1.1-.5-.5-.7-1.2-.6-2C7 11 5.5 13.2 5.5 16c0 3.6 2.6 6 6.5 6Z" />
  </svg>
)

export const IconoBuscar = (p: P) => (
  <svg {...base(p)}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m20 20-4.7-4.7" />
  </svg>
)

export const IconoFiltro = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 5.5h18M6 12h12M10 18.5h4" />
  </svg>
)

export const IconoCerrar = (p: P) => (
  <svg {...base(p)}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
)

export const IconoMas = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const IconoMenos = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
  </svg>
)

export const IconoFlecha = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const IconoCheck = (p: P) => (
  <svg {...base(p)}>
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
)

export const IconoMenu = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const IconoInstagram = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </svg>
)

export const IconoUbicacion = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
)

export const IconoReloj = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5.2l3.2 2" />
  </svg>
)

export const IconoMail = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </svg>
)

export const IconoLote = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z" />
    <path d="M12 12v8M4 8.5 12 12l8-3.5" />
  </svg>
)

export const IconoEtiqueta = (p: P) => (
  <svg {...base(p)}>
    <path d="M12.6 3H20v7.4l-8.6 8.6a2 2 0 0 1-2.8 0l-4.6-4.6a2 2 0 0 1 0-2.8L12.6 3Z" />
    <circle cx="16.2" cy="7.8" r="1.4" />
  </svg>
)

export const IconoPanel = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <path d="M3 9h18M9 20V9" />
  </svg>
)

export const IconoGrafico = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 20V4" />
    <path d="M4 20h16" />
    <path d="M8 16V11M12.5 16V7M17 16v-6" />
  </svg>
)

export const IconoUsuarioGrupo = (p: P) => (
  <svg {...base(p)}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M2.5 19.5a6.5 6.5 0 0 1 13 0" />
    <path d="M16 5.2a3.2 3.2 0 0 1 0 5.9M17.5 14.4a6.5 6.5 0 0 1 4 5.1" />
  </svg>
)

export const IconoCamara = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 8.5A2 2 0 0 1 5 6.5h2l1.3-2h7.4L17 6.5h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9Z" />
    <circle cx="12" cy="13" r="3.4" />
  </svg>
)

export const IconoCalendario = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
)

export const IconoPin = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 21s7-6.3 7-11.5A7 7 0 0 0 5 9.5C5 14.7 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.4" />
  </svg>
)
