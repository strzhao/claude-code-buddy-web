"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      className="fixed top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded bg-surface pixel-border pixel-shadow-sm pixel-btn-active transition-colors hover:bg-surface-alt"
    >
      {theme === "light" ? (
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          className="text-ink"
          aria-hidden="true"
        >
          {/* Moon — pixel-style */}
          <path
            d="M14 10a6 6 0 01-8-8 7 7 0 108 8z"
            fill="currentColor"
          />
        </svg>
      ) : (
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          className="text-ink"
          aria-hidden="true"
        >
          {/* Sun — pixel-style */}
          <circle cx="9" cy="9" r="4" fill="currentColor" />
          <path
            d="M9 1v2M9 15v2M1 9h2M15 9h2M3.3 3.3l1.4 1.4M13.3 13.3l1.4 1.4M13.3 3.3l1.4 1.4M3.3 13.3l1.4 1.4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
          />
        </svg>
      )}
    </button>
  );
}
