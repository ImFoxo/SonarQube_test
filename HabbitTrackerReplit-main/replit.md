# HabitTrac - Habit Tracking Application

## Overview

HabitTrac is a modern habit tracking application that helps users build better habits, track daily progress, maintain streaks, and achieve their goals. The application features a clean, minimalist interface with a modern gray/blue aesthetic inspired by productivity apps like Notion, Linear, and Asana.

The application is built as a full-stack TypeScript application with a React frontend and Express backend, featuring real-time habit tracking, statistics visualization, achievements, and social features for friend updates.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type safety
- Vite as the build tool and development server
- Feature-Sliced Design (FSD) architecture organizing code by business features rather than technical layers
- Wouter for lightweight client-side routing

**UI Component System:**
- Shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Design system follows "New York" style variant from Shadcn
- Custom CSS variables for theming (light/dark mode support)
- Responsive design with mobile-first approach

**State Management:**
- React Context API for global state (Auth, Theme)
- TanStack Query (React Query) for server state management and caching
- Local state with React hooks for component-level state

**Feature Organization (FSD):**
```
features/
├── auth/          - Mock authentication logic
├── habits/        - Habit CRUD operations, forms, lists
├── tracking/      - Daily check-offs, calendar views
├── stats/         - Charts (Recharts), metrics, aggregations
├── groups/        - Habit grouping and categorization
├── achievements/  - Badge system, unlockables
└── friends/       - Social features, friend updates
```

### Backend Architecture

**Server Framework:**
- Express.js for HTTP server
- Separate development (index-dev.ts) and production (index-prod.ts) entry points
- Custom logging middleware for request tracking

**Development vs Production:**
- **Development:** Vite middleware integration for HMR, SSR for index.html
- **Production:** Static file serving from pre-built dist/public directory

**API Design:**
- RESTful API endpoints under `/api` prefix
- JSON request/response format
- Demo user authentication (ID: "demo-user-1") for simplified onboarding
- Routes organized in `server/routes.ts`

**Key API Endpoints:**
- `GET /api/habits` - Fetch user habits
- `POST /api/habits` - Create new habit
- `DELETE /api/habits/:id` - Delete habit
- `GET /api/completions` - Fetch completion records
- `POST /api/completions` - Mark habit complete
- `GET /api/groups` - Fetch habit groups
- `GET /api/achievements` - Fetch user achievements
- `GET /api/friend-updates` - Fetch social updates

### Data Storage

**Database System:**
- Drizzle ORM as the database toolkit
- PostgreSQL dialect configuration (via `@neondatabase/serverless`)
- Schema-first approach with TypeScript type generation
- Migration management via Drizzle Kit

**Dual Storage Implementation:**
- In-memory storage (`MemStorage` class) for development/demo mode
- Database storage configured for PostgreSQL (production-ready)
- Storage interface (`IStorage`) allows swapping implementations

**Data Models:**
- `users` - User profiles with streak tracking
- `habits` - Habit definitions with metadata (name, frequency, color, group)
- `completions` - Daily completion records with timestamps and values
- `groups` - Color-coded habit categorization
- `achievements` - Gamification badges and unlockables
- `friendUpdates` - Social activity feed

**Schema Validation:**
- Zod schemas generated from Drizzle tables via `drizzle-zod`
- Runtime validation on API endpoints
- Type-safe insert/update operations

### External Dependencies

**Database:**
- Neon Serverless PostgreSQL (`@neondatabase/serverless`)
- Connection configured via `DATABASE_URL` environment variable
- Drizzle ORM for query building and migrations

**UI Component Libraries:**
- Radix UI primitives (20+ component packages for accessible UI elements)
- Lucide React for icons
- Recharts for data visualization and statistics charts
- date-fns for date manipulation and formatting
- embla-carousel-react for carousel components
- vaul for drawer components

**Form Management:**
- React Hook Form for form state management
- @hookform/resolvers for Zod schema validation integration

**Styling & Theming:**
- Tailwind CSS with PostCSS processing
- class-variance-authority (CVA) for component variants
- clsx and tailwind-merge for className composition
- Custom CSS variables for theme tokens

**Developer Experience:**
- @replit/vite-plugin-runtime-error-modal for error overlay
- @replit/vite-plugin-cartographer for debugging
- @replit/vite-plugin-dev-banner for development indicators
- TypeScript strict mode enabled
- ESModules throughout

**Session Management:**
- connect-pg-simple for PostgreSQL session store (configured but using localStorage for demo)

**Build & Deployment:**
- esbuild for server-side bundling
- Vite for client-side bundling
- Path aliases configured (@/, @shared/, @assets/)