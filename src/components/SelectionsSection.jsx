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
        setDishes(mapped.length > 0 ? mapped : fallbackSelections);
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
    <section className="bg-[#f7f5f2] min-h-[500px] lg:min-h-[736px] px-4 py-10 lg:px-[30px] lg:py-[60px]">
      <div className="max-w-[1240px] mx-auto">
        <header className="text-center mb-8 lg:mb-12 flex flex-col items-center gap-3">
          <p className="m-0 text-[#866727] font-[family-name:var(--font-body)] text-sm lg:text-base font-semibold tracking-[0.14em] uppercase">
            UDVALGTE RETTER
          </p>
          <h2 className="m-0 font-[family-name:var(--font-heading)] text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.08] text-[#1a1a1a]">
            Vores signaturretter
          </h2>
          <p className="m-0 text-[#5f5f5f] font-[family-name:var(--font-body)] text-base lg:text-lg leading-relaxed max-w-[50ch]">
            Hver af vores signaturretter er omhyggeligt sammensat af sæsonens
            bedste nordiske råvarer.
          </p>
        </header>

        <div className="flex flex-wrap justify-center gap-4 lg:flex-nowrap">
          {selections.slice(0, 3).map((dish) => (
            <article
              key={dish.id}
              className="w-full max-w-[344px] bg-white rounded-xl overflow-hidden shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
            >
              <div className="relative h-[200px] lg:h-[250px]">
                <img
                  src={dish.image || salmonImg}
                  alt={dish.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-[#7c632f] text-white font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-sm">
                  SIGNATUR
                </span>
              </div>
              <div className="p-4 flex flex-col gap-1.5">
                <p className="m-0 text-[#866727] font-[family-name:var(--font-body)] text-[10px] font-bold tracking-[0.12em] uppercase">
                  {dish.category}
                </p>
                <h3 className="m-0 font-[family-name:var(--font-heading)] text-[clamp(1.4rem,3vw,2.2rem)] font-light leading-[1.08] text-[#1a1a1a]">
                  {dish.title}
                </h3>
                <p className="m-0 text-[#5f5f5f] font-[family-name:var(--font-body)] text-xs leading-relaxed">
                  {dish.description}
                </p>
                <p className="m-0 mt-1 text-[#866727] font-[family-name:var(--font-body)] text-sm font-semibold text-center">
                  {dish.price} kr.
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/menu"
            className="w-full max-w-[344px] min-h-[60px] lg:min-h-[76px] bg-[#7c632f] text-[#f7f5f2] font-[family-name:var(--font-body)] text-xl lg:text-[26px] font-medium flex items-center justify-center shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
          >
            SE HELE MENUEN
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SelectionsSection;
