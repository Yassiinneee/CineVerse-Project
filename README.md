# 🎬 CineVerse

### Modern Movie Discovery & Personal Watchlist Platform

CineVerse is a modern, responsive movie discovery platform built with <img src="https://img.shields.io/badge/Vue.js-3-4FC08D?style=flat-square&logo=vue.js&logoColor=white" alt="Vue 3">, <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">, <img src="https://img.shields.io/badge/Vite-7.x-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite">, and <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase">.

The application provides an interactive cinema experience where users can explore movies, search and filter the catalog, view detailed movie information, create personal accounts, save favorite movies, and rate movies using a 1–10 rating system.

The project combines a modern frontend architecture with a cloud-based backend powered by **Supabase Authentication and PostgreSQL**, including Row Level Security (RLS) policies to protect user-specific data.

---

## 📌 Table of Contents

* [Overview](#-overview)
* [Project Goals](#-project-goals)
* [Key Features](#-key-features)
* [Technology Stack](#-technology-stack)
* [Architecture](#-architecture)
* [Project Structure](#-project-structure)
* [Database Design](#-database-design)
* [Authentication & Security](#-authentication--security)
* [User Experience](#-user-experience)
* [Installation](#-installation)
* [Environment Variables](#-environment-variables)
* [Supabase Configuration](#-supabase-configuration)
* [Development](#-development)
* [Production Build](#-production-build)
* [Deployment](#-deployment)
* [Screenshots](#-screenshots)
* [Application Workflow](#-application-workflow)
* [Technical Highlights](#-technical-highlights)
* [Future Improvements](#-future-improvements)
* [Project Objectives](#-project-objectives)
* [Author](#-author)
* [License](#-license)

---

# 🎥 Overview

**CineVerse** is designed as a complete movie discovery and personalization experience.

The platform provides a centralized movie catalog with an intuitive interface for discovering films through:

* 🔎 Search
* 🎭 Genre filtering
* ⭐ Rating-based sorting
* 📅 Year-based sorting
* 🔤 Alphabetical sorting
* 🎬 Detailed movie information
* ❤️ Personal favorites
* ⭐ Personal movie ratings
* 👤 User authentication
* 🌙 Dark/Light theme
* 📱 Responsive interface

The application uses **Supabase** as its backend platform, providing PostgreSQL database functionality, authentication, API access, and Row Level Security.

---

# 🎯 Project Goals

The main objectives of CineVerse are to demonstrate how to build a modern full-stack-style web application using a serverless backend architecture.

The project focuses on:

1. Building a clean and maintainable Vue 3 application.
2. Implementing reusable components and composables.
3. Integrating a cloud PostgreSQL database.
4. Implementing secure authentication.
5. Managing user-specific application data.
6. Applying database-level access control using RLS.
7. Creating an intuitive movie discovery experience.
8. Implementing responsive and accessible UI patterns.
9. Separating application logic from presentation components.
10. Creating a production-ready frontend architecture.

---

# ✨ Key Features

## 🎬 Movie Catalog

Users can browse the available movie collection through a responsive movie grid.

Each movie contains information such as:

* Title
* Release year
* Genre
* Director
* Cast
* Plot
* Duration
* Rating
* Poster
* Backdrop

Movie cards provide a visual overview while detailed modal windows provide additional information.

---

## 🔎 Movie Search

CineVerse provides dynamic movie search functionality.

Users can search through:

* Movie titles
* Directors
* Cast members

The search functionality is implemented through Supabase queries using PostgreSQL case-insensitive matching.

---

## 🎭 Genre Filtering

Movies can be filtered by genre.

The application dynamically retrieves available genres from the database rather than relying entirely on hardcoded categories.

This makes the filtering system adaptable as the movie catalog grows.

---

## 📊 Movie Sorting

The platform supports multiple sorting strategies:

### ⭐ Rating

Displays movies ordered by rating from highest to lowest.

### 📅 Year

Displays the newest movies first.

### 🔤 Title

Sorts movies alphabetically.

---

# 🔐 Authentication

CineVerse includes a complete authentication workflow powered by Supabase Auth.

Users can:

* Create an account
* Sign in
* Sign out
* Maintain an authenticated session
* Access personalized features

Authentication state is managed through the reusable `useAuth` composable.

### Authentication Flow

```text
User
 │
 ├── Sign Up
 │      │
 │      ▼
 │   Supabase Auth
 │
 ├── Sign In
 │      │
 │      ▼
 │   Authenticated Session
 │
 └── Sign Out
        │
        ▼
     Session Closed
```

The application listens for Supabase authentication state changes to keep the frontend synchronized with the user's current session.

---

# ❤️ Favorites System

Authenticated users can create their own personal movie watchlist.

Users can:

* Add movies to favorites
* Remove movies from favorites
* View whether a movie is already favorited
* Maintain favorites across sessions

The system stores the relationship between users and movies inside the `favorites` table.

A unique constraint prevents the same movie from being added multiple times by the same user.

```text
User ────────< Favorites >──────── Movie
```

---

# ⭐ Movie Rating System

CineVerse allows authenticated users to rate movies from **1 to 10**.

The rating system provides:

* Personal ratings
* One rating per user per movie
* Rating updates
* Community average ratings
* Total vote count

The database enforces the valid rating range:

```text
1 ≤ rating ≤ 10
```

A unique constraint guarantees that each user has only one rating per movie.

---

# 🌙 Dark / Light Theme

The application includes a persistent theme system.

Available themes:

* 🌙 Dark
* ☀️ Light

The selected theme is stored in browser `localStorage`.

```text
User selects theme
       ↓
Vue reactive state
       ↓
DOM theme attribute
       ↓
localStorage
       ↓
Theme restored on next visit
```

The theme system is encapsulated in:

```text
src/composables/useTheme.ts
```

---

# 📱 Responsive Design

CineVerse is designed to work across different screen sizes.

The interface adapts to:

* Desktop
* Laptop
* Tablet
* Mobile

Responsive behavior includes:

* Adaptive movie grids
* Flexible header layout
* Mobile-friendly search
* Responsive movie modals
* Touch-friendly controls

---

# 🧩 Component Architecture

The application follows a component-based Vue architecture.

Main components include:

### `MovieCard.vue`

Responsible for displaying individual movie cards.

Features:

* Poster
* Title
* Genre
* Year
* Duration
* Rating
* Favorite button
* Hover information

### `MovieModal.vue`

Provides detailed movie information.

Includes:

* Movie backdrop
* Movie poster
* Title
* Genre
* Year
* Duration
* Plot
* Director
* Cast
* Favorite management
* Rating interface
* Community rating information

### `AuthModal.vue`

Handles authentication UI.

Supports:

* Sign in
* Sign up
* Email validation
* Password validation
* Username registration
* Authentication feedback

### `MovieCardSkeleton.vue`

Provides a loading-state interface while movie data is being retrieved.

---

# 🧠 Composable Architecture

Business logic is separated into reusable Vue composables.

```text
src/composables/
│
├── useAuth.ts
├── useFavorites.ts
├── useRatings.ts
└── useTheme.ts
```

This architecture keeps components focused primarily on presentation while reusable application logic is centralized.

---

## `useAuth.ts`

Responsible for:

* Authentication initialization
* Session retrieval
* Sign up
* Sign in
* Sign out
* Authentication state
* Authentication errors

---

## `useFavorites.ts`

Responsible for:

* Loading user favorites
* Adding favorites
* Removing favorites
* Checking favorite state

---

## `useRatings.ts`

Responsible for:

* Loading user ratings
* Submitting ratings
* Retrieving personal ratings
* Calculating aggregate movie ratings

---

## `useTheme.ts`

Responsible for:

* Theme initialization
* Theme switching
* Persistent theme preferences

---

# 🏗️ Architecture

CineVerse follows a clean frontend architecture:

```text
┌───────────────────────────────────────┐
│              Vue 3 UI                 │
│                                       │
│  App.vue                              │
│  ├── MovieCard                         │
│  ├── MovieModal                        │
│  ├── AuthModal                         │
│  └── MovieCardSkeleton                 │
└──────────────────┬────────────────────┘
                   │
                   ▼
┌───────────────────────────────────────┐
│            Composables                │
│                                       │
│  useAuth                              │
│  useFavorites                         │
│  useRatings                           │
│  useTheme                             │
└──────────────────┬────────────────────┘
                   │
                   ▼
┌───────────────────────────────────────┐
│             Services                  │
│                                       │
│  api.ts                               │
│  supabase.ts                          │
└──────────────────┬────────────────────┘
                   │
                   ▼
┌───────────────────────────────────────┐
│              Supabase                │
│                                       │
│  Authentication                       │
│  PostgreSQL                           │
│  Row Level Security                   │
│  REST API                             │
└───────────────────────────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

<img src="https://img.shields.io/badge/Vue.js-3-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue.js">

<img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">

<img src="https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">

<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">

<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">

---

## Backend / Cloud

<img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase">

<img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">

---

## Development Tools

<img src="https://img.shields.io/badge/npm-Package_Manager-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npm">

<img src="https://img.shields.io/badge/Git-Version_Control-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git">

<img src="https://img.shields.io/badge/VS_Code-IDE-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white" alt="Visual Studio Code">

---

# 📦 Dependencies

The project uses a lightweight dependency stack.

### Runtime Dependencies

```text
vue
@supabase/supabase-js
```

### Development Dependencies

```text
typescript
vite
@vitejs/plugin-vue
vue-tsc
```

This keeps the project relatively lightweight while providing the functionality required for a modern application.

---

# 📁 Project Structure

```text
CineVerse-Project-main/
│
├── public/
│   └── vite.svg
│
├── Screenshots/
│   ├── Build using Vue and Supabase.png
│   ├── Home page - dark_Light mode.png
│   ├── My account - filter possibility- -Favorites movies.png
│   ├── Project -Locally running successfully.png
│   ├── Sign in Page.png
│   ├── Sign up page.png
│   └── Using Supabase for manage Movies and Users.png
│
├── src/
│   │
│   ├── assets/
│   │   └── vue.svg
│   │
│   ├── components/
│   │   ├── AuthModal.vue
│   │   ├── MovieCard.vue
│   │   ├── MovieCardSkeleton.vue
│   │   └── MovieModal.vue
│   │
│   ├── composables/
│   │   ├── useAuth.ts
│   │   ├── useFavorites.ts
│   │   ├── useRatings.ts
│   │   └── useTheme.ts
│   │
│   ├── services/
│   │   ├── api.ts
│   │   └── supabase.ts
│   │
│   ├── types/
│   │   └── movie.ts
│   │
│   ├── App.vue
│   ├── main.ts
│   └── style.css
│
├── supabase/
│   └── migrations/
│       ├── create_movies_table.sql
│       └── create_favorites_and_ratings.sql
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

---

# 🗄️ Database Design

CineVerse uses **PostgreSQL through Supabase**.

The database consists primarily of:

```text
movies
favorites
user_ratings
auth.users
```

---

## 🎬 Movies Table

The `movies` table contains the main movie catalog.

| Column         | Type             | Description           |
| -------------- | ---------------- | --------------------- |
| `id`           | bigint           | Primary key           |
| `title`        | text             | Movie title           |
| `year`         | integer          | Release year          |
| `genre`        | text             | Movie genre           |
| `director`     | text             | Director              |
| `cast`         | text             | Main cast             |
| `plot`         | text             | Movie synopsis        |
| `rating`       | double precision | Base movie rating     |
| `duration`     | integer          | Duration in minutes   |
| `poster_url`   | text             | Poster image          |
| `backdrop_url` | text             | Backdrop image        |
| `created_at`   | timestamptz      | Creation timestamp    |
| `updated_at`   | timestamptz      | Last update timestamp |

---

# ❤️ Favorites Table

The `favorites` table establishes a relationship between users and movies.

```text
favorites
│
├── id
├── user_id
├── movie_id
└── created_at
```

The database uses a unique constraint:

```text
UNIQUE(user_id, movie_id)
```

This prevents duplicate favorites.

---

# ⭐ User Ratings Table

The `user_ratings` table stores personalized movie ratings.

```text
user_ratings
│
├── id
├── user_id
├── movie_id
├── rating
├── created_at
└── updated_at
```

The database enforces:

```text
rating >= 1
rating <= 10
```

It also enforces:

```text
UNIQUE(user_id, movie_id)
```

Therefore, each user can have only one rating for a particular movie, while still being able to update that rating.

---

# 🔐 Authentication & Security

CineVerse uses **Supabase Authentication** rather than implementing a custom authentication backend.

This provides a managed authentication layer for:

* Account registration
* Email/password login
* Session management
* User identity
* Logout

---

# 🛡️ Row Level Security

One of the most important security mechanisms implemented in the project is **PostgreSQL Row Level Security (RLS)**.

RLS is enabled on:

```text
movies
favorites
user_ratings
```

### Movies

The movie catalog is intentionally shared, so the current database policies allow:

* Anonymous SELECT
* Authenticated SELECT
* Anonymous INSERT
* Authenticated INSERT
* Anonymous UPDATE
* Authenticated UPDATE
* Anonymous DELETE
* Authenticated DELETE

This reflects the current project's public/shared movie-management model.

### Favorites

Favorites are owner-scoped.

Users can only access their own favorite records.

```text
auth.uid() = user_id
```

### Ratings

User ratings are also owner-scoped.

Users can only:

* Read their own ratings
* Create their own ratings
* Update their own ratings
* Delete their own ratings

This prevents one authenticated user from manipulating another user's personal data.

---

# ⚡ Database Performance

The database migrations include indexes for frequently queried fields.

### Movies

```text
idx_movies_genre
idx_movies_rating
idx_movies_year
```

### Favorites

```text
idx_favorites_user_id
```

### Ratings

```text
idx_user_ratings_user_id
idx_user_ratings_movie_id
```

These indexes improve filtering, sorting, and user-specific data retrieval.

---

# 🔧 API / Service Layer

Database operations are centralized in:

```text
src/services/api.ts
```

Available operations include:

```text
fetchMovies()
fetchMovieById()
fetchGenres()
createMovie()
updateMovie()
deleteMovie()
```

This creates a clean abstraction between Vue components and the Supabase backend.

Instead of embedding database queries throughout the UI, the application can use service functions.

---

# 🔄 Data Flow

A typical movie search request follows this architecture:

```text
User
 │
 ▼
Search Input
 │
 ▼
Vue Application
 │
 ▼
api.ts
 │
 ▼
Supabase Client
 │
 ▼
PostgreSQL
 │
 ▼
Movie Results
 │
 ▼
Vue Reactive State
 │
 ▼
Movie Grid
```

For personalized features:

```text
Authenticated User
       │
       ▼
Supabase Auth
       │
       ▼
auth.uid()
       │
       ▼
RLS Policies
       │
       ▼
Favorites / Ratings
```

---

# 🔑 Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Example

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> Never commit private credentials, service-role keys, or secrets to Git.

The frontend only requires the Supabase project URL and public anonymous key.

---

# 🚀 Installation

## 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
```

---

## 2. Enter the project directory

```bash
cd CineVerse-Project-main
```

---

## 3. Install dependencies

```bash
npm install
```

---

## 4. Configure environment variables

Create:

```text
.env
```

Then add:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

# 🗃️ Supabase Configuration

Create a new project in Supabase.

Then configure the project credentials.

The application expects:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

---

## Run Database Migrations

The project contains SQL migrations under:

```text
supabase/migrations/
```

Run the migrations in the correct order.

### Migration 1

```text
create_movies_table.sql
```

Creates:

* Movies table
* Movie indexes
* Movie RLS
* Movie policies

### Migration 2

```text
create_favorites_and_ratings.sql
```

Creates:

* Favorites
* User ratings
* Foreign-key relationships
* Unique constraints
* Indexes
* RLS policies

---

# 💻 Development

Start the Vite development server:

```bash
npm run dev
```

Vite will provide a local development URL, typically:

```text
http://localhost:5173
```

The application supports hot module replacement, allowing changes to Vue components and styles to appear immediately during development.

---

# 🧪 Production Build

Create an optimized production build:

```bash
npm run build
```

The command performs:

```text
TypeScript validation
        ↓
Vue compilation
        ↓
Vite production bundling
        ↓
dist/
```

---

# 🔍 Preview Production Build

After building:

```bash
npm run preview
```

This allows the production bundle to be tested locally before deployment.

---

# ☁️ Deployment

CineVerse is a Vite-based frontend application and can be deployed to modern frontend hosting platforms such as:

* Vercel
* Netlify
* Cloudflare Pages
* GitHub Pages
* Render Static Sites

For production deployment, configure the following environment variables in the hosting provider:

```env
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Then use:

```bash
npm run build
```

as the production build command.

The generated deployment directory is:

```text
dist
```

---

# 📸 Screenshots

The repository contains a dedicated screenshot collection demonstrating the application's main interfaces.

## 🏠 Home Interface

The home interface provides:

* Movie discovery
* Search
* Filtering
* Sorting
* Theme switching
* Authentication controls

![CineVerse Home](Screenshots/Home%20page%20-%20dark_Light%20mode.png)

---

## 🔐 Sign In

Users can securely access their accounts through the authentication modal.

![Sign In](Screenshots/Sign%20in%20Page.png)

---

## 📝 Sign Up

New users can create an account with:

* Username
* Email
* Password

![Sign Up](Screenshots/Sign%20up%20page.png)

---

## ❤️ Personal Favorites

Authenticated users can manage their personalized movie collection.

![Favorites](Screenshots/My%20account%20-%20filter%20possibility-%20-Favorites%20movies.png)

---

## 🗄️ Supabase Integration

The project uses Supabase to manage movie and user-related data.

![Supabase](Screenshots/Using%20Supabase%20for%20manage%20Movies%20and%20Users.png)

---

# 🔄 Application Workflow

The complete CineVerse workflow can be represented as:

```text
                    ┌───────────────┐
                    │     User      │
                    └───────┬───────┘
                            │
             ┌──────────────┼──────────────┐
             │              │              │
             ▼              ▼              ▼
          Browse         Search         Login
             │              │              │
             └───────┬──────┘              │
                     │                     ▼
                     ▼                 Supabase Auth
              Movie Catalog                │
                     │                     ▼
                     │              Authenticated User
                     │                     │
          ┌──────────┼──────────┐          │
          │          │          │          │
          ▼          ▼          ▼          ▼
       Details   Favorites   Ratings    Theme
          │          │          │          │
          └──────────┴──────────┴──────────┘
                     │
                     ▼
                 Supabase
                     │
                     ▼
                PostgreSQL
```

---

# 🧠 Technical Highlights

## 1. Reactive State Management

Vue's Composition API is used throughout the application.

Examples include:

```typescript
ref()
watch()
```

This provides reactive application state while keeping business logic modular.

---

## 2. Reusable Composables

Application logic is isolated into composables rather than being duplicated across components.

This improves:

* Maintainability
* Reusability
* Testability
* Separation of concerns

---

## 3. Strong Typing

TypeScript is used to define application models.

For example, the `Movie` interface describes the expected structure of movie data:

```typescript
interface Movie {
  id: number
  title: string
  year: number
  genre: string
  director: string
  cast: string
  plot: string
  rating: number
  duration: number
  poster_url: string
  backdrop_url: string | null
  created_at: string
  updated_at: string
}
```

This reduces data inconsistencies between the frontend and database.

---

## 4. Database Constraints

The database itself validates important business rules.

For example:

```sql
CHECK (rating >= 1 AND rating <= 10)
```

and:

```sql
UNIQUE (user_id, movie_id)
```

This means application integrity does not depend exclusively on frontend validation.

---

## 5. Row Level Security

RLS provides database-level authorization for personalized resources.

This is particularly important for:

```text
favorites
user_ratings
```

Users cannot simply modify another user's records through client-side requests.

---

## 6. Lazy-Loaded Images

Movie posters use:

```html
loading="lazy"
```

This helps reduce unnecessary image loading and improves performance when browsing large movie collections.

---

# 📈 Performance Considerations

The project includes several performance-oriented decisions:

* Vite's optimized development workflow
* Production bundling
* Database indexes
* Lazy-loaded movie images
* Skeleton loading components
* Efficient Supabase queries
* Component-based rendering
* Client-side reactive state

The database indexes are particularly useful for:

```text
Genre filtering
Rating sorting
Year sorting
User favorites
User ratings
Movie rating aggregation
```

---

# 🧪 Testing & Validation

Before deployment, the following scenarios should be validated:

### Authentication

* [ ] User registration
* [ ] User login
* [ ] Invalid credentials
* [ ] Logout
* [ ] Session restoration

### Movies

* [ ] Movie loading
* [ ] Search
* [ ] Genre filtering
* [ ] Sorting
* [ ] Movie details
* [ ] Empty results
* [ ] Error handling

### Favorites

* [ ] Add favorite
* [ ] Remove favorite
* [ ] Duplicate prevention
* [ ] User-specific favorites

### Ratings

* [ ] Submit rating
* [ ] Update rating
* [ ] Rating range validation
* [ ] Aggregate rating
* [ ] Vote count

### UI

* [ ] Dark mode
* [ ] Light mode
* [ ] Mobile layout
* [ ] Modal behavior
* [ ] Loading states
* [ ] Responsive movie grid

---

# 🔮 Future Improvements

CineVerse provides a strong foundation that can be expanded with additional functionality.

Potential improvements include:

## 🎞️ Advanced Movie Discovery

* Trending movies
* Popular movies
* Upcoming releases
* Top-rated movies
* Personalized recommendations

## 👤 Enhanced Profiles

* Public user profiles
* Avatar support
* Viewing history
* Favorite genres
* Personalized statistics

## 📊 Analytics

Add a dashboard containing:

* Total movies
* Average community rating
* Most popular genres
* Most favorited movies
* Rating distribution

## 🔎 Advanced Search

Possible additions:

* Multi-genre filtering
* Rating range
* Release-date range
* Director filtering
* Actor filtering
* Duration filtering

## 🎬 External Movie API

The platform could be integrated with a dedicated movie API such as TMDB to automatically synchronize movie information.

## 🔔 Notifications

Future versions could support notifications for:

* New releases
* Favorite movie updates
* Recommendations
* Account activity

---

# 🏆 Project Objectives Achieved

CineVerse demonstrates practical experience with:

* Vue 3
* TypeScript
* Vite
* Composition API
* Component-based architecture
* Supabase
* PostgreSQL
* Authentication
* Row Level Security
* Relational database design
* SQL migrations
* Database indexing
* CRUD operations
* User-specific data
* Responsive UI development
* Theme persistence
* Modern frontend architecture

---

# 📚 Engineering Principles

The project follows several important software engineering principles:

### Separation of Concerns

UI, business logic, and backend communication are separated.

```text
Components
    ↓
Composables
    ↓
Services
    ↓
Supabase
```

### Reusability

Repeated logic is extracted into composables and reusable components.

### Type Safety

TypeScript interfaces provide a reliable contract for application data.

### Defense in Depth

Security is not implemented exclusively in the frontend.

Instead, the application combines:

```text
Authentication
      +
Database Constraints
      +
Row Level Security
      +
Foreign Keys
      +
Unique Constraints
```

### Maintainability

The project structure makes it easier to extend the application without turning `App.vue` into a monolithic component.

---

# 👨‍💻 Author

## Yassine Kaltoum

**Software & Network Engineering Expert**

Specialized in:

* Software Engineering
* Web Development
* Network Engineering
* Cybersecurity
* System Architecture
* UI/UX Design

### Academic Background

* Bachelor in Network & Systems Engineering
* Master's studies in Software Engineering

---

# 📜 License

This project is intended for educational, portfolio, and demonstration purposes.

Unless otherwise specified, all rights are reserved by the project author.

---

# ⭐ Acknowledgements

Special thanks to the technologies and open-source communities that make this project possible:

* Vue.js
* TypeScript
* Vite
* Supabase
* PostgreSQL
* npm
* Open-source contributors

---

# 🚀 Getting Started

The fastest way to run CineVerse locally is:

```bash
git clone <YOUR_REPOSITORY_URL>

cd CineVerse-Project-main

npm install
```

Create the environment file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Then start the application:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

# 🎬 CineVerse

> **Discover movies. Build your watchlist. Share your ratings.**

CineVerse demonstrates how a modern Vue application can combine an elegant user interface, reactive frontend architecture, cloud authentication, PostgreSQL data management, and database-level security into a complete movie discovery experience.

**Built with Vue 3 + TypeScript + Vite + Supabase + PostgreSQL.**

