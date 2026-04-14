import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import codImg from "../assets/cod.png";
import porkImg from "../assets/pork.png";
import salmonImg from "../assets/salmon.png";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:3042"
).replace(/\/+$/, "");

const fallbackSelections = [
  {
    id: "fallback-1",
    category: "FORRET",
    title: "Røget laks",
    description:
      "Let røget laks serveret med rygeost, sprød rug og friske urter.",
    price: 149,
    image: salmonImg,
  },
  {
    id: "fallback-2",
    category: "HOVEDRET",
    title: "Nordisk torsk",
    description: "Smørstegt torsk med kartoffelmos, urter og frisk citron.",
    price: 245,
    image: codImg,
  },
  {
    id: "fallback-3",
    category: "HOVEDRET",
    title: "Nordisk andebryst",
    description:
      "Sprødstegt andebryst med sæsonens grønt, kartofler og rødvinssauce.",
    price: 295,
    image: porkImg,
  },
];

const normalizeImage = (value) => {
  if (!value) return "";
  const trimmed = String(value).trim();
  if (!trimmed) return "";

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace("http://localhost", "http://127.0.0.1");
  }

  if (trimmed.startsWith("/")) {
    return `${API_BASE_URL}${trimmed}`;
  }

  return `${API_BASE_URL}/${trimmed.replace(/^\/+/, "")}`;
};

const toCategory = (dish) => {
  const raw = String(dish?.category || dish?.course || "").toLowerCase();

  if (raw.includes("forret") || raw.includes("starter")) return "FORRET";
  if (raw.includes("dessert")) return "DESSERT";
  return "HOVEDRET";
};

const toPrice = (dish) => {
  const number = Number(dish?.price ?? dish?.cost ?? dish?.amount);
  return Number.isFinite(number) ? Math.round(number) : 0;
};

const isSignatureDish = (dish) => {
  const flag = dish?.isSignature;
  if (typeof flag === "boolean") return flag;
  if (typeof flag === "number") return flag === 1;
  if (typeof flag === "string") {
    const normalized = flag.trim().toLowerCase();
    return normalized === "true" || normalized === "1" || normalized === "yes";
  }
  return false;
};

const SelectionsSection = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSignatureDishes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/dishes`);
        if (!response.ok) throw new Error("Kunne ikke hente retter");

        const payload = await response.json();
        const items = Array.isArray(payload?.data) ? payload.data : [];

        const mapped = items
          .filter(isSignatureDish)
          .slice(0, 3)
          .map((dish, index) => ({
            id: dish?._id || dish?.id || `dish-${index}`,
            category: toCategory(dish),
            title: String(dish?.name || dish?.title || "Ret").trim(),
            description: String(dish?.description || dish?.teaser || "").trim(),
            price: toPrice(dish),
            image: normalizeImage(dish?.image || dish?.picture),
          }));

        if (!mounted) return;
        setDishes(mapped.length === 3 ? mapped : fallbackSelections);
      } catch {
        if (mounted) setDishes(fallbackSelections);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadSignatureDishes();

    return () => {
      mounted = false;
    };
  }, []);

  const selections = useMemo(() => {
    if (loading) return fallbackSelections;
    return dishes.length ? dishes : fallbackSelections;
  }, [dishes, loading]);

  return (
    <section className="selections">
      <div className="selections__inner">
        <header className="selections__header">
          <p className="selections__eyebrow">UDVALGTE RETTER</p>
          <h2 className="selections__title">Vores signaturretter</h2>
          <p className="selections__intro">
            Hver af vores signaturretter er omhyggeligt sammensat af sæsonens
            bedste nordiske råvarer.
          </p>
        </header>

        <div className="selections__cards">
          {selections.slice(0, 3).map((dish) => (
            <article key={dish.id} className="selections__card">
              <div className="selections__card-media">
                <img
                  src={dish.image || salmonImg}
                  alt={dish.title}
                  className="selections__card-image"
                />
                <span className="selections__card-badge">SIGNATUR</span>
              </div>
              <div className="selections__card-body">
                <p className="selections__card-category">{dish.category}</p>
                <h3 className="selections__card-title">{dish.title}</h3>
                <p className="selections__card-description">
                  {dish.description}
                </p>
                <p className="selections__card-price">{dish.price} kr.</p>
              </div>
            </article>
          ))}
        </div>

        <div className="selections__cta-wrap">
          <Link to="/menu" className="selections__cta">
            SE HELE MENUEN
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SelectionsSection;
