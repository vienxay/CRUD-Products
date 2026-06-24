"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { authApi, type UserResponse } from "@/lib/api";

interface AuthContextType {
  user: UserResponse | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function isValidUser(data: unknown): data is UserResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "email" in data &&
    "name" in data
  );
}

function getStoredUser(): UserResponse | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("user");
  if (!stored) return null;
  try {
    const parsed: unknown = JSON.parse(stored);
    if (isValidUser(parsed)) return parsed;
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  } catch {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(getStoredUser);
  const [loading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    const { token, user: userData } = res.data.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
