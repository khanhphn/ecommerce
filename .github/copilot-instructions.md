# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a full-stack e-commerce application built with:
- **Backend**: .NET 9 Web API with Entity Framework Core, SQLite database, JWT authentication
- **Frontend**: Angular 20 with TypeScript, Bootstrap CSS framework

## Architecture
- **API Controllers**: Handle HTTP requests and responses
- **Services**: Business logic layer for authentication, products, orders, and cart management
- **Models/DTOs**: Data transfer objects for API communication
- **Components**: Angular UI components with reactive forms and routing
- **Interceptors**: HTTP interceptors for authentication token handling

## Key Features
- User authentication and registration
- Product catalog with categories
- Shopping cart functionality
- Order management system
- Responsive design with Bootstrap

## Development Guidelines
- Follow RESTful API conventions
- Use TypeScript strict mode
- Implement proper error handling
- Follow Angular style guide
- Use reactive programming with RxJS
- Implement proper security measures

## Database Schema
- Users: Authentication and user profiles
- Products: Product catalog with categories and inventory
- Orders: Order tracking and management
- OrderItems: Individual items within orders

## API Endpoints
- `/api/auth` - Authentication endpoints
- `/api/products` - Product management
- `/api/orders` - Order management

When working with this codebase, prioritize security, type safety, and maintainable code structure.
