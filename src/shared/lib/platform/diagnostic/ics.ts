/** Build a downloadable calendar reminder (.ics) to re-check tokenization readiness. */
export function buildRecheckIcs(monthsAhead = 6): { filename: string; content: string } {
  const now = new Date();
  const dt = new Date(now.getFullYear(), now.getMonth() + monthsAhead, now.getDate(), 10, 0, 0);
  const fmt = (d: Date) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}0000`;
  const stamp = fmt(now);
  const content = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//8Blocks//Tokenization Readiness//EN",
    "BEGIN:VEVENT",
    `UID:recheck-${stamp}@8blocks.io`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${fmt(dt)}`,
    "SUMMARY:Re-check tokenization readiness (8Blocks)",
    "DESCRIPTION:Re-run the free assessment: https://8blocks.io/product/tokenization-readiness",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return { filename: "recheck-tokenization-readiness.ics", content };
}

export function downloadIcs(): void {
  const { filename, content } = buildRecheckIcs();
  const blob = new Blob([content], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
