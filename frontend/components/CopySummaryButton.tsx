"use client";

import { useState } from "react";

export function CopySummaryButton({
  text,
  label = "Copy summary"
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button className="button secondary" type="button" onClick={handleCopy}>
      {copied ? "Copied" : label}
    </button>
  );
}
