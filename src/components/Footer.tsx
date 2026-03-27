import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

type FooterLink = { label: string; to: string } | { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };

const footerLinkClass =
  "group relative inline-flex w-fit text-[1.1rem] leading-tight text-black transition-transform duration-300 hover:-translate-y-px before:pointer-events-none before:absolute before:-bottom-1 before:left-0 before:right-0 before:h-3 before:rounded-full before:bg-main/20 before:opacity-0 before:blur-md before:transition-opacity before:duration-300 after:pointer-events-none after:absolute after:-bottom-0.5 after:left-0 after:right-0 after:h-[2px] after:origin-center after:scale-x-0 after:rounded-full after:bg-black after:transition-transform after:duration-300 hover:before:opacity-100 hover:after:scale-x-100";

const footerColumns: FooterColumn[] = [
  // {
  //   title: "Company",
  //   links: [
  //     { label: "About us", to: "/" },
  //     // { label: "Blog", to: "/blog" },
  //   ],
  // },
  {
    title: "Product",
    links: [
      { label: "Download App", href: "https://apps.apple.com/us/app/macroaura/id6757357405" },
      { label: "Getting started", href: "https://macroaura.notion.site/Getting-Started-with-MacroAura-32fdf05260b5801fb9d7fda5702f448d" },
      { label: "Release Notes", href: "https://macroaura.notion.site/MacroAura-Release-Notes-32fdf05260b5806e8a4cfc23996ba09f" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", href: "https://macroaura.notion.site/MacroAura-Frequently-Asked-Questions-703df05260b582c790a801c7d48823c4" },
      { label: "Request a feature", href: "mailto:support@macroaura.com?subject=Request%20a%20feature" },
      { label: "Report a bug", href: "mailto:support@macroaura.com?subject=Report%20a%20bug" },
      { label: "Contact us", to: "/contact-us" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "https://macroaura.notion.site/Terms-of-Service-32fdf05260b58039acffe7c8dc8ecffd" },
      { label: "Privacy Policy", to: "/privacy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-black/6 bg-white">
      <div className="mx-auto max-w-[90rem] px-6 py-14 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid gap-12 md:grid-cols-[1.3fr_repeat(4,minmax(0,1fr))] md:gap-10 lg:gap-14">
          <div className="flex flex-col gap-10">
            <div>
              <Link to="/" className="inline-flex items-center gap-3">
                <img src="https://web.macroaura.com/public/logo-small.png" alt="MacroAura" className="h-10 w-10 rounded-xl" />
                <span className="text-[1.9rem] font-semibold tracking-[-0.05em] text-black">MacroAura</span>
              </Link>
              <p className="mt-3 text-sm text-black/45">© AuraLabs LLC, {new Date().getFullYear()}</p>
            </div>

            <div className="flex items-center gap-5 text-[1.45rem] text-black">
              <a
                href="https://www.instagram.com/macroaura.co"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-200 hover:-translate-y-0.5"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://www.tiktok.com/@macroaura"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-200 hover:-translate-y-0.5 "
                aria-label="TikTok"
              >
                <i className="fab fa-tiktok"></i>
              </a>
              <a
                href="https://www.reddit.com/user/MacroAura"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-200 hover:-translate-y-0.5 "
                aria-label="Reddit"
              >
                <i className="fab fa-reddit"></i>
              </a>
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-lg font-medium text-black/45">{column.title}</h3>
              <div className="mt-5 flex flex-col items-start gap-4">
                {column.links.map((link) =>
                  "to" in link ? (
                    <Link
                      key={link.label}
                      to={link.to}
                      className={footerLinkClass}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className={footerLinkClass}
                    >
                      {link.label}
                    </a>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
