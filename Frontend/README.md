<!-- # React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project. -->

# CSV Analytics Tool

A full-stack tool to analyze CSV files **without a database**, built using **React**, **FastAPI**, and **Pandas**. This project helps you quickly explore CSV datasets, detect missing values, duplicates, outliers, and get basic statistics.

---

## 🚀 Features

- Upload any CSV file and preview its contents
- Detect **missing values** per column
- Identify **duplicate rows**
- View **basic statistics** (mean, median, std, etc.)
- Detect **outliers** in numeric columns
- Returns JSON-ready data for frontend consumption

---

## 🛠️ Tech Stack

- **Frontend:** React.js  
- **Backend:** FastAPI (Python)  
- **Data Analysis:** Pandas, NumPy  
- **Others:** CORS handling, file upload APIs

---

## 💻 Installation

### Backend

```bash
# Create virtual environment
python -m venv venv
# Activate virtual environment
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn pandas numpy python-multipart

# Run the server
uvicorn app.main:app --reload

```

# CSV Analytics Backend

## Overview
Backend project using **FastAPI (Python)** to analyze CSV files without a database.  
Data Analysis is done with **Pandas** and **NumPy**.  
Purpose: Upload CSV, analyze missing values, duplicates, outliers, basic statistics, and return **JSON responses**.

## Current Features Implemented
- CSV file upload and reading
- Preview first few rows of CSV
- Counting missing values per column
- Counting duplicate rows
- Basic statistics: mean, median, std, min, max
- Outlier detection (numeric columns using IQR method)
- JSON-safe responses
- CORS enabled for API calls

## Known Issues / Errors
- Extreme float values can cause JSON serialization errors
- Large CSV files may need chunking or lazy loading

## Tech Stack
- **FastAPI**
- **Pandas**, **NumPy**
- **Python 3.10**
- **Uvicorn** server

## Folder Structure
```bash
backend/
│
├─ app/
│ ├─ main.py # FastAPI app entry point
│ ├─ routes/
│ │ └─ csv_routes.py # API routes for CSV upload & analysis
│ ├─ services/
│ │ └─ csv_service.py # CSV processing and analysis logic
│ ├─ models/ # (Optional) Pydantic models if needed
│ └─ utils/ # Helper functions (e.g., outlier detection)
│
├─ venv/ # Virtual environment
├─ requirements.txt # Project dependencies
└─ README.md # Project documentation
```

## Next Steps / Future Improvements
- Handle missing values automatically (fill, drop, or impute)
- Remove or flag outliers more efficiently
- Add data cleaning options for duplicates, wrong formats, or inconsistent data
- Support for very large CSV files using streaming or chunking
- Advanced column profiling (unique values, categorical summaries)
- Improve error handling for JSON serialization issues
- Export cleaned/processed CSV

---

> This project is designed as a **backend-focused CSV analytics tool** to showcase skills in FastAPI, Python data processing, and API development. Future enhancements aim to improve robustness, scalability, and data handling capabilities.