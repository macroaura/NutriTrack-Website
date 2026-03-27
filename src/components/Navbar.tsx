import { useEffect, useRef, useState } from 'react'
import { gaEvent } from '../analytics'
import { motion } from 'framer-motion'
import { NavLink, Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  const isLanding = location.pathname === '/'
  const headerRef = useRef<HTMLElement | null>(null)
  const previousScrollYRef = useRef(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isOverHero, setIsOverHero] = useState(isLanding)

  const useLightTheme = isLanding && isOverHero
  const navLinkBaseClass =
    'group relative rounded-full px-4 py-2 text-sm font-semibold transition-transform duration-300 hover:-translate-y-px before:pointer-events-none before:absolute before:bottom-[0.15rem] before:left-4 before:right-4 before:h-3 before:rounded-full before:opacity-0 before:blur-md before:transition-opacity before:duration-300 after:pointer-events-none after:absolute after:bottom-[0.5rem] after:left-4 after:right-4 after:h-[2px] after:origin-center after:scale-x-0 after:rounded-full after:transition-transform after:duration-300'
  const navLinkThemeClass = useLightTheme
    ? 'before:bg-white/35 after:bg-white [text-shadow:0_1px_10px_rgba(0,0,0,0.28)]'
    : 'before:bg-main/20 after:bg-gray-950'
  const navLinkTextClass = useLightTheme ? 'text-white/92' : 'text-gray-800'
  const navLinkActiveTextClass = useLightTheme ? 'text-white' : 'text-gray-950'
  const getNavLinkClass = (isActive: boolean) =>
    `${navLinkBaseClass} ${navLinkThemeClass} ${
      isActive
        ? `${navLinkActiveTextClass} before:opacity-100 after:scale-x-100`
        : `${navLinkTextClass} hover:before:opacity-100 hover:after:scale-x-100`
    }`

  const syncHeroTheme = () => {
    if (!isLanding) {
      setIsOverHero(false)
      return
    }

    const hero = document.getElementById('landing-section-hero')
    if (!hero) {
      setIsOverHero(false)
      return
    }

    const trigger = Math.max((headerRef.current?.offsetHeight ?? 80) - 12, 48)
    const heroRect = hero.getBoundingClientRect()
    setIsOverHero(heroRect.top <= trigger && heroRect.bottom > trigger)
  }

  useEffect(() => {
    setIsVisible(true)
    previousScrollYRef.current = window.scrollY
    syncHeroTheme()
  }, [location.pathname])

  useEffect(() => {
    syncHeroTheme()
    previousScrollYRef.current = window.scrollY

    const handleScroll = () => {
      const current = window.scrollY
      const previous = previousScrollYRef.current

      syncHeroTheme()

      if (current < 32) {
        setIsVisible(true)
        previousScrollYRef.current = current
        return
      }

      const delta = current - previous
      if (Math.abs(delta) >= 4) {
        setIsVisible(delta < 0)
      }

      previousScrollYRef.current = current
    }

    window.addEventListener('resize', syncHeroTheme)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('resize', syncHeroTheme)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [location.pathname])

  return (
    <motion.header
      ref={headerRef}
      initial={false}
      animate={isVisible ? 'visible' : 'hidden'}
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: '-120%', opacity: 0 },
      }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4 ${
        isVisible ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-start px-0 py-0 md:justify-between md:px-4 md:py-3 ${
          isLanding
            ? 'md:rounded-full md:border-2 md:border-white/10 md:bg-white/10 md:backdrop-blur-[1.25rem] md:shadow-[inset_0_0_0.75rem_rgba(255,255,255,0.10),0_0.25rem_1.125rem_rgba(0,0,0,0.12)]'
            : 'md:rounded-[1.75rem] md:border md:border-black/10 md:bg-white/95 md:shadow-[0_18px_60px_rgba(15,23,42,0.14)] md:backdrop-blur-xl'
        }`}
      >
        <Link to="/" className="group flex items-center gap-3 rounded-full px-3 py-2 cursor-pointer md:px-0 md:py-0">
          <img
            src={useLightTheme ? '/macroaura-white-logo.png' : '/macroaura-black-logo.png'}
            alt="MacroAura logo"
            width={60}
            height={60}
            decoding="async"
            className="h-10 w-10 rounded-xl  transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3"
          />
          <span
            className={`text-xl font-display font-bold tracking-tight ${
              useLightTheme
                ? 'text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.35)]'
                : 'text-gray-950'
            }`}
          >
            MacroAura
          </span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-3 md:flex">
          <NavLink
            to="/"
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            Home
          </NavLink>

          <NavLink
            to="/contact-us"
            className={({ isActive }) => getNavLinkClass(isActive)}
          >
            Contact
          </NavLink>
          <a
            href="https://apps.apple.com/us/app/macroaura/id6757357405"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download MacroAura on the App Store"
            onClick={() => {
              if (import.meta.env.PROD) {
                gaEvent('click', {
                  label: 'App Store Link',
                  location: 'Navbar',
                });
              }
            }}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold shadow-[0_0.35rem_1rem_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${
              useLightTheme
                ? 'bg-white text-gray-950 hover:bg-white/95 hover:shadow-[0_0.75rem_1.5rem_rgba(0,0,0,0.22)]'
                : 'bg-gray-950 text-white hover:bg-black hover:shadow-xl'
            }`}
          >
            Download App
          </a>
        </nav>
      </div>
    </motion.header>
  )
}
