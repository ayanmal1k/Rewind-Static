'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ExternalLink, Play, Trophy, Gamepad2, Swords, Zap, Coins, Flame, Sparkles } from 'lucide-react'
import { Magnetic } from '@/components/ui-patterns/magnetic'

export interface GameData {
  id: string
  title: string
  subtitle: string
  genre: string
  tagline: string
  description: string
  cdImage: string
  url: string
  badge: string
  discNumber: string
  accentColor: 'fuchsia' | 'cyan'
  highlights: {
    icon: any
    label: string
  }[]
}

interface GameCdCardProps {
  game: GameData
  index: number
}

export function GameCdCard({ game, index }: GameCdCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const isFuchsia = game.accentColor === 'fuchsia'
  
  // Color token configurations
  const glowBorder = isFuchsia
    ? 'border-fuchsia-900/40 hover:border-fuchsia-500/80 hover:shadow-[0_0_35px_rgba(232,54,220,0.35)]'
    : 'border-cyan-950/60 hover:border-cyan-400/80 hover:shadow-[0_0_35px_rgba(34,211,238,0.35)]'

  const cdAuraGlow = isFuchsia
    ? 'from-fuchsia-500/35 via-purple-600/25 to-pink-500/15'
    : 'from-cyan-500/35 via-blue-600/25 to-fuchsia-500/15'

  const badgeBg = isFuchsia
    ? 'border-fuchsia-500/50 bg-fuchsia-500/15 text-fuchsia-300'
    : 'border-cyan-400/50 bg-cyan-500/15 text-cyan-300'

  const buttonGradient = isFuchsia
    ? 'conic-gradient(from 0deg, transparent 0deg, transparent 200deg, #ec4899 250deg, #d946ef 290deg, #a855f7 330deg, #ffffff 350deg, #ec4899 360deg)'
    : 'conic-gradient(from 0deg, transparent 0deg, transparent 200deg, #06b6d4 250deg, #3b82f6 290deg, #8b5cf6 330deg, #ffffff 350deg, #06b6d4 360deg)'

  const buttonGlow2 = isFuchsia
    ? 'conic-gradient(from 0deg, transparent 0deg, transparent 180deg, #db2777 240deg, #c026d3 280deg, #9333ea 330deg, #ffffff 350deg, #ec4899 360deg)'
    : 'conic-gradient(from 0deg, transparent 0deg, transparent 180deg, #0891b2 240deg, #2563eb 280deg, #7c3aed 330deg, #ffffff 350deg, #06b6d4 360deg)'

  return (
    <div 
      className={`group relative flex flex-col sm:flex-row items-center gap-5 sm:gap-6 rounded-2xl sm:rounded-3xl border bg-[#0b0216]/90 p-4 sm:p-5 lg:p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${glowBorder}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background ambient radial lighting */}
      <div 
        className={`pointer-events-none absolute -inset-1 bg-gradient-to-br ${cdAuraGlow} blur-xl rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10`} 
        aria-hidden="true"
      />

      {/* ========================================================================= */}
      {/* LEFT: COMPACT INTERACTIVE CD DISC (Click to Play) */}
      {/* ========================================================================= */}
      <div className="relative shrink-0 flex items-center justify-center">
        <a
          href={game.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group/cd relative block w-36 h-36 xs:w-40 xs:h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 cursor-pointer"
          title={`Click to play ${game.title}`}
          aria-label={`Play ${game.title} (Opens in a new tab)`}
        >
          {/* Ambient Disc Backlight Halo */}
          <div 
            className={`pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr ${cdAuraGlow} blur-lg transition-all duration-500 opacity-50 group-hover/cd:opacity-100 group-hover/cd:scale-110`}
            aria-hidden="true"
          />

          {/* CD Disc Body with Rotation Animation */}
          <div 
            className="relative w-full h-full rounded-full transition-transform duration-500 ease-out group-hover/cd:scale-105"
            style={{
              filter: isHovered 
                ? (isFuchsia ? 'drop-shadow(0 0 20px rgba(232, 54, 220, 0.55))' : 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.55))')
                : 'drop-shadow(0 0 10px rgba(0, 0, 0, 0.8))'
            }}
          >
            {/* The Actual CD PNG Image */}
            <div className={`relative w-full h-full rounded-full overflow-hidden transition-all duration-500 ${isHovered ? 'animate-spin-neon' : 'animate-[spin_18s_linear_infinite]'}`}>
              <Image
                src={game.cdImage}
                alt={`${game.title} Retro CD`}
                fill
                priority
                sizes="200px"
                className="object-contain select-none"
              />

              {/* Holographic Iridescent Sheen Reflection Overlay */}
              <div 
                className="pointer-events-none absolute inset-0 rounded-full mix-blend-color-dodge opacity-30 group-hover/cd:opacity-65 transition-opacity duration-300"
                style={{
                  background: 'conic-gradient(from 45deg, transparent 0deg, rgba(255,255,255,0.4) 60deg, rgba(236,72,153,0.5) 120deg, rgba(34,211,238,0.5) 180deg, rgba(250,204,21,0.5) 240deg, rgba(255,255,255,0.4) 300deg, transparent 360deg)'
                }}
                aria-hidden="true"
              />

              {/* Radial Grooves Glare Layer */}
              <div 
                className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,transparent_30%,rgba(255,255,255,0.15)_45%,transparent_55%,rgba(255,255,255,0.1)_70%,transparent_80%)] opacity-50"
                aria-hidden="true"
              />
            </div>

            {/* Central Spindle Hole Overlay */}
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-white/30 bg-black/50 backdrop-blur-xs flex items-center justify-center shadow-[inset_0_0_8px_rgba(0,0,0,0.8)]">
              <div className="h-4.5 w-4.5 sm:h-5 sm:w-5 rounded-full border border-white/20 bg-black/70 flex items-center justify-center">
                <Play className={`h-2.5 w-2.5 sm:h-3 sm:w-3 fill-white text-white transition-transform duration-300 ${isHovered ? 'scale-125 text-fuchsia-300' : 'opacity-80'}`} />
              </div>
            </div>
          </div>

          {/* Compact Click Badge */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none whitespace-nowrap">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-frygia font-black uppercase tracking-wider text-white bg-black/90 border transition-all duration-300 ${
              isHovered 
                ? (isFuchsia ? 'border-fuchsia-400 bg-[#170126] shadow-[0_0_12px_rgba(232,54,220,0.8)] scale-105' : 'border-cyan-400 bg-[#011a26] shadow-[0_0_12px_rgba(34,211,238,0.8)] scale-105') 
                : 'border-purple-600/50 opacity-90'
            }`}>
              <Play className="h-2.5 w-2.5 fill-current" />
              <span>Click CD</span>
            </span>
          </div>
        </a>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT: GAME DETAILS & COMPACT ACTION */}
      {/* ========================================================================= */}
      <div className="flex flex-col flex-1 min-w-0 text-center sm:text-left w-full">
        
        {/* Top Spine Badge */}
        <div className="flex items-center justify-center sm:justify-between gap-2 mb-1.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 border border-purple-800/50 text-[10px] font-mono tracking-wider text-zinc-400">
            <span className={`h-1.5 w-1.5 rounded-full ${isFuchsia ? 'bg-fuchsia-400' : 'bg-cyan-400'} animate-pulse`} />
            <span>{game.discNumber}</span>
          </div>

          <span className={`px-2 py-0.5 rounded-full text-[10px] font-frygia font-black uppercase tracking-wider border ${badgeBg}`}>
            {game.badge}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-morton font-black uppercase tracking-wide text-2xl sm:text-2xl md:text-3xl text-white neon-text-glow leading-tight">
          {game.title}
        </h3>

        {/* Subtitle / Genre */}
        <p className="font-frygia font-bold text-xs text-fuchsia-300/90 tracking-wide uppercase mt-0.5 mb-1.5">
          {game.subtitle}
        </p>

        {/* Description (1-2 lines) */}
        <p className="text-zinc-300 font-frygia text-xs leading-relaxed mb-3 line-clamp-2">
          {game.description}
        </p>

        {/* Feature Micro-Badges */}
        <div className="grid grid-cols-2 gap-1.5 mb-3.5">
          {game.highlights.slice(0, 2).map((item, i) => {
            const IconComponent = item.icon
            return (
              <div 
                key={i}
                className="flex items-center gap-1.5 p-1.5 rounded-lg border border-purple-900/40 bg-black/40 backdrop-blur-xs"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-400 shrink-0">
                  <IconComponent className="h-3 w-3" />
                </div>
                <span className="font-frygia text-[10px] sm:text-[11px] text-zinc-300 font-medium leading-tight line-clamp-1">
                  {item.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Magnetic Play Button CTA */}
        <div className="mt-auto flex justify-center sm:justify-start">
          <Magnetic strength={0.25} className="w-full">
            <a
              href={game.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn relative w-full inline-flex items-center justify-center p-[2px] rounded-none overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95 focus-visible:outline-none"
              aria-label={`Play ${game.title} now`}
            >
              {/* Rotating Neon Laser Border */}
              <div
                className="absolute -inset-[200%] animate-spin-neon pointer-events-none"
                style={{ background: buttonGradient }}
                aria-hidden="true"
              />

              {/* Secondary Glow Layer */}
              <div
                className="absolute -inset-[200%] animate-spin-neon pointer-events-none blur-md opacity-80"
                style={{ background: buttonGlow2 }}
                aria-hidden="true"
              />

              {/* Static Ambient Border */}
              <div className="absolute inset-0 border border-fuchsia-500/50 rounded-none pointer-events-none" />

              {/* Inner Button Body */}
              <div className="relative z-10 w-full rounded-none bg-[#090111] px-4 py-2.5 flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 group-hover/btn:bg-[#160228]">
                
                {/* Subtle hover shimmer */}
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-pink-600/20 via-purple-500/30 to-pink-600/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 pointer-events-none" 
                  aria-hidden="true"
                />

                {/* Button Text */}
                <span className="relative z-10 font-frygia font-black text-xs tracking-widest uppercase text-white group-hover/btn:text-pink-100 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)] transition-colors duration-300 flex items-center gap-1.5">
                  <Play className="h-3 w-3 fill-current" />
                  Play {game.title}
                  <ExternalLink className="h-3 w-3 text-pink-400 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
                </span>
              </div>
            </a>
          </Magnetic>
        </div>

      </div>

    </div>
  )
}
