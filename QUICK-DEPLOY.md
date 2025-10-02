# Quick Deployment Guide

## Step 1: Fix Git Repository

Run one of these commands in your terminal from the root directory:

**Windows:**

```bash
git-fix.bat
```

**Mac/Linux:**

```bash
chmod +x git-fix.sh
./git-fix.sh
```

**Or manually:**

```bash
git add .
git commit -m "Add complete RealEstateHub project"
git push origin main
```

## Step 2: Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:

   - **Name**: `realestatehub-api`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build && npx prisma migrate deploy && npm run db:seed`
   - **Start Command**: `npm start`

5. Add Environment Variables:

```
DATABASE_URL=<your-postgres-url>
JWT_SECRET=your-super-secret-jwt-key-32-chars-min
JWT_REFRESH_SECRET=your-refresh-secret-32-chars-min
NODE_ENV=production
PORT=10000
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
```

6. Create PostgreSQL database first:
   - Click "New" → "PostgreSQL"
   - Name: `realestatehub-db`
   - Copy the connection string to `DATABASE_URL`

## Step 3: Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:

   - **Framework**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`

5. Add Environment Variable:

```
NEXT_PUBLIC_API_URL=https://your-backend-app.onrender.com/api
```

## Step 4: Test

1. Wait for both deployments to complete
2. Visit your Vercel URL
3. Try registering a new account
4. Test the demo accounts:
   - **Admin**: admin@realestatehub.com / Password123!
   - **Agent**: agent@realestatehub.com / Password123!
   - **Seller**: seller@realestatehub.com / Password123!
   - **Buyer**: buyer@realestatehub.com / Password123!

## Troubleshooting

**If backend fails to deploy:**

- Check the build logs in Render
- Make sure all environment variables are set
- Verify DATABASE_URL is correct

**If frontend can't connect to backend:**

- Check CORS settings in backend
- Verify NEXT_PUBLIC_API_URL is correct
- Check browser network tab for errors

**If database is empty:**

- The seed command should run automatically
- If not, go to Render shell and run: `npm run db:seed`

## Quick Links

- **Render**: https://dashboard.render.com
- **Vercel**: https://vercel.com/dashboard
- **Cloudinary**: https://cloudinary.com/console

## Demo Credentials

Once deployed, you can use these demo accounts:

- **Admin**: admin@realestatehub.com / Password123!
- **Agent**: agent@realestatehub.com / Password123!
- **Seller**: seller@realestatehub.com / Password123!
- **Buyer**: buyer@realestatehub.com / Password123!
