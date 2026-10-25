# Glowmi AI Skincare Frontend

AI-powered skincare platform with personalized routines and product recommendations for Glowmi (KSA market).

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui, Framer Motion, GSAP
- **State & Data:** Zustand, TanStack React Query, Axios
- **Internationalization:** next-intl (Bilingual EN/AR with RTL support)
- **Forms & Validation:** React Hook Form, Zod

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (or Bun / pnpm)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/yeasin2002/glowmi.net.git
cd glowmi.net

# Install dependencies
pnpm install
# or npm install / bun install
```

### 3. Environment Variables
Copy `.env.example` to `.env` and fill in the required variables:
```bash
cp .env.example .env
```

```env
NEXT_PUBLIC_BASE_URL=https://api.example.com
```

### 4. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |
| `pnpm type-check` | Run TypeScript type checking |
| `pnpm test` | Run unit tests with Vitest |
| `pnpm test:e2e` | Run Playwright end-to-end tests |

---

## 📁 Project Structure

```
glowmi.net/
├── public/              # Static assets & icons
├── src/
│   ├── api/             # API services & endpoints
│   ├── app/             # Next.js App Router ([locale] pages & layouts)
│   ├── assets/          # Images & media assets
│   ├── components/      # UI & reusable components
│   ├── data/            # Static data & constants
│   ├── hooks/           # Custom React hooks
│   ├── i18n/            # Translations & internationalization configs
│   ├── lib/             # Utility helpers & client configurations
│   ├── store/           # Zustand state management stores
│   └── styles/          # Global styles & Tailwind CSS configs
└── package.json
```
