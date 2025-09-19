# GetMeFund

A Next.js (App Router) app for creator support with Stripe payments and NextAuth authentication.

## Tech Stack
- Next.js (App Router)
- NextAuth (GitHub, Google, Facebook)
- MongoDB + Mongoose
- Stripe Elements + Payment Intents + Webhooks
- Tailwind CSS

## Prerequisites
- Node.js 18+
- MongoDB connection string
- Stripe account (test keys)
- OAuth apps for GitHub/Google/Facebook

## Environment Variables
Create `.env.local` in project root:

```
# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-strong-random-string

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster/dbname

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx  # set after running Stripe CLI

# OAuth Providers
GITHUB_ID=xxx
GITHUB_SECRET=xxx
GOOGLE_ID=xxx
GOOGLE_SECRET=xxx
FACEBOOK_ID=xxx
FACEBOOK_SECRET=xxx
```

Restart the dev server after any `.env.local` changes.

## Install & Run (Windows/PowerShell)
```
npm install
npm run dev
```

## Project Structure
- `app/` Next.js routes (App Router)
  - `app/[username]/page.js` public creator page
  - `app/login/page.js` login page
  - `app/dashboard/page.js` user dashboard (requires auth)
  - `app/api/stripe/initiate/route.js` create PaymentIntent
  - `app/api/stripe/webhook/route.js` Stripe webhook (saves payments)
  - optional: `app/api/payments/update-status` and `create-direct` (fallback writes)
- `actions/useractions.js` server actions (e.g., initiate)
- `components/` UI components (PaymentPage, Navbar, etc.)
- `models/` Mongoose models (User, Payment)
- `db/` database connection helper

## Payments (Stripe)
- Flow: Client creates intent via `/api/stripe/initiate` → Confirm with Elements → Webhook `payment_intent.succeeded` persists to DB.
- Amount is INR (paise on Stripe side). We send metadata:
  - `to_user` (username of recipient)
  - `name`
  - `message`

Important:
- Use `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in the browser or `loadStripe` will throw “.match of undefined”.
- Webhook route must read raw body: it uses `await req.text()` and `runtime='nodejs'`.

### Webhook (local testing)
In a second terminal:
```
npx stripe listen --forward-to http://localhost:3000/api/stripe/webhook
```
Copy the printed `whsec_...` into `.env.local` as `STRIPE_WEBHOOK_SECRET`, then restart `npm run dev`.

### Payment Schema Notes
Your Payment model expects fields like:
- `oid` (Stripe PaymentIntent id)
- `name`
- `to_user`
- `amount` (rupees)
- `message` (optional)
- `done` (true when succeeded)

Ensure your webhook maps metadata to these fields and sets `done: true` on success.

## Authentication (NextAuth)
Providers configured: GitHub, Google, Facebook.

- We upsert users by `email` to avoid duplicates.
- A custom `id` or `user_id` can be stored like `provider:providerAccountId`.
- In session callback, we hydrate `session.user` fields from DB (username, profilePic, id).

Facebook app setup:
- Valid OAuth Redirect URI: `http://localhost:3000/api/auth/callback/facebook`
- App Domains: `localhost`
- Website Site URL: `http://localhost:3000/`
- If the app is in Development, add your Facebook account as a Tester/Developer.

## Common Errors & Fixes
- loadStripe “.match” error: Missing `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. Add to `.env.local` and restart.
- Payments not saved:
  - Run Stripe CLI listen command.
  - Set `STRIPE_WEBHOOK_SECRET`.
  - Webhook must use `await req.text()` and verify signature.
  - Use `metadata.to_user` consistently.
- NextAuth OAuthCallback 400:
  - Redirect URI mismatch or wrong secrets.
  - Missing `NEXTAUTH_URL` or `NEXTAUTH_SECRET`.
  - Facebook app not set to include your tester account.
- E11000 duplicate email:
  - Always upsert by `email` in `signIn` callback (do not AND-query `email`+`username`).

## Scripts
- `npm run dev` – start dev server
- `npm run build` – build
- `npm start` – run production build

## Tips
- After schema changes, clear cache and restart:
  - Close dev server
  - Delete `.next` (PowerShell): `rmdir /s /q .next`
  - `npm run dev`
- Use a private window when testing OAuth to avoid stale cookies.
- The Stripe analytics endpoint `https://r.stripe.com/b` may be blocked by ad blockers; it’s not critical.

## License
MIT