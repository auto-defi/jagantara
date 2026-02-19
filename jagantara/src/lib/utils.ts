import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const formatTimeLeft = (seconds: bigint | number) => {
  const total = typeof seconds === "bigint" ? Number(seconds) : seconds;

  const days = Math.floor(total / (24 * 3600));
  const hours = Math.floor((total % (24 * 3600)) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;

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

export const formatNextSessionDate = (timeLeft: bigint | number): string => {
  const now = Date.now(); // current time in ms
  const timeLeftMs =
    typeof timeLeft === "bigint" ? Number(timeLeft) * 1000 : timeLeft * 1000;

  const nextSessionDate = new Date(now + timeLeftMs);

  const day = nextSessionDate.getDate();
  const month = nextSessionDate.toLocaleString("default", { month: "long" });
  const year = nextSessionDate.getFullYear();

  return `${day} ${month} ${year}`;
};

export const getActiveFrom = (timeLeft: bigint | number): string => {
  const SESSION_DURATION = 2592000; // 30 days in seconds
  const timeLeftMs = Number(timeLeft) * 1000;
  const sessionStartMs = Date.now() - (SESSION_DURATION * 1000 - timeLeftMs);
  const sessionStart = new Date(sessionStartMs);

  return sessionStart.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
