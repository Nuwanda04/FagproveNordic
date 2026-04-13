import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logoBlack from "../assets/logoBlack.png";
import logoWhite from "../assets/logoWhite.png";

const navItems = [
  { label: "Forside", path: "/" },
  { label: "Menukort", path: "/menu" },
  { label: "Bestil bord", path: "/booking" },
  { label: "Log ind", path: "/login" },
];

const Header = () => {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === "/";

  const desktopTheme = useMemo(() => {
    return isHome ? "header--transparent" : "header--solid";
  }, [isHome]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className={`header ${desktopTheme}`}>
        <div className="header__desktop">
          <NavLink
            to="/"
            className="header__logo-link"
            aria-label="Gå til forsiden"
          >
            <img
              src={isHome ? logoWhite : logoBlack}
              alt="Nordic Table"
              className="header__logo"
            />
          </NavLink>

          <nav className="header__nav" aria-label="Primær navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `header__nav-link ${isActive ? "header__nav-link--active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {!menuOpen && (
          <div className="header__mobile-trigger-wrap">
            <button
              type="button"
              className="header__mobile-trigger"
              aria-label="Åbn menu"
              onClick={() => setMenuOpen(true)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        )}
      </header>

      {menuOpen && (
        <div
          className="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Burger menu"
        >
          <div className="mobile-menu__panel">
            <div className="mobile-menu__top">
              <img
                src={logoBlack}
                alt="Nordic Table"
                className="mobile-menu__logo"
              />
              <button
                type="button"
                className="mobile-menu__close"
                aria-label="Luk menu"
                onClick={() => setMenuOpen(false)}
              >
                ×
              </button>
            </div>

            <nav className="mobile-menu__links" aria-label="Mobil navigation">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `mobile-menu__link ${isActive ? "mobile-menu__link--active" : ""}`
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
