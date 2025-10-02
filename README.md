# RealEstateHub

A modern real estate platform built for the Nigerian market, allowing users to browse, search, and manage property listings with a focus on houses, apartments, and land for sale or rent.

## 🏗️ Architecture

- **Backend**: Node.js + TypeScript + Express.js + Prisma ORM + PostgreSQL
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: Local file system (extensible to cloud storage)

## 🚀 Features

### Core Features

- ✅ Property listing management (CRUD operations)
- ✅ Advanced search and filtering
- ✅ Favorites system
- ✅ Image upload and management
- ✅ Nigerian market specific features (states, cities, NGN currency)
- ✅ Responsive design for mobile and desktop

### Property Management

- Create, read, update, delete property listings
- Support for houses, apartments, and land
- Both sale and rental listings
- Multiple image uploads per property
- Contact information management

### Search & Filter

- Filter by location (state, city, neighborhood)
- Filter by property type and listing type
- Price range filtering
- Bedroom and bathroom filtering
- Sort by newest, price (low to high, high to low)
- Pagination support

### User Experience

- Clean, modern interface
- Mobile-responsive design
- Fast loading with optimized images
- Error handling and loading states
- Nigerian phone number validation
- NGN currency formatting

## 📁 Project Structure

```
realestatehub/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Data access layer
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── validation/      # Input validation schemas
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   └── config/          # Configuration files
│   ├── prisma/              # Database schema and migrations
│   └── uploads/             # File upload directory
├── frontend/                # Next.js web application
│   ├── app/                 # Next.js 14 app directory
│   ├── components/          # Reusable React components
│   ├── lib/                 # Utility functions and API client
│   └── public/              # Static assets
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd realestatehub
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed the database with sample data
npm run db:seed

# Start development server
npm run dev
```

The backend API will be available at `http://localhost:3001`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 4. Database Configuration

Update the `DATABASE_URL` in `backend/.env`:

```
DATABASE_URL="postgresql://username:password@localhost:5432/realestatehub"
```

## 📚 API Documentation

### Base URL

```
http://localhost:3001/api
```

### Endpoints

#### Properties

- `GET /properties` - List all properties with pagination and filtering
- `GET /properties/:id` - Get specific property details
- `POST /properties` - Create new property listing
- `PUT /properties/:id` - Update property listing
- `DELETE /properties/:id` - Delete property listing
- `POST /properties/:id/images` - Upload property images

#### Search

- `GET /search` - Search properties with filters
- `GET /search/locations` - Get available locations
- `GET /search/types` - Get property types

#### Favorites

- `GET /favorites` - Get user's favorite properties
- `POST /favorites/:propertyId` - Add property to favorites
- `DELETE /favorites/:propertyId` - Remove property from favorites
- `GET /favorites/:propertyId/check` - Check if property is favorited

### Example API Calls

#### Create Property

```bash
curl -X POST http://localhost:3001/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "title": "3 Bedroom Apartment in Lagos",
    "description": "Beautiful apartment with modern amenities",
    "price": 25000000,
    "state": "Lagos",
    "city": "Ikeja",
    "address": "123 Main Street, Ikeja, Lagos",
    "propertyType": "APARTMENT",
    "listingType": "SALE",
    "bedrooms": 3,
    "bathrooms": 2,
    "area": 120,
    "contactName": "John Doe",
    "contactPhone": "+2348012345678",
    "contactEmail": "john@example.com"
  }'
```

#### Search Properties

```bash
curl "http://localhost:3001/api/search?state=Lagos&propertyType=APARTMENT&minPrice=10000000&maxPrice=50000000"
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment

1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Deploy to your preferred platform (Heroku, Railway, etc.)

### Frontend Deployment

1. Update API URL in environment variables
2. Build the application: `npm run build`
3. Deploy to Vercel, Netlify, or your preferred platform

## 🔧 Environment Variables

### Backend (.env)

```
DATABASE_URL="postgresql://username:password@localhost:5432/realestatehub"
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Email Configuration (Optional - for email verification)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@realestatehub.com
FROM_NAME=RealEstateHub

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Cloudinary Configuration (Required for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Note**: You need to set up a [Cloudinary account](https://cloudinary.com/) for image uploads. See `backend/CLOUDINARY_SETUP.md` for detailed setup instructions.

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Contact the development team

## 🎯 Future Enhancements

- Advanced property management dashboard
- Real-time chat between buyers and sellers
- Property comparison feature
- Map integration for property locations
- Email notifications for new listings
- Mobile app development
- Payment integration for premium listings
- Property valuation tools
# realestatehub
