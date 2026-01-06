import { gaEvent } from '../analytics'
import { NavLink, Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="fixed top-0 z-40 w-full border-b border-white/10 bg-white/80 backdrop-blur-xl transition-all duration-300 supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3 cursor-pointer group">
          {/* Placeholder logo */}
          <img
            src="/logo-green.jpg"
            alt="MacroAura logo"
            width={40}
            height={40}
            decoding="async"
            className="h-10 w-10 rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3"
          />
          <span className="text-xl font-display font-bold tracking-tight text-gray-900">MacroAura</span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors duration-200 ${isActive ? 'text-main' : 'text-gray-600 hover:text-gray-900'}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/contact-us"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors duration-200 ${isActive ? 'text-main' : 'text-gray-600 hover:text-gray-900'}`
            }
          >
            Contact
          </NavLink>
          <a
            href="https://testflight.apple.com/join/GKZqpGB6"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download the MacroAura iOS TestFlight beta"
            onClick={() => {
              if (import.meta.env.PROD) {
                gaEvent('click', {
                  label: 'Download Beta Link',
                  location: 'Navbar',
                });
              }
            }}
            className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          >
            Download Beta
          </a>
        </nav>
      </div>
    </header>
  )
}
