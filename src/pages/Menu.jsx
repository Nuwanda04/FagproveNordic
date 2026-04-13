import headerBg from "../assets/headerbg.png";
import HeroSection from "../components/HeroSection";

const Menu = () => {
  return (
    <>
      <HeroSection
        backgroundImage={headerBg}
        eyebrow="NORDIC TABLE"
        title="Se hele menuen"
        description="Placeholder: her vises alle retter fra API, grupperet i forret, hovedret og dessert."
        primaryAction={{ label: "BOOK BORD", to: "/booking" }}
        secondaryAction={{ label: "TIL FORSIDE", to: "/" }}
      />

      <section className="page">
        <h2>Menu indhold</h2>
        <p>
          Placeholder: alle retter fra API /dishes, grupperet efter kategori.
        </p>
      </section>
    </>
  );
};

export default Menu;
