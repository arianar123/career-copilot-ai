"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Session = {
  name: string;
  email: string;
};

type AuthContextValue = {
  session: Session | null;
  hydrated: boolean;
  signIn: (session: Session) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "career-copilot-session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const rawValue = window.localStorage.getItem(STORAGE_KEY);
      if (rawValue) {
        setSession(JSON.parse(rawValue) as Session);
      }
    } finally {
      setHydrated(true);
    }
  }, []);

  function signIn(nextSession: Session) {
    setSession(nextSession);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
  }

  function signOut() {
    setSession(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  const value = useMemo(
    () => ({ session, hydrated, signIn, signOut }),
    [session, hydrated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
