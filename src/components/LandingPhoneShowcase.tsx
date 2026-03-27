import { motion } from "framer-motion"

const stackedPhoneClass =
  "absolute bottom-0 h-auto max-w-none rounded-[2rem] sm:drop-shadow-[0_12px_20px_rgba(0,0,0,0.12)]"

export default function LandingPhoneShowcase() {
  const stats = [
    { value: "8K+", line1: "MEALS", line2: "LOGGED" },
    { value: "5K+", line1: "HAPPY", line2: "TRACKERS" },
    { value: "2K+", line1: "WORKOUTS", line2: "LOGGED" },
  ]

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[90rem]">
        <div className="mx-auto mb-8 grid max-w-5xl grid-cols-3 gap-5 sm:mb-10 sm:gap-8 lg:mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.value}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
              className="text-center"
            >
              <p className="text-[2.7rem] font-extrabold leading-none tracking-[-0.08em] text-black sm:text-[3.4rem] lg:text-[4.2rem]">
                {stat.value}
              </p>
              <p className="mt-1 text-[1.1rem] leading-[1.02] tracking-[-0.04em] text-black italic sm:text-[1.5rem] lg:text-[1.95rem]">
                {stat.line1}
                <br />
                {stat.line2}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="relative rounded-[2rem] shadow-[0_28px_80px_rgba(25,25,25,0.08)] xl:mt-50">
          <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-white">
            <div className="pointer-events-none absolute inset-y-0 left-[-8%] w-[52%] rounded-full border-[28px] border-[#dcf4de] opacity-75 blur-[1px]" />
            <div className="pointer-events-none absolute bottom-[-26%] left-[18%] h-[28rem] w-[28rem] rounded-full border-[20px] border-[#e7f8e8] opacity-85" />
            <div className="pointer-events-none absolute bottom-8 right-10 h-28 w-56 rounded-full bg-[#eef9ef] blur-2xl" />
          </div>

          <div className="relative z-10 grid items-center gap-10 px-6 py-10 sm:px-8 md:gap-12 md:py-12 lg:grid-cols-[minmax(0,1fr)_34rem] lg:gap-8 lg:px-12 lg:py-8 xl:grid-cols-[minmax(0,1fr)_38rem]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-xl"
            >
              <p className="text-[2.6rem] font-extrabold uppercase leading-[0.94] tracking-[-0.06em] text-black sm:text-[3.4rem] lg:text-[4.2rem]">
                ALL YOUR
                <br />
                TRACKING IN
                <br />
                ONE PLACE
              </p>

              <p className="mt-6 max-w-lg text-[1.9rem] leading-[1.12] tracking-[-0.045em] text-black italic sm:text-[2.35rem] lg:text-[2.8rem]">
                WE TURN YOUR GOALS INTO A CLEANER, FASTER DAILY FLOW
              </p>

              {/* <a
                href="#features"
                className="mt-10 inline-flex items-center rounded-full border border-2 border-black bg-white px-7 py-3 text-base font-medium text-black shadow-[0_10px_30px_rgba(30,24,22,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2f2321]/35 hover:shadow-[0_14px_36px_rgba(30,24,22,0.12)]"
              >
                View features
              </a> */}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              className="relative mx-auto flex h-[20rem] w-full max-w-[17rem] items-end justify-center sm:h-[23rem] sm:max-w-[20rem] md:h-[27rem] md:max-w-[23rem] lg:mx-0 lg:mr-auto lg:h-[33rem] lg:max-w-[31rem] lg:justify-start xl:h-[36rem] xl:max-w-[34rem]"
            >
              <div className="relative h-full w-full -translate-x-4 sm:-translate-x-8 md:-translate-x-12 lg:-translate-x-16 xl:-translate-x-24">
                <div className="pointer-events-none absolute bottom-1 left-[49%] h-8 w-[72%] -translate-x-1/2 rounded-full bg-black/16 blur-xl sm:h-9 md:h-10 lg:left-[48%]" />
                <div className="pointer-events-none absolute bottom-0 left-[49%] h-14 w-[98%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.24)_0%,rgba(0,0,0,0.12)_42%,rgba(0,0,0,0)_74%)] blur-2xl lg:left-[48%]" />

                <img
                  src="https://web.macroaura.com/public/app-img-search.png"
                  alt="MacroAura search screen"
                  loading="lazy"
                  className={`${stackedPhoneClass} right-[-18%] z-10 w-[8.75rem] sm:right-[-18%] sm:w-[10.25rem] md:right-[-20%] md:w-[12rem] lg:right-[-20%] lg:w-[14.25rem] xl:right-[-24%] xl:w-[19rem] xl:-translate-y-5`}
                />
                <img
                  src="https://web.macroaura.com/public/app-exercise.png"
                  alt="MacroAura exercise screen"
                  loading="lazy"
                  className={`${stackedPhoneClass} left-[35%] z-20 w-[9.6rem] sm:w-[10.5rem] md:w-[12.4rem] lg:w-[14.6rem] xl:w-[21rem] xl:-translate-y-5`}
                />
                <img
                  src="https://web.macroaura.com/public/app-home.png"
                  alt="MacroAura home screen"
                  loading="lazy"
                  className={`${stackedPhoneClass} left-0 z-30 w-[10.4rem] sm:w-[12.2rem] sm:-translate-y-5 md:w-[14.2rem] md:-translate-y-7 lg:w-[16.7rem] lg:-translate-y-10 xl:w-[23rem] xl:-translate-y-5`}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
