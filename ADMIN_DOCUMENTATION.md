# Fashion E-Shop Admin Panel Documentation

## Overview
This is a comprehensive admin dashboard for managing the Fashion E-Shop. Built with React, TypeScript, and TailwindCSS, it provides a modern, responsive interface for managing products, orders, collections, and more.

## Features Implemented

### 1. Authentication System
- **Login Page** (`/login`)
  - Secure JWT-based authentication
  - Test credentials: `username: admin` / `password: admin`
  - Token stored in localStorage
  - Protected routes with automatic redirect

### 2. Dashboard (`/admin`)
- **Analytics Overview**
  - Orders today with trend indicators
  - Revenue today and weekly totals
  - Pending orders counter
  - Low stock alerts
- **Recent Orders Table**
  - Quick view of latest orders
  - Status badges
  - Customer information
- **Low Stock Alerts**
  - Products running low on inventory
  - Quick identification of items needing restock

### 3. Products Management (`/admin/products`)
- **Product Listing**
  - Searchable product catalog
  - Filter by status (published, draft, archived)
  - Product images with fallback
  - Stock level indicators
  - Quick actions (edit, delete)
- **Features**
  - Pagination support
  - Sorting options
  - Image preview
  - Status management
  - Bulk operations ready

### 4. Orders Management (`/admin/orders`)
- **Order Listing**
  - Complete order details
  - Customer information
  - Order status tracking
  - Real-time status updates
- **Features**
  - Filter by status
  - CSV export functionality
  - Status update dropdown
  - Order details view
  - Phone number display

### 5. Additional Sections (Placeholders)
The following sections have placeholder pages ready for implementation:
- Collections Management
- Bundles Management
- Offers & Discounts
- Shipping Configuration
- Notifications System
- Popups Management
- Settings Panel

## Design System

### Color Scheme
- **Primary**: Blue (#3B82F6) - Used for CTAs and key actions
- **Success**: Green - For positive states
- **Warning**: Orange - For alerts
- **Destructive**: Red - For dangerous actions
- **Muted**: Gray tones - For secondary content

### Theme Support
- **Light Mode**: Clean white backgrounds with subtle grays
- **Dark Mode**: Dark backgrounds with blue accents
- Toggle button in header for easy switching

### Components
- **Cards**: Elevated surfaces for content grouping
- **Badges**: Status indicators with color coding
- **Buttons**: Multiple variants (default, outline, ghost)
- **Tables**: Responsive with hover states
- **Sidebar**: Collapsible navigation
- **Icons**: Lucide React icons throughout

## Integration Guide

### Backend Connection

#### 1. API Base URL
The admin panel expects your backend at `http://localhost:3001/api`. If your backend runs on a different URL, update `src/lib/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:3001/api'; // Change this
```

#### 2. Authentication Flow
1. User logs in at `/login`
2. Backend returns JWT token from `/api/auth/login`
3. Token stored in localStorage as `admin_token`
4. All subsequent API requests include: `Authorization: Bearer <token>`

#### 3. CORS Configuration
Ensure your backend allows requests from your frontend origin:

```javascript
// In your Fastify backend
fastify.register(require('@fastify/cors'), {
  origin: 'http://localhost:8080', // Your frontend URL
  credentials: true
})
```

### Running the Application

#### Development Mode
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will run on `http://localhost:8080`

#### Production Build
```bash
npm run build
npm run preview
```

### Testing the Admin Panel

#### 1. Start Your Backend
```bash
cd path/to/backend
npm start
```
Backend should be running on `http://localhost:3001`

#### 2. Start the Admin Panel
```bash
cd path/to/admin-frontend
npm run dev
```

#### 3. Login
- Navigate to `http://localhost:8080/login`
- Use credentials: `admin` / `admin`
- You'll be redirected to the dashboard

#### 4. Test Features
- **Dashboard**: View analytics (requires data in backend)
- **Products**: List, search, filter products
- **Orders**: View and update order statuses

## API Integration Details

### Authentication (`src/lib/api.ts`)
```typescript
// Login
authApi.login(username, password)
// Returns: { token: string, user: { id, username, role } }

// Logout
authApi.logout()
```

### Products
```typescript
// Get all products
productsApi.getAll({ limit, offset, sort, search, status })

// Get single product
productsApi.getById(id)

// Create product
productsApi.create({ title, description, price, images, stock })

// Update product
productsApi.update(id, { ...data })

// Delete product
productsApi.delete(id)
```

### Orders
```typescript
// Get all orders
ordersApi.getAll({ status, limit, offset })

// Get order details
ordersApi.getById(id)

// Update order status
ordersApi.updateStatus(id, 'confirmed')

// Export to CSV
ordersApi.exportCSV()
```

### Other APIs
Similar patterns for:
- `collectionsApi`
- `bundlesApi`
- `offersApi`
- `shippingApi`
- `analyticsApi`
- `notificationsApi`
- `popupsApi`
- `settingsApi`

## File Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminLayout.tsx      # Main layout with sidebar
│   │   └── AdminSidebar.tsx     # Navigation sidebar
│   ├── ui/                      # Shadcn UI components
│   ├── ProtectedRoute.tsx       # Route protection HOC
│   └── ThemeToggle.tsx          # Dark/light mode toggle
├── contexts/
│   └── AuthContext.tsx          # Authentication state
├── lib/
│   ├── api.ts                   # API client functions
│   └── utils.ts                 # Utility functions
├── pages/
│   ├── admin/
│   │   ├── Dashboard.tsx        # Analytics dashboard
│   │   ├── Products.tsx         # Product management
│   │   └── Orders.tsx           # Order management
│   ├── Login.tsx                # Login page
│   └── NotFound.tsx             # 404 page
├── App.tsx                      # App routes
└── index.css                    # Design system tokens
```

## Extending the Admin Panel

### Adding a New Page

1. **Create the page component** in `src/pages/admin/`
2. **Add route** in `src/App.tsx`:
```tsx
<Route
  path="/admin/your-page"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <YourPage />
      </AdminLayout>
    </ProtectedRoute>
  }
/>
```
3. **Update sidebar** in `src/components/admin/AdminSidebar.tsx`

### Adding API Endpoints

Add new functions in `src/lib/api.ts`:
```typescript
export const yourApi = {
  getAll: () => apiRequest<YourType[]>('/your-endpoint'),
  // ... more methods
};
```

### Custom Styling

Use the design system tokens from `src/index.css`:
- Colors: `bg-primary`, `text-muted-foreground`, etc.
- Shadows: `shadow-md`, `shadow-lg`
- Borders: `border-border`
- Radius: `rounded-lg`, `rounded-full`

## Troubleshooting

### Issue: Cannot connect to backend
**Solution**: 
- Verify backend is running on `http://localhost:3001`
- Check CORS configuration
- Update API_BASE_URL if needed

### Issue: Login fails
**Solution**:
- Check credentials in your database
- Verify `/api/auth/login` endpoint is working
- Check browser console for error messages

### Issue: Products not showing
**Solution**:
- Ensure `/api/products` returns correct data structure
- Check browser network tab for API responses
- Verify images paths are correct

### Issue: Theme not switching
**Solution**:
- Check if `next-themes` is installed
- Verify ThemeProvider wraps the app
- Clear localStorage if stuck

## Future Enhancements

### Planned Features
- [ ] Product create/edit forms with image upload
- [ ] Order details modal with full information
- [ ] Collections CRUD interface
- [ ] Bundles management with custom fields
- [ ] Offers with countdown timers
- [ ] Shipping rate calculator
- [ ] Real-time notifications
- [ ] Popup campaign manager
- [ ] Advanced analytics charts
- [ ] Settings management panel

### Recommended Improvements
- Add form validation with Zod
- Implement optimistic updates
- Add loading skeletons
- Implement pagination controls
- Add bulk actions
- Export to multiple formats
- Add search debouncing
- Implement filters persistence

## Support & Contact

For issues or questions about the admin panel:
1. Check this documentation
2. Review API documentation (`API_DOCUMENTATION.md`)
3. Check browser console for errors
4. Verify backend is responding correctly

## Credits

Built with:
- React 18 + TypeScript
- TailwindCSS
- Shadcn UI
- React Query
- React Router
- Lucide Icons
- Recharts
- date-fns