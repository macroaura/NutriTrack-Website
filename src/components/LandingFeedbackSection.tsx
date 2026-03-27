import { motion } from "framer-motion"

const floatingCardTransition = {
  type: "spring",
  stiffness: 260,
  damping: 20,
} as const

const createCardWiggle = (baseRotate: number, entranceDelay: number, lift: number) => ({
  opacity: 1,
  y: [0, -lift, 0, -lift * 0.45, 0],
  rotate: [
    baseRotate,
    baseRotate + (baseRotate >= 0 ? 1.5 : -1.5),
    baseRotate - (baseRotate >= 0 ? 1.1 : -1.1),
    baseRotate + (baseRotate >= 0 ? 0.6 : -0.6),
    baseRotate,
  ],
  transition: {
    opacity: { duration: 0.5, delay: entranceDelay, ease: "easeOut" as const },
    y: {
      duration: 1.05,
      delay: entranceDelay + 0.55,
      ease: "easeInOut" as const,
      repeat: Infinity,
      repeatDelay: 3,
    },
    rotate: {
      duration: 1.05,
      delay: entranceDelay + 0.55,
      ease: "easeInOut" as const,
      repeat: Infinity,
      repeatDelay: 3,
    },
  },
})

const haloRings = [
  {
    sizeClass: "h-[22rem] w-[22rem] sm:h-[28rem] sm:w-[28rem] lg:h-[35rem] lg:w-[35rem]",
    borderClass: "border-[1.5px] border-main/24",
    glowClass:
      "bg-[radial-gradient(circle,rgba(120,205,132,0.08)_0%,rgba(120,205,132,0.035)_40%,rgba(255,255,255,0)_74%)] shadow-[inset_0_0_3.25rem_rgba(120,205,132,0.10),0_0_2.5rem_rgba(120,205,132,0.10)]",
    opacity: 0.82,
    duration: 8,
    delay: 0,
    wobble: 2.2,
  },
  {
    sizeClass: "h-[31rem] w-[31rem] sm:h-[38rem] sm:w-[38rem] lg:h-[47rem] lg:w-[47rem]",
    borderClass: "border-[1.5px] border-main/18",
    glowClass:
      "bg-[radial-gradient(circle,rgba(120,205,132,0.05)_0%,rgba(120,205,132,0.025)_42%,rgba(255,255,255,0)_76%)] shadow-[inset_0_0_4rem_rgba(120,205,132,0.07),0_0_3rem_rgba(120,205,132,0.06)]",
    opacity: 0.62,
    duration: 10,
    delay: 0.35,
    wobble: -1.7,
  },
  {
    sizeClass: "h-[40rem] w-[40rem] sm:h-[49rem] sm:w-[49rem] lg:h-[58rem] lg:w-[58rem]",
    borderClass: "border-[1.5px] border-main/12",
    glowClass:
      "bg-[radial-gradient(circle,rgba(120,205,132,0.035)_0%,rgba(120,205,132,0.012)_44%,rgba(255,255,255,0)_78%)] shadow-[inset_0_0_5rem_rgba(120,205,132,0.05),0_0_3.5rem_rgba(120,205,132,0.04)]",
    opacity: 0.44,
    duration: 12,
    delay: 0.7,
    wobble: 1.2,
  },
]

const phoneScreen = { src: "https://web.macroaura.com/public/fooddetails.svg", alt: "Food details screen" }

export default function LandingFeedbackSection() {
  return (
    <section className="relative bg-white px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="text-4xl font-extrabold leading-[0.95] tracking-[-0.06em] text-black sm:text-5xl lg:text-[4.25rem]">
            Eat With Purpose. Train With Insight.
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-black/65 sm:text-xl">
            Log meals, track workouts, and get real-time insights that help you stay aligned with your goals.
          </p>
        </motion.div>

        <div className="relative isolate mt-12 overflow-hidden rounded-[2.5rem] bg-[radial-gradient(circle_at_center,rgba(240,248,241,0.9)_0%,rgba(255,255,255,1)_58%)] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
          <div className="pointer-events-none absolute inset-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{
                opacity: [0.32, 0.58, 0.32],
                scale: [1, 1.07, 1],
                transition: {
                  duration: 8.5,
                  delay: 0.1,
                  ease: "easeInOut" as const,
                  repeat: Infinity,
                  repeatDelay: 1.1,
                },
              }}
              viewport={{ once: true, margin: "-120px" }}
              className="absolute left-1/2 top-[56%] h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(156,225,166,0.34)_0%,rgba(156,225,166,0.18)_30%,rgba(156,225,166,0.08)_48%,rgba(255,255,255,0)_76%)] blur-3xl sm:h-[32rem] sm:w-[32rem] lg:h-[42rem] lg:w-[42rem]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{
                opacity: [0.45, 0.82, 0.45],
                scale: [1, 1.08, 1],
                transition: {
                  duration: 7,
                  delay: 0.2,
                  ease: "easeInOut" as const,
                  repeat: Infinity,
                  repeatDelay: 1.6,
                },
              }}
              viewport={{ once: true, margin: "-120px" }}
              className="absolute left-1/2 top-[56%] h-[16rem] w-[16rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(120,205,132,0.42)_0%,rgba(120,205,132,0.2)_30%,rgba(120,205,132,0.08)_48%,rgba(255,255,255,0)_72%)] blur-2xl sm:h-[20rem] sm:w-[20rem] lg:h-[28rem] lg:w-[28rem]"
            />

            {haloRings.map((ring) => (
              <div
                key={ring.sizeClass}
                className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, rotate: 0 }}
                  whileInView={{
                    opacity: [ring.opacity, ring.opacity + 0.12, ring.opacity],
                    scale: [1, 1.035, 1],
                    rotate: [0, ring.wobble, 0, ring.wobble * -0.6, 0],
                    transition: {
                      duration: ring.duration,
                      delay: ring.delay,
                      ease: "easeInOut" as const,
                      repeat: Infinity,
                      repeatDelay: 1.4,
                    },
                  }}
                  viewport={{ once: true, margin: "-120px" }}
                  className={`rounded-full ${ring.borderClass} ${ring.glowClass} ${ring.sizeClass}`}
                />
              </div>
            ))}
          </div>

          <div className="relative mx-auto h-[38rem] max-w-6xl sm:h-[44rem] md:h-[50rem] lg:h-[58rem]">
            <motion.div
              initial={{ opacity: 0, y: 18, rotate: -6 }}
              whileInView={createCardWiggle(-6, 0.05, 8)}
              whileHover={{ y: -12, scale: 1.04, rotate: -3, transition: floatingCardTransition }}
              viewport={{ once: true, margin: "-100px" }}
              className="absolute left-0 top-[25%] z-20 w-[9rem] sm:left-[4%] sm:w-[15.5rem] lg:left-[7%] lg:top-[15%] lg:w-[18rem]"
            >
              <img
                src="https://web.macroaura.com/public/caloriecard.png"
                alt="Calories left preview"
                className="h-auto w-full shadow-[0_18px_45px_rgba(27,30,29,0.10)]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18, rotate: -4 }}
              whileInView={createCardWiggle(-4, 0.12, 10)}
              whileHover={{ y: -14, scale: 1.04, rotate: -1.5, transition: floatingCardTransition }}
              viewport={{ once: true, margin: "-100px" }}
              className="absolute bottom-[13%] left-0 z-20 w-[9rem] sm:left-[3%] sm:w-[14.5rem] lg:left-[4%] lg:bottom-[16%] lg:w-[17rem]"
            >
              <img
                src="https://web.macroaura.com/public/macrotracker.png"
                alt="Macro tracker preview"
                className="h-auto w-full  shadow-[0_18px_45px_rgba(27,30,29,0.10)]"
              />
            </motion.div>


            <motion.div
              initial={{ opacity: 0, y: 18, rotate: 6 }}
              whileInView={createCardWiggle(6, 0.18, 8)}
              whileHover={{ y: -12, scale: 1.04, rotate: 3, transition: floatingCardTransition }}
              viewport={{ once: true, margin: "-100px" }}
              className="absolute right-[1%] top-[30%] z-20 w-[8rem] sm:right-[4%] sm:w-[14rem] lg:right-[7%] lg:top-[53%] lg:w-[16.5rem]"
            >
              
              <img
                src="https://web.macroaura.com/public/stepcard.png"
                alt="Steps today preview"
                className="h-auto w-full shadow-[0_18px_45px_rgba(27,30,29,0.10)]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18, rotate: 4 }}
              whileInView={createCardWiggle(4, 0.1, 8)}
              whileHover={{ y: -12, scale: 1.04, rotate: 1.5, transition: floatingCardTransition }}
              viewport={{ once: true, margin: "-100px" }}
              className="absolute right-[5%] top-[13%] z-20 w-[9rem] sm:right-[10%] sm:w-[14.5rem] lg:right-[16%] lg:top-[7%] lg:w-[18rem]"
            >
              <img
                src="https://web.macroaura.com/public/lunch-run.png"
                alt="Lunch run preview"
                className="h-auto w-full rounded-[.3rem] shadow-[0_18px_45px_rgba(27,30,29,0.10)]"
              />
            </motion.div>


            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.65, delay: 0.08, ease: "easeOut" }}
              className="absolute inset-x-0 bottom-0 z-10 mx-auto w-[22rem] sm:w-[26rem] md:w-[30rem] lg:w-[36rem]"
            >
              <div className="pointer-events-none absolute inset-x-[18%] bottom-[7%] h-12 rounded-full bg-black/12 blur-2xl lg:h-16" />
              <div className="pointer-events-none absolute left-[30.7%] top-[2%] h-[83.1%] w-[38.4%] overflow-hidden rounded-[2.7rem] sm:rounded-[3.15rem] lg:rounded-[1rem]">
                <motion.img
                  src={phoneScreen.src}
                  alt={phoneScreen.alt}
                  initial={{ opacity: 0, y: "6%" }}
                  whileInView={{ opacity: 1, y: "0%" }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
                  className="absolute inset-0 object-cover object-top"
                />
              </div>
              <img
                src="https://web.macroaura.com/public/hand-with-phone.avif"
                alt="MacroAura app in hand"
                className="relative z-10 h-auto w-full"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
