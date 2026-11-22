"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ReviewForm from "../../review/[restaurantId]/review-form";

type ReviewPanelProps = {
  restaurantId: number;
  restaurantName: string;
};

export default function ReviewPanel({ restaurantId, restaurantName }: ReviewPanelProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex rounded-full bg-foodsy-red px-5 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 active:scale-95"
      >
        Write a review
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex animate-fade-in items-end justify-center bg-black/50 sm:items-center sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-panel-title"
            tabIndex={-1}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[90vh] w-full max-w-lg animate-panel-in overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl outline-none sm:rounded-3xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-foodsy-red">
                  Write a review
                </p>
                <h2 id="review-panel-title" className="mt-1 font-display text-3xl font-semibold">
                  {restaurantName}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close review form"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-foodsy-ink/15 text-xl leading-none text-foodsy-ink/60 transition-colors hover:border-foodsy-red hover:text-foodsy-red"
              >
                ×
              </button>
            </div>

            <ReviewForm
              restaurantId={restaurantId}
              onSuccess={() => {
                setOpen(false);
                router.refresh();
              }}
              onCancel={() => setOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
