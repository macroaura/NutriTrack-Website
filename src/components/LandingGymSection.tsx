import { motion } from "framer-motion"

export default function LandingGymSection() {
  return (
    <section className="relative h-[24rem] w-full overflow-hidden sm:h-[32rem] lg:h-[48rem]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://web.macroaura.com/public/gym.jpg')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.08)_38%,rgba(0,0,0,0.2)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(180deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.2)_100%)]" />

      <motion.div
        initial={{ opacity: 0, y: -18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute left-4 top-6 z-10 max-w-[18rem] sm:left-8 sm:top-8 sm:max-w-[24rem] lg:left-50 lg:top-10 lg:max-w-[34rem]"
      >
        <h2 className="text-3xl font-extrabold tracking-[-0.06em] text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.28)] sm:text-4xl lg:text-7xl">
          Track every workout
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/88 drop-shadow-[0_8px_24px_rgba(0,0,0,0.24)] sm:text-base lg:mt-4 lg:text-xl">
          Capture your lifts, volume, and performance trends with precision.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -28, y: 18 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
        className="absolute bottom-8 left-4 z-10 w-[9.5rem] sm:left-8 sm:w-[12rem] lg:left-50 lg:w-[16.5rem]"
      >
        <div className="pointer-events-none absolute inset-x-[16%] bottom-2 h-8 rounded-full bg-black/28 blur-xl lg:h-10" />
        <img
          src="https://web.macroaura.com/public/exerciseview.png"
          alt="Exercise view preview"
          className="relative h-auto w-6/10 lg:w-8/10 shadow-[0_26px_55px_rgba(0,0,0,0.26)]"
        />
      </motion.div>
    </section>
  )
}
