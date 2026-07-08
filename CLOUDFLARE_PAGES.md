# ⚡ Deploying VAYU ASM on Cloudflare Pages (Pure Frontend Static Site)

VAYU ASM has been fully optimized as a **100% client-side Single Page Application (SPA)**. It operates entirely inside the user's browser, meaning you can deploy it to **Cloudflare Pages** (or any static hosting service like Netlify, Vercel, or GitHub Pages) with zero-maintenance, extreme security, and absolute reliability.

---

## 🏗️ Architecture

- **Static Client-Side Build**: The built application consists solely of HTML, CSS, and JS (compiled into the `/dist` folder).
- **Embedded CTI Compiler Core**: Fully autonomous, local Threat Intelligence compilation logic. It resolves any IP, domain, campaign, or CVE instantly on the client, requiring zero server-side database configurations or API keys.
- **Client-Side Integrations**: Browser-based utilities such as the Web Cryptography API and Speech Synthesis API are executed natively on the client device.

---

## 🚀 Step-by-Step Deployment Guide

Follow these simple steps to deploy VAYU ASM on Cloudflare Pages:

### Step 1: Connect your Repository
1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Choose your GitHub repository containing the VAYU ASM codebase.

### Step 2: Configure Build Settings
In the Cloudflare Pages build configuration screen, enter the following values:
- **Framework Preset**: `Vite` (or leave as `None`)
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (default)

### Step 3: Deploy!
Click **Save and Deploy**. Cloudflare Pages will fetch your code, run the Vite bundler, and deploy your static assets globally to the Cloudflare Edge network.

---

## 🛡️ Key Advantages of Pure Frontend Architecture on Cloudflare Pages
1. **Instant Edge Performance**: Pages are cached globally on the edge, delivering sub-millisecond response times.
2. **Serverless & Free**: 0 server overhead, 100% free under Cloudflare's standard pages plan.
3. **No Private Secrets Leaked**: Because there are no backend servers or database connection strings, there is zero risk of API key exposure.
