-- Foodsy stores facts only.
-- Average rating, review count, and the latest review are calculated
-- by the API when someone asks for them. They are not columns.

CREATE TABLE IF NOT EXISTS restaurants (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  cuisine TEXT NOT NULL,
  area TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO restaurants (name, cuisine, area)
SELECT 'Sharma Sweets', 'Sweets', 'Sector 32'
WHERE NOT EXISTS (
  SELECT 1 FROM restaurants WHERE name = 'Sharma Sweets' AND area = 'Sector 32'
);

INSERT INTO reviews (restaurant_id, rating, comment, created_at)
SELECT restaurant.id, seed.rating, seed.comment, seed.created_at
FROM restaurants AS restaurant
CROSS JOIN (
  VALUES
    (5, 'The motichoor laddoo is unreal.', NOW() - INTERVAL '3 days'),
    (4, 'Great sweets, but the queue is slow.', NOW() - INTERVAL '2 days'),
    (4, 'Solid. Would order again.', NOW() - INTERVAL '1 hour')
) AS seed(rating, comment, created_at)
WHERE restaurant.name = 'Sharma Sweets'
  AND restaurant.area = 'Sector 32'
  AND NOT EXISTS (
    SELECT 1 FROM reviews WHERE reviews.restaurant_id = restaurant.id
  );
