"use client";

export function DownloadSummaryButton({
  text,
  filename,
  label = "Download summary"
}: {
  text: string;
  filename: string;
  label?: string;
}) {
  function handleDownload() {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button className="button secondary" type="button" onClick={handleDownload}>
      {label}
    </button>
  );
}
