# Credit Card Fraud Detection System

An AI-powered system that predicts whether a credit card transaction is **fraudulent or genuine**, and gives a fraud-probability breakdown through an interactive dashboard.

Built with **Next.js + TypeScript** on the frontend and **FastAPI + PostgreSQL** on the backend, with Logistic Regression, Random Forest, and XGBoost models trained for fraud classification.

---

## ✨ Features

- 🔐 User Authentication (Login / Register)
- ⚡ Real-time Fraud Risk Prediction with a visual risk gauge (`dashboard/predict`)
- 📊 Fraud Probability Analysis
- 📈 Dashboard Analytics (`dashboard/analytics`) — fraud chart, risk chart
- 🧾 Transaction History (`dashboard/transactions`, `dashboard/history`)
- 📁 Bulk CSV Upload & Analysis (`dashboard/upload`)
- 👤 User Profile (`dashboard/profile`)
- ⚙️ Settings (`dashboard/settings`)
- 🌗 Light / Dark Mode
- 🗄️ PostgreSQL-backed persistence
- 📄 PDF report export

---

## 🛠️ Technology Stack

### Frontend
| Tool | Purpose |
|---|---|
| Next.js 16 | React framework / App Router |
| TypeScript | Type safety |
| Tailwind CSS 4 | Styling |
| shadcn/ui | Component library |
| Recharts | Dashboard charts |
| Framer Motion | Animations |
| Sonner | Toast notifications |
| next-themes | Dark / light mode |

### Backend
| Tool | Purpose |
|---|---|
| FastAPI | REST API |
| Python | Core language |
| SQLAlchemy | ORM |
| Passlib + python-jose | Auth (password hashing + JWT) |
| Scikit-Learn | Logistic Regression / Random Forest |
| XGBoost | Primary fraud classification model |
| ReportLab | PDF report generation |

### Database
- PostgreSQL

---

## 📂 Project Structure

```
credit-card-fraud-detection-system/
├── backend/
│   ├── api/
│   │   ├── auth.py             # Login/register, JWT handling
│   │   ├── database.py         # DB engine / session
│   │   ├── main.py             # FastAPI entry point
│   │   └── models.py           # Pydantic / ORM schemas
│   ├── data/
│   │   ├── transactions.csv
│   │   ├── amount_by_class.png     # EDA output
│   │   ├── class_distribution.png  # EDA output
│   │   └── time_distribution.png   # EDA output
│   ├── models/
│   │   ├── prediction.py           # SQLAlchemy Prediction model
│   │   ├── logistic_model.pkl
│   │   ├── random_forest_model.pkl
│   │   └── amount_scaler.pkl
│   ├── scripts/
│   │   ├── eda.py                  # Exploratory data analysis
│   │   ├── feature_engineering.py
│   │   ├── load_data.py
│   │   ├── get_sample.py
│   │   ├── preprocess.py
│   │   ├── save_scalers.py
│   │   ├── train_model.py
│   │   └── train_advanced.py
│   ├── create_tables.py            # DB table bootstrap script
│   ├── preprocess.py               # Data cleaning script
│   ├── prediction_history.csv      # Logged predictions
│   └── requirements.txt
├── frontend/
│   ├── public/
│   └── src/
│       ├── app/
│       │   ├── dashboard/
│       │   │   ├── analytics/
│       │   │   │   └── page.tsx
│       │   │   ├── history/
│       │   │   │   └── page.tsx
│       │   │   ├── predict/
│       │   │   │   └── page.tsx
│       │   │   ├── profile/
│       │   │   │   └── page.tsx
│       │   │   ├── settings/
│       │   │   │   └── page.tsx
│       │   │   ├── transactions/
│       │   │   │   └── page.tsx
│       │   │   ├── upload/
│       │   │   │   └── page.tsx
│       │   │   ├── layout.tsx
│       │   │   └── page.tsx
│       │   ├── login/
│       │   ├── register/
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   └── globals.css
│       ├── components/
│       │   ├── ui/                 # shadcn/ui primitives
│       │   │   ├── badge.tsx
│       │   │   ├── button.tsx
│       │   │   ├── card.tsx
│       │   │   ├── input.tsx
│       │   │   ├── label.tsx
│       │   │   └── table.tsx
│       │   ├── fraud-chart.tsx
│       │   ├── risk-chart.tsx
│       │   ├── risk-gauge.tsx
│       │   ├── transactions-table.tsx
│       │   ├── sidebar.tsx
│       │   ├── header.tsx
│       │   └── theme-toggle.tsx
│       └── lib/
│           ├── api.ts              # API client
│           └── utils.ts
└── README.md
```

---

## 🚀 Installation

### Backend Setup

```bash
cd backend

python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

pip install -r requirements.txt

# create the database tables
python create_tables.py

python -m uvicorn api.main:app --reload
```

Backend runs at: `http://127.0.0.1:8000`
Interactive API docs: `http://127.0.0.1:8000/docs`

### Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

### Environment Variables

Create a `.env` file in `backend/` with your database connection string and JWT secret, e.g.:

```
DATABASE_URL=postgresql://user:password@localhost:5432/fraud_detection
SECRET_KEY=your-secret-key-here
```

---

## 🤖 Machine Learning Pipeline

- **Dataset:** Kaggle Credit Card Fraud Detection Dataset (`transactions.csv`)
- **Features:** `Time`, `V1`–`V28`, `Amount`
- **EDA:** class distribution, amount-by-class, and time-distribution analysis (`scripts/eda.py`)
- **Preprocessing:** deduplication + feature scaling (`amount_scaler.pkl`)
- **Models trained:** Logistic Regression, Random Forest, and XGBoost (`scripts/train_model.py`, `scripts/train_advanced.py`)
- **Output:** Fraud Probability + Fraud / Genuine Classification, logged to `prediction_history.csv` and PostgreSQL

---

## 🧩 Project Modules

1. Authentication Module (login / register, JWT)
2. Fraud Detection Module (`predict` — risk gauge, fraud/risk charts)
3. Dashboard Analytics Module (`analytics`)
4. Transaction History Module (`transactions`, `history`)
5. CSV Upload & Analysis Module (`upload`)
6. User Profile Module (`profile`)
7. Settings Module (`settings`)
8. PDF Report Export

---

## 🗺️ Roadmap / Future Enhancements

- [ ] SHAP-based explainability for individual predictions
- [ ] SMOTE / class-weighting to handle dataset imbalance
- [ ] Dockerize frontend + backend for one-command setup
- [ ] Automated tests (pytest for backend, Jest/RTL for frontend)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Model comparison view (Logistic Regression vs Random Forest vs XGBoost)

---

## 👩‍💻 Author

**Vaishnavi More**
B.Tech Computer Science and Technology
Shivaji University, Kolhapur