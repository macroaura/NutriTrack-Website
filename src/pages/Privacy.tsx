import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Helmet } from "react-helmet-async"

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy • MacroAura</title>
        <meta
          name="description"
          content="Learn how MacroAura collects, uses, and protects your data. We value your privacy—no data selling, full deletion on account removal, and secure storage. Read our Privacy Policy for details."
        />
        <link rel="canonical" href="https://www.macroaura.com/privacy" />
        {/* Open Graph tags */}
        <meta property="og:title" content="Privacy Policy • MacroAura" />
        <meta property="og:locale" content="en_US" />
        <meta
          property="og:description"
          content="Learn how MacroAura collects, uses, and protects your data. We value your privacy—no data selling, full deletion on account removal, and secure storage. Read our Privacy Policy for details."
        />
        <meta property="og:url" content="https://www.macroaura.com/privacy" />
        <meta property="og:image" content="https://www.macroaura.com/logo-small.png" />
        <meta property="og:type" content="website" />
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy • MacroAura" />
        <meta
          name="twitter:description"
          content="Learn how MacroAura collects, uses, and protects your data. We value your privacy—no data selling, full deletion on account removal, and secure storage. Read our Privacy Policy for details."
        />
        <meta name="twitter:url" content="https://www.macroaura.com/privacy" />
        <meta name="twitter:image" content="https://www.macroaura.com/logo-small.png" />
        {/* JSON-LD structured data */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "PrivacyPolicy",
              "name": "MacroAura Privacy Policy",
              "url": "https://www.macroaura.com/privacy",
              "description": "This Privacy Policy explains how MacroAura collects, uses, and protects your personal data. We do not sell your data and fully delete it upon account removal.",
              "datePublished": "2025-11-01",
              "publisher": {
                "@type": "Organization",
                "name": "MacroAura",
                "url": "https://www.macroaura.com",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://www.macroaura.com/logo-small.png"
                }
              }
            }
          `}
        </script>
      </Helmet>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Navbar />

        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 pt-40">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-10">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="prose prose-lg prose-gray max-w-none">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-10">
              <p className="text-gray-600 leading-relaxed">
                We collect the data you give us (account info, food and weight logs, calories burned) to help you
                track your progress. We don’t sell your data. Everything is deleted if you delete your account.
                Must be 13+ to use.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">1. Who We Are</h2>
            <p className="text-gray-600 leading-relaxed">
              MacroAura provides a mobile app that helps you log food, calories, and fitness progress.
              If you have questions about this Privacy Policy, contact us at{" "}
              <a href="mailto:privacy@macroaura.com" className="text-main hover:text-main-dark font-medium transition-colors">
                privacy@macroaura.com
              </a>.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">2. What We Collect</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>First and last name, and email (when creating an account)</li>
              <li>Age, gender, height, weight, activity level, and fitness goals</li>
              <li>Food logs and the types of foods you eat</li>
              <li>Weight logs and goal weight</li>
              <li>Calories burned (via Apple HealthKit, if enabled)</li>
              <li>Basic app usage and crash analytics (via Firebase and Google Analytics)</li>
            </ul>

            <p className="mt-4 text-gray-600">
              We do <strong>not</strong> collect precise location data or sensitive device identifiers.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">3. How We Use Data</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>To provide, maintain, and personalize your account</li>
              <li>To calculate calories, macros, and display progress tracking</li>
              <li>To store your food and weight logs until you delete them</li>
              <li>To analyze usage and improve app performance</li>
              <li>To ensure security and detect bugs or abuse</li>
            </ul>

            <p className="mt-4 text-gray-600">
              Our legal basis for processing this data is your <strong>consent</strong> (when you create an
              account) and our <strong>legitimate interest</strong> in improving MacroAura’s functionality.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">4. Sharing</h2>
            <p className="text-gray-600 leading-relaxed">
              We don’t sell or rent your data. We only share it with trusted service providers who help us run
              the app and website securely, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mt-4">
              <li>Firebase (authentication, database, crash reporting)</li>
              <li>Google Analytics (usage metrics)</li>
              <li>Apple HealthKit (if you grant access)</li>
              <li>Formspree (for contact form submissions)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">5. Data Retention</h2>
            <p className="text-gray-600 leading-relaxed">
              Your account, food logs, and weight logs are kept while you use the app. If you delete your
              account, all personal data is removed from our active systems. Backup copies are permanently
              deleted within 90 days.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">6. Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We use encryption, authentication, and secure storage to protect your data. No system is 100%
              secure, but we take steps to keep your information safe. Data is stored on servers located in the
              United States.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">7. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed">
              Depending on your state, you may have rights to access, correct, or delete your personal data. You
              may also request a copy of your information or ask us not to share it. MacroAura does not sell or
              share data for advertising purposes.
            </p>
            <p className="text-gray-600 mt-4">
              To exercise these rights, email{" "}
              <a href="mailto:privacy@macroaura.com" className="text-main hover:text-main-dark font-medium transition-colors">
                privacy@macroaura.com
              </a>.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">8. Cookies and Do Not Track</h2>
            <p className="text-gray-600 leading-relaxed">
              Our website uses cookies for essential and analytical purposes only. You can disable cookies in
              your browser settings. We do not respond to “Do Not Track” signals because our tracking is limited
              to basic analytics.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">9. Children</h2>
            <p className="text-gray-600 leading-relaxed">
              MacroAura is intended for users aged 13 and older. We do not knowingly collect data from anyone
              under 13. If we learn that a user under 13 has created an account, we will delete it immediately.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">10. Data Transfers</h2>
            <p className="text-gray-600 leading-relaxed">
              Your information is processed and stored in the United States. If data is transferred across
              regions, we ensure adequate safeguards consistent with applicable data protection laws.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">11. Changes</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy occasionally to reflect new features or legal requirements. Any
              updates will appear here with a new effective date.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">12. Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              Questions or concerns? Contact us at{" "}
              <a href="mailto:privacy@macroaura.com" className="text-main hover:text-main-dark font-medium transition-colors">
                contact@macroaura.com
              </a>
            </p>
          </section>

        </main>

        <Footer />
      </div>
    </>
  )
}
