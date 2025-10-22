# Notes API

A simple, type-safe CRUD API for managing notes built with **Hono**, **TypeScript**, and **Vite**.

## 🚀 Features

- **RESTful API** - Complete CRUD operations for notes
- **TypeScript** - Full type safety with Zod validation
- **OpenAPI/Swagger** - Interactive API documentation
- **Functional approach** - Clean, functional programming patterns
- **In-memory storage** - Simple array-based storage (no database required)
- **Modern tooling** - Vite bundler with fast development experience

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API health check and information |
| `GET` | `/notes` | Get all notes |
| `GET` | `/notes/:id` | Get note by ID |
| `POST` | `/notes` | Create a new note |
| `PUT` | `/notes/:id` | Update an existing note |
| `DELETE` | `/notes/:id` | Delete a note |
| `GET` | `/ui` | Swagger UI documentation |
| `GET` | `/doc` | OpenAPI JSON specification |

## 🛠️ Setup & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Access the API

```bash
# API runs on
open http://localhost:3000

# Interactive documentation
open http://localhost:3000/ui
```

## 📝 Example Usage

### Create a Note
```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Note",
    "content": "This is the content of my note"
  }'
```

### Get All Notes
```bash
curl http://localhost:3000/notes
```

### Update a Note
```bash
curl -X PUT http://localhost:3000/notes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title"
  }'
```

## 🏗️ Tech Stack

- **[Hono](https://hono.dev/)** - Lightweight web framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Zod](https://zod.dev/)** - Schema validation
- **[Vite](https://vitejs.dev/)** - Fast build tool
- **[@hono/zod-openapi](https://github.com/honojs/middleware/tree/main/packages/zod-openapi)** - OpenAPI integration
- **[@hono/swagger-ui](https://github.com/honojs/middleware/tree/main/packages/swagger-ui)** - Interactive API docs

## 📁 Project Structure

```
src/
├── index.ts          # Main application entry point
├── routes.ts         # API route definitions with OpenAPI schemas
├── notesService.ts   # Business logic and data operations
└── types.ts          # TypeScript types and Zod schemas
```

## 🔧 Development Notes

- Uses **ES modules** with `.ts` imports (resolved by Vite)
- **Functional programming** approach with pure functions
- **Type-safe** request/response handling with Zod validation
- **Hot reload** enabled for fast development iteration
