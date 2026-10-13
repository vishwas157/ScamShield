# ScamShield — Setup & Installation Guide
**B.Tech IT Semester 7 Academic Demonstration Setup**

This guide provides instructions for setting up, running, testing, and deploying **ScamShield** locally and in cloud environments.

---

## 1. Prerequisites

- **Node.js**: v18.0.0 or higher (`node -v`, `npm -v`)
- **Python**: 3.10 or 3.11 (`python --version`)
- **MongoDB** *(Optional)*: Local MongoDB server or free MongoDB Atlas cluster.
  > *Note: If MongoDB is not installed locally, ScamShield automatically initializes an offline document adapter so the application runs without errors.*

---

## 2. Project Directory Layout

```
ScamShield/
├── backend/
│   ├── app/
│   │   ├── api/             # FastAPI REST endpoints
│   │   ├── core/            # Config & direct Bcrypt/JWT security
│   │   ├── db/              # PyMongo connection & demo seeder
│   │   ├── ml/              # Scikit-learn Random Forest modules
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   ├── services/        # Normalization, risk engine & reports
│   │   └── main.py          # FastAPI application entrypoint
│   ├── tests/               # Pytest automated test suite
│   ├── requirements.txt     # Python backend dependencies
│   └── .env                 # Backend environment configuration
├── frontend/
│   ├── src/                 # React components, pages & services
│   ├── package.json         # Frontend dependencies
│   └── vite.config.ts       # Vite proxy & Tailwind CSS config
├── docs/                    # Architecture & ML documentation
└── README.md
```

---

## 3. Backend Setup

### Step 3.1: Navigate to Backend & Create Virtual Environment
```bash
cd backend
python -m venv .venv

# On Windows (PowerShell):
.\.venv\Scripts\Activate.ps1

# On macOS/Linux:
source .venv/bin/activate
```

### Step 3.2: Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 3.3: Configure Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PROJECT_NAME="ScamShield — Scam Number & UPI Community Database"
ENVIRONMENT=development
API_V1_STR=/api

# Database: Leave as-is for local PyMongo / auto-fallback, or paste MongoDB Atlas URI:
MONGODB_URI=mongodb://127.0.0.1:27017
DATABASE_NAME=scamshield_db

# Security & Secret Key:
JWT_SECRET=scamshield-super-secret-academic-key-2026
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Default Bootstrapped Admin:
DEFAULT_ADMIN_EMAIL=admin@scamshield.org
DEFAULT_ADMIN_PASSWORD=Admin@ScamShield2026
```

### Step 3.4: Train Random Forest Machine Learning Model
```bash
python -m app.ml.trainer
```
*This generates `app/ml/saved_model.joblib` and evaluates confusion matrix metrics.*

### Step 3.5: Run Automated Tests
```bash
pytest tests/ -v
```
*Executes all 11 unit and integration tests covering search, reporting, admin RBAC, and ML inference.*

### Step 3.6: Launch FastAPI Server
```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Docs (Swagger UI): `http://127.0.0.1:8000/docs`
- Health Endpoint: `http://127.0.0.1:8000/api/health`

---

## 4. Frontend Setup

### Step 4.1: Navigate to Frontend Directory
Open a separate terminal window:
```bash
cd frontend
```

### Step 4.2: Install NPM Dependencies
```bash
npm install
```

### Step 4.3: Build & Validate TypeScript
```bash
npm run build
```

### Step 4.4: Start Frontend Development Server
```bash
npm run dev
```
Open your browser to: **`http://localhost:5173`**

---

## 5. Default Demonstration Credentials

For academic examiner demonstrations, the database automatically provisions a default administrator moderator account upon initial startup:

- **Admin Email**: `admin@scamshield.org`
- **Admin Password**: `Admin@ScamShield2026`
- **1-Click Autofill**: On the `/login` page, click **"Autofill Admin"** to test administrative moderation instantly without typing.

---

## 6. Pre-Seeded Academic Test Data

The application comes pre-populated with realistic academic test scenarios:

| Identifier | Type | Pre-Seeded Context | Expected Search Risk |
| :--- | :--- | :--- | :--- |
| `9876543210` | Phone | Fake Electricity Bill Disconnection Caller (Multiple victims, ₹35,200 loss) | **HIGH RISK** |
| `refund.officer99@okhdfcbank` | UPI | OLX "Scan QR to Receive Money" Reversal Scam | **HIGH RISK** |
| `8826190455` | Phone | Work-From-Home Telegram Task Scam | **MEDIUM RISK** |
| `kyc.update.sbi@paytm` | UPI | Fake Bank KYC Threat Link | **LOW RISK** |
| `9999911111` | Phone | Clean Number with 0 community reports | **NO REPORTS FOUND** *(ML: Insufficient Data)* |

---

## 7. Cloud Deployment (Free-Tier Ready)

### Backend Deployment (Render / Railway)
1. Push code to GitHub.
2. In Render or Railway, create a new **Web Service** pointing to the `backend/` directory.
3. Set the start command:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
4. Set environment variables:
   - `MONGODB_URI`: MongoDB Atlas free tier connection string.
   - `JWT_SECRET`: Random 32+ character string.

### Frontend Deployment (Vercel)
1. In Vercel, import the repository and select the `frontend/` directory as the root.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Add `VITE_API_URL` environment variable pointing to the deployed backend URL.
