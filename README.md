# Loomora — Shawl shop (Netlify + Sanity)

Online shawl store with **Sanity CMS** for products and **Netlify** for hosting.

## What changed

- **Products** → edited in **Sanity Studio** (`/studio`), not a custom database
- **Orders** → saved in Sanity when customers checkout; update shipping in `/admin` or Studio
- **Hosting** → deploy to **Netlify** (always online, no PC needed)

---

## Part 1 — Sanity (your product admin)

### 1. Create a Sanity account

1. Go to [sanity.io](https://www.sanity.io) and sign up (free).
2. Create a new project → name it e.g. **Loomora**.
3. Choose dataset **production** (default).

### 2. Copy your project ID

In Sanity dashboard → **Project settings** → copy **Project ID**.

Add to `.env`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

### 3. Create a write token (for checkout + seed)

Sanity dashboard → **API** → **Tokens** → **Add API token**

- Name: `loomora-write`
- Permissions: **Editor**

Copy token into `.env`:

```
SANITY_API_WRITE_TOKEN=sk...
```

### 4. Seed sample shawls (optional)

```bash
npm install
npm run seed:sanity
```

### 5. Open Sanity Studio locally

```bash
npm run dev
```

Open [http://localhost:3000/studio](http://localhost:3000/studio)

Log in with your Sanity account. Here you:

- Add / edit shawls (photos, price, stock)
- View orders
- Mark fulfillment status

You can also deploy Studio to `loomora.sanity.studio`:

```bash
npx sanity deploy
```

---

## Part 2 — Run locally

```bash
npm install
npm run dev
```

| Page | URL |
|------|-----|
| Store | http://localhost:3000 |
| Sanity Studio | http://localhost:3000/studio |
| Orders admin | http://localhost:3000/admin/login |

**Orders admin login:** values from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`

---

## Part 3 — Deploy on Netlify

### 1. Push code to GitHub

Create a repo and push this folder.

### 2. Connect Netlify

1. Log in at [netlify.com](https://www.netlify.com) (your friend can add you to their team).
2. **Add new site** → **Import from Git** → choose your repo.
3. Build settings (should auto-detect from `netlify.toml`):
   - Build command: `npm run build`
   - Plugin: `@netlify/plugin-nextjs`

### 3. Add environment variables

In Netlify → **Site configuration** → **Environment variables**, add:

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | From Sanity |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `SANITY_API_WRITE_TOKEN` | Sanity write token |
| `ADMIN_JWT_SECRET` | Long random string |
| `ADMIN_EMAIL` | Your admin email |
| `ADMIN_PASSWORD` | Strong password |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Optional |
| `RAZORPAY_KEY_SECRET` | Optional |
| `NEXT_PUBLIC_SITE_URL` | `https://yoursite.netlify.app` |

Click **Deploy**.

### 4. Custom domain

Netlify → **Domain management** → add your domain → follow DNS steps.

Share `https://yourdomain.com` with customers.

---

## Part 4 — Razorpay (real payments)

1. Create [Razorpay](https://razorpay.com) account.
2. Add test keys to `.env` / Netlify env vars.
3. Without keys, checkout runs in **demo mode** (for testing).

---

## Daily workflow

| Task | Where |
|------|--------|
| Add shawl, upload photos, set price | **Sanity Studio** (`/studio`) |
| See new paid orders | **Sanity Studio** or `/admin/orders` |
| Mark shipped / add tracking | `/admin/orders` or Sanity Studio |
| Rename brand, WhatsApp | `src/lib/brand.ts` |

---

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Run locally |
| `npm run build` | Production build |
| `npm run seed:sanity` | Add sample products to Sanity |
| `npx sanity deploy` | Host Studio at `*.sanity.studio` |
