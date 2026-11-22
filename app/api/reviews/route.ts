import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";

type ReviewRequest = {
  restaurantId?: unknown;
  rating?: unknown;
  comment?: unknown;
};

export async function POST(request: Request) {
  let body: ReviewRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const { restaurantId, rating, comment } = body;

  if (
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return NextResponse.json(
      { error: "Rating must be a whole number between 1 and 5." },
      { status: 400 }
    );
  }

  if (typeof comment !== "string" || comment.trim().length === 0) {
    return NextResponse.json(
      { error: "Comment must be a non-empty string." },
      { status: 400 }
    );
  }

  if (
    typeof restaurantId !== "number" ||
    !Number.isInteger(restaurantId) ||
    restaurantId < 1
  ) {
    return NextResponse.json(
      { error: "Restaurant ID must refer to an existing restaurant." },
      { status: 400 }
    );
  }

  const sql = getSql();
  const restaurants = await sql`
    SELECT id FROM restaurants WHERE id = ${restaurantId}
  `;

  if (restaurants.length === 0) {
    return NextResponse.json(
      { error: "Restaurant ID must refer to an existing restaurant." },
      { status: 400 }
    );
  }

  const inserted = await sql`
    INSERT INTO reviews (restaurant_id, rating, comment)
    VALUES (${restaurantId}, ${rating}, ${comment.trim()})
    RETURNING id
  `;

  return NextResponse.json(
    { success: true, reviewId: inserted[0].id },
    { status: 201 }
  );
}
