import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { ADMIN_TOKEN_KEY } from "../config/site";
import type { AdminUser } from "../types/api";

interface AuthContextValue {
  token: string | null;
  user: AdminUser | null;
  login: (token: string, user: AdminUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(ADMIN_TOKEN_KEY));
  const [user, setUser] = useState<AdminUser | null>(() => {
    const raw = localStorage.getItem(`${ADMIN_TOKEN_KEY}_user`);
    return raw ? (JSON.parse(raw) as AdminUser) : null;
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login(newToken, newUser) {
        localStorage.setItem(ADMIN_TOKEN_KEY, newToken);
        localStorage.setItem(`${ADMIN_TOKEN_KEY}_user`, JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
      },
      logout() {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem(`${ADMIN_TOKEN_KEY}_user`);
        setToken(null);
        setUser(null);
      },
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
