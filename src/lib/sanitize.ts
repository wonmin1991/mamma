const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
};

export function sanitize(input: string): string {
  return input.replace(/[&<>"']/g, (ch) => HTML_ESCAPE_MAP[ch]);
}

export function sanitizeTrim(input: string, maxLength = 500): string {
  return sanitize(input.trim()).slice(0, maxLength);
}
