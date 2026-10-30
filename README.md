# Rieltaz

One brand for every developer you work with. Residences, reservations with a call to the developer, and a services marketplace (transfers, flights, visas, rentals and more).

```
data/properties.json     listings, payment plans, fees, services, partners, feature switches (edit this)
packages/core            shared code: catalog loader, quote maths, services and order helpers, translations
supabase/schema.sql      run once in the Supabase SQL editor
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

## 5. Deploying
- Web and admin: Vercel, Netlify or Cloudflare Pages. Root directory `web` or `admin`, build `npm run build`, output `dist`. Redirect files for single page routing are included.
- Mobile: `eas build` from the `mobile` folder.

## Notes
- The reservation price is sent by the client. Check it against your price list in the admin before accepting.
- Polish and Thai cover the main screens. Anything missing falls back to English. Have a native speaker check them before launch.
- Dark theme background is `#1e1e1e`.
