# RealEstateHub Backend API

Node.js + TypeScript + Express.js + Prisma ORM backend for the RealEstateHub platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed database with sample data
npm run db:seed

# Start development server
npm run dev
```

## 📁 Project Structure

```
src/
├── controllers/     # HTTP request handlers
├── services/        # Business logic layer
├── repositories/    # Data access layer
├── middleware/      # Express middleware
├── routes/          # API route definitions
├── validation/      # Input validation schemas
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── config/          # Configuration files
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm test` - Run tests
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data

## 🗄️ Database Schema

### Properties Table

- `id` - Unique identifier (UUID)
- `title` - Property title
- `description` - Property description
- `price` - Property price (Decimal)
- `currency` - Currency code (default: NGN)
- `state` - Nigerian state
- `city` - City name
- `neighborhood` - Neighborhood (optional)
- `address` - Full address
- `propertyType` - HOUSE | APARTMENT | LAND
- `listingType` - SALE | RENT
- `bedrooms` - Number of bedrooms (optional)
- `bathrooms` - Number of bathrooms (optional)
- `area` - Property area (Decimal)
- `areaUnit` - Area unit (default: sqm)
- `images` - Array of image URLs
- `contactName` - Contact person name
- `contactPhone` - Contact phone number
- `contactEmail` - Contact email address
- `status` - ACTIVE | INACTIVE | SOLD | RENTED
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Users Table

- `id` - Unique identifier (UUID)
- `email` - User email (unique)
- `name` - User name
- `role` - BUYER | SELLER | AGENT
- `createdAt` - Creation timestamp

### Favorites Table

- `id` - Unique identifier (UUID)
- `userId` - Reference to user
- `propertyId` - Reference to property
- `createdAt` - Creation timestamp

## 🔌 API Endpoints

### Properties

- `GET /api/properties` - List properties with pagination and filtering
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create new property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property
- `POST /api/properties/:id/images` - Upload property images

### Search

- `GET /api/search` - Search properties with filters
- `GET /api/search/locations` - Get available locations
- `GET /api/search/types` - Get property types with counts

### Favorites

- `GET /api/favorites` - Get user favorites
- `POST /api/favorites/:propertyId` - Add to favorites
- `DELETE /api/favorites/:propertyId` - Remove from favorites
- `GET /api/favorites/:propertyId/check` - Check favorite status

### Health Check

- `GET /api/health` - API health status

## 🔍 Query Parameters

### Property Listing & Search

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `state` - Filter by state
- `city` - Filter by city
- `propertyType` - Filter by property type
- `listingType` - Filter by listing type
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `bedrooms` - Filter by number of bedrooms
- `bathrooms` - Filter by number of bathrooms
- `sortBy` - Sort order: newest | price_asc | price_desc

## 📝 Request/Response Examples

### Create Property

```json
POST /api/properties
{
  "title": "4 Bedroom Duplex in Lekki",
  "description": "Beautiful duplex with modern amenities",
  "price": 85000000,
  "state": "Lagos",
  "city": "Lekki",
  "neighborhood": "Lekki Phase 1",
  "address": "15 Admiralty Way, Lekki Phase 1, Lagos",
  "propertyType": "HOUSE",
  "listingType": "SALE",
  "bedrooms": 4,
  "bathrooms": 3,
  "area": 350,
  "contactName": "John Doe",
  "contactPhone": "+2348012345678",
  "contactEmail": "john@example.com"
}
```

### Search Properties

```json
GET /api/search?state=Lagos&propertyType=APARTMENT&minPrice=10000000&maxPrice=50000000&page=1&limit=10

Response:
{
  "success": true,
  "data": {
    "properties": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## ✅ Input Validation

### Property Creation/Update

- `title` - Required, 3-255 characters
- `price` - Required, positive number
- `state` - Required, 2-100 characters
- `city` - Required, 2-100 characters
- `address` - Required, 5-500 characters
- `propertyType` - Required, enum: HOUSE | APARTMENT | LAND
- `listingType` - Required, enum: SALE | RENT
- `contactPhone` - Required, Nigerian phone format: +234XXXXXXXXXX or 0XXXXXXXXXX
- `contactEmail` - Required, valid email format

### File Upload

- Supported formats: JPEG, JPG, PNG, GIF, WebP
- Maximum file size: 5MB per file
- Maximum files per upload: 10

## 🛡️ Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Common Error Codes

- `VALIDATION_ERROR` (400) - Invalid input data
- `NOT_FOUND` (404) - Resource not found
- `DUPLICATE_ENTRY` (409) - Resource already exists
- `FILE_TOO_LARGE` (400) - File size exceeds limit
- `INTERNAL_SERVER_ERROR` (500) - Unexpected server error

## 🔧 Environment Variables

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/realestatehub"
PORT=3001
NODE_ENV=development
UPLOAD_DIR=uploads
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📊 Performance Considerations

- Database indexes on frequently queried fields (state, city, propertyType, price)
- Connection pooling for database connections
- Pagination for large result sets
- Image compression and validation
- Request logging for monitoring

## 🔒 Security Features

- Input validation and sanitization
- SQL injection prevention through Prisma ORM
- File upload validation (type, size, content)
- CORS configuration
- Helmet.js for security headers
- Environment variable protection

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

### Environment Setup

1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Start the application

## 📈 Monitoring

- Request logging middleware
- Error tracking and reporting
- Database query logging (development)
- Health check endpoint for uptime monitoring
