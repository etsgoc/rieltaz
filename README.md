# Reeltaz

Properties from anywhere in the world in one place: new developments, resale homes, rentals and stays, and renovation projects for investors. Visitors need no account. They find a property and call, message on WhatsApp or email you from the listing.

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

## 1. Contact, no backend
The website and the app have no login and no database. Edit the `contact` and `agent` blocks in `data/properties.json`:
```
"contact": { "phone": "...", "email": "...", "whatsapp": "...", "hours": "...", "city": "...", "formEndpoint": "", "formKey": "" }
```
Call, WhatsApp and email buttons work on their own. The enquiry form opens the visitor's email app with the message written. For a form that posts straight to you, create a free Formspree or Web3Forms form and paste its URL in `formEndpoint` (and the access key in `formKey` for Web3Forms).
`supabase/` and `admin/` are no longer used by the website or the app. Keep or delete them.

## 2. Run the apps
```
cd web     && cp .env.example .env && npm install && npm run dev
cd admin   && cp .env.example .env && npm install && npm run dev
cd mobile  && cp .env.example .env && npm install && npx expo install --fix && npx expo start
```

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

## Listing types
Each project in `data/properties.json` has a `category`: `new-build`, `resale`, `rental` or `investment`. The page layout follows the content:
- Units in the `units` list: unit picker and payment plan (new developments).
- A `rental` block: stay terms, rating, house rules (Airbnb style finds and long lets).
- An `investment` block: purchase, renovation budget, value after renovation, return, funding progress.
- Anything else: price, facts, amenities, 360 tour, map.
`facts` (bedrooms, bathrooms, area, guests, plot, year) feed the cards. `location.country` groups listings by place. `hero.image` replaces the home page picture. `rates` is only used to sort listings priced in different currencies.

## Hosting free on GitHub
`.github/workflows/deploy-web.yml` builds `web/` and publishes it with GitHub Pages. Set Settings, Pages, Source to GitHub Actions. Note that GitHub says Pages is not meant for sites mainly handling commercial transactions. Cloudflare Pages is free too and builds the same folder (root `web`, build `npm run build`, output `dist`).

## Data and images live in this repo
- Listings: `data/properties.json`. The website bundles it at build time. Website and mobile app also read `https://raw.githubusercontent.com/etsgoc/rieltaz/main/data/properties.json`, so a push is enough to update listings. Raise `version` on every change. The repo must be public for the app to read it. If it is private the app falls back to the copy bundled in its last build.
- Images: put photos in `web/public/images/<imageFolder>/` (the folder name is `imageFolder` in the JSON, or the listing id). Every sub folder becomes a photo area on the listing page (Kitchen, Pool, a unit type). Name a cover `cover.jpg`. Then run `node scripts/sync-media.mjs` from the repo root. It fills `media` for every listing and raises `version`. Commit the images and the JSON together.
- Big renders from Google Drive: open `scripts/colab/rieltaz-copy-renders.ipynb` in Google Colab. It copies the three RENDERS folders, shrinks them to web size, pushes them to this repo and runs the sync.
- 360 tours hosted elsewhere: add them to `media.tours` in the JSON, see `data/BLUEPRINTS.md`.
- Image links use `mediaBase` in the JSON (raw.githubusercontent.com of this repo). Compress photos first, around 1600 px wide as WebP or JPEG, to keep pages fast.
