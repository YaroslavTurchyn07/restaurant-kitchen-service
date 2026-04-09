# Restaurant Kitchen Service

A full-stack web application for managing a restaurant kitchen — dishes, ingredients, dish types, and the cooking team.

## Features

- **Authentication** — register and log in as a cook (JWT-based)
- **Dishes** — create, edit, and delete dishes with price, description, type, cooks, and ingredients
- **Dish Types** — manage dish categories (e.g. Soup, Salad, Dessert)
- **Ingredients** — manage ingredients with unit of measurement
- **Team** — view the cooking team and their assigned dishes

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express 4, Sequelize 6 |
| Database | SQLite (file-based, no setup required) |
| Auth | JWT + bcryptjs |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/restaurant-kitchen-service.git
cd restaurant-kitchen-service
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file based on the example:

```bash
cp .env.example .env
```

Open `backend/.env` and set your values:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=restaurant_kitchen
DB_USER=postgres
DB_PASSWORD=your_password_here

JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
```

> **Note:** The app uses SQLite, so `DB_*` variables are not required. The database file (`database.sqlite`) is created automatically on first run.

### 3. Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
```

### 4. Run the application

You need **two terminals** running simultaneously.

**Terminal 1 — Backend** (port 5000):
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend** (port 3000):
```bash
cd frontend
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

On first launch, the database tables are created automatically. Register a new account to get started.

---

## Project Structure

```
restaurant-kitchen-service/
├── backend/
│   ├── src/
│   │   ├── config/        # Database connection
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # JWT authentication
│   │   ├── models/        # Sequelize models
│   │   └── routes/        # API routes
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/           # Axios API client
│   │   ├── components/    # Navbar, Modal
│   │   ├── context/       # Auth context
│   │   ├── pages/         # Page components
│   │   └── styles/        # Global CSS
│   └── package.json
└── README.md
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new cook | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/me` | Get current user | Yes |
| GET | `/api/dishes` | List all dishes | Yes |
| POST | `/api/dishes` | Create a dish | Yes |
| PUT | `/api/dishes/:id` | Update a dish | Yes |
| DELETE | `/api/dishes/:id` | Delete a dish | Yes |
| GET | `/api/dish-types` | List dish types | Yes |
| POST | `/api/dish-types` | Create dish type | Yes |
| GET | `/api/ingredients` | List ingredients | Yes |
| POST | `/api/ingredients` | Create ingredient | Yes |
| GET | `/api/cooks` | List all cooks | Yes |

## Registration Rules

| Field | Rule |
|---|---|
| First / Last Name | 2–20 characters |
| Username | 3–50 characters, unique |
| Email | Valid email format, unique |
| Password | Min 8 chars, at least 1 uppercase letter, 1 digit, 1 special character |

## Available Scripts

### Backend

| Command | Description |
|---|---|
| `npm run dev` | Start with nodemon (auto-restart on changes) |
| `npm start` | Start in production mode |

### Frontend

| Command | Description |
|---|---|
| `npm start` | Start development server |
| `npm run build` | Build for production |
