import headerBg from "../assets/headerbg.png";
import HeroSection from "../components/HeroSection";

const Home = () => {
  return (
    <>
      <HeroSection
        backgroundImage={headerBg}
        eyebrow="VELKOMST"
        title="Smag det nordiske"
        description="Nordic Table er et sted, hvor sæsonens bedste råvarer forvandles til uforglemmelige oplevelser. Ro, kvalitet og hygge i hvert eneste måltid."
        primaryAction={{ label: "BOOK BORD", to: "/booking" }}
        secondaryAction={{ label: "SE MENUEN", to: "/menu" }}
      />

      <section className="page">
        <h2>Forside indhold</h2>
        <p>
          Placeholder: signaturretter, om sektion, fakta og reservation teaser.
        </p>
      </section>
    </>
  );
};

export default Home;
