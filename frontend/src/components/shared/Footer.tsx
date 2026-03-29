import { useState } from "react";
import MoniveoLogo from "./MoniveoLogo";

const TwitterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.736-8.849L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const NAV_SECTIONS = [
  {
    title: "PLATFORM",
    links: ["Meet the platform", "Storyboard", "Cases", "Workbench", "Pricing"],
  },
  {
    title: "SOLUTIONS",
    links: ["By product", "Security", "Partners", "Professional services"],
  },
  {
    title: "RESOURCES",
    links: ["Blog", "Case studies", "Library"],
  },
  {
    title: "COMPANY",
    links: ["About Us", "Contact", "Sustainability", "Career"],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2500);
      setEmail("");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        .footer-root { font-family: 'Inter', sans-serif; }
        .font-manrope { font-family: 'Manrope', sans-serif; }
        .footer-link { color: #5c6470; transition: color 0.18s ease; }
        .footer-link:hover { color: #191c1e; }
        .social-btn { transition: background 0.18s ease, transform 0.18s ease; }
        .social-btn:hover { background: #e7e8ea !important; transform: translateY(-2px); }
        .sub-btn { transition: opacity 0.18s ease, transform 0.18s ease; }
        .sub-btn:hover { opacity: 0.88; transform: scale(1.06); }
        .email-input:focus { outline: none; }
        .legal-link { color: #8a9099; transition: color 0.15s ease; }
        .legal-link:hover { color: #191c1e; }
      `}</style>

      <footer className="footer-root w-full" style={{ backgroundColor: "#f8f9fb" }}>

        {/* --- Upper nav band --- */}
        <div style={{ backgroundColor: "#f3f4f6" }}>
          <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-14">
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">

              {NAV_SECTIONS.map((section) => (
                <div key={section.title} className="flex flex-col gap-4">
                  <p
                    className="font-manrope text-xs tracking-widest uppercase"
                    style={{ color: "#191c1e", fontWeight: 800, letterSpacing: "0.1em" }}
                  >
                    {section.title}
                  </p>
                  <ul className="flex flex-col gap-3">
                    {section.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="footer-link text-sm font-medium">{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Subscribe - spans full row on small, 1 col on lg+ */}
              <div className="col-span-2 md:col-span-4 lg:col-span-1 flex flex-col gap-5">
                <p
                  className="font-manrope text-xs tracking-widest uppercase"
                  style={{ color: "#191c1e", fontWeight: 800, letterSpacing: "0.1em" }}
                >
                  SUBSCRIBE
                </p>

                {/* Email pill */}
                <div
                  className="flex items-center rounded-full overflow-hidden"
                  style={{
                    backgroundColor: "#ffffff",
                    boxShadow: "0 4px 16px rgba(17,24,39,0.06)",
                    maxWidth: "280px",
                  }}
                >
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    className="email-input flex-1 min-w-0 bg-transparent px-4 py-2.5 text-sm"
                    style={{ color: "#191c1e" }}
                  />
                  <button
                    onClick={handleSubmit}
                    aria-label="Subscribe"
                    className="sub-btn flex-shrink-0 flex items-center justify-center rounded-full m-1.5 w-9 h-9 text-white"
                    style={{ background: "linear-gradient(135deg, #004ac6 0%, #2563eb 100%)" }}
                  >
                    {submitted ? <CheckIcon /> : <ArrowRightIcon />}
                  </button>
                </div>

                {/* Social row */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className="text-sm font-semibold font-manrope"
                    style={{ color: "#191c1e" }}
                  >
                    Follow Us
                  </span>
                  {[
                    { icon: <TwitterIcon />, label: "Twitter" },
                    { icon: <LinkedInIcon />, label: "LinkedIn" },
                    { icon: <FacebookIcon />, label: "Facebook" },
                  ].map(({ icon, label }) => (
                    <a
                      key={label}
                      href="#"
                      aria-label={label}
                      className="social-btn flex items-center justify-center w-8 h-8 rounded-full"
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#191c1e",
                        boxShadow: "0 2px 8px rgba(17,24,39,0.07)",
                      }}
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Bottom legal band --- */}
        <div style={{ backgroundColor: "#f8f9fb" }}>
          <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 py-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">

            <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:gap-4">
              <div className="flex items-center gap-2">
                <MoniveoLogo />
                <span
                  className="font-manrope text-base font-semibold tracking-tight"
                  style={{ color: "#191c1e" }}
                >
                  Moniveo
                </span>
              </div>
              <span className="text-xs" style={{ color: "#8a9099" }}>
                � 2023 Moniveo, Inc.
              </span>
            </div>

            <div className="flex items-center gap-5 flex-wrap justify-center">
              {["Privacy Policy", "Terms of use", "Disclosure"].map((item) => (
                <a key={item} href="#" className="legal-link text-xs font-medium">{item}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
