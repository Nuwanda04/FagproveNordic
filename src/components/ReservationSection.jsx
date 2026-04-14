import { Link } from "react-router-dom";

const ReservationSection = () => {
  return (
    <section className="reservation-teaser">
      <div className="reservation-teaser__inner">
        <p className="reservation-teaser__eyebrow">RESERVATIONER</p>

        <h2 className="reservation-teaser__title">
          Book dit bord hos Nordic Table
        </h2>

        <p className="reservation-teaser__description">
          Vi åbner vores døre for dig og dine, og giver jer en aften I aldrig
          glemmer. Book dit bord i dag - det er nemt og hurtigt.
        </p>

        <Link to="/booking" className="reservation-teaser__button">
          BOOK BORD NU
        </Link>
      </div>
    </section>
  );
};

export default ReservationSection;
