import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'

// ---------------------------------------------------------------------------
// Types mirroring backend WorkoutShareSnapshot
// ---------------------------------------------------------------------------

interface WorkoutStats {
  totalDurationSec?: number
  distanceMeters?: number
  totalCaloriesCal?: number
  avgHeartRate?: number
  avgCadence?: number
  avgPower?: number
  elevationGain?: number
  elevationLoss?: number
  steps?: number
}

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
  userName?: string
  stats: WorkoutStats
  exercises?: WorkoutExercise[]
  // S3 URLs for lazy-loaded large payloads
  routeDataUrl?: string
  heartRateDataUrl?: string
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

function formatDistance(meters: number): string {
  const miles = meters / 1609.344
  return miles >= 1 ? `${miles.toFixed(2)} mi` : `${Math.round(meters)} m`
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function categoryColor(category?: string): string {
  switch (category?.toUpperCase()) {
    case 'CARDIO':    return 'from-orange-500 to-red-500'
    case 'STRENGTH':  return 'from-purple-600 to-indigo-600'
    case 'MIND_BODY': return 'from-teal-500 to-mint-400'
    case 'SPORTS':    return 'from-blue-500 to-purple-500'
    default:          return 'from-gray-500 to-gray-600'
  }
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
// Main Page
// ---------------------------------------------------------------------------

export default function ActivityPage() {
  const { shareToken } = useParams<{ shareToken: string }>()

  const [meta, setMeta] = useState<WorkoutMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch meta.json from S3 — URL constructed by your backend convention
  // Backend writes: s3://macroaura-workouts/snapshots/{shareToken}/meta.json (public read)
  // CloudFront or direct S3 URL goes here. Swap VITE_S3_BASE_URL in .env.
  const s3Base = import.meta.env.VITE_S3_BASE_URL ?? 'https://s3.macroaura.com'

  useEffect(() => {
    if (!shareToken) return
    setLoading(true)
    setError(null)

    fetch(`${s3Base}/snapshots/${shareToken}/meta.json`)
      .then(res => {
        if (!res.ok) throw new Error(res.status === 404 ? 'not_found' : 'fetch_error')
        return res.json() as Promise<WorkoutMeta>
      })
      .then(data => {
        setMeta(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [shareToken, s3Base])

  // ---------------------------------------------------------------------------
  // Derived display values
  // ---------------------------------------------------------------------------

  const stats = meta?.stats
  const displayStats: { label: string; value: string }[] = []
  if (stats?.totalDurationSec)  displayStats.push({ label: 'Duration',   value: formatDuration(stats.totalDurationSec) })
  if (stats?.distanceMeters)    displayStats.push({ label: 'Distance',   value: formatDistance(stats.distanceMeters) })
  if (stats?.totalCaloriesCal)  displayStats.push({ label: 'Calories',   value: `${stats.totalCaloriesCal} kcal` })
  if (stats?.avgHeartRate)      displayStats.push({ label: 'Avg HR',     value: `${stats.avgHeartRate} bpm` })
  if (stats?.elevationGain)     displayStats.push({ label: 'Elevation',  value: `${Math.round(stats.elevationGain)} m` })
  if (stats?.steps)             displayStats.push({ label: 'Steps',      value: stats.steps.toLocaleString() })
  if (stats?.avgCadence)        displayStats.push({ label: 'Cadence',    value: `${stats.avgCadence} spm` })
  if (stats?.avgPower)          displayStats.push({ label: 'Power',      value: `${stats.avgPower} W` })

  const gradientClass = categoryColor(meta?.activityCategory)
  const pageTitle = meta
    ? `${meta.title ?? meta.activityTypeName ?? 'Workout'} · MacroAura`
    : 'Workout · MacroAura'

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={meta ? `${meta.userName ?? 'A MacroAura user'} logged a ${meta.activityTypeName ?? 'workout'} on MacroAura.` : 'View this workout on MacroAura.'} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={meta ? `${formatDate(meta.startedAt)} · ${meta.activityTypeName ?? 'Workout'}` : ''} />
        <meta property="og:image" content="https://www.macroaura.com/logo-small.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-surface flex flex-col">
        <Navbar />

        <main className="flex-1 pt-24 pb-16">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">

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
                      via {meta.source.replace('_', ' ')}
                    </p>
                  )}
                </div>

                {/* Stats grid */}
                {displayStats.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {displayStats.map(s => (
                      <StatCard key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
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
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-sm font-semibold text-gray-900">Exercises</p>
                    </div>
                    <ul className="divide-y divide-gray-50">
                      {meta.exercises.map(ex => (
                        <li key={ex.exerciseId} className="px-4 py-3">
                          <p className="text-sm font-semibold text-gray-800">{ex.exerciseName ?? ex.exerciseId}</p>
                          {ex.sets && ex.sets.length > 0 && (
                            <p className="mt-0.5 text-xs text-gray-400">
                              {ex.sets.length} set{ex.sets.length !== 1 ? 's' : ''}
                              {ex.sets[0].reps != null ? ` · ${ex.sets[0].reps} reps` : ''}
                              {ex.sets[0].weightLb != null ? ` · ${ex.sets[0].weightLb} lb` : ''}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* App CTA */}
                <div className="rounded-3xl bg-gray-900 p-6 text-center text-white">
                  <div className="flex justify-center mb-3">
                    <img src="/main-logo.png" alt="MacroAura" className="h-12 w-12 rounded-2xl shadow" />
                  </div>
                  <h2 className="text-lg font-bold font-display mb-1">Train smarter with MacroAura</h2>
                  <p className="text-sm text-gray-400 mb-4">Track workouts, macros, and your progress — all in one place.</p>
                  <a
                    href="https://apps.apple.com/us/app/macroaura/id6757357405"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full bg-main px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                  >
                    Download Free
                  </a>
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
