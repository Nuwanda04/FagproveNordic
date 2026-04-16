import { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../services/api";
import {
  clearAuth,
  getStoredToken,
  isAdminUser,
  storeAuth,
} from "../services/auth";

const Login = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getStoredToken();
    if (!token) return;

    const payload = storeAuth(token);
    if (isAdminUser(payload)) {
      navigate("/backoffice", { replace: true });
    }
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(apiUrl("auth/signin"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const json = await response.json();

      if (!response.ok || json?.status !== "ok" || !json?.data?.token) {
        throw new Error("Forkert e-mail eller adgangskode.");
      }

      const payload = storeAuth(json.data.token);
      if (!isAdminUser(payload)) {
        clearAuth();
        throw new Error("Kun admin har adgang til backoffice.");
      }

      navigate("/backoffice", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Der opstod en fejl. Prøv igen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
      <div className="login-panel">
        <div className="login-panel__header">
          <div className="login-panel__header-inner">
            <Link to="/" className="login-panel__back-link">
              <FiArrowLeft aria-hidden="true" />
              Tilbage til forsiden
            </Link>

            <h1 className="login-panel__title">Log ind</h1>
            <p className="login-panel__subtitle">
              Adgang forbeholdt personale og administratorer
            </p>
          </div>
        </div>

        <div className="login-panel__body">
          <form onSubmit={handleSubmit} className="login-panel__form">
            {error && <p className="login-panel__error">{error}</p>}

            <label className="login-panel__field">
              <span className="login-panel__label">E-MAIL</span>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="Jens Jensen"
                required
              />
            </label>

            <label className="login-panel__field">
              <span className="login-panel__label">ADGANGSKODE</span>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="********"
                required
              />
            </label>

            <button type="submit" disabled={loading} className="login-panel__submit">
              {loading ? "LOGGER IND..." : "LOG IND"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
