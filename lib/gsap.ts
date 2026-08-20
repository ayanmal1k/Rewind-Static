import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }

// Spring Physics configurations for Framer Motion matching Awwwards UI standard
export const springConfigs = {
  snappy: { type: 'spring' as const, stiffness: 300, damping: 20 },
  fluid: { type: 'spring' as const, stiffness: 150, damping: 15, mass: 0.5 },
  dramatic: { type: 'spring' as const, stiffness: 100, damping: 30 },
  magnetic: { type: 'spring' as const, stiffness: 200, damping: 15, mass: 0.1 },
}
