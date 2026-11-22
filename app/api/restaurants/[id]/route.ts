import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import type { Review } from "@/lib/types";

type ReviewRow = {
  id: number;
  rating: number;
  comment: string;
  created_at: string | Date;
};

function toReview(row: ReviewRow): Review {
  return {
    id: Number(row.id),
    rating: Number(row.rating),
    comment: row.comment,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const restaurantId = Number(id);

  if (!Number.isInteger(restaurantId) || restaurantId < 1) {
    return NextResponse.json({ error: "Restaurant not found." }, { status: 404 });
  }

  const sql = getSql();
  const restaurants = await sql`
    SELECT name, cuisine, area
    FROM restaurants
    WHERE id = ${restaurantId}
  `;

  if (restaurants.length === 0) {
    return NextResponse.json({ error: "Restaurant not found." }, { status: 404 });
  }

  const stats = await sql`
    SELECT
      ROUND(AVG(rating)::numeric, 1) AS average_rating,
      COUNT(*)::int AS total_reviews
    FROM reviews
    WHERE restaurant_id = ${restaurantId}
  `;

  const latestRows = await sql`
    SELECT id, rating, comment, created_at
    FROM reviews
    WHERE restaurant_id = ${restaurantId}
    ORDER BY created_at DESC, id DESC
    LIMIT 1
  `;

  const olderRows = await sql`
    SELECT id, rating, comment, created_at
    FROM reviews
    WHERE restaurant_id = ${restaurantId}
    ORDER BY created_at DESC, id DESC
    OFFSET 1
  `;

  const totalReviews = Number(stats[0]?.total_reviews ?? 0);
  const averageValue = stats[0]?.average_rating;
  const restaurant = restaurants[0];

  return NextResponse.json({
    name: restaurant.name,
    cuisine: restaurant.cuisine,
    area: restaurant.area,
    averageRating:
      totalReviews === 0 || averageValue === null || averageValue === undefined
        ? null
        : Number(averageValue),
    totalReviews,
    latestReview: latestRows[0] ? toReview(latestRows[0] as ReviewRow) : null,
    reviews: olderRows.map((row) => toReview(row as ReviewRow)),
  });
}
