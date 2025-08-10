# E-Commerce Application

A full-stack e-commerce application built with .NET Web API backend and Angular frontend.

## Features

### Backend (.NET 9 Web API)
- **Authentication**: JWT-based user authentication and registration
- **Product Management**: CRUD operations for products with categories
- **Order Processing**: Complete order management system
- **Database**: SQLite with Entity Framework Core
- **API Documentation**: Swagger/OpenAPI integration
- **CORS**: Configured for Angular frontend communication

### Frontend (Angular 20)
- **User Interface**: Responsive design with Bootstrap
- **Authentication**: Login/Register with JWT token management
- **Product Catalog**: Browse products by category
- **Shopping Cart**: Add/remove items, quantity management
- **Order History**: View past orders and order status
- **Routing**: Single Page Application with Angular Router

## Technology Stack

### Backend
- .NET 9 Web API
- Entity Framework Core
- SQLite Database
- JWT Authentication
- Swagger/OpenAPI

### Frontend
- Angular 20
- TypeScript
- Bootstrap 5
- Font Awesome Icons
- RxJS for reactive programming

## Project Structure

```
├── ECommerceApi/              # .NET Web API Backend
│   ├── Controllers/           # API Controllers
│   ├── Models/               # Entity Models
│   ├── DTOs/                 # Data Transfer Objects
│   ├── Services/             # Business Logic Services
│   ├── Data/                 # Database Context
│   └── Program.cs            # Application Entry Point
│
└── ecommerce-frontend/        # Angular Frontend
    ├── src/app/
    │   ├── components/       # Angular Components
    │   ├── services/         # Angular Services
    │   ├── models/          # TypeScript Interfaces
    │   ├── interceptors/    # HTTP Interceptors
    │   └── app.routes.ts    # Routing Configuration
    └── src/styles.css       # Global Styles
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/category/{category}` - Get products by category
- `POST /api/products` - Create product (authenticated)
- `PUT /api/products/{id}` - Update product (authenticated)
- `DELETE /api/products/{id}` - Delete product (authenticated)

### Orders
- `POST /api/orders` - Create order (authenticated)
- `GET /api/orders` - Get user orders (authenticated)
- `GET /api/orders/{id}` - Get order by ID (authenticated)
- `PATCH /api/orders/{id}/status` - Update order status (authenticated)

## Getting Started

### Prerequisites
- .NET 9 SDK
- Node.js (v18 or later)
- Angular CLI

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd ECommerceApi
   ```

2. Restore packages and build:
   ```bash
   dotnet restore
   dotnet build
   ```

3. Run the API:
   ```bash
   dotnet run
   ```

The API will be available at `https://localhost:5001` and `http://localhost:5000`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ecommerce-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The Angular application will be available at `http://localhost:4200`

## Sample Data

The application includes seed data with sample products:
- Laptop Pro (Electronics) - $1,299.99
- Wireless Mouse (Electronics) - $29.99
- Office Chair (Furniture) - $249.99
- Coffee Mug (Home) - $12.99

## Security Features

- JWT token-based authentication
- Password hashing with SHA256
- CORS configuration for secure cross-origin requests
- Protected API endpoints requiring authentication
- HTTP interceptor for automatic token attachment

## Database

The application uses SQLite database with the following entities:
- **Users**: User accounts with authentication
- **Products**: Product catalog with categories and inventory
- **Orders**: Order tracking and management
- **OrderItems**: Individual items within orders

## Development Notes

- The database is automatically created on first run
- JWT tokens expire after 24 hours
- CORS is configured to allow requests from `http://localhost:4200`
- The application supports both HTTP and HTTPS

## Future Enhancements

- Product search functionality
- Advanced filtering and sorting
- Payment integration
- Email notifications
- Admin dashboard
- Product reviews and ratings
- Inventory management
- Order tracking with shipping

## License

This project is for educational and demonstration purposes.
