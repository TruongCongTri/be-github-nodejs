# 📦 Backend Test Project

This is a backend system built with **Node.js + Express** using **Firebase** for data storage and **ESMS.vn** for SMS delivery. It provides OTP (One-Time Password) functionality via phone numbers, GitHub user search with pagination, and GitHub user profile liking.

## 🌐 Live API Server

If you're working on the frontend and want to connect to a live backend, use the following base URL:

```
https://backend-test-78ay.onrender.com
```

## 🗂 Project Structure

```
├── src
│   ├── constant           # enum values
│   ├── controllers        # Controllers
│   ├── helpers            # Reusable helpers (response formatter)
│   ├── middlewares        # Schema validators
│   ├── routes             # Express route definitions
│   ├── services           # External services like Firebase and SMS
│   ├── utils              # Reusable utils (GitHub parser, generate 6-digits code)
│   ├── validations        # Yup schemas for body/query/params validation
│   └── index.js           # Main Express app setup
├── .env                   # Environment config
```

## 🚀 How to Run

1. **Install dependencies**

```bash
npm install
```

2. **Create a `.env` file** with these variables:

```env
PORT=5000
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
ESMS_API_KEY=your_esms_key
ESMS_SECRET_KEY=your_esms_secret
ESMS_BRAND_NAME=
ESMS_SMS_TYPE=2
ESMS_SANDBOX=true
NEXT_PUBLIC_ESMS_API=https://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_post_json/
```

3. **Run the project with hot-reload**

```bash
npm run start
```

### 💡 Why Nodemon?

We use **nodemon** during development to automatically restart the Node.js server whenever file changes are detected. This helps speed up development by removing the need to manually restart the server after every change.

---

## 📲 Why ESMS.vn?

We selected **ESMS.vn** as the SMS provider because it supports local delivery in Vietnam (prefix +84) and provides detailed delivery feedback.

### 🚫 Current limitation:

We are unable to receive the real SMS message due to the lack of a **registered brand name**. However, ESMS.vn still returns whether an SMS would be accepted or rejected.

➡ For development/testing, the backend will:

* Log the `accessCode` and `phoneNumber` in the console
* Still attempt to send via ESMS, recording the status

This approach simulates the real behavior without requiring an actual brandname.

---

## ✅ Why Yup for Validation?

We use [**Yup**](https://github.com/jquense/yup) to validate request bodies, queries, and parameters for these reasons:

* ✅ Declarative schema definition
* ✅ Type-safe and robust error reporting
* ✅ Works well with Express middleware
* ✅ Easy reuse across routes

Middleware is set up to apply Yup schema on every route depending on where the data comes from (query, body, or params).

---

## 📦 Why JSON Transformer Response Format?

Instead of returning raw data directly, we follow the [**JSON\:API-like**](https://jsonapi.org/) transformer approach:

```json
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

## ✅ Implemented Features

* [x] Phone-based OTP using Firebase & ESMS.vn
* [x] GitHub user search with pagination
* [x] Like GitHub users and retrieve liked list
* [x] Schema validation with Yup
* [x] Consistent API response formatting

---

## 📍 Next Steps

* Integrate brandname with ESMS.vn to enable real SMS
* Add Swagger documentation
* Add rate-limiting and request logging
* Set up frontend (React/Next.js) to consume these APIs

---

Made with ❤️ by [@TruongCongTri](https://github.com/TruongCongTri)

