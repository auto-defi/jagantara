import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Stacks contracts often express time windows in *blocks*.
// For UI we convert blocks -> seconds using an approximate 10 min block time.
const DEFAULT_BLOCK_TIME_SECONDS = 600;

const toFiniteNumber = (
  value: bigint | number | null | undefined
): number | null => {
  if (value === null || value === undefined) return null;
  const n = typeof value === "bigint" ? Number(value) : value;
  if (!Number.isFinite(n)) return null;
  return n;
};

/**
 * Normalize a duration input into seconds.
 * Heuristic:
 * - If value is very large, assume caller passed seconds.
 * - Otherwise assume caller passed blocks.
 */
const normalizeToSeconds = (
  input: bigint | number | null | undefined
): number | null => {
  const n = toFiniteNumber(input);
  if (n === null) return null;
  if (n < 0) return null;

  // 30 days in seconds = 2,592,000; 30 days in blocks ~ 4,320.
  // Anything above ~100k is almost certainly seconds in our app context.
  const SECONDS_THRESHOLD = 100_000;
  return n > SECONDS_THRESHOLD ? n : n * DEFAULT_BLOCK_TIME_SECONDS;
};

export const formatTimeLeft = (secondsOrBlocks: bigint | number | null | undefined) => {
  const totalSeconds = normalizeToSeconds(secondsOrBlocks);
  if (totalSeconds === null) return "—";

  const total = Math.max(0, Math.floor(totalSeconds));
  const days = Math.floor(total / (24 * 3600));
  const hours = Math.floor((total % (24 * 3600)) / 3600);
  const minutes = Math.floor((total % 3600) / 60);

  return `${days}d ${hours}h ${minutes}m`;
};

export const formatUnixToDate = (timestamp: bigint | number): string => {
  const ms =
    typeof timestamp === "bigint" ? Number(timestamp) * 1000 : timestamp * 1000;
  const date = new Date(ms);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export const formatNextSessionDate = (
  timeLeftSecondsOrBlocks: bigint | number | null | undefined
): string => {
  const now = Date.now();
  const timeLeftSeconds = normalizeToSeconds(timeLeftSecondsOrBlocks);
  if (timeLeftSeconds === null) return "—";

  const nextSessionDate = new Date(now + timeLeftSeconds * 1000);
  if (Number.isNaN(nextSessionDate.getTime())) return "—";

  const day = nextSessionDate.getDate();
  const month = nextSessionDate.toLocaleString("default", { month: "long" });
  const year = nextSessionDate.getFullYear();

  return `${day} ${month} ${year}`;
};

export const getActiveFrom = (
  timeLeftSecondsOrBlocks: bigint | number | null | undefined
): string => {
  const n = toFiniteNumber(timeLeftSecondsOrBlocks);
  if (n === null) return "—";

  const isSeconds = n > 100_000;
  const sessionDurationSeconds = isSeconds
    ? 2_592_000 // 30 days in seconds
    : 4_320 * DEFAULT_BLOCK_TIME_SECONDS; // 30 days in blocks * seconds/block

  const timeLeftSeconds = normalizeToSeconds(timeLeftSecondsOrBlocks);
  if (timeLeftSeconds === null) return "—";

  const elapsedSeconds = Math.max(0, sessionDurationSeconds - timeLeftSeconds);
  const sessionStartMs = Date.now() - elapsedSeconds * 1000;
  const sessionStart = new Date(sessionStartMs);
  if (Number.isNaN(sessionStart.getTime())) return "—";

  return sessionStart.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
