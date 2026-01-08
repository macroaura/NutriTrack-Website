import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import './App.css'
import Landing from './pages/Landing'
import Privacy from './pages/Privacy'
import { gaEvent } from './analytics'
import Support from './pages/Support'
import TermsOfService from './pages/TermsOfService'
import Contact from './components/Contact'
import SEOPage from './pages/SEOPage'
import { seoPages } from './data/seo-pages'
import AuthAction from './pages/AuthAction'

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
    case '/support-center':
      title = 'Support • MacroAura'
      description = 'Get help, explore FAQs, or contact MacroAura support for quick answers.'
      break
    case '/terms-of-service':
      title = 'Terms of Service • MacroAura'
      description = 'Review the terms and conditions for using MacroAura.'
      break
    case '/contact-us':
      title = 'Contact Us • MacroAura'
      description = 'Reach out to MacroAura’s team for questions, feedback, or support.'
      break
    default:
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
  const ogImage = `${baseUrl}/logo-green.jpg`

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

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <GAListener />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth/action" element={<AuthAction />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/support-center" element={<Support />} />
          <Route path='/terms-of-service' element={<TermsOfService />} />
          <Route path="/contact-us" element={<Contact />} />

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
      </BrowserRouter>
    </HelmetProvider>
  )
}