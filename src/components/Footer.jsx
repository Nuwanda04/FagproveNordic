import {
  FiFacebook,
  FiInstagram,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import logoWhite from "../assets/logoWhite.png";

const openingHours = [
  { day: "Mandag", time: "Lukket" },
  { day: "Tirsdag-torsdag", time: "17-22" },
  { day: "Fredag-lørdag", time: "17-23" },
  { day: "Søndag", time: "12-20" },
];

const Footer = () => {
  return (
    <footer className="bg-[#1f1f1f]">
      <div className="w-full max-w-[390px] lg:max-w-[1240px] mx-auto px-6 lg:px-10 pt-8 pb-4">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Brand */}
          <section aria-label="Nordic Table information">
            <img src={logoWhite} alt="Nordic Table" className="w-[61px] h-[29px] object-contain" />
            <p className="w-[180px] mt-3 text-[#ccc] font-[family-name:var(--font-body)] text-xs font-normal leading-relaxed">
              Nordisk køkken med fokus på sæsonens råvarer, enkelhed og hygge.
              Velkommen til bordet.
            </p>

            <div className="mt-4 flex gap-3.5" aria-label="Sociale medier">
              <a
                href="#"
                className="w-10 h-10 border border-white/80 rounded-lg grid place-items-center text-white"
                aria-label="Facebook"
              >
                <FiFacebook className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="#"
                className="w-10 h-10 border border-white/80 rounded-lg grid place-items-center text-white"
                aria-label="Instagram"
              >
                <FiInstagram className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </section>

          {/* Åbningstider */}
          <section aria-label="Åbningstider">
            <h3 className="m-0 mb-4 font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.1em] text-[#999]">
              ÅBNINGSTIDER
            </h3>
            <div className="grid gap-3">
              {openingHours.map((item) => (
                <div
                  key={item.day}
                  className="w-full flex justify-between text-[#ccc] font-[family-name:var(--font-body)] text-xs font-light tracking-[0.05em]"
                >
                  <span>{item.day}</span>
                  <span>{item.time}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Hurtige links */}
          <section aria-label="Hurtige links">
            <h3 className="m-0 mb-4 font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.1em] text-[#999]">
              HURTIGE LINKS
            </h3>
            <div className="grid gap-3">
              <Link
                to="/booking"
                className="text-[#ccc] font-[family-name:var(--font-body)] text-sm font-light tracking-[0.05em] hover:text-white hover:underline"
              >
                Book bord
              </Link>
              <Link
                to="/login"
                className="text-[#ccc] font-[family-name:var(--font-body)] text-sm font-light tracking-[0.05em] hover:text-white hover:underline"
              >
                Personale
              </Link>
            </div>
          </section>

          {/* Kontakt */}
          <section aria-label="Kontakt">
            <h3 className="m-0 mb-4 font-[family-name:var(--font-body)] text-sm font-bold tracking-[0.1em] text-[#999]">
              KONTAKT OS
            </h3>
            <div className="grid gap-3">
              <p className="m-0 flex items-center gap-2.5 text-[#ccc] font-[family-name:var(--font-body)] text-xs font-light tracking-[0.05em]">
                <span className="text-[#c6a64b] text-base shrink-0" aria-hidden="true">
                  <FiMapPin />
                </span>
                <span>Nordgade 12, 9000 Aalborg</span>
              </p>
              <p className="m-0 flex items-center gap-2.5 text-[#ccc] font-[family-name:var(--font-body)] text-xs font-light tracking-[0.05em]">
                <span className="text-[#c6a64b] text-base shrink-0" aria-hidden="true">
                  <FiPhone />
                </span>
                <span>+45 12 34 56 78</span>
              </p>
              <p className="m-0 flex items-center gap-2.5 text-[#ccc] font-[family-name:var(--font-body)] text-xs font-light tracking-[0.05em]">
                <span className="text-[#c6a64b] text-base shrink-0" aria-hidden="true">
                  <FiMail />
                </span>
                <span>info@nordictable.dk</span>
              </p>
            </div>
          </section>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 border-t border-white/10 pt-4 pb-2 flex items-center justify-center">
          <p className="m-0 font-[family-name:var(--font-body)] text-xs font-extralight text-white/60">
            © 2026 Nordic Table. Alle rettigheder forbeholdes
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
