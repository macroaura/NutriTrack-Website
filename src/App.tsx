import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import './App.css'
import Landing from './pages/Landing'
import Privacy from './pages/Privacy'
import { gaEvent } from './analytics'
import Contact from './components/Contact'
import SEOPage from './pages/SEOPage'
import { seoPages } from './data/seo-pages'
import AuthAction from './pages/AuthAction'
import ActivityPage from './pages/ActivityPage'

function GAListener() {
  const location = useLocation()

  let title, description, path = location.pathname
  switch (path) {
    case '/privacy':
      title = 'Privacy • MacroAura'
      description = 'Learn how MacroAura protects your privacy and handles your data responsibly.'
      break
    case '/auth/action':
      title = 'Auth Action • MacroAura'
      description = 'Handle Firebase auth actions like reset password and verify email.'
      break
    case '/contact-us':
      title = 'Contact Us • MacroAura'
      description = 'Reach out to MacroAura’s team for questions, feedback, or support.'
      break
    default:
      // Check if it's a shared activity page
      if (path.startsWith('/activity/')) {
        title = 'Workout • MacroAura'
        description = 'View this workout on MacroAura.'
        break
      }
      // Check if it's an SEO page
      const seoPage = seoPages.find(page => `/${page.slug}` === path);
      if (seoPage) {
        title = seoPage.title;
        description = seoPage.description;
      } else {
        title = 'MacroAura — Track Nutrition Smarter'
        description = 'Track your meals, calories, macros, and progress effortlessly with MacroAura.'
      }
      break
  }

  const baseUrl = 'https://www.macroaura.com'
  const canonicalUrl = `${baseUrl}${path === '*' ? '/' : path}`
  const ogImage = `${baseUrl}/logo-small.png`

  useEffect(() => {
    if (import.meta.env.PROD) {
      gaEvent('page_view', {
        page_title: title,
        page_location: window.location.href,
        page_path: location.pathname,
      })
    }
  }, [location.pathname, title])

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  )
}

function AppRoutes() {
  const location = useLocation()
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.key}
        initial={
          shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0 }
        }
        animate={
          shouldReduceMotion
            ? { opacity: 1 }
            : { opacity: 1 }
        }
        exit={
          shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0 }
        }
        transition={{
          duration: shouldReduceMotion ? 0.18 : 0.28,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="min-h-screen"
      >
        <Routes location={location}>
          <Route path="/" element={<Landing />} />
          <Route path="/auth/action" element={<AuthAction />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/contact-us" element={<Contact />} />

          {/* Shared workout pages */}
          <Route path="/activity/:shareToken" element={<ActivityPage />} />

          {/* SEO Landing Pages */}
          {seoPages.map((page) => (
            <Route
              key={page.slug}
              path={`/${page.slug}`}
              element={<SEOPage data={page} />}
            />
          ))}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <GAListener />
        <AppRoutes />
      </BrowserRouter>
    </HelmetProvider>
  )
}
