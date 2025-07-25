# 🏗️ Project Structure Guide

[← Back to Main README](../README.md)

## 📁 Recommended Project Structure

```
ts-express-app/
├── src/
│   ├── controllers/             # Route controllers
│   ├── middleware/              # Custom middleware
│   ├── models/                  # Data models
│   ├── routes/                  # Route definitions
│   ├── services/               # Business logic
│   ├── utils/                  # Utility functions
│   ├── config/                 # Configuration files
│   ├── types/                  # TypeScript type definitions
│   ├── app.ts                  # Express app configuration
│   └── index.ts               # Application entry point
├── tests/                      # Test files
├── docs/                       # Documentation
├── logs/                       # Application logs
├── dist/                       # Compiled output
├── .env                        # Environment variables
├── package.json               # NPM dependencies
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Project documentation
```

## 📄 Core Files

### `src/index.ts` - Entry Point
```typescript
import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### `src/app.ts` - Express Configuration
```typescript
import express from 'express';
import cors from 'cors';
import { errorHandler, notFound } from './middleware/errorHandler';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1', routes);
app.use(notFound);
app.use(errorHandler);

export default app;
```

## 📂 Directory Purpose

- **`controllers/`** - Handle HTTP requests/responses
- **`services/`** - Business logic and data operations
- **`routes/`** - API endpoint definitions
- **`middleware/`** - Custom middleware functions
- **`models/`** - Database models and schemas
- **`utils/`** - Helper functions and utilities
- **`config/`** - Environment configurations
- **`types/`** - TypeScript type definitions

## 📝 Naming Conventions

- **Files**: `user.controller.ts`, `auth.service.ts`
- **Classes**: `UserService`, `AppError`
- **Interfaces**: `IUser`, `IApiResponse`
- **Types**: `UserType`, `RequestWithUser`
- **Constants**: `DEFAULT_LIMIT`, `API_VERSION`

## 🚀 Scaling Pattern

For larger applications, use feature-based modules:

```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.routes.ts
│   │   └── auth.types.ts
│   └── users/
│       ├── users.controller.ts
│       ├── users.service.ts
│       └── users.routes.ts
├── shared/
│   ├── middleware/
│   ├── utils/
│   └── types/
└── config/
```

## 🛣️ Router Implementation Example

### Main Routes Index (`src/routes/index.ts`)
```typescript
import { Router } from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';

const router = Router();

// Mount route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default router;
```

### User Routes (`src/routes/user.routes.ts`)
```typescript
import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateUser } from '../middleware/validation.middleware';

const router = Router();

// GET /api/v1/users
router.get('/', authenticate, getUsers);

// GET /api/v1/users/:id
router.get('/:id', authenticate, getUserById);

// POST /api/v1/users
router.post('/', authenticate, validateUser, createUser);

// PUT /api/v1/users/:id
router.put('/:id', authenticate, validateUser, updateUser);

// DELETE /api/v1/users/:id
router.delete('/:id', authenticate, deleteUser);

export default router;
```

### Auth Routes (`src/routes/auth.routes.ts`)
```typescript
import { Router } from 'express';
import { register, login, logout, refreshToken } from '../controllers/auth.controller';
import { validateLogin, validateRegister } from '../middleware/validation.middleware';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', validateRegister, register);

// POST /api/v1/auth/login
router.post('/login', validateLogin, login);

// POST /api/v1/auth/logout
router.post('/logout', logout);

// POST /api/v1/auth/refresh
router.post('/refresh', refreshToken);

export default router;
```

### Route Usage in App (`src/app.ts`)
```typescript
import express from 'express';
import cors from 'cors';
import { errorHandler, notFound } from './middleware/errorHandler';
import routes from './routes'; // imports from routes/index.ts

const app = express();

app.use(cors());
app.use(express.json());

// Mount all routes with /api/v1 prefix
app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
```

### Resulting API Endpoints
```
GET    /api/v1/health
GET    /api/v1/users
GET    /api/v1/users/:id
POST   /api/v1/users
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
```

## 🔗 Related Documentation

- [Setup Guide](./setup.md)
- [Error Handling](./error-handling.md)
- [Middleware Patterns](./middleware.md)

[← Back to Main README](../README.md)
