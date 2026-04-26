# Yashveer Singh - Portfolio

A high-performance, responsive, and beautifully animated developer portfolio built with modern web technologies. 

## 🚀 Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Language:** TypeScript
- **Icons:** Lucide React & React Icons

## 🛠️ Local Development

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Deployment Instructions (Vercel)

This project has been migrated from **Vite to Next.js**. If you are updating an existing Vercel deployment:

1. Go to your project on the [Vercel Dashboard](https://vercel.com/dashboard).
2. Navigate to **Settings** > **General**.
3. Scroll down to **Build & Development Settings**.
4. Change the **Framework Preset** from `Vite` to `Next.js`.
5. Ensure the **Build Command** is `npm run build` and **Install Command** is `npm install`.
6. Go back to your deployments and click **Deploy** to trigger a new build with the Next.js framework.

## ✉️ Contact Backend
If you are using the separate contact API:
1. Navigate to the `server/` directory.
2. Run `npm install` and `npm start` to run the Express backend.
3. Make sure to configure your `.env` variables (`EMAIL_USER`, `EMAIL_PASS`, etc.) on your hosting provider (like Render).
