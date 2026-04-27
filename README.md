# Yashveer Singh - Developer Portfolio 🚀

A high-performance, interactive, and beautifully animated developer portfolio built with modern web technologies. This portfolio features a completely custom WebGL 3D background, advanced scroll animations, and a fully integrated backend for contact form handling.

## ✨ Key Features

- **Interactive 3D WebGL Background**: Custom simplex noise shaders and fluid dynamics built with `@react-three/fiber` and `three.js`.
- **Advanced Animations**: Fluid layout transitions, scroll progress tracking, and staggered character reveal animations using `framer-motion`.
- **Fully Integrated Backend**: The contact form is powered by Next.js App Router API Routes (`src/app/api/contact/route.ts`), securely saving messages to **MongoDB** and sending automated HTML emails via **Nodemailer**.
- **Smooth Scrolling**: Implemented seamless anchor hash navigation.
- **Responsive & Premium Design**: Custom cursors, glassmorphism overlays, and tailored mobile navigation layouts.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS (Custom utilities and variables)
- **Animations:** Framer Motion
- **3D Graphics:** React Three Fiber & Three.js
- **Database:** MongoDB (Mongoose)
- **Email Delivery:** Nodemailer
- **Analytics:** Vercel Analytics

## 🛠️ Local Development

First, clone the repository and install the dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory and configure the following variables to enable the contact form functionality:

```env
# MongoDB Connection String (For saving contact messages)
MONGO_URI=your_mongodb_connection_string

# Email Configuration (For sending/receiving notifications)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Run the App

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Deployment Instructions (Vercel)

This project is optimized for deployment on Vercel. Since the contact form uses Next.js serverless functions, no external Express backend is needed!

1. Go to your project on the [Vercel Dashboard](https://vercel.com/dashboard).
2. Ensure the **Framework Preset** is set to `Next.js`.
3. Go to **Settings > Environment Variables** and add your `MONGO_URI`, `EMAIL_USER`, and `EMAIL_PASS`.
4. Trigger a deployment. Your Next.js app and Contact API route will securely deploy together!

---
*Designed & Built by Yashveer Singh*
