import { motion } from 'motion/react'

export function Checkmark({
  active,
  duration,
  size = 14,
}: {
  active: boolean
  duration: number
  size?: number
}) {
  return (
    <motion.svg
      className="msj__checkmark"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <motion.path
        d="M3.2 8.4 6.6 11.8 12.8 4.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        initial={false}
        animate={active ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration }}
      />
    </motion.svg>
  )
}
