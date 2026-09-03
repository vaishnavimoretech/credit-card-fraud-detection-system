# Credit Card Fraud Detection System

## Project Overview

This project is an AI-powered Credit Card Fraud Detection System built using:

* Next.js
* TypeScript
* FastAPI
* PostgreSQL
* XGBoost Machine Learning Model

The system predicts whether a transaction is fraudulent or genuine and provides fraud probability analysis through an interactive dashboard.

---

## Features

* User Authentication (Login/Register)
* Fraud Risk Prediction
* Fraud Probability Analysis
* Dashboard Analytics
* Transaction History
* Notifications
* CSV Analysis
* PostgreSQL Database Integration
* XGBoost Machine Learning Model

---

## Technology Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* FastAPI
* Python
* Scikit-Learn
* XGBoost

### Database

* PostgreSQL

---

## Installation

### Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn api.main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend URL:

```text
http://localhost:3000
```

---

## Machine Learning Model

The model is trained on the Kaggle Credit Card Fraud Detection Dataset.

Features Used:

* Time
* V1 to V28
* Amount

Algorithm:

* XGBoost Classifier

Output:

* Fraud Probability
* Fraud / Genuine Classification

---

## Project Modules

1. Authentication Module
2. Fraud Detection Module
3. Dashboard Module
4. Transaction History Module
5. CSV Analysis Module
6. Notification Module

---

## Author

Vaishnavi More

B.Tech Computer Science and Technology

Shivaji University Kolhapur
