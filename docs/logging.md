# 📊 Winston Logging Guide

[← Back to Main README](../README.md) | [🔄 AsyncLocalStorage Context](./async-context.md)

## 📖 Overview

Winston is a versatile logging library for Node.js that supports multiple transports, custom formats, and structured logging. This guide covers implementation with **AsyncLocalStorage** for automatic request tracking across the entire request lifecycle.

> 💡 **Note**: This guide integrates with [AsyncLocalStorage Context Management](./async-context.md) for seamless request tracking.

## 🛠️ Logger Configuration

### Basic Setup with AsyncLocalStorage (`src/config/logger.config.ts`)

```typescript
import winston from "winston";
import { getRequestId } from "../utils/asyncContext.util";

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'DD-MM-YYYY HH:mm:ss'
        }),
        winston.format.json(),
        winston.format.printf((info) => {
            // Automatically get request ID from AsyncLocalStorage context
            const requestId = getRequestId();
            const output = {
                requestId: requestId || 'N/A',
                timestamp: info.timestamp,
                level: info.level,
                message: info.message,
                ...info // Spread any additional metadata
            }
            return JSON.stringify(output, null, 2);
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ 
            filename: 'logs/error.json', 
            level: 'error',
            format: winston.format.json()
        }),
        new winston.transports.File({ 
            filename: 'logs/combined.json',
            format: winston.format.json()
        })
    ]
});

export default logger;
```

## 🎯 Key Integration Benefits

### 1. **Automatic Request Tracking**
With AsyncLocalStorage integration, every log automatically includes the request ID:

```typescript
// In any part of your application
logger.info('Processing user data');
// Output: { "requestId": "abc-123", "timestamp": "...", "level": "info", "message": "Processing user data" }

// Even in async operations
setTimeout(() => {
    logger.info('Delayed operation completed');
    // Still includes the same requestId: "abc-123"
}, 1000);
```

### 2. **No Manual Parameter Passing**
```typescript
// ❌ Before: Manual request ID passing
export const userService = {
    async findUser(id: string, requestId: string) {
        logger.info('Finding user', { userId: id, requestId });
        // ... rest of logic
    }
};

// ✅ After: Automatic request ID from context
export const userService = {
    async findUser(id: string) {
        logger.info('Finding user', { userId: id }); // requestId automatically included
        // ... rest of logic
    }
};
```

### 3. **AsyncLocalStorage Integration Example**
```typescript
// In controller - Request ID automatically available
export const userController = (req, res, next) => {
    logger.info('Processing user request'); // Includes requestId from context
    
    // In service layer - Same request ID
    const user = await userService.findById(req.params.id);
    
    // In database operations - Still same request ID
    logger.info('User data retrieved'); // Same requestId throughout
};
```

## 🎨 Winston Formats

### 1. **Timestamp Format**
```typescript
winston.format.timestamp({
    format: 'DD-MM-YYYY HH:mm:ss' // Custom date format
})

// Other options:
// format: 'YYYY-MM-DD HH:mm:ss'
// format: () => new Date().toISOString()
```

### 2. **JSON Format**
```typescript
winston.format.json() // Converts log object to JSON string
```

### 3. **Custom Printf Format**
```typescript
winston.format.printf((info) => {
    return `${info.timestamp} [${info.level}]: ${info.message}`;
})
```

### 4. **Colorize Format (Console Only)**
```typescript
winston.format.colorize() // Adds colors to log levels
```

### 5. **Combined Formats**
```typescript
winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.simple()
)
```

## 🚛 Winston Transports

### 1. **Console Transport**
```typescript
new winston.transports.Console({
    level: 'info', // Minimum level to log
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    )
})
```

### 2. **File Transport**
```typescript
new winston.transports.File({
    filename: 'logs/app.log',
    level: 'info',
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    format: winston.format.json()
})
```

### 3. **Rotating File Transport**
```typescript
import 'winston-daily-rotate-file';

new winston.transports.DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d'
})
```

### 4. **Multiple Transports Example**
```typescript
transports: [
    // Console for development
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }),
    
    // Error file
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: winston.format.json()
    }),
    
    // Combined file
    new winston.transports.File({
        filename: 'logs/combined.log',
        format: winston.format.json()
    }),
    
    // Daily rotate file
    new winston.transports.DailyRotateFile({
        filename: 'logs/app-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        maxSize: '20m'
    })
]
```

## 📝 Logger Usage Examples

### 1. **Basic Logging**
```typescript
import logger from '../config/logger.config';

// Different log levels
logger.error('Something went wrong');
logger.warn('This is a warning');
logger.info('Information message');
logger.debug('Debug information');
logger.verbose('Verbose output');
```

### 2. **Logging with Metadata**
```typescript
logger.info('User login', {
    userId: '12345',
    email: 'user@example.com',
    ip: '192.168.1.1'
});

logger.error('Database connection failed', {
    error: err.message,
    stack: err.stack,
    database: 'users_db'
});
```

### 3. **AsyncLocalStorage Integration**
```typescript
// In controller
import { getRequestId } from '../middleware/attachUniqueID.middleware';

export const userController = (req, res, next) => {
    // Request ID automatically included via logger format
    logger.info('Processing user request');
    
    // Or manually include
    logger.info('User data retrieved', { 
        requestId: getRequestId(),
        userId: req.params.id 
    });
};
```

### 4. **Error Logging in Middleware**
```typescript
export const errorHandler = (err, req, res, next) => {
    logger.error('Request failed', {
        requestId: getRequestId(),
        error: err.message,
        statusCode: err.statusCode || 500,
        stack: err.stack,
        url: req.url,
        method: req.method
    });
};
```

## 📋 Log Output Examples with Request Tracking

### Console Output with AsyncLocalStorage
```
{
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "15-01-2024 14:30:25",
  "level": "info",
  "message": "User login attempt"
}
{
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "15-01-2024 14:30:26",
  "level": "info",
  "message": "Database query executed",
  "query": "SELECT * FROM users WHERE id = ?"
}
{
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "15-01-2024 14:30:27",
  "level": "info",
  "message": "User authenticated successfully"
}
```

### Complete Request Flow Logging
```json
{
  "requestId": "abc-123-def-456",
  "timestamp": "15-01-2024 14:30:25",
  "level": "info",
  "message": "Request started",
  "method": "GET",
  "url": "/api/users/123"
}
{
  "requestId": "abc-123-def-456",
  "timestamp": "15-01-2024 14:30:25",
  "level": "info", 
  "message": "Authentication successful",
  "userId": "user-789"
}
{
  "requestId": "abc-123-def-456",
  "timestamp": "15-01-2024 14:30:26",
  "level": "info",
  "message": "Database query executed",
  "table": "users",
  "duration": "45ms"
}
{
  "requestId": "abc-123-def-456",
  "timestamp": "15-01-2024 14:30:27",
  "level": "info",
  "message": "Request completed",
  "statusCode": 200,
  "totalDuration": "156ms"
}
```

## 🎯 Best Practices

### 1. **Log Levels Usage**
- **error**: System errors, exceptions
- **warn**: Deprecated features, unusual situations
- **info**: General application flow
- **debug**: Detailed debugging information
- **verbose**: Very detailed logs

### 2. **Structured Logging**
```typescript
// ✅ Good - Structured
logger.info('User action completed', {
    action: 'profile_update',
    userId: '12345',
    duration: 150
});

// ❌ Bad - Unstructured
logger.info(`User 12345 updated profile in 150ms`);
```

### 3. **Error Context**
```typescript
try {
    await processUser(userId);
} catch (error) {
    logger.error('User processing failed', {
        userId,
        error: error.message,
        stack: error.stack,
        context: 'user_service'
    });
}
```

### 4. **Performance Logging**
```typescript
const startTime = Date.now();
await someOperation();
const duration = Date.now() - startTime;

logger.info('Operation completed', {
    operation: 'data_processing',
    duration: `${duration}ms`,
    recordsProcessed: records.length
});
```

## 🔧 Environment Configuration

### Development vs Production
```typescript
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'production' 
        ? winston.format.json() 
        : winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
    transports: [
        new winston.transports.Console(),
        ...(process.env.NODE_ENV === 'production' ? [
            new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
            new winston.transports.File({ filename: 'logs/combined.log' })
        ] : [])
    ]
});
```

## 🔗 Related Documentation

- [🔄 AsyncLocalStorage Context](./async-context.md) - **Core dependency** for request tracking
- [🚨 Error Handling](./error-handling.md) - Error logging with request context
- [⚡ Middleware Patterns](./middleware.md) - Middleware implementation patterns

[← Back to Main README](../README.md)
