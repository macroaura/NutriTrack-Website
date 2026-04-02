import { motion } from "framer-motion"

const features = [
  {
    title: "Meal & Barcode Scan",
    subtitle: "Scan meals instantly",
  },
  {
    title: "Cookbook",
    subtitle: "Save your favorite meals and recipes in one place, always ready to log in seconds.",
  },
  {
    title: "Nutrition Tracking",
    subtitle: "Track calories, protein, carbs, and fat with effortless daily breakdowns.",
  },
  {
    title: "Food Diary",
    subtitle: "A complete daily log of everything you eat, organized by meal and time.",
  },
  {
    title: "Exercise Tracker",
    subtitle: "Log sets, reps, and weight for every lift and monitor your progress over time.",
  },
  {
    title: "Weight Tracker",
    subtitle: "Chart your body weight trends and stay aligned with your goals week over week.",
  },
]

export default function LandingFeaturesGrid() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-main-dark">
            Everything in one app
          </p>
          <h2 className="mt-4 text-4xl font-extrabold leading-[0.95] tracking-[-0.06em] text-black sm:text-5xl">
            Built for every part of your health journey.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-black/60 max-w-2xl mx-auto">
            From what you eat to how you train, MacroAura keeps all your health data connected and effortless.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.07 }}
              className="flex flex-col items-center "
            >
              {/* Placeholder image area */}
              <div className='bg-gray-100 rounded-3xl pt-8 pr-8 pl-8'>
              <img src='/scanner.png' alt='Feature Image' className="w-[500px]" />
              </div>
              <div className="flex flex-col gap-1.5 pt-4 text-center">
                <h3 className="text-xl font-bold tracking-[-0.03em] text-black">
                  {feature.title}
                </h3>
                <p className="text-lg leading-relaxed text-black/55">
                  {feature.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
