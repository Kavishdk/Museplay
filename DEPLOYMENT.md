# Deployment Guide for MusePlay

Since this application uses a **Frontend (React)**, a **Backend (Node.js/Socket.IO)**, and a **Database**, the deployment strategy involves three parts.

## Prerequisite: Switch Database to PostgreSQL
Currently, the project uses **SQLite**, which is a file-based database. This works great locally but is **not suitable** for most cloud hosting platforms (like Vercel, Render, or Heroku) because their file systems are ephemeral (data is lost on restart).

**Recommended**: Switch to **PostgreSQL**.
1.  **Get a Free Database**: Sign up for [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com) and create a new project. Copy the connection string (e.g., `postgres://user:pass@...`).
2.  **Update Prisma**:
    *   In `prisma/schema.prisma`, change:
        ```prisma
        datasource db {
          provider = "postgresql"
          url      = env("DATABASE_URL")
        }
        ```
    *   Delete the `prisma/migrations` folder and `dev.db`.
    *   Run `npx prisma migrate dev --name init` to regenerate the client.

---

## Option 1: Cloud Hosting (Recommended)

### 1. Deploy Backend (Render.com)
Render offers a free tier for Node.js services.

1.  Push your code to GitHub.
2.  Sign up at [Render.com](https://render.com).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Settings**:
    *   **Root Directory**: `.` (or leave empty)
    *   **Build Command**: `npm install && npx prisma generate`
    *   **Start Command**: `node backend/server.js`
6.  **Environment Variables**:
    *   `DATABASE_URL`: Your PostgreSQL connection string.
    *   `GOOGLE_CLIENT_ID`: (Optional) Your Google OAuth ID.
7.  Click **Create Web Service**.
8.  **Copy the Backend URL**: Once deployed, copy the URL (e.g., `https://museplay-backend.onrender.com`).

### 2. Deploy Frontend (Vercel)
Vercel is the best place to host React/Vite apps.

1.  Sign up at [Vercel.com](https://vercel.com).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Environment Variables**:
    *   `VITE_API_BASE_URL`: Paste your Render Backend URL (e.g., `https://museplay-backend.onrender.com/api`).
    *   *Note: Do NOT add a trailing slash.*
5.  Click **Deploy**.

---

## Option 2: VPS (DigitalOcean / Hetzner)
If you want to keep using **SQLite**, you must use a VPS (Virtual Private Server).

1.  **Rent a Server**: Get a droplet from DigitalOcean (~$4/mo).
2.  **Setup**: SSH into the server and install Node.js, Nginx, and PM2.
3.  **Clone & Install**:
    ```bash
    git clone https://github.com/yourusername/museplay.git
    cd museplay
    npm install
    npx prisma migrate deploy
    ```
4.  **Build Frontend**:
    ```bash
    npm run build
    ```
5.  **Run Backend**:
    ```bash
    pm2 start backend/server.js --name "museplay-api"
    ```
6.  **Serve Frontend**: Configure Nginx to serve the `dist` folder and proxy `/api` requests to `localhost:3001`.

---

## Post-Deployment Checks
1.  **CORS**: Ensure your Backend allows requests from your Frontend URL.
    *   In `backend/server.js`, update `cors`:
        ```javascript
        app.use(cors({ 
            origin: process.env.FRONTEND_URL || 'http://localhost:3000', 
            credentials: true 
        }));
        ```
    *   Add `FRONTEND_URL` to your Backend Environment Variables.
