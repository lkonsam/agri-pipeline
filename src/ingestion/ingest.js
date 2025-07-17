// src/ingestion/ingest.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { getCheckpoint, updateCheckpoint } from "../utils/checkpoint.js";
import { logInfo, logSuccess, logError } from "../utils/logger.js";

import db from "../utils/db.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function ingestParquetFiles() {
  const rawDir = path.resolve(__dirname, "../../data/raw");
  const files = fs
    .readdirSync(rawDir)
    .filter((f) => f.endsWith(".parquet"))
    .sort();

  const lastCheckpoint = getCheckpoint();
  let startIndex = lastCheckpoint ? files.indexOf(lastCheckpoint) + 1 : 0;

  if (startIndex >= files.length) {
    logInfo("No new files to ingest.");
    return;
  }

  let filesRead = 0,
    recordsProcessed = 0,
    recordsFailed = 0;

  for (let i = startIndex; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(rawDir, file);

    logInfo(`📦 Ingesting: ${file}`);

    try {
      const totalQuery = `SELECT COUNT(*) as total FROM parquet_scan('${filePath}');`;
      const invalidQuery = `
        SELECT COUNT(*) as invalid_count
        FROM parquet_scan('${filePath}')
        WHERE sensor_id IS NULL OR timestamp IS NULL
          OR reading_type IS NULL OR value IS NULL
          OR battery_level IS NULL
      `;

      const total = await db.execute(totalQuery);
      const invalid = await db.execute(invalidQuery);

      recordsProcessed += Number(total[0].total);
      recordsFailed += Number(invalid[0].invalid_count);
      filesRead++;

      logSuccess(
        `📈 Records processed: ${total[0].total}, Invalid: ${invalid[0].invalid_count}`
      );
      updateCheckpoint(file);
    } catch (err) {
      logError(`❌ Failed to ingest ${file}: ${err.message}`);
      recordsFailed++;
      continue;
    }
  }

  logInfo(
    `📊 Ingestion Summary → Files: ${filesRead}, Processed: ${recordsProcessed}, Failed: ${recordsFailed}`
  );
}
