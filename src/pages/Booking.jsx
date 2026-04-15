import { useMemo, useState } from "react";
import { FiClock, FiPhone, FiUsers } from "react-icons/fi";
import headerBg from "../assets/headerbg.png";
import HeroSection from "../components/HeroSection";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:3042"
).replace(/\/+$/, "");

const initialValues = {
  name: "",
  email: "",
  date: "",
  time: "",
  guests: "",
};

const emailRegex = /^\S+@\S+\.\S+$/;

const timeSlots = [
  { value: "12:00", label: "12:00" },
  { value: "13:00", label: "13:00" },
  { value: "17:00", label: "17:00" },
  { value: "18:00", label: "18:00" },
  { value: "19:00", label: "19:00" },
  { value: "20:00", label: "20:00" },
  { value: "21:00", label: "21:00" },
];

const practicalCards = [
  {
    title: "Bordstørrelse",
    description:
      "Vi tager imod selskaber fra 1 til 12 personer. Kontakt os direkte for større selskaber.",
    icon: FiUsers,
  },
  {
    title: "Åbningstider",
    description:
      "Tirsdag-torsdag kl. 17-22. Fredag-lørdag kl. 17-23. Søndag kl. 12-20. Mandag lukket.",
    icon: FiClock,
  },
  {
    title: "Kontakt",
    description:
      "Ring på +45 12 34 56 78 eller skriv til info@nordictable.dk ved spørgsmål.",
    icon: FiPhone,
  },
];

const Booking = () => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitState, setSubmitState] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const guestOptions = useMemo(
    () => Array.from({ length: 12 }, (_, index) => index + 1),
    [],
  );

  const validate = () => {
    const nextErrors = {};

    if (!values.name.trim() || values.name.trim().length < 2) {
      nextErrors.name = "Skriv venligst et gyldigt navn.";
    }

    if (!emailRegex.test(values.email.trim())) {
      nextErrors.email = "Skriv venligst en gyldig email.";
    }

    if (!values.date) {
      nextErrors.date = "Vælg venligst en dato.";
    }

    if (!values.time) {
      nextErrors.time = "Vælg venligst et tidspunkt.";
    }

    const guests = Number(values.guests);
    if (!Number.isInteger(guests) || guests < 1 || guests > 12) {
      nextErrors.guests = "Antal gæster skal være mellem 1 og 12.";
    }

    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSubmitState({ type: "", message: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setSubmitState({
        type: "error",
        message: "Ret venligst fejlene i formularen.",
      });
      return;
    }

    const startAt = new Date(`${values.date}T${values.time}:00`);
    if (Number.isNaN(startAt.getTime())) {
      setSubmitState({
        type: "error",
        message: "Dato og tidspunkt kunne ikke forstås.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitState({ type: "", message: "" });

      const response = await fetch(`${API_BASE_URL}/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          startAt: startAt.toISOString(),
          numberOfGuests: Number(values.guests),
        }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || payload?.status === "error") {
        const message =
          payload?.message || "Kunne ikke gennemføre reservationen. Prøv igen.";
        throw new Error(message);
      }

      setValues(initialValues);
      setErrors({});
      setSubmitState({
        type: "success",
        message:
          "Tak! Din reservation er modtaget. Vi bekræfter den hurtigst muligt.",
      });
    } catch (error) {
      setSubmitState({
        type: "error",
        message: error.message || "Der opstod en fejl. Prøv igen om lidt.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <HeroSection
        backgroundImage={headerBg}
        eyebrow="RESERVATIONER"
        title="Book dit bord"
        description="Vi glæder os til at modtage dig. Book dit bord nedenfor, og vi sørger for resten."
      />

      <section className="booking-page">
        <div className="booking-page__inner">
          <div className="booking-page__info">
            <p className="booking-page__eyebrow">GÆSTFRIHED</p>
            <h2 className="booking-page__title">Velkomst fra højre ben</h2>
            <span className="booking-page__line" aria-hidden="true" />
            <p className="booking-page__intro">
              Vi ønsker at give dig og dine gæster den bedst mulige oplevelse.
              Her er hvad du skal vide inden dit besøg.
            </p>

            <div className="booking-page__cards">
              {practicalCards.map((card) => {
                const Icon = card.icon;
                return (
                  <article key={card.title} className="booking-page__card">
                    <Icon
                      className="booking-page__card-icon"
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="booking-page__card-title">{card.title}</h3>
                      <p className="booking-page__card-description">
                        {card.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <form className="booking-form" onSubmit={handleSubmit} noValidate>
            <h2 className="booking-form__title">Din reservation</h2>

            <label className="booking-form__field">
              <span className="booking-form__label">FULDE NAVN *</span>
              <input
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="Jens Jensen"
                className={errors.name ? "is-error" : ""}
              />
              {errors.name && (
                <span className="booking-form__error">{errors.name}</span>
              )}
            </label>

            <label className="booking-form__field">
              <span className="booking-form__label">EMAIL *</span>
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                placeholder="jens@example.dk"
                className={errors.email ? "is-error" : ""}
              />
              {errors.email && (
                <span className="booking-form__error">{errors.email}</span>
              )}
            </label>

            <div className="booking-form__row">
              <label className="booking-form__field">
                <span className="booking-form__label">DATO *</span>
                <input
                  type="date"
                  name="date"
                  value={values.date}
                  onChange={handleChange}
                  className={errors.date ? "is-error" : ""}
                />
                {errors.date && (
                  <span className="booking-form__error">{errors.date}</span>
                )}
              </label>

              <label className="booking-form__field">
                <span className="booking-form__label">TIDSPUNKT *</span>
                <select
                  name="time"
                  value={values.time}
                  onChange={handleChange}
                  className={errors.time ? "is-error" : ""}
                >
                  <option value="">Vælg tidspunkt</option>
                  {timeSlots.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>
                {errors.time && (
                  <span className="booking-form__error">{errors.time}</span>
                )}
              </label>
            </div>

            <label className="booking-form__field">
              <span className="booking-form__label">ANTAL GÆSTER *</span>
              <select
                name="guests"
                value={values.guests}
                onChange={handleChange}
                className={errors.guests ? "is-error" : ""}
              >
                <option value="">Vælg antal gæster</option>
                {guestOptions.map((guestCount) => (
                  <option key={guestCount} value={guestCount}>
                    {guestCount}
                  </option>
                ))}
              </select>
              {errors.guests && (
                <span className="booking-form__error">{errors.guests}</span>
              )}
            </label>

            <button
              type="submit"
              className="booking-form__submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "SENDER..." : "BOOK BORD"}
            </button>

            {submitState.message && (
              <p
                className={`booking-form__message ${
                  submitState.type === "success"
                    ? "booking-form__message--success"
                    : "booking-form__message--error"
                }`}
              >
                {submitState.message}
              </p>
            )}
          </form>
        </div>
      </section>
    </>
  );
};

export default Booking;
