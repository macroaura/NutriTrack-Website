import { useEffect, useState, lazy, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { Helmet } from 'react-helmet-async'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'
// Lazy-load the Mapbox bundle — it's ~280 KB and only needed when route data exists
const RouteMap = lazy(() => import('../components/RouteMap'))
import type { MileMarker } from '../components/RouteMap'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

// ---------------------------------------------------------------------------
// Types mirroring backend WorkoutShareSnapshot
// ---------------------------------------------------------------------------

interface WorkoutExerciseSet {
  setIdx?: number
  setType?: string
  reps?: number
  weightLb?: number
  durationSec?: number
}

interface WorkoutExercise {
  exerciseId: string
  exerciseName?: string
  gifKey?: string
  sets?: WorkoutExerciseSet[]
}

interface WorkoutHighlight {
  type: string   // LONGEST_DISTANCE | LONGEST_DURATION | MOST_CALORIES | MOST_ELEVATION | MILESTONE
  label: string
  value: string
}

interface WorkoutMeta {
  workoutId: number
  shareToken: string
  activityTypeName?: string
  activityIcon?: string
  activityCategory?: string
  title?: string
  notes?: string
  startedAt: string
  endedAt?: string
  source: string
  sourceAppName?: string
  userName?: string
  // Stats — flat on the snapshot (backend serializes them at the top level)
  totalDurationSec?: number
  distanceMeters?: number
  totalCaloriesCal?: number
  avgHeartRate?: number
  maxHeartRate?: number
  avgCadence?: number
  avgPower?: number
  elevationGain?: number
  elevationLoss?: number
  steps?: number
  exercises?: WorkoutExercise[]
  highlights?: WorkoutHighlight[]
  // S3 URLs for lazy-loaded large payloads
  routeDataUrl?: string
  heartRateDataUrl?: string
}

// Heart rate sample after parsing the S3 array payload
interface HrSample {
  min: number  // minutes elapsed from workout start
  bpm: number
}

// Pace sample derived from route GPS data
interface PaceSample {
  min: number        // minutes elapsed
  secPerMile: number // instantaneous pace (sec/mile), smoothed
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

/** Format a pace in seconds/mile as "m:ss /mi" */
function formatPace(secPerMile: number): string {
  const m = Math.floor(secPerMile / 60)
  const s = Math.round(secPerMile % 60)
  return `${m}:${s.toString().padStart(2, '0')} /mi`
}

function formatDistance(meters: number): string {
  const miles = meters / 1609.344
  return miles >= 1 ? `${miles.toFixed(2)} mi` : `${Math.round(meters)} m`
}

// ---------------------------------------------------------------------------
// Split calculation — port of RouteSplitCalculator.swift
// ---------------------------------------------------------------------------

interface Split {
  mile: number
  splitSec: number
  cumulativeSec: number
  lngLat: [number, number]  // [lng, lat] for Mapbox
}

/** Haversine distance in metres between two lat/lng points */
function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6_371_000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const METERS_PER_MILE = 1609.344

function calculateSplitsFromRaw(raw: number[][]): Split[] {
  if (raw.length < 2) return []
  const splits: Split[] = []
  let cumDist = 0
  let splitStartIdx = 0
  let currentMile = 1

  for (let i = 1; i < raw.length; i++) {
    const [lat1, lng1] = raw[i - 1]
    const [lat2, lng2] = raw[i]
    const seg = haversineMeters(lat1, lng1, lat2, lng2)
    cumDist += seg

    const target = currentMile * METERS_PER_MILE
    if (cumDist >= target) {
      const splitSec = raw[i][2] - raw[splitStartIdx][2]
      const cumulativeSec = raw[i][2] - raw[0][2]
      // Interpolate exact position of the mile marker
      const overshoot = cumDist - target
      const ratio = seg > 0 ? overshoot / seg : 0
      const lat = lat2 - ratio * (lat2 - lat1)
      const lng = lng2 - ratio * (lng2 - lng1)
      splits.push({ mile: currentMile, splitSec, cumulativeSec, lngLat: [lng, lat] })
      splitStartIdx = i
      currentMile++
    }
  }
  return splits
}

/**
 * Derives a smoothed pace time-series from raw GPS `[lat, lng, timestamp]` points.
 * Uses a rolling 60-second window to avoid noisy instantaneous readings.
 */
function calculatePaceSeries(raw: number[][]): PaceSample[] {
  if (raw.length < 2) return []
  const WINDOW_SEC = 60
  const t0 = raw[0][2]
  const samples: PaceSample[] = []

  for (let i = 1; i < raw.length; i++) {
    const tCur = raw[i][2]
    const tMin = tCur - WINDOW_SEC
    // Walk back to find the start of the window
    let j = i - 1
    while (j > 0 && raw[j][2] > tMin) j--
    const dt = tCur - raw[j][2]
    if (dt < 5) continue // skip if window too small
    let dist = 0
    for (let k = j + 1; k <= i; k++) {
      dist += haversineMeters(raw[k - 1][0], raw[k - 1][1], raw[k][0], raw[k][1])
    }
    if (dist < 1) continue
    const secPerMile = (dt / dist) * METERS_PER_MILE
    // Filter out unrealistic paces (< 3 min/mi or > 20 min/mi)
    if (secPerMile < 180 || secPerMile > 1200) continue
    samples.push({ min: parseFloat(((tCur - t0) / 60).toFixed(1)), secPerMile })
  }
  return samples
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

function categoryColor(_category?: string): string {
  return 'from-green-500 to-emerald-600'
}

// ---------------------------------------------------------------------------
// Stat Card
// ---------------------------------------------------------------------------

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-white px-4 py-4 shadow-sm ring-1 ring-gray-100">
      <span className="text-xl font-bold font-display text-gray-900">{value}</span>
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Loading Skeleton
// ---------------------------------------------------------------------------

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-gray-100 ${className ?? ''}`} />
}

// ---------------------------------------------------------------------------
// Activity Chart (Heart Rate + Pace with toggles)
// ---------------------------------------------------------------------------

// Merged chart point — both fields optional so either series can be absent
interface ChartPoint {
  min: number
  bpm?: number
  secPerMile?: number
}

function downsample<T extends { min: number }>(arr: T[], max = 300): T[] {
  if (arr.length <= max) return arr
  const step = Math.ceil(arr.length / max)
  const result = arr.filter((_, i) => i % step === 0)
  const last = arr[arr.length - 1]
  if (result[result.length - 1] !== last) result.push(last)
  return result
}

function ActivityChartTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number; color: string }[] }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl bg-gray-900 px-3 py-2 shadow-lg text-xs text-white font-medium space-y-1">
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
          {p.name === 'bpm'
            ? <span>{p.value} <span className="text-gray-400">bpm</span></span>
            : <span>{formatPace(p.value)}</span>
          }
        </div>
      ))}
    </div>
  )
}

function ActivityChart({ hrSamples, paceSamples }: { hrSamples: HrSample[] | null; paceSamples: PaceSample[] | null }) {
  const [showHr, setShowHr] = useState(true)
  const [showPace, setShowPace] = useState(true)

  const hasHr = hrSamples && hrSamples.length > 1
  const hasPace = paceSamples && paceSamples.length > 1

  if (!hasHr && !hasPace) return null

  // Build merged dataset keyed by minute
  const merged: ChartPoint[] = (() => {
    const map = new Map<number, ChartPoint>()
    if (hasHr) {
      downsample(hrSamples).forEach(s => map.set(s.min, { min: s.min, bpm: s.bpm }))
    }
    if (hasPace) {
      downsample(paceSamples).forEach(s => {
        const existing = map.get(s.min)
        if (existing) existing.secPerMile = s.secPerMile
        else map.set(s.min, { min: s.min, secPerMile: s.secPerMile })
      })
    }
    return Array.from(map.values()).sort((a, b) => a.min - b.min)
  })()

  const bpms = merged.flatMap(p => p.bpm != null ? [p.bpm] : [])
  const paces = merged.flatMap(p => p.secPerMile != null ? [p.secPerMile] : [])
  const hrDomain: [number, number] = bpms.length ? [Math.max(0, Math.min(...bpms) - 10), Math.max(...bpms) + 10] : [0, 220]
  // Pace axis is inverted — lower sec/mile = faster, so we flip the domain
  const paceDomain: [number, number] = paces.length ? [Math.max(...paces) + 30, Math.max(0, Math.min(...paces) - 30)] : [900, 300]

  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-900">Activity</p>
        <div className="flex items-center gap-2">
          {hasHr && (
            <button
              onClick={() => setShowHr(v => !v)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ring-1 ${
                showHr ? 'bg-rose-50 text-rose-600 ring-rose-200' : 'bg-gray-50 text-gray-400 ring-gray-200'
              }`}
            >
              <div className={`h-2 w-2 rounded-full ${showHr ? 'bg-rose-500' : 'bg-gray-300'}`} />
              Heart Rate
            </button>
          )}
          {hasPace && (
            <button
              onClick={() => setShowPace(v => !v)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ring-1 ${
                showPace ? 'bg-emerald-50 text-emerald-600 ring-emerald-200' : 'bg-gray-50 text-gray-400 ring-gray-200'
              }`}
            >
              <div className={`h-2 w-2 rounded-full ${showPace ? 'bg-emerald-500' : 'bg-gray-300'}`} />
              Pace
            </button>
          )}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={merged} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="paceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="min"
            tickFormatter={(v: number) => `${v}m`}
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          {/* Left Y-axis: heart rate */}
          {hasHr && showHr && (
            <YAxis
              yAxisId="hr"
              orientation="left"
              domain={hrDomain}
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              width={36}
            />
          )}
          {/* Right Y-axis: pace (inverted — lower = faster) */}
          {hasPace && showPace && (
            <YAxis
              yAxisId="pace"
              orientation="right"
              domain={paceDomain}
              tickFormatter={(v: number) => {
                const m = Math.floor(v / 60)
                const s = Math.round(v % 60)
                return `${m}:${s.toString().padStart(2, '0')}`
              }}
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
          )}
          <Tooltip content={<ActivityChartTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }} />
          {hasHr && showHr && (
            <Area
              yAxisId="hr"
              type="monotone"
              dataKey="bpm"
              name="bpm"
              stroke="#f43f5e"
              strokeWidth={2}
              fill="url(#hrGradient)"
              dot={false}
              activeDot={{ r: 4, fill: '#f43f5e', strokeWidth: 0 }}
              connectNulls
            />
          )}
          {hasPace && showPace && (
            <Area
              yAxisId="pace"
              type="monotone"
              dataKey="secPerMile"
              name="secPerMile"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#paceGradient)"
              dot={false}
              activeDot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
              connectNulls
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Highlight Badges
// ---------------------------------------------------------------------------

const HIGHLIGHT_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
  LONGEST_DISTANCE: { icon: '📏', color: 'text-blue-700',   bg: 'bg-blue-50   ring-blue-100' },
  LONGEST_DURATION: { icon: '⏱',  color: 'text-violet-700', bg: 'bg-violet-50 ring-violet-100' },
  MOST_CALORIES:    { icon: '🔥',  color: 'text-orange-700', bg: 'bg-orange-50 ring-orange-100' },
  MOST_ELEVATION:   { icon: '⛰',  color: 'text-green-700',  bg: 'bg-green-50  ring-green-100' },
  MILESTONE:        { icon: '🏅',  color: 'text-yellow-700', bg: 'bg-yellow-50 ring-yellow-100' },
}

function HighlightBadges({ highlights }: { highlights: WorkoutHighlight[] }) {
  if (!highlights.length) return null
  return (
    <div className="flex flex-wrap gap-2">
      {highlights.map((h, i) => {
        const cfg = HIGHLIGHT_CONFIG[h.type] ?? { icon: '⭐', color: 'text-gray-700', bg: 'bg-gray-50 ring-gray-100' }
        return (
          <div
            key={i}
            className={`flex items-center gap-2 rounded-2xl px-4 py-3 ring-1 shadow-sm ${cfg.bg}`}
          >
            <span className="text-lg leading-none">{cfg.icon}</span>
            <div className="flex flex-col">
              <span className={`text-xs font-semibold uppercase tracking-wide ${cfg.color}`}>{h.label}</span>
              <span className="text-sm font-bold text-gray-900">{h.value}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function ActivityPage() {
  const { shareToken } = useParams<{ shareToken: string }>()

  const [meta, setMeta] = useState<WorkoutMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hrSamples, setHrSamples] = useState<HrSample[] | null>(null)
  const [paceSamples, setPaceSamples] = useState<PaceSample[] | null>(null)
  const [routeCoords, setRouteCoords] = useState<[number, number][] | null>(null)
  const [routeRaw, setRouteRaw] = useState<number[][] | null>(null)
  const [splits, setSplits] = useState<Split[] | null>(null)
  const [mapAllowed, setMapAllowed] = useState<boolean | null>(null) // null = not yet checked
  const [mapFullscreen, setMapFullscreen] = useState(false)
  const [mapStyle, setMapStyle] = useState<'light' | 'dark' | 'outdoors' | 'satellite'>('light')
  const [mapTerrain, setMapTerrain] = useState(false)
  const [showAppModal, setShowAppModal] = useState(false)

  const APP_STORE_URL = 'https://apps.apple.com/us/app/macroaura/id6757357405'

  // Show app modal on first visit — only on mobile, once per session
  useEffect(() => {
    const dismissed = sessionStorage.getItem('app-modal-dismissed')
    if (dismissed) return
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (isMobile) setShowAppModal(true)
  }, [])

  // Fetch meta.json from S3 — URL constructed by your backend convention
  // Backend writes: s3://macroaura-workouts/snapshots/{shareToken}/meta.json (public read)
  // CloudFront or direct S3 URL goes here. Swap VITE_S3_BASE_URL in .env.
  const s3Base = import.meta.env.VITE_S3_BASE_URL ?? 'https://s3.macroaura.com'

  useEffect(() => {
    if (!shareToken) return
    setLoading(true)
    setError(null)
    setHrSamples(null)
    setPaceSamples(null)
    setRouteCoords(null)
    setRouteRaw(null)
    setSplits(null)
    setMapAllowed(null)

    fetch(`${s3Base}/snapshots/${shareToken}/meta.json`)
      .then(res => {
        if (!res.ok) throw new Error(res.status === 404 ? 'not_found' : 'fetch_error')
        return res.json() as Promise<WorkoutMeta>
      })
      .then(data => {
        setMeta(data)
        setLoading(false)
        if ((data.elevationGain ?? 0) >= 100) setMapTerrain(true)

        // Lazy-load route data + check map-load cap if route exists
        if (data.routeDataUrl) {
          const applyRouteData = (raw: number[][] | null) => {
            if (!raw || raw.length < 2) return
            // Extract [lat, lng] pairs for the map
            setRouteCoords(raw.map(p => [p[0], p[1]] as [number, number]))
            setRouteRaw(raw)
            // Compute mile splits from full [lat, lng, timestamp] arrays
            const computed = calculateSplitsFromRaw(raw)
            if (computed.length > 0) setSplits(computed)
            // Compute pace time-series for the chart
            const pace = calculatePaceSeries(raw)
            if (pace.length > 0) setPaceSamples(pace)
          }

          // 1. Ask the server if we're within the map-load budget
          const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'https://api.macroaura.com'
          fetch(`${apiBase}/api/share/public/map-load/${data.shareToken}`, { method: 'POST' })
            .then(r => r.ok ? r.json() : { allowed: false })
            .then(({ allowed }: { allowed: boolean }) => {
              setMapAllowed(allowed)
              if (!allowed) return
              fetch(data.routeDataUrl!)
                .then(r => r.ok ? r.json() : null)
                .then(applyRouteData)
                .catch(() => {})
            })
            .catch(() => setMapAllowed(false))
        }

        // Lazy-load heart rate data if available
        if (data.heartRateDataUrl) {
          fetch(data.heartRateDataUrl)
            .then(r => r.ok ? r.json() : null)
            .then((raw: [number, number][] | null) => {
              if (!raw || raw.length === 0) return
              // raw is [[unix_timestamp_sec, bpm], ...]
              const t0 = raw[0][0]
              const samples: HrSample[] = raw.map(([ts, bpm]) => ({
                min: parseFloat(((ts - t0) / 60).toFixed(1)),
                bpm,
              }))
              setHrSamples(samples)
            })
            .catch(() => { /* non-fatal — chart just won't show */ })
        }
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [shareToken, s3Base])

  // ---------------------------------------------------------------------------
  // Derived display values
  // ---------------------------------------------------------------------------

  const totalSets = meta?.exercises?.reduce((sum, ex) => sum + (ex.sets?.length ?? 0), 0) ?? 0

  const displayStats: { label: string; value: string }[] = []
  if (meta?.totalDurationSec)              displayStats.push({ label: 'Duration',   value: formatDuration(meta.totalDurationSec) })
  if (meta?.distanceMeters)               displayStats.push({ label: 'Distance',   value: formatDistance(meta.distanceMeters) })
  if (meta?.totalCaloriesCal)             displayStats.push({ label: 'Calories',   value: `${meta.totalCaloriesCal} kcal` })
  if (meta?.avgHeartRate)                 displayStats.push({ label: 'Avg HR',     value: `${meta.avgHeartRate} bpm` })
  if (meta?.maxHeartRate)                 displayStats.push({ label: 'Max HR',     value: `${meta.maxHeartRate} bpm` })
  if (meta?.elevationGain)                displayStats.push({ label: 'Elev Gain',  value: `${Math.round(meta.elevationGain)} m` })
  if (meta?.elevationLoss)                displayStats.push({ label: 'Elev Loss',  value: `${Math.round(meta.elevationLoss)} m` })
  if (meta?.steps)                        displayStats.push({ label: 'Steps',      value: meta.steps.toLocaleString() })
  if (meta?.avgCadence)                   displayStats.push({ label: 'Cadence',    value: `${meta.avgCadence} spm` })
  if (meta?.avgPower)                     displayStats.push({ label: 'Avg Power',  value: `${meta.avgPower} W` })
  if (meta?.exercises && meta.exercises.length > 0) {
    displayStats.push({ label: 'Exercises', value: `${meta.exercises.length}` })
    if (totalSets > 0) displayStats.push({ label: 'Sets',       value: `${totalSets}` })
  }

  const gradientClass = categoryColor(meta?.activityCategory)

  // Solid accent color used for the map polyline / end marker
  const accentColor = '#10b981' // emerald-500 — matches the hero card gradient
  const pageTitle = meta
    ? `${meta.title ?? meta.activityTypeName ?? 'Workout'} · MacroAura`
    : 'Workout · MacroAura'

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      {/* App open modal — shown on mobile on first visit */}
      {showAppModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="flex justify-center mb-4">
              <img src="/main-logo.png" alt="MacroAura" className="h-14 w-14 rounded-2xl shadow" />
            </div>
            <h2 className="text-lg font-bold font-display text-gray-900 text-center mb-1">
              Open in MacroAura
            </h2>
            <p className="text-sm text-gray-500 text-center mb-5">
              Get the full experience — track workouts, macros, and your progress.
            </p>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-2xl bg-gray-900 py-3.5 text-center text-sm font-semibold text-white hover:bg-gray-800 transition-colors mb-3"
            >
              Open in App
            </a>
            <button
              onClick={() => {
                sessionStorage.setItem('app-modal-dismissed', '1')
                setShowAppModal(false)
              }}
              className="block w-full rounded-2xl py-3 text-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            >
              Continue in Browser
            </button>
          </motion.div>
        </div>
      )}

      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={meta ? `${meta.userName ?? 'A MacroAura user'} logged a ${meta.activityTypeName ?? 'workout'} on MacroAura.` : 'View this workout on MacroAura.'} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={meta ? `${formatDate(meta.startedAt)} · ${meta.activityTypeName ?? 'Workout'}` : ''} />
        <meta property="og:image" content={`${import.meta.env.VITE_API_BASE_URL ?? 'https://api.macroaura.com'}/api/share/public/og/${shareToken}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-surface flex flex-col">
        <Navbar />

        <main className="flex-1 pt-24 pb-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">

            {/* Error state */}
            {!loading && error && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-gray-100"
              >
                <div className="text-5xl mb-4">🏋️</div>
                <h1 className="text-xl font-bold font-display text-gray-900 mb-2">
                  {error === 'not_found' ? 'Workout not found' : 'Something went wrong'}
                </h1>
                <p className="text-sm text-gray-500">
                  {error === 'not_found'
                    ? 'This share link may have expired or been removed.'
                    : 'Could not load this workout. Please try again.'}
                </p>
                <a
                  href="https://apps.apple.com/us/app/macroaura/id6757357405"
                  className="mt-6 inline-block rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
                >
                  Get MacroAura
                </a>
              </motion.div>
            )}

            {/* Loading skeleton */}
            {loading && (
              <div className="mt-8 space-y-4">
                <Skeleton className="h-40 w-full" />
                <div className="grid grid-cols-3 gap-3">
                  {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-20" />)}
                </div>
                <Skeleton className="h-32 w-full" />
              </div>
            )}

            {/* Content */}
            {!loading && meta && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-8 space-y-4"
              >
                {/* Hero card */}
                <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradientClass} p-6 text-white shadow-lg`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-white/70 mb-1">
                        {meta.userName ? `${meta.userName}'s workout` : 'Workout'}
                      </p>
                      <h1 className="text-2xl font-bold font-display leading-tight">
                        {meta.title ?? meta.activityTypeName ?? 'Workout'}
                      </h1>
                      <p className="mt-1 text-sm text-white/70">{formatDate(meta.startedAt)}</p>
                      <p className="mt-0.5 text-xs text-white/50">
                        {formatTime(meta.startedAt)}{meta.endedAt ? ` – ${formatTime(meta.endedAt)}` : ''}
                      </p>
                    </div>
                    {meta.activityIcon && (
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl">
                        {/* SF Symbol name — just show category initial as fallback on web */}
                        <span className="text-white text-lg font-bold">
                          {(meta.activityTypeName ?? 'W').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  {meta.source !== 'MANUAL' && (
                    <p className="mt-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                      via {meta.sourceAppName ?? meta.source.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                    </p>
                  )}
                </div>

                {/* Highlights */}
                {meta.highlights && meta.highlights.length > 0 && (
                  <HighlightBadges highlights={meta.highlights} />
                )}

                {/* Stats grid */}
                {displayStats.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {displayStats.map(s => (
                      <StatCard key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                )}

                {/* Route Map + Mile Splits side by side */}
                {(meta.routeDataUrl || (splits && splits.length > 0)) && (
                  <div className="flex flex-col lg:flex-row gap-4 items-stretch">
                    {/* Map — takes 3/5 on desktop, height driven by sibling splits card */}
                    <div className="lg:flex-[3] min-w-0 min-h-[380px] relative">
                      {meta.routeDataUrl && mapAllowed === null && (
                        <Skeleton className="absolute inset-0" />
                      )}
                      {mapAllowed === false && (
                        <div className="absolute inset-0 rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 p-4 flex flex-col items-center justify-center gap-2">
                          <p className="text-sm font-semibold text-gray-900">Route</p>
                          <p className="text-xs text-gray-400 text-center">Interactive map unavailable — view limit reached for this link.</p>
                        </div>
                      )}
                      {mapAllowed === true && routeCoords && routeCoords.length >= 2 && (
                        <>
                          <div className="absolute inset-0 rounded-2xl overflow-hidden">
                            <Suspense fallback={<Skeleton className="absolute inset-0" />}>
                              <RouteMap
                                coordinates={routeCoords}
                                rawCoordinates={routeRaw ?? undefined}
                                accentColor={accentColor}
                                elevationGain={meta.elevationGain}
                                activeStyle={mapStyle}
                                onStyleChange={setMapStyle}
                                terrain={mapTerrain}
                                onTerrainChange={setMapTerrain}
                                mileMarkers={splits ? splits.map<MileMarker>(s => ({
                                  mile: s.mile,
                                  lngLat: s.lngLat,
                                  splitSec: s.splitSec,
                                  cumulativeSec: s.cumulativeSec,
                                })) : []}
                              />
                            </Suspense>
                          </div>
                          {/* Fullscreen button */}
                          <button
                            onClick={() => setMapFullscreen(true)}
                            className="absolute top-3 left-3 z-10 flex items-center justify-center h-8 w-8 rounded-lg bg-white/90 shadow-sm ring-1 ring-gray-200 hover:bg-white transition-colors cursor-pointer"
                            title="Full screen"
                          >
                            <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>

                    {/* Mile Splits — takes 2/5 on desktop, natural height drives the row */}
                    {splits && splits.length > 0 && (
                      <div className="lg:flex-[2] rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden flex flex-col">
                        <div className="px-4 py-3 border-b border-gray-50">
                          <p className="text-sm font-semibold text-gray-900">Mile Splits</p>
                        </div>
                        <div className="divide-y divide-gray-50 flex-1">
                          <div className="grid grid-cols-3 px-4 py-2">
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Mile</span>
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide text-center">Split</span>
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide text-right">Pace</span>
                          </div>
                          {splits.map(s => (
                            <div key={s.mile} className="grid grid-cols-3 px-4 py-3 items-center">
                              <span className="text-sm font-semibold text-gray-900">Mile {s.mile}</span>
                              <span className="text-sm text-gray-600 text-center">{formatDuration(Math.round(s.splitSec))}</span>
                              <span className="text-sm font-medium text-emerald-600 text-right">{formatPace(s.splitSec)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Activity Chart — heart rate + pace with toggles */}
                {(hrSamples || paceSamples) && (
                  <ActivityChart hrSamples={hrSamples} paceSamples={paceSamples} />
                )}

                {/* Notes */}
                {meta.notes && (
                  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Notes</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{meta.notes}</p>
                  </div>
                )}

                {/* Exercises */}
                {meta.exercises && meta.exercises.length > 0 && (
                  <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">Exercises</p>
                      <p className="text-xs text-gray-400">
                        {meta.exercises.length} exercise{meta.exercises.length !== 1 ? 's' : ''} · {totalSets} set{totalSets !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <ul className="divide-y divide-gray-50">
                      {meta.exercises.map(ex => {
                        const workingSets = ex.sets?.filter(s => s.setType !== 'WARMUP') ?? []
                        const setsSummary = workingSets.length > 0
                          ? workingSets.map(s => {
                              const parts: string[] = []
                              if (s.reps != null) parts.push(`${s.reps} reps`)
                              if (s.weightLb != null) parts.push(`${s.weightLb} lb`)
                              if (s.durationSec != null) parts.push(`${s.durationSec}s`)
                              return parts.join(' × ')
                            }).filter(Boolean).join('  ·  ')
                          : null

                        return (
                          <li key={ex.exerciseId} className="flex items-center gap-3 px-4 py-3">
                            {/* GIF thumbnail */}
                            {ex.gifKey ? (
                              <div className="flex-shrink-0 h-14 w-14 rounded-xl overflow-hidden bg-gray-50 ring-1 ring-gray-100">
                                <img
                                  src={ex.gifKey}
                                  alt={ex.exerciseName ?? ex.exerciseId}
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                            ) : (
                              <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-gray-100 flex items-center justify-center text-gray-300 text-xl">
                                🏋️
                              </div>
                            )}
                            {/* Info */}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-gray-800 capitalize leading-tight">
                                {ex.exerciseName ?? ex.exerciseId}
                              </p>
                              <p className="mt-0.5 text-xs text-gray-400">
                                {ex.sets && ex.sets.length > 0
                                  ? `${ex.sets.length} set${ex.sets.length !== 1 ? 's' : ''}`
                                  : 'No sets'}
                                {setsSummary ? `  ·  ${setsSummary}` : ''}
                              </p>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}

                {/* Fullscreen map overlay */}
                {mapFullscreen && routeCoords && routeCoords.length >= 2 && (
                  <div className="fixed inset-0 z-50 bg-black">
                    <Suspense fallback={<div className="absolute inset-0 bg-gray-900" />}>
                      <RouteMap
                        coordinates={routeCoords}
                        rawCoordinates={routeRaw ?? undefined}
                        accentColor={accentColor}
                        elevationGain={meta.elevationGain}
                        activeStyle={mapStyle}
                        onStyleChange={setMapStyle}
                        terrain={mapTerrain}
                        onTerrainChange={setMapTerrain}
                        mileMarkers={splits ? splits.map<MileMarker>(s => ({
                          mile: s.mile,
                          lngLat: s.lngLat,
                          splitSec: s.splitSec,
                          cumulativeSec: s.cumulativeSec,
                        })) : []}
                      />
                    </Suspense>
                    <button
                      onClick={() => setMapFullscreen(false)}
                      className="absolute top-4 left-4 z-10 flex items-center justify-center h-9 w-9 rounded-xl bg-white/90 shadow-md ring-1 ring-gray-200 hover:bg-white transition-colors"
                      title="Exit full screen"
                    >
                      <svg className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* App CTA */}
                <div className="rounded-3xl bg-gray-900 p-6 text-white">
                  <div className="flex items-center gap-6">
                    {/* Left: text + button */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <img src="/main-logo.png" alt="MacroAura" className="h-10 w-10 rounded-xl shadow" />
                        <h2 className="text-lg font-bold font-display">MacroAura</h2>
                      </div>
                      <p className="text-sm text-gray-400 mb-4">Track workouts, macros, and your progress — all in one place.</p>
                      <a
                        href={APP_STORE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded-full bg-main px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                      >
                        Download Free
                      </a>
                    </div>
                    {/* Right: QR code — hidden on mobile since they have the modal */}
                    <div className="hidden sm:flex flex-col items-center gap-2 flex-shrink-0">
                      <div className="rounded-xl bg-white p-2">
                        <QRCodeSVG
                          value={APP_STORE_URL}
                          size={80}
                          bgColor="#ffffff"
                          fgColor="#111827"
                          level="M"
                        />
                      </div>
                      <span className="text-xs text-gray-500">Scan to download</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}
