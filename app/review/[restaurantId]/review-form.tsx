"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ReviewFormProps = {
  restaurantId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
};

// A friendly word for each star level. Display only: the number sent to the API is the rating itself.
const RATING_WORDS = ["Tap a star", "Not good", "Could be better", "Okay", "Really good", "Loved it!"];

export default function ReviewForm({ restaurantId, onSuccess, onCancel }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const trimmedComment = comment.trim();
  const canSubmit = rating >= 1 && rating <= 5 && trimmedComment.length > 0 && !submitting;

  // While hovering, preview that many stars; otherwise show the chosen rating.
  const shown = hovered || rating;

  function chooseRating(value: number, event: React.MouseEvent<HTMLButtonElement>) {
    setRating(value);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    event.currentTarget.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.35) rotate(-10deg)" },
        { transform: "scale(0.95) rotate(4deg)" },
        { transform: "scale(1)" },
      ],
      { duration: 380, easing: "ease-out" }
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    // Frontend validation is a convenience. The backend checks everything again.
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      setError("Rating must be a whole number between 1 and 5.");
      return;
    }

    if (trimmedComment.length === 0) {
      setError("Comment must be a non-empty string.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          rating,
          comment: trimmedComment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(typeof data.error === "string" ? data.error : "Could not save the review.");
        setSubmitting(false);
        return;
      }

      if (onSuccess) {
        onSuccess();
        return;
      }

      router.push(`/restaurant/${restaurantId}`);
      router.refresh();
    } catch {
      setError("Could not reach the server.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-6">
      <fieldset>
        <legend className="text-sm font-semibold">How was it?</legend>
        <div
          className="mt-3 rounded-3xl bg-foodsy-yellow-soft/60 p-4"
          onMouseLeave={() => setHovered(0)}
        >
          <div className="flex justify-between gap-2">
            {[1, 2, 3, 4, 5].map((value) => {
              const filled = value <= shown;
              return (
                <button
                  key={value}
                  type="button"
                  aria-label={`Rate ${value} out of 5`}
                  aria-pressed={rating === value}
                  onMouseEnter={() => setHovered(value)}
                  onFocus={() => setHovered(value)}
                  onBlur={() => setHovered(0)}
                  onClick={(event) => chooseRating(value, event)}
                  className={`flex h-14 flex-1 items-center justify-center rounded-2xl border-2 text-3xl leading-none outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-foodsy-red ${
                    filled
                      ? "-translate-y-0.5 border-foodsy-yellow bg-foodsy-yellow text-foodsy-red shadow-md"
                      : "border-foodsy-line bg-foodsy-paper text-foodsy-ink/20"
                  }`}
                >
                  ★
                </button>
              );
            })}
          </div>
          <p
            aria-live="polite"
            className={`mt-3 text-center text-sm font-semibold transition-colors ${
              shown > 0 ? "text-foodsy-red" : "text-foodsy-muted"
            }`}
          >
            {RATING_WORDS[shown]}
          </p>
        </div>
      </fieldset>

      <label className="block">
        <span className="text-sm font-semibold">Tell us more</span>
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={5}
          placeholder="What did you taste?"
          className="mt-3 w-full resize-none rounded-3xl border border-foodsy-line bg-foodsy-cream px-4 py-3 outline-none transition-shadow placeholder:text-foodsy-muted/70 focus:border-foodsy-red focus:bg-foodsy-paper focus:ring-2 focus:ring-foodsy-red/30"
        />
      </label>

      {error ? (
        <p
          role="alert"
          className="animate-fade-in rounded-2xl bg-foodsy-red-soft px-4 py-3 text-sm font-medium text-foodsy-red-deep"
        >
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-full bg-foodsy-red px-6 py-3 text-sm font-semibold text-white shadow-sm outline-none transition-all hover:-translate-y-0.5 hover:bg-foodsy-red-deep hover:shadow-md focus-visible:ring-2 focus-visible:ring-foodsy-red focus-visible:ring-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:bg-foodsy-red disabled:hover:shadow-sm"
        >
          {submitting ? "Saving..." : "Submit review"}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-foodsy-line px-5 py-3 text-sm font-semibold text-foodsy-ink transition-colors hover:border-foodsy-red hover:text-foodsy-red"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
