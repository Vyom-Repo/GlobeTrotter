# ✈️ GlobeTrotter — Smart Multi-City Trip Planner

> **Simplify complex travel planning through an interactive, visual, budget-smart journey builder with zero internet dependency.**

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

---

## 1. Project Overview

**GlobeTrotter** is a full-stack, enterprise-grade travel planning and itinerary management platform designed to help travelers plan, build, budget, and visualize complex multi-city trips.

Key platform characteristics include:
- 🗺️ **Offline Global Dataset**: Local PostgreSQL database pre-populated with **149 Countries**, **608 Cities**, and **2,432 Tourist Activities**. Zero external API keys (Google Places/Maps) required.
- 🧩 **Drag & Drop Itinerary Builder**: Assign destinations, custom stops, dates, and daily activities to trip itineraries.
- 📊 **Budget & Expense Management**: Set trip budget limits, log category expenses (Stay, Transport, Dining, Activity), track over-budget warnings, and visualize cost distributions.
- 📅 **Interactive Calendar & Timeline**: View journey schedules in month grid or agenda vertical timelines.
- 🛡️ **Role-Based Access Control**: Dedicated Regular User (`is_admin: false`) and Administrator (`is_admin: true`) workflows with moderation dashboards.

---

## 2. Tech Stack

### Frontend
- **Framework & Runtime**: React 18 (Vite build engine)
- **Routing**: `react-router-dom` v6
- **Styling**: Vanilla CSS tokens & Tailwind CSS v3 with PostCSS
- **Icons**: Lucide React (`lucide-react`)
- **API Client**: Fetch API wrapper with automatic `/api/v1` base URL resolution & JWT Bearer header injection (`frontend/src/services/api.js`)

### Backend
- **Language**: Python 3.10+
- **API Framework**: FastAPI 0.110+ (ASGI with Uvicorn)
- **ORM**: SQLAlchemy 2.x
- **Database Driver**: `psycopg2-binary` / `psycopg`
- **Validation**: Pydantic v2 & `pydantic-settings`
- **Security & Auth**: Passlib (`bcrypt`) for password hashing & PyJWT (`python-jose`) for JWT creation & verification

### Database
- **Engine**: PostgreSQL 14+
- **Migrations**: Alembic
- **Primary Keys**: PostgreSQL Native UUIDs (`uuid.uuid4`)

### Development Tools
- **Package Managers**: `npm` (Node.js) & `pip` (Python Virtual Environment)
- **Testing**: `pytest` & `compileall`
- **Version Control**: Git

---

## 3. Project Structure

```text
GlobeTrotter/
├── backend/
│   ├── alembic/              # Alembic database migration scripts & versions
│   ├── api/                  # FastAPI REST API endpoint routers (/api/v1/)
│   │   ├── admin.py          # Admin analytics, user status moderation, stats
│   │   ├── auth.py           # Registration, login, current user (/me)
│   │   ├── trips.py          # Trip CRUD, budget summaries, share tokens
│   │   ├── trip_stops.py     # Multi-city stop management & ordering
│   │   ├── itinerary.py      # Day-wise activity scheduling & ordering
│   │   ├── expenses.py       # Expense logging and category filters
│   │   └── ...               # Search, notifications, saved destinations, public
│   ├── core/                 # App configuration, security, dependencies, exception handlers
│   ├── data/                 # Offline seed datasets (countries.json, cities.json, activities.json)
│   ├── database/             # SQLAlchemy engine creation, Base model, Session local
│   ├── models/               # 14 SQLAlchemy ORM models (User, Trip, Expense, City, etc.)
│   ├── schemas/              # Pydantic v2 request/response validation schemas
│   ├── scripts/              # DB seed (`seed_data.py`) & DB verification (`verify_db.py`)
│   ├── services/             # Domain logic services (AuthService, TripService, etc.)
│   ├── tests/                # Automated pytest backend test suite (71 test cases)
│   └── main.py               # FastAPI application entry point & CORS configuration
├── frontend/
│   ├── public/               # Static web assets
│   ├── src/
│   │   ├── assets/           # Index CSS design tokens & Tailwind imports
│   │   ├── components/       # Screen components (Screen04 to Screen12) & UI modals
│   │   ├── pages/            # Landing, Login, Register page containers
│   │   ├── services/         # API abstraction layer (auth, user, trip, budget, admin)
│   │   ├── App.jsx           # Main React Router setup & protected route guards
│   │   └── main.jsx          # React DOM root mounting
│   ├── index.html            # Vite HTML template
│   ├── package.json          # Node dependencies & scripts
│   ├── tailwind.config.js    # Tailwind styling config
│   └── vite.config.js        # Vite dev server & build settings
├── .env.example              # Sample environment configuration template
└── README.md                 # Project documentation
```

---

## 4. Installation

### Prerequisites
- **Python**: 3.10 or higher
- **Node.js**: v18.x or higher (`npm` v9+)
- **PostgreSQL**: 14 or higher running locally or via Docker

### 1. Repository Setup
```bash
git clone https://github.com/Vyom-Repo/GlobeTrotter.git
cd GlobeTrotter
```

### 2. Environment Configuration
Create a `.env` file in the project root:
```bash
cp .env.example .env
```

### 3. Backend Setup
```bash
# Create Python virtual environment
python3 -m venv backend/.venv

# Activate virtual environment
source backend/.venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt
```

### 4. Database Setup & Seeding
```bash
# Create PostgreSQL database
createdb -U postgres globetrotter

# Run Alembic migrations to build schema
source backend/.venv/bin/activate
PYTHONPATH=. alembic upgrade head

# Seed master offline dataset (149 countries, 608 cities, 2,432 activities)
PYTHONPATH=. python -m backend.scripts.seed_data
```

### 5. Frontend Setup
```bash
cd frontend
npm install
cd ..
```

---

## 5. Environment Variables

Documented environment variables (`.env.example`):

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | Number | `8000` | Backend API server port |
| `HOST` | String | `0.0.0.0` | Backend host binding |
| `ENV` | String | `development` | Deployment environment |
| `SECRET_KEY` | String | `your_secure_jwt_secret` | JWT signing secret |
| `JWT_ALGORITHM` | String | `HS256` | JWT signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Number | `1440` | JWT expiration time (24h) |
| `DATABASE_URL` | String | `postgresql://postgres:postgres@localhost:5432/globetrotter` | PostgreSQL connection string |
| `VITE_API_BASE_URL` | String | `http://localhost:8000` | Frontend backend API URL |

*Note: Never commit real credentials or secret keys to version control.*

---

## 6. Running the Project

### Start Backend API Server
```bash
source backend/.venv/bin/activate
PYTHONPATH=. python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
- **Backend URL**: `http://localhost:8000`
- **Swagger Interactive API Docs**: `http://localhost:8000/docs`
- **ReDoc API Docs**: `http://localhost:8000/redoc`

### Start Frontend Development Server
```bash
cd frontend
npm run dev -- --host 0.0.0.0 --port 5173
```
- **Frontend App URL**: `http://localhost:5173`

---

## 7. Architecture

GlobeTrotter follows a decoupled client-server architecture:

```text
React 18 Frontend (Vite)
    │
    ▼ (HTTP JSON + JWT Bearer Header)
FastAPI Application (/api/v1/)
    │
    ├─► Security & Auth Middleware (JWT Token Validation & Role Guards)
    ├─► API Endpoint Routers (backend/api/)
    ├─► Domain Service Layer (backend/services/)
    └─► SQLAlchemy 2.x ORM Models (backend/models/)
            │
            ▼
PostgreSQL Database (globetrotter)
```

---

## 8. Application Pipeline

```mermaid
flowchart TD
    A[Landing Page] --> B{Authenticated?}
    B -- No --> C[Login / Register]
    C --> D[JWT Bearer Token Issued]
    B -- Yes --> E[Dashboard / My Trips]
    D --> E
    E --> F[Plan & Create Trip]
    F --> G[Build Multi-City Itinerary]
    G --> H[Budget & Expense Tracking]
    E --> I[Calendar & Timeline View]
    E --> J[Activity Search & Discovery]
    E --> K[User Profile & Settings]
    E --> L{Is Admin?}
    L -- Yes --> M[Admin Panel & Analytics]
    L -- No --> N[Access Restricted]
```

---

## 9. API Documentation

All API endpoints are versioned under the `/api/v1` prefix.

| Module | Base Path | Methods | Description |
| :--- | :--- | :--- | :--- |
| **Authentication** | `/api/v1/auth` | `POST`, `GET` | User registration, login, token generation, `/me` profile |
| **Users** | `/api/v1/users` | `GET`, `PUT`, `PATCH`, `POST`, `DELETE` | Profile updates, password changes, preferences, account deactivation |
| **Countries** | `/api/v1/countries` | `GET` | List & search 149 offline countries |
| **Cities** | `/api/v1/cities` | `GET` | Filter & search 608 destination cities by region/country |
| **Activities** | `/api/v1/activities` | `GET` | Search 2,432 activities with cost & category filters |
| **Trips** | `/api/v1/trips` | `GET`, `POST`, `PUT`, `PATCH`, `DELETE` | Trip CRUD & budget summary aggregations |
| **Trip Stops** | `/api/v1/trip-stops` | `GET`, `POST`, `PUT`, `PATCH`, `DELETE` | Destination stop management & reordering |
| **Itinerary** | `/api/v1/itinerary` | `GET`, `POST`, `PUT`, `PATCH`, `DELETE` | Day-wise activity scheduling & reordering |
| **Expenses** | `/api/v1/expenses` | `GET`, `POST`, `PUT`, `DELETE` | Expense logging & budget category totals |
| **Saved Destinations**| `/api/v1/saved-destinations` | `GET`, `POST`, `DELETE` | Favorite city bookmarks |
| **Trip Sharing** | `/api/v1/trip-shares` | `GET`, `POST`, `DELETE` | Token-based public trip sharing & permissions |
| **Public Trips** | `/api/v1/public` | `GET` | Read-only access to published community trips |
| **Notifications** | `/api/v1/notifications` | `GET`, `POST`, `PATCH` | User activity notifications & read toggles |
| **Search** | `/api/v1/search` | `GET` | Unified global search across cities & activities |
| **Admin** | `/api/v1/admin` | `GET`, `POST` | Admin analytics, user list & account suspension controls |
| **Reports** | `/api/v1/reports` | `GET`, `POST` | Content reporting & moderation resolution |

---

## 10. Authentication & Security

- **User Registration**: Password complexity validated; credentials hashed using `bcrypt` via `passlib`.
- **JWT Token Issuance**: On valid login, backend issues signed JWT access token (`HS256`).
- **Token Storage**: Saved in browser `localStorage` and sent in HTTP request headers (`Authorization: Bearer <TOKEN>`).
- **Protected Routes**: React router guards (`ProtectedRoute`) verify token existence and redirect unauthenticated users to `/login`.
- **Admin Authorization**: `requireAdmin` middleware checks `is_admin === true`. Non-admin users are prevented from accessing `/admin` endpoints.
- **Clean Logout**: Dedicated Logout action clears local storage tokens and invalidates local session state.

---

## 11. Database Entity Relationship Diagram

```mermaid
erDiagram
    users ||--|| user_preferences : has
    users ||--o{ trips : creates
    users ||--o{ saved_destinations : saves
    users ||--o{ trip_shares : receives
    users ||--o{ notifications : receives
    users ||--o{ user_activities : records
    users ||--o{ reports : files

    countries ||--o{ cities : contains
    cities ||--o{ activities : offers
    cities ||--o{ trip_stops : selected_in
    cities ||--o{ saved_destinations : saved_in

    trips ||--o{ trip_stops : contains
    trips ||--o{ expenses : incurs
    trips ||--o{ trip_shares : shares

    trip_stops ||--o{ itinerary_items : contains
    trip_stops ||--o{ expenses : incurs

    activities ||--o{ itinerary_items : scheduled_as
    itinerary_items ||--o{ expenses : incurs
```

---

## 12. Implemented Features

1. **User Authentication & Profiles**:
   - Register, Login, Logout, Profile edit, Preference settings (currency, autosave, budget alerts), and Account Deactivation.
2. **Trip Creation & Multi-City Itinerary Building**:
   - Date range pickers, cover photo uploads, stop additions, drag & drop stop reordering, and day-by-day activity assignment.
3. **Budget & Cost Tracking**:
   - Total trip budget vs. stop allocations, expense category breakdown (Accommodation, Transit, Food, Activities), over-budget alerts.
4. **Calendar & Agenda View**:
   - Month grid view with continuous trip bars & vertical daily agenda timeline.
5. **Activity Search & Discovery**:
   - Search across 2,432 activities with filters for city, activity type (Sightseeing, Historical, Food, Adventure), and maximum budget.
6. **Community Feed & Public Sharing**:
   - Share trips publicly via unique tokens, explore public community itineraries.
7. **Admin Overview & Moderation Panel**:
   - Real-time platform KPI analytics (Total Users, Active Users, Total Trips) and live user suspension/activation controls.

---

## 13. Testing & Verification Results

All automated verification commands have been executed and verified clean:

```bash
# 1. Backend Automated Unit Tests (71 test cases)
source backend/.venv/bin/activate
PYTHONPATH=. pytest backend/tests
# Result: 71 PASSED (100% pass rate)

# 2. Database & Dataset Integrity Verification
PYTHONPATH=. python -m backend.scripts.verify_db
# Result: PASSED (149 countries, 608 cities, 2,432 activities verified)

# 3. Python Bytecode Compilation Check
python -m compileall backend
# Result: PASSED (0 compilation errors)

# 4. Frontend Production Build
cd frontend && npm run build
# Result: PASSED (built in 1.62s with 0 errors)

# 5. Git Diff & Formatting Audit
git diff --check
# Result: PASSED (0 whitespace errors)
```

---

## 14. Security Protections

- **Password Safety**: Hashed with `bcrypt` (work factor 12). Plaintext passwords are never logged or stored.
- **JWT Authorization**: All state-modifying requests require a valid Bearer token.
- **Resource Ownership**: Endpoints verify `trip.user_id == current_user.id` before executing updates or deletes.
- **Role Isolation**: Admin endpoints strictly require `require_admin` dependency check (`user.is_admin == True`).
- **Input & UUID Validation**: Pydantic schemas enforce type safety, valid email formats, string lengths, and strict UUID formats.

---

## 15. Git & Contribution Guidelines

- **Authoritative Branch**: `main` is the single source of truth. All feature branches must be merged into `main`.
- **Branch Naming**: Use descriptive prefixes: `feature/<feature-name>`, `fix/<bug-name>`, `docs/<doc-name>`.
- **Commit Attribution**: Preserve original authorship when committing code. Do not forge commit identity.
- **Pull Requests**: Verify `pytest backend/tests` and `npm run build` pass before opening PRs.

---

<p align="center">
  Built for the Hackathon by the GlobeTrotter Engineering Team.
</p>
