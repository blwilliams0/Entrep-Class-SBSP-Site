# Solar At Night

Next.js MVP for demand validation of night-time solar purchasing interest.

## Setup

1. Install dependencies:
   npm install
2. Copy env file:
   cp .env.example .env.local
3. Fill values in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `FINGERPRINT_SALT` (random secret)
4. Run SQL in your Supabase SQL editor:
   - `supabase/schema.sql`
5. Start app:
   npm run dev

## API

- `GET /api/check-ip` -> checks if current visitor fingerprint already submitted
- `POST /api/response` -> stores Yes/Maybe/No if no existing fingerprint
- `POST /api/contact` -> stores name/email/company linked to response

## Notes

- Dedupe uses a SHA-256 hash of `IP + user-agent + FINGERPRINT_SALT`.
- Raw IP and user-agent are also stored in `responses` for analysis.
- Vercel analytics tracks: already-responded seen, vote submitted, contact submitted.