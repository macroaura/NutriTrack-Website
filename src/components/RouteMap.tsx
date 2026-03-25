import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

type LatLng = [number, number]

export interface MileMarker {
  mile: number
  lngLat: [number, number]
  splitSec: number
  cumulativeSec: number
}

interface ReplayMileThreshold {
  mile: number
  splitSec: number
  position: number
}

interface RouteMapProps {
  coordinates: LatLng[]
  rawCoordinates?: number[][]   // [lat, lng, timestamp] — enables animated replay
  accentColor?: string
  mileMarkers?: MileMarker[]
  elevationGain?: number
  activeStyle?: StyleId
  onStyleChange?: (style: StyleId) => void
  terrain?: boolean
  onTerrainChange?: (enabled: boolean) => void
}

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string

const MAP_STYLES = [
  { id: 'light',     label: 'Light',     url: 'mapbox://styles/mapbox/light-v11' },
  { id: 'dark',      label: 'Dark',      url: 'mapbox://styles/mapbox/dark-v11' },
  { id: 'outdoors',  label: 'Outdoors',  url: 'mapbox://styles/mapbox/outdoors-v12' },
  { id: 'satellite', label: 'Satellite', url: 'mapbox://styles/mapbox/satellite-streets-v12' },
] as const

type StyleId = typeof MAP_STYLES[number]['id']

const TERRAIN_PITCH = 60
const REPLAY_POINTS_PER_SEC = 8   // GPS points to advance per second of replay
const MIN_REPLAY_MS = 20_000      // shortest possible replay (20s)
const MAX_REPLAY_MS = 180_000     // longest possible replay (3 min)
const REPLAY_PITCH = 60
const REPLAY_ZOOM = 16

/** Bearing in degrees from point A to point B */
function bearing(a: [number, number], b: [number, number]): number {
  const [lng1, lat1] = a.map(v => v * Math.PI / 180)
  const [lng2, lat2] = b.map(v => v * Math.PI / 180)
  const dLng = lng2 - lng1
  const y = Math.sin(dLng) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360
}

/** Smooth bearing by averaging over a lookahead window of points */
function smoothBearing(lngLats: [number, number][], idx: number, window = 15): number {
  const ahead = Math.min(idx + window, lngLats.length - 1)
  if (ahead === idx) return 0
  return bearing(lngLats[idx], lngLats[ahead])
}

/** Shortest angular delta between two bearings (-180 to 180) */
function bearingDelta(a: number, b: number): number {
  let d = b - a
  while (d > 180) d -= 360
  while (d < -180) d += 360
  return d
}

const METERS_PER_MILE = 1609.344

function haversineMeters(a: [number, number], b: [number, number]): number {
  const R = 6_371_000
  const [lng1, lat1] = a.map(v => v * Math.PI / 180)
  const [lng2, lat2] = b.map(v => v * Math.PI / 180)
  const dLat = lat2 - lat1, dLng = lng2 - lng1
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}

/**
 * Map each mile marker to the replay position where the route first reaches
 * that distance. This keeps toast ordering tied to route progress rather than
 * raw point proximity, which can drift around interpolated markers.
 */
function buildReplayMileThresholds(raw: number[][], mileMarkers: MileMarker[]): ReplayMileThreshold[] {
  if (raw.length < 2 || mileMarkers.length === 0) return []

  const sortedMarkers = [...mileMarkers].sort((a, b) => a.mile - b.mile)
  const thresholds: ReplayMileThreshold[] = []
  let markerIdx = 0
  let cumDist = 0

  for (let i = 1; i < raw.length && markerIdx < sortedMarkers.length; i++) {
    const prevPt: [number, number] = [raw[i - 1][1], raw[i - 1][0]]
    const nextPt: [number, number] = [raw[i][1], raw[i][0]]
    const seg = haversineMeters(prevPt, nextPt)
    const prevCumDist = cumDist
    cumDist += seg

    while (markerIdx < sortedMarkers.length && cumDist >= sortedMarkers[markerIdx].mile * METERS_PER_MILE) {
      const targetDist = sortedMarkers[markerIdx].mile * METERS_PER_MILE
      const ratio = seg > 0 ? (targetDist - prevCumDist) / seg : 0
      thresholds.push({
        mile: sortedMarkers[markerIdx].mile,
        splitSec: sortedMarkers[markerIdx].splitSec,
        position: (i - 1) + Math.max(0, Math.min(1, ratio)),
      })
      markerIdx++
    }
  }

  while (markerIdx < sortedMarkers.length) {
    thresholds.push({
      mile: sortedMarkers[markerIdx].mile,
      splitSec: sortedMarkers[markerIdx].splitSec,
      position: raw.length - 1,
    })
    markerIdx++
  }

  return thresholds
}

/** Lerp between two hex colors by t (0–1) */
function lerpColor(a: string, b: string, t: number): string {
  const parse = (hex: string) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ]
  const [ar, ag, ab] = parse(a)
  const [br, bg, bb] = parse(b)
  const r = Math.round(ar + (br - ar) * t)
  const g = Math.round(ag + (bg - ag) * t)
  const bl = Math.round(ab + (bb - ab) * t)
  return `#${[r, g, bl].map(v => v.toString(16).padStart(2, '0')).join('')}`
}

/** Map a pace (sec/mile) to a color. Fast=green, medium=yellow, slow=red */
function paceToColor(secPerMile: number): string {
  const FAST = 360   // 6:00/mi — green
  const SLOW = 720   // 12:00/mi — red
  const t = Math.max(0, Math.min(1, (secPerMile - FAST) / (SLOW - FAST)))
  if (t < 0.5) return lerpColor('#22c55e', '#eab308', t * 2)       // green → yellow
  return lerpColor('#eab308', '#ef4444', (t - 0.5) * 2)            // yellow → red
}

/**
 * Build a GeoJSON FeatureCollection of short segments, each colored by pace.
 * Uses a rolling window to smooth noisy GPS readings.
 */
function buildPaceHeatmap(raw: number[][]): GeoJSON.FeatureCollection {
  // raw is [lat, lng, timestamp]
  const WINDOW = 8
  const features: GeoJSON.Feature[] = []

  for (let i = 1; i < raw.length; i++) {
    const j = Math.max(0, i - WINDOW)
    const dt = raw[i][2] - raw[j][2]
    if (dt < 3) continue
    let dist = 0
    for (let k = j + 1; k <= i; k++) {
      dist += haversineMeters(
        [raw[k - 1][1], raw[k - 1][0]],
        [raw[k][1], raw[k][0]]
      )
    }
    if (dist < 1) continue
    const secPerMile = (dt / dist) * METERS_PER_MILE
    if (secPerMile < 180 || secPerMile > 1500) continue

    features.push({
      type: 'Feature',
      properties: { color: paceToColor(secPerMile) },
      geometry: {
        type: 'LineString',
        coordinates: [
          [raw[i - 1][1], raw[i - 1][0]],
          [raw[i][1], raw[i][0]],
        ],
      },
    })
  }

  return { type: 'FeatureCollection', features }
}

function formatSplit(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = Math.round(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function formatPace(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = Math.round(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')} /mi`
}

function formatCumulative(sec: number): string {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = Math.round(sec % 60)
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  return `${m}:${s.toString().padStart(2, '0')}`
}

function addRouteAndMarkers(
  map: mapboxgl.Map,
  lngLats: [number, number][],
  accentColor: string,
  mileMarkers: MileMarker[],
  rawCoordinates?: number[][],
) {
  if (map.getSource('route')) return

  map.addSource('route', {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates: lngLats },
    },
  })

  map.addLayer({
    id: 'route-casing',
    type: 'line',
    source: 'route',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: { 'line-color': '#ffffff', 'line-width': 6 },
  })

  map.addLayer({
    id: 'route-line',
    type: 'line',
    source: 'route',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: { 'line-color': accentColor, 'line-width': 3.5 },
  })

  // Pace heatmap — colored segments (hidden by default until toggled)
  const heatmapData = rawCoordinates ? buildPaceHeatmap(rawCoordinates) : { type: 'FeatureCollection' as const, features: [] }
  map.addSource('pace-heatmap', { type: 'geojson', data: heatmapData })
  map.addLayer({
    id: 'pace-heatmap-casing',
    type: 'line',
    source: 'pace-heatmap',
    layout: { 'line-join': 'round', 'line-cap': 'round', visibility: 'none' },
    paint: { 'line-color': '#ffffff', 'line-width': 6 },
  })
  map.addLayer({
    id: 'pace-heatmap-line',
    type: 'line',
    source: 'pace-heatmap',
    layout: { 'line-join': 'round', 'line-cap': 'round', visibility: 'none' },
    paint: { 'line-color': ['get', 'color'], 'line-width': 3.5 },
  })

  // Replay animated line (starts empty)
  map.addSource('route-replay', {
    type: 'geojson',
    data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] } },
  })
  map.addLayer({
    id: 'route-replay-casing',
    type: 'line',
    source: 'route-replay',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: { 'line-color': '#ffffff', 'line-width': 7 },
  })
  map.addLayer({
    id: 'route-replay-line',
    type: 'line',
    source: 'route-replay',
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: { 'line-color': accentColor, 'line-width': 4 },
  })

  const startEl = document.createElement('div')
  startEl.style.cssText = `
    width: 14px; height: 14px;
    background: #22c55e;
    border: 3px solid #fff;
    border-radius: 50%;
    box-shadow: 0 1px 4px rgba(0,0,0,0.25);
  `
  new mapboxgl.Marker({ element: startEl }).setLngLat(lngLats[0]).addTo(map)

  const endEl = document.createElement('div')
  endEl.style.cssText = `
    font-size: 22px; line-height: 1;
    filter: drop-shadow(0 1px 3px rgba(0,0,0,0.35));
    user-select: none;
  `
  endEl.textContent = '🏁'
  new mapboxgl.Marker({ element: endEl, anchor: 'bottom' })
    .setLngLat(lngLats[lngLats.length - 1])
    .addTo(map)

  mileMarkers.forEach(marker => {
    const el = document.createElement('div')
    el.style.cssText = `
      width: 16px; height: 16px;
      background: #1f2937;
      border: 2px solid #fff;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 8px; font-weight: 700;
      color: #fff;
      font-family: system-ui, sans-serif;
      box-shadow: 0 1px 4px rgba(0,0,0,0.35);
      cursor: pointer;
      user-select: none;
    `
    el.textContent = String(marker.mile)

    const popup = new mapboxgl.Popup({
      closeButton: false,
      offset: 14,
      className: 'mile-popup',
    }).setHTML(`
      <div style="font-family:system-ui,sans-serif;padding:8px 10px;min-width:110px">
        <div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Mile ${marker.mile}</div>
        <div style="display:flex;justify-content:space-between;gap:12px">
          <div>
            <div style="font-size:10px;color:#9ca3af">Split</div>
            <div style="font-size:13px;font-weight:700;color:#111827">${formatSplit(marker.splitSec)}</div>
          </div>
          <div>
            <div style="font-size:10px;color:#9ca3af">Pace</div>
            <div style="font-size:13px;font-weight:700;color:#10b981">${formatPace(marker.splitSec)}</div>
          </div>
          <div>
            <div style="font-size:10px;color:#9ca3af">Elapsed</div>
            <div style="font-size:13px;font-weight:700;color:#111827">${formatCumulative(marker.cumulativeSec)}</div>
          </div>
        </div>
      </div>
    `)

    new mapboxgl.Marker({ element: el })
      .setLngLat(marker.lngLat)
      .setPopup(popup)
      .addTo(map)
  })
}

function applyTerrain(map: mapboxgl.Map, enabled: boolean) {
  if (enabled) {
    if (!map.getSource('mapbox-dem')) {
      map.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      })
    }
    map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 })
    if (!map.getLayer('sky')) {
      map.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0, 90],
          'sky-atmosphere-sun-intensity': 15,
        },
      })
    }
    map.easeTo({ pitch: TERRAIN_PITCH, duration: 600 })
  } else {
    map.setTerrain(null)
    if (map.getLayer('sky')) map.removeLayer('sky')
    if (map.getSource('mapbox-dem')) map.removeSource('mapbox-dem')
    map.easeTo({ pitch: 0, duration: 600 })
  }
}

export default function RouteMap({
  coordinates,
  rawCoordinates,
  accentColor = '#10b981',
  mileMarkers = [],
  elevationGain,
  activeStyle: activeStyleProp,
  onStyleChange,
  terrain: terrainProp,
  onTerrainChange,
}: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  const [activeStyleInternal, setActiveStyleInternal] = useState<StyleId>('light')
  const [terrainInternal, setTerrainInternal] = useState(() => (elevationGain ?? 0) >= 100)
  const activeStyle = activeStyleProp ?? activeStyleInternal
  const terrain = terrainProp ?? terrainInternal
  const setActiveStyle = (s: StyleId) => { setActiveStyleInternal(s); onStyleChange?.(s) }
  const setTerrain = (fn: (v: boolean) => boolean) => {
    const next = fn(terrain)
    setTerrainInternal(next)
    onTerrainChange?.(next)
  }

  const [showPaceHeatmap, setShowPaceHeatmap] = useState(false)
  const showPaceHeatmapRef = useRef(false)
  useEffect(() => { showPaceHeatmapRef.current = showPaceHeatmap }, [showPaceHeatmap])

  // Sync pace heatmap visibility to map layers
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    const vis = showPaceHeatmap ? 'visible' : 'none'
    // Heatmap on = solid route hidden; heatmap off = solid route visible
    if (map.getLayer('pace-heatmap-line')) {
      map.setLayoutProperty('pace-heatmap-line', 'visibility', vis)
      map.setLayoutProperty('pace-heatmap-casing', 'visibility', vis)
    }
    if (map.getLayer('route-line')) {
      map.setLayoutProperty('route-line', 'visibility', showPaceHeatmap ? 'none' : 'visible')
      map.setLayoutProperty('route-casing', 'visibility', showPaceHeatmap ? 'none' : 'visible')
    }
  }, [showPaceHeatmap])

  // Replay state
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0) // 0–1
  const rafRef = useRef<number | null>(null)
  const replayStartTimeRef = useRef<number | null>(null)
  const replayStartProgressRef = useRef(0)
  const dotMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const boundsRef = useRef<mapboxgl.LngLatBounds | null>(null)
  const lastBearingRef = useRef<number>(0)
  const lastCameraUpdateRef = useRef<number>(0)
  const mileThresholdsRef = useRef<ReplayMileThreshold[]>([])
  const nextMileToastIdxRef = useRef(0)

  // Mile toast state
  interface MileToast { mile: number; pace: string }
  const [mileToast, setMileToast] = useState<MileToast | null>(null)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Stable refs
  const coordsRef = useRef(coordinates)
  const accentRef = useRef(accentColor)
  const markersRef = useRef(mileMarkers)
  const terrainRef = useRef(terrain)
  const rawRef = useRef(rawCoordinates)
  useEffect(() => { coordsRef.current = coordinates }, [coordinates])
  useEffect(() => { accentRef.current = accentColor }, [accentColor])
  useEffect(() => { markersRef.current = mileMarkers }, [mileMarkers])
  useEffect(() => { terrainRef.current = terrain }, [terrain])
  useEffect(() => { rawRef.current = rawCoordinates }, [rawCoordinates])
  useEffect(() => {
    mileThresholdsRef.current = rawCoordinates ? buildReplayMileThresholds(rawCoordinates, mileMarkers) : []
    nextMileToastIdxRef.current = 0
  }, [rawCoordinates, mileMarkers])

  // Build lngLats from rawCoordinates for replay (has timestamps)
  // Falls back to coordinates if raw not available
  const replayLngLats: [number, number][] | null = rawCoordinates
    ? rawCoordinates.map(p => [p[1], p[0]] as [number, number])
    : null

  // ---------------------------------------------------------------------------
  // Replay animation
  // ---------------------------------------------------------------------------

  const stopReplay = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    replayStartTimeRef.current = null
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setMileToast(null)
  }

  const resetCamera = () => {
    const map = mapRef.current
    if (!map || !boundsRef.current) return
    map.easeTo({ pitch: terrainRef.current ? TERRAIN_PITCH : 0, bearing: 0, duration: 800 })
    setTimeout(() => {
      map.fitBounds(boundsRef.current!, { padding: 50, maxZoom: 16, duration: 800 })
    }, 200)
  }

  const updateReplayFrame = (p: number, followCamera = false) => {
    const map = mapRef.current
    const lngLats = replayLngLats
    if (!map || !lngLats || !map.getSource('route-replay')) return

    // Interpolate exact position between two GPS points for smooth dot movement
    const exact = p * (lngLats.length - 1)
    const idx = Math.min(Math.floor(exact), lngLats.length - 2)
    const frac = exact - idx
    const a = lngLats[idx]
    const b = lngLats[idx + 1]
    const head: [number, number] = [
      a[0] + (b[0] - a[0]) * frac,
      a[1] + (b[1] - a[1]) * frac,
    ]

    // Update the replay polyline up to the current index
    const visible = lngLats.slice(0, idx + 2)
    ;(map.getSource('route-replay') as mapboxgl.GeoJSONSource).setData({
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates: visible },
    })

    // Move dot marker
    if (!dotMarkerRef.current) {
      const el = document.createElement('div')
      el.style.cssText = `
        width: 16px; height: 16px;
        background: #fff;
        border: 3px solid ${accentRef.current};
        border-radius: 50%;
        box-shadow: 0 0 0 4px ${accentRef.current}50;
      `
      dotMarkerRef.current = new mapboxgl.Marker({ element: el, pitchAlignment: 'map' })
        .setLngLat(head)
        .addTo(map)
    } else {
      dotMarkerRef.current.setLngLat(head)
    }

    // Mile toast — tied to cumulative route distance so markers always fire in order.
    if (followCamera) {
      const nextThreshold = mileThresholdsRef.current[nextMileToastIdxRef.current]
      if (nextThreshold && exact >= nextThreshold.position) {
        nextMileToastIdxRef.current += 1
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
        setMileToast({ mile: nextThreshold.mile, pace: formatPace(nextThreshold.splitSec) })
        toastTimerRef.current = setTimeout(() => setMileToast(null), 3500)
      }
    }

    // Follow camera — throttled to every 150ms, bearing smoothed over a lookahead window
    if (followCamera) {
      const now = performance.now()
      if (now - lastCameraUpdateRef.current < 150) return
      lastCameraUpdateRef.current = now

      const targetBearing = smoothBearing(lngLats, idx)
      const delta = bearingDelta(lastBearingRef.current, targetBearing)
      const nextBearing = Math.abs(delta) > 3
        ? lastBearingRef.current + delta * 0.25
        : lastBearingRef.current
      lastBearingRef.current = nextBearing

      map.easeTo({
        center: head,
        zoom: REPLAY_ZOOM,
        pitch: REPLAY_PITCH,
        bearing: nextBearing,
        duration: 200,
        easing: t => t,
      })
    }
  }

  const startReplay = () => {
    stopReplay()
    const startP = progress >= 1 ? 0 : progress
    replayStartProgressRef.current = startP
    replayStartTimeRef.current = null

    const lngLats = replayLngLats
    const totalPoints = lngLats?.length ?? 0
    const startExact = totalPoints > 1 ? startP * (totalPoints - 1) : 0

    let nextToastIdx = 0
    while (
      nextToastIdx < mileThresholdsRef.current.length &&
      mileThresholdsRef.current[nextToastIdx].position <= startExact
    ) {
      nextToastIdx++
    }
    nextMileToastIdxRef.current = nextToastIdx

    // Scale duration to keep a consistent points-per-second feel
    const replayDurationMs = Math.min(
      Math.max((totalPoints / REPLAY_POINTS_PER_SEC) * 1000, MIN_REPLAY_MS),
      MAX_REPLAY_MS
    )

    // Cinematic intro — zoom out first, then swoop in to the start position
    const map = mapRef.current
    if (map && lngLats) {
      const startIdx = Math.floor(startP * (lngLats.length - 1))
      const startPt = lngLats[startIdx]
      const initialBearing = smoothBearing(lngLats, startIdx)
      lastBearingRef.current = initialBearing
      lastCameraUpdateRef.current = 0

      // Step 1 — pull back to overhead view (0.6s)
      map.easeTo({
        zoom: REPLAY_ZOOM - 4,
        pitch: 0,
        bearing: 0,
        duration: 600,
        easing: t => t * (2 - t),
      })

      // Step 2 — rotate and begin descending toward start (1.2s)
      setTimeout(() => {
        map.easeTo({
          center: startPt,
          zoom: REPLAY_ZOOM - 1.5,
          pitch: 30,
          bearing: initialBearing,
          duration: 1200,
          easing: t => t * (2 - t),
        })
      }, 600)

      // Step 3 — final swoop down to ground level (1s)
      setTimeout(() => {
        map.easeTo({
          center: startPt,
          zoom: REPLAY_ZOOM,
          pitch: REPLAY_PITCH,
          bearing: initialBearing,
          duration: 1000,
          easing: t => t * t * (3 - 2 * t), // smooth-step
        })
      }, 1800)
    }

    const tick = (now: number) => {
      if (replayStartTimeRef.current == null) replayStartTimeRef.current = now
      const elapsed = now - replayStartTimeRef.current
      const p = Math.min(replayStartProgressRef.current + elapsed / replayDurationMs, 1)
      setProgress(p)
      updateReplayFrame(p, true)
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setIsPlaying(false)
        rafRef.current = null
        resetCamera()
      }
    }
    // Wait for the full cinematic intro before starting the replay tick
    setTimeout(() => { rafRef.current = requestAnimationFrame(tick) }, 2900)
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      stopReplay()
      setIsPlaying(false)
      resetCamera()
    } else {
      setIsPlaying(true)
      startReplay()
    }
  }

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const p = parseFloat(e.target.value)
    stopReplay()
    setIsPlaying(false)
    setProgress(p)
    updateReplayFrame(p, false)
  }

  // Clean up on unmount
  useEffect(() => () => stopReplay(), [])

  // ---------------------------------------------------------------------------
  // Map setup
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!containerRef.current || coordinates.length < 2 || !TOKEN) return

    mapboxgl.accessToken = TOKEN

    const lngLats: [number, number][] = coordinates.map(([lat, lng]) => [lng, lat])
    const initialTerrain = (elevationGain ?? 0) >= 100

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAP_STYLES[0].url,
      interactive: true,
      attributionControl: false,
      pitch: initialTerrain ? TERRAIN_PITCH : 0,
    })

    mapRef.current = map

    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right')
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')

    const onStyleLoad = () => {
      dotMarkerRef.current = null // markers are removed on style change
      addRouteAndMarkers(map, lngLats, accentRef.current, markersRef.current, rawRef.current)
      if (terrainRef.current) applyTerrain(map, true)
      // Re-apply heatmap visibility after style reload
      if (showPaceHeatmapRef.current) {
        map.setLayoutProperty('pace-heatmap-line', 'visibility', 'visible')
        map.setLayoutProperty('pace-heatmap-casing', 'visibility', 'visible')
        map.setLayoutProperty('route-line', 'visibility', 'none')
        map.setLayoutProperty('route-casing', 'visibility', 'none')
      }
      // Restore replay progress if mid-replay
      if (replayStartProgressRef.current > 0) {
        updateReplayFrame(replayStartProgressRef.current)
      }
    }

    map.on('style.load', onStyleLoad)

    map.on('load', () => {
      const bounds = lngLats.reduce(
        (b, coord) => b.extend(coord as [number, number]),
        new mapboxgl.LngLatBounds(lngLats[0], lngLats[0])
      )
      boundsRef.current = bounds
      map.fitBounds(bounds, { padding: 50, maxZoom: 16, duration: 0 })
    })

    return () => {
      stopReplay()
      map.remove()
      mapRef.current = null
      dotMarkerRef.current = null
    }
  }, [coordinates, elevationGain]) // eslint-disable-line react-hooks/exhaustive-deps

  // Style switching
  const handleStyleChange = (styleId: StyleId) => {
    if (styleId === activeStyle) return
    setActiveStyle(styleId)
    const map = mapRef.current
    if (!map) return
    const styleUrl = MAP_STYLES.find(s => s.id === styleId)!.url
    if (map.isStyleLoaded()) {
      map.setStyle(styleUrl)
    } else {
      map.once('load', () => map.setStyle(styleUrl))
    }
  }

  // Sync controlled activeStyle prop
  const prevStyleRef = useRef(activeStyle)
  useEffect(() => {
    if (activeStyle === prevStyleRef.current) return
    prevStyleRef.current = activeStyle
    const map = mapRef.current
    if (!map) return
    const styleUrl = MAP_STYLES.find(s => s.id === activeStyle)!.url
    if (map.isStyleLoaded()) {
      map.setStyle(styleUrl)
    } else {
      map.once('load', () => map.setStyle(styleUrl))
    }
  }, [activeStyle])

  // Sync controlled terrain prop
  const prevTerrainRef = useRef(terrain)
  useEffect(() => {
    if (terrain === prevTerrainRef.current) return
    prevTerrainRef.current = terrain
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    applyTerrain(map, terrain)
  }, [terrain])

  if (!TOKEN) return null

  const hasReplay = !!replayLngLats && replayLngLats.length > 1

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="w-full h-full rounded-2xl overflow-hidden ring-1 ring-gray-100 shadow-sm"
      />

      {/* Top-right button group */}
      <div className="absolute top-3 right-12 z-10 flex items-center gap-1.5">
        {/* Pace heatmap toggle — only shown when raw GPS data is available */}
        {rawCoordinates && rawCoordinates.length > 1 && (
          <button
            onClick={() => setShowPaceHeatmap(v => !v)}
            title={showPaceHeatmap ? 'Show solid route' : 'Show pace heatmap'}
            className={`flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-semibold shadow-sm ring-1 transition-colors cursor-pointer ${
              showPaceHeatmap
                ? 'bg-green-500 text-white ring-green-500 hover:bg-green-500'
                : 'bg-white/90 text-gray-700 ring-gray-200 hover:bg-white'
            }`}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" d="M3 12c3-6 5-6 6 0s3 6 6 0 3-6 6 0" />
            </svg>
            Pace
          </button>
        )}

        {/* 3D terrain toggle */}
        <button
          onClick={() => setTerrain(v => !v)}
          title={terrain ? 'Disable 3D terrain' : 'Enable 3D terrain'}
          className={`flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-semibold shadow-sm ring-1 transition-colors cursor-pointer ${
            terrain
              ? 'bg-green-500 text-white ring-green-500 hover:bg-green-500'
              : 'bg-white/90 text-gray-700 ring-gray-200 hover:bg-white'
          }`}
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.5 6l-5 8h3l-3 6h10l-5-8h3z" />
          </svg>
          3D
        </button>
      </div>

      {/* Mile toast */}
      {mileToast && (
        <div
          key={mileToast.mile}
          className="absolute top-14 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-gray-900/95 backdrop-blur-sm text-white rounded-2xl px-4 py-3 shadow-xl animate-fade-in-up pointer-events-none"
          style={{ animation: 'fadeInUp 0.3s ease-out' }}
        >
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-500 text-sm font-bold flex-shrink-0">
            {mileToast.mile}
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 leading-none mb-0.5">Mile {mileToast.mile}</span>
            <span className="text-sm font-bold leading-none">{mileToast.pace}</span>
          </div>
        </div>
      )}

      {/* Replay controls */}
      {hasReplay && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-md ring-1 ring-gray-200">
          {/* Play / Pause */}
          <button
            onClick={handlePlayPause}
            className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-900 text-white hover:bg-gray-700 transition-colors cursor-pointer flex-shrink-0"
          >
            {isPlaying ? (
              // Pause icon
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              // Play icon
              <svg className="h-3 w-3 translate-x-px" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Scrubber */}
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={progress}
            onChange={handleScrub}
            className="w-32 h-1 accent-emerald-500 cursor-pointer"
          />

          {/* Progress label */}
          <span className="text-xs font-medium text-gray-500 w-8 text-right tabular-nums">
            {Math.round(progress * 100)}%
          </span>
        </div>
      )}

      {/* Style picker */}
      <select
        value={activeStyle}
        onChange={e => handleStyleChange(e.target.value as StyleId)}
        className="absolute bottom-3 left-3 z-10 h-8 rounded-lg bg-white/90 px-2 pr-6 text-xs font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200 cursor-pointer appearance-none hover:bg-white transition-colors focus:outline-none"
      >
        {MAP_STYLES.map(style => (
          <option key={style.id} value={style.id}>{style.label}</option>
        ))}
      </select>
    </div>
  )
}
