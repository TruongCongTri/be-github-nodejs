# 📦 Backend Educaton E-commerce Project

This is the back-end API for the Education E-commerce Platform — a learning system designed for students to browse, save, and interact with online courses.

## 🌐 Live API Server

If you're working on the frontend and want to connect to a live backend, use the following base URL:

``` Live API Server
https://be-edu-ecommerce-nodejs-supabase.onrender.com

```

## 🗂 Project Structure

``` Structure
src/
│
├── app/               # 🔧 Core application logic (feature-based)
│   ├── routes/        # apis
│   │
│   ├── controllers/   # Receive Requrest and return Response     
│   │
│   ├── services/      # Handle Logics
│   │
│   └── repositories/  # (TypeORM repository)
│   │
│   └── middleware/  
│   │
├── database/          # 🗃️ TypeORM configuration & DB logic
│   ├── entities/      # All entity classes (decorated with @Entity)
│   │   ├── user.entity.ts
│   │
│   ├── migrations/    # Database migrations
│   │   └── YYYYMMDD-InitialSchema.ts
│   │   
│   ├── dto/           # 📦 Validation & transformation schemas 
│   │   └── login.dto.ts # DTOs for login, register, etc.
│   │
├── utils/             # 🔨 Helper functions and reusable logic
│   ├── auth.util.ts   # JWT helpers (sign, verify)
│   ├── cookie.util.ts # Cookie parsing, setting
│   ├── response.util.ts # Standard API response format
│   └── error.util.ts  # Custom error classes
│
├── types/             # 📐 Shared interfaces & TypeScript types
│   ├── api-response.ts
│   └── auth-payload.ts
│
│── data-source.ts     # Database config (both local - PostgreSql & globally - Supabase)
├── index.ts           # 🏁 App entry point ( middleware)

```

## 🚀 How to Run

1. **Install dependencies**

```bash
npm install
```

2. **Create a `.env` file** with these variables:

```env
DB_HOST=
DB_NAME=
DB_USERNAME=
DB_PASSWORD=
PORT=5000

BYCRYPT_SALT=10
JWT_SECRET=
JWT_EXPIRES_IN=

DATABASE_URL=ipv4

```

3. **Run the project with hot-reload**

```bash
npm run nodemon

```

---

## 💡 Why Nodemon?

We use **nodemon** during development to automatically restart the Node.js server whenever file changes are detected. This helps speed up development by removing the need to manually restart the server after every change.


---

## 📲 Why TypeORM?

### 🔄 1. Why Use TypeORM for Repositories?

TypeORM is an Object-Relational Mapper that allows you to work with your database using TypeScript classes and decorators, instead of raw SQL. Here’s why it’s a strong fit for your backend.

#### ✅ Benefits:
* Type-Safe Queries:
* Repository Pattern Built-In:
* Built-in Relationships:
* Decorator:

### 🧬 2. Why Use TypeORM for Migrations?:

Migrations are crucial for managing and evolving your database schema as your application grows.

#### ✅ Benefits:
* Database Sync Tracking:
* Version Control for DB Schema:
* Safe Deployments:


---

## 📦 Why Use class-validator and class-transformer?

These two libraries are used together to bring runtime validation and type-safe transformation to incoming data—especially for DTOs (Data Transfer Objects) in request/response handling:

## 📌 1. class-validator – for Request Data Validation:

class-validator allows you to validate incoming request data using simple TypeScript decorators in your DTO classes.

#### ✅ Benefits:
* Decorator:
* Automatic error messages:
  
## 🔁 2. class-transformer – for Converting Plain JSON into Class Instances:

JSON from requests comes in as plain JavaScript objects, not typed class instances. class-transformer helps by:
* Transforming plain objects → class instances
* Enabling class-validator to actually work, since it needs class metadata
* Filtering out unknown/unwanted properties (@Expose, @Exclude)



``` JSON
{
  "data": {
    "users": [ ... ]
  },
  "meta": {
    "success": true,
    "message": "Success",
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 100,
      "total_pages": 10
    }
  }
}
```


Although it may not strictly follow the test specification, this format:

* 🧩 Makes the response **consistent** across endpoints
* 📖 Makes it easier for the frontend to consume
* 🧪 Provides additional context like pagination and messages

We believe this leads to better maintainability and user experience in real-world applications.

---

Made with ❤️ by [@TruongCongTri](https://github.com/TruongCongTri)

