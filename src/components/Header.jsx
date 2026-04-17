import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logoBlack from "../assets/logoBlack.png";
import logoWhite from "../assets/logoWhite.png";

// Definerer de primære navigationslinks for sitet
const navItems = [
  { label: "Forside", path: "/" },
  { label: "Menukort", path: "/menu" },
  { label: "Bestil bord", path: "/booking" },
  { label: "Log ind", path: "/login" },
];

/**
 * Header komponenten indeholder sidens primære navigation.
 * Håndterer både desktop-navigation og en responsiv burger-menu til mobil.
 * Baggrundsfarven ændres dynamisk: transparent på forsiden, solid på andre sider.
 */
const Header = () => {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isHome = pathname === "/";
  // The header should be transparent ONLY if we are on the home page AND we haven't scrolled down yet
  const isTransparent = isHome && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Låser sidens scrol-funktionalitet, når mobilmenuen er åben
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-60">
        {/* Desktop navigation */}
        <div
          className={`hidden lg:flex w-full px-14 py-5.5 items-center justify-between transition-colors duration-300 ${
            isTransparent ? "bg-transparent" : "bg-white shadow-sm"
          }`}
        >
          <NavLink to="/" className="inline-flex items-center" aria-label="Gå til forsiden">
            <img
              src={isTransparent ? logoWhite : logoBlack}
              alt="Nordic Table"
              className="w-[174px] h-[67px] object-contain transition-opacity duration-300"
            />
          </NavLink>

          <nav className="flex items-center gap-14.5" aria-label="Primær navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `font-[family-name:var(--font-body)] text-base font-normal uppercase tracking-wide transition-colors duration-300 ${
                    isActive
                      ? "text-[#866727] underline underline-offset-4"
                      : isTransparent
                        ? "text-white hover:text-white/80"
                        : "text-[#111] hover:text-[#111]/80"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Mobile burger trigger */}
        {!menuOpen && (
          <div className="w-full max-w-[390px] mx-auto px-6.5 pt-3.5 flex justify-end lg:hidden">
            <button
              type="button"
              className="w-9 h-9 border-0 p-0 bg-transparent grid content-center gap-1.5 cursor-pointer"
              aria-label="Åbn menu"
              onClick={() => setMenuOpen(true)}
            >
              <span className="block w-full h-[3px] rounded-full bg-[var(--color-accent)]" />
              <span className="block w-full h-[3px] rounded-full bg-[var(--color-accent)]" />
              <span className="block w-full h-[3px] rounded-full bg-[var(--color-accent)]" />
            </button>
          </div>
        )}
      </header>

      {/* Mobile fullscreen menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-90 bg-[rgba(185,185,185,0.88)] flex justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Burger menu"
        >
          <div className="w-full max-w-[390px] h-full bg-[#ececec]">
            <div className="h-[51px] px-4.5 py-2.5 border-b border-[rgba(95,95,95,0.18)] flex items-center justify-between">
              <img
                src={logoBlack}
                alt="Nordic Table"
                className="w-16 h-10 object-contain"
              />
              <button
                type="button"
                className="border-0 bg-transparent text-[#8b8b8b] text-[44px] leading-none cursor-pointer p-0"
                aria-label="Luk menu"
                onClick={() => setMenuOpen(false)}
              >
                ×
              </button>
            </div>

            <nav className="mt-[110px] px-[127px] py-13 grid gap-3.5" aria-label="Mobil navigation">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `font-[family-name:var(--font-heading)] text-2xl font-medium text-center ${
                      isActive ? "text-[#866727]" : "text-[#696969]"
                    }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
