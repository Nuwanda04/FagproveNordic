import { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiUrl } from "../services/api";
import {
  clearAuth,
  getStoredToken,
  isAdminUser,
  storeAuth,
} from "../services/auth";

/**
 * Login komponenten håndterer systemets adgangskontrol.
 * Styrer auth-flowet, herunder afsendelse af adgangskode/email og asynkron fejlhåndtering.
 */
const Login = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Hvis brugeren i forvejen er logget ind springes login over
    const token = getStoredToken();
    if (!token) return;

    const payload = storeAuth(token);
    if (isAdminUser(payload)) {
      navigate("/backoffice", { replace: true });
    }
  }, [navigate]);

  // Tilslutter de kontrollerede React-inputs dynamisk til vores state
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  // Afsender formular-data til backend for godkendelse.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

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
      toast.error(requestError.message || "Der opstod en fejl. Prøv igen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#f7f5f2] flex items-center justify-center px-4 py-16 lg:pt-40 lg:pb-28">
      <div className="w-full max-w-[702px]">
        {/* Header */}
        <div className="mb-8">
          <div className="max-w-[614px] mx-auto lg:mx-0">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[#1a1a1a] font-[family-name:var(--font-body)] text-sm mb-4"
            >
              <FiArrowLeft aria-hidden="true" />
              Tilbage til forsiden
            </Link>

            <h1 className="m-0 font-[family-name:var(--font-heading)] text-[40px] lg:text-[64px] font-light leading-none text-[#1a1a1a]">
              Log ind
            </h1>
            <p className="m-0 mt-2 text-[#3a3a3a] font-[family-name:var(--font-body)] text-base lg:text-lg">
              Adgang forbeholdt personale og administratorer
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid gap-5 lg:gap-8">
          <label className="grid gap-2">
            <span className="text-[#676767] font-[family-name:var(--font-body)] text-[15px] tracking-[0.02em] uppercase">
              E-MAIL
            </span>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="Jens Jensen"
              required
              className="min-h-[48px] border border-[rgba(145,107,28,0.45)] rounded-md bg-white text-[#4a4a4a] font-[family-name:var(--font-body)] text-base px-3"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-[#676767] font-[family-name:var(--font-body)] text-[15px] tracking-[0.02em] uppercase">
              ADGANGSKODE
            </span>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="********"
              required
              className="min-h-[48px] border border-[rgba(145,107,28,0.45)] rounded-md bg-white text-[#4a4a4a] font-[family-name:var(--font-body)] text-base px-3"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="min-h-[56px] border-0 bg-[#1a1a1a] text-white font-[family-name:var(--font-body)] text-2xl lg:text-[32px] font-medium cursor-pointer disabled:opacity-70"
          >
            {loading ? "LOGGER IND..." : "LOG IND"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
