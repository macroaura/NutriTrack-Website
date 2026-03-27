import { motion, type Variants } from "framer-motion"

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

export default function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-20 sm:pt-32 sm:pb-32 lg:pb-40">
      <div className="pointer-events-none absolute top-0 left-1/2 z-0 h-full w-full -translate-x-1/2">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] h-[40rem] w-[40rem] rounded-full bg-main/10 opacity-70 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[20%] right-[-10%] h-[30rem] w-[30rem] rounded-full bg-accent/10 opacity-70 blur-3xl"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="items-center lg:grid lg:grid-cols-12 lg:gap-16">
          <div className="text-center lg:col-span-6 lg:text-left">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="mb-8 inline-flex items-center rounded-full border border-main/30 bg-white/50 px-3 py-1 text-sm font-medium text-main-dark shadow-sm backdrop-blur-sm"
            >
              <span className="mr-2 flex h-2 w-2 animate-pulse rounded-full bg-main" />
              Now on the App Store
            </motion.div>
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="mb-6 text-5xl leading-tight font-display font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl"
            >
              Tracking made <br />
              <span className="bg-gradient-to-r from-main to-main-dark bg-clip-text text-transparent">
                easy .
              </span>
            </motion.h1>
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 lg:mx-0"
            >
              MacroAura is the macro counter designed for real life. Log meals, analyze nutrients, and stay consistent with our intuitive macro app.
            </motion.p>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="mt-10 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start"
            >
              <a
                href="https://apps.apple.com/us/app/macroaura/id6757357405"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-gray-900 px-8 py-4 text-base font-bold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-gray-800 hover:shadow-2xl"
              >
                <i className="fab fa-apple mr-2 text-xl" />
                Download App
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-bold text-gray-900 shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-gray-50 hover:shadow-lg"
              >
                Learn more
              </a>
            </motion.div>
          </div>

          <div className="relative mt-16 justify-center lg:col-span-6 lg:mt-0 lg:flex lg:items-center">
            <div className="relative mx-auto w-4/6 max-w-[500px] lg:max-w-none">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="relative z-10 rounded-[2.5rem] p-2"
              >
                <div className="overflow-hidden rounded-[2rem]">
                  <img
                    src="/app-home.png"
                    className="h-auto w-full"
                    alt="MacroAura Macro Counter App Interface"
                  />
                </div>
              </motion.div>
              <div className="absolute top-1/2 left-1/2 -z-10 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-main/20 to-accent/20 opacity-60 blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
