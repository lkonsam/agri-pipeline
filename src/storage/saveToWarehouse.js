import fs from "fs";
import path from "path";
import { logError, logInfo, logSuccess } from "../utils/logger.js";
import db from "../utils/db.js";
import { getCheckpoint, updateCheckpoint } from "../utils/checkpoint.js";

export default async function saveToWarehouse() {
  const warehouseDir = path.resolve("data/warehouse");
  const dbPath = path.join(warehouseDir, "agri_data.duckdb");
  const inputPath = path.resolve("data/processed/final_transformed.json");

  try {
    fs.mkdirSync(warehouseDir, { recursive: true });

    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file not found: ${inputPath}`);
    }

    const fileStat = fs.statSync(inputPath);
    const fileModifiedTime = fileStat.mtimeMs;

    const lastSaved = getCheckpoint("lastWarehoused");
    if (lastSaved && Number(lastSaved) === fileModifiedTime) {
      logInfo("⚠️ Data already saved to warehouse. Skipping...");
      return;
    }

    logInfo(`💾 Saving data to warehouse at ${dbPath}`);

    const setupQuery = `
      DROP TABLE IF EXISTS readings;
      CREATE TABLE readings AS
      SELECT * FROM read_json_auto('${inputPath}');

      CREATE INDEX IF NOT EXISTS idx_sensor_id ON readings(sensor_id);
      CREATE INDEX IF NOT EXISTS idx_timestamp ON readings(timestamp);
    `;

    await db.execute(setupQuery, dbPath);

    const countQuery = "SELECT COUNT(*) as count FROM readings";
    const result = await db.execute(countQuery, dbPath);
    const recordCount = result[0]?.count || 0;

    updateCheckpoint("lastWarehoused", fileModifiedTime);

    logSuccess(`✅ Successfully saved ${recordCount} records to warehouse`);
  } catch (err) {
    logError(`❌ Failed to save to warehouse: ${err.message}`);
    throw err;
  }
}
