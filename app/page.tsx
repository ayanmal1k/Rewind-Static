'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Tv, TrendingUp, Rocket, Gamepad2, Trophy, Smartphone, Coins, ExternalLink, Info, ArrowRight, Copy, Check, ShieldCheck, Lock, Users, Plus, Minus, Menu, X as CloseIcon, Sparkles, Film, Download, Palette } from 'lucide-react'
import { Magnetic } from '@/components/ui-patterns/magnetic'
import { gsap, ScrollTrigger, springConfigs } from '@/lib/gsap'

const TICKER_ITEMS = [
  'WATCH CARTOONS',
  'CHART GO UP',
  'SEND IT',
]

const NAV_LINKS = [
  { name: 'THE PLAN', href: '#the-plan' },
  { name: 'REWIND CLIMBER', href: '#rewind-climber' },
  { name: 'REWIND PFP', href: '#rewind-pfp' },
  { name: 'HOW TO BUY', href: '#how-to-buy' },
  { name: 'FAQ', href: '#faq' },
  { name: 'COMMUNITY', href: '#social' },
]

const HTB_STEPS = [
  {
    step: 1,
    title: 'GET SOL',
    description: 'Buy SOL on your favorite exchange.',
    image: '/htb/sol.png',
    alt: 'Solana',
    glowClass: 'border-fuchsia-500/80 shadow-[0_0_25px_rgba(232,54,220,0.5)]',
  },
  {
    step: 2,
    title: 'CONNECT WALLET',
    description: 'Connect your wallet to Raydium.',
    image: '/htb/wallet.png',
    alt: 'Connect Wallet',
    glowClass: 'border-fuchsia-500/80 shadow-[0_0_25px_rgba(232,54,220,0.5)]',
  },
  {
    step: 3,
    title: 'SWAP SOL FOR $RWD',
    description: 'Swap SOL for $RWD on Raydium.',
    image: '/htb/swap.png',
    alt: 'Swap SOL for $RWD',
    glowClass: 'border-fuchsia-500/80 shadow-[0_0_25px_rgba(232,54,220,0.5)]',
  },
  {
    step: 4,
    title: '$RWD',
    isFinal: true,
    description: "You're in. Welcome to the rewind!",
    image: '/htb/rewind-logo.png',
    alt: '$RWD Rewind Logo',
    glowClass: 'border-fuchsia-500/80 shadow-[0_0_25px_rgba(232,54,220,0.5)]',
  },
]

const PLEDGE_ITEMS = [
  {
    title: 'No Presale',
    description: 'Everyone tunes in at the same time. No early access, no whitelist.',
    icon: ShieldCheck,
    iconColor: 'text-fuchsia-400',
    iconBg: 'border-fuchsia-500/50 bg-fuchsia-500/10 shadow-[0_0_12px_rgba(232,54,220,0.35)]',
  },
  {
    title: 'LP Locked',
    description: 'Liquidity gets locked at launch so the rerun can’t get cut mid-episode.',
    icon: Lock,
    iconColor: 'text-pink-400',
    iconBg: 'border-pink-500/50 bg-pink-500/10 shadow-[0_0_12px_rgba(244,114,182,0.35)]',
  },
  {
    title: 'Community-Driven',
    description: 'No complicated tokenomics deck. Just cartoons, memes, and the Rewind Crew.',
    icon: Users,
    iconColor: 'text-purple-400',
    iconBg: 'border-purple-500/50 bg-purple-500/10 shadow-[0_0_12px_rgba(168,85,247,0.35)]',
  },
]

const FAQ_ITEMS = [
  {
    q: 'What is Rewind Static?',
    a: 'A community meme coin on Solana built around 90s cartoon nostalgia and VHS static vibes. No complicated lore — just good times and a chart.',
  },
  {
    q: 'Is there a presale or whitelist?',
    a: 'No. Everyone gets access at the same time when the contract address goes live. No early bags, no insiders.',
  },
  {
    q: 'Where do I get the real contract address?',
    a: (
      <>
        Only from this website, our pinned post on{' '}
        <a 
          href="https://x.com/RewindStatic78" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#ff2da8] font-bold underline decoration-[#ff2da8]/60 hover:text-white transition-colors"
        >
          X
        </a>
        , or our official{' '}
        <a 
          href="https://t.me/RewindStatic" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#ff2da8] font-bold underline decoration-[#ff2da8]/60 hover:text-white transition-colors"
        >
          Telegram
        </a>
        . Anyone DMing you a CA before that isn’t us.
      </>
    ),
  },
  {
    q: 'What chain is $RWD on?',
    a: 'Solana.',
  },
  {
    q: 'Is this financial advice?',
    a: 'No. $RWD is a meme coin with no intrinsic value or guaranteed outcome. It’s community entertainment, not an investment product. Only ever put in what you can afford to lose, and always do your own research.',
  },
]

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(4)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleCopyCA = () => {
    navigator.clipboard.writeText('aZXVx5Q5hwQQkSp5sJ8hWoNzjX4nFHQHmBX6oCjpump')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index))
  }

  // GSAP Parallax & subtle ScrollTrigger enhancements
  useEffect(() => {
    if (!containerRef.current) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Hero background subtle parallax
      gsap.to('.hero-bg-parallax', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <main ref={containerRef} className="relative w-full bg-black text-white selection:bg-fuchsia-600 selection:text-white">
      
      {/* ========================================================================= */}
      {/* NAVBAR (Relative above Hero on Mobile, Fixed on PC / Desktop) */}
      {/* ========================================================================= */}
      <header className="relative md:fixed top-0 left-0 right-0 z-50 w-full bg-black/90 md:bg-black/80 backdrop-blur-xl border-b border-purple-900/40 transition-all duration-300 select-none">
        <div className="max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 h-16 sm:h-20 md:h-24 flex items-center justify-between">
          
          {/* Logo on Left */}
          <a href="#" className="flex items-center gap-3 group py-1.5 md:py-2">
            <Image
              src="/logo-text-with tagline.png"
              alt="Rewind Static Logo"
              width={340}
              height={95}
              priority
              className="h-9 sm:h-12 md:h-16 lg:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_20px_rgba(232,54,220,0.4)]"
            />
          </a>

          {/* Desktop Navlinks on Right (No Buy Button, Neon Glow on Hover) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-10">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-morton font-black text-xs sm:text-sm lg:text-[15px] uppercase tracking-wider text-zinc-300 transition-all duration-200 hover:text-white hover:neon-text-glow hover:scale-105 active:scale-95"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-purple-800/80 bg-purple-950/40 text-white hover:text-fuchsia-300 focus:outline-none cursor-pointer transition-colors shadow-[0_0_12px_rgba(147,51,234,0.3)]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <CloseIcon className="h-6 w-6 text-fuchsia-400" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: 'auto', 
                opacity: 1,
                transition: { height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }, opacity: { duration: 0.2 } }
              }}
              exit={{ 
                height: 0, 
                opacity: 0,
                transition: { height: { duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }, opacity: { duration: 0.15 } }
              }}
              className="md:hidden border-b border-purple-900/60 bg-[#0c0217]/95 backdrop-blur-2xl overflow-hidden px-6 py-6 shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
            >
              <div className="flex flex-col space-y-4">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-morton font-black text-base uppercase tracking-wider text-zinc-300 hover:text-white hover:neon-text-glow transition-all py-1.5 border-b border-purple-900/30"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      {/* ========================================================================= */}
      {/* SECTION 1: HERO SECTION (Dedicated min-h-screen with scoped background) */}
      {/* ========================================================================= */}
      <section id="hero-section" className="relative min-h-screen w-full overflow-hidden bg-black text-white flex flex-col justify-center select-none">
        
        {/* Desktop Background (Landscape with TV on left) - Scoped strictly to Hero */}
        <div className="hero-bg-parallax absolute inset-0 hidden md:block z-0 pointer-events-none">
          <Image
            src="/hero-bg.png"
            alt="Rewind Hero Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            quality={95}
          />
        </div>

        {/* Mobile Background (Portrait with TV at bottom, empty top/mid) - Scoped strictly to Hero */}
        <div className="absolute inset-0 block md:hidden z-0 pointer-events-none">
          <Image
            src="/hero-bg-mobile.png"
            alt="Rewind Hero Mobile Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-bottom"
            quality={95}
          />
        </div>

        {/* Subtle retro vignette overlay */}
        <div 
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.4)_100%)] opacity-70"
          aria-hidden="true"
        />

        {/* HERO CONTENT CONTAINER */}
        <div className="relative z-10 w-full min-h-screen flex flex-col justify-start md:justify-center px-4 sm:px-6 md:px-10 lg:px-14 pt-4 sm:pt-8 md:pt-0 pb-0">
          
          {/* Main Grid: Left is empty for TV on desktop; Right contains the Hero Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 w-full max-w-7xl mx-auto items-center">
            
            {/* Left Column (Desktop Spacer: allows the background TV to show clearly) */}
            <div className="hidden md:block md:col-span-6 lg:col-span-6 pointer-events-none" />

            {/* Right Column (Hero Content: Shifted up on mobile, Scaled 20% Bigger) */}
            <div className="col-span-1 md:col-span-6 lg:col-span-6 flex flex-col items-center justify-center text-center -translate-y-4 xs:-translate-y-6 sm:-translate-y-8 md:translate-y-0 pt-2 sm:pt-4 md:pt-0 pb-20 md:pb-0 transform scale-105 xs:scale-110 md:scale-120 origin-top md:origin-center">
              
              {/* 1. HERO-TEXT LOGO IMAGE */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ ...springConfigs.snappy, duration: 0.8 }}
                className="relative w-full max-w-[340px] xs:max-w-[400px] sm:max-w-[500px] md:max-w-[560px] lg:max-w-[620px] flex justify-center mb-2 sm:mb-3"
              >
                <Image
                  src="/hero-text.png"
                  alt="REWIND STATIC"
                  width={612}
                  height={408}
                  priority
                  className="w-full h-auto object-contain transition-transform duration-500 hover:scale-[1.02]"
                />
              </motion.div>

              {/* 2. TEXT IN MORTON FONT: $RWD & THE GOOD OLD DAYS */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springConfigs.fluid, delay: 0.2 }}
                className="flex flex-col items-center justify-center -mt-2 sm:-mt-3 md:-mt-4 mb-7 sm:mb-9"
              >
                {/* $RWD */}
                <span className="font-morton font-black uppercase tracking-wide text-5xl xs:text-6xl sm:text-7xl md:text-7xl lg:text-8xl text-white neon-text-glow leading-none select-none transition-all duration-300 hover:tracking-wider hover:brightness-125">
                  $RWD
                </span>

                {/* THE GOOD OLD DAYS */}
                <span className="font-morton font-extrabold uppercase tracking-wider text-2xl xs:text-3xl sm:text-4xl md:text-4xl lg:text-5xl text-white/95 neon-text-glow-subtle mt-1.5 sm:mt-2.5 select-none transition-all duration-300 hover:brightness-125">
                  THE GOOD OLD DAYS
                </span>
              </motion.div>

              {/* 3. RECTANGULAR MAGNETIC BUTTON WITH CONTINUOUS ROTATING NEON PURPLE BORDER */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springConfigs.fluid, delay: 0.35 }}
                className="flex justify-center items-center"
              >
                <Magnetic strength={0.35} className="inline-block">
                  <a
                    href="#how-to-buy"
                    className="group relative inline-flex items-center justify-center p-[2px] rounded-none overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none"
                  >
                    {/* Rotating Neon Purple Laser Border Beam */}
                    <div
                      className="absolute -inset-[200%] animate-spin-neon pointer-events-none"
                      style={{
                        background: 'conic-gradient(from 0deg, transparent 0deg, transparent 200deg, #9333ea 250deg, #d946ef 290deg, #f472b6 330deg, #ffffff 350deg, #a855f7 360deg)',
                      }}
                      aria-hidden="true"
                    />

                    {/* Secondary Glow Layer for Intense Rotating Neon Atmosphere */}
                    <div
                      className="absolute -inset-[200%] animate-spin-neon pointer-events-none blur-md opacity-80"
                      style={{
                        background: 'conic-gradient(from 0deg, transparent 0deg, transparent 180deg, #7e22ce 240deg, #c026d3 280deg, #e879f9 330deg, #ffffff 350deg, #a855f7 360deg)',
                      }}
                      aria-hidden="true"
                    />

                    {/* Static Ambient Neon Purple Border Fallback/Base */}
                    <div className="absolute inset-0 border border-purple-500/40 rounded-none pointer-events-none" />

                    {/* Sharp Rectangular Button Inner Body */}
                    <div className="relative z-10 rounded-none bg-[#090111] px-10 sm:px-12 py-3.5 sm:py-4 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:bg-[#150226]">
                      
                      {/* Subtle inner hover neon sheen */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-500/30 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
                        aria-hidden="true"
                      />

                      {/* Light sweep gleam on hover */}
                      <div 
                        className="absolute inset-0 overflow-hidden pointer-events-none"
                        aria-hidden="true"
                      >
                        <div className="absolute -inset-full top-0 bg-gradient-to-r from-transparent via-white/25 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                      </div>

                      {/* Button Text (Frygia, Sharp, Bold) */}
                      <span className="relative z-10 font-frygia font-black text-base sm:text-lg tracking-widest uppercase text-white group-hover:text-fuchsia-100 drop-shadow-[0_0_10px_rgba(232,54,220,0.8)] transition-colors duration-300">
                        BUY $RWD
                      </span>
                    </div>
                  </a>
                </Magnetic>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CONTINUOUS NEON LIGHTED TICKER / MARQUEE */}
      {/* ========================================================================= */}
      <div className="relative z-20 w-full overflow-hidden bg-[#0a0014] border-y-2 border-fuchsia-500/40 py-3.5 sm:py-4.5 shadow-[0_0_25px_rgba(232,54,220,0.35)] select-none">
        
        {/* Soft neon backdrop gradient line */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-fuchsia-600/10 to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* Continuous Animated Ticker Track */}
        <div className="animate-marquee flex items-center whitespace-nowrap">
          {[...Array(5)].map((_, loopIndex) => (
            <div key={loopIndex} className="flex items-center gap-6 sm:gap-10 mx-3 sm:mx-5">
              {TICKER_ITEMS.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center gap-6 sm:gap-10">
                  <span className="font-morton font-bold uppercase tracking-widest text-lg sm:text-xl md:text-2xl text-pink-300 drop-shadow-[0_0_8px_rgba(244,114,182,0.8)] hover:text-white transition-colors duration-200">
                    {item}
                  </span>
                  <span className="text-fuchsia-400 text-base sm:text-lg drop-shadow-[0_0_10px_rgba(232,54,220,0.9)] animate-pulse">
                    ✦
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: REMEMBER WHEN LIFE WAS SIMPLE? */}
      {/* ========================================================================= */}
      <section 
        id="nostalgia" 
        className="relative z-20 w-full bg-gradient-to-b from-[#06000c] via-[#090114] to-[#040008] py-16 sm:py-20 md:py-24 overflow-hidden"
      >
        {/* Background ambient lighting */}
        <div 
          className="pointer-events-none absolute top-1/2 left-10 -translate-y-1/2 -z-0 h-[450px] w-[450px] rounded-full bg-fuchsia-600/10 blur-[140px]" 
          aria-hidden="true" 
        />
        <div 
          className="pointer-events-none absolute top-1/2 right-10 -translate-y-1/2 -z-0 h-[550px] w-[550px] rounded-full bg-purple-600/15 blur-[150px]" 
          aria-hidden="true" 
        />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
               {/* Left Column: Heading, Wide Story Copy, and Big Neon Icons */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              
              {/* Heading in Morton Font (Clean White with Neon Glow) */}
              <div className="mb-6 sm:mb-8">
                <h2 className="font-morton font-black uppercase tracking-wider text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-none select-none neon-text-glow">
                  REMEMBER WHEN
                </h2>
                <h2 className="font-morton font-black uppercase tracking-wider text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight mt-1 sm:mt-2 select-none neon-text-glow">
                  LIFE WAS SIMPLE?
                </h2>
                <div className="h-[2px] w-32 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-transparent mt-3.5" />
              </div>

              {/* Story Narrative Text in Frygia */}
              <div className="space-y-3.5 sm:space-y-4 text-zinc-300 font-frygia text-base sm:text-lg leading-relaxed font-normal">
                <p>
                  Rush home from school. Drop the bag by the door. Grab the cereal — dry, straight from the box. Flip through the channels until the right cartoon lands.
                </p>
                <p>
                  The VHS crackles. The tracking lines dance for a second before the picture settles. For twenty-two minutes, nothing else in the world matters.
                </p>
                <p>
                  That feeling didn’t disappear. It just got taped over. Rewind Static is the rerun — the same warm static, brought back for a generation that grew up and started trading memecoins instead of Pogs.
                </p>
              </div>

              {/* Icons from /ICON.png (Public Asset) */}
              <div className="mt-6 sm:mt-8 flex items-center">
                <div className="relative w-full max-w-[240px] xs:max-w-[280px] sm:max-w-[340px] md:max-w-[380px]">
                  <Image
                    src="/ICON.png"
                    alt="Retro Icons"
                    width={738}
                    height={338}
                    priority
                    className="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(232,54,220,0.55)] transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>

            </div>

            {/* Right Column: DN.png */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end items-center w-full pointer-events-none">
              <div className="relative w-full max-w-[500px] sm:max-w-[580px] md:max-w-[650px] lg:max-w-[700px] flex items-center justify-center">
                <Image
                  src="/DN.png"
                  alt="Rewind Static Friends"
                  width={512}
                  height={280}
                  priority
                  className="w-full h-auto object-contain block drop-shadow-[0_0_35px_rgba(168,85,247,0.4)] transform hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: THE PLAN */}
      {/* ========================================================================= */}
      <section 
        id="the-plan" 
        className="relative z-20 w-full bg-gradient-to-b from-[#040008] via-[#090114] to-[#020005] border-t border-purple-950/60 py-16 sm:py-20 md:py-24 overflow-hidden select-none"
      >
        {/* Ambient atmospheric backdrop glows */}
        <div 
          className="pointer-events-none absolute top-1/3 left-1/4 -translate-y-1/2 -z-0 h-[450px] w-[450px] rounded-full bg-fuchsia-600/10 blur-[150px]" 
          aria-hidden="true" 
        />
        <div 
          className="pointer-events-none absolute bottom-1/4 right-10 -z-0 h-[500px] w-[500px] rounded-full bg-purple-600/15 blur-[160px]" 
          aria-hidden="true" 
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* ==================== LEFT COLUMN: VERTICAL 3 STEPS ==================== */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              
              {/* Section Header */}
              <div className="mb-8 sm:mb-10">
                <div className="flex items-center gap-3 sm:gap-4">
                  <h2 className="font-morton font-black uppercase tracking-wider text-4xl sm:text-5xl lg:text-6xl text-white select-none neon-text-glow leading-tight">
                    THE PLAN
                  </h2>
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-fuchsia-500/60 via-purple-500/30 to-transparent" />
                </div>
                
                <p className="mt-2 text-zinc-400 font-frygia text-sm sm:text-base">
                  Three simple steps to rewind back to the golden age and blast off.
                </p>
              </div>

              {/* Vertical Steps List with Connected Line */}
              <div className="relative flex flex-col space-y-5 sm:space-y-6">
                
                {/* Vertical neon connector line */}
                <div 
                  className="absolute left-7 sm:left-8 top-8 bottom-8 w-[2px] bg-gradient-to-b from-fuchsia-500 via-purple-500 to-pink-500 opacity-30 pointer-events-none" 
                  aria-hidden="true"
                />

                {/* ---------------- STEP 1: WATCH CARTOON ---------------- */}
                <div className="group relative flex items-start gap-4 sm:gap-6 rounded-2xl border border-purple-900/50 bg-[#0c0217]/85 p-5 sm:p-6 backdrop-blur-sm transition-all duration-300 hover:border-[#e836dc] hover:bg-[#130325] hover:shadow-[0_0_30px_rgba(232,54,220,0.25)] hover:-translate-y-1">
                  
                  {/* Left Icon + Number Badge */}
                  <div className="relative flex-shrink-0 flex items-center justify-center">
                    <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border border-fuchsia-500/50 bg-gradient-to-br from-fuchsia-950/80 to-[#120020] text-fuchsia-400 shadow-[0_0_16px_rgba(232,54,220,0.35)] transition-all duration-300 group-hover:scale-105 group-hover:border-fuchsia-400 group-hover:text-white group-hover:shadow-[0_0_24px_rgba(232,54,220,0.6)]">
                      <Tv className="h-7 w-7 sm:h-8 sm:w-8 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border border-fuchsia-400 bg-fuchsia-600 font-frygia text-xs font-bold text-white shadow-[0_0_8px_rgba(232,54,220,0.8)]">
                      1
                    </span>
                  </div>

                  {/* Right Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-baseline justify-between gap-2 flex-wrap">
                      <h3 className="font-morton font-black uppercase tracking-wide text-2xl sm:text-3xl text-white transition-colors duration-200 group-hover:text-fuchsia-300">
                        WATCH CARTOON
                      </h3>
                      <span className="text-[11px] font-frygia font-bold uppercase tracking-widest text-fuchsia-400/80">
                        STEP 01
                      </span>
                    </div>
                    <p className="mt-1 text-zinc-300 font-frygia text-sm sm:text-base leading-relaxed">
                      Tune into pure Saturday morning nostalgia. Grab your cereal, crank up the static, and relive the unbothered 90s vibes.
                    </p>
                  </div>
                </div>

                {/* ---------------- STEP 2: CHART GO UP ---------------- */}
                <div className="group relative flex items-start gap-4 sm:gap-6 rounded-2xl border border-purple-900/50 bg-[#0c0217]/85 p-5 sm:p-6 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/80 hover:bg-[#130325] hover:shadow-[0_0_30px_rgba(52,211,153,0.25)] hover:-translate-y-1">
                  
                  {/* Left Icon + Number Badge */}
                  <div className="relative flex-shrink-0 flex items-center justify-center">
                    <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border border-emerald-500/50 bg-gradient-to-br from-emerald-950/80 to-[#120020] text-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.35)] transition-all duration-300 group-hover:scale-105 group-hover:border-emerald-400 group-hover:text-white group-hover:shadow-[0_0_24px_rgba(52,211,153,0.6)]">
                      <TrendingUp className="h-7 w-7 sm:h-8 sm:w-8 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border border-emerald-400 bg-emerald-600 font-frygia text-xs font-bold text-white shadow-[0_0_8px_rgba(52,211,153,0.8)]">
                      2
                    </span>
                  </div>

                  {/* Right Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-baseline justify-between gap-2 flex-wrap">
                      <h3 className="font-morton font-black uppercase tracking-wide text-2xl sm:text-3xl text-white transition-colors duration-200 group-hover:text-emerald-300">
                        CHART GO UP
                      </h3>
                      <span className="text-[11px] font-frygia font-bold uppercase tracking-widest text-emerald-400/80">
                        STEP 02
                      </span>
                    </div>
                    <p className="mt-1 text-zinc-300 font-frygia text-sm sm:text-base leading-relaxed">
                      Green candles, organic hype, and relentless momentum. The community rallies as the ticker climbs off the chart.
                    </p>
                  </div>
                </div>

                {/* ---------------- STEP 3: SEND IT ---------------- */}
                <div className="group relative flex items-start gap-4 sm:gap-6 rounded-2xl border border-purple-900/50 bg-[#0c0217]/85 p-5 sm:p-6 backdrop-blur-sm transition-all duration-300 hover:border-pink-500/80 hover:bg-[#130325] hover:shadow-[0_0_30px_rgba(244,114,182,0.25)] hover:-translate-y-1">
                  
                  {/* Left Icon + Number Badge */}
                  <div className="relative flex-shrink-0 flex items-center justify-center">
                    <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border border-pink-500/50 bg-gradient-to-br from-pink-950/80 to-[#120020] text-pink-400 shadow-[0_0_16px_rgba(244,114,182,0.35)] transition-all duration-300 group-hover:scale-105 group-hover:border-pink-400 group-hover:text-white group-hover:shadow-[0_0_24px_rgba(244,114,182,0.6)]">
                      <Rocket className="h-7 w-7 sm:h-8 sm:w-8 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border border-pink-400 bg-pink-600 font-frygia text-xs font-bold text-white shadow-[0_0_8px_rgba(244,114,182,0.8)]">
                      3
                    </span>
                  </div>

                  {/* Right Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-baseline justify-between gap-2 flex-wrap">
                      <h3 className="font-morton font-black uppercase tracking-wide text-2xl sm:text-3xl text-white transition-colors duration-200 group-hover:text-pink-300">
                        SEND IT
                      </h3>
                      <span className="text-[11px] font-frygia font-bold uppercase tracking-widest text-pink-400/80">
                        STEP 03
                      </span>
                    </div>
                    <p className="mt-1 text-zinc-300 font-frygia text-sm sm:text-base leading-relaxed">
                      Tape over the noise. Full throttle vibes straight into the stratosphere with zero hesitation and no looking back.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* ==================== RIGHT COLUMN: BIG ANIMATED TV GIF ==================== */}
            <div className="lg:col-span-5 flex justify-center items-center w-full">
              <div className="relative w-full max-w-[480px] sm:max-w-[540px] lg:max-w-none flex items-center justify-center">
                
                {/* Intense Ambient Glow behind the TV */}
                <div 
                  className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-tr from-fuchsia-600/30 via-purple-600/25 to-pink-500/25 blur-[90px] rounded-full transform scale-90"
                  aria-hidden="true" 
                />

                {/* TV GIF Container with Retro Styling & Glow */}
                <div className="relative w-full flex items-center justify-center group">
                  <Image
                    src="/tv-aniamted.gif"
                    alt="Rewind Static Animated TV"
                    width={640}
                    height={640}
                    unoptimized
                    priority
                    className="w-full h-auto object-contain drop-shadow-[0_0_35px_rgba(232,54,220,0.5)] transition-transform duration-500 hover:scale-[1.03]"
                  />
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: PLAY REWINDCLIMBER (Image Left | Details & CTA Right) */}
      {/* ========================================================================= */}
      <section 
        id="rewind-climber" 
        className="relative z-20 w-full bg-gradient-to-b from-[#020005] via-[#080112] to-black border-t border-purple-950/60 py-16 sm:py-20 md:py-28 overflow-hidden select-none"
      >
        {/* Ambient atmospheric glows */}
        <div 
          className="pointer-events-none absolute top-1/2 left-10 -translate-y-1/2 -z-0 h-[450px] w-[450px] rounded-full bg-fuchsia-600/10 blur-[150px]" 
          aria-hidden="true" 
        />
        <div 
          className="pointer-events-none absolute top-1/3 right-10 -translate-y-1/2 -z-0 h-[500px] w-[500px] rounded-full bg-purple-600/15 blur-[160px]" 
          aria-hidden="true" 
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* ==================== LEFT COLUMN: GAME IMAGE ==================== */}
            <div className="game-arcade lg:col-span-6 flex justify-center items-center w-full">
              <div className="relative w-full max-w-[580px] group">
                
                {/* Glow behind frame */}
                <div 
                  className="pointer-events-none absolute -inset-2 bg-gradient-to-r from-fuchsia-600/30 via-purple-600/30 to-pink-500/30 blur-2xl rounded-3xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" 
                  aria-hidden="true"
                />

                {/* Retro Arcade Container */}
                <div className="relative rounded-2xl sm:rounded-3xl border-2 border-purple-800/60 bg-[#0c0217]/90 p-2.5 sm:p-3.5 backdrop-blur-md shadow-[0_0_35px_rgba(232,54,220,0.3)] transition-all duration-500 group-hover:border-fuchsia-500 group-hover:shadow-[0_0_50px_rgba(232,54,220,0.5)]">
                  
                  {/* Arcade Header Bar */}
                  <div className="flex items-center justify-between px-3 py-2 border-b border-purple-900/50 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    </div>
                    <span className="font-mono text-[11px] uppercase tracking-widest text-fuchsia-400 font-semibold">
                      REWIND HIGH • v1.0
                    </span>
                  </div>

                  {/* Main Image */}
                  <div className="relative overflow-hidden rounded-xl bg-black">
                    <Image
                      src="/game.png"
                      alt="Rewind Climber Arcade Game"
                      width={720}
                      height={460}
                      priority
                      className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Subtle Scanline Overlay */}
                    <div 
                      className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] opacity-30" 
                      aria-hidden="true" 
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* ==================== RIGHT COLUMN: TEXT & CTA ==================== */}
            <div className="game-info lg:col-span-6 flex flex-col justify-center">
              
              {/* Heading in Morton font */}
              <div className="mb-5 sm:mb-6">
                <h2 className="font-morton font-black uppercase tracking-wider text-4xl sm:text-5xl lg:text-6xl text-white select-none neon-text-glow leading-tight">
                  PLAY REWINDCLIMBER.
                </h2>
                <div className="h-[2px] w-32 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-transparent mt-3" />
              </div>

              {/* Hook Paragraph in Frygia font */}
              <p className="text-zinc-300 font-frygia text-base sm:text-lg leading-relaxed mb-6 sm:mb-7">
                Jump your way up through the halls of Rewind High — dodge the drop, grab the combo, chase the high score. A free pixel-platformer for the whole Rewind Crew, no download, no wallet, just vibes.
              </p>

              {/* 4 Feature Bullet Cards (2x2 Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 mb-7 sm:mb-8">
                
                {/* 1. In Browser */}
                <div className="flex items-center gap-3 p-3 sm:p-3.5 rounded-xl border border-purple-900/50 bg-[#0c0217]/70 backdrop-blur-sm transition-all duration-200 hover:border-fuchsia-500/60 hover:bg-[#140426]">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-400 shrink-0">
                    <Gamepad2 className="h-4.5 w-4.5" />
                  </div>
                  <span className="font-frygia text-xs sm:text-sm text-zinc-200 leading-snug">
                    Right in your browser, opens in a new tab
                  </span>
                </div>

                {/* 2. Live Leaderboard */}
                <div className="flex items-center gap-3 p-3 sm:p-3.5 rounded-xl border border-purple-900/50 bg-[#0c0217]/70 backdrop-blur-sm transition-all duration-200 hover:border-amber-500/60 hover:bg-[#140426]">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-400 shrink-0">
                    <Trophy className="h-4.5 w-4.5" />
                  </div>
                  <span className="font-frygia text-xs sm:text-sm text-zinc-200 leading-snug">
                    Live global leaderboard
                  </span>
                </div>

                {/* 3. Mobile Friendly */}
                <div className="flex items-center gap-3 p-3 sm:p-3.5 rounded-xl border border-purple-900/50 bg-[#0c0217]/70 backdrop-blur-sm transition-all duration-200 hover:border-purple-500/60 hover:bg-[#140426]">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-purple-500/40 bg-purple-500/10 text-purple-400 shrink-0">
                    <Smartphone className="h-4.5 w-4.5" />
                  </div>
                  <span className="font-frygia text-xs sm:text-sm text-zinc-200 leading-snug">
                    On mobile? Best in wallet's browser
                  </span>
                </div>

                {/* 4. Token Requirement */}
                <div className="flex items-center gap-3 p-3 sm:p-3.5 rounded-xl border border-purple-900/50 bg-[#0c0217]/70 backdrop-blur-sm transition-all duration-200 hover:border-emerald-500/60 hover:bg-[#140426]">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shrink-0">
                    <Coins className="h-4.5 w-4.5" />
                  </div>
                  <span className="font-frygia text-xs sm:text-sm text-zinc-200 leading-snug">
                    Hold at least $5 in $RWD to play
                  </span>
                </div>

              </div>

              {/* Play Button CTA */}
              <div className="mb-6 sm:mb-7">
                <Magnetic strength={0.3} className="inline-block">
                  <a
                    href="https://rwdretrorun.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center justify-center p-[2px] rounded-none overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none"
                  >
                    {/* Rotating Neon Laser Border */}
                    <div
                      className="absolute -inset-[200%] animate-spin-neon pointer-events-none"
                      style={{
                        background: 'conic-gradient(from 0deg, transparent 0deg, transparent 200deg, #ec4899 250deg, #d946ef 290deg, #a855f7 330deg, #ffffff 350deg, #ec4899 360deg)',
                      }}
                      aria-hidden="true"
                    />

                    {/* Secondary Glow Layer */}
                    <div
                      className="absolute -inset-[200%] animate-spin-neon pointer-events-none blur-md opacity-80"
                      style={{
                        background: 'conic-gradient(from 0deg, transparent 0deg, transparent 180deg, #db2777 240deg, #c026d3 280deg, #9333ea 330deg, #ffffff 350deg, #ec4899 360deg)',
                      }}
                      aria-hidden="true"
                    />

                    {/* Static Ambient Neon Purple Border Fallback */}
                    <div className="absolute inset-0 border border-fuchsia-500/50 rounded-none pointer-events-none" />

                    {/* Inner Button Body */}
                    <div className="relative z-10 rounded-none bg-[#090111] px-8 sm:px-10 py-3.5 sm:py-4 flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 group-hover:bg-[#160228]">
                      
                      {/* Subtle hover neon background shimmer */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-pink-600/20 via-purple-500/30 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
                        aria-hidden="true"
                      />

                      {/* Button Text in Frygia */}
                      <span className="relative z-10 font-frygia font-black text-sm sm:text-base tracking-widest uppercase text-white group-hover:text-pink-100 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)] transition-colors duration-300 flex items-center gap-2">
                        Play Rewind Climber
                        <ExternalLink className="h-4 w-4 text-pink-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                      </span>
                    </div>
                  </a>
                </Magnetic>
              </div>

              {/* How it works Information Callout Card */}
              <div className="rounded-xl border border-purple-900/60 bg-purple-950/20 p-3.5 sm:p-4 flex items-start gap-3 backdrop-blur-sm">
                <Info className="h-5 w-5 text-fuchsia-400 shrink-0 mt-0.5" />
                <p className="font-frygia text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  <span className="text-zinc-200 font-bold">How it works:</span> Each session costs 3 $RWD, sent straight to the Pool wallet that funds the in-game token to $RWD swap — current rate is 3 in-game coins per 1 $RWD, subject to change. Jupiter wallet support is still in the works.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: REWIND PFP STUDIO (Tape Studio & Avatar Maker) */}
      {/* ========================================================================= */}
      <section 
        id="rewind-pfp" 
        className="relative z-20 w-full bg-gradient-to-b from-black via-[#0a0118] to-[#020005] border-t border-purple-950/60 py-20 sm:py-24 md:py-32 overflow-hidden select-none"
      >
        {/* Ambient atmospheric lighting */}
        <div 
          className="pointer-events-none absolute top-1/2 left-10 -translate-y-1/2 -z-0 h-[480px] w-[480px] rounded-full bg-fuchsia-600/15 blur-[160px]" 
          aria-hidden="true" 
        />
        <div 
          className="pointer-events-none absolute top-1/3 right-10 -translate-y-1/2 -z-0 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[170px]" 
          aria-hidden="true" 
        />

        <div className="relative z-10 max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 xl:gap-16 items-center">
            
            {/* ==================== LEFT COLUMN: PFP COPY & FEATURES & CTA ==================== */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              
              {/* Section Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-fuchsia-500/40 bg-fuchsia-950/30 text-fuchsia-300 font-mono text-xs uppercase tracking-widest mb-4 w-fit shadow-[0_0_15px_rgba(232,54,220,0.3)]">
                <span className="h-2 w-2 rounded-full bg-[#ff2da8] animate-pulse" />
                04 / TAPE STUDIO
              </div>

              {/* Heading in Morton font */}
              <div className="mb-5 sm:mb-6">
                <h2 className="font-morton font-black uppercase tracking-wider text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white select-none neon-text-glow leading-tight">
                  MAKE YOUR <br />
                  <span className="text-[#ff2da8]">REWIND PFP.</span>
                </h2>
                <div className="h-[2px] w-36 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-transparent mt-3.5" />
              </div>

              {/* Lede Paragraph in Frygia */}
              <p className="text-zinc-300 font-frygia text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
                Feed it your photo, tune the channel, dial in the tracking — eject a glitched-out VHS avatar built for X, Telegram and Discord. Free creative tool for the whole Rewind Crew.
              </p>

              {/* 4 Feature Bullet Cards (2x2 Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mb-8 sm:mb-10">
                
                {/* 1. PNG Export */}
                <div className="flex items-start gap-3.5 p-4 rounded-2xl border border-purple-900/50 bg-[#0c0217]/80 backdrop-blur-sm transition-all duration-200 hover:border-fuchsia-500/70 hover:bg-[#140426] hover:shadow-[0_0_20px_rgba(232,54,220,0.2)]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-400 shrink-0 mt-0.5">
                    <Download className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-morton font-black text-white text-base uppercase tracking-wide">
                      PNG Export
                    </h4>
                    <p className="font-frygia text-xs sm:text-sm text-zinc-400 leading-snug mt-0.5">
                      Crisp, high-res export ready to set as your profile avatar on X.
                    </p>
                  </div>
                </div>

                {/* 2. Animated GIF Export */}
                <div className="flex items-start gap-3.5 p-4 rounded-2xl border border-purple-900/50 bg-[#0c0217]/80 backdrop-blur-sm transition-all duration-200 hover:border-[#38c7bc]/70 hover:bg-[#140426] hover:shadow-[0_0_20px_rgba(56,199,188,0.2)]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#38c7bc]/40 bg-[#38c7bc]/10 text-[#38c7bc] shrink-0 mt-0.5">
                    <Film className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-morton font-black text-white text-base uppercase tracking-wide">
                      Animated GIF Export
                    </h4>
                    <p className="font-frygia text-xs sm:text-sm text-zinc-400 leading-snug mt-0.5">
                      Dynamic VHS glitch frames optimized for Telegram & Discord.
                    </p>
                  </div>
                </div>

                {/* 3. 5 Channel Tints */}
                <div className="flex items-start gap-3.5 p-4 rounded-2xl border border-purple-900/50 bg-[#0c0217]/80 backdrop-blur-sm transition-all duration-200 hover:border-amber-500/70 hover:bg-[#140426] hover:shadow-[0_0_20px_rgba(244,123,33,0.2)]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                    <Palette className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-morton font-black text-white text-base uppercase tracking-wide">
                      5 Channel Tints
                    </h4>
                    <p className="font-frygia text-xs sm:text-sm text-zinc-400 leading-snug mt-0.5">
                      Original color retention, Static Blu, Phosphor Grn, Amb & Magenta.
                    </p>
                  </div>
                </div>

                {/* 4. 100% Private */}
                <div className="flex items-start gap-3.5 p-4 rounded-2xl border border-purple-900/50 bg-[#0c0217]/80 backdrop-blur-sm transition-all duration-200 hover:border-emerald-500/70 hover:bg-[#140426] hover:shadow-[0_0_20px_rgba(52,211,153,0.2)]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-morton font-black text-white text-base uppercase tracking-wide">
                      100% Private
                    </h4>
                    <p className="font-frygia text-xs sm:text-sm text-zinc-400 leading-snug mt-0.5">
                      Client-side canvas engine — your photo never leaves your browser.
                    </p>
                  </div>
                </div>

              </div>

              {/* Magnetic CTA Button to /pfp */}
              <div>
                <Magnetic strength={0.3} className="inline-block">
                  <Link
                    href="/pfp"
                    className="group relative inline-flex items-center justify-center p-[2px] rounded-none overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none"
                  >
                    {/* Rotating Neon Laser Border */}
                    <div
                      className="absolute -inset-[200%] animate-spin-neon pointer-events-none"
                      style={{
                        background: 'conic-gradient(from 0deg, transparent 0deg, transparent 200deg, #ff2da8 250deg, #d946ef 290deg, #38c7bc 330deg, #ffffff 350deg, #ff2da8 360deg)',
                      }}
                      aria-hidden="true"
                    />

                    {/* Secondary Glow Layer */}
                    <div
                      className="absolute -inset-[200%] animate-spin-neon pointer-events-none blur-md opacity-80"
                      style={{
                        background: 'conic-gradient(from 0deg, transparent 0deg, transparent 180deg, #e836dc 240deg, #c026d3 280deg, #38c7bc 330deg, #ffffff 350deg, #ff2da8 360deg)',
                      }}
                      aria-hidden="true"
                    />

                    {/* Static Ambient Neon Purple Border Fallback */}
                    <div className="absolute inset-0 border border-fuchsia-500/50 rounded-none pointer-events-none" />

                    {/* Inner Button Body */}
                    <div className="relative z-10 rounded-none bg-[#090111] px-8 sm:px-11 py-4 sm:py-4.5 flex items-center justify-center gap-2.5 overflow-hidden transition-all duration-300 group-hover:bg-[#160228]">
                      
                      {/* Subtle hover neon background shimmer */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-fuchsia-600/25 via-purple-500/30 to-fuchsia-600/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
                        aria-hidden="true"
                      />

                      {/* Button Text in Frygia */}
                      <span className="relative z-10 font-frygia font-black text-sm sm:text-base tracking-widest uppercase text-white group-hover:text-fuchsia-100 drop-shadow-[0_0_10px_rgba(232,54,220,0.8)] transition-colors duration-300 flex items-center gap-2">
                        OPEN THE PFP GENERATOR
                        <ExternalLink className="h-4 w-4 text-fuchsia-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                      </span>
                    </div>
                  </Link>
                </Magnetic>
              </div>

            </div>

            {/* ==================== RIGHT COLUMN: INTERACTIVE RETRO TV MOCKUP ==================== */}
            <div className="lg:col-span-5 flex justify-center items-center w-full">
              <Link 
                href="/pfp" 
                className="group relative w-full max-w-[500px] flex flex-col items-center cursor-pointer block"
                title="Launch Rewind My PFP Generator"
              >
                
                {/* Glow behind TV frame */}
                <div 
                  className="pointer-events-none absolute -inset-3 bg-gradient-to-tr from-fuchsia-600/30 via-purple-600/30 to-[#38c7bc]/30 blur-2xl rounded-3xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" 
                  aria-hidden="true" 
                />

                {/* Character Combo Header Overlay */}
                <div className="relative -mb-6 z-20 flex items-end justify-center gap-3">
                  <div className="relative w-20 sm:w-24 -rotate-6 transform transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12">
                    <Image
                      src="/characters/kid-fist.png"
                      alt="Rewind Kid"
                      width={120}
                      height={120}
                      className="w-full h-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                    />
                  </div>
                  <div className="relative w-16 sm:w-20 rotate-12 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Image
                      src="/characters/vhs-tape.png"
                      alt="VHS Tape"
                      width={100}
                      height={100}
                      className="w-full h-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                    />
                  </div>
                </div>

                {/* Main TV Frame Container */}
                <div className="relative w-full rounded-3xl border-2 border-purple-800/70 bg-gradient-to-br from-[#1b0a2c] via-[#10021c] to-[#08010e] p-5 sm:p-7 backdrop-blur-md shadow-[0_0_40px_rgba(232,54,220,0.35)] transition-all duration-500 group-hover:border-fuchsia-500 group-hover:shadow-[0_0_55px_rgba(232,54,220,0.6)]">
                  
                  {/* Top LED Indicator */}
                  <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-zinc-400 mb-3 px-1">
                    <span className="flex items-center gap-2 text-fuchsia-400 font-bold">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                      CH.78 ONLINE
                    </span>
                    <span className="text-zinc-500">VHS TAPE DECK</span>
                  </div>

                  {/* Inner CRT Glitch Screen */}
                  <div className="relative aspect-[4/3] rounded-2xl bg-black overflow-hidden border border-purple-900/60 flex flex-col justify-between p-4 shadow-inner">
                    
                    {/* Retro Scanlines */}
                    <div 
                      className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] opacity-40 z-10" 
                      aria-hidden="true" 
                    />

                    {/* Ambient Glow & Glitch noise background */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-tr from-fuchsia-950/60 via-purple-950/40 to-[#0c0217] opacity-80" 
                      aria-hidden="true" 
                    />

                    {/* CRT OSD Top Info */}
                    <div className="relative z-20 flex items-center justify-between font-mono text-xs font-bold text-[#f6f0df] drop-shadow-[0_0_8px_rgba(232,54,220,0.8)]">
                      <span>◀◀ REW &nbsp; ×2</span>
                      <span>SP &nbsp; 00:22:14</span>
                    </div>

                    {/* Big Center Title in CRT */}
                    <div className="relative z-20 flex flex-col items-center justify-center text-center my-auto py-4">
                      <span className="font-morton font-black uppercase tracking-wider text-3xl sm:text-4xl text-white neon-text-glow leading-none">
                        REWIND <br />
                        <span className="text-[#ff2da8]">MY PFP</span>
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-400 mt-2">
                        TAP TO CUSTOMIZE ↗
                      </span>
                    </div>

                    {/* Bottom Channel Dots */}
                    <div className="relative z-20 flex items-center justify-center gap-2 pt-2 border-t border-purple-900/40">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ff2da8] shadow-[0_0_8px_#ff2da8]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#38c7bc] shadow-[0_0_8px_#38c7bc]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#f47b21] shadow-[0_0_8px_#f47b21]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#22a866] shadow-[0_0_8px_#22a866]" />
                    </div>

                  </div>

                  {/* Bottom Action Pill */}
                  <div className="mt-4 flex items-center justify-center">
                    <span className="px-5 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-frygia font-bold text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(232,54,220,0.4)] group-hover:scale-105 transition-transform duration-200 flex items-center gap-1.5">
                      Launch PFP Studio ↗
                    </span>
                  </div>

                </div>

              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: HOW TO BUY $RWD */}
      {/* ========================================================================= */}
      <section 
        id="how-to-buy" 
        className="relative z-20 w-full bg-gradient-to-b from-[#020005] via-[#090014] to-black border-t border-purple-950/60 py-20 sm:py-24 md:py-32 overflow-hidden select-none"
      >
        {/* Ambient atmospheric backdrop lighting */}
        <div 
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0 h-[550px] w-[1200px] rounded-full bg-fuchsia-600/10 blur-[190px]" 
          aria-hidden="true" 
        />

        <div className="relative z-10 max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          
          {/* Main Card Container */}
          <div className="relative w-full rounded-3xl border border-purple-900/50 bg-[#070010]/85 p-8 sm:p-12 lg:p-16 xl:p-20 backdrop-blur-md shadow-[0_0_70px_rgba(147,51,234,0.18)]">
            
            {/* Section Heading: HOW TO BUY $RWD */}
            <div className="text-center mb-16 sm:mb-20">
              <h2 
                className="font-morton font-black uppercase tracking-wider text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white select-none neon-text-glow leading-tight"
              >
                HOW TO BUY $RWD
              </h2>
              <div className="h-[2px] w-36 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-transparent mt-3.5 mx-auto" />
            </div>

            {/* 4 Steps Horizontal Flow */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6 xl:gap-8 items-start relative">
              
              {/* ================= STEP 1: GET SOL ================= */}
              <div className="relative flex flex-col items-center text-center group">
                
                {/* Connecting Arrow (Desktop) */}
                <div className="hidden lg:flex absolute -right-4 xl:-right-6 top-20 xl:top-24 -translate-y-1/2 z-20 pointer-events-none items-center justify-center">
                  <svg 
                    className="w-7 h-7 xl:w-9 xl:h-9 text-[#ff2da8] drop-shadow-[0_0_12px_#ff2da8] animate-pulse" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <polyline points="13 4 21 12 13 20" />
                  </svg>
                </div>

                {/* Circle Container */}
                <div className="relative mb-6">
                  <div className="relative flex h-36 w-36 sm:h-40 sm:w-40 xl:h-48 xl:w-48 items-center justify-center rounded-full border-[2.5px] border-[#d946ef] bg-black shadow-[0_0_25px_rgba(217,70,239,0.65)] transition-all duration-300 group-hover:scale-105 group-hover:border-[#ff2da8] group-hover:shadow-[0_0_35px_rgba(255,45,168,0.85)]">
                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 xl:h-28 xl:w-28 flex items-center justify-center">
                      <Image
                        src="/htb/sol.png"
                        alt="Solana"
                        width={120}
                        height={120}
                        priority
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  </div>
                </div>

                {/* Number Badge + Title */}
                <div className="flex items-center justify-center gap-2 mb-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#9333ea] to-[#d946ef] text-white font-frygia font-black text-sm shadow-[0_0_12px_rgba(217,70,239,0.85)] shrink-0">
                    1
                  </span>
                  <h3 className="font-morton font-black text-white text-lg sm:text-xl uppercase tracking-wide">
                    GET SOL
                  </h3>
                </div>

                {/* Description */}
                <p className="text-zinc-300 font-frygia text-sm sm:text-base leading-relaxed max-w-[260px]">
                  Buy SOL on your favorite exchange.
                </p>
              </div>

              {/* ================= STEP 2: CONNECT WALLET ================= */}
              <div className="relative flex flex-col items-center text-center group">
                
                {/* Connecting Arrow (Desktop) */}
                <div className="hidden lg:flex absolute -right-4 xl:-right-6 top-20 xl:top-24 -translate-y-1/2 z-20 pointer-events-none items-center justify-center">
                  <svg 
                    className="w-7 h-7 xl:w-9 xl:h-9 text-[#ff2da8] drop-shadow-[0_0_12px_#ff2da8] animate-pulse" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <polyline points="13 4 21 12 13 20" />
                  </svg>
                </div>

                {/* Circle Container */}
                <div className="relative mb-6">
                  <div className="relative flex h-36 w-36 sm:h-40 sm:w-40 xl:h-48 xl:w-48 items-center justify-center rounded-full border-[2.5px] border-[#d946ef] bg-black shadow-[0_0_25px_rgba(217,70,239,0.65)] transition-all duration-300 group-hover:scale-105 group-hover:border-[#ff2da8] group-hover:shadow-[0_0_35px_rgba(255,45,168,0.85)]">
                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 xl:h-28 xl:w-28 flex items-center justify-center">
                      <Image
                        src="/htb/wallet.png"
                        alt="Connect Wallet"
                        width={120}
                        height={120}
                        priority
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  </div>
                </div>

                {/* Number Badge + Title */}
                <div className="flex items-center justify-center gap-2 mb-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#9333ea] to-[#d946ef] text-white font-frygia font-black text-sm shadow-[0_0_12px_rgba(217,70,239,0.85)] shrink-0">
                    2
                  </span>
                  <h3 className="font-morton font-black text-white text-lg sm:text-xl uppercase tracking-wide">
                    CONNECT WALLET
                  </h3>
                </div>

                {/* Description */}
                <p className="text-zinc-300 font-frygia text-sm sm:text-base leading-relaxed max-w-[260px]">
                  Connect your wallet to Raydium.
                </p>
              </div>

              {/* ================= STEP 3: SWAP SOL FOR $RWD ================= */}
              <div className="relative flex flex-col items-center text-center group">
                
                {/* Connecting Arrow (Desktop) */}
                <div className="hidden lg:flex absolute -right-4 xl:-right-6 top-20 xl:top-24 -translate-y-1/2 z-20 pointer-events-none items-center justify-center">
                  <svg 
                    className="w-7 h-7 xl:w-9 xl:h-9 text-[#ff2da8] drop-shadow-[0_0_12px_#ff2da8] animate-pulse" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <polyline points="13 4 21 12 13 20" />
                  </svg>
                </div>

                {/* Circle Container */}
                <div className="relative mb-6">
                  <div className="relative flex h-36 w-36 sm:h-40 sm:w-40 xl:h-48 xl:w-48 items-center justify-center rounded-full border-[2.5px] border-[#d946ef] bg-black shadow-[0_0_25px_rgba(217,70,239,0.65)] transition-all duration-300 group-hover:scale-105 group-hover:border-[#ff2da8] group-hover:shadow-[0_0_35px_rgba(255,45,168,0.85)]">
                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 xl:h-28 xl:w-28 flex items-center justify-center">
                      <Image
                        src="/htb/swap.png"
                        alt="Swap SOL for $RWD"
                        width={120}
                        height={120}
                        priority
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  </div>
                </div>

                {/* Number Badge + Title */}
                <div className="flex items-center justify-center gap-2 mb-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#9333ea] to-[#d946ef] text-white font-frygia font-black text-sm shadow-[0_0_12px_rgba(217,70,239,0.85)] shrink-0">
                    3
                  </span>
                  <h3 className="font-morton font-black text-white text-lg sm:text-xl uppercase tracking-wide">
                    SWAP SOL FOR <span className="text-[#ff2da8]">$RWD</span>
                  </h3>
                </div>

                {/* Description */}
                <p className="text-zinc-300 font-frygia text-sm sm:text-base leading-relaxed max-w-[260px]">
                  Swap SOL for $RWD on Raydium.
                </p>
              </div>

              {/* ================= STEP 4: $RWD (FINAL DESTINATION) ================= */}
              <div className="relative flex flex-col items-center text-center group">
                
                {/* Circle Container */}
                <div className="relative mb-6">
                  <div className="relative flex h-36 w-36 sm:h-40 sm:w-40 xl:h-48 xl:w-48 items-center justify-center rounded-full border-[2.5px] border-[#d946ef] bg-black shadow-[0_0_25px_rgba(217,70,239,0.65)] transition-all duration-300 group-hover:scale-105 group-hover:border-[#ff2da8] group-hover:shadow-[0_0_35px_rgba(255,45,168,0.85)]">
                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 xl:h-28 xl:w-28 flex items-center justify-center">
                      <Image
                        src="/htb/rewind-logo.png"
                        alt="$RWD Rewind Logo"
                        width={120}
                        height={120}
                        priority
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  </div>
                </div>

                {/* Number Badge + Title */}
                <div className="flex items-center justify-center gap-2 mb-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-[#9333ea] to-[#d946ef] text-white font-frygia font-black text-sm shadow-[0_0_12px_rgba(217,70,239,0.85)] shrink-0">
                    4
                  </span>
                  <h3 className="font-morton font-black text-white text-lg sm:text-xl uppercase tracking-wide">
                    $RWD
                  </h3>
                </div>

                {/* Description */}
                <p className="text-zinc-300 font-frygia text-sm sm:text-base leading-relaxed max-w-[260px]">
                  You're in. Welcome to the rewind!
                </p>
              </div>

            </div>

            {/* Contract Address (CA) Box with Copy Button */}
            <div className="mt-14 sm:mt-18 pt-8 sm:pt-10 border-t border-purple-900/40 flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto rounded-2xl bg-black/70 border border-purple-900/50 p-4 sm:p-6 shadow-[0_0_30px_rgba(147,51,234,0.15)]">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff2da8] shadow-[0_0_8px_#ff2da8] animate-pulse shrink-0" />
                <span className="font-frygia font-bold text-xs sm:text-sm uppercase tracking-widest text-fuchsia-300">
                  CONTRACT ADDRESS (CA)
                </span>
              </div>

              <div className="w-full md:w-auto flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border border-purple-800/60 bg-[#090111] shadow-inner max-w-full overflow-hidden">
                <code className="font-mono text-xs sm:text-sm text-zinc-300 select-all truncate">
                  aZXVx5Q5hwQQkSp5sJ8hWoNzjX4nFHQHmBX6oCjpump
                </code>
                <button
                  type="button"
                  onClick={handleCopyCA}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white transition-all duration-200 shrink-0 flex items-center gap-1.5 text-xs font-frygia font-bold shadow-[0_0_12px_rgba(232,54,220,0.4)] active:scale-95 cursor-pointer"
                  title="Copy Contract Address"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-300" />
                      <span className="text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-white" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: THE FAIR LAUNCH PLEDGE & FAQ (Pledge Left | FAQ Right) */}
      {/* ========================================================================= */}
      <section 
        id="faq" 
        className="relative z-20 w-full bg-gradient-to-b from-black via-[#080012] to-[#040008] border-t border-purple-950/60 py-20 sm:py-24 md:py-32 overflow-hidden select-none"
      >
        {/* Atmospheric ambient lighting */}
        <div 
          className="pointer-events-none absolute top-1/3 left-10 -translate-y-1/2 -z-0 h-[450px] w-[450px] rounded-full bg-fuchsia-600/10 blur-[160px]" 
          aria-hidden="true" 
        />
        <div 
          className="pointer-events-none absolute bottom-1/4 right-10 -z-0 h-[500px] w-[500px] rounded-full bg-purple-600/15 blur-[160px]" 
          aria-hidden="true" 
        />

        <div className="relative z-10 max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 xl:gap-16 items-start">
            
            {/* ==================== LEFT COLUMN: THE FAIR LAUNCH PLEDGE ==================== */}
            <div className="lg:col-span-5 flex flex-col justify-start">
              
              {/* Heading (Clean White with Neon Glow, Matching Other Sections) */}
              <div className="mb-6">
                <h2 className="font-morton font-black uppercase tracking-wider text-4xl sm:text-5xl lg:text-6xl text-white select-none neon-text-glow leading-none">
                  THE FAIR
                </h2>
                <h2 className="font-morton font-black uppercase tracking-wider text-4xl sm:text-5xl lg:text-6xl text-white select-none neon-text-glow leading-tight mt-1.5">
                  LAUNCH PLEDGE.
                </h2>
                <div className="h-[2px] w-32 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-transparent mt-3.5" />
              </div>

              {/* Hook Paragraph */}
              <p className="text-zinc-300 font-frygia text-base sm:text-lg leading-relaxed mb-8">
                No VC bags. No insider allocations. Just a chart everyone gets to watch from the same couch.
              </p>

              {/* 3 Pledge Cards */}
              <div className="space-y-4">
                {PLEDGE_ITEMS.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div 
                      key={index}
                      className="group rounded-2xl border border-purple-900/50 bg-[#0c0217]/85 p-5 backdrop-blur-sm transition-all duration-300 hover:border-fuchsia-500/70 hover:bg-[#130325] hover:shadow-[0_0_25px_rgba(232,54,220,0.2)] hover:-translate-y-0.5 flex items-start gap-4"
                    >
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${item.iconBg} ${item.iconColor} shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <h3 className="font-morton font-black text-white text-lg sm:text-xl uppercase tracking-wide transition-colors duration-200 group-hover:text-fuchsia-300">
                          {item.title}
                        </h3>
                        <p className="text-zinc-400 font-frygia text-sm sm:text-base leading-relaxed mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

            </div>

            {/* ==================== RIGHT COLUMN: FAQ ACCORDION ==================== */}
            <div className="lg:col-span-7 flex flex-col justify-start">
              
              {/* Heading (Clean White with Neon Glow) */}
              <div className="mb-6">
                <h2 className="font-morton font-black uppercase tracking-wider text-4xl sm:text-5xl lg:text-6xl text-white select-none neon-text-glow leading-tight">
                  FAQ.
                </h2>
                <div className="h-[2px] w-24 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-transparent mt-3.5" />
              </div>

              {/* Accordion List with Ultra Smooth Motion Animations */}
              <div className="space-y-3.5">
                {FAQ_ITEMS.map((item, index) => {
                  const isOpen = openFaq === index
                  return (
                    <div 
                      key={index}
                      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                        isOpen 
                          ? 'border-fuchsia-500/80 bg-[#130226]/90 shadow-[0_0_30px_rgba(232,54,220,0.22)]' 
                          : 'border-purple-900/50 bg-[#0c0217]/80 hover:border-purple-700 hover:bg-[#100120]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(index)}
                        aria-expanded={isOpen}
                        className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none"
                      >
                        <span className="font-morton font-extrabold text-base sm:text-lg lg:text-xl text-white tracking-wide leading-snug">
                          {item.q}
                        </span>
                        
                        <motion.div 
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors duration-300 shrink-0 ${
                            isOpen 
                              ? 'border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-300 shadow-[0_0_12px_rgba(232,54,220,0.5)]' 
                              : 'border-purple-800 bg-purple-950/40 text-purple-300'
                          }`}
                        >
                          <Plus className="h-4.5 w-4.5" />
                        </motion.div>
                      </button>

                      {/* Smooth Animated Accordion Answer */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ 
                              height: 'auto', 
                              opacity: 1,
                              transition: {
                                height: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] },
                                opacity: { duration: 0.25, delay: 0.08 }
                              }
                            }}
                            exit={{ 
                              height: 0, 
                              opacity: 0,
                              transition: {
                                height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
                                opacity: { duration: 0.15 }
                              }
                            }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                              <div className="h-[1px] w-full bg-purple-900/40 mb-3.5" />
                              <div className="text-zinc-300 font-frygia text-sm sm:text-base leading-relaxed">
                                {item.a}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8: SOCIAL SECTION (Left: X & Telegram Cards | Right: Big Kid Image) */}
      {/* ========================================================================= */}
      <section 
        id="social" 
        className="relative z-20 w-full bg-gradient-to-b from-[#040008] via-[#090014] to-black border-t border-purple-950/60 py-20 sm:py-24 md:py-32 overflow-hidden select-none"
      >
        {/* Ambient background lighting */}
        <div 
          className="pointer-events-none absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 -z-0 h-[500px] w-[800px] rounded-full bg-purple-600/15 blur-[170px]" 
          aria-hidden="true" 
        />
        <div 
          className="pointer-events-none absolute top-1/2 right-10 -translate-y-1/2 -z-0 h-[500px] w-[500px] rounded-full bg-fuchsia-600/20 blur-[150px]" 
          aria-hidden="true" 
        />

        <div className="relative z-10 max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 xl:gap-16 items-center">
            
            {/* ==================== LEFT COLUMN: X & TELEGRAM CARDS ==================== */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              
              {/* Heading */}
              <div className="mb-8 sm:mb-10">
                <h2 className="font-morton font-black uppercase tracking-wider text-4xl sm:text-5xl lg:text-6xl text-white select-none neon-text-glow leading-tight">
                  JOIN THE CREW.
                </h2>
                <div className="h-[2px] w-32 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-transparent mt-3.5" />
                <p className="text-zinc-300 font-frygia text-base sm:text-lg leading-relaxed mt-4 max-w-xl">
                  Turn on the TV, grab a bowl of cereal, and hop in the community. No noise, just 90s cartoons, memes, and the chart.
                </p>
              </div>

              {/* 2 Social Cards */}
              <div className="space-y-5 sm:space-y-6">
                
                {/* CARD 1: X (TWITTER) */}
                <a
                  href="https://x.com/RewindStatic78"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative rounded-3xl border border-purple-900/60 bg-[#0c0217]/90 p-5 sm:p-7 backdrop-blur-md transition-all duration-300 hover:border-fuchsia-500/80 hover:bg-[#130325] hover:shadow-[0_0_30px_rgba(232,54,220,0.25)] hover:-translate-y-1 flex flex-col sm:flex-row items-center sm:items-center justify-between gap-5 sm:gap-6"
                >
                  <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                    {/* Circle Icon Container with Solid Black and Neon Purple Glow */}
                    <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full border-[2.5px] border-[#d946ef] bg-black shadow-[0_0_25px_rgba(217,70,239,0.65)] shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:border-[#ff2da8] group-hover:shadow-[0_0_35px_rgba(255,45,168,0.85)]">
                      <div className="relative h-11 w-11 sm:h-13 sm:w-13 flex items-center justify-center">
                        <Image
                          src="/social/x.png"
                          alt="X (Twitter)"
                          width={64}
                          height={64}
                          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-morton font-black text-white text-xl sm:text-2xl uppercase tracking-wide group-hover:text-fuchsia-300 transition-colors">
                          X (TWITTER)
                        </h3>
                        <span className="text-xs font-frygia px-2 py-0.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300">
                          @RewindStatic78
                        </span>
                      </div>
                      <p className="text-zinc-400 font-frygia text-sm sm:text-base leading-relaxed mt-1">
                        Daily rerun clips, memes, and official announcements.
                      </p>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto flex justify-end shrink-0">
                    <span className="w-full sm:w-auto text-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 group-hover:from-fuchsia-500 group-hover:to-purple-500 text-white font-frygia font-bold text-sm tracking-wider uppercase transition-all duration-200 shadow-[0_0_15px_rgba(232,54,220,0.4)] flex items-center justify-center gap-1.5">
                      Follow on X ↗
                    </span>
                  </div>
                </a>

                {/* CARD 2: TELEGRAM */}
                <a
                  href="https://t.me/RewindStatic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative rounded-3xl border border-purple-900/60 bg-[#0c0217]/90 p-5 sm:p-7 backdrop-blur-md transition-all duration-300 hover:border-fuchsia-500/80 hover:bg-[#130325] hover:shadow-[0_0_30px_rgba(232,54,220,0.25)] hover:-translate-y-1 flex flex-col sm:flex-row items-center sm:items-center justify-between gap-5 sm:gap-6"
                >
                  <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                    {/* Circle Icon Container with Solid Black and Neon Purple Glow */}
                    <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full border-[2.5px] border-[#d946ef] bg-black shadow-[0_0_25px_rgba(217,70,239,0.65)] shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:border-[#ff2da8] group-hover:shadow-[0_0_35px_rgba(255,45,168,0.85)]">
                      <div className="relative h-11 w-11 sm:h-13 sm:w-13 flex items-center justify-center">
                        <Image
                          src="/social/tele.png"
                          alt="Telegram"
                          width={64}
                          height={64}
                          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-morton font-black text-white text-xl sm:text-2xl uppercase tracking-wide group-hover:text-fuchsia-300 transition-colors">
                          TELEGRAM
                        </h3>
                        <span className="text-xs font-frygia px-2 py-0.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300">
                          t.me/RewindStatic
                        </span>
                      </div>
                      <p className="text-zinc-400 font-frygia text-sm sm:text-base leading-relaxed mt-1">
                        Hang out with the 90s cartoon crew, share memes, and vibe.
                      </p>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto flex justify-end shrink-0">
                    <span className="w-full sm:w-auto text-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 group-hover:from-fuchsia-500 group-hover:to-purple-500 text-white font-frygia font-bold text-sm tracking-wider uppercase transition-all duration-200 shadow-[0_0_15px_rgba(232,54,220,0.4)] flex items-center justify-center gap-1.5">
                      Join Telegram ↗
                    </span>
                  </div>
                </a>

              </div>

            </div>

            {/* ==================== RIGHT COLUMN: BIG KID SOCIAL IMAGE ==================== */}
            <div className="lg:col-span-5 relative flex items-center justify-center h-full min-h-[420px] lg:min-h-[580px]">
              
              {/* Vibrant Atmospheric Purple Ambient Glow behind the kid */}
              <div 
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-0 h-[480px] w-[480px] rounded-full bg-fuchsia-600/30 blur-[140px] animate-pulse" 
                aria-hidden="true" 
              />
              
              <div className="relative group w-full max-w-[460px] lg:max-w-none flex items-center justify-center">
                <Image
                  src="/social-kid.png"
                  alt="Rewind Static Social Kid"
                  width={620}
                  height={720}
                  priority
                  className="w-full max-h-[540px] lg:max-h-[640px] object-contain drop-shadow-[0_15px_45px_rgba(232,54,220,0.35)] transition-all duration-500 group-hover:scale-105 group-hover:drop-shadow-[0_20px_60px_rgba(255,45,168,0.6)] select-none"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER */}
      {/* ========================================================================= */}
      <footer className="relative z-20 w-full bg-black border-t border-purple-950/80 py-12 sm:py-16 overflow-hidden select-none">
        
        {/* Ambient bottom glow */}
        <div 
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 -z-0 h-[250px] w-[800px] rounded-full bg-fuchsia-600/10 blur-[160px]" 
          aria-hidden="true" 
        />

        <div className="relative z-10 max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-10 pb-10 border-b border-purple-900/40">
            
            {/* Left: Logo Text with Tagline */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
              <Image
                src="/logo-text-with tagline.png"
                alt="Rewind Static Logo"
                width={380}
                height={120}
                className="h-16 sm:h-20 lg:h-24 w-auto object-contain drop-shadow-[0_0_20px_rgba(232,54,220,0.35)]"
              />
              <p className="text-zinc-400 font-frygia text-sm sm:text-base max-w-md">
                The community meme coin built for 90s cartoon nostalgia and VHS vibes on Solana.
              </p>
            </div>

            {/* Right: Big Retro Animated TV GIF (No Border) */}
            <div className="flex items-center justify-center">
              <Image
                src="/tv-aniamted.gif"
                alt="Rewind Static Animated TV"
                width={360}
                height={280}
                unoptimized
                className="h-36 sm:h-48 lg:h-56 w-auto object-contain drop-shadow-[0_0_35px_rgba(232,54,220,0.5)] transition-transform duration-300 hover:scale-105 select-none"
              />
            </div>

          </div>

          {/* Bottom Copyright & Disclaimer */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-frygia text-zinc-500 text-center sm:text-left">
            <p>© {new Date().getFullYear()} $RWD • Rewind Static. All rights reserved.</p>
            <p className="text-zinc-600">Meme coin for entertainment purposes only. Not financial advice.</p>
          </div>

        </div>
      </footer>
    </main>
  )
}

