# Overview

ReceiptPro is a full-stack web application that generates and emails professional receipts mimicking Apple's style. The application features user authentication through Replit's OAuth system, a credit-based usage model, and an admin panel for user management. Users can create receipts with product details, customer information, and billing addresses, which are then emailed as HTML receipts with Apple-like styling.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The client-side is built with React and TypeScript using Vite as the build tool. The application follows a component-based architecture with:

- **UI Framework**: Radix UI components with shadcn/ui styling for consistent design
- **Styling**: Tailwind CSS with custom CSS variables for theming and Apple-inspired design
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for client-side routing with conditional rendering based on authentication
- **Forms**: React Hook Form with Zod validation for type-safe form handling

The frontend implements a credit-based system where authenticated users can create receipts that consume credits, with real-time preview functionality showing Apple-style receipt formatting.

## Backend Architecture

The server uses Express.js with TypeScript in ESM mode, implementing:

- **API Design**: RESTful endpoints for receipt creation, user management, and admin operations
- **Authentication**: Replit OAuth integration with session-based authentication using express-session
- **Authorization**: Role-based access with separate admin authentication using bcrypt for password hashing
- **Email Service**: Nodemailer integration for sending HTML email receipts with Apple-style templates
- **Error Handling**: Centralized error middleware with structured error responses

## Data Layer

The application uses PostgreSQL with Drizzle ORM for type-safe database operations:

- **Database**: PostgreSQL hosted on Neon for production scalability
- **ORM**: Drizzle ORM with Zod integration for runtime type validation
- **Schema Design**: Normalized tables for users, receipts, admin users, and sessions
- **Migration Strategy**: Drizzle Kit for schema management and migrations

Key entities include users with credit tracking, receipts with detailed product information stored in cents for precision, and admin users for management operations.

## External Dependencies

- **Database**: Neon PostgreSQL serverless database with connection pooling
- **Authentication**: Replit OAuth service for user authentication and profile management
- **Email Service**: Gmail SMTP through Nodemailer for receipt delivery
- **Session Storage**: PostgreSQL-backed session store using connect-pg-simple
- **Frontend Components**: Radix UI primitives for accessible component foundations
- **Build Tools**: Vite with React plugin and TypeScript support for development and production builds
- **Styling**: Tailwind CSS with PostCSS for utility-first styling approach