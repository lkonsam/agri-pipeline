import duckdb from "duckdb";
import fs from "fs";
import path from "path";
import { logError, logInfo, logSuccess } from "../utils/logger.js";
import db from "../utils/db.js";

export default async function saveToWarehouse() {
  const warehouseDir = path.resolve("data/warehouse");
  const dbPath = path.join(warehouseDir, "agri_data.duckdb");
  const inputPath = path.resolve("data/processed/final_transformed.json");

  try {
    // Ensure directories exist
    fs.mkdirSync(warehouseDir, { recursive: true });

    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file not found: ${inputPath}`);
    }

    logInfo(`💾 Saving data to warehouse at ${dbPath}`);

    // Step 1: Create table schema
    const setupQuery = `
      DROP TABLE IF EXISTS readings;
      CREATE TABLE readings AS
      SELECT * FROM read_json_auto('${inputPath}');
      
      CREATE INDEX IF NOT EXISTS idx_sensor_id ON readings(sensor_id);
      CREATE INDEX IF NOT EXISTS idx_timestamp ON readings(timestamp);
    `;

    await db.execute(setupQuery, dbPath);

    // Verify data was loaded
    const countQuery = "SELECT COUNT(*) as count FROM readings";
    const result = await db.execute(countQuery, dbPath);
    const recordCount = result[0]?.count || 0;

    logSuccess(`✅ Successfully saved ${recordCount} records to warehouse`);
  } catch (err) {
    logError(`❌ Failed to save to warehouse: ${err.message}`);
    throw err;
  }
}
