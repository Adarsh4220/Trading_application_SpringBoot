import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { TOKEN_KEY, TWO_FA_KEY, USER_KEY } from "../config/apiConfig";
import { decodeJwtPayload, looksLikeJwt } from "../utils/format";

const AuthContext = createContext(null);

function readUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUserState] = useState(() => readUser());
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    () => localStorage.getItem(TWO_FA_KEY) === "true"
  );

  const persistUser = (nextUser) => {
    setUserState(nextUser);
    if (nextUser) localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    else localStorage.removeItem(USER_KEY);
  };

  const login = (jwt, profile = {}) => {
    if (!looksLikeJwt(jwt)) {
      throw new Error("Login did not return a valid session.");
    }
    localStorage.setItem(TOKEN_KEY, jwt);
    setToken(jwt);
    const payload = decodeJwtPayload(jwt);
    const email = profile.email || payload?.sub || payload?.email || "";
    persistUser({
      email,
      name: profile.name || readUser()?.name || email.split("@")[0],
    });
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    persistUser(null);
  };

  const markTwoFactorEnabled = () => {
    localStorage.setItem(TWO_FA_KEY, "true");
    setTwoFactorEnabled(true);
  };

  const setUser = (next) => {
    persistUser(next);
  };

  useEffect(() => {
    const onUnauthorized = () => {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
    };
    window.addEventListener("cryptox:unauthorized", onUnauthorized);
    return () => window.removeEventListener("cryptox:unauthorized", onUnauthorized);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      twoFactorEnabled,
      markTwoFactorEnabled,
      login,
      logout,
      setUser,
    }),
    [user, token, twoFactorEnabled]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
