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

### 3. **Daily Rotating File Transport (Recommended for Production)**
```typescript
import 'winston-daily-rotate-file';

new winston.transports.DailyRotateFile({
    filename: 'logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH', // Creates new file every hour
    zippedArchive: true, // Compress old files
    maxSize: '20m', // Max file size before rotation
    maxFiles: '14d' // Keep files for 14 days, then delete
})
```

#### **DailyRotateFile Configuration Options**

| Option | Description | Example |
|--------|-------------|---------|
| `filename` | File path with %DATE% placeholder | `'logs/app-%DATE%.log'` |
| `datePattern` | Date format for file rotation | `'YYYY-MM-DD'` (daily), `'YYYY-MM-DD-HH'` (hourly) |
| `zippedArchive` | Compress old files to save space | `true` |
| `maxSize` | Max file size before creating new file | `'20m'`, `'100k'`, `'1g'` |
| `maxFiles` | Retention period | `'14d'` (14 days), `'10'` (10 files) |
| `auditFile` | Metadata file to track rotations | `'logs/audit.json'` |

#### **File Rotation Examples**

**Daily Rotation:**
```typescript
new winston.transports.DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD', // New file each day
    maxFiles: '30d' // Keep 30 days of logs
})
// Creates: application-2024-01-15.log, application-2024-01-16.log, etc.
```

**Hourly Rotation:**
```typescript
new winston.transports.DailyRotateFile({
    filename: 'logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH', // New file each hour
    maxFiles: '7d' // Keep 7 days of logs
})
// Creates: app-2024-01-15-14.log, app-2024-01-15-15.log, etc.
```

**Size-based Rotation:**
```typescript
new winston.transports.DailyRotateFile({
    filename: 'logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '10m', // Rotate when file reaches 10MB
    maxFiles: '20' // Keep maximum 20 files
})
```

#### **Automatic File Cleanup**

The plugin automatically:
- **Creates new files** based on date pattern
- **Compresses old files** (if `zippedArchive: true`)
- **Deletes expired files** based on `maxFiles` setting
- **Tracks rotations** in audit file

```typescript
// Complete production configuration
new winston.transports.DailyRotateFile({
    filename: 'logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true, // Old files become .gz
    maxSize: '20m',
    maxFiles: '30d', // Auto-delete files older than 30 days
    auditFile: 'logs/audit.json', // Track rotation metadata
    level: 'info'
})
```

#### **File Structure Example**
```
logs/
├── app-2024-01-15.log.gz    # Compressed old file
├── app-2024-01-16.log.gz    # Compressed old file
├── app-2024-01-17.log       # Current active file
├── audit.json               # Rotation metadata
└── error-2024-01-17.log     # Separate error log
```

### 4. **Complete Production Setup with Daily Rotation**
```typescript
// src/config/logger.config.ts
import winston from 'winston';
import 'winston-daily-rotate-file';
import { getRequestId } from '../utils/asyncContext.util';

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((info) => {
            const requestId = getRequestId();
            return JSON.stringify({
                requestId: requestId || 'N/A',
                timestamp: info.timestamp,
                level: info.level,
                message: info.message,
                ...info
            }, null, 2);
        })
    ),
    transports: [
        // Console for development
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        
        // Combined logs with daily rotation
        new winston.transports.DailyRotateFile({
            filename: 'logs/app-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '30d', // Keep 30 days
            level: 'info'
        }),
        
        // Error logs with daily rotation
        new winston.transports.DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '10m',
            maxFiles: '30d', // Keep 30 days
            level: 'error'
        }),
        
        // Debug logs (shorter retention)
        new winston.transports.DailyRotateFile({
            filename: 'logs/debug-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '50m',
            maxFiles: '7d', // Keep only 7 days for debug logs
            level: 'debug'
        })
    ]
});

export default logger;
```

#### **Benefits of Daily Rotation**
- ✅ **Automatic cleanup** - Old files deleted automatically
- ✅ **Space efficiency** - Files compressed with gzip
- ✅ **Manageable file sizes** - Prevents huge log files
- ✅ **Easy searching** - Find logs by date
- ✅ **Production ready** - Handles long-running applications

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
- [🔄 AsyncLocalStorage Context](./async-context.md) - **Core dependency** for request tracking
- [🚨 Error Handling](./error-handling.md) - Error logging with request context
- [⚡ Middleware Patterns](./middleware.md) - Middleware implementation patterns

[← Back to Main README](../README.md)
