import fs from "fs";
import path from "path";
import { logInfo, logSuccess } from "../utils/logger.js";

import db from "../utils/db.js";

export default async function runValidationReport() {
  const inputPath = path.resolve("data/processed/final_transformed.json");
  const reportPath = path.resolve("data/processed/data_quality_report.csv");
  const gapReportPath = path.resolve("data/processed/time_gap_report.csv");

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });

  // Step 1: Load transformed data
  const createQuery = `
    DROP TABLE IF EXISTS transformed;
    CREATE TABLE transformed AS
    SELECT * FROM read_json_auto('${inputPath}');
  `;
  await db.execute(createQuery);
  logInfo("✅ Loaded transformed data into DuckDB");

  // Step 2: Generate data quality report
  const qualityQuery = `
    SELECT
      reading_type,
      COUNT(*) AS total_records,
      SUM(CASE WHEN value IS NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS percent_missing,
      SUM(CASE WHEN anomalous_reading = true THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS percent_anomalous
    FROM transformed
    GROUP BY reading_type
  `;
  const qualityResults = await db.execute(qualityQuery);

  const qualityHeader =
    "reading_type,total_records,percent_missing,percent_anomalous\n";
  const qualityRows = qualityResults
    .map(
      (r) =>
        `${r.reading_type},${r.total_records},${r.percent_missing.toFixed(
          2
        )},${r.percent_anomalous.toFixed(2)}`
    )
    .join("\n");

  fs.writeFileSync(reportPath, qualityHeader + qualityRows);
  logSuccess(`📊 Data quality report written to: ${reportPath}`);

  // Step 3: Detect time coverage gaps
  const gapQuery = `
      WITH sensor_times AS (
        SELECT sensor_id,
              CAST(MIN(timestamp) AS TIMESTAMP) AS min_ts,
              CAST(MAX(timestamp) AS TIMESTAMP) AS max_ts
        FROM transformed
        GROUP BY sensor_id
      ),
      expected_times AS (
        SELECT
          sensor_id,
          UNNEST(generate_series(min_ts, max_ts, INTERVAL 1 HOUR)) AS expected_ts
        FROM sensor_times
      ),
      actual_times AS (
        SELECT sensor_id, CAST(timestamp AS TIMESTAMP) AS actual_ts
        FROM transformed
      )
      SELECT
        e.sensor_id,
        COUNT(*) AS expected_hours,
        COUNT(a.actual_ts) AS actual_hours,
        (COUNT(*) - COUNT(a.actual_ts)) AS missing_hours,
        ROUND(100.0 * (COUNT(*) - COUNT(a.actual_ts)) / COUNT(*), 2) AS percent_missing
      FROM expected_times e
      LEFT JOIN actual_times a
        ON e.sensor_id = a.sensor_id AND e.expected_ts = a.actual_ts
      GROUP BY e.sensor_id;



  `;
  const gapResults = await db.execute(gapQuery);

  const gapHeader =
    "sensor_id,expected_hours,actual_hours,missing_hours,percent_missing\n";
  const gapRows = gapResults
    .map(
      (r) =>
        `${r.sensor_id},${r.expected_hours},${r.actual_hours},${r.missing_hours},${r.percent_missing}`
    )
    .join("\n");

  fs.writeFileSync(gapReportPath, gapHeader + gapRows);
  logSuccess(`⏱️ Time coverage gap report written to: ${gapReportPath}`);
}
