const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function mockExecutionDelay(min = 600, max = 1400): Promise<number> {
  const duration = Math.floor(Math.random() * (max - min + 1)) + min;
  await delay(duration);
  return duration;
}

export function formatExecutionValue(value: unknown): string {
  if (value === undefined || value === null) return "—";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}
