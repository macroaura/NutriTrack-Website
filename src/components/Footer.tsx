import { Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <img src="/logo-small.png" alt="MacroAura" className="h-8 w-8 rounded-lg" />
            <span className="text-lg font-display font-bold text-gray-900">MacroAura</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-600">
            <Link className="hover:text-main transition-colors" to="/">Home</Link>
            <Link className="hover:text-main transition-colors" to="/contact-us">Contact</Link>
            <Link className="hover:text-main transition-colors" to="/privacy">Privacy</Link>
            <Link className="hover:text-main transition-colors" to="/terms-of-service">Terms</Link>
            <Link className="hover:text-main transition-colors" to="/support-center">Support</Link>
          </div>
          <div className="flex gap-5">
            <a
              href="https://www.instagram.com/macroaura.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-main transition-colors hover:scale-110 transform duration-200"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <a
              href="https://www.tiktok.com/@macroaura"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-main transition-colors hover:scale-110 transform duration-200"
              aria-label="TikTok"
            >
              <i className="fab fa-tiktok text-xl"></i>
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} MacroAura. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
