# 🛠️ Project Setup Guide

[← Back to Main README](../README.md)

## 📋 Prerequisites

- Node.js (v16+)
- npm or yarn
- Git
- Code editor (VS Code recommended)

## 🚀 Step-by-Step Setup

### 1. Initialize Project
```bash
# Create project directory
mkdir ts-express-app
cd ts-express-app

# Initialize npm project
npm init -y
```

### 2. Install Dependencies

#### Production Dependencies
```bash
npm install express cors dotenv
```

#### Development Dependencies
```bash
npm install --save-dev \
  typescript \
  ts-node-dev \
  @types/node \
  @types/express \
  @types/cors \
  nodemon \
  concurrently
```

### 3. TypeScript Configuration

#### Create tsconfig.json
```bash
npx tsc --init
```

#### Recommended tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### 4. Package.json Scripts

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "clean": "rm -rf dist",
    "rebuild": "npm run clean && npm run build",
    "type-check": "tsc --noEmit",
    "dev:debug": "ts-node-dev --inspect --respawn --transpile-only src/index.ts"
  }
}
```

### 5. Environment Configuration

#### Create .env file
```env
NODE_ENV=development
PORT=3000
API_VERSION=v1
```

#### Create .env.example
```env
NODE_ENV=development
PORT=3000
API_VERSION=v1
LOG_LEVEL=info
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret
```

### 6. Git Configuration

#### Create .gitignore
```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build output
dist/
build/

# Environment variables
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Runtime
*.pid
*.seed
*.pid.lock
```

### 7. VS Code Configuration

#### Create .vscode/settings.json
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true
  }
}
```

#### Create .vscode/launch.json (for debugging)
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug TypeScript",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/index.ts",
      "runtimeArgs": ["-r", "ts-node/register"],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "sourceMaps": true
    }
  ]
}
```

## ▶️ Running the Application

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start

```

## 📁 Next Steps

1. [Set up project structure](./structure.md)
2. [Configure error handling](./error-handling.md)
3. [Add middleware](./middleware.md)
4. [Set up database](./database.md)

## 🔗 Related Documentation

- [Project Structure](./structure.md)
- [Environment Configuration](./environment.md)
- [Docker Setup](./docker.md)

[← Back to Main README](../README.md)
