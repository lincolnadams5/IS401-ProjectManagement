# Dino Camp Roster

A full-stack application for managing campers at Dino Discovery Camp. Built with React, Express, and PostgreSQL.

## Features

- View enrolled campers with their usernames and emojis
- Edit camper usernames (saved to database)
- Real-time updates via API

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn-ui
- **Backend**: Node.js, Express
- **Database**: PostgreSQL

## Prerequisites

- Node.js and npm
- PostgreSQL installed and running

## Setup

### 1. Install Dependencies

```bash
npm run install:all
```

This installs dependencies for root, backend, and frontend.

### 2. Database Setup

Create the PostgreSQL database and run the schema:

```bash
# Create database
psql -U postgres -c "CREATE DATABASE dinocamp;"

# Run schema
psql -U postgres -d dinocamp -f db/schema.sql

# Seed initial data
psql -U postgres -d dinocamp -f db/seed.sql
```

### 3. Environment Configuration

Copy `.env.example` to `.env` and update with your database credentials:

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL settings:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dinocamp
DB_USER=postgres
DB_PASSWORD=your_password_here
PORT=3001
```

### 4. Run the Application

Start both frontend and backend servers:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend dev server on `http://localhost:8080`

## Project Structure

```
├── frontend/          # React frontend application
├── backend/           # Express API server
├── db/                # Database scripts
│   ├── schema.sql     # Database schema
│   └── seed.sql       # Initial data
└── .env               # Environment variables
```

## API Endpoints

- `GET /api/users` - Get all campers
- `PUT /api/users/:id/username` - Update camper username
- `GET /api/health` - Health check

## Scripts

- `npm run dev` - Start both frontend and backend
- `npm run dev:backend` - Start backend only
- `npm run dev:frontend` - Start frontend only
- `npm run install:all` - Install all dependencies
- `npm run build` - Build frontend for production
