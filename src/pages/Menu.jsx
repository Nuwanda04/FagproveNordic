import { useEffect, useMemo, useState } from "react";
import appetizersImg from "../assets/appetizers.png";
import dessertsImg from "../assets/desserts.png";
import menuBg from "../assets/headerbg.png";
import mainCoursesImg from "../assets/mainCourses.png";
import HeroSection from "../components/HeroSection";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:3042"
).replace(/\/+$/, "");

const categoryConfig = {
  forret: { key: "forret", label: "Forretter", image: appetizersImg },
  hovedret: { key: "hovedret", label: "Hovedretter", image: mainCoursesImg },
  dessert: { key: "dessert", label: "Desserter", image: dessertsImg },
};

const categoryOrder = ["forret", "hovedret", "dessert"];

// Hjælpefunktion til at sikre at kategorien passer til forret, hovedret eller dessert.
const normalizeCategory = (value) => {
  const raw = String(value || "")
    .trim()
    .toLowerCase();
  if (
    raw.includes("forret") ||
    raw.includes("starter") ||
    raw.includes("appet")
  )
    return "forret";
  if (raw.includes("dessert")) return "dessert";
  return "hovedret";
};

// Hjælpefunktion for at rense og normalisere oplysninger om en ret
const normalizeDish = (dish, index) => ({
  id: dish?._id || dish?.id || `dish-${index}`,
  name: String(dish?.name || dish?.title || "Ret").trim(),
  description: String(dish?.description || dish?.teaser || "").trim(),
  price: Number.isFinite(Number(dish?.price ?? dish?.cost ?? dish?.amount))
    ? Number(dish?.price ?? dish?.cost ?? dish?.amount)
    : 0,
  category: normalizeCategory(dish?.category || dish?.course),
});

/**
 * Menu komponenten har ansvaret for at vise restaurationsmenuen.
 * Inkluderer funktionalitet til live-søgning, filtrering efter kategori,
 * og sortering på tværs af retter, der hentes fra vores API.
 */
const Menu = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    // Flag til at forhindre state-opdateringer, hvis komponenten afmonteres
    let mounted = true;

    const loadDishes = async () => {
      try {
        setError("");
        const response = await fetch(`${API_BASE_URL}/dishes`);
        if (!response.ok) throw new Error("Kunne ikke hente menuen");

        const payload = await response.json();
        const list = Array.isArray(payload?.data) ? payload.data : [];
        if (!mounted) return;

        setDishes(list.map(normalizeDish));
      } catch {
        if (mounted) {
          setError(
            "Menuen kunne ikke hentes lige nu. Prøv igen om et øjeblik.",
          );
          setDishes([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDishes();

    return () => {
      mounted = false;
    };
  }, []);

  // useMemo bruges til effektivt at genberegne listen af synlige retter
  const visibleDishes = useMemo(() => {
    let list = [...dishes];

    if (activeCategory !== "all") {
      list = list.filter((dish) => dish.category === activeCategory);
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      list = list.filter((dish) => dish.name.toLowerCase().includes(query));
    }

    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    }

    if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name, "da"));
    }

    return list;
  }, [activeCategory, dishes, searchQuery, sortBy]);

  const groupedDishes = useMemo(() => {
    const groups = {
      forret: [],
      hovedret: [],
      dessert: [],
    };

    visibleDishes.forEach((dish) => {
      groups[dish.category].push(dish);
    });

    return groups;
  }, [visibleDishes]);

  const categoryBtnClass = (cat) =>
    `min-h-[40px] lg:min-h-[48px] px-4 lg:px-6 border rounded-md font-[family-name:var(--font-body)] text-sm lg:text-base cursor-pointer ${
      activeCategory === cat
        ? "bg-[#7c632f] text-white border-[#7c632f]"
        : "bg-[#fbfaf7] text-[#4a4a4a] border-[rgba(145,107,28,0.45)]"
    }`;

  return (
    <>
      {/* Menu Hero */}
      <HeroSection
        variant="menu"
        backgroundImage={menuBg}
        eyebrow="VORES MENU"
        title="Smagsoplevelser fra det nordiske køkken"
        description="Alt på vores menu er tilberedt af sæsonens friskeste råvarer. Vi arbejder tæt med lokale producenter for at sikre den bedste kvalitet."
      />

      {/* Menu Controls & Content */}
      <section className="px-4.5 py-5 pb-12 lg:px-12 lg:pt-[54px] lg:pb-[92px]">
        <div className="grid lg:grid-cols-[1.2fr_auto_auto] items-center gap-3 lg:gap-3.5 mb-6.5 lg:mb-14.5">
          <input
            type="search"
            className="min-h-[40px] lg:min-h-[48px] border border-[rgba(145,107,28,0.45)] rounded-md bg-[#fbfaf7] text-[#4a4a4a] font-[family-name:var(--font-body)] text-sm lg:text-base px-3 lg:px-5"
            placeholder="Søg på titel"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            aria-label="Søg retter"
          />

          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrer kategori">
            <button type="button" className={categoryBtnClass("all")} onClick={() => setActiveCategory("all")}>Alle</button>
            <button type="button" className={categoryBtnClass("forret")} onClick={() => setActiveCategory("forret")}>Forret</button>
            <button type="button" className={categoryBtnClass("hovedret")} onClick={() => setActiveCategory("hovedret")}>Hovedret</button>
            <button type="button" className={categoryBtnClass("dessert")} onClick={() => setActiveCategory("dessert")}>Dessert</button>
          </div>

          <select
            className="min-h-[40px] lg:min-h-[48px] min-w-[200px] lg:min-w-[240px] border border-[rgba(145,107,28,0.45)] rounded-md bg-[#fbfaf7] text-[#4a4a4a] font-[family-name:var(--font-body)] text-sm lg:text-base px-3 lg:px-4.5"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            aria-label="Sorter retter"
          >
            <option value="default">Standard sortering</option>
            <option value="price-asc">Pris: lavest først</option>
            <option value="price-desc">Pris: højest først</option>
            <option value="name">Titel: A til Å</option>
          </select>
        </div>

        {loading && (
          <p className="text-[#5f5f5f] font-[family-name:var(--font-body)]">Henter menuen...</p>
        )}
        {!loading && error && (
          <p className="text-[#a63131] font-[family-name:var(--font-body)]">{error}</p>
        )}

        {!loading && !error && visibleDishes.length === 0 && (
          <p className="text-[#5f5f5f] font-[family-name:var(--font-body)]">Ingen retter matcher dit filter.</p>
        )}

        {!loading && !error && visibleDishes.length > 0 && (
          <div className="flex flex-col gap-10 lg:gap-24">
            {categoryOrder.map((categoryKey) => {
              const group = groupedDishes[categoryKey];
              if (!group.length) return null;

              return (
                <section key={categoryKey}>
                  <header className="flex items-center gap-3 lg:gap-5.5 pb-3 lg:pb-5.5 border-b border-[rgba(145,107,28,0.4)]">
                    <img
                      src={categoryConfig[categoryKey].image}
                      alt={categoryConfig[categoryKey].label}
                      className="w-[57px] h-[42px] lg:w-[120px] lg:h-[80px] object-cover rounded-md"
                    />
                    <h2 className="m-0 font-[family-name:var(--font-heading)] text-[28px] lg:text-[42px] font-light text-[#1a1a1a]">
                      {categoryConfig[categoryKey].label}
                    </h2>
                  </header>

                  <div className="divide-y divide-[rgba(145,107,28,0.2)]">
                    {group.map((dish) => (
                      <article key={dish.id} className="py-2.5 lg:py-6">
                        <div className="flex justify-between items-baseline gap-4">
                          <h3 className="m-0 font-[family-name:var(--font-heading)] text-[22px] lg:text-[32px] font-light leading-[1.08] text-[#1a1a1a]">
                            {dish.name}
                          </h3>
                          <p className="m-0 font-[family-name:var(--font-body)] text-sm lg:text-[18px] font-bold text-[#866727] whitespace-nowrap">
                            {Math.round(dish.price)} kr.
                          </p>
                        </div>
                        <p className="m-0 mt-1.5 lg:mt-2 text-[#5f5f5f] font-[family-name:var(--font-body)] text-xs lg:text-[17px] leading-relaxed lg:leading-[1.6]">
                          {dish.description}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
};

export default Menu;
