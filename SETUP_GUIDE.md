# Fashion E-Shop Admin Setup Guide

## Quick Start

### Prerequisites
- Node.js 16+ installed
- Your backend server running on `http://localhost:3001`
- npm or yarn package manager

### Installation Steps

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Backend URL** (if different from localhost:3001)
Open `src/lib/api.ts` and update:
```typescript
const API_BASE_URL = 'http://localhost:3001/api'; // Change if needed
```

3. **Start Development Server**
```bash
npm run dev
```

4. **Access Admin Panel**
- Open browser to: `http://localhost:8080`
- You'll be redirected to `/login`

## First Login

### Test Credentials
```
Username: admin
Password: admin
```

**Important:** These are the default credentials from your backend. Make sure your backend has this user configured in the database.

## Backend Configuration

### CORS Setup (Required!)

Your Fastify backend needs to allow requests from the frontend. Add this to your backend:

```javascript
// In server/index.js or main server file
const fastify = require('fastify')({ logger: true });

// Add CORS support
fastify.register(require('@fastify/cors'), {
  origin: [
    'http://localhost:8080',  // Development frontend
    'http://localhost:5173',  // Alternate Vite port
  ],
  credentials: true
});

// ... rest of your server setup
```

### Verify Backend Endpoints

Make sure these endpoints are working:

1. **Authentication**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

Expected response:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

2. **Products** (after login)
```bash
curl http://localhost:3001/api/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Testing the Admin Panel

### 1. Login Flow
- Navigate to `/login`
- Enter credentials: `admin` / `admin`
- Should redirect to `/admin` (Dashboard)

### 2. Dashboard
- Should see analytics cards (if you have orders in DB)
- Recent orders table
- Low stock alerts

### 3. Products Page
- Click "Products" in sidebar
- Should see product list
- Try search functionality
- Filter by status

### 4. Orders Page
- Click "Orders" in sidebar
- View all orders
- Change order status
- Try CSV export

## Troubleshooting

### Issue: "Failed to fetch" or Network Error

**Cause:** Backend not running or CORS not configured

**Solution:**
1. Start your backend: `cd server && npm start`
2. Check it's running: `curl http://localhost:3001/api/products`
3. Add CORS configuration (see above)
4. Make sure backend URL in `src/lib/api.ts` is correct

### Issue: Login fails with "Invalid credentials"

**Cause:** User not in database or wrong credentials

**Solution:**
1. Check your database has admin user
2. Verify password hash matches
3. Check backend console for errors
4. Try creating user manually in database

### Issue: Products/Orders not loading

**Cause:** Authorization token not being sent

**Solution:**
1. Check browser Console (F12)
2. Look for Network tab - check if Authorization header is present
3. Try logging out and logging in again
4. Clear localStorage and try again

### Issue: Images not displaying

**Cause:** Image paths are relative to backend

**Solution:**
- Images are served from: `http://localhost:3001/images/filename.jpg`
- Make sure backend has images in `server/public/images/`
- Check browser Network tab for 404s

### Issue: Theme not working

**Cause:** next-themes not initialized

**Solution:**
- Refresh the page
- Check browser console for errors
- Make sure ThemeProvider wraps your app in `App.tsx`

## Development Tips

### Hot Reload
The dev server uses Vite's hot module replacement (HMR). Changes to files will automatically refresh the browser.

### TypeScript Errors
If you see TypeScript errors:
```bash
npm run build
```
This will show all type errors before deploying.

### Adding New Pages
1. Create component in `src/pages/admin/`
2. Add route in `src/App.tsx`
3. Add navigation item in `src/components/admin/AdminSidebar.tsx`

### API Integration
All API calls go through `src/lib/api.ts`. To add new endpoints:

```typescript
export const newFeatureApi = {
  getAll: () => apiRequest<YourType[]>('/new-feature'),
  create: (data: any) => apiRequest('/new-feature', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};
```

## Production Deployment

### Build for Production
```bash
npm run build
```

This creates optimized files in `dist/` folder.

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel/Netlify

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Admin panel"
git branch -M main
git remote add origin YOUR_REPO
git push -u origin main
```

2. **Deploy on Vercel**
- Go to vercel.com
- Import your GitHub repository
- Set build command: `npm run build`
- Set output directory: `dist`
- Add environment variable: `VITE_API_URL=your_production_backend_url`

3. **Update API URL for Production**
In `src/lib/api.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

## Environment Variables

Create `.env` file (optional):
```env
VITE_API_URL=http://localhost:3001/api
```

Then update `src/lib/api.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL;
```

## Features Checklist

### ✅ Implemented
- [x] Authentication (Login/Logout)
- [x] Dashboard with analytics
- [x] Products listing with search & filters
- [x] Orders management with status updates
- [x] CSV export
- [x] Dark/Light theme
- [x] Responsive sidebar
- [x] Protected routes

### 🚧 Placeholder (Ready for Implementation)
- [ ] Product create/edit forms
- [ ] Collections management
- [ ] Bundles with custom fields
- [ ] Offers & discounts
- [ ] Shipping rates
- [ ] Notifications
- [ ] Popups
- [ ] Settings panel

## Getting Help

1. **Check Documentation**
   - `ADMIN_DOCUMENTATION.md` - Complete feature guide
   - `API_DOCUMENTATION.md` - Backend API reference

2. **Check Browser Console**
   - Press F12
   - Look for errors in Console tab
   - Check Network tab for failed requests

3. **Check Backend Logs**
   - Look at your backend terminal
   - Check for error messages
   - Verify requests are reaching server

4. **Common Solutions**
   - Restart both frontend and backend
   - Clear browser cache/localStorage
   - Update API_BASE_URL if needed
   - Check CORS configuration

## Next Steps

1. ✅ Get admin panel running
2. ✅ Test login and authentication
3. ✅ Browse products and orders
4. 📝 Implement product create/edit forms
5. 📝 Add remaining CRUD interfaces
6. 🚀 Deploy to production

---

**Note:** This admin panel is the foundation. All core features (products, orders, collections, bundles, etc.) can be built using the same patterns already implemented for Products and Orders pages.