# Solar At Night

Next.js MVP for demand validation of night-time solar purchasing interest.

## Scope Lock (Current Website MVP)

This repository is strictly a customer-interest validation MVP.

Primary objective:
- Capture demand signal from solar farm owners/operators for nighttime solar energy if cost-competitive.

In scope:
- Landing page decision capture (`Yes` / `Maybe` / `No`)
- Contact capture flow
- Duplicate-response prevention
- Basic analytics and conversion tracking

Out of scope for this website MVP:
- Orbital reflection physics simulation
- Satellite control software
- Constellation/orbit computation
- Detailed technical feasibility modeling

Note on background materials:
- The orbital system PRD (for example, `Orbital_Solar_PRD.docx`) is background context only and does not define implementation scope for this web app.

## Setup

1. Install dependencies:
   npm install
2. Copy env file:
   cp .env.example .env.local
3. Fill values in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `FINGERPRINT_SALT` (random secret)
   - `NEXT_PUBLIC_LINKEDIN_URL` (optional, used on `/technology`)
4. Run SQL in your Supabase SQL editor:
   - `supabase/schema.sql`
5. Start app:
   npm run dev

## API

- `GET /api/check-ip` -> checks if current visitor fingerprint already submitted
- `POST /api/response` -> stores Yes/Maybe/No if no existing fingerprint
- `POST /api/contact` -> stores name/email/company/comment linked to response

## Routes

- `/` demand capture landing page
- `/technology` optional credibility page (schematic + simulation placeholder)
- `/investment` optional investor interest form (reuses `POST /api/contact`)

## Notes

- Dedupe uses a SHA-256 hash of `IP + user-agent + FINGERPRINT_SALT`.
- Raw IP and user-agent are also stored in `responses` for analysis.
- Vercel analytics tracks: already-responded seen, vote submitted, contact submitted.

## Deploy (Vercel)

1. Import repo in Vercel:
   - `https://github.com/blwilliams0/Entrep-Class-SBSP-Site.git`
2. Framework preset:
   - Next.js (auto-detected)
3. Add environment variables in Vercel for Production (and Preview if needed):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `FINGERPRINT_SALT`
   - `NEXT_PUBLIC_LINKEDIN_URL` (optional)
4. Deploy from `main`.

## Production Smoke Test

After deploy, replace `<prod-url>` and run:

```bash
curl -i https://<prod-url>/api/check-ip
curl -i -X POST https://<prod-url>/api/response -H "Content-Type: application/json" -d '{"response":"Yes"}'
curl -i -X POST https://<prod-url>/api/contact -H "Content-Type: application/json" -d '{"name":"Test User","email":"test@example.com","company":"Solar Co"}'
```

Expected behavior:
- First vote returns `201`.
- Repeating vote from same IP+UA returns `409`.
- Contact submit returns `201`.
- New rows appear in Supabase `responses` and `contacts`.
