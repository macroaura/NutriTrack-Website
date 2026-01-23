import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet-async"

export default function TermsOfService() {
    return (
        <>
            <Helmet>
                <title>Terms of Service • MacroAura</title>
                <meta
                    name="description"
                    content="Read the MacroAura Terms of Service covering eligibility, account use, acceptable use, third‑party services, health disclaimers, and dispute resolution."
                />
                <link rel="canonical" href="https://www.macroaura.com/terms-of-service" />
                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.macroaura.com/terms-of-service" />
                <meta property="og:title" content="Terms of Service • MacroAura" />
                <meta property="og:description" content="Read the MacroAura Terms of Service covering eligibility, account use, acceptable use, third‑party services, health disclaimers, and dispute resolution." />
                <meta property="og:image" content="https://www.macroaura.com/logo-small.png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:site_name" content="MacroAura" />
                <meta property="og:locale" content="en_US" />
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Terms of Service • MacroAura" />
                <meta name="twitter:description" content="Read the MacroAura Terms of Service covering eligibility, account use, acceptable use, third‑party services, health disclaimers, and dispute resolution." />
                <meta name="twitter:image" content="https://www.macroaura.com/logo-small.png" />
                {/* JSON-LD: TermsOfService */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "TermsOfService",
                        "name": "MacroAura Terms of Service",
                        "url": "https://www.macroaura.com/terms-of-service",
                        "datePublished": "2025-11-01",
                        "inLanguage": "en",
                        "publisher": {
                            "@type": "Organization",
                            "name": "MacroAura",
                            "url": "https://www.macroaura.com",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://www.macroaura.com/logo-small.png"
                            }
                        },
                        "description": "Terms governing the use of MacroAura apps and website."
                    })}
                </script>
            </Helmet>
            <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
                <Navbar />

                <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">Terms of Service</h1>
                    <p className="text-sm text-gray-500 mb-10">Last updated: November 1, 2025</p>

                    <nav aria-label="Table of contents" className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm mb-10">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
                        <ul className="grid gap-3 sm:grid-cols-2 text-sm">
                            <li><a href="#eligibility" className="text-gray-600 hover:text-main transition-colors">1. Eligibility</a></li>
                            <li><a href="#account-registration" className="text-gray-600 hover:text-main transition-colors">2. Account Registration</a></li>
                            <li><a href="#app-usage" className="text-gray-600 hover:text-main transition-colors">3. App Usage</a></li>
                            <li><a href="#future-subscriptions" className="text-gray-600 hover:text-main transition-colors">4. Future Subscriptions</a></li>
                            <li><a href="#health-disclaimer" className="text-gray-600 hover:text-main transition-colors">5. Health Disclaimer</a></li>
                            <li><a href="#third-party-services" className="text-gray-600 hover:text-main transition-colors">6. Third‑Party Services</a></li>
                            <li><a href="#data-privacy" className="text-gray-600 hover:text-main transition-colors">7. Data &amp; Privacy</a></li>
                            <li><a href="#intellectual-property" className="text-gray-600 hover:text-main transition-colors">8. Intellectual Property</a></li>
                            <li><a href="#termination" className="text-gray-600 hover:text-main transition-colors">9. Termination</a></li>
                            <li><a href="#limitation" className="text-gray-600 hover:text-main transition-colors">10. Limitation of Liability</a></li>
                            <li><a href="#dispute" className="text-gray-600 hover:text-main transition-colors">11. Dispute Resolution &amp; Arbitration</a></li>
                            <li><a href="#governing-law" className="text-gray-600 hover:text-main transition-colors">12. Governing Law</a></li>
                            <li><a href="#changes" className="text-gray-600 hover:text-main transition-colors">13. Changes to These Terms</a></li>
                            <li><a href="#contact-us" className="text-gray-600 hover:text-main transition-colors">14. Contact Us</a></li>
                        </ul>
                    </nav>

                    <section className="prose prose-lg prose-gray max-w-none">
                        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4" id="overview">Overview</h2>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-10">
                            <p className="text-gray-600 leading-relaxed">
                                Welcome to MacroAura! These Terms of Service govern your use of the MacroAura mobile
                                application and website operated by MacroAura LLC. By creating
                                an account or using the app, you agree to these Terms.
                            </p>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4" id="eligibility">1. Eligibility</h2>
                        <p className="text-gray-600 leading-relaxed">
                            MacroAura is intended for individuals aged 18 or older. By using the app, you confirm that you are
                            at least 18 years old and legally capable of entering into this agreement.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4" id="account-registration">2. Account Registration</h2>
                        <p className="text-gray-600 leading-relaxed">
                            You must create an account using a valid email or Apple ID. You are responsible for maintaining the
                            confidentiality of your login information and for all activity under your account. Only one
                            individual may use an account, though you may access it from multiple devices.
                        </p>
                        <p className="text-gray-600 mt-4">
                            We reserve the right to suspend or terminate accounts involved in suspicious activity, including
                            spamming, unauthorized API usage, or violating these Terms.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4" id="app-usage">3. App Usage</h2>
                        <p className="text-gray-600 leading-relaxed">
                            MacroAura helps users log meals, calories, and fitness progress. You may not use the app for any
                            unlawful purpose, attempt to reverse engineer or copy its source code, or use automated systems to
                            overload or interfere with the Service.
                        </p>
                        <p className="text-gray-600 mt-4">
                            We may modify or discontinue certain features at any time without notice. You may delete your
                            account at any time via in-app settings or by contacting{" "}
                            <a href="mailto:privacy@macroaura.com" className="text-main hover:text-main-dark font-medium transition-colors">
                                privacy@macroaura.com
                            </a>.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4" id="future-subscriptions">4. Future Subscriptions</h2>
                        <p className="text-gray-600 leading-relaxed">
                            MacroAura is currently free to use. We may introduce premium or subscription-based features in the
                            future. Users will be notified before any paid features are activated, and all payments will be
                            handled securely through the App Store or other approved payment platforms.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4" id="health-disclaimer">5. Health Disclaimer</h2>
                        <p className="text-gray-600 leading-relaxed">
                            MacroAura provides calorie and nutrition information for educational and informational purposes
                            only. It is <strong>not</strong> a medical service, and we do not provide medical advice or
                            diagnosis. Always consult a qualified healthcare professional before making dietary or fitness
                            changes. Never disregard professional medical advice based on information from MacroAura.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4" id="third-party-services">6. Third‑Party Services</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We use trusted third-party services to power MacroAura, including Firebase (authentication and
                            analytics), Google Analytics, Apple HealthKit, and Formspree. MacroAura also uses the{" "}
                            <strong>FatSecret Platform API</strong> to provide nutritional information. MacroAura LLC is not
                            responsible for the accuracy or completeness of third-party data.
                        </p>
                        <p className="text-gray-600 mt-4">
                            Your use of these features is also subject to each provider’s privacy policy and terms of service.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4" id="data-privacy">7. Data &amp; Privacy</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Your data is processed in accordance with our{" "}
                            <Link to="/privacy" className="text-main hover:text-main-dark font-medium transition-colors">
                                Privacy Policy
                            </Link>
                            . You may export your weight logs or request deletion of your account data at any time.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4" id="intellectual-property">8. Intellectual Property</h2>
                        <p className="text-gray-600 leading-relaxed">
                            All content, code, and design elements in MacroAura are owned by MacroAura LLC and protected by
                            copyright and intellectual property laws. You may not copy, reproduce, or distribute any part of
                            the app without written permission.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4" id="termination">9. Termination</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We may suspend or terminate your account at any time for conduct that violates these Terms or
                            disrupts the Service. You may stop using MacroAura at any time. Upon termination, your access to
                            the Service will be revoked, but you can request deletion of any stored data.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4" id="limitation">10. Limitation of Liability</h2>
                        <p className="text-gray-600 leading-relaxed">
                            To the maximum extent permitted by law, MacroAura LLC and its affiliates shall not be liable for
                            any indirect, incidental, consequential, or special damages arising from your use of the Service,
                            including data loss or inaccurate information, even if advised of the possibility of such damages.
                        </p>
                        <p className="text-gray-600 mt-4">
                            Our total liability to you for any claims arising out of these Terms or your use of the app will
                            not exceed $100 or the amount you paid (if any) for the Service in the last 12 months, whichever is
                            greater.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4" id="dispute">11. Dispute Resolution &amp; Arbitration</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Any dispute or claim arising out of or relating to these Terms shall be resolved by binding
                            arbitration in Ada County, Idaho, under the rules of the American Arbitration Association. You
                            agree to waive the right to a jury trial and to participate in class actions or representative
                            proceedings.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4" id="governing-law">12. Governing Law</h2>
                        <p className="text-gray-600 leading-relaxed">
                            These Terms are governed by the laws of the State of Idaho, without regard to conflict of law
                            principles. Any disputes not subject to arbitration shall be heard in the courts of Ada County,
                            Idaho.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4" id="changes">13. Changes to These Terms</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We may modify these Terms at any time to reflect updates to our app or legal obligations. Updated
                            terms will be posted here with a new effective date. Continued use of MacroAura after changes take
                            effect means you agree to the revised Terms.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4" id="contact-us">14. Contact Us</h2>
                        <p className="text-gray-600 leading-relaxed">
                            For questions about these Terms, contact us at{" "}
                            <a href="mailto:privacy@macroaura.com" className="text-main hover:text-main-dark font-medium transition-colors">
                                privacy@macroaura.com
                            </a>
                            .
                        </p>
                    </section>

                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <Link to="/" className="inline-flex items-center text-sm font-semibold text-main hover:text-main-dark transition-colors">
                            <i className="fas fa-arrow-left mr-2"></i>
                            Back to Home
                        </Link>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    )
}
