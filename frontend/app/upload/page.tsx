import Link from "next/link";
import { ResumeAnalysisForm } from "../../components/ResumeAnalysisForm";

export default function UploadPage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <span className="eyebrow">MVP workspace</span>
        <h1>Analyze your resume against a real job posting.</h1>
        <p>
          This starter uses a single focused workflow so your demo feels clear, polished,
          and believable.
        </p>
        <div className="action-row">
          <Link className="button secondary" href="/">
            Back home
          </Link>
        </div>
      </section>

      <ResumeAnalysisForm />
    </main>
  );
}
