import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiUrl, resolveApiAssetUrl } from "../services/api";
import {
  clearAuth,
  getStoredToken,
  getStoredUser,
  isAdminUser,
} from "../services/auth";

// Standard (tomme) værdier for formularen, når en ny ret skal oprettes eller redigeres
const initialDishForm = {
  id: "",
  title: "",
  description: "",
  price: "",
  category: "starter",
  isSignature: false,
  file: null,
};

const categoryLabelMap = {
  starter: "Forret",
  main: "Hovedret",
  dessert: "Dessert",
};

const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

const normalizeDish = (dish) => ({
  id: dish?._id || dish?.id || "",
  title: String(dish?.title || "").trim(),
  description: String(dish?.description || "").trim(),
  price: Number.isFinite(Number(dish?.price)) ? Number(dish.price) : 0,
  category: dish?.category || "main",
  isSignature: Boolean(dish?.isSignature),
  image: resolveApiAssetUrl(dish?.image || ""),
});

/**
 * Backoffice komponenten udgør administratorpanelet.
 * Her kan en godkendt (admin) bruger administrere (CRUD) udvalget af retter.
 * Siden er beskyttet og kræver et eksisterende og validt JWT-token.
 */
const Backoffice = () => {
  const [token, setToken] = useState(getStoredToken());
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  const [dishes, setDishes] = useState([]);
  const [dishCreateForm, setDishCreateForm] = useState(initialDishForm);
  const [dishEditForm, setDishEditForm] = useState(initialDishForm);

  const sortedDishes = useMemo(() => {
    return [...dishes].sort((a, b) => a.title.localeCompare(b.title, "da"));
  }, [dishes]);

  const fetchDishes = async () => {
    try {
      const response = await fetch(apiUrl("dishes"));
      const json = await response.json();

      if (!response.ok || json?.status !== "ok") {
        throw new Error(json?.message || "Kunne ikke hente retter.");
      }

      const list = Array.isArray(json?.data) ? json.data : [];
      setDishes(list.map(normalizeDish));
    } catch (requestError) {
      toast.error(requestError.message || "Kunne ikke hente retter.");
    }
  };

  useEffect(() => {
    // Bekræfter om det lokalt gemte bruger-token fortsat er gyldigt overfor vores API
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(apiUrl("auth/token"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const json = await response.json();

        if (!response.ok || json?.status !== "ok" || !json?.data) {
          clearAuth();
          setToken(null);
          setUser(null);
          return;
        }

        setUser(json.data);
      } catch {
        clearAuth();
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  useEffect(() => {
    // Hvis brugeren er identificeret korrekt og har rollen "admin", hentes alle retter
    if (!loading && token && isAdminUser(user)) {
      fetchDishes();
    }
  }, [loading, token, user]);

  const handleLogout = () => {
    clearAuth();
    setToken(null);
    setUser(null);
  };

  const handleDishCreateChange = (event) => {
    const { name, value, type, checked, files } = event.target;
    setDishCreateForm((prev) => ({
      ...prev,
      [name]:
        name === "file"
          ? files?.[0] || null
          : type === "checkbox"
            ? checked
            : value,
    }));
  };

  const handleDishEditChange = (event) => {
    const { name, value, type, checked, files } = event.target;
    setDishEditForm((prev) => ({
      ...prev,
      [name]:
        name === "file"
          ? files?.[0] || null
          : type === "checkbox"
            ? checked
            : value,
    }));
  };

  const selectDishForEdit = (dishId) => {
    const selected = dishes.find((dish) => dish.id === dishId);
    if (!selected) {
      setDishEditForm(initialDishForm);
      return;
    }

    setDishEditForm({
      id: selected.id,
      title: selected.title,
      description: selected.description,
      price: String(selected.price),
      category: selected.category,
      isSignature: selected.isSignature,
      file: null,
    });
  };

  // Pakker data i et FormData-objekt for at oprette (POST) en helt ny ret
  const submitDishCreate = async (event) => {
    event.preventDefault();

    if (dishCreateForm.isSignature) {
      const signatureCount = dishes.filter((d) => d.isSignature).length;
      if (signatureCount >= 3) {
        toast.error(
          "Du kan maksimalt have 3 signaturretter af gangen. Fjern en signaturret før du tilføjer en ny."
        );
        return;
      }
    }

    const formData = new FormData();
    formData.append("title", dishCreateForm.title);
    formData.append("description", dishCreateForm.description);
    formData.append("price", dishCreateForm.price);
    formData.append("category", dishCreateForm.category);
    formData.append("isSignature", String(dishCreateForm.isSignature));
    if (dishCreateForm.file) formData.append("image", dishCreateForm.file);

    try {
      const response = await fetch(apiUrl("dish"), {
        method: "POST",
        headers: authHeaders(token),
        body: formData,
      });

      const json = await response.json();

      if (!response.ok || json?.status !== "ok") {
        throw new Error(json?.message || "Kunne ikke oprette ret.");
      }

      toast.success("Ret oprettet.");
      setDishCreateForm(initialDishForm);
      await fetchDishes();
    } catch (requestError) {
      toast.error(requestError.message || "Kunne ikke oprette ret.");
    }
  };

  // Bruger FormData-objekt til at opdatere (PUT) en eksisterende ret
  const submitDishUpdate = async (event) => {
    event.preventDefault();

    if (!dishEditForm.id) {
      toast.error("Vaelg en ret, der skal opdateres.");
      return;
    }

    const originalDish = dishes.find((d) => d.id === dishEditForm.id);
    if (
      dishEditForm.isSignature &&
      originalDish &&
      !originalDish.isSignature
    ) {
      const signatureCount = dishes.filter((d) => d.isSignature).length;
      if (signatureCount >= 3) {
        toast.error(
          "Du kan maksimalt have 3 signaturretter af gangen. Fjern en signaturret før du tilføjer en ny."
        );
        return;
      }
    }

    const formData = new FormData();
    formData.append("id", dishEditForm.id);
    formData.append("title", dishEditForm.title);
    formData.append("description", dishEditForm.description);
    formData.append("price", dishEditForm.price);
    formData.append("category", dishEditForm.category);
    formData.append("isSignature", String(dishEditForm.isSignature));
    if (dishEditForm.file) formData.append("image", dishEditForm.file);

    try {
      const response = await fetch(apiUrl("dish"), {
        method: "PUT",
        headers: authHeaders(token),
        body: formData,
      });

      const json = await response.json();

      if (!response.ok || json?.status !== "ok") {
        throw new Error(json?.message || "Kunne ikke opdatere ret.");
      }

      toast.success("Ret opdateret.");
      await fetchDishes();
    } catch (requestError) {
      toast.error(requestError.message || "Kunne ikke opdatere ret.");
    }
  };

  // Beder brugeren bekræfte og anmoder herefter backend om at slette (DELETE)
  const deleteDish = async (dishId) => {
    if (!window.confirm("Er du sikker pa at du vil slette denne ret?")) {
      return;
    }

    try {
      const response = await fetch(apiUrl(`dish/${dishId}`), {
        method: "DELETE",
        headers: authHeaders(token),
      });

      const json = await response.json();

      if (!response.ok || json?.status !== "ok") {
        throw new Error(json?.message || "Kunne ikke slette ret.");
      }

      toast.success("Ret slettet.");
      if (dishEditForm.id === dishId) {
        setDishEditForm(initialDishForm);
      }
      await fetchDishes();
    } catch (requestError) {
      toast.error(requestError.message || "Kunne ikke slette ret.");
    }
  };

  // Skifter (toggle) en rets specifikke status (Signaturret) via en PATCH anmodning
  const toggleSignature = async (dishId) => {
    const originalDish = dishes.find((d) => d.id === dishId);
    if (originalDish && !originalDish.isSignature) {
      const signatureCount = dishes.filter((d) => d.isSignature).length;
      if (signatureCount >= 3) {
        toast.error(
          "Du kan maksimalt have 3 signaturretter af gangen. Fjern en signaturret før du tilføjer en ny."
        );
        return;
      }
    }

    try {
      const response = await fetch(apiUrl(`dish/${dishId}/signature`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(token),
        },
      });

      const json = await response.json();

      if (!response.ok || json?.status !== "ok") {
        throw new Error(json?.message || "Kunne ikke opdatere signaturstatus.");
      }

      toast.success("Signaturstatus opdateret.");
      await fetchDishes();
    } catch (requestError) {
      toast.error(requestError.message || "Kunne ikke opdatere signaturstatus.");
    }
  };

  if (!token && !loading) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-[#f7f5f2] pt-40">
        <p className="text-[var(--color-muted)] font-[family-name:var(--font-body)]">Tjekker adgang...</p>
      </section>
    );
  }

  if (!isAdminUser(user)) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-[#f7f5f2] pt-40">
        <div className="bg-white border border-[rgba(145,107,28,0.3)] rounded-xl shadow-[4px_4px_4px_rgba(0,0,0,0.25)] p-8 text-center max-w-md">
          <h1 className="m-0 font-[family-name:var(--font-heading)] text-3xl text-[#1a1a1a]">
            Ingen adgang
          </h1>
          <p className="m-0 mt-2 text-[#5f5f5f] font-[family-name:var(--font-body)]">
            Kun admin-brugere kan tilgaa Nordic Table backoffice.
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 px-6 py-2 bg-[#7c632f] text-white font-[family-name:var(--font-body)] border-0 cursor-pointer shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
          >
            Log ud
          </button>
        </div>
      </section>
    );
  }

  const inputClass =
    "min-h-[42px] border border-[rgba(145,107,28,0.45)] rounded-md bg-[#fbfaf7] text-[#4a4a4a] font-[family-name:var(--font-body)] text-sm px-2.5";

  return (
    <section className="bg-[#f7f5f2] min-h-screen pt-16 lg:pt-40 pb-12">
      <div className="max-w-[1120px] mx-auto px-4 lg:px-8">
        {/* Top bar */}
        <div className="bg-white border border-[rgba(145,107,28,0.3)] rounded-xl shadow-[4px_4px_4px_rgba(0,0,0,0.25)] px-5 py-4 flex items-center justify-between mb-6">
          <div>
            <p className="m-0 text-[#866727] font-[family-name:var(--font-body)] text-xs font-semibold tracking-[0.14em] uppercase">
              NORDIC TABLE
            </p>
            <h1 className="m-0 font-[family-name:var(--font-heading)] text-3xl font-light text-[#1a1a1a]">
              Backoffice
            </h1>
            <p className="m-0 text-[#866727] font-[family-name:var(--font-body)] text-xs">
              Logget ind som {user?.name || user?.email || "admin"}
            </p>
          </div>
          <button
            type="button"
            className="min-h-[40px] px-5 bg-[#7c632f] text-white font-[family-name:var(--font-body)] text-sm border-0 cursor-pointer shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
            onClick={handleLogout}
          >
            Log ud
          </button>
        </div>

        {/* Create / Edit Grid */}
        <div className="grid md:grid-cols-2 gap-5 items-start mb-6">
          {/* Create form */}
          <article className="bg-white border border-[rgba(145,107,28,0.3)] rounded-xl shadow-[4px_4px_4px_rgba(0,0,0,0.25)] p-5">
            <h2 className="m-0 mb-4 font-[family-name:var(--font-heading)] text-2xl font-light text-[#1a1a1a]">
              Opret ret
            </h2>
            <form className="grid gap-3.5" onSubmit={submitDishCreate}>
              <label className="grid gap-1">
                <span className="text-[#615846] font-[family-name:var(--font-body)] text-xs font-medium">Titel</span>
                <input type="text" name="title" value={dishCreateForm.title} onChange={handleDishCreateChange} required className={inputClass} />
              </label>

              <label className="grid gap-1">
                <span className="text-[#615846] font-[family-name:var(--font-body)] text-xs font-medium">Beskrivelse</span>
                <textarea name="description" value={dishCreateForm.description} onChange={handleDishCreateChange} rows="3" required className={`${inputClass} min-h-[80px] py-2`} />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-1">
                  <span className="text-[#615846] font-[family-name:var(--font-body)] text-xs font-medium">Pris</span>
                  <input type="number" min="0" step="1" name="price" value={dishCreateForm.price} onChange={handleDishCreateChange} required className={inputClass} />
                </label>
                <label className="grid gap-1">
                  <span className="text-[#615846] font-[family-name:var(--font-body)] text-xs font-medium">Kategori</span>
                  <select name="category" value={dishCreateForm.category} onChange={handleDishCreateChange} className={inputClass}>
                    <option value="starter">Forret</option>
                    <option value="main">Hovedret</option>
                    <option value="dessert">Dessert</option>
                  </select>
                </label>
              </div>

              <label className="grid gap-1">
                <span className="text-[#615846] font-[family-name:var(--font-body)] text-xs font-medium">Billede (valgfrit)</span>
                <input type="file" name="file" accept="image/*" onChange={handleDishCreateChange} className="font-[family-name:var(--font-body)] text-sm" />
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isSignature" checked={dishCreateForm.isSignature} onChange={handleDishCreateChange} className="w-4 h-4" />
                <span className="text-[#615846] font-[family-name:var(--font-body)] text-sm">Markér som signaturret</span>
              </label>

              <button type="submit" className="min-h-[42px] bg-[#7c632f] text-white font-[family-name:var(--font-body)] text-sm border-0 cursor-pointer shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
                Opret ret
              </button>
            </form>
          </article>

          {/* Edit form */}
          <article className="bg-white border border-[rgba(145,107,28,0.3)] rounded-xl shadow-[4px_4px_4px_rgba(0,0,0,0.25)] p-5">
            <h2 className="m-0 mb-4 font-[family-name:var(--font-heading)] text-2xl font-light text-[#1a1a1a]">
              Rediger ret
            </h2>
            <form className="grid gap-3.5" onSubmit={submitDishUpdate}>
              <label className="grid gap-1">
                <span className="text-[#615846] font-[family-name:var(--font-body)] text-xs font-medium">Vælg ret</span>
                <select name="id" value={dishEditForm.id} onChange={(event) => selectDishForEdit(event.target.value)} className={inputClass}>
                  <option value="">Vælg en ret</option>
                  {sortedDishes.map((dish) => (
                    <option key={dish.id} value={dish.id}>{dish.title}</option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1">
                <span className="text-[#615846] font-[family-name:var(--font-body)] text-xs font-medium">Titel</span>
                <input type="text" name="title" value={dishEditForm.title} onChange={handleDishEditChange} required className={inputClass} />
              </label>

              <label className="grid gap-1">
                <span className="text-[#615846] font-[family-name:var(--font-body)] text-xs font-medium">Beskrivelse</span>
                <textarea name="description" value={dishEditForm.description} onChange={handleDishEditChange} rows="3" required className={`${inputClass} min-h-[80px] py-2`} />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="grid gap-1">
                  <span className="text-[#615846] font-[family-name:var(--font-body)] text-xs font-medium">Pris</span>
                  <input type="number" min="0" step="1" name="price" value={dishEditForm.price} onChange={handleDishEditChange} required className={inputClass} />
                </label>
                <label className="grid gap-1">
                  <span className="text-[#615846] font-[family-name:var(--font-body)] text-xs font-medium">Kategori</span>
                  <select name="category" value={dishEditForm.category} onChange={handleDishEditChange} className={inputClass}>
                    <option value="starter">Forret</option>
                    <option value="main">Hovedret</option>
                    <option value="dessert">Dessert</option>
                  </select>
                </label>
              </div>

              <label className="grid gap-1">
                <span className="text-[#615846] font-[family-name:var(--font-body)] text-xs font-medium">Nyt billede (valgfrit)</span>
                <input type="file" name="file" accept="image/*" onChange={handleDishEditChange} className="font-[family-name:var(--font-body)] text-sm" />
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isSignature" checked={dishEditForm.isSignature} onChange={handleDishEditChange} className="w-4 h-4" />
                <span className="text-[#615846] font-[family-name:var(--font-body)] text-sm">Signaturret</span>
              </label>

              <button type="submit" className="min-h-[42px] bg-[#7c632f] text-white font-[family-name:var(--font-body)] text-sm border-0 cursor-pointer shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
                Gem ændringer
              </button>
            </form>
          </article>
        </div>

        {/* Dish list */}
        <article className="bg-white border border-[rgba(145,107,28,0.3)] rounded-xl shadow-[4px_4px_4px_rgba(0,0,0,0.25)] p-5">
          <h2 className="m-0 mb-4 font-[family-name:var(--font-heading)] text-2xl font-light text-[#1a1a1a]">
            Alle retter
          </h2>

          <div className="flex flex-col gap-4">
            {sortedDishes.map((dish) => (
              <article
                key={dish.id}
                className="grid md:grid-cols-[180px_minmax(0,1fr)_auto] items-center gap-4 border-b border-[rgba(145,107,28,0.15)] pb-4"
              >
                <div className="h-[100px] md:h-[120px] rounded-lg overflow-hidden bg-[#f2ede5]">
                  {dish.image && (
                    <img src={dish.image} alt={dish.title} className="w-full h-full object-cover" />
                  )}
                </div>

                <div>
                  <h3 className="m-0 font-[family-name:var(--font-heading)] text-xl font-light text-[#1a1a1a]">
                    {dish.title}
                  </h3>
                  <p className="m-0 mt-1 text-[#5f5f5f] font-[family-name:var(--font-body)] text-xs leading-relaxed">
                    {dish.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="border border-[#cdb889] rounded text-[#615846] font-[family-name:var(--font-body)] text-xs px-2 py-1">
                      {categoryLabelMap[dish.category] || dish.category}
                    </span>
                    <span className="border border-[#cdb889] rounded text-[#615846] font-[family-name:var(--font-body)] text-xs px-2 py-1">
                      {Math.round(dish.price)} kr.
                    </span>
                    {dish.isSignature && (
                      <span className="border border-[#7c632f] bg-[#7c632f] text-white rounded font-[family-name:var(--font-body)] text-xs px-2 py-1">
                        Signatur
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex md:flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => selectDishForEdit(dish.id)}
                    className="min-h-[36px] min-w-[100px] md:min-w-[136px] border border-[#cdb889] bg-transparent text-[#615846] font-[family-name:var(--font-body)] text-[13px] px-3 cursor-pointer"
                  >
                    Rediger
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSignature(dish.id)}
                    className="min-h-[36px] min-w-[100px] md:min-w-[136px] border border-[#cdb889] bg-transparent text-[#615846] font-[family-name:var(--font-body)] text-[13px] px-3 cursor-pointer"
                  >
                    Toggle signatur
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteDish(dish.id)}
                    className="min-h-[36px] min-w-[100px] md:min-w-[136px] border border-[#cdb889] bg-transparent text-[#615846] font-[family-name:var(--font-body)] text-[13px] px-3 cursor-pointer"
                  >
                    Slet
                  </button>
                </div>
              </article>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
};

export default Backoffice;
