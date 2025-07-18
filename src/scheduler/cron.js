// src/scheduler/cron.js
import cron from "node-cron";
import ingestParquetFiles from "../ingestion/ingest.js";
import runTransformOnParquet from "../transformation/transform.js";
import runValidationReport from "../validation/validate.js";
import { logInfo } from "../utils/logger.js";
import saveToWarehouse from "../storage/saveToWarehouse.js";
import config from "../../config/config.js";

async function runPipeline() {
  logInfo("🧪 Running scheduled pipeline...");

  try {
    await ingestParquetFiles();
    await runTransformOnParquet();
    await runValidationReport();
    await saveToWarehouse();
    logInfo("✅ Scheduled pipeline complete.");
  } catch (err) {
    console.error("❌ Pipeline failed:", err);
  }
}

if (config.env === "development") {
  const intervals = ["0", "10", "20", "30", "40", "50"]; // every 10 seconds
  intervals.forEach((sec) => {
    cron.schedule(`${sec} * * * * *`, runPipeline);
  });
} else {
  cron.schedule("*/5 * * * *", runPipeline); // every 5 minutes in production
}
