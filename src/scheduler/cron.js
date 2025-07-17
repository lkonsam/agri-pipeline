// src/scheduler/cron.js
import cron from "node-cron";
import ingestParquetFiles from "../ingestion/ingest.js";
import runTransformOnParquet from "../transformation/transform.js";
import runValidationReport from "../validation/validate.js";
import { logInfo } from "../utils/logger.js";
import saveToWarehouse from "../storage/saveToWarehouse.js";

// Schedule every 1 hour: You can change to */5 * * * * for every 5 minutes (for testing)
cron.schedule("*/5 * * * *", async () => {
  logInfo("🕒 Running scheduled pipeline...");

  try {
    await ingestParquetFiles();
    await runTransformOnParquet();
    await runValidationReport();
    await saveToWarehouse();
    logInfo("✅ Scheduled pipeline complete.");
  } catch (err) {
    console.error("❌ Scheduled pipeline failed:", err);
  }
});
