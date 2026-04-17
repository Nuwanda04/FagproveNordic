import { Link } from "react-router-dom";
import reservationBg from "../assets/restaurant2.png";

const ReservationSection = () => {
  return (
    <section>
      <div
        className="w-full min-h-[499px] lg:min-h-[599px] px-6 py-10 lg:px-12 flex flex-col items-center justify-center gap-4.5 text-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${reservationBg})` }}
      >
        <p className="m-0 text-white font-[family-name:var(--font-body)] text-[15px] font-semibold tracking-[0.14em] uppercase">
          RESERVATIONER
        </p>

        <h2 className="m-0 text-white font-[family-name:var(--font-heading)] text-[44px] font-light leading-none">
          Book dit bord hos Nordic Table
        </h2>

        <p className="m-0 text-white/85 font-[family-name:var(--font-body)] text-base leading-relaxed max-w-[50ch]">
          Vi åbner vores døre for dig og dine, og giver jer en aften I aldrig
          glemmer. Book dit bord i dag - det er nemt og hurtigt.
        </p>

        <Link
          to="/booking"
          className="mt-2 w-[162px] min-h-[52px] bg-[#7c632f] text-[#f7f5f2] font-[family-name:var(--font-body)] text-lg font-medium flex items-center justify-center px-2.5 py-1.5 shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
        >
          BOOK BORD NU
        </Link>
      </div>
    </section>
  );
};

export default ReservationSection;
