// src/transformation/transform.js
import fs from "fs";
import path from "path";
import { logInfo, logSuccess } from "../utils/logger.js";
import duckdb from "duckdb";
import dropDuplicates from "./dropDuplicates.js";
import dropMissingValues from "./dropMissingValues.js";
import detectOutliers from "./detectOutliers.js";
import enrichWithAverages from "./enrichWithAverages.js";
import flagAnomalies from "./flagAnomalies.js";
import normalizeValues from "./normalizeValues.js";

export default async function runTransformOnParquet() {
  const db = new duckdb.Database(":memory:");

  const rawDir = path.resolve("data/raw");
  const files = fs.readdirSync(rawDir).filter((f) => f.endsWith(".parquet"));

  if (files.length === 0) {
    logInfo("No .parquet files found in data/raw/");
    return;
  }

  const latestFile = files.sort().at(-1);
  const parquetPath = path.join(rawDir, latestFile);
  logInfo(`📦 Loading data from ${latestFile} using DuckDB`);

  const query = `SELECT * FROM parquet_scan('${parquetPath}')`;

  const rawData = await new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

  logInfo(`Loaded ${rawData.length} records from ${latestFile}`);

  const step1 = dropDuplicates(rawData);
  const step2 = dropMissingValues(step1);
  const step3 = detectOutliers(step2);
  const step4 = enrichWithAverages(step3);
  const step5 = flagAnomalies(step4);
  const step6 = normalizeValues(step5);

  const outputPath = path.resolve("data/processed/final_transformed.json");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  fs.writeFileSync(outputPath, JSON.stringify(step6, null, 2));
  logSuccess(`✅ Final transformed output saved to: final_transformed.json`);
}
