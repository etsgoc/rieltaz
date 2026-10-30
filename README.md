# Reeltaz

One brand for every developer you work with. Residences, reservations with a call to the developer, and a services marketplace (transfers, flights, visas, rentals and more).

```
data/properties.json     listings, payment plans, fees, services, partners, feature switches (edit this)
packages/core            shared code: catalog loader, quote maths, services and order helpers, translations
supabase/schema.sql      run once in the Supabase SQL editor
supabase/emails.sql      email triggers (optional, see Emails)
supabase/functions/notify  the email function (optional)
web/                     website            (Vite, React, React Router)
admin/                   admin dashboard    (Vite, React, React Router)
mobile/                  app                (Expo, Expo Router)
brand/                   icon generator (python3 brand/render.py)
```

Web, admin and mobile are separate apps with their own `package.json`. They share `packages/core` and `data/`, so keep the whole folder in one git repo.

## 1. Supabase
1. Create a project and run `supabase/schema.sql`.
2. Sign up once in the website, then make yourself admin in the SQL editor:
   `update profiles set role = 'admin' where email = 'you@example.com';`

## 2. Run the apps
```
cd web     && cp .env.example .env && npm install && npm run dev
cd admin   && cp .env.example .env && npm install && npm run dev
cd mobile  && cp .env.example .env && npm install && npx expo install --fix && npx expo start
```
Fill the two Supabase values in each `.env`. Web and admin also work without them (browse only).

## 3. Listings data
The catalog is bundled into every app, so listings always load. At runtime the apps try, in order: a fresh local copy, `CATALOG_URL`, the backup URL, the GitHub copy, then the bundled one. A remote file is only used when its `version` is the same or higher than the bundled one. After editing `data/properties.json`, raise `version`, push it to your GitHub repo and the apps pick it up within 30 minutes.

- Media: use any image URL, or a Google Drive file id (set as "anyone with the link").
- 360 view: `"tour360": { "type": "pano", "url": "..." }` for a flat equirectangular image (interactive viewer), or `"type": "embed"` for a Matterport or Drive preview link. The sample URLs are public test panoramas, not your properties.
- Pictures in the sample file come from picsum.photos and are placeholders.

## 4. Services, tickets and payments
Services live in `properties.json` (`serviceCategories`, `services`, `partners`). A customer sends a request, you quote and confirm it in the admin under **Service orders**, and a ticket code (`RT-XXXXXXXX`) is created when the status becomes Confirmed. The admin shows your share and the partner share for each order (`splitAmount` in `packages/core/src/services.ts`).

Two switches in `properties.json`:
```
"features": { "services": true, "onlinePayments": false }
```
- `services: false` hides the Services tab on web and mobile.
- `onlinePayments: true` shows the Pay button. Implement a provider in `packages/core/src/payments.ts` (Stripe Connect or similar, which can split the payout) and call it from `OrderTicket`.

## 5. Emails
Emails are optional and use Resend (free plan: 3,000 emails a month, 100 a day) through one Supabase Edge Function.

1. Create a Resend account, add your domain and copy an API key. Without a verified domain Resend only delivers to your own address.
2. Install the Supabase CLI and, from the repo root, run:
   ```
   supabase link --project-ref YOUR_PROJECT_REF
   supabase secrets set RESEND_API_KEY=... FROM_EMAIL="Reeltaz <hello@yourdomain.com>" ADMIN_EMAIL=you@yourdomain.com WEBHOOK_SECRET=choose-a-long-random-string SITE_URL=https://yourdomain.com
   supabase functions deploy notify --no-verify-jwt
   ```
3. In `supabase/emails.sql` replace `YOUR_PROJECT_REF` and `YOUR_SECRET` (same value as `WEBHOOK_SECRET`), then run it in the SQL editor.

You get an email for each new reservation, call request, service request and message. Customers get an email when a request arrives, when you add a Meet link, when a stage changes, and when a service is confirmed (with the ticket code).

## 6. Legal pages and cookies
Terms, privacy, refund and cookie pages are generated from `packages/core/src/legal.ts` and show on web (`/legal/...`) and in the mobile Account tab. Set your real company name, email and address in the `legal` block of `data/properties.json`. They are a sensible starting template, so have a lawyer review them before launch. The website asks for cookie consent and loads maps and 360 tours only after the visitor allows it.

## 7. Deploying
- Web and admin: Vercel, Netlify or Cloudflare Pages. Root directory `web` or `admin`, build `npm run build`, output `dist`. Redirect files for single page routing are included.
- Mobile: `eas build` from the `mobile` folder.

## Notes
- The reservation price is sent by the client. Check it against your price list in the admin before accepting.
- Polish and Thai cover the main screens. Anything missing falls back to English. Have a native speaker check them before launch.
- Dark theme background is `#1e1e1e`.
- The admin Listings page edits unit prices, availability, services and the feature switches, then downloads a new `properties.json` for you to commit.
- Saved properties are stored on the device (web and mobile). No account needed.
- `npm run build` in `web` also regenerates `public/sitemap.xml` and `robots.txt` from the catalog, using `VITE_SITE_URL`.
