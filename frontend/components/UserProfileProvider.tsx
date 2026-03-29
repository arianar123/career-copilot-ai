"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type UserProfile = {
  name: string;
  targetRole: string;
  region: string;
  careerGoal: string;
};

const DEFAULT_PROFILE: UserProfile = {
  name: "Student Builder",
  targetRole: "Data Analyst Intern",
  region: "Chicago, IL",
  careerGoal: "Land a strong internship with a portfolio that proves practical impact."
};

type UserProfileContextValue = {
  profile: UserProfile;
  hydrated: boolean;
  updateProfile: (nextProfile: Partial<UserProfile>) => void;
  resetProfile: () => void;
};

const UserProfileContext = createContext<UserProfileContextValue | null>(null);
const STORAGE_KEY = "career-copilot-profile";

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const rawValue = window.localStorage.getItem(STORAGE_KEY);
      if (rawValue) {
        const parsed = JSON.parse(rawValue) as Partial<UserProfile>;
        setProfile((current) => ({ ...current, ...parsed }));
      }
    } finally {
      setHydrated(true);
    }
  }, []);

  function updateProfile(nextProfile: Partial<UserProfile>) {
    setProfile((current) => {
      const updated = { ...current, ...nextProfile };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  function resetProfile() {
    window.localStorage.removeItem(STORAGE_KEY);
    setProfile(DEFAULT_PROFILE);
  }

  const value = useMemo(
    () => ({ profile, hydrated, updateProfile, resetProfile }),
    [profile, hydrated]
  );

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used inside UserProfileProvider");
  }
  return context;
}
