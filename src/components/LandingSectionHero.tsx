import { gaEvent } from "../analytics"
import { motion } from "framer-motion"

export default function LandingSectionHero() {
  return (
    <section id="landing-section-hero" className="relative min-h-screen overflow-hidden bg-black text-white">
      <img
        src="https://web.macroaura.com/public/running.jpg"
        alt="Runner moving across an open hillside"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/45" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/35 to-transparent" />

      <div className="relative z-10 flex min-h-screen items-end justify-center px-4 pt-28 pb-20 sm:px-6 sm:pb-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto flex max-w-5xl flex-col items-center text-center"
        >
          <h1 className="max-w-4xl text-5xl font-display font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Tracking Made Easy.
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/90 sm:text-xl">
           MacroAura helps you track nutrition, log workouts, and optimize performance without slowing down your day.
          </p>

          <a
            href="https://apps.apple.com/us/app/macroaura/id6757357405"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download MacroAura on the App Store"
            onClick={() => {
              if (import.meta.env.PROD) {
                gaEvent("click", {
                  label: "App Store Link",
                  location: "Landing Section Hero",
                })
              }
            }}
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-lg font-semibold text-gray-950 shadow-2xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-[0_24px_60px_rgba(0,0,0,0.28)]"
          >
            <img
              src="https://web.macroaura.com/public/apple.svg"
              alt=""
              aria-hidden="true"
              className="h-5 w-4"
            />
            <span>Download App</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
