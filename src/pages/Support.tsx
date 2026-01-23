// MacroAura Help Center — React + Tailwind + react-hook-form + zod
// ---------------------------------------------------------------
// Drop this into your React/Next.js app (e.g., app/help/page.tsx or pages/help.tsx)
// and ensure Tailwind is configured. This component renders:
//  - Searchable, filterable FAQ with collapsible answers
//  - Contact form validated by Zod via zodResolver
//  - POST to /api/support with a graceful mailto fallback
//  - Optional GA4 events (faq_open, support_form_submit)
//
// Install once:
//   npm i react-hook-form zod @hookform/resolvers
//
// Server route examples for /api/support are at the bottom of this file (commented).

import React, { useEffect, useMemo, useState, useDeferredValue } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getFaqs } from "../lib/sanity";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { Helmet } from "react-helmet-async"
declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        grecaptcha?: {
            render: (container: HTMLElement | string, params: {
                sitekey: string;
                callback?: (resp: string) => void;
                'error-callback'?: () => void;
                'expired-callback'?: () => void;
            }) => number;
            getResponse: (widgetId?: number) => string;
            reset: (widgetId?: number) => void;
        };
        onRecaptchaLoad?: () => void;
    }
}

// -----------------------------
// FAQ DATA
// -----------------------------

type FaqItem = {
    id: string;
    question: string;
    // FAQ answer is stored as Portable Text in Sanity
    answer: PortableTextBlock[];
    category: string; // e.g., "Getting Started", "Logging Food"
    tags?: string[];
};

// Sanity raw shape for type safety when mapping
type SanityFaq = {
    _id: string;
    question?: string;
    answer?: PortableTextBlock[];
    category?: string;
    tag?: string[];
};

// Build categories list with "All" (component derives live categories at runtime)

// -----------------------------
// CONTACT FORM SCHEMA
// -----------------------------

const SupportSchema = z.object({
    name: z.string().trim().max(80).optional(),
    email: z.string().trim().email("Enter a valid email"),
    // use a const assertion so z.enum infers the tuple type correctly
    topic: z.enum(["General", "Account", "Logging Food", "AI Suggestions", "Notifications", "Billing", "Bug"] as const),
    subject: z.string().trim().min(3, "Subject is too short").max(120),
    message: z.string().trim().min(10, "Tell us a bit more (10+ chars)").max(4000),
});

type SupportFormValues = z.infer<typeof SupportSchema>;

// -----------------------------
// COMPONENT
// -----------------------------

export default function Support() {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState<string>("All");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [submitState, setSubmitState] = useState<"idle" | "sending" | "done" | "error">("idle");
    // Sanity-driven FAQs
    const [faqs, setFaqs] = useState<FaqItem[] | null>(null);
    const [loadingFaqs, setLoadingFaqs] = useState(false);
    const [faqError, setFaqError] = useState<string | null>(null);

    // Load FAQs from Sanity (fallback to local `FAQS` if something goes wrong)
    useEffect(() => {
        let mounted = true;
        setLoadingFaqs(true);
        getFaqs()
            .then((data) => {
                if (!mounted) return;
                const arr = data as SanityFaq[];
                const mapped: FaqItem[] = arr.map((d: SanityFaq) => ({
                    id: String(d._id),
                    question: String(d.question ?? ""),
                    answer: (d.answer as PortableTextBlock[]) ?? [],
                    category: String(d.category ?? "Uncategorized"),
                    tags: (d.tag as string[]) ?? [],
                }));
                setFaqs(mapped);
                setFaqError(null);
            })
            .catch((err) => {
                console.error("Failed to fetch FAQs from Sanity:", err);
                if (!mounted) return;
                setFaqError("Unable to load FAQs from CMS");
                setFaqs(null);
            })
            .finally(() => {
                if (!mounted) return;
                setLoadingFaqs(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    // Debounced search query for improved UX
    const deferredQuery = useDeferredValue(query);
    // Filter + search (use remote FAQs only)
    const filteredFaqs = useMemo<FaqItem[]>(() => {
        const source = faqs ?? [];
        const q = deferredQuery.toLowerCase().trim();
        return source.filter((f: FaqItem) => {
            const inCat = category === "All" || f.category === category;
            if (!inCat) return false;
            if (!q) return true;
            const hay = (f.question + " " + JSON.stringify(f.answer) + " " + (f.tags?.join(" ") ?? "")).toLowerCase();
            return hay.includes(q);
        });
    }, [deferredQuery, category, faqs]);

    const categoriesList = useMemo<string[]>(() => ["All", ...Array.from(new Set((faqs ?? []).map((f: FaqItem) => f.category)))], [faqs]);

    // Convert Sanity Portable Text blocks to plain text for JSON-LD
    const toPlainText = (blocks: PortableTextBlock[] = []): string => {
        try {
            return blocks
                .map((block: any) => {
                    if (!block) return '';
                    if (block._type !== 'block' || !Array.isArray(block.children)) return '';
                    return block.children.map((span: any) => span?.text ?? '').join('');
                })
                .join('\n')
                .trim();
        } catch {
            return '';
        }
    };

    // Build FAQPage JSON-LD from fetched FAQs
    const faqSchema = useMemo(() => {
        if (!faqs || faqs.length === 0) return null;
        return {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.slice(0, 100).map((f) => ({
                "@type": "Question",
                "name": f.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": toPlainText(f.answer)
                }
            }))
        };
    }, [faqs]);

    // GA4 helper (safe)
    const gtag = (name: string, params: Record<string, unknown>) => {
        if (typeof window !== "undefined" && typeof window.gtag === "function") {
            window.gtag("event", name, params);
        }
    };

    const loadRecaptchaV2 = (): Promise<void> =>
        new Promise((resolve, reject) => {
            if (typeof window === "undefined") return resolve();
            if (window.grecaptcha?.render) return resolve(); // already loaded

            // global callback
            (window as any).onRecaptchaLoad = () => resolve();

            // check if already loaded
            const existing = document.querySelector('script[src*="recaptcha/api.js"]');
            if (existing) {
                existing.addEventListener("load", () => resolve());
                existing.addEventListener("error", () => reject(new Error("reCAPTCHA script failed")));
                return;
            }

            // add correct script
            const script = document.createElement("script");
            script.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
            script.async = true;
            script.defer = true;
            script.onerror = () => reject(new Error("Failed to load reCAPTCHA"));
            document.head.appendChild(script);
        });



    const recaptchaRef = React.useRef<HTMLDivElement>(null);
    const [widgetId, setWidgetId] = useState<number | null>(null);
    const [captchaSolved, setCaptchaSolved] = useState(false);

    useEffect(() => {
        let cancelled = false;

        loadRecaptchaV2()
            .then(() => {
                if (cancelled || !recaptchaRef.current) return;

                // small delay ensures the div is mounted
                setTimeout(() => {
                    if (cancelled || !recaptchaRef.current) return;
                    const id = window.grecaptcha!.render(recaptchaRef.current, {
                        sitekey: "6Lcn9P4rAAAAAOTbLUIwyQDXpSubTABWJiwam1tk",
                        callback: () => setCaptchaSolved(true),
                        "expired-callback": () => setCaptchaSolved(false),
                        "error-callback": () => setCaptchaSolved(false),
                    });
                    setWidgetId(id);
                }, 300);
            })
            .catch((err) => console.error("Failed to load reCAPTCHA:", err));

        return () => {
            cancelled = true;
        };
    }, []);


    // Form
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<SupportFormValues>({ resolver: zodResolver(SupportSchema) });

    const onSubmit = async (data: SupportFormValues) => {
        setSubmitState("sending");
        try {
            const token = widgetId !== null ? window.grecaptcha!.getResponse(widgetId) : "";
            if (!token) {
                setCaptchaSolved(false);
                throw new Error("Please complete the reCAPTCHA challenge.");
            }

            const formData = new FormData();
            formData.append("email", data.email);
            if (data.name) formData.append("name", data.name);
            formData.append("topic", data.topic);
            formData.append("subject", data.subject);
            formData.append("message", data.message);
            formData.append("path", typeof window !== "undefined" ? window.location.pathname : "/help");
            formData.append("g-recaptcha-response", token);
            formData.append("_replyto", data.email);
            formData.append("_subject", `[${data.topic}] ${data.subject}`);

            const res = await fetch("https://formspree.io/f/mrbooaaz", {
                method: "POST",
                headers: { Accept: "application/json" },
                body: formData,
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`HTTP ${res.status} – ${text}`);
            }

            setSubmitState("done");
            gtag("support_form_submit", { topic: data.topic });
            reset();
            if (widgetId !== null) {
                window.grecaptcha!.reset(widgetId);
                setCaptchaSolved(false);
            }
        } catch (e) {
            console.error("Form submission failed:", e);
            setSubmitState("error");
            const subject = encodeURIComponent(`[MacroAura Support] ${data.subject}`);
            const body = encodeURIComponent(
                `Topic: ${data.topic}\nName: ${data.name ?? ""}\nEmail: ${data.email}\nPath: ${typeof window !== "undefined" ? window.location.href : ""}\n\n${data.message}`
            );
            window.location.href = `mailto:support@macroaura.com?subject=${subject}&body=${body}`;
        }
    };

    // UI
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* SEO + JSON-LD */}
            {/* Add Helmet for meta tags/JSON-LD */}
            {
                // Insert react-helmet or similar block here if not already present
            }
            <Helmet>
                <title>MacroAura Support Center – Help &amp; Contact</title>
                <link rel="canonical" href="https://www.macroaura.com/support-center" />
                <meta name="description" content="Get help with MacroAura: browse FAQs or contact support for account, food logging, AI, billing, and more." />
                <meta property="og:title" content="MacroAura Support Center – Help &amp; Contact" />
                <meta property="og:description" content="Get help with MacroAura: browse FAQs or contact support for account, food logging, AI, billing, and more." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.macroaura.com/support-center" />
                <meta property="og:image" content="https://www.macroaura.com/logo-small.png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:site_name" content="MacroAura" />
                <meta property="og:locale" content="en_US" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="MacroAura Support Center – Help &amp; Contact" />
                <meta name="twitter:description" content="Get help with MacroAura: browse FAQs or contact support for account, food logging, AI, billing, and more." />
                <meta name="twitter:image" content="https://www.macroaura.com/logo-small.png" />
                {/* WebPage JSON-LD */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "MacroAura Support Center",
                        "description": "Get help with MacroAura: browse FAQs or contact support for account, food logging, AI, billing, and more.",
                        "url": "https://www.macroaura.com/support-center"
                    })}
                </script>
                {/* FAQPage JSON-LD */}
                {faqSchema && (
                    <script type="application/ld+json">
                        {JSON.stringify(faqSchema)}
                    </script>
                )}
            </Helmet>
            <Navbar />
            <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
                <header className="mb-12 text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">Support Center</h1>
                    <p className="text-lg text-gray-600">Find quick answers or contact our support team directly.</p>
                </header>

                {/* Search + Category */}
                <div className="grid gap-6 md:grid-cols-5 mb-12">
                    <div className="md:col-span-3 relative">
                        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <input
                            type="search"
                            placeholder="Search questions…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-main focus:border-transparent shadow-sm transition-all"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-main focus:border-transparent shadow-sm transition-all"
                        >
                            {categoriesList.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid gap-12 lg:grid-cols-12">
                    {/* FAQ list */}
                    <section className="lg:col-span-7">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                        {loadingFaqs && <div className="text-sm text-gray-500 mb-3 animate-pulse">Loading FAQs…</div>}
                        {faqError && <div className="text-sm text-red-600 mb-3 bg-red-50 p-3 rounded-lg">{faqError}</div>}

                        <ul className="space-y-4">
                            {filteredFaqs.map((f) => {
                                const open = expandedId === f.id;
                                return (
                                    <li key={f.id} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
                                        <button
                                            type="button"
                                            aria-expanded={open}
                                            aria-controls={`faq-${f.id}`}
                                            aria-labelledby={`q-${f.id}`}
                                            onClick={() => {
                                                setExpandedId(open ? null : f.id);
                                                if (!open) gtag("faq_open", { id: f.id, category: f.category });
                                            }}
                                            className="w-full text-left px-6 py-5 cursor-pointer focus:outline-none"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="font-semibold text-gray-900 text-lg" id={`q-${f.id}`}>{f.question}</p>
                                                    <span className="inline-block mt-1 text-xs font-medium text-main bg-main/10 px-2 py-0.5 rounded-full">{f.category}</span>
                                                </div>
                                                <span className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
                                                    <i className="fas fa-chevron-down"></i>
                                                </span>
                                            </div>
                                        </button>
                                        {open && (
                                            <div
                                                id={`faq-${f.id}`}
                                                role="region"
                                                aria-labelledby={`q-${f.id}`}
                                                className="px-6 pb-6 text-gray-600 border-t border-gray-100 pt-4"
                                            >
                                                <div className="prose prose-gray max-w-none">
                                                    <PortableText value={f.answer as PortableTextBlock[]} />
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>

                        {filteredFaqs.length === 0 && query.length > 0 && (
                            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                                <p className="text-gray-500">No results found for "{query}".</p>
                                <button onClick={() => setQuery("")} className="mt-2 text-main font-medium hover:underline">Clear search</button>
                            </div>
                        )}
                    </section>

                    {/* Contact form */}
                    <aside className="lg:col-span-5">
                        <div className="sticky top-24">
                            <div className="rounded-2xl border border-gray-200 bg-white shadow-lg p-6 sm:p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Support</h2>
                                <p className="text-gray-600 mb-6 text-sm">Can't find what you're looking for? Send us a message.</p>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="support-email">Email *</label>
                                        <input
                                            id="support-email"
                                            {...register("email")}
                                            type="email"
                                            aria-invalid={!!errors.email}
                                            aria-describedby={errors.email ? "support-email-error" : undefined}
                                            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-main focus:border-transparent transition-all"
                                            placeholder="you@example.com"
                                        />
                                        {errors.email && <p id="support-email-error" className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="support-name">Name</label>
                                            <input id="support-name" {...register("name")} type="text" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-main focus:border-transparent transition-all" placeholder="Optional" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="support-topic">Topic *</label>
                                            <select
                                                id="support-topic"
                                                {...register("topic")}
                                                aria-invalid={!!errors.topic}
                                                aria-describedby={errors.topic ? "support-topic-error" : undefined}
                                                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-main focus:border-transparent transition-all bg-white"
                                            >
                                                <option value="">Select…</option>
                                                <option>General</option>
                                                <option>Account</option>
                                                <option>Logging Food</option>
                                                <option>AI Suggestions</option>
                                                <option>Notifications</option>
                                                <option>Billing</option>
                                                <option>Bug</option>
                                            </select>
                                            {errors.topic && <p id="support-topic-error" className="text-xs text-red-600 mt-1">{errors.topic.message as string}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="support-subject">Subject *</label>
                                        <input
                                            id="support-subject"
                                            {...register("subject")}
                                            type="text"
                                            aria-invalid={!!errors.subject}
                                            aria-describedby={errors.subject ? "support-subject-error" : undefined}
                                            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-main focus:border-transparent transition-all"
                                            placeholder="Brief summary"
                                        />
                                        {errors.subject && <p id="support-subject-error" className="text-xs text-red-600 mt-1">{errors.subject.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="support-message">Message *</label>
                                        <textarea
                                            id="support-message"
                                            {...register("message")}
                                            rows={5}
                                            aria-invalid={!!errors.message}
                                            aria-describedby={errors.message ? "support-message-error" : undefined}
                                            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-main focus:border-transparent transition-all resize-none"
                                            placeholder="How can we help?"
                                        />
                                        {errors.message && <p id="support-message-error" className="text-xs text-red-600 mt-1">{errors.message.message}</p>}
                                    </div>
                                    <div className="mt-2">
                                        <div ref={recaptchaRef} className="g-recaptcha" />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={submitState === "sending" || !captchaSolved}
                                        className="w-full rounded-xl bg-gray-900 text-white py-3 font-bold shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all duration-300 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
                                    >
                                        {submitState === "sending" ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <i className="fas fa-spinner fa-spin"></i> Sending…
                                            </span>
                                        ) : (!captchaSolved ? "Please verify you're human…" : "Send Message")}
                                    </button>
                                    {submitState === "done" && (
                                        <div className="p-4 rounded-xl bg-green-50 text-green-700 text-sm font-medium flex items-center gap-2 animate-fade-in">
                                            <i className="fas fa-check-circle"></i>
                                            Thanks! We got your message and will reply soon.
                                        </div>
                                    )}
                                    {submitState === "error" && (
                                        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm font-medium flex items-center gap-2 animate-fade-in">
                                            <i className="fas fa-exclamation-circle"></i>
                                            We couldn't reach the server—opening your mail app instead.
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-500 text-center">
                                        By submitting, you agree to be contacted at the provided email.
                                    </p>
                                    <small className="text-xs text-gray-400 block text-center mt-1">
                                        Protected by reCAPTCHA v2
                                    </small>
                                </form>
                            </div>
                        </div>
                    </aside>
                </div>

            </div>
            <Footer />
        </div>
    );
}
