import { WorkspaceProfileForm } from "../../components/WorkspaceProfileForm";
import { WorkspaceSessionGate } from "../../components/WorkspaceSessionGate";

export default function WorkspacePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <span className="eyebrow">Personal workspace</span>
        <h1>Turn the app into your own career command center.</h1>
        <p>
          Save your name, target role, region, and career goal so the rest of the
          product feels personalized instead of generic.
        </p>
      </section>

      <WorkspaceSessionGate>
        <WorkspaceProfileForm />
      </WorkspaceSessionGate>
    </main>
  );
}
