import { useEffect, useMemo, useState } from "react";
import appetizersImg from "../assets/appetizers.png";
import dessertsImg from "../assets/desserts.png";
import menuBg from "../assets/headerbg.png";
import mainCoursesImg from "../assets/mainCourses.png";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:3042"
).replace(/\/+$/, "");

const categoryConfig = {
  forret: { key: "forret", label: "Forretter", image: appetizersImg },
  hovedret: { key: "hovedret", label: "Hovedretter", image: mainCoursesImg },
  dessert: { key: "dessert", label: "Desserter", image: dessertsImg },
};

const categoryOrder = ["forret", "hovedret", "dessert"];

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

const normalizeDish = (dish, index) => ({
  id: dish?._id || dish?.id || `dish-${index}`,
  name: String(dish?.name || dish?.title || "Ret").trim(),
  description: String(dish?.description || dish?.teaser || "").trim(),
  price: Number.isFinite(Number(dish?.price ?? dish?.cost ?? dish?.amount))
    ? Number(dish?.price ?? dish?.cost ?? dish?.amount)
    : 0,
  category: normalizeCategory(dish?.category || dish?.course),
});

const Menu = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
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

  return (
    <>
      <section className="menu-hero-shell">
        <div
          className="menu-hero"
          style={{ backgroundImage: `url(${menuBg})` }}
        >
          <div className="menu-hero__content">
            <p className="menu-hero__eyebrow">VORES MENU</p>
            <h1 className="menu-hero__title">
              Smagsoplevelser fra det nordiske køkken
            </h1>
            <p className="menu-hero__description">
              Alt på vores menu er tilberedt af sæsonens friskeste råvarer. Vi
              arbejder tæt med lokale producenter for at sikre den bedste
              kvalitet.
            </p>
          </div>
        </div>
      </section>

      <section className="menu-page">
        <div className="menu-page__controls">
          <input
            type="search"
            className="menu-page__search"
            placeholder="Søg på titel"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            aria-label="Søg retter"
          />

          <div
            className="menu-page__category-filter"
            role="tablist"
            aria-label="Filtrer kategori"
          >
            <button
              type="button"
              className={`menu-page__category-btn ${activeCategory === "all" ? "is-active" : ""}`}
              onClick={() => setActiveCategory("all")}
            >
              Alle
            </button>
            <button
              type="button"
              className={`menu-page__category-btn ${activeCategory === "forret" ? "is-active" : ""}`}
              onClick={() => setActiveCategory("forret")}
            >
              Forret
            </button>
            <button
              type="button"
              className={`menu-page__category-btn ${activeCategory === "hovedret" ? "is-active" : ""}`}
              onClick={() => setActiveCategory("hovedret")}
            >
              Hovedret
            </button>
            <button
              type="button"
              className={`menu-page__category-btn ${activeCategory === "dessert" ? "is-active" : ""}`}
              onClick={() => setActiveCategory("dessert")}
            >
              Dessert
            </button>
          </div>

          <select
            className="menu-page__sort"
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

        {loading && <p className="menu-page__message">Henter menuen...</p>}
        {!loading && error && (
          <p className="menu-page__message menu-page__message--error">
            {error}
          </p>
        )}

        {!loading && !error && visibleDishes.length === 0 && (
          <p className="menu-page__message">Ingen retter matcher dit filter.</p>
        )}

        {!loading && !error && visibleDishes.length > 0 && (
          <div className="menu-page__groups">
            {categoryOrder.map((categoryKey) => {
              const group = groupedDishes[categoryKey];
              if (!group.length) return null;

              return (
                <section key={categoryKey} className="menu-group">
                  <header className="menu-group__header">
                    <img
                      src={categoryConfig[categoryKey].image}
                      alt={categoryConfig[categoryKey].label}
                      className="menu-group__image"
                    />
                    <h2 className="menu-group__title">
                      {categoryConfig[categoryKey].label}
                    </h2>
                  </header>

                  <div className="menu-group__list">
                    {group.map((dish) => (
                      <article key={dish.id} className="menu-item">
                        <div className="menu-item__top">
                          <h3 className="menu-item__name">{dish.name}</h3>
                          <p className="menu-item__price">
                            {Math.round(dish.price)} kr.
                          </p>
                        </div>
                        <p className="menu-item__description">
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
