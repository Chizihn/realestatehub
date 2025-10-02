# RealEstateHub Frontend

Modern Next.js 14 frontend application for the RealEstateHub platform with TypeScript and Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
app/                    # Next.js 14 App Router
├── globals.css         # Global styles
├── layout.tsx          # Root layout component
├── page.tsx            # Home page
├── properties/         # Property-related pages
│   ├── [id]/          # Dynamic property detail pages
│   └── new/           # Create property page
└── favorites/          # Favorites page

components/             # Reusable React components
├── Header.tsx          # Navigation header
├── PropertyCard.tsx    # Property listing card
└── SearchFilters.tsx   # Search and filter component

lib/                    # Utility functions and configurations
├── api.ts             # API client and type definitions
└── utils.ts           # Helper functions
```

## 🎨 Features

### Core Features

- ✅ Property browsing with pagination
- ✅ Advanced search and filtering
- ✅ Property detail pages with image galleries
- ✅ Favorites management
- ✅ Responsive design for all devices
- ✅ Nigerian market specific formatting (NGN currency, phone numbers)

### User Interface

- Clean, modern design with Tailwind CSS
- Mobile-first responsive layout
- Loading states and error handling
- Image optimization with Next.js Image component
- Smooth transitions and hover effects

### Search & Filter

- Filter by location (state, city)
- Filter by property type and listing type
- Price range filtering
- Bedroom and bathroom filtering
- Sort by newest, price (low to high, high to low)
- Advanced filters toggle

### Property Management

- Detailed property pages with image galleries
- Contact information display
- Favorite/unfavorite functionality
- Property sharing capabilities

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Next.js Configuration

The app is configured with:

- TypeScript support
- Tailwind CSS for styling
- Image optimization for property photos
- API route handling

## 📱 Pages

### Home Page (`/`)

- Property listings grid
- Search and filter functionality
- Pagination
- Favorites toggle

### Property Details (`/properties/[id]`)

- Full property information
- Image gallery with thumbnails
- Contact information
- Favorite toggle
- Back navigation

### Favorites (`/favorites`)

- User's saved properties
- Remove from favorites functionality
- Empty state handling

## 🎨 Components

### PropertyCard

Reusable property listing card component with:

- Property image with fallback
- Price formatting (NGN currency)
- Property details (bedrooms, bathrooms, area)
- Location information
- Favorite toggle button
- Listing type badge

### SearchFilters

Advanced search and filtering component with:

- Basic filters (state, property type, listing type)
- Advanced filters toggle
- Price range inputs
- Bedroom/bathroom selectors
- Sort options
- Clear filters functionality

### Header

Navigation header with:

- Logo and branding
- Navigation links
- Mobile-responsive menu
- Active page highlighting

## 🔌 API Integration

### API Client (`lib/api.ts`)

Centralized API client with:

- Axios configuration
- Request/response interceptors
- TypeScript interfaces
- Error handling

### API Functions

- `propertyApi.getAll()` - Fetch properties with filters
- `propertyApi.getById()` - Fetch single property
- `propertyApi.create()` - Create new property
- `propertyApi.update()` - Update property
- `propertyApi.delete()` - Delete property
- `favoritesApi.getAll()` - Fetch user favorites
- `favoritesApi.add()` - Add to favorites
- `favoritesApi.remove()` - Remove from favorites

## 🎯 TypeScript Interfaces

### Property Interface

```typescript
interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  state: string;
  city: string;
  neighborhood?: string;
  address: string;
  propertyType: "HOUSE" | "APARTMENT" | "LAND";
  listingType: "SALE" | "RENT";
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  areaUnit: string;
  images: string[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
```

### Search Filters Interface

```typescript
interface SearchFilters {
  state?: string;
  city?: string;
  propertyType?: string;
  listingType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  sortBy?: "newest" | "price_asc" | "price_desc";
  page?: number;
  limit?: number;
}
```

## 🎨 Styling

### Tailwind CSS

The app uses Tailwind CSS for styling with:

- Custom color palette (primary blue theme)
- Responsive design utilities
- Component-based styling
- Hover and focus states

### Custom Styles

- Nigerian Naira (₦) currency formatting
- Property type and listing type badges
- Image gallery with thumbnails
- Loading spinners and states

## 📱 Responsive Design

### Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Mobile Features

- Collapsible navigation
- Touch-friendly buttons
- Optimized image sizes
- Swipe-friendly image galleries

## 🔍 SEO & Performance

### Next.js Features

- Server-side rendering (SSR)
- Static site generation (SSG) where applicable
- Image optimization
- Code splitting
- Font optimization

### Meta Tags

- Dynamic page titles
- Property-specific descriptions
- Open Graph tags for social sharing

## 🧪 Testing

### Component Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

### E2E Testing

```bash
# Run Cypress tests
npm run cypress:open
```

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables for Production

```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

## 🔧 Customization

### Theming

Update `tailwind.config.js` to customize:

- Color palette
- Typography
- Spacing
- Breakpoints

### Components

All components are modular and can be easily customized:

- Update styling in component files
- Modify behavior through props
- Add new features as needed

## 📊 Performance Optimization

### Image Optimization

- Next.js Image component for automatic optimization
- WebP format support
- Lazy loading
- Responsive images

### Code Optimization

- Tree shaking for smaller bundles
- Code splitting by route
- Dynamic imports for heavy components
- Optimized font loading

## 🐛 Error Handling

### Error Boundaries

- Global error handling
- Component-level error states
- API error handling
- User-friendly error messages

### Loading States

- Skeleton loaders
- Spinner components
- Progressive loading
- Optimistic updates

## 🔒 Security

### Client-Side Security

- Input sanitization
- XSS protection
- CSRF protection
- Secure API communication

## 📈 Analytics

### Tracking Setup

Ready for integration with:

- Google Analytics
- Mixpanel
- Custom analytics solutions

### Event Tracking

- Property views
- Search queries
- Favorite actions
- Contact interactions
