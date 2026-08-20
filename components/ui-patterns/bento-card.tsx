'use client'

import { useRef, useState, type ReactNode, type MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { springConfigs } from '@/lib/gsap'

interface BentoCardProps {
  children: ReactNode
  className?: string
  badge?: string
  title?: string
  description?: string
}

export function BentoCard({ children, className = '', badge, title, description }: BentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={springConfigs.snappy}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-6 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-orange-500/5 ${className}`}
    >
      {/* Radial glow spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(250, 93, 41, 0.12), transparent 80%)`,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          {badge && (
            <span className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-zinc-300">
              {badge}
            </span>
          )}
          {title && <h3 className="text-xl font-semibold text-white tracking-tight">{title}</h3>}
          {description && <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{description}</p>}
        </div>

        <div className="mt-6">{children}</div>
      </div>
    </motion.div>
  )
}
