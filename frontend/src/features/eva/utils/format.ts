export function normalizeText(text: string) {
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function formatSessionClock(totalSeconds: number) {
  const mins = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = (totalSeconds % 60).toString().padStart(2, '0');
  return `00:${mins}:${secs}`;
}
