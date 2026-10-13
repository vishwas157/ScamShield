# ScamShield — Scam Number & UPI Community Database
**B.Tech Information Technology (Semester 7) Academic Project**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.2+-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Scikit--Learn](https://img.shields.io/badge/Scikit--Learn-Random_Forest-F7931E.svg?logo=scikitlearn&logoColor=white)](https://scikit-learn.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas_%2F_PyMongo-47A248.svg?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tests](https://img.shields.io/badge/Pytest-11%20Passed-brightgreen.svg?logo=pytest&logoColor=white)](https://pytest.org/)

---

## 📌 Project Overview

**ScamShield** is an undergraduate full-stack cybersecurity intelligence platform engineered to combat digital financial fraud in India. It enables citizens to investigate suspicious mobile numbers and Unified Payments Interface (UPI) addresses, examine corroborating evidence, file structured fraud allegations, and view algorithmic risk scores.

The platform integrates a multi-factor risk assessment engine alongside a genuine **Random Forest** machine learning pipeline trained on Indian digital payment fraud patterns (velocity, distinct victim count, category severity, and loss scale).

---

## 🏗️ Technology Architecture

```
                    ┌─────────────────────────────────────────┐
                    │      React + Vite + TypeScript SPA      │
                    │   Tailwind CSS • Recharts • Lucide      │
                    └────────────────────┬────────────────────┘
                                         │ HTTPS / REST API
                                         ▼
                    ┌─────────────────────────────────────────┐
                    │            FastAPI Backend              │
                    │      Direct Bcrypt & JWT Auth (HS256)   │
                    └──────┬─────────────┬─────────────┬──────┘
                           │             │             │
              ┌────────────┴──┐   ┌──────┴─────┐  ┌────┴────────────┐
              │ Normalization │   │ Risk Engine│  │ Random Forest   │
              │  & Filtering  │   │  & Auditing│  │ ML Classifier   │
              └───────────────┘   └────────────┘  └─────────────────┘
                                         │
                                         ▼
                    ┌─────────────────────────────────────────┐
                    │       MongoDB Atlas / PyMongo Cluster   │
                    │   (With Built-in Resilient Fallback)    │
                    └─────────────────────────────────────────┘
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.10 or v3.11)
- MongoDB *(Optional: system includes auto-fallback for offline evaluation)*

### 2. Backend Setup
```bash
cd backend
python -m venv .venv

# On Windows:
.\.venv\Scripts\Activate.ps1
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt

# Run initial Random Forest model training & evaluation:
python -m app.ml.trainer

# Run automated tests (11 tests):
python -m pytest tests/ -v

# Launch local backend server:
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- Interactive Swagger API Docs: `http://127.0.0.1:8000/docs`
- Health Endpoint: `http://127.0.0.1:8000/api/health` and `http://127.0.0.1:8000/health`

### 3. Frontend Setup
Open a separate terminal:
```bash
cd frontend
npm install

# Build production bundle:
npm run build

# Start development server:
npm run dev
```
Open browser to: **`http://localhost:5173`**

---

## 🌐 Complete Production Deployment Guide

ScamShield is configured for split-cloud deployment (Frontend on **Vercel/Netlify**, Backend on **Render/Railway**, Database on **MongoDB Atlas**), or unified container deployment.

---

### Step 1: Database Setup (MongoDB Atlas)

1. **Create Free MongoDB Cluster**:
   - Register at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   - Create a free **M0 Sandbox** cluster (AWS or GCP, nearest region e.g., Mumbai `ap-south-1`).
2. **Create Database User**:
   - Go to **Security → Database Access → Add New Database User**.
   - Authentication Method: **Password**.
   - Enter a username (e.g., `scamshield_admin`) and a strong password.
   - Database User Privileges: **Read and write to any database** (or `Built-in: readWrite@scamshield_db`).
3. **Configure Network Access**:
   - Go to **Security → Network Access → Add IP Address**.
   - For cloud serverless hosting platforms (Render, Vercel, Railway), add **`0.0.0.0/0`** (Allow Access from Anywhere).
4. **Get Connection String**:
   - Go to **Deployment → Database → Connect → Drivers → Python (3.12 or later)**.
   - Copy connection URI:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your actual credentials.

---

### Step 2: Backend Deployment (Render / Railway / Heroku)

#### Option A: Deploy on Render (Recommended)
1. Push this repository to GitHub or GitLab.
2. Sign in to [Render](https://render.com) and click **New + → Web Service**.
3. Connect your repository.
4. Configure service settings:
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt && python -m app.ml.trainer`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Configure Environment Variables in Render Dashboard:
   | Key | Recommended Value | Notes |
   | :--- | :--- | :--- |
   | `ENVIRONMENT` | `production` | Enables production mode |
   | `MONGODB_URI` | `mongodb+srv://user:pass@cluster0...` | Your MongoDB Atlas connection URI |
   | `DATABASE_NAME` | `scamshield_db` | MongoDB Database name |
   | `JWT_SECRET` | `openssl rand -hex 32` | Cryptographically secure 64-char key |
   | `CORS_ORIGINS` | `https://your-frontend.vercel.app` | Your deployed frontend domain |
   | `DEFAULT_ADMIN_EMAIL` | `admin@yourdomain.org` | Initial administrator login |
   | `DEFAULT_ADMIN_PASSWORD` | `YourStrongPassword123!` | Minimum 12 characters |
   | `PORT` | `8000` | Render sets this automatically |
6. Click **Create Web Service**. Once deployed, copy your backend URL (e.g., `https://scamshield-api.onrender.com`).
7. Verify backend health by visiting: `https://scamshield-api.onrender.com/health`.

#### Option B: Deploy with Docker
Build and run the backend container:
```bash
docker build -t scamshield-backend ./backend
docker run -p 8000:8000 \
  -e MONGODB_URI="mongodb+srv://user:pass@cluster..." \
  -e JWT_SECRET="your_secret" \
  -e CORS_ORIGINS="https://your-frontend.vercel.app" \
  scamshield-backend
```

---

### Step 3: Frontend Deployment (Vercel / Netlify)

#### Deploy on Vercel
1. Sign in to [Vercel](https://vercel.com) and click **Add New... → Project**.
2. Select your repository.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Set Environment Variables in Vercel:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_BASE_URL` | `https://your-backend-api.onrender.com/api` |
   | `VITE_ENABLE_DEMO_CREDENTIALS` | `false` *(Set `true` only for viva demo)* |
5. Click **Deploy**. Vercel will build and publish your SPA.
6. Once deployed, copy your frontend domain (e.g., `https://scamshield.vercel.app`) and ensure it is listed in the backend's `CORS_ORIGINS` variable!

---

### Step 4: Post-Deployment Verification Checklist

Execute these verification checks once deployed:
1. **Health Probe**:
   - Query `https://<backend-url>/health`
   - Confirm: `"status": "healthy"`, `"database.is_native_mongodb": true`, `"machine_learning.trained": true`.
2. **Search Verification**:
   - Query `https://<backend-url>/api/search?type=phone&query=9876543210`
   - Confirm JSON response returns verified report history and Random Forest risk scoring.
3. **Frontend Connection**:
   - Open your deployed frontend website (`https://<frontend-url>`).
   - Open browser DevTools Network tab.
   - Verify that requests to `/api/stats` and `/api/reports` return status `200 OK`.
4. **End-to-End Incident Filing**:
   - Submit a test report through the **Report Scam** form.
   - Confirm receipt of reference ID `RPT-2026-XXXXXXXX`.
   - Log into the Moderator Console using your configured admin credentials and confirm the report appears in the review queue.

---

## 🔑 Demonstration Credentials (Academic Viva)

To enable external project evaluators to test administrative moderation features:

| Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Moderator (Admin)** | `admin@scamshield.org` | `Admin@ScamShield2026` | Full moderation, audit logs, ML retraining |
| **Citizen (User)** | `student_tester@college.edu` | `Password123!` | Report submissions, personal history |

> *Note: In production environments, admin credentials must be configured via environment variables and demo autofill disabled via `VITE_ENABLE_DEMO_CREDENTIALS=false`.*

---

## 🧪 Demonstration Identifiers

| Identifier | Type | Pre-Seeded Scam Context | Expected Risk Output |
| :--- | :--- | :--- | :--- |
| `9876543210` | Phone | Fake Electricity Bill Disconnection Caller (₹35,200 loss) | **HIGH RISK** |
| `refund.officer99@okhdfcbank` | UPI | OLX "Scan QR to Receive Money" Reversal Fraud | **HIGH RISK** |
| `8826190455` | Phone | Work-From-Home Telegram Task Scam | **MEDIUM RISK** |
| `kyc.update.sbi@paytm` | UPI | Fake Bank KYC Update SMS Link | **LOW RISK** |
| `9999911111` | Phone | Unreported Clean Number | **NO REPORTS FOUND** *(ML: Insufficient Data)* |

---

## 📊 Automated Test Coverage

The backend includes 11 automated pytest test cases executing across all core flows:
- `test_health_check`: Verifies system diagnostics and engine status.
- `test_public_stats`: Validates live report tallies from MongoDB collections.
- `test_search_valid_phone_found`: Verifies phone normalization, approved query, and ML inference.
- `test_search_clean_identifier_no_reports`: Validates honest zero-state and insufficient data output.
- `test_search_invalid_phone_rejected`: Ensures rejection of non-10-digit mobile numbers (HTTP 400).
- `test_search_valid_upi_found`: Tests UPI address validation and report correlation.
- `test_search_invalid_upi_rejected`: Tests regex rejection of malformed UPI handles.
- `test_public_reports_listing`: Verifies public database only reveals approved records.
- `test_report_submission_and_duplicate_flow`: Tests report creation, pending status, and duplicate rate limiting.
- `test_auth_and_admin_security`: Verifies Bcrypt auth, token creation, 401/403 RBAC, and audit log generation.
- `test_ml_endpoints`: Tests model status, prediction with sufficient data, and zero-report handling.

```
======================= 11 passed in 10.44s =======================
```

---

## 📁 Repository Structure

```
ScamShield/
├── backend/
│   ├── app/
│   │   ├── api/             # FastAPI REST router modules
│   │   ├── core/            # Config settings, Bcrypt & JWT security
│   │   ├── db/              # MongoDB manager, seed & connection pooling
│   │   ├── ml/              # Feature vectors, Random Forest classifier, serialized model
│   │   ├── schemas/         # Pydantic validation schemas
│   │   ├── services/        # Normalization, risk evaluation, moderation service
│   │   └── main.py          # FastAPI application entrypoint
│   ├── tests/
│   │   └── test_api.py      # Automated pytest suite (11 test cases)
│   ├── requirements.txt     # Python backend dependencies (including dnspython & gunicorn)
│   ├── Procfile             # Hosting startup instructions
│   ├── .env.example         # Template with placeholder credentials
│   └── .gitignore           # Ignores sensitive .env files, keeps ML model
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, Footer, RiskBadge, MLCard, CyberVisual
│   │   ├── context/         # AuthContext provider
│   │   ├── pages/           # Home, Search, Report, Database, Safety, Admin, ML
│   │   ├── services/        # Axios API client (configured for VITE_API_BASE_URL)
│   │   ├── types/           # TypeScript interfaces
│   │   ├── App.tsx          # Router configuration
│   │   └── index.css        # Tailwind CSS and theme tokens
│   ├── package.json         # Frontend packages & build scripts
│   ├── vite.config.ts       # Vite proxy & Tailwind plugin
│   ├── .env.example         # Frontend template
│   └── .gitignore           # Frontend exclusions
├── docs/
│   ├── project-overview.md  # Comprehensive architectural dossier
│   ├── ml-documentation.md  # Machine learning pipeline specification
│   └── setup-guide.md       # Step-by-step installation instructions
├── .gitignore               # Root git exclusions
├── .env.example             # Unified environment template
└── README.md                # Project documentation & deployment guide
```

---

## ⚖️ Academic & Ethical AI Disclaimer

1. **Non-Criminal Status**: Reports submitted to ScamShield represent community allegations. An entity flag does not constitute proof of criminal conduct under law.
2. **Synthetic Training**: To respect data privacy regulations and avoid processing unverified PII, the Random Forest model is trained on a controlled benchmark simulating fraud distributions.
3. **Consumer Vigilance**: ScamShield is intended for consumer vigilance and preventative awareness. Victims of active financial fraud should immediately contact the National Cybercrime Helpline by dialing **1930** or visiting **[cybercrime.gov.in](https://cybercrime.gov.in)**.
