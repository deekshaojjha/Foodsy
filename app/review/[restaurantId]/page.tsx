import { fetchRestaurant } from "@/lib/api";
import ReviewForm from "./review-form";

export const dynamic = "force-dynamic";

export default async function WriteReviewPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;

  if (!/^\d+$/.test(restaurantId)) {
    return (
      <main className="rounded-3xl border border-foodsy-ink/10 bg-white p-6 shadow-sm">
        <h1 className="font-display text-3xl font-semibold">Restaurant not found</h1>
      </main>
    );
  }

  const restaurant = await fetchRestaurant(restaurantId);

  if (!restaurant) {
    return (
      <main className="rounded-3xl border border-foodsy-ink/10 bg-white p-6 shadow-sm">
        <h1 className="font-display text-3xl font-semibold">Restaurant not found</h1>
        <p className="mt-2 text-foodsy-ink/70">You can only review a restaurant that exists.</p>
      </main>
    );
  }

  return (
    <main className="rounded-3xl border border-foodsy-ink/10 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-foodsy-red">Write a review</p>
      <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">{restaurant.name}</h1>
      <ReviewForm restaurantId={Number(restaurantId)} />
    </main>
  );
}
