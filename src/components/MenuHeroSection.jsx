import menuBg from "../assets/headerbg.png";

const MenuHeroSection = () => {
  return (
    <section className="menu-hero-shell">
      <div className="menu-hero" style={{ backgroundImage: `url(${menuBg})` }}>
        <div className="menu-hero__content">
          <p className="menu-hero__eyebrow">VORES MENU</p>
          <h1 className="menu-hero__title">
            Smagsoplevelser fra det nordiske køkken
          </h1>
          <p className="menu-hero__description">
            Alt på vores menu er tilberedt af sæsonens friskeste råvarer. Vi
            arbejder tæt med lokale producenter for at sikre den bedste
            kvalitet.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MenuHeroSection;
