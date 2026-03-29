"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { useUserProfile } from "./UserProfileProvider";

const isDemoMode =
  (process.env.NEXT_PUBLIC_DEMO_MODE ?? "true").toLowerCase() !== "false";

export function SiteChrome() {
  const { session, hydrated: authHydrated, signOut } = useAuth();
  const { profile, hydrated } = useUserProfile();

  return (
    <>
      {isDemoMode ? (
        <div className="demo-banner">
          <div className="page-shell demo-banner-inner">
            <strong>Demo mode active</strong>
            <span>
              CareerCopilot is using deterministic mock AI outputs until a valid
              `OPENAI_API_KEY` is configured.
            </span>
          </div>
        </div>
      ) : null}

      <header className="page-shell site-header">
        <Link className="brand-mark" href="/">
          <span className="brand-kicker">Built by a student, for students</span>
          <strong>CareerCopilot AI</strong>
        </Link>

        <div className="workspace-pill">
          <span>
            {authHydrated
              ? session?.email ?? "Guest session"
              : "Loading session"}
          </span>
          <strong>{hydrated ? profile.targetRole : "Career profile"}</strong>
        </div>

        <nav className="site-nav">
          <Link href="/upload">Analysis</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/market">Market</Link>
          <Link href="/interview">Interview</Link>
          <Link href="/workspace">Workspace</Link>
          <Link href="/signin">{session ? "Switch user" : "Sign in"}</Link>
          <a href="http://localhost:8000/docs">API</a>
          {session ? (
            <button className="nav-button" type="button" onClick={signOut}>
              Sign out
            </button>
          ) : null}
        </nav>
      </header>
    </>
  );
}
