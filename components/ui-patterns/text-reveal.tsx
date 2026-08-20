'use client'

import { motion } from 'framer-motion'

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
}

export function TextReveal({ text, className = '', delay = 0 }: TextRevealProps) {
  const words = text.split(' ')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: (customDelay: number = 0) => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: customDelay,
      },
    }),
  }

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 24,
      rotateX: -30,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring' as const,
        damping: 18,
        stiffness: 140,
      },
    },
  }

  return (
    <motion.span
      className={`inline-flex flex-wrap gap-x-[0.28em] perspective-1000 ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      custom={delay}
    >
      {words.map((word, i) => (
        <motion.span key={i} variants={wordVariants} className="inline-block">
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}
