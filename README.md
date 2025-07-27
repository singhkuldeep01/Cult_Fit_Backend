# 🚀 Generic TypeScript Express Server

A comprehensive TypeScript Express.js server template with detailed documentation and best practices.

## 📚 Documentation Index

### Quick Start
- [🛠️ Project Setup](./docs/setup.md) - Complete project initialization and configuration
- [🏗️ Project Structure](./docs/structure.md) - Detailed project organization and file structure

### Core Concepts
- [🚨 Error Handling](./docs/error-handling.md) - Comprehensive error handling strategies
- [⚡ Middleware](./docs/middleware.md) - Custom middleware patterns and usage
- [📊 Logging](./docs/logging.md) - Winston logging with request tracking
- [🔄 Async Context](./docs/async-context.md) - AsyncLocalStorage for request lifecycle management
- [🔒 Security](./docs/security.md) - Security best practices and implementation

### Advanced Topics
- [🗄️ Database Integration](./docs/database.md) - Database setup and ORM integration
- [🔐 Authentication](./docs/authentication.md) - JWT and session-based authentication
- [📝 API Documentation](./docs/api-docs.md) - Swagger/OpenAPI integration
- [🧪 Testing](./docs/testing.md) - Unit and integration testing setup

### Deployment & DevOps
- [🚢 Deployment](./docs/deployment.md) - Production deployment strategies
- [🐳 Docker](./docs/docker.md) - Containerization setup
- [⚙️ Environment Configuration](./docs/environment.md) - Environment variables and configuration

## 🚀 Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd genericTypeScriptServer
npm install

# Start development server
npm run dev
```

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- TypeScript knowledge
- Basic Express.js understanding

## 🤝 Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) file for details.
});
```

### 2. **Asynchronous Error Handling**
For async operations, you **must** explicitly call `next(error)`:

```typescript
// ❌ Wrong - Error won't be caught
app.get('/async-error-wrong', async (req, res) => {
  const data = await someAsyncOperation(); // If this throws, it won't be handled
});

// ✅ Correct - Manually catch and pass to next()
app.get('/async-error-correct', async (req, res, next) => {
  try {
    const data = await someAsyncOperation();
    res.json(data);
  } catch (error) {
    next(error); // Pass error to Express error handler
  }
});
```

### 3. **Default Error Handler**
Express has a built-in error handler that:
- Only works for synchronous errors automatically
- Sends error details in development
- Sends generic message in production
- Always calls `next()` to continue to next middleware

### 4. **Custom Error Handling Middleware**
Error middleware has **4 parameters** (err, req, res, next):

```typescript
// Custom error handler (must be defined LAST)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  
  res.status(500).json({
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});
```

### 5. **Multiple Error Handling Strategies**

#### A. **Async Wrapper Pattern**
```typescript
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage
app.get('/users', asyncHandler(async (req, res) => {
  const users = await getUsersFromDB(); // Errors automatically passed to error handler
  res.json(users);
}));
```

#### B. **Class-based Error Handling**
```typescript
class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Usage
app.get('/user/:id', async (req, res, next) => {
  try {
    const user = await findUserById(req.params.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});
```

#### C. **Global Unhandled Rejection Handler**
```typescript
// In your main app file
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
```

### 6. **Key Points to Remember**
- ⚠️ **Async errors require manual `next(error)` calls**
- ⚠️ **Error middleware must have 4 parameters**
- ⚠️ **Error middleware should be defined LAST**
- ⚠️ **Always call `next()` in middleware unless sending response**
- ⚠️ **Default error handler only catches sync errors automatically**

### 7. **Complete Error Handling Setup**
```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val: any) => val.message);
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
```

