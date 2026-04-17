import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="max-w-[1120px] mx-auto px-4 py-10 lg:px-8 lg:py-16">
      <h1 className="m-0 mb-3 font-[family-name:var(--font-heading)] text-[clamp(1.9rem,4vw,3.1rem)] leading-[1.1]">
        404 - Siden findes ikke
      </h1>
      <p className="m-0 text-[var(--color-muted)] font-[family-name:var(--font-body)] max-w-[70ch]">
        Placeholder 404-side for ukendte routes.
      </p>
      <Link to="/" className="inline-block mt-4 text-[var(--color-accent)] underline">
        Gå til forsiden
      </Link>
    </section>
  );
};

export default NotFound;
