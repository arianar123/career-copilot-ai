"use client";

import Link from "next/link";

import { useAuth } from "./AuthProvider";

export function WorkspaceSessionGate({
  children
}: {
  children: React.ReactNode;
}) {
  const { session, hydrated } = useAuth();

  if (!hydrated) {
    return <section className="card empty">Loading your session...</section>;
  }

  if (!session) {
    return (
      <section className="card stack">
        <div>
          <span className="eyebrow">Session required</span>
          <h2>Sign in to make this workspace feel like your own.</h2>
        </div>
        <p>
          The rest of the app still works in guest mode, but signing in gives the
          product a more realistic personal-workspace flow.
        </p>
        <div className="action-row">
          <Link className="button" href="/signin">
            Go to sign in
          </Link>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
