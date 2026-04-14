import aboutImage from "../assets/restaurant.png";

const stats = [
  { value: "12", label: "RETTER PÅ MENUEN" },
  { value: "6", label: "ÅRS ERFARING" },
  { value: "100", label: "% NORDISKE RÅVARER" },
];

const AboutUsSection = () => {
  return (
    <section className="about-us">
      <div className="about-us__inner">
        <img
          src={aboutImage}
          alt="Nordic Table restaurant"
          className="about-us__image"
        />

        <div className="about-us__content">
          <p className="about-us__eyebrow">OM OS</p>

          <h2 className="about-us__title">
            En restaurant båret af nærhed og nærvær
          </h2>

          <span className="about-us__line" aria-hidden="true" />

          <div className="about-us__text">
            <p>
              Nordic Table er grundlagt med en klar overbevisning: god mad
              behøver ikke at være kompliceret. Vi laver mad af det, naturen
              giver os - det nordiske køkkens uforlignelige råvarer.
            </p>
            <p>
              Fra de friske fiskefarvande til skovens bær og urter - vores menu
              forandrer sig med årstidens rytme. Det giver gæsterne noget nyt at
              opdage, og det giver os glæden ved at lave mad med det bedste, vi
              kan få fat i.
            </p>
          </div>

          <div className="about-us__stats">
            {stats.map((item) => (
              <article key={item.label} className="about-us__stat">
                <p className="about-us__stat-value">{item.value}</p>
                <p className="about-us__stat-label">{item.label}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
