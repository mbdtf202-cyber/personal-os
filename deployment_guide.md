# Personal OS Deployment Guide

Given your tech stack (Next.js 16, PostgreSQL, Prisma, Docker), here are the three best ways to deploy your Personal OS.

## Option 1: Vercel + Serverless Postgres (Recommended for Ease)
**Best for:** Zero maintenance, fastest setup, best Next.js performance.

1.  **Frontend (Vercel)**:
    *   Push your code to GitHub.
    *   Import the project in Vercel.
    *   Vercel automatically detects Next.js and configures the build.
2.  **Database (Neon or Supabase)**:
    *   Since Vercel is serverless, you need a database accessible over the internet.
    *   **Neon.tech**: Serverless Postgres, scales to zero (free tier is generous).
    *   **Supabase**: Managed Postgres with extra features (free tier available).
3.  **Configuration**:
    *   Get the `DATABASE_URL` from Neon/Supabase (use the "Pooled" connection string for serverless).
    *   Add it to Vercel Environment Variables.
    *   Add `AUTH_SECRET`, `AUTH_GITHUB_ID`, and `AUTH_GITHUB_SECRET` to Vercel.

**Pros:**
*   Automatic CI/CD (deploy on push).
*   Global CDN (fastest edge network).
*   Zero server management.

**Cons:**
*   Database is separate (can't use local Docker DB).
*   Potential cold starts on free tier.

---

## Option 2: Docker on VPS (Self-Hosted)
**Best for:** Privacy, full control, fixed cost ($5/mo VPS).

Since you already have a `docker-compose.yml`, this is very straightforward.

1.  **Get a VPS**: DigitalOcean Droplet, Hetzner, or AWS Lightsail (Ubuntu 22.04).
2.  **Install Docker**:
    ```bash
    curl -fsSL https://get.docker.com | sh
    ```
3.  **Deploy**:
    *   Clone your repo to the VPS.
    *   Create a `.env.production` file with your secrets.
    *   Run:
        ```bash
        docker compose up -d --build
        ```
4.  **Domain & SSL (Nginx)**:
    *   Your `docker-compose.yml` already includes Nginx!
    *   Point your domain's A record to the VPS IP.
    *   Update `nginx.conf` with your domain name.

**Pros:**
*   Data stays on your server (Privacy).
*   Fixed cost (no surprise bills).
*   Everything in one place (App + DB).

**Cons:**
*   Manual updates (need to `git pull` and restart).
*   You manage backups and security.

---

## Option 3: Coolify (The "Self-Hosted Vercel")
**Best for:** Vercel-like experience on your own server.

[Coolify](https://coolify.io) is an open-source, self-hosted PaaS.

1.  **Install Coolify** on your VPS.
2.  **Create a Project**:
    *   Connect your GitHub repo.
    *   Add a PostgreSQL resource within Coolify.
3.  **Deploy**:
    *   Coolify handles the Docker build, SSL certificates, and database linking automatically.

**Pros:**
*   UI-based management (like Vercel).
*   Auto-SSL and reverse proxy included.
*   One-click database backups.

**Cons:**
*   Requires a slightly larger VPS (2GB+ RAM recommended).

---

## Option 4: Local Production Deployment (Docker)
**Best for:** Testing the production build on your own machine before deploying elsewhere.

You can run the entire stack (Database + App + Nginx) locally using Docker.

1.  **Stop Development Server**:
    *   Press `Ctrl+C` to stop `npm run dev`.
    *   Stop the standalone database if running: `docker-compose down`

2.  **Configure Environment**:
    *   Ensure your `.env` file has the correct secrets.
    *   **Important**: For Docker networking, change `DATABASE_URL` in `.env` to point to the container name `postgres` instead of `127.0.0.1` or `localhost`:
        ```env
        DATABASE_URL="postgresql://personalos:your_password@postgres:5432/personalos"
        ```

3.  **Build and Run**:
    ```bash
    docker-compose up -d --build
    ```

4.  **Access**:
    *   **App (Direct)**: http://localhost:3000
    *   **App (via Nginx)**: http://localhost (requires port 80 to be free)

**Pros:**
*   Simulates the exact production environment.
*   Verifies that Dockerfile and Nginx configs are correct.

**Cons:**
*   Heavier on system resources than `npm run dev`.
*   Harder to debug code changes (requires rebuild).

### 🌍 Exposing Localhost to the Internet
If you want to access your local deployment from the public internet (e.g., on your phone or share with friends), use a tunneling service.

#### Method A: Cloudflare Tunnel (Recommended)
Best for stability and using your own domain.
1.  Install `cloudflared`: `brew install cloudflared` (Mac)
2.  Run tunnel: `cloudflared tunnel --url http://localhost:3000`
3.  It will give you a temporary URL (or configure a permanent one in Cloudflare Dashboard).

#### Method B: ngrok (Easiest)
Best for quick testing.
1.  Install ngrok: `brew install ngrok/ngrok/ngrok`
2.  Run: `ngrok http 3000`
3.  Copy the `https://...ngrok-free.app` URL.

> **⚠️ Security Warning**: Exposing your local machine to the internet carries risks. Ensure your app has authentication enabled (which we did with Auth.js) and don't leave the tunnel running permanently for production use.

---

## 💡 Recommendation

*   **Start with Option 1 (Vercel + Neon)** if you want to get it live in 5 minutes and don't want to manage servers.
*   **Choose Option 2 (Docker)** if you want total control over your data and want to keep it running cheaply on a single server.
*   **Use Option 4 (Local)** only for testing the final build, not for daily development.
