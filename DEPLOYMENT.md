# 🚀 Deployment Guide for MusePlay

Your project is **fully configured** for free cloud deployment.
Follow these steps exactly to get your app live.

---

## Phase 1: The Database (PostgreSQL)
We need a persistent database in the cloud.

1.  **Sign up** for [Neon.tech](https://neon.tech) (Free Tier).
2.  **Create a Project**: Name it `museplay-db`.
3.  **Copy Connection String**: It will look like:
    `postgres://alex:password123@ep-cool-frog-123456.us-east-2.aws.neon.tech/neondb?sslmode=require`
    *Keep this safe, you will need it for the Backend.*

---

## Phase 2: The Backend (Render.com)
We will host the Node.js server here.

1.  **Sign up** for [Render.com](https://render.com).
2.  Click **New +** -> **Web Service**.
3.  **Connect GitHub**: Select your `museplay` repository.
4.  **Configure Settings**:
    *   **Name**: `museplay-api`
    *   **Region**: Choose one close to you (e.g., Singapore, Frankfurt).
    *   **Branch**: `main`
    *   **Root Directory**: `.` (Leave as default)
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install && npx prisma generate`
    *   **Start Command**: `node backend/server.js`
    *   **Instance Type**: Free
5.  **Environment Variables** (Scroll down to "Advanced"):
    *   Key: `DATABASE_URL`
    *   Value: *(Paste your Neon Connection String from Phase 1)*
6.  Click **Create Web Service**.
7.  **Wait**: It will take a few minutes. Once it says "Live", copy the URL at the top (e.g., `https://museplay-api.onrender.com`).

---

## Phase 3: The Frontend (Vercel)
We will host the React UI here.

1.  **Sign up** for [Vercel.com](https://vercel.com).
2.  Click **Add New...** -> **Project**.
3.  **Import Git Repository**: Select `museplay`.
4.  **Configure Project**:
    *   **Framework Preset**: Vite (should be auto-detected).
    *   **Root Directory**: `.` (Leave as default)
5.  **Environment Variables**:
    *   Key: `VITE_API_BASE_URL`
    *   Value: *(Paste your Render Backend URL from Phase 2)*
        *   **IMPORTANT**: Add `/api` at the end.
        *   Example: `https://museplay-api.onrender.com/api`
6.  Click **Deploy**.
7.  **Wait**: Once done, you will get a domain (e.g., `https://museplay.vercel.app`). Copy this.

---

## Phase 4: Final Connection
Now we need to tell the Backend to trust requests from your new Frontend.

1.  Go back to your **Render Dashboard** -> `museplay-api`.
2.  Go to **Environment**.
3.  Add a new variable:
    *   Key: `FRONTEND_URL`
    *   Value: *(Paste your Vercel Frontend URL from Phase 3)*
        *   Example: `https://museplay.vercel.app` (No trailing slash)
4.  Click **Save Changes**. Render will automatically restart your server.

---

## 🎉 Done!
Visit your Vercel URL (`https://museplay.vercel.app`).
1.  **Sign Up**: Create a new account (this initializes the DB tables).
2.  **Create a Room**: Test the flow.
3.  **Share**: Send the link to your friends!
