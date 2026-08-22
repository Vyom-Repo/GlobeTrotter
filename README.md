# ✈️ Globe Trotter

> **Simplify complex travel planning through an interactive, visual, and budget-smart journey builder.**

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

---

## 🌟 Project Overview

**Globe Trotter** is an end-to-end travel planning platform designed to empower travelers to seamlessly design, organize, and budget multi-city trips. 

Globe Trotter uses a **completely offline travel-data architecture**. No Google Places API, Google Maps API, or external travel-data API is required at runtime. All country, city, and activity information is stored locally inside PostgreSQL, allowing full search, discovery, and itinerary creation with **zero Internet connection required**. 🗺️✨

---

## 🔥 Key Features

- 🧩 **Interactive Itinerary Builder**: Effortlessly organize multi-city trips using a fluid drag-and-drop interface (`dnd-kit`) to assign cities, dates, and activities to specific travel stops.
- 🌐 **Complete Offline Global Dataset**: Local PostgreSQL database pre-loaded with 149 Countries, 608 Cities, and 2,432 Activities across 5 continents.
- 📊 **Budget & Cost Analytics**: Real-time automated cost estimation with visual chart breakdowns (`Recharts`/`Chart.js`) across transportation, accommodations, activities, and dining.
- 📅 **Visual Timelines**: Calendar-based journey overview that lets you see your complete travel flow at a glance.
- 🔒 **Secure Authentication**: User identity management with password hashing and JWT tokens.

---

## 🛠️ Tech Stack

### **Frontend**
- **Core Framework:** React 18 (via Vite)
- **Styling & UI:** Tailwind CSS, PostCSS, Lucide React Icons
- **Drag-and-Drop:** `@dnd-kit` (Core & Sortable)
- **Data Visualization:** Recharts / Chart.js
- **HTTP Client:** Axios

### **Backend**
- **API Engine:** Python 3.10+ & FastAPI
- **ORM & DB Access:** SQLAlchemy 2.x & `psycopg` / `psycopg2-binary`
- **Migrations:** Alembic
- **Validation & Settings:** Pydantic v2 & `pydantic-settings`
- **Security & Auth:** Password Hashing (`passlib` + `bcrypt`) & JWT

### **Database & Infrastructure**
- **Relational Storage:** PostgreSQL
- **Environment Management:** `.env` configuration (Frontend & Backend)

---

## 🌍 Offline Travel Dataset

GlobeTrotter functions as a **100% offline travel discovery and planning engine**.

```text
Countries:  149
Cities:     608
Activities: 2,432
```

### Static Data Files
All master travel data is stored locally in the repository as static, version-controlled JSON files:

```text
backend/data/countries.json   # 149 real countries with ISO-2, ISO-3, region, subregion, capital, currency, lat/long, flag emoji, and description
backend/data/cities.json      # 608 cities mapped to country ISO codes with cost index, popularity score, lat/long, and image URLs
backend/data/activities.json  # 2,432 realistic activities categorized into historical, food, sightseeing, museum, adventure, etc.
```

### Zero Network Dependency Guarantee
The seed operation (`python -m backend.scripts.seed_data`) and runtime API discovery endpoints perform zero external HTTP requests (`requests`, `httpx`, `aiohttp`, or Google Places API). All queries execute directly against local PostgreSQL tables.

---

## 🗄️ Database Schema

Globe Trotter features a normalized 11-table PostgreSQL database architecture built with SQLAlchemy 2.x, PostgreSQL-native UUIDs, ENUM types, `TIMESTAMPTZ`, `NUMERIC`, check constraints, unique constraints, and optimized indexes.

### A. ER Diagram

```mermaid
erDiagram
    USERS ||--|| USER_PREFERENCES : has
    USERS ||--o{ TRIPS : creates
    USERS ||--o{ SAVED_DESTINATIONS : saves

    COUNTRIES ||--o{ CITIES : contains
    CITIES ||--o{ ACTIVITIES : offers

    TRIPS ||--o{ TRIP_STOPS : contains
    CITIES ||--o{ TRIP_STOPS : selected_as

    TRIP_STOPS ||--o{ ITINERARY_ITEMS : contains
    ACTIVITIES ||--o{ ITINERARY_ITEMS : scheduled_as

    TRIPS ||--o{ EXPENSES : has
    TRIPS ||--o{ TRIP_SHARES : shared_through

    CITIES ||--o{ SAVED_DESTINATIONS : saved_as
    USERS ||--o{ TRIP_SHARES : receives
```

---

### B. Table Documentation

#### 1. `countries`
- **Purpose**: Authoritative country master table.
- **Columns**:
  - `id`: `UUID` (PRIMARY KEY, auto-generated)
  - `name`: `VARCHAR(100)` (NOT NULL, UNIQUE, Indexed)
  - `iso_code`: `CHAR(2)` (NOT NULL, UNIQUE, Indexed)
  - `iso3_code`: `CHAR(3)` (NOT NULL, UNIQUE, Indexed)
  - `region`: `VARCHAR(50)` (NOT NULL, Indexed)
  - `subregion`: `VARCHAR(50)` (NULL, Indexed)
  - `capital`: `VARCHAR(100)` (NULL)
  - `currency_code`: `CHAR(3)` (NULL)
  - `latitude`: `NUMERIC(9,6)` (NULL, Check between -90 and 90)
  - `longitude`: `NUMERIC(9,6)` (NULL, Check between -180 and 180)
  - `flag_emoji`: `VARCHAR(10)` (NULL)
  - `description`: `TEXT` (NULL)
  - `created_at`: `TIMESTAMPTZ` (NOT NULL, DEFAULT CURRENT_TIMESTAMP)
  - `updated_at`: `TIMESTAMPTZ` (NOT NULL, DEFAULT CURRENT_TIMESTAMP)
- **Relationships**: 1:N `cities`.

#### 2. `cities`
- **Purpose**: Destination master dataset linked to country.
- **Columns**:
  - `id`: `UUID` (PRIMARY KEY)
  - `country_id`: `UUID` (NOT NULL, Foreign Key -> `countries.id` `ON DELETE CASCADE`, Indexed)
  - `name`: `VARCHAR(150)` (NOT NULL, Indexed)
  - `region`: `VARCHAR(100)` (NULL, Indexed)
  - `description`: `TEXT` (NULL)
  - `image_url`: `TEXT` (NULL)
  - `cost_index`: `NUMERIC(5,2)` (NULL, Indexed, Check >= 0)
  - `popularity_score`: `NUMERIC(5,2)` (NULL, Indexed, Check >= 0)
  - `latitude`: `NUMERIC(9,6)` (NULL, Check between -90 and 90)
  - `longitude`: `NUMERIC(9,6)` (NULL, Check between -180 and 180)
  - `created_at`: `TIMESTAMPTZ` (NOT NULL)
  - `updated_at`: `TIMESTAMPTZ` (NOT NULL)
- **Relationships**: N:1 `country`, 1:N `activities`, 1:N `trip_stops`, 1:N `saved_destinations`.

#### 3. `activities`
- **Purpose**: Global tourist activities associated with cities.
- **Columns**:
  - `id`: `UUID` (PRIMARY KEY)
  - `city_id`: `UUID` (NOT NULL, Foreign Key -> `cities.id` `ON DELETE CASCADE`, Indexed)
  - `name`: `VARCHAR(200)` (NOT NULL)
  - `description`: `TEXT` (NULL)
  - `activity_type`: `VARCHAR(50)` (NOT NULL, Indexed)
  - `estimated_cost`: `NUMERIC(12,2)` (NOT NULL, DEFAULT 0, Indexed, Check >= 0)
  - `currency`: `CHAR(3)` (NOT NULL, DEFAULT 'INR')
  - `duration_minutes`: `INTEGER` (NULL, Check > 0)
  - `image_url`: `TEXT` (NULL)
  - `popularity_score`: `NUMERIC(5,2)` (NULL, Indexed, Check >= 0)
  - `created_at`: `TIMESTAMPTZ` (NOT NULL)
  - `updated_at`: `TIMESTAMPTZ` (NOT NULL)

#### 4. `users`
- **Purpose**: Identity and user authentication storage.
- **Columns**: `id` (UUID PK), `name`, `email` (UNIQUE), `password_hash`, `profile_photo_url`, `is_active`, `is_admin`, timestamps.

#### 5. `user_preferences`
- **Purpose**: User-specific travel preferences (currency, language).
- **Columns**: `id`, `user_id` (FK -> `users.id` CASCADE, UNIQUE), `language`, `currency`, timestamps.

#### 6. `trips`
- **Purpose**: User travel journey master records.
- **Columns**: `id`, `user_id` (FK -> `users.id`), `name`, `description`, `start_date`, `end_date` (Check `start_date <= end_date`), `budget_limit` (Check >= 0), `currency`, `visibility` (`private`, `shared`, `public`), `share_token` (UNIQUE), timestamps.

#### 7. `trip_stops`
- **Purpose**: Ordered city stops within a specific trip.
- **Columns**: `id`, `trip_id` (FK -> `trips.id`), `city_id` (FK -> `cities.id`), `start_date`, `end_date`, `stop_order` (Check > 0), timestamps. `UNIQUE(trip_id, stop_order)`.

#### 8. `itinerary_items`
- **Purpose**: Daily scheduled activities within a trip stop.
- **Columns**: `id`, `trip_stop_id` (FK -> `trip_stops.id`), `activity_id` (FK -> `activities.id`), `scheduled_date`, `start_time`, `end_time`, `item_order` (Check > 0), `estimated_cost` (Check >= 0), timestamps. `UNIQUE(trip_stop_id, scheduled_date, item_order)`.

#### 9. `expenses`
- **Purpose**: Granular financial expense tracking across trip, stop, or activity levels.
- **Columns**: `id`, `trip_id` (FK -> `trips.id`), `trip_stop_id` (FK -> `trip_stops.id`), `itinerary_item_id` (FK -> `itinerary_items.id`), `category` (`transport`, `accommodation`, `activities`, `meals`, `other`), `description`, `amount` (Check >= 0), `currency`, `expense_date`, timestamps.

#### 10. `saved_destinations`
- **Purpose**: User bookmarked destination cities.
- **Columns**: `id`, `user_id` (FK -> `users.id`), `city_id` (FK -> `cities.id`), `created_at`. `UNIQUE(user_id, city_id)`.

#### 11. `trip_shares`
- **Purpose**: Token-based public and recipient-specific trip sharing.
- **Columns**: `id`, `trip_id` (FK -> `trips.id`), `shared_with_user_id` (FK -> `users.id`), `share_token` (UNIQUE), `permission` (`view`, `copy`), `expires_at`, timestamps.

---

### C. Relationship Summary

| Source Table | Destination Table | Cardinality | FK Field / Type | Cascade Delete |
| :--- | :--- | :--- | :--- | :--- |
| `countries` | `cities` | 1:N | `cities.country_id` | CASCADE |
| `users` | `user_preferences` | 1:1 | `user_preferences.user_id` | CASCADE |
| `users` | `trips` | 1:N | `trips.user_id` | CASCADE |
| `users` | `saved_destinations` | 1:N | `saved_destinations.user_id` | CASCADE |
| `users` | `trip_shares` | 1:N | `trip_shares.shared_with_user_id` | CASCADE |
| `cities` | `activities` | 1:N | `activities.city_id` | CASCADE |
| `cities` | `trip_stops` | 1:N | `trip_stops.city_id` | CASCADE |
| `cities` | `saved_destinations` | 1:N | `saved_destinations.city_id` | CASCADE |
| `trips` | `trip_stops` | 1:N | `trip_stops.trip_id` | CASCADE |
| `trips` | `expenses` | 1:N | `expenses.trip_id` | CASCADE |
| `trips` | `trip_shares` | 1:N | `trip_shares.trip_id` | CASCADE |
| `trip_stops` | `itinerary_items` | 1:N | `itinerary_items.trip_stop_id` | CASCADE |
| `trip_stops` | `expenses` | 1:N | `expenses.trip_stop_id` | SET NULL |
| `activities` | `itinerary_items` | 1:N | `itinerary_items.activity_id` | CASCADE |
| `itinerary_items` | `expenses` | 1:N | `expenses.itinerary_item_id` | SET NULL |

---

### D. Database Setup & Seeding

1. Create PostgreSQL Database:
   ```bash
   createdb globe_trotter
   ```
2. Run Alembic Migrations:
   ```bash
   alembic upgrade head
   ```
3. Seed Destination & Activity Master Data from Local JSON:
   ```bash
   python -m backend.scripts.seed_data
   ```
4. Run Database Schema Verification Suite:
   ```bash
   python -m backend.scripts.verify_db
   ```

---

### E. Migration Instructions

To manage schema evolutions via Alembic:

- **Generate new migration from model changes**:
  ```bash
  alembic revision --autogenerate -m "description_of_changes"
  ```
- **Apply migrations to head**:
  ```bash
  alembic upgrade head
  ```
- **Revert last migration**:
  ```bash
  alembic downgrade -1
  ```
- **Revert to base empty database**:
  ```bash
  alembic downgrade base
  ```

---

## 📁 Folder Structure

Globe Trotter is organized as a clean, scalable monorepo structure separating `/frontend` and `/backend` concerns:

```text
globe-trotter/
├── backend/
│   ├── alembic/          # Alembic configuration & migration versions
│   │   ├── versions/     # 001_initial_database_foundation.py, 002_add_countries_and_link_cities.py
│   │   ├── env.py
│   │   └── script.py.mako
│   ├── core/             # Settings (`config.py`), security & JWT constants
│   ├── data/             # Local offline datasets (countries.json, cities.json, activities.json)
│   ├── database/         # SQLAlchemy engine (`connection.py`), `base.py`, session maker
│   ├── models/           # 11 Core ORM Models (Country, User, UserPreference, City, Activity, Trip, TripStop, ItineraryItem, Expense, SavedDestination, TripShare)
│   ├── scripts/          # Idempotent seed data, dataset generator & DB verification scripts (`seed_data.py`, `generate_dataset.py`, `verify_db.py`)
│   ├── alembic.ini
│   ├── main.py           # FastAPI application entry point & CORS configuration
│   ├── requirements.txt
│   ├── .env              # Backend environment variables (Git-ignored)
│   └── .env.example      # Backend environment template
│
├── frontend/
│   ├── public/           # Favicon and static public assets
│   ├── src/
│   │   ├── assets/       # Global styles and Tailwind CSS index
│   │   ├── components/   # Reusable UI components (Navbar, TripCard, Modal, BudgetCard, etc.)
│   │   ├── pages/        # Main views (Dashboard, Login, Register, ItineraryBuilder, Budget, etc.)
│   │   ├── services/     # Axios API client setup
│   │   ├── utils/        # Helper utilities (date & currency formatters)
│   │   ├── App.jsx       # App layout & routing entry point
│   │   └── main.jsx      # React DOM render entry point
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── .env              # Frontend environment variables (Git-ignored)
│   └── .env.example      # Frontend environment template
│
├── .gitignore            # Full-stack git ignore rules
└── README.md
```

---

## 🚀 Local Setup & Installation Guide

Follow these steps to get Globe Trotter running locally on your machine.

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**
- **PostgreSQL** running locally or via Docker

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/globe-trotter.git
cd globe-trotter
```

---

### 2️⃣ Environment Variable Setup (Crucial)

⚠️ **Globe Trotter requires TWO separate `.env` files** (one for `/backend` and one for `/frontend`).

#### **Backend Environment (`backend/.env`)**
Create `backend/.env` from the example template:
```bash
cp backend/.env.example backend/.env
```
Ensure `backend/.env` contains your PostgreSQL credentials and configuration:
```env
DATABASE_URL=postgresql+psycopg://username:password@localhost:5432/globe_trotter
SECRET_KEY=change_this_secret_key_for_hackathon_demo
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

#### **Frontend Environment (`frontend/.env`)**
Create `frontend/.env` from the example template:
```bash
cp frontend/.env.example frontend/.env
```
Ensure `frontend/.env` points to the FastAPI server port:
```env
VITE_API_BASE_URL=http://localhost:8000
```

---

### 3️⃣ Backend Database Setup & Server Launch

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run migrations and seed offline dataset:
   ```bash
   alembic upgrade head
   python -m backend.scripts.seed_data
   ```
4. Start the FastAPI Uvicorn development server:
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```
   > 💡 The FastAPI backend server will run at: **`http://localhost:8000`**  
   > 📖 Interactive Swagger API docs: **`http://localhost:8000/docs`**

---

### 4️⃣ Frontend Setup & Vite Dev Server Launch

Open a new terminal tab/window:

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node.js packages:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   > 🚀 The React frontend application will launch at: **`http://localhost:5173`**

---

## 🔮 Future Enhancements

- 🤖 **AI-Powered Itinerary Generator**: Integrate Gemini AI to automatically curate personalized travel routes based on budget and trip duration.
- 🤝 **Real-time Collaborative Planning**: WebSocket support for live multi-user editing of shared trip itineraries.
- ✈️ **Live Flight & Hotel API Integrations**: Optional live API toggles for real-time flight tracking and accommodation booking.
- 📱 **Mobile Native App**: React Native cross-platform app for on-the-go offline itinerary access.
- 🗺️ **Interactive Map View**: Mapbox integration for interactive visual route mapping between trip stops.

---

<p center="align">
  Built with ❤️ for the Hackathon by the Globe Trotter Team.
</p>
