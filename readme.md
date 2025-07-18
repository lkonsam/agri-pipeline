# Agri Data Pipeline

This project implements a full-fledged data pipeline for agricultural IoT sensor data. It handles ingestion, transformation, quality validation, storage, and provides RESTful APIs to access analytics.

---

## ✨ Features

- Ingests `.parquet` sensor data files using DuckDB
- Modular transformation pipeline (cleaning, normalization, enrichment, anomaly detection)
- Validation reports: Data quality + time coverage gap
- Stores cleaned data in DuckDB warehouse
- REST API endpoints for analytics
- Cron-based scheduled ingestion
- Dockerized for easy deployment

---

## 📁 Folder Structure

```
project-root/
├── src/
│   ├── ingestion/             # Ingestion logic
│   ├── transformation/        # Data cleaning, enriching modules
│   ├── validation/            # Reports and checks
│   ├── routes/                # API routing
│   ├── controllers/           # API controllers
│   ├── utils/                 # Logger, DB helpers, etc
├── data/                      # Raw, processed, warehouse data
├── Dockerfile                 # Docker setup
├── .dockerignore
├── .env                       # Environment config
├── package.json
├── README.md
```

---

## 🚀 Getting Started

### ✍️ Prerequisites

- Node.js (>=18)
- Docker Desktop (Windows/Linux/Mac)
- Git

---

### ὜3️ Clone & Install

```bash
git clone https://github.com/lkonsam/agri-pipeline.git
cd agri-pipeline
npm install
```

---

### ♻️ Run with Docker

1. **Create a `.env` file** at project root:

```
PORT=3000
NODE_ENV=production
```

2. **Build and run Docker**:

```bash
docker build -t agri-pipeline .
docker run -p 3000:3000 agri-pipeline
```

---

### 🌐 API Usage via Postman

Import the following requests:
-- postmanCollection.json on the root folder

### ⏰ Cron-Based Ingestion

- Configured using `node-cron`
- Adjust schedule in `src/scheduler.js`
- Default: runs every 5 minutes for production

---

### 📊 Reports

- Data Quality Report: `data/processed/data_quality_report.csv`
- Time Gap Report: `data/processed/time_gap_report.csv`

---

## 🛠️ Development

```bash
npm run dev     # Start with nodemon
```

---

## 🎉 Author

- Created by Konsam Malemngalba Singh
- Guided by Crio.Do project specification

---

## ✉️ License

MIT License
