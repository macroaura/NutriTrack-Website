import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import LandingSectionHero from "../components/LandingSectionHero"
import LandingPhoneShowcase from "../components/LandingPhoneShowcase"
import LandingFeedbackSection from "../components/LandingFeedbackSection"
import LandingGymSection from "../components/LandingGymSection"
import LandingWearablesSection from "../components/LandingWearablesSection"
import LandingDownloadCTA from "../components/LandingDownloadCTA"
import { Helmet } from "react-helmet-async"

export default function Landing() {
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
        <meta property="og:image" content="https://web.macroaura.com/public/logo-small.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:title" content="MacroAura — Macro Counter & Protein Tracker App" />
        <meta name="twitter:description" content="MacroAura is the ultimate calorie and macro tracker. Use our daily macros log, macro calculator, and diet app features to build better habits." />
        <meta name="twitter:image" content="https://web.macroaura.com/public/logo-small.png" />
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
                  "logo": "https://web.macroaura.com/public/logo-small.png",
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
        <LandingSectionHero />
        <LandingPhoneShowcase />
        <LandingFeedbackSection />
        <LandingGymSection />
        {/* <LandingFeaturesGrid /> */}
        <LandingWearablesSection />
        <LandingDownloadCTA />
        <Footer />
      </div>
    </>
  )
}
