# GlobeTrotter Architecture Documentation

## Overview
GlobeTrotter follows a modular, decoupled architecture consisting of a React 18 frontend and a FastAPI backend powered by PostgreSQL.

```text
React 18 SPA (Vite) ──[HTTP/REST + JWT]──> FastAPI Routers (/api/v1/)
                                                  │
                                                  ▼
                                            Domain Services
                                                  │
                                                  ▼
                                            SQLAlchemy ORM
                                                  │
                                                  ▼
                                            PostgreSQL Database
```

## Layers

### 1. Presentation Layer (Frontend React SPA)
- Built using React 18 with Vite.
- Routing via `react-router-dom` with `ProtectedRoute` wrappers.
- State managed through React hooks (`useState`, `useEffect`) and service layer integration.
- API service wrapper (`frontend/src/services/api.js`) handles base URL resolution, JWT token header injection, and JSON error parsing.

### 2. API Routing Layer (FastAPI Routers)
- All routers versioned under `/api/v1` in `backend/api/router.py`.
- Endpoints enforce Pydantic schema validation for request payloads and response contracts.
- Dependency injection handles database session lifecycle (`get_db`) and user authentication (`get_current_user`, `require_admin`).

### 3. Service Layer (Domain Logic)
- Encapsulates business logic, calculations, and data transactions inside dedicated services:
  - `AuthService`: Registration, authentication, JWT creation
  - `UserService`: Profile management, preferences, password change
  - `TripService`: Trip CRUD, stop ordering, itinerary item management
  - `BudgetService`: Expense logging, category totals, budget limits
  - `AdminService`: Platform statistics, user moderation, reporting

### 4. Persistence Layer (SQLAlchemy & PostgreSQL)
- SQLAlchemy 2.x declarative ORM models mapped to PostgreSQL tables.
- Alembic manages schema versioning and database migrations.
- UUID primary keys, foreign key constraints, check constraints, and indexed lookups.
