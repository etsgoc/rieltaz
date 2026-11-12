# Listing blueprints for data/properties.json

JSON cannot hold comments, so the templates live here. Copy one, paste it into the `projects` list, change the values.
Raise `version` at the top of the file every time you change anything, otherwise the live site can keep showing an older copy.

The page layout is chosen from what a listing contains:
- units in the `units` list: unit picker and payment plan
- a `rental` block: stay terms
- an `investment` block: renovation deal table
- none of those: price, facts, amenities, tour and map

Fields every listing needs: `id` (unique, lowercase, no spaces), `name`, `category`, `location`, `ownership`, `pricing`, `media`, `status`.
Everything else is optional and the page hides rows you leave out.

## 1. Resale home (not Phuket, own currency)
```json
{
  "id": "lisbon-chiado-loft",
  "name": "Chiado Loft",
  "category": "resale",
  "featured": true,
  "status": "available",
  "tagline": "One line shown under the name",
  "summary": "Two or three sentences about the property.",
  "location": { "area": "Chiado", "city": "Lisbon", "country": "Portugal", "lat": 38.7109, "lng": -9.1409 },
  "ownership": ["freehold"],
  "pricing": { "from": 485000, "currency": "EUR" },
  "facts": { "bedrooms": 2, "bathrooms": 2, "area": 96, "year": 2018, "plot": 0, "parking": 1 },
  "amenities": ["Lift", "Balcony"],
  "media": { "cover": "https://...", "gallery": ["https://..."], "tour360": null }
}
```
`currency` can be any code in `rates` (THB, EUR, USD, GBP, PLN, IDR). Add a rate there for a new currency. `tour360` can be `{ "type": "pano", "url": "https://...jpg" }` or `{ "type": "embed", "url": "https://..." }`.

## 2. Rental or Airbnb find
Same as above with `"category": "rental"`, `ownership: []`, `pricing.from` equal to the nightly or monthly price, plus:
```json
"facts": { "bedrooms": 3, "bathrooms": 3, "guests": 6, "area": 220 },
"rental": {
  "nightly": 210, "monthly": 0, "currency": "USD",
  "minNights": 3, "cleaningFee": 40, "deposit": 300,
  "occupancyPct": 78, "rating": 4.9, "reviews": 214,
  "source": "Airbnb", "sourceUrl": "https://...", "availableFrom": "2027-01-15",
  "rules": ["No parties", "Check in after 14:00"]
}
```
Use `nightly` for short stays, `monthly` for long lets. Leave out what you do not know.

## 3. Renovation or investor project
Same base with `"category": "investment"`, plus:
```json
"investment": {
  "purchasePrice": 320000, "renovationBudget": 140000, "afterRepairValue": 640000, "currency": "EUR",
  "strategy": "Renovate and sell", "timelineMonths": 9,
  "targetRaise": 460000, "raised": 275000, "minTicket": 25000,
  "scope": ["Structural repairs", "New kitchen"]
}
```
Gross profit and return are calculated for you from the three prices. Set `roiPct` only to override the calculation.

## 4. New development with units (Phuket style)
```json
{
  "id": "the-element", "name": "The Element by Anocha", "category": "new-build", "featured": true, "status": "selling",
  "location": { "area": "Kamala", "city": "Phuket", "country": "Thailand", "lat": 7.95, "lng": 98.28 },
  "ownership": ["leasehold", "freehold"],
  "paymentPlan": "element", "fees": "element",
  "pricing": { "from": 4480500, "currency": "THB" },
  "priceNote": "Shown under the payment plan. Put the price list validity and what is excluded here.",
  "leaseTerms": "30 years, two 30 year renewals", "handover": "Q4 2028", "furnished": true,
  "media": { "cover": "https://...", "gallery": [], "tour360": null }
}
```
Then add one entry per unit to the top level `units` list:
```json
{
  "id": "A104", "projectId": "the-element", "tower": "A", "floor": 1,
  "type": "2 Bedroom", "sqm": 48.78, "pricePerSqm": 140000, "price": 6829200,
  "prices": { "leasehold": 6829200, "freehold": 7853580 },
  "status": "available",
  "style": "Investment style unit", "view": "Garden", "plan": "element-a"
}
```
- `status`: `available`, `reserved` (on hold) or `sold`. Only available units are offered.
- `price` is the default price. `prices` is only needed when ownership types cost different amounts.
- `plan` is only needed when one unit follows a different payment plan than the project.
- `paymentPlans` and `feeSchedules` at the top of the file define the payment steps and fees. `paymentPlan` and `fees` on the project point at them by name.
- Cards, ranges, "from" price and unit counts are all worked out from the units, so you do not repeat them on the project.

## 5. Developer project without a price list yet
Use the new development blueprint without any units. The page then shows facts, tour and map, and the price reads "Price on request".

## Choosing between payment plans
When a developer offers more than one plan, add each to `paymentPlans` with a `name`, then list the extra ones on the project:
```json
"paymentPlan": "everprime",
"altPaymentPlans": ["everprime-installments"]
```
Buyers then get a plan dropdown. A unit with its own `plan` skips the choice.

## Photos and 360 tours
Do not type image paths by hand. Put files in `web/public/images/<listing id>/` and run `node scripts/sync-media.mjs`. Files named `cover.*` become the cover and `360.*` or `pano*` becomes the 360 tour.
