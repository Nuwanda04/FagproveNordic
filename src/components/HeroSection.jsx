import { Link } from "react-router-dom";

const HeroSection = ({
  backgroundImage,
  eyebrow = "VELKOMST",
  title,
  description,
  primaryAction,
  secondaryAction,
}) => {
  const renderAction = (action, variant) => {
    if (!action) return null;

    const className = `hero-section__button hero-section__button--${variant}`;

    if (action.to) {
      return (
        <Link to={action.to} className={className}>
          {action.label}
        </Link>
      );
    }

    return (
      <button type="button" className={className} onClick={action.onClick}>
        {action.label}
      </button>
    );
  };

  return (
    <section
      className="hero-section"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="hero-section__inner">
        <div className="hero-section__content">
          <div className="hero-section__eyebrow-wrap">
            <span className="hero-section__eyebrow-line" />
            <p className="hero-section__eyebrow">{eyebrow}</p>
          </div>

          <h1 className="hero-section__title">{title}</h1>
          <p className="hero-section__description">{description}</p>

          {(primaryAction || secondaryAction) && (
            <div className="hero-section__actions">
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
