# 🚀 India Site Deployment Guide

Follow these steps to make your website live for the whole world!

## Part 1: Backend Deployment (Railway.app) - **Engine**
1. Go to [Railway.app](https://railway.app/) and sign up with GitHub.
2. Click **"New Project"** -> **"Deploy from GitHub repo"**.
3. Select your `indiasite` repository.
4. Once added, go to the **"Variables"** tab in Railway and add everything from your local `.env` file:
   - `PORT` = 5000
   - `MONGODB_URI` = (Your MongoDB Link)
   - `JWT_SECRET` = (Your Secret Key)
   - `CLOUDINARY_CLOUD_NAME` = ...
   - `CLOUDINARY_API_KEY` = ...
   - `CLOUDINARY_API_SECRET` = ...
   - `EMAIL_USER` = indiasite13@gmail.com
   - `EMAIL_PASS` = ...
   - `GEMINI_API_KEY` = ...
5. Go to **"Settings"** and click **"Generate Domain"**. This is your **Backend URL**. Copy it!

---

## Part 2: Frontend Deployment (Vercel.com) - **Face**
1. Go to [Vercel.com](https://vercel.com/) and sign up with GitHub.
2. Click **"Add New"** -> **"Project"**.
3. Import your `indiasite` repository.
4. **IMPORTANT:** In the "Root Directory" setting, make sure it points to the `client` folder.
5. Expand **"Environment Variables"** and add:
   - Name: `VITE_API_URL`
   - Value: (Paste the Backend URL you copied from Railway)
6. Click **"Deploy"**.

---

## Part 3: Connect Everything
- Your website is now live at the URL Vercel gives you (e.g., `indiasite.vercel.app`)!
- Whenever you `git push` from your computer, both parts will update automatically.

---

## 💰 Monetization Tips
- **Google AdSense:** Once you get 100+ daily users, apply at [adsense.google.com](https://adsense.google.com/).
- **Sponsorships:** Use the `/admin/ideas` panel to track user feedback and pitch to local brands.

**Jai Hind! Your Bharat Site is now global!** 🇮🇳
