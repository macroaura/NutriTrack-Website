import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { gaEvent } from "../analytics"
import { Helmet } from "react-helmet-async"
import { motion, type Variants } from "framer-motion"

export default function Landing() {
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <>
      <Helmet>
        <title>MacroAura — Macro Counter & Protein Tracker App</title>
        <meta
          name="description"
          content="MacroAura is the ultimate calorie and macro tracker. Use our daily macros log, macro calculator, and diet app features to build better habits."
        />
        <link rel="canonical" href="https://www.macroaura.com/" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.macroaura.com/" />
        <meta property="og:title" content="MacroAura — Macro Counter & Protein Tracker App" />
        <meta property="og:description" content="MacroAura is the ultimate calorie and macro tracker. Use our daily macros log, macro calculator, and diet app features to build better habits." />
        <meta property="og:image" content="https://www.macroaura.com/logo-small.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:title" content="MacroAura — Macro Counter & Protein Tracker App" />
        <meta name="twitter:description" content="MacroAura is the ultimate calorie and macro tracker. Use our daily macros log, macro calculator, and diet app features to build better habits." />
        <meta name="twitter:image" content="https://www.macroaura.com/logo-small.png" />
        <meta name="keywords" content="macro counter, macro app, track macros app, macro calculator, daily macros log, macro diet app, protein tracker app, calorie and macro tracker, weight tracker" />
        {/* JSON-LD Organization & SoftwareApplication Schema */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "name": "MacroAura",
                  "url": "https://www.macroaura.com/",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://www.macroaura.com/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "Organization",
                  "name": "MacroAura",
                  "url": "https://www.macroaura.com/",
                  "logo": "https://www.macroaura.com/logo-small.png",
                  "description": "MacroAura helps you log meals, analyze macros, and build better nutrition habits with personalized insights.",
                  "sameAs": [
                    "https://twitter.com/macroaura.co",
                    "https://www.instagram.com/macroaura.co"
                  ]
                },
                {
                  "@type": "SoftwareApplication",
                  "name": "MacroAura",
                  "applicationCategory": "HealthApplication",
                  "operatingSystem": "iOS",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                  },
                  "description": "MacroAura helps you log meals, analyze macros, and build better nutrition habits with personalized insights."
                }
              ]
            }
          `}
        </script>
      </Helmet>
      <div className="min-h-screen bg-surface text-gray-900 font-sans selection:bg-main/20 selection:text-main-dark overflow-x-hidden">
        <Navbar />

        {/* Hero */}
        <section className="relative pt-20 pb-20 sm:pt-32 sm:pb-32 lg:pb-40 overflow-hidden">
          {/* Background Blobs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-main/10 rounded-full blur-3xl opacity-70"
            />
            <motion.div
              animate={{ y: [0, -30, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-[20%] right-[-10%] w-[30rem] h-[30rem] bg-accent/10 rounded-full blur-3xl opacity-70"
            />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
              <div className="lg:col-span-6 text-center lg:text-left">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  className="inline-flex items-center rounded-full border border-main/30 bg-white/50 backdrop-blur-sm px-3 py-1 text-sm font-medium text-main-dark mb-8 shadow-sm"
                >
                  <span className="flex h-2 w-2 rounded-full bg-main mr-2 animate-pulse"></span>
                  Now on the App Store
                </motion.div>
                <motion.h1
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  className="text-5xl font-display font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl mb-6 leading-tight"
                >
                  Tracking made <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-main to-main-dark">
                    easy .
                  </span>
                </motion.h1>
                <motion.p
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                >
                  MacroAura is the macro counter designed for real life. Log meals, analyze nutrients, and stay consistent with our intuitive macro app.
                </motion.p>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <a
                    href="https://apps.apple.com/us/app/macroaura/id6757357405"
                    target='_blank'
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-gray-900 px-8 py-4 text-base font-bold text-white shadow-xl transition-all duration-300 hover:bg-gray-800 hover:shadow-2xl hover:-translate-y-1 hover:scale-105"
                  >
                    <i className="fab fa-apple mr-2 text-xl"></i>
                    Download App
                  </a>
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-bold text-gray-900 shadow-md transition-all duration-300 hover:bg-gray-50 hover:shadow-lg hover:-translate-y-1"
                  >
                    Learn more
                  </a>
                </motion.div>

              </div>

              <div className="relative mt-16 lg:mt-0 lg:col-span-6 lg:flex lg:items-center justify-center">
                <div className="relative mx-auto w-4/6 max-w-[500px] lg:max-w-none">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="relative z-10 rounded-[2.5rem] p-2 "
                  >
                    <div className="rounded-[2rem] overflow-hidden">
                      <img
                        src="app-home.png"
                        className="w-full h-auto"
                        alt='MacroAura Macro Counter App Interface'
                      />
                    </div>
                  </motion.div>
                  {/* Decorative elements behind phone */}
                  <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-main/20 to-accent/20 rounded-full blur-3xl opacity-60"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 bg-main/30 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.h2
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="text-sm font-bold text-main tracking-widest uppercase mb-3"
              >
                Features
              </motion.h2>
              <motion.p
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="text-3xl font-display font-bold text-gray-900 sm:text-4xl"
              >
                Everything you need to stay on track
              </motion.p>
              <motion.p
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="mt-4 text-xl text-gray-600"
              >
                Powerful tools wrapped in a simple, intuitive interface designed for daily use.
              </motion.p>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {[
                {
                  title: "Daily Macro Log",
                  desc: "Save time with quick-add foods and recent meals.",
                  icon: "fa-bolt"
                },
                {
                  title: "Macro Insights",
                  desc: "Understand protein, carbs, fats, and calories at a glance.",
                  icon: "fa-chart-pie"
                },
                {
                  title: "Weight & Habit Tracker",
                  desc: "Track your weight, stay motivated with daily goals and streak tracking.",
                  icon: "fa-fire"
                },
                {
                  title: "Macro Calculator",
                  desc: "Calibrated to your goals: cut, bulk, or maintain.",
                  icon: "fa-bullseye"
                },
                {
                  title: "Privacy-First",
                  desc: "Your data stays yours. Export or delete anytime.",
                  icon: "fa-lock"
                },
                {
                  title: "Food Library",
                  desc: "Create frequently used meals and save time with quick-add meals.",
                  icon: "fa-utensils"
                },
              ].map((f) => (
                <motion.div
                  key={f.title}
                  variants={fadeInUp}
                  className="relative group rounded-3xl bg-surface p-8 transition-all duration-300 hover:bg-white hover:shadow-xl hover:-translate-y-1 border border-transparent hover:border-gray-100"
                >
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white text-main shadow-sm mb-6 group-hover:bg-main group-hover:text-white transition-all duration-300 group-hover:scale-110">
                    <i className={`fas ${f.icon} text-xl`}></i>
                  </div>
                  <h3 className="text-xl font-display font-bold text-gray-900 mb-3">{f.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>



        {/* How it Works */}
        <section className="py-32 overflow-hidden bg-surface">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-24">
              <motion.h2
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="text-3xl font-display font-bold text-gray-900 sm:text-5xl"
              >
                Hit your goals, <span className="text-transparent bg-clip-text bg-gradient-to-r from-main to-main-dark">one meal at a time</span>
              </motion.h2>
            </div>

            <div className="relative">
              {/* Connecting line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 hidden lg:block -translate-x-1/2"></div>

              <div className="space-y-32">
                {/* Step 1 */}
                <div className="relative lg:grid lg:grid-cols-2 lg:gap-20 items-center">
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="text-center lg:text-right"
                  >

                    <h3 className="text-3xl font-display font-bold text-gray-900 mb-4">Daily Food Diary</h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Discover what fuels you best. A complete calorie and macro tracker tailored to your lifestyle.
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mt-12 lg:mt-0 relative group flex justify-center lg:block"
                  >
                    <div className="relative rounded-3xl bg-white  transform transition-transform group-hover:scale-[1.02] duration-500  w-4/5 lg:w-full flex justify-center md:-rotate-1">
                      <img src="/app-img-diary.png" alt="Daily macros log screen" className="w-full lg:w-3/5 rounded-2xl" />
                    </div>
                  </motion.div>
                </div>

                {/* Step 2 */}
                <div className="relative lg:grid lg:grid-cols-2 lg:gap-20 items-center">
                  {/* TEXT FIRST IN DOM */}
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="order-1 lg:order-2 text-center lg:text-left"
                  >
                    <h3 className="text-3xl font-display font-bold text-gray-900 mb-4">
                      Weight Tracker App
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Charts, streaks, and insights that keep you on track. The perfect weight tracker app for hitting your daily goals.
                    </p>
                  </motion.div>

                  {/* IMAGE SECOND IN DOM */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="order-2 lg:order-1 mt-12 lg:mt-0 relative group flex justify-center lg:block"
                  >
                    <div className="relative rounded-3xl transform transition-transform group-hover:scale-[1.02] duration-500 w-4/5 lg:w-full flex justify-center md:rotate-1">
                      <img
                        src="/progress-screen.png"
                        alt="Macro diet app progress screen"
                        className="w-full lg:w-3/5 rounded-2xl"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Step 3 */}
                <div className="relative lg:grid lg:grid-cols-2 lg:gap-20 items-center">
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="text-center lg:text-right"
                  >

                    <h3 className="text-3xl font-display font-bold text-gray-900 mb-4">Your Food Database, On Demand</h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Search thousands of foods, pick the right match, and add it your daily diary with one tap.
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mt-12 lg:mt-0 relative group flex justify-center lg:block"
                  >
                    <div className="relative rounded-3xl  transform transition-transform group-hover:scale-[1.02] duration-500 w-4/5 lg:w-full flex justify-center md:-rotate-1">
                      <img src="/app-img-search.png" alt="Search foods in macro app" className="w-full lg:w-3/5 rounded-2xl" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Integrations Section */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-gray-900 p-10 md:p-16 md:rounded-2xl">
            {/* Section Header */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-display font-bold text-white sm:text-4xl lg:text-5xl mb-4">
                Connects with your <span className="text-transparent bg-clip-text bg-gradient-to-r from-main to-main-dark">favorites</span>
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              MacroAura connects with Apple Health and Garmin to sync your activity data and dynamically adjust your nutrition targets based on how you actually move.
              </p>
            </motion.div>

            {/* Integration Visual */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="flex flex-col items-center mb-14"
            >
              <div className="flex items-center justify-center gap-6 sm:gap-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                    <img src="Apple_Health.webp" alt="Apple Health" className="w-16 h-16 sm:w-20 sm:h-20" />
                  </div>
                  <span className="text-xs text-gray-400 font-medium">Apple Health</span>
                </div>
                <i className="fas fa-arrows-alt-h text-gray-500 text-xl sm:text-2xl"></i>
                <div className="flex flex-col items-center gap-2">
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl shadow-lg flex items-center justify-center ring-2 ring-main/30">
                    <img src="/logo-small.png" alt="MacroAura" className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl" />
                  </div>
                  <span className="text-xs text-gray-400 font-medium">MacroAura</span>
                </div>
                <i className="fas fa-arrows-alt-h text-gray-500 text-xl sm:text-2xl"></i>
                <div className="flex flex-col items-center gap-2">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                    <img src="/garmin.png" alt="Garmin" className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl" />
                  </div>
                  <span className="text-xs text-gray-400 font-medium">Garmin</span>
                </div>
              </div>
            </motion.div>

            

            {/* Shared Features */}
            <motion.ul
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {[
                { icon: "fas fa-sync-alt", text: "Sync calorie burn for smart target adjustments - Your nutrition goals adapt automatically based on your actual energy expenditure" },
                { icon: "fas fa-chart-line", text: "Import workout sessions and add custom exercise details - Bring in your workouts, then log specific exercises with sets, reps, and weights" },
                { icon: "fas fa-shield-alt", text: "Track steps to optimize daily activity goals - Step data flows seamlessly to keep your targets aligned with your lifestyle" }
              ].map((item, i) => (
                <motion.li
                  key={i}
                  className="flex items-center gap-3 bg-gray-800/40 rounded-xl px-5 py-4"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  viewport={{ once: true }}
                >
                  <i className={`${item.icon} text-main flex-shrink-0`}></i>
                  <span className="text-gray-300 text-sm">{item.text}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="py-24 bg-main/90 ">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="relative overflow-hidden rounded-[3rem]  px-6 py-24 sm:py-32 lg:px-16 text-center"
            >
              <div className="relative z-10">
                <h2 className="text-4xl font-display font-bold tracking-tight text-white sm:text-5xl mb-6">
                  Start tracking today
                </h2>
                <p className="mx-auto max-w-2xl text-xl text-gray-100 mb-10">
                  Join others building sustainable nutrition habits with MacroAura.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="https://apps.apple.com/us/app/macroaura/id6757357405"
                    className="rounded-full bg-white px-8 py-4 text-lg font-bold text-black hover:text-white shadow-lg transition-all duration-300 hover:bg-main-dark hover:shadow-xl"
                    onClick={() => {
                      if (import.meta.env.PROD) {
                        gaEvent('click', {
                          label: 'App Store Link',
                          location: 'CTA Section',
                        });
                      }
                    }}
                  >
                    Get the App
                  </motion.a>
                </div>
              </div>

              {/* Decorative background */}
              <div className="absolute top-0 left-0 -z-10 h-full w-full">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-[-20%] left-[20%] h-96 w-96 rounded-full bg-main/20 blur-[100px]"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="absolute bottom-[-20%] right-[20%] h-96 w-96 rounded-full bg-accent/20 blur-[100px]"
                />
              </div>
            </motion.div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  )
}
