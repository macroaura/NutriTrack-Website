import { motion } from "framer-motion"
import { gaEvent } from "../analytics"

export default function LandingDownloadCTA() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          style={{ background: "radial-gradient(75.04% 99.21% at 50% -39.86%, rgba(255, 255, 255, 0.70) 27.78%, rgba(0, 0, 0, 0.00) 100%), #000" }}
          className="relative overflow-hidden rounded-[2.5rem] px-8 py-16 text-center sm:px-12 sm:py-20 lg:py-24"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-main">
            Available on iOS
          </p>

          <h2 className="mt-4 text-4xl font-extrabold leading-[0.95] tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
            Download MacroAura today.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/60">
            Start tracking your nutrition, workouts, and progress all in one place.
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
                  location: "Download CTA",
                })
              }
            }}
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-lg font-semibold text-gray-950 shadow-2xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-[0_24px_60px_rgba(255,255,255,0.15)]"
          >
            <img
              src="https://web.macroaura.com/public/apple.svg"
              alt=""
              aria-hidden="true"
              className="h-5 w-4"
            />
            <span>Download on the App Store</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
