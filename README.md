# DaxFi Frontend

This is the frontend for DaxFi, a Next.js app built using [`pnpm`](https://pnpm.io) and [`nvm`](https://github.com/nvm-sh/nvm) to ensure consistent environments across developers and CI.

## ⚙️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/DaxFi/Frontend.git
cd Frontend
```

### 2. Use the correct Node version

This project uses `.nvmrc` to lock the Node.js version:

```bash
nvm use
```

If you don't have `nvm` installed, follow: https://github.com/nvm-sh/nvm#installing-and-updating

### 3. Install dependencies (with `pnpm`)

> ❗ Do **not** use `npm install` or `yarn install`. This project uses `pnpm` exclusively.

```bash
pnpm install
```

### 4. Start the development server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app in your browser.

## ✏️ Development Notes

- Styling uses TailwindCSS + Material Tailwind
- Fonts are loaded via [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [pnpm Documentation](https://pnpm.io/motivation)

## 🚀 Deployment

- TODO

## 🛑 Troubleshooting

- Do **not** use `npm` — it will generate a `package-lock.json` and break workspace compatibility
- If you see a `"workspace:"` error, you're probably using the wrong package manager
