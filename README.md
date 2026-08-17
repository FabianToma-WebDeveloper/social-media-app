# FabianT Social Media App

A React + Vite social media app prototype with authentication, a post feed, and basic routing.

## Main features

- Authentication flow
  - Login and register via `AuthPage`
  - Auth state managed with Redux Toolkit async thunks
  - User session persisted with `redux-persist`
- Navigation
  - Header navigation adapts to logged-in state
  - Login/Logout toggle button in the navigation
- Post feed
  - `HomePage` fetches posts through `feedService`
  - Posts are rendered with the `Newsfeed` component
- Routing
  - `/` renders the home feed
  - `/auth` renders the authentication page
  - `/profile/:id` renders a profile page placeholder
  - `*` renders the not-found page
- State management
  - Redux Toolkit slices for auth
  - Async login/register thunks using `createAsyncThunk`

## Tech stack

- React 19
- Vite
- React Router DOM
- Redux Toolkit
- Redux Persist
- Material UI
- Axios
- Sass

## Local development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open the URL Vite provides in your browser.

## Backend / API

- Auth requests are sent to `http://localhost:3000`
- Posts are fetched from `/posts` via `feedService`
- Ensure a backend or JSON server is running to handle `/login`, `/register`, and `/posts`

## Project structure

- `src/main.jsx` — app entry point with router and Redux provider
- `src/App.jsx` — app routes and main layout
- `src/pages/home/HomePage.jsx` — home feed page
- `src/pages/auth/AuthPage.jsx` — auth page wrapper
- `src/pages/auth/AuthForm.jsx` — login/register form
- `src/pages/profile/ProfilePage.jsx` — profile route placeholder
- `src/components/Layout.jsx` — page layout wrapper
- `src/components/Navigation.jsx` — header navigation
- `src/redux` — store, slices, and selectors
- `src/services` — API service layer
