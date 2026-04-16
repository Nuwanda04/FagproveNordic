import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { apiUrl, resolveApiAssetUrl } from "../services/api";
import {
  clearAuth,
  getStoredToken,
  getStoredUser,
  isAdminUser,
} from "../services/auth";

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

const Backoffice = () => {
  const [token, setToken] = useState(getStoredToken());
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  const [dishes, setDishes] = useState([]);
  const [dishCreateForm, setDishCreateForm] = useState(initialDishForm);
  const [dishEditForm, setDishEditForm] = useState(initialDishForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const resetFeedback = () => {
    setMessage("");
    setError("");
  };

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
      setError(requestError.message || "Kunne ikke hente retter.");
    }
  };

  useEffect(() => {
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

  const submitDishCreate = async (event) => {
    event.preventDefault();
    resetFeedback();

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

      setMessage("Ret oprettet.");
      setDishCreateForm(initialDishForm);
      await fetchDishes();
    } catch (requestError) {
      setError(requestError.message || "Kunne ikke oprette ret.");
    }
  };

  const submitDishUpdate = async (event) => {
    event.preventDefault();
    resetFeedback();

    if (!dishEditForm.id) {
      setError("Vaelg en ret, der skal opdateres.");
      return;
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

      setMessage("Ret opdateret.");
      await fetchDishes();
    } catch (requestError) {
      setError(requestError.message || "Kunne ikke opdatere ret.");
    }
  };

  const deleteDish = async (dishId) => {
    resetFeedback();

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

      setMessage("Ret slettet.");
      if (dishEditForm.id === dishId) {
        setDishEditForm(initialDishForm);
      }
      await fetchDishes();
    } catch (requestError) {
      setError(requestError.message || "Kunne ikke slette ret.");
    }
  };

  const toggleSignature = async (dishId) => {
    resetFeedback();

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

      setMessage("Signaturstatus opdateret.");
      await fetchDishes();
    } catch (requestError) {
      setError(requestError.message || "Kunne ikke opdatere signaturstatus.");
    }
  };

  if (!token && !loading) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <section className="backoffice-loading">
        <p>Tjekker adgang...</p>
      </section>
    );
  }

  if (!isAdminUser(user)) {
    return (
      <section className="backoffice-denied">
        <div className="backoffice-denied__card">
          <h1>Ingen adgang</h1>
          <p>Kun admin-brugere kan tilgaa Nordic Table backoffice.</p>
          <button type="button" onClick={handleLogout}>
            Log ud
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="backoffice-page">
      <div className="backoffice-shell">
        <div className="backoffice-topbar">
          <div>
            <p className="backoffice-topbar__eyebrow">NORDIC TABLE</p>
            <h1 className="backoffice-topbar__title">Backoffice</h1>
            <p className="backoffice-topbar__meta">
              Logget ind som {user?.name || user?.email || "admin"}
            </p>
          </div>
          <button
            type="button"
            className="backoffice-topbar__logout"
            onClick={handleLogout}
          >
            Log ud
          </button>
        </div>

        {(message || error) && (
          <div className="backoffice-feedback">
            {message && (
              <p className="backoffice-feedback__message">{message}</p>
            )}
            {error && <p className="backoffice-feedback__error">{error}</p>}
          </div>
        )}

        <div className="backoffice-grid">
          <article className="backoffice-card">
            <h2 className="backoffice-card__title">Opret ret</h2>
            <form className="backoffice-form" onSubmit={submitDishCreate}>
              <label>
                <span>Titel</span>
                <input
                  type="text"
                  name="title"
                  value={dishCreateForm.title}
                  onChange={handleDishCreateChange}
                  required
                />
              </label>

              <label>
                <span>Beskrivelse</span>
                <textarea
                  name="description"
                  value={dishCreateForm.description}
                  onChange={handleDishCreateChange}
                  rows="3"
                  required
                />
              </label>

              <div className="backoffice-form__split">
                <label>
                  <span>Pris</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    name="price"
                    value={dishCreateForm.price}
                    onChange={handleDishCreateChange}
                    required
                  />
                </label>

                <label>
                  <span>Kategori</span>
                  <select
                    name="category"
                    value={dishCreateForm.category}
                    onChange={handleDishCreateChange}
                  >
                    <option value="starter">Forret</option>
                    <option value="main">Hovedret</option>
                    <option value="dessert">Dessert</option>
                  </select>
                </label>
              </div>

              <label>
                <span>Billede (valgfrit)</span>
                <input
                  type="file"
                  name="file"
                  accept="image/*"
                  onChange={handleDishCreateChange}
                />
              </label>

              <label className="backoffice-form__checkbox">
                <input
                  type="checkbox"
                  name="isSignature"
                  checked={dishCreateForm.isSignature}
                  onChange={handleDishCreateChange}
                />
                <span>Markér som signaturret</span>
              </label>

              <button type="submit" className="backoffice-form__submit">
                Opret ret
              </button>
            </form>
          </article>

          <article className="backoffice-card">
            <h2 className="backoffice-card__title">Rediger ret</h2>
            <form className="backoffice-form" onSubmit={submitDishUpdate}>
              <label>
                <span>Vælg ret</span>
                <select
                  name="id"
                  value={dishEditForm.id}
                  onChange={(event) => selectDishForEdit(event.target.value)}
                >
                  <option value="">Vælg en ret</option>
                  {sortedDishes.map((dish) => (
                    <option key={dish.id} value={dish.id}>
                      {dish.title}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Titel</span>
                <input
                  type="text"
                  name="title"
                  value={dishEditForm.title}
                  onChange={handleDishEditChange}
                  required
                />
              </label>

              <label>
                <span>Beskrivelse</span>
                <textarea
                  name="description"
                  value={dishEditForm.description}
                  onChange={handleDishEditChange}
                  rows="3"
                  required
                />
              </label>

              <div className="backoffice-form__split">
                <label>
                  <span>Pris</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    name="price"
                    value={dishEditForm.price}
                    onChange={handleDishEditChange}
                    required
                  />
                </label>

                <label>
                  <span>Kategori</span>
                  <select
                    name="category"
                    value={dishEditForm.category}
                    onChange={handleDishEditChange}
                  >
                    <option value="starter">Forret</option>
                    <option value="main">Hovedret</option>
                    <option value="dessert">Dessert</option>
                  </select>
                </label>
              </div>

              <label>
                <span>Nyt billede (valgfrit)</span>
                <input
                  type="file"
                  name="file"
                  accept="image/*"
                  onChange={handleDishEditChange}
                />
              </label>

              <label className="backoffice-form__checkbox">
                <input
                  type="checkbox"
                  name="isSignature"
                  checked={dishEditForm.isSignature}
                  onChange={handleDishEditChange}
                />
                <span>Signaturret</span>
              </label>

              <button type="submit" className="backoffice-form__submit">
                Gem ændringer
              </button>
            </form>
          </article>
        </div>

        <article className="backoffice-card backoffice-card--list">
          <h2 className="backoffice-card__title">Alle retter</h2>

          <div className="backoffice-list">
            {sortedDishes.map((dish) => (
              <article key={dish.id} className="backoffice-list__item">
                <div className="backoffice-list__media-wrap">
                  {dish.image && (
                    <img
                      src={dish.image}
                      alt={dish.title}
                      className="backoffice-list__image"
                    />
                  )}
                </div>

                <div className="backoffice-list__content">
                  <h3>{dish.title}</h3>
                  <p>{dish.description}</p>
                  <div className="backoffice-list__meta">
                    <span>
                      {categoryLabelMap[dish.category] || dish.category}
                    </span>
                    <span>{Math.round(dish.price)} kr.</span>
                    {dish.isSignature && (
                      <span className="is-signature">Signatur</span>
                    )}
                  </div>
                </div>

                <div className="backoffice-list__actions">
                  <button
                    type="button"
                    onClick={() => selectDishForEdit(dish.id)}
                  >
                    Rediger
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleSignature(dish.id)}
                  >
                    Toggle signatur
                  </button>
                  <button type="button" onClick={() => deleteDish(dish.id)}>
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
