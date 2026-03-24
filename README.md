# 🔍 DataLens — AI Data Analysis & Insights Dashboard

> Upload a CSV. Instantly understand your data.

DataLens is a full-stack web application that allows users to upload CSV datasets and automatically receive data quality analysis, outlier detection, correlation insights, and interactive visualizations — all without writing a single line of code.

---

## 🚀 Live Demo

> _Coming soon / Add your deployed link here_

---

## 📸 Screenshots

> _Add screenshots of your dashboard here_

---

## ✨ Features

### ✅ Phase 1 – CSV Upload & Dataset Summary
- Upload CSV files through a clean web interface
- Instant summary: rows, columns, data types
- Missing value detection per column
- Duplicate row detection
- Basic statistical summary (mean, median, std, min, max)

### ✅ Phase 2 – Data Quality Analysis
- Automated data quality checks
- Outlier detection using the **IQR method**
- Data type identification for all columns
- Correlation matrix for numeric columns

### ✅ Phase 3 – Interactive Visualizations
- Column distribution charts (histograms & bar charts)
- Correlation heatmap
- Boxplots for outlier visualization
- Data quality summary tables

### 🔜 Phase 4 – AI-Powered Insights _(Upcoming)_
- Auto-detect strong correlations between variables
- Identify trends and patterns in data
- Plain-English insight generation

### 🔜 Phase 5 – Smart Data Cleaning Suggestions _(Upcoming)_
- Fill missing values (mean / median / mode)
- Remove duplicate rows
- Handle outliers
- Normalize numerical columns

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Chart.js / Recharts / Plotly, Axios |
| Backend | FastAPI (Python) |
| Data Processing | Pandas, NumPy |
| ML (Upcoming) | Scikit-learn |
| Database (Planned) | PostgreSQL / SQLite |

---

## 📁 Project Structure

```
datalens/
│
├── backend/
│   ├── main.py               # FastAPI app entry point
│   ├── analysis.py           # Data analysis logic
│   ├── requirements.txt      # Python dependencies
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Dashboard pages
│   │   └── App.jsx           # Root component
│   ├── package.json
│   └── README.md
│
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Python 3.9+
- Node.js 16+
- npm or yarn

---

### 🔧 Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn app.main:app --reload
```

Backend runs at: `http://localhost:8000`  
API Docs available at: `http://localhost:8000/docs`

---

### 💻 Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the React app
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## 📡 API Reference

### `POST /upload`

Upload a CSV file for analysis.

**Request:** `multipart/form-data` with a CSV file

**Response:**

```json
{
  "file_name": "dataset.csv",
  "rows": 1000,
  "columns": 8,
  "missing_values": {
    "age": 5,
    "salary": 2
  },
  "duplicate_rows": 3,
  "outliers": {
    "salary": 12
  },
  "correlation": {
    "age": {
      "salary": 0.62
    }
  }
}
```

---

## 🔄 How It Works

```
User uploads CSV
       ↓
React frontend sends file to API
       ↓
FastAPI backend receives the file
       ↓
Pandas performs analysis
       ↓
Backend returns JSON response
       ↓
React dashboard renders charts & insights
```

---

## 🗺️ Roadmap

- [x] CSV Upload & Dataset Summary
- [x] Data Quality Analysis
- [x] Interactive Visualizations
- [ ] AI-Powered Insight Generation
- [ ] Smart Data Cleaning Suggestions
- [ ] Excel file support
- [ ] Save datasets & results to database
- [ ] User authentication

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Your Name**  
[GitHub](https://github.com/yourusername) • [LinkedIn](https://linkedin.com/in/yourprofile)

---

> ⭐ If you found this project useful, consider giving it a star!