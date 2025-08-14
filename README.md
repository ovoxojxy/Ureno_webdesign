## URENO – AI‑assisted home renovation marketplace

A React + Vite single‑page app that helps homeowners and contractors plan renovations. It features AI design assistance (chat + image generation), product browsing (flooring and paint), project management, messaging, and basic commerce (cart/saved items). The app is deployed to GitHub Pages and can also be hosted on Firebase.

### Live site
- Visit: [Ureno on GitHub Pages](https://ovoxojxy.github.io/Ureno_webdesign/)
- Note: All routes are served under the base path `/Ureno_webdesign/`.

### What you’re seeing
- Home and marketing sections
- Product browsing: Flooring and Paint (with color families and detail pages)
- AI Designer: Chat with an assistant for renovation ideas
- AI Image: Generate concept images from prompts
- Auth: Sign in/up (Google or email/password) and edit profile
- Role‑based dashboards: Contractor dashboard, Available Projects, Project requests/inquiries
- Messaging: Conversations and message view
- Cart and Saved items

Example routes (under `/Ureno_webdesign/`):
- `/` (home)
- `/product-page` (flooring), `/paint-page`, `/productDetail/:productId`, `/colorDetail/:colorId`
- `/TestChat` (AI chat), `/TestImage` (AI image)
- `/projects`, `/projects/new`, `/projects/view/:projectId`
- `/messages`, `/cart`, `/sign-in`, `/sign-up`

---

## Tech stack
- Frontend: React 18, Vite 6, React Router, Tailwind CSS, MUI, HeroUI
- UX/Media: GSAP, ScrollMagic, Three.js
- State/Utils: TanStack Router Devtools, shadcn/ui style primitives
- Backend (local dev): Express server (proxy for OpenAI)
- Cloud: Firebase (Auth, Firestore, Hosting; Cloud Functions optional)
- AI: OpenAI Chat Completions + Images API (proxied via server or Firebase Functions)

---

## Local development

### Prerequisites
- Node.js 18+
- npm

### 1) Install dependencies
```bash
npm install
```

### 2) Environment variables
Create a `.env` file in the project root for the frontend:
```bash
# Frontend (Vite)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

Create `server/.env` for the local API proxy:
```bash
# Server (Express)
OPENAI_API_KEY=
```

If using Firebase Functions in the cloud, set `OPENAI_API_KEY` in Functions config instead of a file.

### 3) Start the app (frontend + API)
```bash
npm run dev
```
- Frontend: http://localhost:5173/Ureno_webdesign/
- API proxy: http://localhost:3000 (Vite proxies `/api` → server)

If you want to run them separately:
```bash
npm run dev:vite     # frontend only
npm run dev:server   # API only
```

---

## API endpoints (local dev)
- `POST /api/ask-openai` → Chat response (OpenAI chat completions)
- `POST /api/generate-image` → Image URL (OpenAI images)

These are defined under `server/routes/api.js` and use helpers in `server/askOpenAI.js` and `server/generateImage.js`.

---

## Build & deploy

### GitHub Pages
The project is configured for GitHub Pages with the base path `/Ureno_webdesign/`.
```bash
npm run build
cp dist/index.html dist/404.html   # SPA fallback
npm run deploy                     # publishes to gh-pages branch
```
Live URL: https://ovoxojxy.github.io/Ureno_webdesign/

### Firebase Hosting (optional)
```bash
npm run build
firebase deploy
```
- Hosting serves `dist/` with SPA rewrites
- Functions (optional) live under `functions/`

---

## Troubleshooting
- Blank screen locally: Make sure you open the app at `/Ureno_webdesign/` (Vite `base` and Router `basename` are set).
- Direct links on GitHub Pages 404: Ensure `404.html` exists in `dist/` (the deploy step above adds this).
- API errors: Confirm `OPENAI_API_KEY` in `server/.env` and that the local server is running on port 3000.
- Port in use: Check `lsof -nP -iTCP:3000 -sTCP:LISTEN` and kill the conflicting process.

---

## Project structure (selected)
- `src/` – React app (components, pages, contexts, firebase init)
- `server/` – Express API proxy for OpenAI
- `functions/` – Optional Firebase Cloud Functions
- `dataconnect/` – Firebase Data Connect scaffold (optional/WIP)

---

## Scripts
- `npm run dev` – start Vite and the local Express API
- `npm run build` – production build
- `npm run preview` – preview built site
- `npm run deploy` – publish `dist/` to GitHub Pages
- `npm run deploy:firebase` – build then deploy to Firebase Hosting

---

Made with React, Vite, and Firebase. AI features powered by OpenAI.
