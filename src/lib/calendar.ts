// ─── .ics Calendar Export Utility ────────────────────────

interface CalendarEvent {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function formatICSDate(d: Date): string {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

function escapeICS(s: string): string {
  return s.replace(/[\\;,\n]/g, (c) => (c === "\n" ? "\\n" : `\\${c}`));
}

export function generateICS(events: CalendarEvent[], calendarName: string): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mamma//Vaccination//KO",
    `X-WR-CALNAME:${escapeICS(calendarName)}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  for (const event of events) {
    lines.push(
      "BEGIN:VEVENT",
      `DTSTART;VALUE=DATE:${formatICSDate(event.startDate)}`,
      `DTEND;VALUE=DATE:${formatICSDate(event.endDate)}`,
      `SUMMARY:${escapeICS(event.title)}`,
      `DESCRIPTION:${escapeICS(event.description)}`,
      `UID:mamma-vac-${formatICSDate(event.startDate)}-${encodeURIComponent(event.title)}@mamma.app`,
      "STATUS:TENTATIVE",
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadICS(icsContent: string, filename: string): void {
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = globalThis.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  globalThis.URL.revokeObjectURL(url);
}
