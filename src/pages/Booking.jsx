import headerBg from "../assets/headerbg.png";
import HeroSection from "../components/HeroSection";

const Booking = () => {
  return (
    <>
      <HeroSection
        backgroundImage={headerBg}
        eyebrow="RESERVATION"
        title="Book dit bord"
        description="Placeholder: her kommer praktisk information, formular og feedback ved succes eller fejl."
        primaryAction={{ label: "SE MENUEN", to: "/menu" }}
        secondaryAction={{ label: "TIL FORSIDE", to: "/" }}
      />

      <section className="page">
        <h2>Booking indhold</h2>
        <p>Placeholder: praktisk info cards + valideret booking formular.</p>
      </section>
    </>
  );
};

export default Booking;
