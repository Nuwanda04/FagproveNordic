import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="page">
      <h1>404 - Siden findes ikke</h1>
      <p>Placeholder 404-side for ukendte routes.</p>
      <Link to="/">Gå til forsiden</Link>
    </section>
  );
};

export default NotFound;
