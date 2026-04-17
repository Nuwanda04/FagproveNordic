const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:3042";

export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");
const API_ORIGIN = new URL(API_BASE_URL).origin;

// Formatrer API-endepunktet korrekt, hvormed evt. dobbelte skråstreger (//) elimineres sikkert
export const apiUrl = (path = "") => {
  const normalizedPath = String(path).replace(/^\/+/, "");
  return `${API_BASE_URL}/${normalizedPath}`;
};

// Sikrer absolutte URL'er (også ved assets, der evt. returneres relativt fra Node-backend serveren)
export const resolveApiAssetUrl = (assetUrl) => {
  if (!assetUrl) return assetUrl;

  const value = String(assetUrl).trim();
  if (!value) return value;

  if (value.startsWith("/")) {
    return `${API_BASE_URL}${value}`;
  }

  try {
    const parsed = new URL(value);
    if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
      return `${API_ORIGIN}${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
    return value;
  } catch {
    return apiUrl(value);
  }
};
