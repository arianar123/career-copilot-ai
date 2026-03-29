"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "./AuthProvider";
import { useUserProfile } from "./UserProfileProvider";

export function SignInForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { updateProfile } = useUserProfile();
  const [name, setName] = useState("Arees Khan");
  const [email, setEmail] = useState("arees@example.com");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    signIn({ name, email });
    updateProfile({ name });
    router.push("/workspace");
  }

  return (
    <form className="card stack" onSubmit={handleSubmit}>
      <div>
        <span className="eyebrow">Sign in</span>
        <h2>Create a lightweight demo session for your career workspace.</h2>
      </div>

      <label className="field">
        <span>Name</span>
        <input value={name} onChange={(event) => setName(event.target.value)} required />
      </label>

      <label className="field">
        <span>Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>

      <div className="action-row">
        <button className="button" type="submit">
          Start session
        </button>
      </div>
    </form>
  );
}
