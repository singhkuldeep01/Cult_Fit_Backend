# 🚨 Error Handling in Express

[← Back to Main README](../README.md)

## 📖 Overview

Express provides built-in error handling, but understanding its mechanisms is crucial for building robust applications. This guide covers comprehensive error handling strategies from basic to advanced patterns.

## 🔄 Error Handling Flow

Express error handling works in a specific order:
1. **Synchronous errors** → Automatically caught
2. **Asynchronous errors** → Must manually call `next(error)`
3. **Error middleware** → Processes all errors
4. **Default handler** → Fallback if no custom handler

## 1. 🔄 Synchronous Error Handling

Express automatically catches errors in synchronous route handlers:

```typescript
app.get('/sync-error', (req, res) => {
  throw new Error('This will be caught automatically');
  // Express catches this and passes to error handler
});

app.get('/sync-validation', (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new Error('Email is required'); // Automatically handled
  }
  res.json({ message: 'Valid email' });
});
```

## 2. ⚡ Asynchronous Error Handling

For async operations, you **must** explicitly call `next(error)`:

```typescript
// ❌ Wrong - Error won't be caught
app.get('/async-error-wrong', async (req, res) => {
  const data = await someAsyncOperation(); // If this throws, it won't be handled
  res.json(data);
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

// ✅ Better - Using async wrapper
app.get('/users', asyncHandler(async (req, res) => {
  const users = await getUsersFromDB();
  res.json(users);
}));
```

## 3. 🛠️ Custom Error Handling Middleware

Error middleware has **4 parameters** and must be defined LAST:

```typescript
// Basic error handler
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

## 4. 🏗️ Advanced Error Handling Patterns

### A. Async Wrapper Pattern

```typescript
// utils/asyncHandler.ts
import { Request, Response, NextFunction } from 'express';

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandler = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Usage
app.get('/users', asyncHandler(async (req, res) => {
  const users = await getUsersFromDB();
  res.json(users);
}));
```

### B. Custom Error Classes

```typescript
// utils/AppError.ts
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error types
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}
```

### C. Comprehensive Error Handler

```typescript
// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val: any) => val.message);
    error = new AppError(message.join(', '), 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new AppError(message, 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 404 handler
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Not found - ${req.originalUrl}`, 404);
  next(error);
};
```

## 5. 🌐 Global Error Handlers

```typescript
// app.ts or index.ts
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
```

## 6. 📝 Error Logging

```typescript
// utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;

// Usage in error handler
import logger from '../utils/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  // ...rest of error handling
};
```

## 7. ⚠️ Key Points to Remember

- ⚠️ **Async errors require manual `next(error)` calls**
- ⚠️ **Error middleware must have 4 parameters**
- ⚠️ **Error middleware should be defined LAST**
- ⚠️ **Always call `next()` in middleware unless sending response**
- ⚠️ **Default error handler only catches sync errors automatically**
- ⚠️ **Use try-catch for async operations**
- ⚠️ **Implement graceful shutdown handlers**
- ⚠️ **Log errors appropriately for debugging**

## 🔗 Related Documentation

- [Middleware Patterns](./middleware.md)
- [Logging Configuration](./logging.md)
- [Security Best Practices](./security.md)
- [Testing Error Scenarios](./testing.md)

[← Back to Main README](../README.md)
