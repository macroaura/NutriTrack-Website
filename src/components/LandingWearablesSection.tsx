import { motion } from "framer-motion"

const highlights = [
  "Sync Garmin and Apple Watch activity into one dashboard.",
  "Keep workouts, calorie burn, and macro progress connected.",
  "See training patterns without leaving your nutrition flow.",
]

export default function LandingWearablesSection() {
  return (
    <section className=" px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem]  px-6 py-8 sm:px-8 sm:py-10 lg:grid lg:grid-cols-[minmax(0,1fr)_1.08fr] lg:items-center lg:gap-10 lg:px-12 lg:py-12">
          <div className="pointer-events-none absolute left-[-8rem] top-[-8rem] h-64 w-64 rounded-full  blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-10rem] right-[-5rem] h-72 w-72 rounded-full  blur-3xl" />

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="relative z-10 max-w-xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-main-dark">
              Wearable Integrations
            </p>

            <h2 className="mt-4 text-4xl font-extrabold leading-[0.95] tracking-[-0.06em] text-black sm:text-5xl">
              Garmin and Apple Watch, built into your routine.
            </h2>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-black/70 sm:text-xl">
              MacroAura connects your training data with the rest of your daily tracking, so workouts,
              progress, and nutrition all live in one place instead of scattered across apps.
            </p>

          

            <div className="mt-8 space-y-3">
              {highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="flex items-start gap-4 rounded-[1.4rem] border border-white/35 bg-white/16 px-4 py-3.5 backdrop-blur-[18px] shadow-[inset_0_0_0.75rem_rgba(255,255,255,0.14),0_0.6rem_1.75rem_rgba(0,0,0,0.08)]"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/18 shadow-[inset_0_0_0.55rem_rgba(255,255,255,0.18),0_0.35rem_1rem_rgba(0,0,0,0.08)] backdrop-blur-md">
                    <span className="h-2.5 w-2.5 rounded-full bg-main shadow-[0_0_0.8rem_rgba(120,205,132,0.55)]" />
                  </span>
                  <p className="pt-0.5 text-base leading-relaxed text-black/75">{highlight}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 34 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
            className="relative z-10 mt-12 lg:mt-0"
          >
            <div className="pointer-events-none absolute inset-x-[12%] bottom-[6%] h-12 rounded-full bg-black/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem]  p-3 ">
              <img
                src="/garmin-apple.png"
                alt="MacroAura Garmin and Apple Watch integration preview"
                className="h-auto w-full rounded-[1.45rem] object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
