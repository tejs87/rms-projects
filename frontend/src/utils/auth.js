// Lightweight JWT decode (no dependency) — works if token is a standard base64 JWT
export function getToken() {
  return localStorage.getItem("token");
}

export function decodeToken(token = getToken()) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload; // { id, role, iat, exp, ... }
  } catch (e) {
    console.error("Invalid token decode", e);
    return null;
  }
}

export function getCurrentUser() {
  const decoded = decodeToken();
  if (!decoded) return null;
  return { id: decoded.id, role: decoded.role };
}
