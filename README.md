# 🚀 Generic TypeScript Express Server

A comprehensive TypeScript Express.js server template with detailed documentation and best practices.

## 📚 Documentation Index

### Quick Start
- [🛠️ Project Setup](./docs/setup.md) - Complete project initialization and configuration
- [🏗️ Project Structure](./docs/structure.md) - Detailed project organization and file structure

### Core Concepts
- [🚨 Error Handling](./docs/error-handling.md) - Comprehensive error handling strategies
- [📊 Logging](./docs/logging.md) - Winston logging with request tracking
- [🔄 Async Context](./docs/async-context.md) - AsyncLocalStorage for request lifecycle management

## 🚀 Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd genericTypeScriptServer
npm install

# Start development server
npm run dev
```

## Error Handling Guide

### 1. **Synchronous Error Handling**
Express automatically catches synchronous errors:

```typescript
// Express automatically catches this
app.get('/sync-error', (req, res) => {
  throw new Error('Something went wrong!'); // Automatically handled
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

### 5. **Class-based Error Handling**
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

### Key Points to Remember
- ⚠️ **Async errors require manual `next(error)` calls**
- ⚠️ **Error middleware must have 4 parameters**
- ⚠️ **Error middleware should be defined LAST**
- ⚠️ **Always call `next()` in middleware unless sending response**
- ⚠️ **Default error handler only catches sync errors automatically**
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



