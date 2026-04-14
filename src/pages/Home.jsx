import headerBg from "../assets/headerbg.png";
import AboutUsSection from "../components/AboutUsSection";
import HeroSection from "../components/HeroSection";
import ReservationSection from "../components/ReservationSection";
import SelectionsSection from "../components/SelectionsSection";

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

      <SelectionsSection />
      <AboutUsSection />
      <ReservationSection />
    </>
  );
};

export default Home;
