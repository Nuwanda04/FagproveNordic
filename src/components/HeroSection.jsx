import { Link } from "react-router-dom";

/**
 * HeroSection komponenten viser en dominerende top-sektion med et baggrundsbillede,
 * en overskrift (title), en beskrivelse og valgfrie knapper (actions).
 * Bruges oftest i toppen af siderne (fx Forside og Booking).
 */
const HeroSection = ({
  backgroundImage,
  eyebrow = "VELKOMST",
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = "default",
}) => {
  // Hjælpefunktion til at gengive enten et Link (hvis 'to' findes)
  // eller en almindelig knap (button), afhængigt af den givne handling.
  const renderAction = (action, variant) => {
    if (!action) return null;

    const base =
      "inline-flex items-center justify-center font-[family-name:var(--font-body)] font-medium cursor-pointer min-h-[36px] text-xs px-4 py-2 lg:min-h-[42px] lg:text-sm lg:px-5";
    const styles =
      variant === "primary"
        ? `${base} bg-[#7c632f] text-white border-0 shadow-[0_4px_4px_rgba(0,0,0,0.25)]`
        : `${base} bg-transparent text-white border border-white shadow-[0_4px_4px_rgba(0,0,0,0.25)]`;

    if (action.to) {
      return (
        <Link to={action.to} className={styles}>
          {action.label}
        </Link>
      );
    }

    return (
      <button type="button" className={styles} onClick={action.onClick}>
        {action.label}
      </button>
    );
  };

  const isMenu = variant === "menu";

  const outerClasses = `w-full bg-cover bg-center bg-no-repeat relative ${
    isMenu ? "min-h-[273px] lg:min-h-[486px]" : "min-h-[420px] lg:min-h-[700px]"
  }`;

  const innerClasses = `w-full max-w-[1240px] mx-auto flex flex-col justify-end relative z-10 ${
    isMenu
      ? "min-h-[273px] lg:min-h-[486px] px-8 pt-11 pb-7 lg:px-13 lg:pt-[78px] lg:pb-[58px]"
      : "min-h-[420px] lg:min-h-[700px] px-6 pt-[100px] pb-10 lg:px-[46px] lg:pt-[184px] lg:pb-[54px]"
  }`;

  const contentClasses = `w-full ${
    isMenu
      ? "max-w-[323px] lg:max-w-[1136px]"
      : "max-w-[300px] lg:max-w-[620px]"
  }`;

  const titleClasses = `m-0 font-[family-name:var(--font-heading)] font-light text-white ${
    isMenu
      ? "mt-3.5 lg:mt-2.5 text-[40px] lg:text-[clamp(3.2rem,5vw,66px)] leading-[1.08] lg:leading-none py-0 lg:py-3"
      : "mt-3 text-[clamp(1.8rem,5vw,3rem)] lg:text-[clamp(3.1rem,7vw,5.2rem)] leading-[1.05] max-w-[420px]"
  }`;

  const descClasses = `m-0 text-white/80 font-[family-name:var(--font-body)] ${
    isMenu
      ? "mt-3.5 lg:mt-2.5 text-[11px] lg:text-2xl leading-relaxed lg:leading-[40px] max-w-[816px]"
      : "mt-3 lg:mt-4 text-xs lg:text-base leading-relaxed max-w-[560px]"
  }`;

  return (
    <section
      className={outerClasses}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={innerClasses}>
        <div className={contentClasses}>
          <div className="flex items-center gap-2">
            <span className="block w-6 lg:w-[38px] h-px bg-[#866727]" />
            <p className="m-0 text-[#866727] font-[family-name:var(--font-body)] text-[10px] lg:text-[13px] font-medium tracking-[0.14em] uppercase">
              {eyebrow}
            </p>
          </div>

          <h1 className={titleClasses}>{title}</h1>
          <p className={descClasses}>{description}</p>

          {(primaryAction || secondaryAction) && (
            <div className="mt-4 lg:mt-5.5 flex flex-wrap gap-2.5 lg:gap-3.5">
              {renderAction(primaryAction, "primary")}
              {renderAction(secondaryAction, "secondary")}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
