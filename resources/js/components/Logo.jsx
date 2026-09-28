/**
 * Logo con fallback WebP -> PNG.
 *
 * El PNG original pesa ~176 KB; el WebP ~29 KB. La gran mayoria de navegadores
 * ya soporta WebP, asi que la carga inicial mejora sin perder compatibilidad.
 */
export default function Logo({ className = '', width = 40, height = 40, ...props }) {
  return (
    <picture>
      <source srcSet="/images/logo.webp" type="image/webp" />
      <img
        src="/images/logo.png"
        alt="DISFRUTA"
        width={width}
        height={height}
        className={`object-contain ${className}`}
        {...props}
      />
    </picture>
  )
}
