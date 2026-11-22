import ReviewPanel from "./review-panel";
import { fetchRestaurant } from "@/lib/api";
import type { Review } from "@/lib/types";

export const dynamic = "force-dynamic";

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function ReviewCard({ review, highlighted = false }: { review: Review; highlighted?: boolean }) {
  return (
    <article
      className={
        highlighted
          ? "rounded-3xl border-2 border-foodsy-red bg-white p-5 shadow-sm"
          : "rounded-3xl border border-foodsy-ink/10 bg-white p-5 shadow-sm"
      }
    >
      {highlighted ? (
        <p className="mb-3 inline-flex rounded-full bg-foodsy-yellow px-3 py-1 text-xs font-bold uppercase tracking-wide text-foodsy-ink">
          Latest review
        </p>
      ) : null}
      <p className="text-lg font-semibold text-foodsy-red">{review.rating} / 5</p>
      <p className="mt-2 text-base leading-relaxed">{review.comment}</p>
      <p className="mt-3 text-sm text-foodsy-ink/60">{formatWhen(review.createdAt)}</p>
    </article>
  );
}

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const restaurant = await fetchRestaurant(id);

  if (!restaurant) {
    return (
      <main className="rounded-3xl border border-foodsy-ink/10 bg-white p-6 shadow-sm">
        <h1 className="font-display text-3xl font-semibold">Restaurant not found</h1>
        <p className="mt-2 text-foodsy-ink/70">That page does not match a restaurant in Foodsy.</p>
      </main>
    );
  }

  const reviewLabel = restaurant.totalReviews === 1 ? "review" : "reviews";

  return (
    <main className="space-y-5">
      <section className="rounded-3xl border border-foodsy-ink/10 bg-white p-6 shadow-sm">
        <h1 className="font-display text-4xl font-semibold tracking-tight">{restaurant.name}</h1>
        <p className="mt-2 text-sm text-foodsy-ink/60">
          {restaurant.cuisine} · {restaurant.area}
        </p>
        <div className="mt-6 flex items-center gap-3">
          <p className="font-display text-5xl font-semibold text-foodsy-red">
            {restaurant.averageRating === null ? "—" : restaurant.averageRating}
          </p>
          {restaurant.averageRating === null ? null : (
            <span
              aria-hidden="true"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-foodsy-yellow text-2xl text-foodsy-red"
            >
              ★
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-foodsy-ink/70">Average rating</p>
        <p className="mt-4 text-base font-medium">
          {restaurant.totalReviews} {reviewLabel}
        </p>
      </section>

      {restaurant.totalReviews === 0 ? (
        <section className="rounded-3xl border border-dashed border-foodsy-ink/20 bg-white p-6 text-center shadow-sm">
          <p className="font-display text-2xl font-semibold">No reviews yet</p>
          <p className="mt-2 text-sm text-foodsy-ink/70">Be the first to share what you tasted.</p>
        </section>
      ) : (
        <>
          {restaurant.latestReview ? <ReviewCard review={restaurant.latestReview} highlighted /> : null}
          {restaurant.reviews.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-foodsy-ink/60">
                Older reviews
              </h2>
              {restaurant.reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </section>
          ) : null}
        </>
      )}

      <ReviewPanel restaurantId={Number(id)} restaurantName={restaurant.name} />
    </main>
  );
}
