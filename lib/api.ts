import { headers } from "next/headers";
import type { RestaurantDetails } from "@/lib/types";

/**
 * The browser is already talking to this app, so the server can reuse
 * that same host when it calls its own API.
 */
export async function getBaseUrl() {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "http";

  if (!host) {
    throw new Error("Could not determine the app URL.");
  }

  return `${protocol}://${host}`;
}

/** Calls GET /api/restaurants/[id]. Returns null when the API says 404. */
export async function fetchRestaurant(id: string): Promise<RestaurantDetails | null> {
  const baseUrl = await getBaseUrl();
  const response = await fetch(`${baseUrl}/api/restaurants/${id}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Could not load this restaurant.");
  }

  return response.json();
}
