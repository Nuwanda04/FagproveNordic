import { Link } from "react-router-dom";
import { FiFacebook, FiInstagram, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import logoWhite from "../assets/logoWhite.png";

const openingHours = [
  { day: "Mandag", time: "Lukket" },
  { day: "Tirsdag-torsdag", time: "17-22" },
  { day: "Fredag-lørdag", time: "17-23" },
  { day: "Søndag", time: "12-20" },
];

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <section className="footer__brand" aria-label="Nordic Table information">
            <img src={logoWhite} alt="Nordic Table" className="footer__logo" />
            <p className="footer__about">
              Nordisk køkken med fokus på sæsonens råvarer, enkelhed og hygge.
              Velkommen til bordet.
            </p>

            <div className="footer__social" aria-label="Sociale medier">
              <a href="#" className="footer__social-link" aria-label="Facebook">
                <FiFacebook aria-hidden="true" />
              </a>
              <a href="#" className="footer__social-link" aria-label="Instagram">
                <FiInstagram aria-hidden="true" />
              </a>
            </div>
          </section>

          <section className="footer__group" aria-label="Åbningstider">
            <h3 className="footer__title">ÅBNINGSTIDER</h3>
            <div className="footer__hours">
              {openingHours.map((item) => (
                <div key={item.day} className="footer__hours-row">
                  <span>{item.day}</span>
                  <span>{item.time}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="footer__group" aria-label="Hurtige links">
            <h3 className="footer__title">HURTIGE LINKS</h3>
            <div className="footer__links">
              <Link to="/booking" className="footer__link">
                Book bord
              </Link>
              <Link to="/login" className="footer__link">
                Personale
              </Link>
            </div>
          </section>

          <section className="footer__group" aria-label="Kontakt">
            <h3 className="footer__title">KONTAKT OS</h3>
            <div className="footer__contact">
              <p className="footer__contact-row">
                <span className="footer__contact-icon" aria-hidden="true">
                  <FiMapPin />
                </span>
                <span>Nordgade 12, 9000 Aalborg</span>
              </p>
              <p className="footer__contact-row">
                <span className="footer__contact-icon" aria-hidden="true">
                  <FiPhone />
                </span>
                <span>+45 12 34 56 78</span>
              </p>
              <p className="footer__contact-row">
                <span className="footer__contact-icon" aria-hidden="true">
                  <FiMail />
                </span>
                <span>info@nordictable.dk</span>
              </p>
            </div>
          </section>
        </div>

        <div className="footer__bottom">
          <p>© 2026 Nordic Table. Alle rettigheder forbeholdes</p>
          <p className="footer__credit">Designet og udviklet med omhu</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
