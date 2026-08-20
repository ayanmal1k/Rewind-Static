'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Upload, RefreshCw, Download, Film, Sparkles, Sliders, ShieldCheck, Check, Info } from 'lucide-react'

interface Channel {
  id: string
  name: string
  tint: string
  glow: string
  noTint?: boolean
}

const CHANNELS: Channel[] = [
  { id: 'original', name: 'Original', tint: '#f6f0df', glow: '#f6f0df', noTint: true },
  { id: 'pink', name: 'Rewind Magenta', tint: '#e836dc', glow: '#ff2da8' },
  { id: 'blue', name: 'Static Blu', tint: '#3b4bd6', glow: '#38c7bc' },
  { id: 'amber', name: 'Tracking Amb', tint: '#f47b21', glow: '#f47b21' },
  { id: 'green', name: 'Phosphor Grn', tint: '#22a866', glow: '#52e6a4' },
]

// Mulberry32 PRNG for deterministic static noise
function mulberry32(a: number) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hexToRgb(hex: string) {
  const v = parseInt(hex.replace('#', ''), 16)
  return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 }
}

function hexA(hex: string, a: number) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r},${g},${b},${a})`
}

function roundRectPath(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath()
  c.moveTo(x + r, y)
  c.arcTo(x + w, y, x + w, y + h, r)
  c.arcTo(x + w, y + h, x, y + h, r)
  c.arcTo(x, y + h, x, y, r)
  c.arcTo(x, y, x + w, y, r)
  c.closePath()
}

// Built-in Lightweight LZW GIF Encoder for Client-Side Animated GIF Generation
function buildWebSafePalette(): Uint8Array {
  const pal = new Uint8Array(256 * 3)
  for (let i = 0; i < 216; i++) {
    const rq = Math.floor(i / 36)
    const gq = Math.floor(i / 6) % 6
    const bq = i % 6
    pal[i * 3] = Math.round((rq * 255) / 5)
    pal[i * 3 + 1] = Math.round((gq * 255) / 5)
    pal[i * 3 + 2] = Math.round((bq * 255) / 5)
  }
  return pal
}

function quantizeFrame(imgData: ImageData): Uint8Array {
  const d = imgData.data
  const n = d.length / 4
  const idx = new Uint8Array(n)
  for (let i = 0, p = 0; i < d.length; i += 4, p++) {
    const rq = Math.min(5, Math.round((d[i] / 255) * 5))
    const gq = Math.min(5, Math.round((d[i + 1] / 255) * 5))
    const bq = Math.min(5, Math.round((d[i + 2] / 255) * 5))
    idx[p] = rq * 36 + gq * 6 + bq
  }
  return idx
}

class BitWriter {
  bytes: number[] = []
  bitBuf: number = 0
  bitCount: number = 0

  writeCode(code: number, size: number) {
    this.bitBuf |= code << this.bitCount
    this.bitCount += size
    while (this.bitCount >= 8) {
      this.bytes.push(this.bitBuf & 0xff)
      this.bitBuf >>= 8
      this.bitCount -= 8
    }
  }

  flush() {
    if (this.bitCount > 0) {
      this.bytes.push(this.bitBuf & 0xff)
      this.bitBuf = 0
      this.bitCount = 0
    }
  }
}

function lzwEncode(indices: Uint8Array, minCodeSize: number): number[] {
  const clearCode = 1 << minCodeSize
  const endCode = clearCode + 1
  const bw = new BitWriter()
  let dict: Map<string, number> = new Map()
  let nextCode: number = endCode + 1
  let codeSize: number = minCodeSize + 1

  function reset() {
    dict = new Map()
    for (let i = 0; i < clearCode; i++) dict.set(String.fromCharCode(i), i)
    nextCode = endCode + 1
    codeSize = minCodeSize + 1
  }

  reset()
  bw.writeCode(clearCode, codeSize)

  let w = ''
  for (let i = 0; i < indices.length; i++) {
    const kChar = String.fromCharCode(indices[i])
    const wk = w + kChar
    if (dict.has(wk)) {
      w = wk
    } else {
      bw.writeCode(dict.get(w)!, codeSize)
      if (nextCode < 4096) {
        dict.set(wk, nextCode)
        if (nextCode === 1 << codeSize && codeSize < 12) codeSize++
        nextCode++
      } else {
        bw.writeCode(clearCode, codeSize)
        reset()
      }
      w = kChar
    }
  }
  if (w !== '') bw.writeCode(dict.get(w)!, codeSize)
  bw.writeCode(endCode, codeSize)
  bw.flush()
  return bw.bytes
}

function buildGif(frameIndices: Uint8Array[], w: number, h: number, palette: Uint8Array, delayCs: number): Uint8Array {
  const bytes: number[] = []
  const pushStr = (s: string) => {
    for (let i = 0; i < s.length; i++) bytes.push(s.charCodeAt(i))
  }
  const push16 = (n: number) => {
    bytes.push(n & 0xff, (n >> 8) & 0xff)
  }

  pushStr('GIF89a')
  push16(w)
  push16(h)
  bytes.push(0xf7, 0, 0)
  for (let i = 0; i < 256 * 3; i++) bytes.push(palette[i] || 0)

  // Netscape loop extension
  bytes.push(0x21, 0xff, 0x0b)
  pushStr('NETSCAPE2.0')
  bytes.push(0x03, 0x01, 0, 0, 0x00)

  const minCodeSize = 8
  frameIndices.forEach((idx) => {
    bytes.push(0x21, 0xf9, 0x04, 0x04)
    push16(delayCs)
    bytes.push(0x00, 0x00)

    bytes.push(0x2c)
    push16(0)
    push16(0)
    push16(w)
    push16(h)
    bytes.push(0x00)

    bytes.push(minCodeSize)
    const compressed = lzwEncode(idx, minCodeSize)
    let pos = 0
    while (pos < compressed.length) {
      const len = Math.min(255, compressed.length - pos)
      bytes.push(len)
      for (let i = 0; i < len; i++) bytes.push(compressed[pos + i])
      pos += len
    }
    bytes.push(0x00)
  })

  bytes.push(0x3b)
  return new Uint8Array(bytes)
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

export default function PfpGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const roundCanvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<string>('pink')
  const [noise, setNoise] = useState<number>(70)
  const [seed, setSeed] = useState<number>(1)
  const [rollY, setRollY] = useState<number>(0)
  const [isExportingGif, setIsExportingGif] = useState<boolean>(false)
  const [exportProgress, setExportProgress] = useState<string>('')
  const [isDragging, setIsDragging] = useState<boolean>(false)

  // Pre-calculated graded layer to keep rendering fast
  const gradedLayerRef = useRef<HTMLCanvasElement | null>(null)
  const gradedDirtyRef = useRef<boolean>(true)

  const W = 1200
  const H = 1200
  const scr = { x: 110, y: 104, w: 980, h: 742, r: 26 }

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') {
        const img = new window.Image()
        img.onload = () => {
          setImage(img)
          setSeed(Math.floor(Math.random() * 1e9))
          gradedDirtyRef.current = true
        }
        img.src = ev.target.result
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  // Draw image covered within bounds
  const coverDraw = (
    c: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number
  ) => {
    const ir = img.width / img.height
    const r = w / h
    let sw: number, sh: number, sx: number, sy: number
    if (ir > r) {
      sh = img.height
      sw = sh * r
      sy = 0
      sx = (img.width - sw) / 2
    } else {
      sw = img.width
      sh = sw / r
      sx = 0
      sy = (img.height - sh) / 2
    }
    c.drawImage(img, sx, sy, sw, sh, x, y, w, h)
  }

  const buildNoise = (w: number, h: number, seedVal: number, alpha: number) => {
    const off = document.createElement('canvas')
    off.width = w
    off.height = h
    const octx = off.getContext('2d')
    if (!octx) return off
    const imgData = octx.createImageData(w, h)
    const rnd = mulberry32(seedVal * 97 + 13)
    for (let i = 0; i < imgData.data.length; i += 4) {
      const v = Math.floor(rnd() * 255)
      imgData.data[i] = v
      imgData.data[i + 1] = v
      imgData.data[i + 2] = v
      imgData.data[i + 3] = Math.floor(alpha * 255)
    }
    octx.putImageData(imgData, 0, 0)
    return off
  }

  const buildGraded = useCallback(() => {
    const layer = document.createElement('canvas')
    layer.width = scr.w
    layer.height = scr.h
    const lctx = layer.getContext('2d')
    if (!lctx) return layer

    const ch = CHANNELS.find((c) => c.id === selectedChannel) || CHANNELS[0]

    if (image) {
      coverDraw(lctx, image, 0, 0, scr.w, scr.h)

      if (!ch.noTint) {
        lctx.globalCompositeOperation = 'overlay'
        lctx.fillStyle = hexA(ch.tint, 0.4)
        lctx.fillRect(0, 0, scr.w, scr.h)
        lctx.globalCompositeOperation = 'source-over'

        const imgData = lctx.getImageData(0, 0, scr.w, scr.h)
        const d = imgData.data
        for (let i = 0; i < d.length; i += 4) {
          const avg = (d[i] + d[i + 1] + d[i + 2]) / 3
          d[i] = d[i] * 0.82 + avg * 0.18
          d[i + 1] = d[i + 1] * 0.82 + avg * 0.18
          d[i + 2] = d[i + 2] * 0.82 + avg * 0.18
        }
        lctx.putImageData(imgData, 0, 0)
      }

      // Chromatic aberration ghosts
      const clean = document.createElement('canvas')
      clean.width = scr.w
      clean.height = scr.h
      const cctx = clean.getContext('2d')
      if (cctx) {
        cctx.drawImage(layer, 0, 0)
        const off = 3 + (noise / 100) * 9
        lctx.save()
        lctx.globalCompositeOperation = 'lighter'
        lctx.globalAlpha = 0.22
        lctx.drawImage(clean, -off, 0)
        lctx.drawImage(clean, off, 0)
        lctx.restore()

        // Horizontal motion smear streak
        const smearOff = 6 + (noise / 100) * 26
        lctx.save()
        lctx.globalCompositeOperation = 'lighten'
        lctx.globalAlpha = 0.12
        lctx.drawImage(clean, -smearOff, 0)
        lctx.drawImage(clean, smearOff, 0)
        lctx.globalAlpha = 0.07
        lctx.drawImage(clean, -smearOff * 1.8, 0)
        lctx.drawImage(clean, smearOff * 1.8, 0)
        lctx.restore()
      }
    } else {
      lctx.fillStyle = '#0a0b12'
      lctx.fillRect(0, 0, scr.w, scr.h)
    }

    gradedLayerRef.current = layer
    gradedDirtyRef.current = false
    return layer
  }, [image, selectedChannel, noise])

  const renderFrame = useCallback(
    (currentSeed: number, currentRollY: number) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      if (gradedDirtyRef.current || !gradedLayerRef.current) {
        buildGraded()
      }

      const ch = CHANNELS.find((c) => c.id === selectedChannel) || CHANNELS[0]
      const glow = ch.glow

      ctx.clearRect(0, 0, W, H)

      // Backdrop ambient glow
      const grad = ctx.createRadialGradient(W / 2, H * 0.42, W * 0.1, W / 2, H * 0.42, W * 0.62)
      grad.addColorStop(0, hexA(glow, 0.18))
      grad.addColorStop(1, 'rgba(6, 0, 12, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      // TV Bezel outer frame
      const bez = { x: 30, y: 30, w: W - 60, h: H - 60, r: 52 }
      const bezGrad = ctx.createLinearGradient(bez.x, bez.y, bez.x + bez.w, bez.y + bez.h)
      bezGrad.addColorStop(0, '#1c0c2a')
      bezGrad.addColorStop(0.5, '#12041d')
      bezGrad.addColorStop(1, '#08010d')
      roundRectPath(ctx, bez.x, bez.y, bez.w, bez.h, bez.r)
      ctx.fillStyle = bezGrad
      ctx.fill()
      ctx.lineWidth = 2.5
      ctx.strokeStyle = 'rgba(232, 54, 220, 0.25)'
      ctx.stroke()

      // Screen Recess Shadow
      roundRectPath(ctx, scr.x - 14, scr.y - 14, scr.w + 28, scr.h + 28, scr.r + 10)
      ctx.fillStyle = '#040008'
      ctx.fill()

      // Frame distortion canvas
      const layer = document.createElement('canvas')
      layer.width = scr.w
      layer.height = scr.h
      const lctx = layer.getContext('2d')
      if (!lctx || !gradedLayerRef.current) return

      lctx.drawImage(gradedLayerRef.current, 0, 0)

      // CRT Scanlines
      lctx.fillStyle = 'rgba(0,0,0,0.38)'
      for (let y = 0; y < scr.h; y += 4) {
        lctx.fillRect(0, y, scr.w, 1)
      }

      // Static noise
      const noiseAlpha = 0.06 + (noise / 100) * 0.26
      const noiseTex = buildNoise(240, 240, currentSeed, noiseAlpha)
      lctx.imageSmoothingEnabled = false
      lctx.globalCompositeOperation = 'overlay'
      lctx.drawImage(noiseTex, 0, 0, scr.w, scr.h)
      lctx.globalCompositeOperation = 'source-over'
      lctx.imageSmoothingEnabled = true

      const clean = document.createElement('canvas')
      clean.width = scr.w
      clean.height = scr.h
      const cctx = clean.getContext('2d')
      if (cctx && gradedLayerRef.current) {
        cctx.drawImage(gradedLayerRef.current, 0, 0)
      }

      const rnd = mulberry32(currentSeed)
      const intensity = noise / 100

      // Torn tracking bands
      const bandCount = image ? 2 + Math.floor(rnd() * 3) : 0
      for (let i = 0; i < bandCount; i++) {
        const bh = 10 + rnd() * 30
        const by = rnd() * (scr.h - bh)
        const subCount = 2 + Math.floor(rnd() * 2)
        const subH = bh / subCount
        for (let s = 0; s < subCount; s++) {
          const sy = by + s * subH
          const bx = (rnd() - 0.5) * (40 + intensity * 160)
          lctx.drawImage(clean, 0, sy, scr.w, subH, bx, sy, scr.w, subH)
        }
        lctx.fillStyle = hexA(glow, 0.55)
        lctx.fillRect(0, by, scr.w, 1.5)
        lctx.fillRect(0, by + bh, scr.w, 1.5)
      }

      // Rolling head-switch bar
      if (image) {
        const barH = 70 + intensity * 90
        const period = scr.h + barH
        const barY = (currentRollY % period) - barH
        lctx.save()
        const bx2 = (rnd() - 0.5) * (30 + intensity * 110)
        lctx.drawImage(clean, 0, barY, scr.w, barH, bx2, barY, scr.w, barH)
        lctx.globalCompositeOperation = 'difference'
        lctx.fillStyle = 'rgba(235,235,235,0.55)'
        lctx.fillRect(0, barY, scr.w, barH)
        lctx.globalCompositeOperation = 'overlay'
        const barNoise = buildNoise(160, 40, currentSeed + 7, 0.3)
        lctx.drawImage(barNoise, 0, barY, scr.w, barH)
        lctx.restore()
        lctx.fillStyle = hexA(glow, 0.8)
        lctx.fillRect(0, barY, scr.w, 2)
        lctx.fillRect(0, barY + barH - 2, scr.w, 2)
      }

      // Vignette
      const vg = lctx.createRadialGradient(scr.w / 2, scr.h / 2, scr.w * 0.25, scr.w / 2, scr.h / 2, scr.w * 0.72)
      vg.addColorStop(0, 'rgba(0,0,0,0)')
      vg.addColorStop(1, 'rgba(0,0,0,0.55)')
      lctx.fillStyle = vg
      lctx.fillRect(0, 0, scr.w, scr.h)

      // Screen glass sheen
      const sheen = lctx.createLinearGradient(0, 0, scr.w * 0.6, scr.h * 0.6)
      sheen.addColorStop(0, 'rgba(255,255,255,0.08)')
      sheen.addColorStop(0.25, 'rgba(255,255,255,0.0)')
      lctx.fillStyle = sheen
      lctx.fillRect(0, 0, scr.w, scr.h)

      // OSD overlay text
      lctx.font = '700 28px ui-monospace, monospace'
      lctx.fillStyle = '#f6f0df'
      lctx.shadowColor = glow
      lctx.shadowBlur = 10
      lctx.textBaseline = 'top'
      lctx.fillText(image ? '◀◀ REW' : '▶ PLAY', 24, 22)
      lctx.font = '700 18px ui-monospace, monospace'
      lctx.fillText(image ? '×2' : 'SP', 24, 58)

      lctx.textAlign = 'right'
      const t = new Date()
      const stamp = [t.getHours() % 12 || 12, t.getMinutes(), t.getSeconds()]
        .map((n) => String(n).padStart(2, '0'))
        .join(':')
      lctx.fillText(stamp, scr.w - 24, scr.h - 42)
      lctx.font = '700 15px ui-monospace, monospace'
      lctx.fillText('CH 78', scr.w - 24, scr.h - 68)
      lctx.textAlign = 'left'
      lctx.shadowBlur = 0

      if (!image) {
        lctx.textAlign = 'center'
        lctx.font = '700 32px ui-monospace, monospace'
        lctx.fillStyle = 'rgba(246,240,223,0.65)'
        lctx.fillText('NO SIGNAL', scr.w / 2, scr.h / 2 - 15)
        lctx.font = '500 18px ui-monospace, monospace'
        lctx.fillStyle = 'rgba(232, 54, 220, 0.8)'
        lctx.fillText('INSERT TAPE TO REWIND', scr.w / 2, scr.h / 2 + 25)
        lctx.textAlign = 'left'
      }

      // Clip onto main canvas
      ctx.save()
      roundRectPath(ctx, scr.x, scr.y, scr.w, scr.h, scr.r)
      ctx.clip()
      ctx.drawImage(layer, scr.x, scr.y)
      ctx.restore()

      // Screen bezel ring
      roundRectPath(ctx, scr.x, scr.y, scr.w, scr.h, scr.r)
      ctx.lineWidth = 6
      ctx.strokeStyle = '#050506'
      ctx.stroke()
      ctx.lineWidth = 1.5
      ctx.strokeStyle = hexA(glow, 0.4)
      ctx.stroke()

      // Brand plate below CRT screen
      const plateY = scr.y + scr.h + 34
      ctx.font = '900 48px Morton, system-ui, sans-serif'
      ctx.fillStyle = '#ffffff'
      ctx.textBaseline = 'alphabetic'
      ctx.fillText('REWIND STATIC', scr.x, plateY + 38)

      ctx.font = '600 14px ui-monospace, monospace'
      ctx.fillStyle = '#d946ef'
      ctx.fillText('GOOD TIMES. EARLY DEGEN DAYS. 📼', scr.x, plateY + 66)

      // CH.78 Neon Pill Badge
      const pillW = 124,
        pillH = 42,
        pillX = scr.x + scr.w - pillW,
        pillY = plateY + 8
      roundRectPath(ctx, pillX, pillY, pillW, pillH, 21)
      ctx.fillStyle = hexA(glow, 0.18)
      ctx.fill()
      ctx.lineWidth = 1.5
      ctx.strokeStyle = glow
      ctx.stroke()
      ctx.font = '700 16px ui-monospace, monospace'
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.fillText('CH.78', pillX + pillW / 2, pillY + pillH / 2 + 5)
      ctx.textAlign = 'left'

      // Update Round Avatar Preview
      const roundCanvas = roundCanvasRef.current
      if (roundCanvas) {
        const roundCtx = roundCanvas.getContext('2d')
        if (roundCtx) {
          roundCtx.clearRect(0, 0, 120, 120)
          roundCtx.save()
          roundCtx.beginPath()
          roundCtx.arc(60, 60, 60, 0, Math.PI * 2)
          roundCtx.clip()
          roundCtx.drawImage(canvas, 90, 90, 1020, 1020, -30, -30, 180, 180)
          roundCtx.restore()
        }
      }
    },
    [image, noise, selectedChannel, buildGraded]
  )

  // Render loop & animation
  useEffect(() => {
    renderFrame(seed, rollY)
  }, [seed, rollY, renderFrame])

  useEffect(() => {
    gradedDirtyRef.current = true
    renderFrame(seed, rollY)
  }, [selectedChannel, noise, image, renderFrame, seed, rollY])

  // Live glitch animation loop when image is present
  useEffect(() => {
    if (!image || isExportingGif) return
    const interval = setInterval(() => {
      setSeed((prev) => (prev + 104729) % 1000000007)
      setRollY((prev) => prev + 34 + Math.random() * 40)
    }, 220)
    return () => clearInterval(interval)
  }, [image, isExportingGif])

  // Actions
  const handleShuffle = () => {
    setSeed(Math.floor(Math.random() * 1e9))
    setRollY(Math.floor(Math.random() * 2000))
  }

  const handleEject = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, 'rewind-static-pfp.png')
    }, 'image/png')
  }

  const handleExportGif = async () => {
    const canvas = canvasRef.current
    if (!canvas || isExportingGif) return

    const EXPORT_SIZE = 320
    const FRAME_COUNT = 16
    const DELAY_CS = 8

    setIsExportingGif(true)
    const savedSeed = seed
    const savedRoll = rollY

    const small = document.createElement('canvas')
    small.width = EXPORT_SIZE
    small.height = EXPORT_SIZE
    const sctx = small.getContext('2d', { willReadFrequently: true })
    if (!sctx) return

    const palette = buildWebSafePalette()
    const frames: Uint8Array[] = []

    let curSeed = seed
    let curRoll = rollY

    for (let f = 0; f < FRAME_COUNT; f++) {
      setExportProgress(`RENDERING FRAME ${f + 1} / ${FRAME_COUNT}`)
      curSeed = (curSeed + 104729) % 1000000007
      curRoll += 34 + Math.random() * 40
      renderFrame(curSeed, curRoll)

      sctx.clearRect(0, 0, EXPORT_SIZE, EXPORT_SIZE)
      sctx.drawImage(canvas, 0, 0, W, H, 0, 0, EXPORT_SIZE, EXPORT_SIZE)
      const imgData = sctx.getImageData(0, 0, EXPORT_SIZE, EXPORT_SIZE)
      frames.push(quantizeFrame(imgData))
      await new Promise((r) => setTimeout(r, 10))
    }

    setExportProgress('COMPILING GIF...')
    await new Promise((r) => setTimeout(r, 20))
    const gifBytes = buildGif(frames, EXPORT_SIZE, EXPORT_SIZE, palette, DELAY_CS)
    downloadBlob(new Blob([gifBytes as any], { type: 'image/gif' }), 'rewind-static-pfp.gif')

    setSeed(savedSeed)
    setRollY(savedRoll)
    setExportProgress('')
    setIsExportingGif(false)
  }

  return (
    <main className="relative min-h-screen w-full bg-black text-white selection:bg-fuchsia-600 selection:text-white pb-20 overflow-x-hidden">
      {/* Ambient background glows */}
      <div
        className="pointer-events-none fixed top-0 left-1/4 -translate-y-1/2 -z-0 h-[600px] w-[600px] rounded-full bg-fuchsia-600/15 blur-[180px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed bottom-1/4 right-10 -z-0 h-[650px] w-[650px] rounded-full bg-purple-600/20 blur-[180px]"
        aria-hidden="true"
      />

      {/* ========================================================================= */}
      {/* TOPBAR NAVIGATION */}
      {/* ========================================================================= */}
      <header className="sticky top-0 left-0 right-0 z-50 w-full bg-black/85 backdrop-blur-xl border-b border-purple-900/40">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-zinc-300 font-frygia font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors hover:text-fuchsia-400 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 text-fuchsia-400" />
            <span>Back to Rewind Static</span>
          </Link>

          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-text-with tagline.png"
              alt="Rewind Static Logo"
              width={260}
              height={70}
              priority
              className="h-9 sm:h-12 w-auto object-contain drop-shadow-[0_0_15px_rgba(232,54,220,0.4)]"
            />
          </Link>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN STUDIO CONTAINER */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Title Header */}
        <div className="mb-8 sm:mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-fuchsia-500/40 bg-fuchsia-950/30 text-fuchsia-300 font-mono text-xs uppercase tracking-widest mb-3 shadow-[0_0_12px_rgba(232,54,220,0.3)]">
            <span className="h-2 w-2 rounded-full bg-[#ff2da8] animate-pulse" />
            REWIND STATIC // COMMUNITY TOOL
          </div>

          <h1 className="font-morton font-black uppercase tracking-wider text-4xl sm:text-5xl lg:text-6xl text-white neon-text-glow leading-none">
            REWIND MY <span className="text-[#ff2da8]">PFP</span>
          </h1>

          <p className="mt-3 text-zinc-300 font-frygia text-sm sm:text-base max-w-2xl leading-relaxed">
            Feed the tape your photo, tune the channel tint, dial in the VHS tracking static, and eject an avatar built
            for X, Telegram & Discord. Free tool for the whole Rewind Crew.
          </p>
        </div>

        {/* Studio Workspace: Canvas (Left) & Controls (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* ==================== LEFT COLUMN: CRT MONITOR CANVAS ==================== */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative w-full max-w-[620px] aspect-square rounded-3xl p-2.5 sm:p-4 bg-gradient-to-br from-[#1a062b] via-[#10021c] to-[#08010e] border-2 border-purple-800/60 shadow-[0_0_50px_rgba(147,51,234,0.35)] group">
              {/* LED CH.78 Indicator */}
              <div className="absolute top-6 right-8 z-20 flex items-center gap-2 font-mono text-xs tracking-widest text-fuchsia-300 uppercase select-none">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                <span>CH.78 LIVE</span>
              </div>

              {/* Main Hi-Res Canvas */}
              <canvas
                ref={canvasRef}
                width={W}
                height={H}
                className="w-full h-full rounded-2xl block bg-black shadow-inner"
              />
            </div>

            {/* CRT TV Caption Subtitle */}
            <div className="w-full max-w-[620px] mt-3 flex items-center justify-between px-2 font-mono text-xs uppercase tracking-wider text-zinc-400">
              <span>REWIND_STATIC_78.MOV</span>
              <span className="text-fuchsia-400 font-bold">
                {image ? '◀◀ REWINDING AT 12.5 FPS' : 'NO SIGNAL (INSERT TAPE)'}
              </span>
            </div>
          </div>

          {/* ==================== RIGHT COLUMN: CONTROL PANEL ==================== */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="rounded-3xl border border-purple-900/60 bg-[#0c0217]/90 p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(232,54,220,0.18)] space-y-6">
              {/* 1. DROPZONE / FILE UPLOAD */}
              <div className="space-y-2.5">
                <label className="font-mono text-xs uppercase tracking-widest text-fuchsia-300 flex items-center gap-2">
                  <Upload className="h-3.5 w-3.5 text-fuchsia-400" />
                  <span>▶ 1. Insert Tape (Your Photo)</span>
                </label>

                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                    isDragging
                      ? 'border-fuchsia-400 bg-fuchsia-950/40 shadow-[0_0_25px_rgba(232,54,220,0.4)]'
                      : 'border-purple-800/60 bg-[#070010] hover:border-fuchsia-500/80 hover:bg-[#130325]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) handleFile(e.target.files[0])
                    }}
                  />
                  <div className="h-12 w-12 rounded-xl bg-purple-950/70 border border-purple-700/60 flex items-center justify-center text-fuchsia-400 shadow-[0_0_15px_rgba(232,54,220,0.3)]">
                    <Upload className="h-6 w-6" />
                  </div>
                  <strong className="font-morton text-lg text-white uppercase tracking-wide">
                    {image ? 'Change Photo Tape' : 'Drop Your Photo Here'}
                  </strong>
                  <span className="font-frygia text-xs text-zinc-400">
                    Click to browse files • 100% private in your browser
                  </span>
                </div>
              </div>

              {/* 2. TUNE CHANNELS */}
              <div className="space-y-3">
                <label className="font-mono text-xs uppercase tracking-widest text-fuchsia-300 flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-fuchsia-400" />
                  <span>2. Tune Channel Tint</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {CHANNELS.map((ch) => {
                    const isActive = selectedChannel === ch.id
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setSelectedChannel(ch.id)}
                        className={`px-3 py-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'border-fuchsia-400 bg-fuchsia-950/60 text-white shadow-[0_0_15px_rgba(232,54,220,0.4)] scale-[1.02]'
                            : 'border-purple-900/60 bg-[#090112] text-zinc-400 hover:border-purple-700 hover:text-white'
                        }`}
                      >
                        <span
                          className="h-3.5 w-3.5 rounded-full shrink-0"
                          style={{
                            backgroundColor: ch.tint,
                            boxShadow: `0 0 8px ${ch.glow}`,
                          }}
                        />
                        <span className="font-mono text-xs font-semibold truncate">{ch.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 3. TRACKING / NOISE SLIDER */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between font-mono text-xs">
                  <label className="uppercase tracking-widest text-fuchsia-300 flex items-center gap-2">
                    <Sliders className="h-3.5 w-3.5 text-fuchsia-400" />
                    <span>3. Tracking / Static</span>
                  </label>
                  <span className="font-bold text-white bg-purple-900/40 px-2 py-0.5 rounded border border-purple-800">
                    {noise}%
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={noise}
                  onChange={(e) => setNoise(Number(e.target.value))}
                  className="w-full accent-fuchsia-500 cursor-pointer h-2 bg-purple-950 rounded-lg appearance-none border border-purple-800"
                />
              </div>

              {/* 4. ACTION BUTTONS */}
              <div className="space-y-3 pt-2">
                {/* Re-track Static Button */}
                <button
                  type="button"
                  onClick={handleShuffle}
                  className="w-full py-3 px-4 rounded-xl border border-purple-800/80 bg-purple-950/40 text-zinc-300 hover:text-white hover:border-fuchsia-500 font-frygia font-bold text-sm tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_12px_rgba(147,51,234,0.2)] active:scale-95"
                >
                  <RefreshCw className="h-4 w-4 text-fuchsia-400" />
                  <span>⟲ Re-track Static Pattern</span>
                </button>

                {/* Eject PNG Button */}
                <button
                  type="button"
                  disabled={!image}
                  onClick={handleEject}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-fuchsia-600 via-pink-500 to-purple-600 text-white font-frygia font-black text-base tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(232,54,220,0.6)] hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Download className="h-5 w-5" />
                  <span>⏏ Eject — Rewind PFP (PNG)</span>
                </button>

                {/* Export Animated GIF Button */}
                <button
                  type="button"
                  disabled={!image || isExportingGif}
                  onClick={handleExportGif}
                  className="w-full py-3 px-6 rounded-xl border-2 border-[#38c7bc] bg-[#38c7bc]/10 text-[#38c7bc] hover:bg-[#38c7bc]/20 font-frygia font-bold text-sm tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(56,199,188,0.3)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Film className="h-4 w-4" />
                  <span>{isExportingGif ? exportProgress : '🎞 Export Animated GIF (Telegram/Discord)'}</span>
                </button>
              </div>

              {/* 5. CIRCULAR AVATAR PREVIEW */}
              <div className="p-4 rounded-2xl border border-purple-900/50 bg-[#080010] flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-fuchsia-500 shadow-[0_0_15px_rgba(232,54,220,0.5)] shrink-0 bg-black">
                  <canvas ref={roundCanvasRef} width={120} height={120} className="w-full h-full block" />
                </div>
                <div className="text-xs font-frygia text-zinc-400 leading-relaxed">
                  <strong className="text-zinc-200 block font-morton text-sm uppercase">X / Telegram Circular Preview</strong>
                  How it sits as a round profile picture. Use "Original" to retain natural skin tones with authentic VHS
                  glitch lines.
                </div>
              </div>

              {/* Privacy Guarantee */}
              <div className="flex items-center gap-2.5 text-zinc-400 font-frygia text-xs">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>100% Client-side. Your uploaded image never leaves your device.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
