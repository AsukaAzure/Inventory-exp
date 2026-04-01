# Inventory Management

This repository contains a full-stack Inventory Management application.

- `backend/`: Node.js/Express API
- `client/`: Next.js frontend

## Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB running locally or remote DB URI

## Backend Setup

1. `cd backend`
2. `npm install`
3. configure `.env` with `MONGO_URI`, `JWT_SECRET`, etc.
4. `npm run dev` (or `npm start`)

## Frontend Setup

1. `cd client`
2. `npm install`
3. `npm run dev`

## API Endpoints

- `POST /api/auth/login`
- `GET /api/items`
- `POST /api/items`
- `GET /api/sections`
- `POST /api/sections`
- `GET /api/logs`

## Notes

- Authentication uses JWT.
- Backend models in `backend/models`
- Frontend pages in `client/app`

## License

MIT
