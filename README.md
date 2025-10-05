# Dexa HR Admin App (React + Vite)

An administrative dashboard for HR operations: manage employees, view attendance, and receive realtime notifications. Built with React, Vite, Tailwind CSS, TanStack Query, Zustand, and Socket.IO.

## Live Preview

- https://dexa-admin-app.netlify.app/

## Table of Contents

- [Live Preview](#live-preview)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Demo Credentials](#demo-credentials)
- [Environment Variables](#environment-variables)
- [Realtime Notifications](#realtime-notifications)
- [Routes](#routes)
- [Theming](#theming)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Axios and Auth](#axios-and-auth)
- [Deployment](#deployment)

## Core Features

- Authentication with protected routes and demo login.
- Light/Dark theme toggle using `next-themes` with a softened color palette.
- Realtime notifications via WebSocket (Socket.IO) with:
  - Automatic connect after login and disconnect on logout.
  - Toasts using `sonner` for incoming events.
  - Unread counter in the header and a modal listing notifications.
- Employees management: create, edit, delete, and list employees.
- Attendance viewer with date range filters, paging, and status badges.
- Responsive layout with sidebar navigation and consistent UI components.
- API integration with Axios including bearer token interceptor and 401 auto-logout.

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- `next-themes` for theming
- TanStack Query for data fetching and caching
- Zustand for state management
- Headless UI-based dialog components
- Socket.IO client for realtime
- Sonner for toast notifications

## Getting Started

Prerequisites: Node.js 18+ and npm.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables (see below).
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173/login` and sign in.

### Demo Credentials

The login page includes a demo helper button and uses:

- Email: `admin@company.com`
- Password: `password123`

> Note: Demo credentials require a backend compatible with the API described below.

## Environment Variables

Create a `.env` file at the project root:

```bash
# Base REST API (defaults to /api when unset)
VITE_API_URL=https://your-api.example.com

# WebSocket base URL. Include the /notifications namespace.
# Example: wss://your-api.example.com/notifications
VITE_WS_URL=wss://your-api.example.com/notifications
```

Defaults used in code:

- `VITE_API_URL` falls back to `/api`.
- `VITE_WS_URL` falls back to `wss://api.otter-server.win/notifications`.

## Realtime Notifications

- The app connects to the notifications namespace after login using the authenticated user ID.
- Server events handled:
  - `notification`: shows a toast and adds to the modal list.
  - `unreadCount`: updates the header badge.
- UI components:
  - Header bell button with unread badge.
  - `NotificationsModal` with list, read/unread labels, paging, and mark-as-read actions.

## Routes

- `/` — Dashboard (protected)
- `/attendance` — Attendance records (protected)
- `/employees` — Employees management (protected)
- `/login` — Standalone login page

## Theming

- Theme toggle available in the header and on the login card.
- Color tokens defined in `src/index.css` using HSL variables for both light and dark palettes.

## Scripts

- `npm run dev` — Start the development server.
- `npm run build` — Build for production.
- `npm run preview` — Preview the production build locally.

## Project Structure

```
src/
  components/
    layout.jsx
    theme-toggle.jsx
    notifications/NotificationsModal.jsx
    ui/* (button, dialog, input, label, sidebar, etc.)
  hooks/useNotificationsWs.jsx
  pages/Dashboard.jsx
  pages/Attendance.jsx
  pages/Employees.jsx
  pages/Login.jsx
  store/ (auth, notifications, ui)
  lib/ (axios, query, utils)
  index.css
```

## Axios and Auth

- `src/lib/axios.js` adds the bearer token when present.
- On `401` responses, the app automatically logs out.

## Deployment

- Built with Vite; output is in `dist/` after `npm run build`.
- A `netlify.toml` is included for optional deployment configuration; adapt to your hosting as needed.
