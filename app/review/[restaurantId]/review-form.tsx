"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ReviewFormProps = {
  restaurantId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function ReviewForm({ restaurantId, onSuccess, onCancel }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const trimmedComment = comment.trim();
  const canSubmit = rating >= 1 && rating <= 5 && trimmedComment.length > 0 && !submitting;

  function chooseRating(value: number, event: React.MouseEvent<HTMLButtonElement>) {
    setRating(value);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    event.currentTarget.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.3) rotate(-8deg)" },
        { transform: "scale(1)" },
      ],
      { duration: 320, easing: "ease-out" }
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

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
    <form onSubmit={onSubmit} className="mt-6 space-y-5">
      <fieldset>
        <legend className="text-sm font-semibold">Your rating</legend>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => {
              const selected = value <= rating;
              return (
                <button
                  key={value}
                  type="button"
                  aria-label={`Rate ${value} out of 5`}
                  aria-pressed={rating === value}
                  onClick={(event) => chooseRating(value, event)}
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-2xl leading-none transition-all duration-200 hover:-translate-y-0.5 ${
                    selected
                      ? "border-foodsy-red bg-foodsy-yellow text-foodsy-red shadow-sm"
                      : "border-foodsy-ink/15 bg-white text-foodsy-ink/20 hover:border-foodsy-red/50"
                  }`}
                >
                  ★
                </button>
              );
            })}
          </div>
          <p aria-live="polite" className="text-sm text-foodsy-ink/60">
            {rating > 0 ? `${rating} of 5 selected` : "Tap a star"}
          </p>
        </div>
      </fieldset>

      <label className="block">
        <span className="text-sm font-semibold">Your comment</span>
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={5}
          placeholder="What did you taste?"
          className="mt-3 w-full rounded-3xl border border-foodsy-ink/15 bg-white px-4 py-3 outline-none ring-foodsy-red focus:ring-2"
        />
      </label>

      {error ? <p className="text-sm font-medium text-foodsy-red">{error}</p> : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-full bg-foodsy-red px-5 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "Saving..." : "Submit review"}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-foodsy-ink/15 px-5 py-3 text-sm font-semibold text-foodsy-ink transition-colors hover:border-foodsy-red hover:text-foodsy-red"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
