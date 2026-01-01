import type { Model } from 'survey-core'

export function Logo({ survey }: { survey: Model }) {
  const logo = (survey as unknown as { logo?: string }).logo
  if (!logo) return null

  const logoWidth = (survey as unknown as { logoWidth?: string | number }).logoWidth
  const logoHeight = (survey as unknown as { logoHeight?: string | number }).logoHeight
  const logoFit = (survey as unknown as { logoFit?: 'none' | 'contain' | 'cover' | 'fill' }).logoFit ?? 'contain'
  const logoPosition = (survey as unknown as { logoPosition?: 'none' | 'left' | 'right' | 'top' | 'bottom' }).logoPosition ?? 'left'

  if (logoPosition === 'none') return null

  const style: React.CSSProperties = {
    objectFit: logoFit,
    width: logoWidth ? (typeof logoWidth === 'number' ? `${logoWidth}px` : logoWidth) : undefined,
    height: logoHeight ? (typeof logoHeight === 'number' ? `${logoHeight}px` : logoHeight) : undefined,
  }

  return (
    <img
      src={logo}
      alt="Survey Logo"
      className={`msj__logo msj__logo--${logoPosition}`}
      style={style}
    />
  )
}
