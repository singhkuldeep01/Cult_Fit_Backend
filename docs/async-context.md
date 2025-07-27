# 🔄 AsyncLocalStorage Context Management

[← Back to Main README](../README.md)

## 📖 Overview

AsyncLocalStorage is a Node.js feature that creates isolated storage contexts for asynchronous operations. In our case, it creates a unique context for each HTTP request that persists throughout the entire request lifecycle, allowing us to access request-specific data anywhere in our application without manually passing it through function parameters.

## 🔬 How AsyncLocalStorage Works

### Context Creation
When an HTTP request arrives, AsyncLocalStorage creates an isolated "store" that contains request-specific data. This store is automatically propagated through all asynchronous operations within that request.

```typescript
// Each request gets its own isolated context
Request 1: { requestId: "abc-123" } ──┐
Request 2: { requestId: "def-456" } ──┼── Isolated contexts
Request 3: { requestId: "ghi-789" } ──┘
```

### Request Lifecycle Persistence
The context persists through:
- **Synchronous operations** (function calls, calculations)
- **Asynchronous operations** (Promises, async/await, setTimeout)
- **Database calls** (Mongoose, Prisma, raw queries)
- **External API calls** (HTTP requests, third-party services)
- **File operations** (fs.readFile, fs.writeFile)

## 🛠️ Implementation

### 1. **AsyncLocalStorage Setup** (`src/utils/asyncContext.util.ts`)

```typescript
import { AsyncLocalStorage } from 'async_hooks';

// Define the structure of our context store
interface RequestContext {
    requestId: string;
    userId?: string;
    startTime?: number;
    // Add other request-specific data as needed
}

// Create the AsyncLocalStorage instance
export const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

// Helper function to get the current context
export const getRequestContext = (): RequestContext | undefined => {
    return asyncLocalStorage.getStore();
};

// Helper function to get just the request ID
export const getRequestId = (): string | undefined => {
    const context = asyncLocalStorage.getStore();
    return context?.requestId;
};

// Helper function to update context
export const updateContext = (updates: Partial<RequestContext>): void => {
    const context = asyncLocalStorage.getStore();
    if (context) {
        Object.assign(context, updates);
    }
};
```

### 2. **Middleware Integration** (`src/middleware/attachUniqueID.middleware.ts`)

```typescript
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from 'uuid';
import { asyncLocalStorage } from '../utils/asyncContext.util';

export const attachUniqueID = (req: Request, res: Response, next: NextFunction): void => {
    const requestId = uuidv4();
    const startTime = Date.now();
    
    // Create context and run the entire request within it
    asyncLocalStorage.run({ requestId, startTime }, () => {
        // Set response header for client tracking
        res.setHeader('x-correlation-id', requestId);
        next();
    });
};

// Export helper for backward compatibility
export const getRequestId = (): string | undefined => {
    const context = asyncLocalStorage.getStore();
    return context?.requestId;
};
```

## 🔄 Request Lifecycle Example

```typescript
// 1. Request arrives
GET /api/users/123

// 2. Middleware creates context
asyncLocalStorage.run({ requestId: "abc-123", startTime: 1640995200000 }, () => {

    // 3. Controller execution
    export const getUserById = async (req, res, next) => {
        // ✅ Request ID available here
        logger.info('Fetching user'); // Logs with requestId: "abc-123"
        
        // 4. Service layer
        const user = await userService.findById(req.params.id);
        
        // 5. Database operation
        // ✅ Request ID still available in async operation
        
        res.json(user);
    };

    // 6. Error handling (if needed)
    errorHandler(err, req, res, next) {
        // ✅ Request ID available in error handler
        logger.error('Request failed'); // Logs with requestId: "abc-123"
    }

}); // Context ends when request completes
```

## 🎯 Usage Patterns

### 1. **Basic Usage in Controllers**
```typescript
import { getRequestId, getRequestContext } from '../utils/asyncContext.util';
import logger from '../config/logger.config';

export const userController = async (req: Request, res: Response) => {
    // Access request ID anywhere
    const requestId = getRequestId();
    logger.info('Processing user request'); // Automatically includes requestId
    
    // Access full context
    const context = getRequestContext();
    console.log(`Request ${context?.requestId} started at ${context?.startTime}`);
    
    // Your business logic here
    const users = await userService.getAllUsers();
    res.json(users);
};
```

### 2. **Service Layer Usage**
```typescript
// src/services/user.service.ts
import { getRequestId } from '../utils/asyncContext.util';
import logger from '../config/logger.config';

export class UserService {
    static async findById(id: string) {
        // Request ID automatically available
        logger.info(`Fetching user ${id}`); // Includes requestId
        
        const user = await User.findById(id);
        
        if (!user) {
            logger.warn(`User ${id} not found`); // Same requestId
        }
        
        return user;
    }
    
    static async updateUser(id: string, data: any) {
        // Even in complex async operations
        const user = await User.findById(id);
        
        // Simulate external API call
        await fetch('https://api.example.com/validate', {
            headers: {
                'x-correlation-id': getRequestId() // Pass to external services
            }
        });
        
        return await user.save();
    }
}
```

### 3. **Database Operations**
```typescript
// The context persists through all database operations
export const createOrder = async (orderData: any) => {
    const session = await mongoose.startSession();
    
    try {
        await session.withTransaction(async () => {
            // Create order
            const order = await Order.create(orderData);
            logger.info('Order created', { orderId: order.id }); // Same requestId
            
            // Update inventory
            await Inventory.updateMany(/* ... */);
            logger.info('Inventory updated'); // Same requestId
            
            // Send email notification
            await emailService.sendOrderConfirmation(order);
            logger.info('Email sent'); // Same requestId
        });
    } catch (error) {
        logger.error('Order creation failed', { error: error.message }); // Same requestId
        throw error;
    } finally {
        session.endSession();
    }
};
```

### 4. **Error Handling Integration**
```typescript
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Request ID automatically available from context
    logger.error('Request failed', {
        error: err.message,
        statusCode: err.statusCode || 500,
        stack: err.stack,
        url: req.url,
        method: req.method
        // requestId automatically included via logger format
    });
    
    const context = getRequestContext();
    const duration = Date.now() - (context?.startTime || 0);
    
    logger.info('Request completed', { 
        duration: `${duration}ms`,
        success: false 
    });
    
    res.status(err.statusCode || 500).json({
        error: err.message,
        requestId: getRequestId() // Include in response for client debugging
    });
};
```

## 🔧 Advanced Usage

### 1. **Adding User Context**
```typescript
// In authentication middleware
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    const user = await verifyToken(token);
    
    // Add user info to context
    updateContext({ userId: user.id });
    
    next();
};

// Now userId is available everywhere
const context = getRequestContext();
logger.info('User action', { userId: context?.userId });
```

### 2. **Performance Tracking**
```typescript
// In middleware
export const performanceTracker = (req: Request, res: Response, next: NextFunction) => {
    updateContext({ startTime: Date.now() });
    
    res.on('finish', () => {
        const context = getRequestContext();
        const duration = Date.now() - (context?.startTime || 0);
        logger.info('Request completed', { duration: `${duration}ms` });
    });
    
    next();
};
```

### 3. **External Service Correlation**
```typescript
// Propagate request ID to external services
export const callExternalAPI = async (data: any) => {
    const requestId = getRequestId();
    
    const response = await fetch('https://api.partner.com/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-correlation-id': requestId, // Propagate for distributed tracing
        },
        body: JSON.stringify(data)
    });
    
    logger.info('External API called', { 
        url: 'https://api.partner.com/data',
        status: response.status 
    });
    
    return response.json();
};
```

## ⚠️ Important Considerations

### 1. **Context Boundaries**
- Context is **per-request** - different requests have different contexts
- Context is **not shared** between requests
- Context **automatically cleans up** when request completes

### 2. **Performance Impact**
- Minimal overhead for most applications
- Context creation happens once per request
- No memory leaks - contexts are garbage collected

### 3. **Debugging Benefits**
- Easy request tracing across all layers
- Simplified error debugging
- Clear request flow visualization

## 🔗 Related Documentation

- [📊 Logging Guide](./logging.md) - Winston integration with AsyncLocalStorage
- [🚨 Error Handling](./error-handling.md) - Error tracking with request context
- [⚡ Middleware Patterns](./middleware.md) - Middleware implementation patterns

[← Back to Main README](../README.md)
