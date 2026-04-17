const TOKEN_KEY = "authToken";
const USER_KEY = "userData";

// Hjælpefunktion til at afkode Base64-Url struktur (som ofte benyttes inden i JWT)
const decodeBase64Url = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return atob(padded);
};

// Trækker selve brugerdata-delen (payload) sikkert ud af et JSON Web Token (JWT)
export const decodeJwtPayload = (token) => {
  if (!token) return null;

  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;
    return JSON.parse(decodeBase64Url(payloadPart));
  } catch {
    return null;
  }
};

// Returnerer den gemte string-værdi (token) fra browserens localStorage, hvis den findes
export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

// Henter de lokalt forud-gemte (oftest cachede) brugerdata
export const getStoredUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

// Dekoder jwt-nøglen via hjælpefunktion, og hvis successfuld gemmes datastrukturer systematisk lokalt
export const storeAuth = (token) => {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(payload));
  return payload;
};

// Nulstiller ("rydder") rettigheds-state. Bruges bl.a. under eksplicit logout eller ved udløbne tokens.
export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Validerer lynhurtigt, om bruger-objektet har admin-rettigheder
export const isAdminUser = (user) => user?.role === "admin";
