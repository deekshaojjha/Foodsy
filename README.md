# Foodsy

**Find. Taste. Share.**

A small restaurant review app: write a review, then see a restaurant page with its
average rating and every review.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Neon PostgreSQL with `@neondatabase/serverless`
- Raw SQL only — no ORM

## How it works

The database stores facts only: restaurants and reviews. Values such as the average
rating, total review count and latest review are calculated by the API every time the
restaurant page asks for them. They are never stored as columns.

```
Browser -> GET /api/restaurants/1 -> SQL AVG / COUNT / ORDER BY -> JSON -> React
Browser -> POST /api/reviews       -> validation -> INSERT          -> redirect
```

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and paste your Neon connection string:

   ```env
   DATABASE_URL=postgresql://USER:PASSWORD@HOST/neondb?sslmode=require
   ```

3. Create the two tables and seed the sample restaurant and reviews:

   ```bash
   npm run db:setup
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open <http://localhost:3000/restaurant/1>.

## Routes

| Route | Purpose |
| --- | --- |
| `/restaurant/[id]` | Restaurant details, average rating and reviews |
| `/review/[restaurantId]` | Write a review |
| `GET /api/restaurants/[id]` | Restaurant details as JSON |
| `POST /api/reviews` | Validate and insert one review |

## Deploy

Import the GitHub repository into Vercel, add `DATABASE_URL` as an environment
variable, and deploy. The database already contains the schema and seed data.
