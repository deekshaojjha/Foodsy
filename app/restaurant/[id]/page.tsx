import Reveal from "../../components/reveal";
import StarRow from "../../components/star-row";
import RatingCount from "./rating-count";
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
      className={`rounded-3xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
        highlighted
          ? "border-2 border-foodsy-yellow bg-foodsy-yellow-soft"
          : "border border-foodsy-line bg-foodsy-paper"
      }`}
    >
      {highlighted ? (
        <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-foodsy-red px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-foodsy-yellow" />
          Latest review
        </p>
      ) : null}
      <div className="flex items-center gap-2">
        <StarRow rating={review.rating} />
        <span className="text-sm font-semibold text-foodsy-muted">{review.rating}/5</span>
      </div>
      <p className="mt-3 text-base leading-relaxed">{review.comment}</p>
      <p className="mt-3 text-sm text-foodsy-muted">{formatWhen(review.createdAt)}</p>
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
      <main className="animate-fade-up rounded-3xl border border-foodsy-line bg-foodsy-paper p-6 shadow-sm">
        <h1 className="font-display text-3xl font-semibold">Restaurant not found</h1>
        <p className="mt-2 text-foodsy-muted">That page does not match a restaurant in Foodsy.</p>
      </main>
    );
  }

  const reviewLabel = restaurant.totalReviews === 1 ? "review" : "reviews";

  return (
    <main className="space-y-5">
      {/* 1-4. Name, cuisine and area, average rating, total reviews */}
      <section className="animate-fade-up overflow-hidden rounded-[2rem] border border-foodsy-line bg-foodsy-paper shadow-sm">
        <div className="bg-gradient-to-br from-foodsy-yellow to-[#FFB800] px-6 pb-7 pt-6">
          <h1 className="font-display text-4xl font-semibold tracking-tight">{restaurant.name}</h1>
          <p className="mt-3 inline-flex rounded-full bg-white/60 px-3 py-1 text-sm font-medium">
            {restaurant.cuisine} · {restaurant.area}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-4">
            <p className="font-display text-6xl font-semibold leading-none text-foodsy-red">
              <RatingCount value={restaurant.averageRating} />
            </p>
            {restaurant.averageRating === null ? null : (
              <span
                aria-hidden="true"
                style={{ animationDelay: "350ms" }}
                className="flex h-12 w-12 animate-pop items-center justify-center rounded-full bg-foodsy-yellow text-2xl text-foodsy-red shadow-sm"
              >
                ★
              </span>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-foodsy-muted">
              {restaurant.averageRating === null ? "No ratings yet" : "Average rating"}
            </p>
            <p className="mt-1 inline-flex rounded-full bg-foodsy-yellow-soft px-3 py-1 text-sm font-semibold">
              {restaurant.totalReviews} {reviewLabel}
            </p>
          </div>
        </div>
      </section>

      {restaurant.totalReviews === 0 ? (
        <section
          style={{ animationDelay: "150ms" }}
          className="animate-fade-up rounded-3xl border border-dashed border-foodsy-line bg-foodsy-paper p-8 text-center shadow-sm"
        >
          <p aria-hidden="true" className="text-4xl">
            🍽️
          </p>
          <p className="mt-2 font-display text-2xl font-semibold">No reviews yet</p>
          <p className="mt-2 text-sm text-foodsy-muted">Be the first to share what you tasted.</p>
        </section>
      ) : (
        <>
          {/* 5. Latest review */}
          {restaurant.latestReview ? (
            <Reveal>
              <ReviewCard review={restaurant.latestReview} highlighted />
            </Reveal>
          ) : null}

          {/* 6. Older reviews */}
          {restaurant.reviews.length > 0 ? (
            <section className="space-y-3">
              <Reveal>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-foodsy-muted">
                  Older reviews
                </h2>
              </Reveal>
              {restaurant.reviews.map((review, index) => (
                <Reveal key={review.id} delay={(index % 3) * 90}>
                  <ReviewCard review={review} />
                </Reveal>
              ))}
            </section>
          ) : null}
        </>
      )}

      {/* 7. Write a review */}
      {/* Never hidden by scroll animation: the main action must always be visible. */}
      <div style={{ animationDelay: "250ms" }} className="animate-fade-up pb-4">
        <ReviewPanel restaurantId={Number(id)} restaurantName={restaurant.name} />
      </div>
    </main>
  );
}
