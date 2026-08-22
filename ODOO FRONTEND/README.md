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

Traditional travel planning often involves messy spreadsheets, scattered browser tabs, and unpredictable expenses. Globe Trotter solves this by providing an intuitive monorepo solution featuring an interactive visual itinerary builder, automated budget analytics, and offline-ready search capabilities—making trip creation fast, collaborative, and stress-free! 🗺️✨

---

## 🔥 Key Features

- 🧩 **Interactive Itinerary Builder**: Effortlessly organize multi-city trips using a fluid drag-and-drop interface (`dnd-kit`) to assign cities, dates, and activities to specific travel stops.
- 📊 **Budget & Cost Analytics**: Real-time automated cost estimation with visual chart breakdowns (`Recharts`/`Chart.js`) across transportation, accommodations, activities, and dining.
- 📅 **Visual Timelines**: Calendar-based journey overview that lets you see your complete travel flow at a glance.
- ⚡ **Offline-Ready & Demo-Reliable**: Built-in mock data engine (powered by Faker) for instant city and activity discovery without depending on fragile external APIs during live demos.
- 🔒 **Secure Authentication**: User registration and login powered by JWT token authentication and passlib password hashing.

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
- **ORM & DB Access:** SQLAlchemy (2.0+) & `psycopg2-binary`
- **Validation & Settings:** Pydantic v2 & `pydantic-settings`
- **Security & Auth:** JWT (`python-jose`) & Password Hashing (`passlib` + `bcrypt`)
- **Data Generation:** Faker (Realistic local mock data generation)

### **Database & Infrastructure**
- **Relational Storage:** PostgreSQL
- **Environment Management:** `.env` configuration (Frontend & Backend)

---

## 📁 Folder Structure

Globe Trotter is organized as a clean, scalable monorepo structure separating `/frontend` and `/backend` concerns:

```text
globe-trotter/
├── backend/
│   ├── api/          # FastAPI routers (auth, users, trips, cities, stops, activities, budgets)
│   ├── core/         # App settings, security, JWT authentication, & constants
│   ├── database/     # SQLAlchemy engine, DB session maker, and Base model
│   ├── models/       # ORM Database entity models (User, Trip, City, Stop, etc.)
│   ├── schemas/      # Pydantic request/response validation schemas
│   ├── scripts/      # Seed data generator scripts using Faker
│   ├── main.py       # FastAPI application entry point & CORS configuration
│   ├── requirements.txt
│   ├── .env          # Backend environment variables (Git-ignored)
│   └── .env.example  # Backend environment template
│
├── frontend/
│   ├── public/       # Favicon and static public assets
│   ├── src/
│   │   ├── assets/     # Global styles and Tailwind CSS index
│   │   ├── components/ # Reusable UI components (Navbar, TripCard, Modal, BudgetCard, etc.)
│   │   ├── pages/      # Main views (Dashboard, Login, Register, ItineraryBuilder, Budget, etc.)
│   │   ├── services/   # Axios API client setup
│   │   ├── utils/      # Helper utilities (date & currency formatters)
│   │   ├── App.jsx     # App layout & routing entry point
│   │   └── main.jsx    # React DOM render entry point
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── .env          # Frontend environment variables (Git-ignored)
│   └── .env.example  # Frontend environment template
│
├── .gitignore       # Full-stack git ignore rules
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
Ensure `backend/.env` contains your PostgreSQL credentials and JWT configuration:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/globe_trotter
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

### 3️⃣ Backend Setup & FastAPI Server Launch

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   # On macOS/Linux:
   python3 -m venv venv
   source venv/bin/activate

   # On Windows:
   python -m venv venv
   venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Seed the database with offline mock data (optional):
   ```bash
   python -m backend.scripts.seed_data
   ```
5. Start the FastAPI Uvicorn development server:
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
