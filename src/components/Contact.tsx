import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Link } from "react-router-dom"

export default function Contact() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <Navbar />

            <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 pt-30">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">Contact Us</h1>
                <p className="text-lg text-gray-600 mb-10">We’re here to help you make the most of MacroAura.</p>

                <section className="prose prose-lg prose-gray max-w-none">
                    <div className="grid gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Technical Support</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Need help using MacroAura? Check our{" "}
                                <a
                                    href="https://macroaura.notion.site/MacroAura-Frequently-Asked-Questions-703df05260b582c790a801c7d48823c4"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-main hover:text-main-dark font-medium transition-colors"
                                >
                                    FAQ
                                </a>{" "}
                                for FAQs, troubleshooting guides, and step-by-step tips. If you can’t find your answer, our support
                                team is happy to assist — just email{" "}
                                <a href="mailto:support@macroaura.com" className="text-main hover:text-main-dark font-medium transition-colors">
                                    support@macroaura.com
                                </a>
                                .
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Feedback & Suggestions</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Have an idea, feature request, or success story to share? We’d love to hear how MacroAura has
                                helped you stay on track or how we can make it better for everyone. You can send feedback directly
                                to{" "}
                                <a href="mailto:feedback@macroaura.com" className="text-main hover:text-main-dark font-medium transition-colors">
                                    feedback@macroaura.com
                                </a>
                                .
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Marketing & Partnerships</h2>
                            <p className="text-gray-600 leading-relaxed">
                                For media inquiries, collaborations, or partnership opportunities, please contact our marketing
                                team at{" "}
                                <a href="mailto:marketing@macroaura.com" className="text-main hover:text-main-dark font-medium transition-colors">
                                    marketing@macroaura.com
                                </a>
                                .
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Connect With Us</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Follow MacroAura for the latest updates, nutrition tips, and feature announcements:
                            </p>
                            <ul className="flex gap-6">
                                <li>
                                    <a
                                        href="https://www.instagram.com/macroaura.co"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 hover:text-main transition-colors text-lg"
                                    >
                                        <i className="fab fa-instagram mr-2"></i>
                                        Instagram
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://www.tiktok.com/@macroaura"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 hover:text-main transition-colors text-lg"
                                    >
                                        <i className="fab fa-tiktok mr-2"></i>
                                        TikTok
                                    </a>
                                </li>
                                <li>
                                            <a
                                href="https://www.reddit.com/user/MacroAura"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-transform duration-200 hover:-translate-y-0.5 hover:text-main"
                                aria-label="Reddit"
                            >
                                <i className="fab fa-reddit"></i>
                            </a>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Business Address</h2>
                            <p className="text-gray-600 leading-relaxed">
                                MacroAura LLC<br />
                                Boise, Idaho, USA
                            </p>
                        </div>
                    </div>
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
    )
}
