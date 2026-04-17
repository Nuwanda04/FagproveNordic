import { useMemo, useState } from "react";
import { FiClock, FiPhone, FiUsers } from "react-icons/fi";
import { toast } from "react-toastify";
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

// Mulige tidsintervaller der kan vælges for reservationer
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

/**
 * Booking komponenten håndterer bordreservationer for gæster.
 * Viser relevant information om åbningstider m.m., og indeholder
 * en fuldt valideret formular som indsender booking-anmodningen til vores backend.
 */
const Booking = () => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const guestOptions = useMemo(
    () => Array.from({ length: 12 }, (_, index) => index + 1),
    [],
  );

  // Validerer reservationsformularens felter.
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
  };

  // Eksekverer afsendelsen af booking-data til serveren
  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      toast.error("Ret venligst fejlene i formularen.");
      return;
    }

    const startAt = new Date(`${values.date}T${values.time}:00`);
    if (Number.isNaN(startAt.getTime())) {
      toast.error("Dato og tidspunkt kunne ikke forstås.");
      return;
    }

    try {
      setIsSubmitting(true);

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
      toast.success("Tak! Din reservation er modtaget. Vi bekræfter den hurtigst muligt.");
    } catch (error) {
      toast.error(error.message || "Der opstod en fejl. Prøv igen om lidt.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `min-h-[44px] border rounded-[5px] bg-white text-[#4a4a4a] font-[family-name:var(--font-body)] text-sm px-2.5 ${
      errors[field] ? "border-[#b33f3f]" : "border-[rgba(145,107,28,0.45)]"
    }`;

  return (
    <>
      <HeroSection
        backgroundImage={headerBg}
        eyebrow="RESERVATIONER"
        title="Book dit bord"
        description="Vi glæder os til at modtage dig. Book dit bord nedenfor, og vi sørger for resten."
      />

      <section className="px-4 py-6 lg:px-[50px] lg:pt-10 lg:pb-[78px]">
        <div className="max-w-[1240px] mx-auto grid lg:grid-cols-[minmax(0,1fr)_599px] gap-6 lg:gap-6.5 items-start">
          {/* Info side */}
          <div className="flex flex-col gap-3 lg:w-[592px]">
            <p className="m-0 text-[#866727] font-[family-name:var(--font-body)] text-sm lg:text-xl font-semibold tracking-[0.14em] uppercase">
              GÆSTFRIHED
            </p>
            <h2 className="m-0 font-[family-name:var(--font-heading)] text-[26px] lg:text-5xl font-light leading-[1.15] text-[#1a1a1a]">
              Velkomst fra højre ben
            </h2>
            <span className="block w-[84px] border-t-2 border-[#b39659]" aria-hidden="true" />
            <p className="m-0 text-[#5f5f5f] font-[family-name:var(--font-body)] text-sm leading-relaxed max-w-[48ch]">
              Vi ønsker at give dig og dine gæster den bedst mulige oplevelse.
              Her er hvad du skal vide inden dit besøg.
            </p>

            <div className="grid gap-3.5">
              {practicalCards.map((card) => {
                const Icon = card.icon;
                return (
                  <article
                    key={card.title}
                    className="min-h-[96px] border-l-[3px] border-[#916b1c] rounded-[10px] bg-[#f2ede5] px-5 py-4 grid grid-cols-[32px_1fr] gap-4"
                  >
                    <Icon className="text-[#916b1c] w-7 h-7 mt-0.5" aria-hidden="true" />
                    <div>
                      <h3 className="m-0 font-[family-name:var(--font-heading)] text-2xl lg:text-[28px] font-light leading-[1.1] text-[#1a1a1a]">
                        {card.title}
                      </h3>
                      <p className="m-0 mt-2 text-[#2f2f2f] font-[family-name:var(--font-body)] text-sm lg:text-[15px] leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form
            className="bg-white border border-[rgba(145,107,28,0.44)] rounded-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] px-2.5 py-5 grid gap-2.5"
            onSubmit={handleSubmit}
            noValidate
          >
            <h2 className="m-0 mb-1.5 font-[family-name:var(--font-heading)] text-[22px] font-light text-[#1a1a1a]">
              Din reservation
            </h2>

            <label className="grid gap-1.5">
              <span className="text-[#676767] font-[family-name:var(--font-body)] text-[15px] tracking-[0.02em]">FULDE NAVN *</span>
              <input type="text" name="name" value={values.name} onChange={handleChange} placeholder="Jens Jensen" className={inputClass("name")} />
              {errors.name && <span className="text-[#a63131] font-[family-name:var(--font-body)] text-xs">{errors.name}</span>}
            </label>

            <label className="grid gap-1.5">
              <span className="text-[#676767] font-[family-name:var(--font-body)] text-[15px] tracking-[0.02em]">EMAIL *</span>
              <input type="email" name="email" value={values.email} onChange={handleChange} placeholder="jens@example.dk" className={inputClass("email")} />
              {errors.email && <span className="text-[#a63131] font-[family-name:var(--font-body)] text-xs">{errors.email}</span>}
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1.5">
                <span className="text-[#676767] font-[family-name:var(--font-body)] text-[15px] tracking-[0.02em]">DATO *</span>
                <input type="date" name="date" value={values.date} onChange={handleChange} className={inputClass("date")} />
                {errors.date && <span className="text-[#a63131] font-[family-name:var(--font-body)] text-xs">{errors.date}</span>}
              </label>

              <label className="grid gap-1.5">
                <span className="text-[#676767] font-[family-name:var(--font-body)] text-[15px] tracking-[0.02em]">TIDSPUNKT *</span>
                <select name="time" value={values.time} onChange={handleChange} className={inputClass("time")}>
                  <option value="">Vælg tidspunkt</option>
                  {timeSlots.map((slot) => (
                    <option key={slot.value} value={slot.value}>{slot.label}</option>
                  ))}
                </select>
                {errors.time && <span className="text-[#a63131] font-[family-name:var(--font-body)] text-xs">{errors.time}</span>}
              </label>
            </div>

            <label className="grid gap-1.5">
              <span className="text-[#676767] font-[family-name:var(--font-body)] text-[15px] tracking-[0.02em]">ANTAL GÆSTER *</span>
              <select name="guests" value={values.guests} onChange={handleChange} className={inputClass("guests")}>
                <option value="">Vælg antal gæster</option>
                {guestOptions.map((guestCount) => (
                  <option key={guestCount} value={guestCount}>{guestCount}</option>
                ))}
              </select>
              {errors.guests && <span className="text-[#a63131] font-[family-name:var(--font-body)] text-xs">{errors.guests}</span>}
            </label>

            <button
              type="submit"
              className="mt-1 min-h-[52px] border-0 bg-[#7c632f] text-[#f7f5f2] font-[family-name:var(--font-body)] text-[30px] font-medium shadow-[0_4px_4px_rgba(0,0,0,0.25)] cursor-pointer disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? "SENDER..." : "BOOK BORD"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Booking;
