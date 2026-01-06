import { Helmet } from "react-helmet-async"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import type { SEOPageData } from "../data/seo-pages"
import { gaEvent } from "../analytics"

interface SEOPageProps {
    data: SEOPageData
}

export default function SEOPage({ data }: SEOPageProps) {
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as any } }
    }

    // Generate FAQ Schema
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": data.faq.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    }

    return (
        <>
            <Helmet>
                <title>{data.title}</title>
                <meta name="description" content={data.description} />
                <meta name="keywords" content={data.keywords} />
                <link rel="canonical" href={`https://www.macroaura.com/${data.slug}`} />

                {/* Open Graph */}
                <meta property="og:title" content={data.title} />
                <meta property="og:description" content={data.description} />
                <meta property="og:url" content={`https://www.macroaura.com/${data.slug}`} />
                <meta property="og:type" content="website" />

                {/* Twitter */}
                <meta name="twitter:title" content={data.title} />
                <meta name="twitter:description" content={data.description} />

                {/* FAQ Schema */}
                <script type="application/ld+json">
                    {JSON.stringify(faqSchema)}
                </script>
            </Helmet>

            <div className="min-h-screen bg-surface text-gray-900 font-sans selection:bg-main/20 selection:text-main-dark overflow-x-hidden">
                <Navbar />

                {/* Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-main/10 rounded-full blur-3xl opacity-70" />
                        <div className="absolute top-[20%] right-[-10%] w-[30rem] h-[30rem] bg-accent/10 rounded-full blur-3xl opacity-70" />
                    </div>

                    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                        <motion.h1
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            className="text-4xl font-display font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mb-6 leading-tight"
                        >
                            {data.hero.title}
                        </motion.h1>
                        <motion.p
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
                        >
                            {data.hero.subtitle}
                        </motion.p>
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            className="mt-10"
                        >
                            <a
                                href="https://testflight.apple.com/join/GKZqpGB6"
                                target='_blank'
                                rel="noopener noreferrer"
                                onClick={() => {
                                    if (import.meta.env.PROD) {
                                        gaEvent('click', {
                                            label: 'SEO Page Hero CTA',
                                            location: data.slug,
                                        });
                                    }
                                }}
                                className="inline-flex items-center justify-center rounded-full bg-gray-900 px-8 py-4 text-base font-bold text-white shadow-xl transition-all duration-300 hover:bg-gray-800 hover:shadow-2xl hover:-translate-y-1 hover:scale-105"
                            >
                                {data.hero.cta}
                            </a>
                        </motion.div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-24 bg-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-12 md:grid-cols-3">
                            {data.features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-main/10 text-main mb-6">
                                        <i className={`fas ${feature.icon} text-2xl`}></i>
                                    </div>
                                    <h3 className="text-xl font-display font-bold text-gray-900 mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Long Form Content */}
                <section className="py-24 bg-surface">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                        {data.longForm.map((section, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="mb-16 last:mb-0"
                            >
                                <h2 className="text-3xl font-display font-bold text-gray-900 mb-6">{section.title}</h2>
                                {section.content.map((paragraph, pIndex) => (
                                    <p key={pIndex} className="text-lg text-gray-600 leading-relaxed mb-6 last:mb-0">
                                        {paragraph.split('**').map((part, i) =>
                                            i % 2 === 1 ? <strong key={i} className="font-semibold text-gray-900">{part}</strong> : part
                                        )}
                                    </p>
                                ))}
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-24 bg-white">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-display font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {data.faq.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="rounded-2xl bg-surface p-6"
                                >
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.question}</h3>
                                    <p className="text-gray-600">{item.answer}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="py-24 bg-main/90">
                    <div className="mx-auto max-w-4xl px-4 text-center">
                        <h2 className="text-3xl font-display font-bold text-white sm:text-4xl mb-8">
                            Ready to hit your goals?
                        </h2>
                        <a
                            href="https://testflight.apple.com/join/GKZqpGB6"
                            target='_blank'
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-bold text-gray-900 shadow-lg transition-all duration-300 hover:bg-gray-100 hover:-translate-y-1"
                        >
                            Download MacroAura Beta
                        </a>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    )
}
