"use client";

import { useEffect, useState } from "react";

type RatingCountProps = {
  /** The average rating sent by the backend, or null when there are no reviews. */
  value: number | null;
};

/**
 * Animates the number from 0 up to the value the backend sent.
 * This is only a visual effect: the final number on screen is always exactly
 * what the API returned, and nothing is calculated here.
 */
export default function RatingCount({ value }: RatingCountProps) {
  const [display, setDisplay] = useState(value ?? 0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (value === null) {
      setReady(true);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      setReady(true);
      return;
    }

    const duration = 1100;
    const start = performance.now();
    let frame = 0;

    setDisplay(0);
    setReady(true);

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out
      setDisplay(progress === 1 ? (value as number) : (value as number) * eased);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  if (value === null) {
    return <span>—</span>;
  }

  return (
    <span
      aria-label={`Average rating ${value.toFixed(1)} out of 5`}
      className={`tabular-nums transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
    >
      {display.toFixed(1)}
    </span>
  );
}
