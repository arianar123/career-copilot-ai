import { SignInForm } from "../../components/SignInForm";

export default function SignInPage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <span className="eyebrow">Demo auth</span>
        <h1>Start a personal session for CareerCopilot AI.</h1>
        <p>
          This lightweight sign-in flow is designed for demo mode. It makes the product
          feel account-based and personal without requiring a backend auth system yet.
        </p>
      </section>

      <SignInForm />
    </main>
  );
}
