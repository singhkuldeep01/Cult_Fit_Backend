
## ��� Project Setup Commands

### 1. Initialize project
```bash
npm init -y
```

### 2. Install dependencies
```bash
npm install express
npm install --save-dev typescript ts-node-dev @types/node @types/express
```

### 3. Create tsconfig.json
```bash
npx tsc --init
```

### 4. Scripts in package.json
```json
"scripts": {
  "dev": "ts-node-dev --respawn src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

### 5. Project structure
```
ts-express-app/
├── src/
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

### 6. Run the server
```bash
npm run dev
```

